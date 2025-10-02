import mqtt, { MqttClient } from "mqtt";

// Ini adalah "nama alias" untuk tipe fungsi agar kode lebih bersih.
type MessageHandler = (payload: Buffer) => void;

//mqtt service class to handle connection
class MqttService {
  private client: MqttClient;
  private topicHandlers: Map<string, Set<MessageHandler>>;

  constructor() {
    this.topicHandlers = new Map();
    const mqttUrl = process.env.NEXT_PUBLIC_MQTT_URL;

    if (!mqttUrl) {
      throw new Error("NEXT_PUBLIC_MQTT_URL is not defined in your .env file");
    }

    this.client = mqtt.connect(mqttUrl);

    // ✅ Daftarkan SATU listener global yang berfungsi sebagai router
    this.client.on("message", (topic, payload) => {
      // Dapatkan semua handler untuk topik yang masuk
      const handlers = this.topicHandlers.get(topic);
      if (handlers) {
        // Panggil setiap handler yang terdaftar untuk topik ini
        handlers.forEach(handler => handler(payload));
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
  public subscribe(topic: string, onMessage: MessageHandler) {

    if (!this.topicHandlers.has(topic)) {
      this.topicHandlers.set(topic, new Set());
    }
    
    this.topicHandlers.get(topic)?.add(onMessage);

    this.client.subscribe(topic, (err) => {
      if (err) {
        console.error(`Failed to subscribe to topic ${topic}`, err);
        return;
      }
    });
  }
  
  public unsubscribe(topic: string, onMessage: MessageHandler) {
    const handlers = this.topicHandlers.get(topic);
    if (handlers) {
      // Hapus handler spesifik dari Set
      handlers.delete(onMessage);

      // Jika tidak ada lagi handler yang tersisa untuk topik ini,
      // kita bisa unsubscribe dari broker MQTT untuk efisiensi.
      if (handlers.size === 0) {
        this.topicHandlers.delete(topic);
        this.client.unsubscribe(topic);
      }
    }
  }
  
  public disconnect() {
    this.client.end(true);
  }
}

// ✅ Pola Singleton yang lebih aman untuk Next.js HMR
const globalForMqtt = globalThis as unknown as {
  mqttService: MqttService | undefined;
};

const mqttService = globalForMqtt.mqttService ?? new MqttService();

if (process.env.NODE_ENV !== "production") {
  globalForMqtt.mqttService = mqttService;
}

export default mqttService;