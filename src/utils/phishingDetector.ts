import { PhishingDetectionResult } from '../types/index';

// Local phishing database (backup if API fails)
const knownPhishingSites = [
  'paypal-verify.com',
  'apple-id-verify.com',
  'amazon-account-verify.com',
  'facebook-login-verify.com',
  'microsoft-account-verify.com'
];

export const detectPhishing = (url: string): boolean => {
  try {
    const domain = new URL(url).hostname.toLowerCase();
    return knownPhishingSites.some(site => domain.includes(site));
  } catch {
    return false;
  }
};

export const createDetectionResult = (
  url: string,
  isSafe: boolean,
  threatType?: string
): PhishingDetectionResult => {
  return {
    url,
    isSafe,
    message: isSafe 
      ? "This website appears to be safe" 
      : `This website may be unsafe - ${threatType || 'Unknown threat'}`,
    threatType,
    timestamp: Date.now()
  };
};

export const getDomainFromUrl = (url: string): string => {
  try {
    return new URL(url).hostname;
  } catch {
    return 'unknown';
  }
};