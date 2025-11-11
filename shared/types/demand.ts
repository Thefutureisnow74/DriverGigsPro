export interface Event {
  id: number;
  name: string;
  venue: string;
  time: string;
  expectedAttendance: number;
  type: 'concert' | 'sports' | 'convention' | 'nightlife' | 'business';
}

export interface HotSpot {
  id: number;
  name: string;
  lat: number;
  lng: number;
  concentration: number;
  type: 'high' | 'medium' | 'low';
  estimatedEarnings: string;
  peakHours: string;
  events?: Event[];
}

export interface DemandDataResponse {
  hotspots: HotSpot[];
  userLocation: {
    lat: number;
    lng: number;
    city: string;
  };
  lastUpdated: string;
  dataSource: 'realtime' | 'cached' | 'fallback';
  cacheExpiry?: string;
}
