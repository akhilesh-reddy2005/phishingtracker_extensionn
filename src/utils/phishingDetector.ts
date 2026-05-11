// Heuristic-based phishing detection — runs locally without any API call

const SUSPICIOUS_BRANDS = [
  'paypal', 'apple', 'amazon', 'facebook', 'microsoft', 'google',
  'netflix', 'instagram', 'twitter', 'whatsapp', 'linkedin', 'dropbox',
  'chase', 'wellsfargo', 'bankofamerica', 'citibank', 'ebay'
];

const SUSPICIOUS_KEYWORDS = [
  'login', 'signin', 'verify', 'secure', 'update', 'account',
  'confirm', 'authenticate', 'validate', 'unlock', 'recover',
  'password', 'credential', 'billing', 'payment', 'support'
];

const SUSPICIOUS_TLDS = ['.tk', '.ml', '.ga', '.cf', '.gq', '.xyz', '.top', '.click'];

const LOOKALIKE_CHARS: { [key: string]: string } = {
  '0': 'o', '1': 'l', '3': 'e', '4': 'a', '5': 's', '6': 'g', '8': 'b', '@': 'a'
};

const KNOWN_PHISHING_DOMAINS = [
  'paypal-verify.com', 'apple-id-verify.com', 'amazon-account-verify.com',
  'facebook-login-verify.com', 'microsoft-account-verify.com',
  'paypal-secure.com', 'appleid-apple.com', 'accounts-google.com'
];

export interface HeuristicResult {
  score: number;
  threats: string[];
}

export const runHeuristics = (url: string): HeuristicResult => {
  const threats: string[] = [];
  let score = 0;

  let hostname: string;
  try {
    hostname = new URL(url).hostname.toLowerCase();
  } catch {
    return { score: 0, threats: [] };
  }

  // Skip internal/chrome pages
  if (hostname === 'newtab' || hostname === '' || url.startsWith('chrome://') || url.startsWith('chrome-extension://')) {
    return { score: 0, threats: [] };
  }

  // 1. Known phishing domain list
  if (KNOWN_PHISHING_DOMAINS.some(d => hostname.includes(d))) {
    score += 70;
    threats.push('Known phishing domain');
  }

  // 2. IP address used as hostname (e.g. http://192.168.1.1/login)
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(hostname)) {
    score += 40;
    threats.push('IP address used as domain');
  }

  // 3. Excessive subdomains (more than 3 levels)
  const parts = hostname.split('.');
  if (parts.length > 4) {
    score += 20;
    threats.push('Excessive subdomains');
  }

  // 4. Brand name in subdomain (not in root domain) — e.g. paypal.evil.com
  const rootDomain = parts.slice(-2).join('.');
  const subdomains = parts.slice(0, -2).join('.');
  const brandInSubdomain = SUSPICIOUS_BRANDS.some(brand => subdomains.includes(brand));
  const brandInRoot = SUSPICIOUS_BRANDS.some(brand => rootDomain.includes(brand));
  if (brandInSubdomain && !brandInRoot) {
    score += 35;
    threats.push('Brand name used in subdomain (impersonation)');
  }

  // 5. Suspicious keywords in domain
  const suspiciousKeywordCount = SUSPICIOUS_KEYWORDS.filter(kw => hostname.includes(kw)).length;
  if (suspiciousKeywordCount >= 2) {
    score += 25;
    threats.push(`Multiple suspicious keywords in URL (${suspiciousKeywordCount})`);
  } else if (suspiciousKeywordCount === 1 && brandInRoot) {
    score += 15;
    threats.push('Suspicious keyword combined with brand name');
  }

  // 6. Lookalike characters (e.g. paypa1.com, g00gle.com)
  let normalised = hostname;
  for (const [char, replacement] of Object.entries(LOOKALIKE_CHARS)) {
    normalised = normalised.split(char).join(replacement);
  }
  if (normalised !== hostname) {
    const matchesBrand = SUSPICIOUS_BRANDS.some(brand => normalised.includes(brand));
    if (matchesBrand) {
      score += 30;
      threats.push('Lookalike characters mimicking a brand');
    }
  }

  // 7. Suspicious TLD
  if (SUSPICIOUS_TLDS.some(tld => hostname.endsWith(tld))) {
    score += 20;
    threats.push('Suspicious top-level domain');
  }

  // 8. Very long domain name
  if (hostname.length > 40) {
    score += 15;
    threats.push('Unusually long domain name');
  }

  // 9. Multiple hyphens (e.g. secure-login-paypal-update.com)
  const hyphenCount = (hostname.match(/-/g) || []).length;
  if (hyphenCount >= 3) {
    score += 15;
    threats.push('Multiple hyphens in domain');
  }

  return { score: Math.min(score, 100), threats };
};

export const getDomainFromUrl = (url: string): string => {
  try {
    return new URL(url).hostname;
  } catch {
    return 'unknown';
  }
};
