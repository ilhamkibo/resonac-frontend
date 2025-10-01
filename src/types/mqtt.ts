// --- Tipe untuk Data Realtime ---

// Tipe untuk data motor (bisa untuk 'main' dan 'pilot' karena strukturnya sama)
export type MotorMetrics = {
  ampere_r: number;
  ampere_s: number;
  ampere_t: number;
  volt_r: number;
  volt_s: number;
  volt_t: number;
  pf: number;
  kwh: number;
  oil_pressure: number;
};

// Tipe untuk data oli
export type OilData = {
  temperature: number;
};

// Tipe gabungan untuk semua data realtime
export type RealtimeData = {
  main: MotorMetrics;
  pilot: MotorMetrics;
  oil: OilData;
};


// --- Tipe untuk Data Logs ---

// Tipe untuk satu entri log ampere
export type AmpereLogEntry = {
  time: string; // ISO 8601 date string
  main: {
    r: number;
    s: number;
    t: number;
  };
  pilot: {
    r: number;
    s: number;
    t: number;
  };
};

// Tipe untuk satu entri log tekanan oli
export type OilPressureLogEntry = {
  time: string; // ISO 8601 date string
  main: number;
  pilot: number;
};

// Tipe untuk satu entri log temperatur oli
export type OilTempLogEntry = {
  time: string; // ISO 8601 date string
  value: number;
};

// Tipe gabungan untuk semua data logs
export type LogsData = {
  ampere: AmpereLogEntry[];
  oil_pressure: OilPressureLogEntry[];
  oil_temp: OilTempLogEntry[];
};


// --- Tipe Utama untuk Keseluruhan Payload ---

export type MqttPayload = {
  realtime: RealtimeData;
  logs: LogsData;
};