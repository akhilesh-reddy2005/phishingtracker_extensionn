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
document.addEventListener('DOMContentLoaded', () => __awaiter(void 0, void 0, void 0, function* () {
    const statusCard = document.getElementById('status-card');
    const currentUrlEl = document.getElementById('current-url');
    const threatLevelEl = document.getElementById('threat-level');
    const reportBtn = document.getElementById('report-btn');
    const refreshBtn = document.getElementById('refresh-btn');
    // Get current tab
    const [tab] = yield chrome.tabs.query({ active: true, currentWindow: true });
    currentUrlEl.textContent = tab.url || 'Unknown';
    // Refresh scan
    refreshBtn === null || refreshBtn === void 0 ? void 0 : refreshBtn.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
        statusCard === null || statusCard === void 0 ? void 0 : statusCard.classList.add('loading');
        yield chrome.tabs.sendMessage(tab.id, { action: 'rescan' });
    }));
    // Report threat
    reportBtn === null || reportBtn === void 0 ? void 0 : reportBtn.addEventListener('click', () => {
        alert('Threat reported! Thank you for helping keep the web safe.');
    });
    // Listen for status updates
    chrome.runtime.onMessage.addListener((request) => {
        if (request.action === 'updateStatus') {
            updateStatusDisplay(request.status, statusCard, threatLevelEl);
        }
    });
}));
function updateStatusDisplay(status, statusCard, threatLevelEl) {
    if (!statusCard || !threatLevelEl)
        return;
    statusCard.classList.remove('loading');
    statusCard.classList.add(status.isSafe ? 'safe' : 'unsafe');
    const icon = status.isSafe ? '✅' : '⚠️';
    const title = status.isSafe ? 'Safe Website' : 'Suspicious Website';
    statusCard.innerHTML = `
    <div style="font-size: 32px; margin-bottom: 10px;">${icon}</div>
    <h2 style="font-size: 18px; margin-bottom: 5px;">${title}</h2>
    <p style="font-size: 13px;">${status.message}</p>
    <p style="font-size: 12px; margin-top: 8px;">Confidence: ${(status.confidence * 100).toFixed(0)}%</p>
  `;
    threatLevelEl.textContent = status.isSafe ? '✓ Safe' : '⚠ Unsafe';
    threatLevelEl.classList.add(status.isSafe ? 'safe' : 'unsafe');
}
