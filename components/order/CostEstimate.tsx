'use client';

import { PACKING_FEE_IDR, SERVICE_MARGIN } from '@/lib/constants';

type CostEstimateProps = {
  /** Price of the custom item (from the "Perkiraan harga" field), 0 if none. */
  itemPriceIdr: number;
  /** Quantity of the custom item. */
  quantity: number;
  /** Subtotal from catalog cart items (sum of priceIdr × qty per cart item). */
  cartSubtotalIdr: number;
  /** Selected display currency code. */
  currency: string;
  /** rate_to_idr (1 foreign unit = X IDR), or null if currency is IDR. */
  rate: number | null;
};

/**
 * Live-updating cost estimate panel.
 *
 * Combined formula:
 *   goodsTotal = cartSubtotal + (customItemPrice × customQty)
 *   serviceFee = goodsTotal × 10%
 *   packing    = PACKING_FEE_IDR (flat)
 *   grand      = goodsTotal + serviceFee + packing
 */
export default function CostEstimate({
  itemPriceIdr,
  quantity,
  cartSubtotalIdr,
  currency,
  rate,
}: CostEstimateProps) {
  const customSubtotal = itemPriceIdr * quantity;
  const goodsTotal = cartSubtotalIdr + customSubtotal;
  const serviceFee = goodsTotal * SERVICE_MARGIN;
  const grandTotal = goodsTotal + serviceFee + PACKING_FEE_IDR;

  /** Format as IDR. */
  const fmtIdr = (n: number) =>
    `Rp ${n.toLocaleString('id-ID', { maximumFractionDigits: 0 })}`;

  /** Format in foreign currency. */
  const fmtForeign = (n: number) =>
    `${currency} ${n.toLocaleString('id-ID', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  return (
    <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-4 space-y-2">
      <h3 className="font-semibold text-sm text-amber-800">
        💰 Estimasi Biaya
      </h3>

      <div className="text-sm space-y-1">
        {/* Cart items subtotal */}
        {cartSubtotalIdr > 0 && (
          <div className="flex justify-between">
            <span>Produk katalog</span>
            <span>{fmtIdr(cartSubtotalIdr)}</span>
          </div>
        )}

        {/* Custom item subtotal */}
        {customSubtotal > 0 && (
          <div className="flex justify-between">
            <span>
              Barang custom
              {quantity > 1 && ` (×${quantity})`}
            </span>
            <span>{fmtIdr(customSubtotal)}</span>
          </div>
        )}

        {/* Service fee */}
        <div className="flex justify-between">
          <span>Jasa titip ({(SERVICE_MARGIN * 100).toFixed(0)}%)</span>
          <span>{fmtIdr(serviceFee)}</span>
        </div>

        {/* Packing fee */}
        <div className="flex justify-between">
          <span>Packing</span>
          <span>{fmtIdr(PACKING_FEE_IDR)}</span>
        </div>

        <hr className="border-amber-200" />

        {/* Grand total */}
        <div className="flex justify-between font-bold">
          <span>Total estimasi</span>
          <span>{fmtIdr(grandTotal)}</span>
        </div>

        {/* Converted price */}
        {currency !== 'IDR' && rate && rate > 0 && (
          <div className="flex justify-between text-primary font-medium">
            <span>≈ dalam {currency}</span>
            <span>{fmtForeign(grandTotal / rate)}</span>
          </div>
        )}
      </div>

      <p className="text-xs text-gray-500 mt-2 leading-relaxed">
        ⚠️ Estimasi belum termasuk ongkir kargo — biaya final dihitung setelah
        barang ditimbang oleh admin.
      </p>
    </div>
  );
}
