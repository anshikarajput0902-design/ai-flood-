export type NavSectionId =
  | 'overview'
  | 'reports'
  | 'map'
  | 'risk-analysis'
  | 'rescue'
  | 'shelters'
  | 'alerts'
  | 'analytics'
  | 'testing'
  | 'settings';

export type SeverityLevel = 'Critical' | 'High' | 'Moderate' | 'Low';

export type IncidentStatus = 'Active' | 'Dispatched' | 'Containment' | 'Resolved';

export interface FloodIncident {
  id: string;
  title: string;
  sector: string;
  coordinates: string;
  mapX: number; // 0-100 percentage on tactical map
  mapY: number; // 0-100 percentage on tactical map
  severity: SeverityLevel;
  status: IncidentStatus;
  waterDepthMeters: number;
  affectedPeople: number;
  reportedAt: string;
  assignedTeam?: string;
  summary: string;
}

export type RescueStatus = 'Deployed' | 'En Route' | 'Standby' | 'Returning';

export interface RescueTeam {
  id: string;
  callSign: string;
  specialty: 'Swift-Water' | 'Aviation' | 'Amphibious' | 'Medical' | 'Recon Drone';
  sector: string;
  status: RescueStatus;
  personnel: number;
  vehicles: string;
  etaMinutes?: number;
  mapX: number;
  mapY: number;
  missionNote: string;
}

export interface ShelterFacility {
  id: string;
  name: string;
  district: string;
  occupied: number;
  capacity: number;
  status: 'Open' | 'Near Full' | 'Full';
  medicalUnit: boolean;
  suppliesPercent: number;
  mapX: number;
  mapY: number;
}

export interface RiskDistributionItem {
  level: SeverityLevel;
  sectors: number;
  percentage: number;
  populationAtRisk: number;
  colorHex: string;
  description: string;
}

export interface FloodZonePolygon {
  id: string;
  name: string;
  severity: SeverityLevel;
  waterRiseRateCmHr: number;
  points: string; // SVG polygon points in 1000x600 coordinate space
  labelX: number;
  labelY: number;
}

export interface AlertItem {
  id: string;
  title: string;
  sector: string;
  severity: SeverityLevel;
  timestamp: string;
  channel: 'Sensor Grid' | 'Hydro Model' | 'Field Dispatch' | 'Citizen SOS';
  read: boolean;
  message: string;
}

export interface HydroForecastPoint {
  hour: string;
  actualLevel: number | null;
  predictedLevel: number;
  criticalThreshold: number;
}

export interface QaTestCase {
  id: string;
  suite: string;
  name: string;
  description: string;
  expectedLatencyMs: number;
  lastResult: 'Passed' | 'Warning' | 'Idle';
  coveragePercent: number;
}
