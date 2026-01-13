
#include <Arduino.h>
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>

#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#include <DHT.h>

/* =======================
WIFI
======================= */
const char* ssid = "iliadbox-2C2EA5";
const char* password = "4z2m2qf57nq6nh3xqszsk3";

/* =======================
   MQTT HiveMQ
======================= */
const char* mqtt_server = "ddbf357d636f42e79161fbac7afd5a74.s1.eu.hivemq.cloud";
const int mqtt_port = 8883;
const char* mqtt_user = "Shaco";
const char* mqtt_pass = "Hive77!!!";

/* =======================
   DHT11
======================= */
#define DHTPIN 4
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

/* =======================
   OLED SSD1306
======================= */
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

/* =======================
   MQTT Client
======================= */
WiFiClientSecure espClient;
PubSubClient client(espClient);

/* =======================
   MQTT reconnect
======================= */
void reconnect() {
  while (!client.connected()) {
    Serial.print("Connessione MQTT...");
    if (client.connect("ESP32_DHT11", mqtt_user, mqtt_pass)) {
      Serial.println("OK");
    } else {
      Serial.print("fallita, rc=");
      Serial.println(client.state());
      delay(2000);
    }
  }
}

void setup() {
  Serial.begin(115200);

  /* WIFI */
  WiFi.begin(ssid, password);
  Serial.print("Connessione WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connesso");
  Serial.println(WiFi.localIP());

  /* DHT */
  dht.begin();

  /* OLED */
  Wire.begin(21, 22);
  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println("OLED non trovato");
    while (true);
  }
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);

  /* MQTT */
  espClient.setInsecure(); // ok per test
  client.setServer(mqtt_server, mqtt_port);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  float hum = dht.readHumidity();
  float temp = dht.readTemperature();

  if (isnan(hum) || isnan(temp)) {
    Serial.println("Errore lettura DHT");
    delay(2000);
    return;
  }

  /* ===== OLED UPDATE ===== */
  display.clearDisplay();
  display.setCursor(0, 0);

  display.print("Temp: ");
  display.print(temp);
  display.println(" C");

  display.print("Hum:  ");
  display.print(hum);
  display.println(" %");

  display.display();

  /* ===== MQTT JSON ===== */
  char payload[64];
  snprintf(payload, sizeof(payload),
           "{\"temp\": %.1f, \"hum\": %.1f}",
           temp, hum);

  bool ok = client.publish("esp32/sensori/ambienti", payload);

  Serial.println(payload);
  Serial.print("MQTT publish: ");
  Serial.println(ok ? "OK" : "FAIL");

  delay(5000); // aggiornamento ogni 5 secondi
}
