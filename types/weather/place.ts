export interface Place {
  name: string;
  place_id: string;
  adm_area1: string | null;
  adm_area2: string | null;
  country: string;
  lat: string;
  lon: string;
  timezone: string;
  type: string;
  isUserLocation?: boolean;
  temperature?: number;
}