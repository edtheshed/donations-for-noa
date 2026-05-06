export interface Donation {
  id: string;
  name: string;
  donated_at: string; // ISO date string e.g. "2026-04-26"
  location: string;
  message?: string;
  photo_url?: string;
  created_at: string;
}
