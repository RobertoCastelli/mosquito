import { useEffect, useState } from "react";
import mqtt from "mqtt";

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
    <div style={styles.container}>
      <h1>🌡️ Mosquito – ESP32</h1>

      <div style={styles.card}>
        <div>
          <p style={styles.label}>Temperatura</p>
          <p style={styles.value}>{temp} °C</p>
        </div>

        <div>
          <p style={styles.label}>Umidità</p>
          <p style={styles.value}>{hum} %</p>
        </div>
      </div>

      <p style={styles.status}>
        MQTT: <strong>{status}</strong>
      </p>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "sans-serif",
    padding: 30,
    maxWidth: 400,
    margin: "auto",
    textAlign: "center",
  },
  card: {
    display: "flex",
    justifyContent: "space-around",
    padding: 20,
    borderRadius: 12,
    background: "#f4f4f4",
    marginTop: 20,
  },
  label: {
    fontSize: 14,
    color: "#666",
  },
  value: {
    fontSize: 32,
    fontWeight: "bold",
  },
  status: {
    marginTop: 20,
    fontSize: 14,
    color: "#333",
  },
};

export default App;
