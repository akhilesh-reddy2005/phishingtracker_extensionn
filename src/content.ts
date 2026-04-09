interface WebsiteStatus {
  isSafe: boolean;
  message: string;
  confidence: number;
  riskScore: number;
  riskLevel: 'safe' | 'warning' | 'danger';
  threats: string[];
}

// Listen for scan results via storage — avoids all messaging connection errors
chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== 'local' || !changes.latestScan) return;
  const scan = changes.latestScan.newValue;
  if (!scan) return;

  // Only show if scan is for the current page (normalize to ignore trailing slash)
  const normalize = (u: string) => u.replace(/\/$/, '').split('#')[0];
  if (normalize(scan.url) !== normalize(window.location.href)) return;

  // Only show if scan is recent (within last 10 seconds)
  if (Date.now() - scan.timestamp > 10000) return;

  document.querySelector('.phishing-tracker-notification')?.remove();
  showNotification(scan.status);
});

function getRiskColor(riskLevel: 'safe' | 'warning' | 'danger'): string {
  if (riskLevel === 'safe') return 'notification-safe';
  if (riskLevel === 'warning') return 'notification-warning';
  return 'notification-unsafe';
}

function showNotification(status: WebsiteStatus): void {
  const notification = document.createElement('div');
  notification.className = `notification phishing-tracker-notification ${getRiskColor(status.riskLevel)}`;

  const icons: Record<string, string> = { safe: '✓', warning: '⚠', danger: '✕' };
  const titles: Record<string, string> = {
    safe: 'Safe Website',
    warning: 'Suspicious Website',
    danger: 'Dangerous Website'
  };

  const icon = icons[status.riskLevel];
  const title = titles[status.riskLevel];
  const scoreBar = buildScoreBar(status.riskScore, status.riskLevel);

  notification.innerHTML = `
    <div style="display:flex; align-items:flex-start; gap:10px;">
      <span style="font-size:22px; font-weight:bold; flex-shrink:0;">${icon}</span>
      <div style="flex:1;">
        <strong style="font-size:14px;">${title}</strong>
        <p style="margin:4px 0 6px; font-size:12px;">${status.message}</p>
        ${scoreBar}
        ${status.threats.length > 0 ? `<p style="margin:6px 0 0; font-size:11px; opacity:0.85;">⚑ ${status.threats[0]}</p>` : ''}
      </div>
      <span class="notification-close" style="cursor:pointer; font-size:16px; opacity:0.6; flex-shrink:0;">✕</span>
    </div>
  `;

  notification.querySelector('.notification-close')?.addEventListener('click', () => {
    notification.classList.add('hide');
    setTimeout(() => notification.remove(), 300);
  });

  document.body.appendChild(notification);

  // Safe sites hide faster; threats stay longer
  const hideDelay = status.riskLevel === 'safe' ? 3000 : 7000;
  setTimeout(() => {
    notification.classList.add('hide');
    setTimeout(() => notification.remove(), 300);
  }, hideDelay);
}

function buildScoreBar(score: number, riskLevel: 'safe' | 'warning' | 'danger'): string {
  const colors: Record<string, string> = {
    safe: '#28a745',
    warning: '#fd7e14',
    danger: '#dc3545'
  };
  const color = colors[riskLevel];
  return `
    <div style="margin:4px 0;">
      <div style="display:flex; justify-content:space-between; font-size:11px; margin-bottom:3px;">
        <span>Risk Score</span><span style="font-weight:bold;">${score}/100</span>
      </div>
      <div style="background:rgba(0,0,0,0.15); border-radius:4px; height:6px;">
        <div style="width:${score}%; background:${color}; height:6px; border-radius:4px; transition:width 0.5s;"></div>
      </div>
    </div>
  `;
}
