// =============================================================================
// BulkBlitz — Utility Functions
// =============================================================================

/**
 * Format a number as Indian Rupee price string.
 * Uses the Indian numbering system (e.g., ₹1,23,456.00).
 *
 * @param {number} amount - The amount to format
 * @param {boolean} [showDecimals=true] - Whether to show paise
 * @returns {string} Formatted price string
 */
export function formatPrice(amount, showDecimals = true) {
  if (amount == null || isNaN(amount)) return '₹0';

  const formatted = showDecimals
    ? formatNumber(Math.floor(amount)) +
      '.' +
      String(Math.round((amount % 1) * 100)).padStart(2, '0')
    : formatNumber(Math.round(amount));

  return `₹${formatted}`;
}

/**
 * Format a number with Indian-style commas.
 * Indian system: 1,00,00,000 (crores), not 10,000,000.
 *
 * @param {number} num - The number to format
 * @returns {string} Formatted number string
 */
export function formatNumber(num) {
  if (num == null || isNaN(num)) return '0';

  const n = Math.abs(Math.floor(num));
  const str = String(n);

  if (str.length <= 3) return str;

  // Last 3 digits stay together, then groups of 2
  const lastThree = str.slice(-3);
  const remaining = str.slice(0, -3);
  const formatted =
    remaining.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;

  return num < 0 ? `-${formatted}` : formatted;
}

/**
 * Return a human-readable "time ago" string from an ISO date.
 *
 * @param {string} dateString - ISO 8601 date string
 * @returns {string} e.g. "2 hours ago", "3 days ago", "just now"
 */
export function formatTimeAgo(dateString) {
  if (!dateString) return '';

  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 60) return 'just now';

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} minute${diffMin !== 1 ? 's' : ''} ago`;

  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hour${diffHr !== 1 ? 's' : ''} ago`;

  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 30) return `${diffDay} day${diffDay !== 1 ? 's' : ''} ago`;

  const diffMonth = Math.floor(diffDay / 30);
  if (diffMonth < 12)
    return `${diffMonth} month${diffMonth !== 1 ? 's' : ''} ago`;

  const diffYear = Math.floor(diffMonth / 12);
  return `${diffYear} year${diffYear !== 1 ? 's' : ''} ago`;
}

/**
 * Format an ISO date string into a readable date.
 *
 * @param {string} dateString - ISO 8601 date string
 * @returns {string} e.g. "Jun 13, 2026"
 */
export function formatDate(dateString) {
  if (!dateString) return '';

  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Merge CSS class names, filtering out falsy values.
 * Lightweight alternative to clsx / classnames.
 *
 * @param {...(string|boolean|null|undefined)} classes
 * @returns {string} Merged class string
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Extract initials from a name (first letter of first two words).
 *
 * @param {string} name - Full name
 * @returns {string} e.g. "Rajesh Kumar" → "RK"
 */
export function getInitials(name) {
  if (!name) return '';

  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join('');
}

/**
 * Truncate a string and append an ellipsis if it exceeds maxLen.
 *
 * @param {string} str - Input string
 * @param {number} maxLen - Maximum length before truncation
 * @returns {string}
 */
export function truncate(str, maxLen = 50) {
  if (!str) return '';
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen).trimEnd() + '…';
}

/**
 * Calculate fill percentage of a batch.
 *
 * @param {number} current - Current number of slots filled
 * @param {number} max - Maximum slots available
 * @returns {number} Percentage (0–100)
 */
export function calculateFillPercent(current, max) {
  if (!max || max <= 0) return 0;
  return Math.min(Math.round((current / max) * 100), 100);
}

/**
 * Generate a WhatsApp-friendly share message for a batch.
 *
 * @param {{ title: string, id: string }} batch - Batch object
 * @param {number} currentPrice - Current per-unit price in ₹
 * @returns {string} Pre-formatted share text with URL
 */
export function generateShareText(batch, currentPrice) {
  if (!batch) return '';

  const price = formatPrice(currentPrice, false);

  return [
    `🔥 *${batch.title}* on BulkBlitz!`,
    `💰 Current Price: ${price}/unit`,
    `👥 Join the batch — price drops as more buyers join!`,
    ``,
    `👉 https://bulkblitz.in/batch/${batch.id}`,
    ``,
    `India's first crowd-powered bulk marketplace. Save more together! 🇮🇳`,
  ].join('\n');
}

/**
 * Determine the current price tier for a batch based on how many slots
 * have been filled.
 *
 * @param {object} batch
 * @returns {{ minSlots: number, maxSlots: number, price: number }}
 */
export function getCurrentTier(batch) {
  if (!batch || !batch.tiers || batch.tiers.length === 0) return null;

  const filled = batch.currentSlots || 0;

  // Walk tiers from highest to lowest and return the first match
  for (let i = batch.tiers.length - 1; i >= 0; i--) {
    if (filled >= batch.tiers[i].minSlots) {
      return batch.tiers[i];
    }
  }

  return batch.tiers[0];
}

/**
 * Calculate the percentage saved between the first (highest) tier price
 * and the current tier price.
 *
 * @param {object} batch
 * @returns {number} e.g. 28 for 28%
 */
export function getSavingsPercent(batch) {
  if (!batch || !batch.tiers || batch.tiers.length < 2) return 0;

  const firstPrice = batch.tiers[0].price;
  const currentTier = getCurrentTier(batch);
  if (!currentTier || currentTier.price >= firstPrice) return 0;

  return Math.round(((firstPrice - currentTier.price) / firstPrice) * 100);
}

/**
 * Compute a countdown object from an ISO end-time string.
 *
 * @param {string} endTime - ISO 8601 date string
 * @returns {{ hours: number, minutes: number, seconds: number }}
 */
export function getTimeRemaining(endTime) {
  if (!endTime) return { hours: 0, minutes: 0, seconds: 0 };
  const diff = Math.max(0, new Date(endTime) - new Date());
  const totalSec = Math.floor(diff / 1000);

  return {
    hours: Math.floor(totalSec / 3600),
    minutes: Math.floor((totalSec % 3600) / 60),
    seconds: totalSec % 60,
  };
}

/**
 * How many more buyers are needed to unlock the next price tier?
 *
 * @param {object} batch
 * @returns {number|null} null if already at the last tier
 */
export function getSlotsToNextTier(batch) {
  if (!batch || !batch.tiers) return null;

  const filled = batch.currentSlots || 0;
  const currentTier = getCurrentTier(batch);
  if (!currentTier) return null;
  
  const currentIdx = batch.tiers.findIndex(
    (t) => t.id === currentTier.id || (t.minSlots === currentTier.minSlots && t.price === currentTier.price)
  );

  if (currentIdx === -1 || currentIdx >= batch.tiers.length - 1) return null;

  const nextTier = batch.tiers[currentIdx + 1];
  return Math.max(0, nextTier.minSlots - filled);
}

