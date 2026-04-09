export interface WebsiteStatus {
  isSafe: boolean;
  message: string;
  confidence: number;
  riskScore: number;
  riskLevel: 'safe' | 'warning' | 'danger';
  threats: string[];
}

export interface PhishingDetectionResult {
  url: string;
  isSafe: boolean;
  message: string;
  threatType?: string;
  timestamp: number;
}

export interface NotificationOptions {
  title: string;
  message: string;
  iconUrl?: string;
  type: 'basic' | 'list' | 'image' | 'progress';
  duration?: number;
}

export interface PopupState {
  currentUrl: string;
  detectionResult: PhishingDetectionResult | null;
  isTracking: boolean;
  isLoading?: boolean;
}

export interface ChromeMessage {
  action: string;
  status?: WebsiteStatus;
  data?: any;
}

export interface ThreatInfo {
  threatTypes: string[];
  platformTypes: string[];
  threatEntryTypes: string[];
  threatEntries: Array<{ url: string }>;
}

export interface ThreatHistoryEntry {
  url: string;
  domain: string;
  riskScore: number;
  riskLevel: 'safe' | 'warning' | 'danger';
  threats: string[];
  timestamp: number;
}
