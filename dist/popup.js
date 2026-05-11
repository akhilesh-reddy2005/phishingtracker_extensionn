"use strict";
(() => {
  // src/popup.ts
  document.addEventListener("DOMContentLoaded", async () => {
    const statusCard = document.getElementById("status-card");
    const currentUrlEl = document.getElementById("current-url");
    const threatLevelEl = document.getElementById("threat-level");
    const reportBtn = document.getElementById("report-btn");
    const refreshBtn = document.getElementById("refresh-btn");
    const historyBtn = document.getElementById("history-btn");
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    currentUrlEl.textContent = tab.url || "Unknown";
    if (tab.url) {
      const data = await chrome.storage.local.get({ threatHistory: [] });
      const history = data.threatHistory;
      const last = history.find((h) => h.url === tab.url);
      if (last) {
        updateStatusDisplay({
          isSafe: last.riskLevel === "safe",
          message: last.threats.length > 0 ? last.threats[0] : "No threats detected",
          confidence: 0.9,
          riskScore: last.riskScore,
          riskLevel: last.riskLevel,
          threats: last.threats
        }, statusCard, threatLevelEl);
      }
    }
    refreshBtn?.addEventListener("click", async () => {
      if (!tab.id) return;
      statusCard?.classList.add("loading");
      chrome.tabs.reload(tab.id);
    });
    reportBtn?.addEventListener("click", () => {
      if (tab.url) {
        chrome.tabs.create({ url: `https://safebrowsing.google.com/safebrowsing/report_phish/?url=${encodeURIComponent(tab.url)}` });
      }
    });
    historyBtn?.addEventListener("click", () => {
      chrome.tabs.create({ url: chrome.runtime.getURL("src/history.html") });
    });
  });
  function updateStatusDisplay(status, statusCard, threatLevelEl) {
    if (!statusCard || !threatLevelEl) return;
    statusCard.classList.remove("loading", "safe", "unsafe", "warning", "danger");
    statusCard.classList.add(status.riskLevel);
    const icons = { safe: "OK", warning: "!", danger: "X" };
    const titles = {
      safe: "Safe Website",
      warning: "Suspicious Website",
      danger: "Dangerous Website"
    };
    const scoreBarColor = {
      safe: "#27c281",
      warning: "#ffb648",
      danger: "#ff5f5f"
    };
    const boundedScore = Math.max(0, Math.min(100, status.riskScore));
    const safeMessage = escapeHtml(status.message);
    const threatList = status.threats.slice(0, 3).map((t) => `<li>${escapeHtml(t)}</li>`).join("");
    statusCard.innerHTML = `
    <div class="status-top">
      <h2 class="status-title">${titles[status.riskLevel]}</h2>
      <span class="status-icon">${icons[status.riskLevel]}</span>
    </div>
    <p class="status-message">${safeMessage}</p>
    <div class="risk-meter">
      <div class="risk-meter-row">
        <span>Risk Score</span>
        <strong>${boundedScore}/100</strong>
      </div>
      <div class="risk-meter-track">
        <div class="risk-meter-fill" style="width:${boundedScore}%; background:${scoreBarColor[status.riskLevel]};"></div>
      </div>
    </div>
    ${threatList ? `<ul class="threat-list">${threatList}</ul>` : ""}
  `;
    const levelLabels = {
      safe: "Safe",
      warning: "Suspicious",
      danger: "Dangerous"
    };
    threatLevelEl.textContent = levelLabels[status.riskLevel];
    threatLevelEl.className = `threat-level ${status.riskLevel}`;
  }
  function escapeHtml(input) {
    return input.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
})();
