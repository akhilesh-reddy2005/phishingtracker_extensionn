interface WebsiteStatus {
  isSafe: boolean;
  message: string;
  confidence: number;
  riskScore: number;
  riskLevel: 'safe' | 'warning' | 'danger';
  threats: string[];
}

document.addEventListener('DOMContentLoaded', async () => {
  const statusCard = document.getElementById('status-card');
  const currentUrlEl = document.getElementById('current-url');
  const threatLevelEl = document.getElementById('threat-level');
  const reportBtn = document.getElementById('report-btn');
  const refreshBtn = document.getElementById('refresh-btn');
  const historyBtn = document.getElementById('history-btn');

  // Get current tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  currentUrlEl!.textContent = tab.url || 'Unknown';

  // Load last scan result from storage for this URL
  if (tab.url) {
    const data = await chrome.storage.local.get({ threatHistory: [] });
    const history = data.threatHistory as Array<{
      url: string; riskScore: number; riskLevel: string; threats: string[]; timestamp: number;
    }>;
    const last = history.find(h => h.url === tab.url);
    if (last) {
      updateStatusDisplay({
        isSafe: last.riskLevel === 'safe',
        message: last.threats.length > 0 ? last.threats[0] : 'No threats detected',
        confidence: 0.9,
        riskScore: last.riskScore,
        riskLevel: last.riskLevel as 'safe' | 'warning' | 'danger',
        threats: last.threats
      }, statusCard, threatLevelEl);
    }
  }

  // Refresh scan
  refreshBtn?.addEventListener('click', async () => {
    if (!tab.id) return;
    statusCard?.classList.add('loading');
    chrome.tabs.reload(tab.id);
  });

  // Report threat
  reportBtn?.addEventListener('click', () => {
    if (tab.url) {
      chrome.tabs.create({ url: `https://safebrowsing.google.com/safebrowsing/report_phish/?url=${encodeURIComponent(tab.url)}` });
    }
  });

  // View history
  historyBtn?.addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('src/history.html') });
  });

});

function updateStatusDisplay(
  status: WebsiteStatus,
  statusCard: HTMLElement | null,
  threatLevelEl: HTMLElement | null
): void {
  if (!statusCard || !threatLevelEl) return;

  statusCard.classList.remove('loading', 'safe', 'unsafe', 'warning');
  statusCard.classList.add(status.riskLevel);

  const icons: Record<string, string> = { safe: '✅', warning: '⚠️', danger: '🚨' };
  const titles: Record<string, string> = {
    safe: 'Safe Website',
    warning: 'Suspicious Website',
    danger: 'Dangerous Website'
  };

  const scoreBarColor: Record<string, string> = {
    safe: '#28a745',
    warning: '#fd7e14',
    danger: '#dc3545'
  };

  statusCard.innerHTML = `
    <div style="font-size:32px; margin-bottom:8px;">${icons[status.riskLevel]}</div>
    <h2 style="font-size:18px; margin-bottom:5px;">${titles[status.riskLevel]}</h2>
    <p style="font-size:12px; margin-bottom:10px;">${status.message}</p>
    <div style="background:rgba(0,0,0,0.1); border-radius:6px; padding:8px;">
      <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:4px;">
        <span>Risk Score</span><strong>${status.riskScore}/100</strong>
      </div>
      <div style="background:rgba(0,0,0,0.15); border-radius:4px; height:8px;">
        <div style="width:${status.riskScore}%; background:${scoreBarColor[status.riskLevel]}; height:8px; border-radius:4px;"></div>
      </div>
    </div>
    ${status.threats.length > 0 ? `
    <ul style="margin:10px 0 0; padding:0 0 0 16px; font-size:11px; text-align:left;">
      ${status.threats.slice(0, 3).map(t => `<li>${t}</li>`).join('')}
    </ul>` : ''}
  `;

  const levelLabels: Record<string, string> = {
    safe: '✓ Safe',
    warning: '⚠ Suspicious',
    danger: '✕ Dangerous'
  };
  threatLevelEl.textContent = levelLabels[status.riskLevel];
  threatLevelEl.className = `threat-level ${status.riskLevel}`;
}
