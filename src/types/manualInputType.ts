/**
 * Mewakili satu baris data yang sudah di-transform (flat)
 * untuk ditampilkan di HistoryTable.
 */
export type Row = {
  id: string;
  time: string;           // Timestamp yang sudah diformat
  operatorName: string;   // Nama user (atau "User {id}")
  mainR: number;
  mainS: number;
  mainT: number;
  oilPressMain: number;
  pilotR: number;
  pilotS: number;
  pilotT: number;
  oilPressPilot: number;
  oilTemp: number;
};