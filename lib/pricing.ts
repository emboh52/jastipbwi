/**
 * Shared pricing constants and formulas.
 * Single source of truth used by both the customer estimate
 * (CostEstimate component) and the admin total calculation.
 */

/** Jastip service fee rate (10%). */
export const JASTIP_FEE_RATE = 0.10;

/** Flat packing fee added to every order (in IDR). */
export const PACKING_FEE_FLAT_IDR = 5_000;

/**
 * Estimate the cost of items before cargo (customer-facing estimate).
 * Formula: itemsSubtotal + (itemsSubtotal × 10%) + packingFee
 */
export function estimateItemsCost(itemsSubtotalIdr: number): number {
  return itemsSubtotalIdr + itemsSubtotalIdr * JASTIP_FEE_RATE + PACKING_FEE_FLAT_IDR;
}

/**
 * Calculate the final total including cargo fee (admin-side).
 * @param itemsSubtotalIdr  Sum of (custom_price_idr × quantity) across all order items.
 * @param finalWeightKg     Actual weight measured by admin after packing.
 * @param cargoRatePerKgIdr Per-kg cargo rate for the order's destination.
 */
export function calculateFinalTotal(
  itemsSubtotalIdr: number,
  finalWeightKg: number,
  cargoRatePerKgIdr: number
): { cargoFeeIdr: number; totalPriceIdr: number } {
  const cargoFeeIdr = finalWeightKg * cargoRatePerKgIdr;
  const totalPriceIdr = estimateItemsCost(itemsSubtotalIdr) + cargoFeeIdr;
  return { cargoFeeIdr, totalPriceIdr };
}
