# Mosquito 🌡️

Progetto IoT basato su **ESP32** che misura
**temperatura e umidità** e le invia in realtime
a una dashboard **React** tramite **MQTT (HiveMQ)**.

---

## 🧱 Architettura generale

[DHT11] → ESP32 → MQTT (HiveMQ Cloud) → React Dashboard
│
OLED SSD1306

## 🔌 Hardware utilizzato

- ESP32 DOIT DevKit V1
- Sensore DHT11
- Display OLED SSD1306 (I²C)

### Collegamenti

**DHT11**

- DATA → GPIO 4
- VCC → 3.3V
- GND → GND

**OLED SSD1306**

- SDA → GPIO 21
- SCL → GPIO 22
- VCC → 3.3V
- GND → GND

---

## 📡 MQTT

- **Broker:** HiveMQ Cloud
- **Protocollo:** MQTT over TLS
- **Trasporto frontend:** WebSocket Secure (WSS)

## 🖥️ Frontend React

-React + Vite
-Libreria mqtt.js
-Connessione MQTT tramite WebSocket Secure
-Aggiornamento realtime senza polling
-Dashboard minimale con visualizzazione numerica

## 📦 Struttura del repository

mosquito/
├─ esp32/ # Firmware ESP32 (PlatformIO)
│ ├─ src/
│ │ └─ main.cpp
│ ├─ include/
│ ├─ lib/
│ ├─ test/
│ └─ platformio.ini
│
├─ frontend/ # Dashboard React (Vite)
│ ├─ src/
│ ├─ public/
│ ├─ package.json
│ ├─ package-lock.json
│ └─ vite.config.js
│
├─ README.md
└─ .gitignore
