// Popup script for the extension
document.addEventListener('DOMContentLoaded', () => {
    const currentTab = chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        if (tabs[0]) {
            document.getElementById('current-url').textContent = tabs[0].url;
        }
    });

    document.getElementById('refresh-btn').addEventListener('click', () => {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, {action: "rescan"});
            }
        });
    });

    document.getElementById('report-btn').addEventListener('click', () => {
        alert('Report submitted');
    });
});