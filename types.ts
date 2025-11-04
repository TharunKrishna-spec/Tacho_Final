
export interface TachometerDataPoint {
  timestamp: number;
  rpm: number;
}

export interface Session {
  id: string;
  startTime: number;
  endTime: number;
  duration: number; // in seconds
  data: TachometerDataPoint[];
  avgRpm: number;
  maxRpm: number;
  minRpm: number;
}
