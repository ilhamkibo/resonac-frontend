export interface MeasurementData {
  id: number;
  timestamp: string;
  area: string;
  ampere_rs: number;
  ampere_st: number;
  ampere_tr: number;
  volt_rs: number;
  volt_st: number;
  volt_tr: number;
  pf: number;
  kwh: number;
  oil_pressure: number;
  oil_temperature: number;
}
