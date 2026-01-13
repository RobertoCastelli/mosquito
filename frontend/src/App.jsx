import { useEffect, useState } from "react";
import mqtt from "mqtt";
import "./App.css";

function App() {
  const [temp, setTemp] = useState("--");
  const [hum, setHum] = useState("--");
  const [status, setStatus] = useState("disconnesso");

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
      setStatus("connesso");
      client.subscribe("esp32/sensori/ambienti");
    });

    client.on("message", (_, message) => {
      const data = JSON.parse(message.toString());
      setTemp(data.temp);
      setHum(data.hum);
    });

    client.on("close", () => setStatus("disconnesso"));

    return () => client.end();
  }, []);

  return (
    <div className="container">
      <h2>Mosquito</h2>
      <p>esp32</p>

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

      <p className="status">
        MQTT: <strong>{status}</strong>
      </p>
    </div>
  );
}

export default App;
