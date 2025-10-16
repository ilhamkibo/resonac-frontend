
import mqtt, { MqttClient } from "mqtt";

type MessageHandler = (payload: Buffer) => void;

class MqttService {
  private client: MqttClient;
  private topicHandlers: Map<string, Set<MessageHandler>>;

  constructor() {
    this.topicHandlers = new Map();
    const mqttUrl = process.env.NEXT_PUBLIC_MQTT_URL;

    if (!mqttUrl) {
      throw new Error("NEXT_PUBLIC_MQTT_URL is not defined in your .env file");
    }

    this.client = mqtt.connect(mqttUrl, {
      reconnectPeriod: 5000, // coba reconnect setiap 5 detik
      connectTimeout: 30_000,
      clean: true,
    });

    // Router pesan
    this.client.on("message", (topic, payload) => {
      const handlers = this.topicHandlers.get(topic);
      if (handlers) {
        handlers.forEach((handler) => handler(payload));
      }
    });
  }

  public connect(
    onConnect: () => void,
    onClose: () => void,
    onError: (err: Error) => void,
    onReconnect?: () => void,
    onOffline?: () => void
  ) {
    this.client.on("connect", onConnect);
    this.client.on("close", onClose);
    this.client.on("error", onError);

    // ✅ Tambahan penting agar reconnect status bisa diketahui
    this.client.on("reconnect", () => {
      console.log("MQTT trying to reconnect...");
      if (onReconnect) onReconnect();
    });

    this.client.on("offline", () => {
      console.warn("MQTT is offline");
      if (onOffline) onOffline();
    });
  }

  public subscribe(topic: string, onMessage: MessageHandler) {
    if (!this.topicHandlers.has(topic)) {
      this.topicHandlers.set(topic, new Set());
    }

    this.topicHandlers.get(topic)?.add(onMessage);

    this.client.subscribe(topic, (err) => {
      if (err) {
        console.error(`Failed to subscribe to topic ${topic}`, err);
      }
    });
  }

  public unsubscribe(topic: string, onMessage: MessageHandler) {
    const handlers = this.topicHandlers.get(topic);
    if (handlers) {
      handlers.delete(onMessage);
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

const globalForMqtt = globalThis as unknown as {
  mqttService: MqttService | undefined;
};

const mqttService = globalForMqtt.mqttService ?? new MqttService();

if (process.env.NODE_ENV !== "production") {
  globalForMqtt.mqttService = mqttService;
}

export default mqttService;