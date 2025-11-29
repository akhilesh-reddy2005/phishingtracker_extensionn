"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportPhishingAttempt = exports.checkUrl = void 0;
const axios_1 = __importDefault(require("axios"));
// Using Google Safe Browsing API (free tier available)
const GOOGLE_API_KEY = 'AIzaSyCH8eUn1IaQR89sls1dEJpR9GM47IvY5u0';
const GOOGLE_API_URL = 'https://safebrowsing.googleapis.com/v4/threatMatches:find';
const checkUrl = (url) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.post(GOOGLE_API_URL, {
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
    }
    catch (error) {
        console.error('Error checking URL:', error);
        return true; // Default to safe on error
    }
});
exports.checkUrl = checkUrl;
const reportPhishingAttempt = (url) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.post(`https://safebrowsing.googleapis.com/v4/threatMatches:submit`, {
            client: { clientId: "phishing-tracker-extension" },
            threatEntry: { url }
        }, {
            params: { key: GOOGLE_API_KEY }
        });
        return response.data;
    }
    catch (error) {
        console.error('Error reporting:', error);
        throw error;
    }
});
exports.reportPhishingAttempt = reportPhishingAttempt;
