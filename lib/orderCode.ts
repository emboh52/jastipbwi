/**
 * Generate a human-readable order code.
 * Format: JST-YYYYMMDD-XXXXXX (6 random alphanumeric chars).
 *
 * This runs client-side so we can insert the order without a server round-trip
 * (anon has no SELECT on orders, so we can't rely on .select() after .insert()).
 */
export function generateOrderCode(): string {
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `JST-${y}${m}${d}-${random}`;
}
