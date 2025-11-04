// types/apiTypes.ts

/**
 * Mewakili 1 objek di dalam array 'details' dari API.
 * (Data nested untuk 'main', 'pilot', atau 'oil')
 */
export interface ManualInputDetail {
  id: string;
  manualInputId: string;
  area: "main" | "pilot" | "oil";
  ampere_r: number | null;
  ampere_s: number | null;
  ampere_t: number | null;
  volt_r: number | null;
  volt_s: number | null;
  volt_t: number | null;
  pf: number | null;
  kwh: number | null;
  oil_pressure: number | null;
  oil_temperature: number | null;
}

/**
 * Mewakili 1 data input (objek utama di array 'data.data')
 */
export interface ManualInputRecord {
  id: string;
  userId: number;
  timestamp: string;
  details: ManualInputDetail[];
  // Jika backend menyertakan data user, tambahkan di sini
  // user?: {
  //   name: string;
  // };
}

/**
 * Tipe untuk objek 'meta' pagination dari API.
 */
export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}


/**
 * Tipe untuk objek 'data' utama yang berisi array data dan meta.
 */
export interface PaginatedData {
  data: ManualInputRecord[];
  meta: Pagination;
}

/**
 * Tipe lengkap untuk respons API riwayat input manual.
 */
export interface PaginatedHistoryResponse {
  status: string;
  message: string;
  data: PaginatedData;
}