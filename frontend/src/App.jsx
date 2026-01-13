import { useEffect, useState } from "react";
import mqtt from "mqtt";

function App() {
  const [temp, setTemp] = useState(null);
  const [hum, setHum] = useState(null);

  useEffect(() => {
    const client = mqtt.connect(
      "wss://ddbf357d636f42e79161fbac7afd5a74.s1.eu.hivemq.cloud:8884/mqtt",
      {
        username: import.meta.env.VITE_MQTT_USER,
        password: import.meta.env.VITE_MQTT_PASS,
      }
    );

    client.on("connect", () => {
      console.log("MQTT connesso");
      client.subscribe("esp32/sensori/ambienti");
    });

    client.on("message", (topic, message) => {
      const data = JSON.parse(message.toString());
      setTemp(data.temp);
      setHum(data.hum);
    });

    return () => {
      client.end();
    };
  }, []);

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1>🌡️ Sensori ESP32</h1>

      <div style={{ fontSize: 24 }}>
        <p>Temperatura: {temp ?? "--"} °C</p>
        <p>Umidità: {hum ?? "--"} %</p>
      </div>
    </div>
  );
}

export default App;
