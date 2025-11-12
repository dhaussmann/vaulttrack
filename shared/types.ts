export interface DemoItem {
  id: string;
  name: string;
  value: number;
}
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
// Types for the Paradex Vault API response
export interface ParadexVault {
  id: number;
  l1_address: string;
  stark_key: string;
  balance: string; // The balance is returned as a string
  is_default: boolean;
}
export interface ParadexApiResponse {
  results: ParadexVault[];
}
// Type for our custom /api/tvl endpoint response
export interface TVLData {
  tvl: number;
  lastUpdated: string;
}