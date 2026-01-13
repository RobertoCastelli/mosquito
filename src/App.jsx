import { useEffect } from "react";
import mqtt from "mqtt";

function App() {
  useEffect(() => {
    // Connessione al broker MQTT pubblico (via WebSocket)
    const client = mqtt.connect(
      "wss://ddbf357d636f42e79161fbac7afd5a74.s1.eu.hivemq.cloud:8884/mqtt",
      {
        username: import.meta.env.VITE_MQTT_USER,
        password: import.meta.env.VITE_MQTT_PASSWORD,
      }
    );

    client.on("connect", () => {
      console.log("MQTT connesso");

      client.subscribe("esp32/sensori/#", (err) => {
        if (err) {
          console.error("Errore subscribe:", err);
        } else {
          console.log("Subscribe OK");
        }
      });
    });

    client.on("message", (topic, message) => {
      console.log("ESP32 - Dati Ricevuti: ", topic, message.toString());
    });

    client.on("error", (err) => {
      console.error("MQTT error:", err);
    });

    return () => {
      client.end();
    };
  }, []);
}

export default App;
