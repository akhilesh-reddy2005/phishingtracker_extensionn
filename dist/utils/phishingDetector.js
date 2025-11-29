"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDomainFromUrl = exports.createDetectionResult = exports.detectPhishing = void 0;
// Local phishing database (backup if API fails)
const knownPhishingSites = [
    'paypal-verify.com',
    'apple-id-verify.com',
    'amazon-account-verify.com',
    'facebook-login-verify.com',
    'microsoft-account-verify.com'
];
const detectPhishing = (url) => {
    try {
        const domain = new URL(url).hostname.toLowerCase();
        return knownPhishingSites.some(site => domain.includes(site));
    }
    catch (_a) {
        return false;
    }
};
exports.detectPhishing = detectPhishing;
const createDetectionResult = (url, isSafe, threatType) => {
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
exports.createDetectionResult = createDetectionResult;
const getDomainFromUrl = (url) => {
    try {
        return new URL(url).hostname;
    }
    catch (_a) {
        return 'unknown';
    }
};
exports.getDomainFromUrl = getDomainFromUrl;
