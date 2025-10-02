import mqtt, { MqttClient } from "mqtt";

class MqttService {
  private client: MqttClient;
  // ✅ Simpan callbacks spesifik topik di sini
  private topicHandlers: Map<string, (payload: Buffer) => void>;

  constructor() {
    this.topicHandlers = new Map();
    const mqttUrl = process.env.NEXT_PUBLIC_MQTT_URL;

    if (!mqttUrl) {
      throw new Error("NEXT_PUBLIC_MQTT_URL is not defined in your .env file");
    }

    this.client = mqtt.connect(mqttUrl);

    // ✅ Daftarkan SATU listener global yang berfungsi sebagai router
    this.client.on("message", (topic, payload) => {
      // Cari handler yang sesuai dengan topik yang masuk
      const handler = this.topicHandlers.get(topic);
      if (handler) {
        // Jika ada, panggil handler tersebut dengan payload-nya
        handler(payload);
      } else {
        console.warn(`No handler for topic: ${topic}`);
      }
    });
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

  // ✅ Metode subscribe sekarang hanya mendaftarkan topik dan menyimpan handler-nya
  public subscribe(topic: string, onMessage: (payload: Buffer) => void) {
    this.client.subscribe(topic, (err) => {
      if (err) {
        console.error(`Failed to subscribe to topic ${topic}`, err);
        return;
      }
      // Simpan handler untuk topik ini di Map kita
      this.topicHandlers.set(topic, onMessage);
    });
  }

  public disconnect() {
    this.client.end(true);
  }
}

const mqttService = new MqttService();
export default mqttService;