import mqtt, { MqttClient } from "mqtt";

class MqttService {
  private client: MqttClient;

  constructor() {
     const mqttUrl = process.env.NEXT_PUBLIC_MQTT_URL;

    if (!mqttUrl) {
      // Hentikan eksekusi dan berikan pesan yang jelas
      throw new Error("NEXT_PUBLIC_MQTT_URL is not defined in your .env file");
    }

    this.client = mqtt.connect(mqttUrl);
  }

  public connect(
    onConnect: () => void,
    onClose: () => void,
    onError: (err: Error) => void
  ) {
    this.client.on("connect", onConnect);
    this.client.on("close", onClose);
    this.client.on("error", onError);
  }

  public subscribe(topic: string, onMessage: (topic: string, payload: Buffer) => void) {
    this.client.subscribe(topic, (err) => {
      if (err) {
        console.error(`Failed to subscribe to topic ${topic}`, err);
      }
    });
    
    this.client.on("message", onMessage);
  }

  public disconnect() {
    this.client.end(true);
  }
}

// Ekspor sebagai singleton instance agar hanya ada satu koneksi di seluruh aplikasi
const mqttService = new MqttService();
export default mqttService;