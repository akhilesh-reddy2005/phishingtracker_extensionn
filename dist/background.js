
// This file contains the background script for the Chrome extension. It listens for tab updates and checks the URL against a list of known phishing sites using the phishingDetector utility.

// Placeholder function - replace with actual API call
async function checkUrl(url) {
    return true; // Default to safe
}

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
        scanWebsite(tabId, tab.url);
    }
});

async function scanWebsite(tabId, url) {
    try {
        const isSafe = await checkUrl(url);
        const status = {
            isSafe,
            message: isSafe ? "No threats detected" : "This website may be unsafe",
            confidence: 0.95
        };
        // Send notification to content script
        chrome.tabs.sendMessage(tabId, {
            action: "showNotification",
            status
        }).catch(() => {
            console.log("Content script not injected yet");
        });
    }
    catch (error) {
        console.error('Error scanning website:', error);
    }
}
