import axios from 'axios';

// Using Google Safe Browsing API (free tier available)
const GOOGLE_API_KEY = 'AIzaSyCH8eUn1IaQR89sls1dEJpR9GM47IvY5u0';
const GOOGLE_API_URL = 'https://safebrowsing.googleapis.com/v4/threatMatches:find';

export const checkUrl = async (url: string) => {
    try {
        const response = await axios.post(GOOGLE_API_URL, {
            client: {
                clientId: "phishing-tracker-extension",
                clientVersion: "1.0.0"
            },
            threatInfo: {
                threatTypes: ["MALWARE", "SOCIAL_ENGINEERING"],
                platformTypes: ["ANY_PLATFORM"],
                threatEntryTypes: ["URL"],
                threatEntries: [{ url }]
            }
        }, {
            params: { key: GOOGLE_API_KEY }
        });
        
        return response.data.matches ? false : true; // true = safe, false = unsafe
    } catch (error) {
        console.error('Error checking URL:', error);
        return true; // Default to safe on error
    }
};

export const reportPhishingAttempt = async (url: string) => {
    try {
        const response = await axios.post(`https://safebrowsing.googleapis.com/v4/threatMatches:submit`, {
            client: { clientId: "phishing-tracker-extension" },
            threatEntry: { url }
        }, {
            params: { key: GOOGLE_API_KEY }
        });
        return response.data;
    } catch (error) {
        console.error('Error reporting:', error);
        throw error;
    }
};