// Lokasi file: src/services/mqtt/mqttService.ts

import mqtt, { MqttClient, IClientOptions } from "mqtt";

type MessageHandler = (payload: Buffer) => void;
export type ConnectionStatus = "Connected" | "Disconnected" | "Error" | "Connecting";

class MqttService {
  private client!: MqttClient;
  private topicHandlers: Map<string, Set<MessageHandler>>;
  private status: ConnectionStatus = "Connecting";
  private mqttUrl: string;

  private onConnectCallback?: () => void;
  private onCloseCallback?: () => void;
  private onErrorCallback?: (err: Error) => void;
  private onReconnectCallback?: () => void;
  private onOfflineCallback?: () => void;

  constructor() {
    this.topicHandlers = new Map();
    this.mqttUrl = process.env.NEXT_PUBLIC_MQTT_URL!;

    if (!this.mqttUrl) {
      throw new Error("NEXT_PUBLIC_MQTT_URL is not defined in your .env file");
    }
    this.initializeClient();
  }
  
  private initializeClient() {
    const options: IClientOptions = {
      clientId: `resonac_web_client_${Math.random().toString(16).substr(2, 8)}`,
      reconnectPeriod: 5000,
      connectTimeout: 10_000,
      clean: true,
    };

    console.log(`Initializing new MQTT client for ${this.mqttUrl} with ID: ${options.clientId}`);
    this.client = mqtt.connect(this.mqttUrl, options);

    // Listener "message" adalah inti dari service ini, jangan pernah dihapus di luar dari
    // proses pembuatan client baru.
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
    this.onConnectCallback = onConnect;
    this.onCloseCallback = onClose;
    this.onErrorCallback = onError;
    this.onReconnectCallback = onReconnect;
    this.onOfflineCallback = onOffline;
    this.attachListeners();
  }
  
  private attachListeners() {
    this.cleanupListeners(); 

    this.client.on("connect", () => {
      console.log("✅ MQTT Connected!");
      this.status = "Connected";

      console.log("Attempting to re-subscribe to all known topics...");
      if (this.topicHandlers.size > 0) {
        this.topicHandlers.forEach((_, topic) => {
          this.client.subscribe(topic, (err) => {
            if (err) {
              console.error(`[Resubscribe] Failed for topic: ${topic}`, err);
            } else {
              console.log(`[Resubscribe] Success for topic: ${topic}`);
            }
          });
        });
      }

      if (this.onConnectCallback) this.onConnectCallback();
    });
    this.client.on("close", () => {
      console.warn(" MQTT Connection Closed.");
      this.status = "Disconnected";
      if (this.onCloseCallback) this.onCloseCallback();
    });
    this.client.on("error", (err) => {
      console.error("❌ MQTT Connection Error:", err);
      this.status = "Error";
      if (this.onErrorCallback) this.onErrorCallback(err);
    });
    this.client.on("reconnect", () => {
      console.log("🔄 MQTT Reconnecting...");
      this.status = "Connecting";
      if (this.onReconnectCallback) this.onReconnectCallback();
    });
    this.client.on("offline", () => {
      console.warn(" MQTT Client is Offline.");
      this.status = "Disconnected";
      if (this.onOfflineCallback) this.onOfflineCallback();
    });
  }

  // 👇 PERBAIKAN KRITIS DI SINI
  public cleanupListeners() {
    if (this.client) {
      // Hapus hanya listener yang berhubungan dengan status koneksi,
      // JANGAN sentuh listener 'message'.
      this.client.removeAllListeners("connect");
      this.client.removeAllListeners("close");
      this.client.removeAllListeners("error");
      this.client.removeAllListeners("reconnect");
      this.client.removeAllListeners("offline");
    }
  }
  
  public manualReconnect() {
    console.log("Forcing full reconnect: destroying old client and creating a new one.");
    if (this.client) {
      this.client.end(true, () => {
        console.log("Old client terminated.");
        this.initializeClient();
        this.attachListeners();
      });
    } else {
      this.initializeClient();
      this.attachListeners();
    }
  }

  public getStatus(): ConnectionStatus {
    return this.status;
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
    console.log("Disconnecting MQTT client permanently.");
    if (this.client) {
        this.client.end(true);
    }
  }

  public publish(topic: string, message: string | object, options?: mqtt.IClientPublishOptions) {
    if (!this.client || this.status !== "Connected") {
      console.warn("⚠️ MQTT not connected. Cannot publish message.");
      return;
    }

    const payload = typeof message === "object" ? JSON.stringify(message) : message;

    this.client.publish(topic, payload, options || { qos: 0, retain: false }, (err) => {
      if (err) {
        console.error("❌ Failed to publish message:", err);
      } else {
        console.log(`📤 Message published to ${topic}:`, payload);
      }
    });
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