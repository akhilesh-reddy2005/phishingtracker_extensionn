interface WebsiteStatus {
  isSafe: boolean;
  message: string;
  confidence: number;
}

document.addEventListener('DOMContentLoaded', async () => {
  const statusCard = document.getElementById('status-card');
  const currentUrlEl = document.getElementById('current-url');
  const threatLevelEl = document.getElementById('threat-level');
  const reportBtn = document.getElementById('report-btn');
  const refreshBtn = document.getElementById('refresh-btn');

  // Get current tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  currentUrlEl!.textContent = tab.url || 'Unknown';

  // Refresh scan
  refreshBtn?.addEventListener('click', async () => {
    statusCard?.classList.add('loading');
    await chrome.tabs.sendMessage(tab.id!, { action: 'rescan' });
  });

  // Report threat
  reportBtn?.addEventListener('click', () => {
    alert('Threat reported! Thank you for helping keep the web safe.');
  });

  // Listen for status updates
  chrome.runtime.onMessage.addListener((request) => {
    if (request.action === 'updateStatus') {
      updateStatusDisplay(request.status, statusCard, threatLevelEl);
    }
  });
});

function updateStatusDisplay(status: WebsiteStatus, statusCard: HTMLElement | null, threatLevelEl: HTMLElement | null): void {
  if (!statusCard || !threatLevelEl) return;

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