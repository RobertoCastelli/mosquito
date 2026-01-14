import { useEffect, useState } from "react";
import mqtt from "mqtt";
import "./App.css";

function App() {
  const [temp, setTemp] = useState("--");
  const [hum, setHum] = useState("--");
  const [mqttStatus, setmqttStatus] = useState("disconnesso");
  const [esp32Status, setEsp32Status] = useState("offline");

  useEffect(() => {
    const client = mqtt.connect(
      "wss://ddbf357d636f42e79161fbac7afd5a74.s1.eu.hivemq.cloud:8884/mqtt",
      {
        username: import.meta.env.VITE_MQTT_USER,
        password: import.meta.env.VITE_MQTT_PASSWORD,
        reconnectPeriod: 2000,
      }
    );

    client.on("connect", () => {
      setmqttStatus("connesso");
      client.subscribe("esp32/sensori/ambienti");
      client.subscribe("esp32/status");
    });

    client.on("message", (topic, message) => {
      if (topic === "esp32/status") {
        setEsp32Status(message.toString());
        return;
      }

      if (topic === "esp32/sensori/ambienti") {
        const data = JSON.parse(message.toString());
        setTemp(data.temp);
        setHum(data.hum);
      }
    });

    client.on("close", () => setmqttStatus("disconnesso"));

    return () => client.end();
  }, []);

  return (
    <div className="container">
      <h2>Mosquito</h2>

      <div className="card">
        <div>
          <p className="label">Temperatura</p>
          <p className="value">{temp} °C</p>
        </div>

        <div>
          <p className="label">Umidità</p>
          <p className="value">{hum} %</p>
        </div>
      </div>

      <h4 className="status ">
        <div>MQTT: {mqttStatus}</div>
        <div>ESP32: {esp32Status}</div>
      </h4>
    </div>
  );
}

export default App;
