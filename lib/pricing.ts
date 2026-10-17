/** Reel pack: 3 reels = ₹8,000; each additional reel = +₹2,000. */
export const REEL_PACK_BASE_COUNT = 3;
export const REEL_PACK_BASE_PRICE = 8000;
export const REEL_PACK_EXTRA_PRICE = 2000;

export function reelPackPrice(count: number): number {
  const n = Math.max(REEL_PACK_BASE_COUNT, Math.round(count));
  return REEL_PACK_BASE_PRICE + (n - REEL_PACK_BASE_COUNT) * REEL_PACK_EXTRA_PRICE;
}

export function formatInr(amount: number): string {
  return amount.toLocaleString("en-IN");
}
