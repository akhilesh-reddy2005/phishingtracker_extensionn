interface ThreatHistoryEntry {
  url: string;
  domain: string;
  riskScore: number;
  riskLevel: 'safe' | 'warning' | 'danger';
  threats: string[];
  timestamp: number;
}

let allHistory: ThreatHistoryEntry[] = [];

document.addEventListener('DOMContentLoaded', async () => {
  const data = await chrome.storage.local.get({ threatHistory: [] });
  allHistory = data.threatHistory as ThreatHistoryEntry[];

  renderStats(allHistory);
  renderList(allHistory);

  document.getElementById('search-input')?.addEventListener('input', (e) => {
    const query = (e.target as HTMLInputElement).value.toLowerCase();
    const filtered = allHistory.filter(h => h.url.toLowerCase().includes(query) || h.domain.toLowerCase().includes(query));
    renderList(filtered);
  });

  document.getElementById('clear-btn')?.addEventListener('click', async () => {
    if (!confirm('Clear all history?')) return;
    await chrome.storage.local.set({ threatHistory: [] });
    allHistory = [];
    renderStats([]);
    renderList([]);
  });
});

function renderStats(history: ThreatHistoryEntry[]): void {
  const total = history.length;
  const safe = history.filter(h => h.riskLevel === 'safe').length;
  const warning = history.filter(h => h.riskLevel === 'warning').length;
  const danger = history.filter(h => h.riskLevel === 'danger').length;

  document.getElementById('stat-total')!.textContent = String(total);
  document.getElementById('stat-safe')!.textContent = String(safe);
  document.getElementById('stat-warning')!.textContent = String(warning);
  document.getElementById('stat-danger')!.textContent = String(danger);
}

function renderList(history: ThreatHistoryEntry[]): void {
  const container = document.getElementById('history-list')!;

  if (history.length === 0) {
    container.innerHTML = '<p class="empty-msg">No history yet. Browse some websites!</p>';
    return;
  }

  const icons: Record<string, string> = { safe: '✅', warning: '❌', danger: '❌' };

  container.innerHTML = history.map(entry => {
    const time = new Date(entry.timestamp).toLocaleString();
    const threatsText = entry.threats.length > 0
      ? entry.threats.slice(0, 2).join(' · ')
      : '';

    return `
      <div class="history-item ${entry.riskLevel}">
        <div class="item-icon">${icons[entry.riskLevel]}</div>
        <div class="item-body">
          <div class="item-domain">${entry.domain}</div>
          <div class="item-url">${entry.url}</div>
          ${threatsText ? `<div class="item-threats ${entry.riskLevel}">${threatsText}</div>` : ''}
        </div>
        <div class="item-meta">
          <div class="item-score ${entry.riskLevel}">${entry.riskScore}</div>
          <div class="item-time">${time}</div>
        </div>
      </div>
    `;
  }).join('');
}
