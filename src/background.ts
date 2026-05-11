import { checkUrl } from './utils/api';
import { runHeuristics, getDomainFromUrl } from './utils/phishingDetector';
import { WebsiteStatus, ThreatHistoryEntry } from './types/index';

const MAX_HISTORY = 100;

function getRiskLevel(score: number): 'safe' | 'warning' | 'danger' {
  if (score <= 25) return 'safe';
  if (score <= 55) return 'warning';
  return 'danger';
}

function buildMessage(riskLevel: 'safe' | 'warning' | 'danger', threats: string[]): string {
  if (riskLevel === 'safe') return 'No threats detected';
  if (riskLevel === 'warning') return `Suspicious signals: ${threats[0]}`;
  return `Threats detected: ${threats.slice(0, 2).join(', ')}`;
}

async function saveToHistory(entry: ThreatHistoryEntry): Promise<void> {
  const data = await chrome.storage.local.get({ threatHistory: [] });
  const history: ThreatHistoryEntry[] = data.threatHistory;

  // Avoid duplicate consecutive entries for same URL
  if (history.length > 0 && history[0].url === entry.url) return;

  history.unshift(entry);
  if (history.length > MAX_HISTORY) history.pop();

  await chrome.storage.local.set({ threatHistory: history });
}

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    scanWebsite(tabId, tab.url);
  }
});

async function scanWebsite(tabId: number, url: string): Promise<void> {
  // Skip internal pages
  if (url.startsWith('chrome://') || url.startsWith('chrome-extension://') || url.startsWith('about:')) return;

  try {
    // Run both checks in parallel
    const [apiSafe, heuristics] = await Promise.all([
      checkUrl(url),
      Promise.resolve(runHeuristics(url))
    ]);

    // Combine scores: API unsafe adds 60 points, heuristics add their score
    let totalScore = heuristics.score;
    const allThreats = [...heuristics.threats];

    if (!apiSafe) {
      totalScore = Math.min(totalScore + 60, 100);
      allThreats.unshift('Google Safe Browsing flagged this URL');
    }

    const riskLevel = getRiskLevel(totalScore);
    const status: WebsiteStatus = {
      isSafe: riskLevel === 'safe',
      message: buildMessage(riskLevel, allThreats),
      confidence: apiSafe ? 0.85 : 0.97,
      riskScore: totalScore,
      riskLevel,
      threats: allThreats
    };

    // Save to history
    await saveToHistory({
      url,
      domain: getDomainFromUrl(url),
      riskScore: totalScore,
      riskLevel,
      threats: allThreats,
      timestamp: Date.now()
    });

    // Store latest scan so content script can pick it up via storage listener
    await chrome.storage.local.set({
      latestScan: { tabId, url, status, timestamp: Date.now() }
    });

  } catch (error) {
    console.error('Error scanning website:', error);
  }
}
