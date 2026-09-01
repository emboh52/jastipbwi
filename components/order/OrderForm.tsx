'use client';

import { useEffect, useState, useCallback, useMemo, type FormEvent } from 'react';
import { supabase } from '@/lib/supabase/client';
import { generateOrderCode } from '@/lib/orderCode';
import {
  PACKING_FEE_IDR,
  SERVICE_MARGIN,
  ADMIN_WHATSAPP,
} from '@/lib/constants';
import useCurrencyStore from '@/store/currency';
import { useCartStore } from '@/store/cart';
import CostEstimate from '@/components/order/CostEstimate';
import CartSummary from '@/components/order/CartSummary';
import OrderConfirmation from '@/components/order/OrderConfirmation';
import { Loader2, Upload, RefreshCw } from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type Destination = {
  id: string;
  name: string;
  iso_country_code: string;
};

type ExchangeRate = {
  currency_code: string;
  rate_to_idr: number;
};

type SubmitResult = {
  orderCode: string;
  customerName: string;
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function OrderForm() {
  /* ---- state: destinations ---- */
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [destLoading, setDestLoading] = useState(true);
  const [destError, setDestError] = useState(false);

  /* ---- state: exchange rates ---- */
  const [rates, setRates] = useState<ExchangeRate[]>([]);

  /* ---- state: form fields ---- */
  const [productLink, setProductLink] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [destinationId, setDestinationId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [estimatedPrice, setEstimatedPrice] = useState('');

  /* ---- state: submit ---- */
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [result, setResult] = useState<SubmitResult | null>(null);

  /* ---- currency & cart store ---- */
  const { currency } = useCurrencyStore();
  const { items: cartItems, clearCart } = useCartStore();

  /* ================================================================ */
  /*  Fetch destinations                                               */
  /* ================================================================ */

  const fetchDestinations = useCallback(async () => {
    setDestLoading(true);
    setDestError(false);
    const { data, error } = await supabase
      .from('destinations')
      .select('id, name, iso_country_code')
      .order('name');
    if (error || !data) {
      console.error('Failed to load destinations', error);
      setDestError(true);
    } else {
      setDestinations(data);
      if (data.length > 0 && !destinationId) {
        setDestinationId(data[0].id);
      }
    }
    setDestLoading(false);
  }, [destinationId]);

  /* ================================================================ */
  /*  Fetch exchange rates (for cost estimate conversion)              */
  /* ================================================================ */

  const fetchRates = useCallback(async () => {
    const { data } = await supabase
      .from('exchange_rates')
      .select('currency_code, rate_to_idr');
    if (data) setRates(data);
  }, []);

  useEffect(() => {
    fetchDestinations();
    fetchRates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ================================================================ */
  /*  Derived: current exchange rate                                    */
  /* ================================================================ */

  const currentRate = useMemo(() => {
    if (currency === 'IDR') return null; // no conversion needed
    return rates.find((r) => r.currency_code === currency) ?? null;
  }, [currency, rates]);

  /* ================================================================ */
  /*  Helpers                                                          */
  /* ================================================================ */

  /** Strip non-digits from a WhatsApp number. */
  function sanitizeWa(raw: string): string {
    return raw.replace(/\D/g, '');
  }

  /** Build the WhatsApp redirect URL. */
  function buildWhatsappUrl(params: {
    orderCode: string;
    name: string;
    destination: string;
    link?: string;
    notes?: string;
    qty: number;
    estimate?: string;
  }): string {
    const lines = [
      `🛒 *Pesanan Baru — JastipBwi*`,
      `Kode: ${params.orderCode}`,
      `Nama: ${params.name}`,
      `Tujuan: ${params.destination}`,
    ];
    if (params.link) lines.push(`Link: ${params.link}`);
    if (params.notes) lines.push(`Catatan: ${params.notes}`);
    lines.push(`Jumlah: ${params.qty}`);
    if (params.estimate) lines.push(`Estimasi: ${params.estimate}`);
    lines.push('', 'Mohon diproses ya, terima kasih! 🙏');
    const text = encodeURIComponent(lines.join('\n'));
    return `https://wa.me/${ADMIN_WHATSAPP}?text=${text}`;
  }

  /* ================================================================ */
  /*  Image preview                                                    */
  /* ================================================================ */

  function handleImageChange(file: File | null) {
    setImageFile(file);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  }

  /* ================================================================ */
  /*  Submit handler                                                   */
  /* ================================================================ */

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitError('');

    /* -- validation -- */
    if (!customerName.trim()) {
      setSubmitError('Nama wajib diisi.');
      return;
    }
    if (!sanitizeWa(whatsapp)) {
      setSubmitError('Nomor WhatsApp wajib diisi.');
      return;
    }
    if (!destinationId) {
      setSubmitError('Pilih tujuan pengiriman.');
      return;
    }
    if (cartItems.length === 0 && !productLink.trim() && !imageFile && !notes.trim()) {
      setSubmitError(
        'Titipan kosong. Silakan tambah produk dari katalog atau isi form barang custom.'
      );
      return;
    }

    setSubmitting(true);

    try {
      /* -- upload image (if any) -- */
      let imageUrl: string | null = null;
      const orderId = crypto.randomUUID();

      if (imageFile) {
        const ext = imageFile.name.split('.').pop() ?? 'jpg';
        const storagePath = `${orderId}/${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from('order-images')
          .upload(storagePath, imageFile, {
            cacheControl: '3600',
            upsert: false,
          });
        if (uploadError) {
          setSubmitError(`Gagal upload foto: ${uploadError.message}`);
          setSubmitting(false);
          return;
        }
        const { data: urlData } = supabase.storage
          .from('order-images')
          .getPublicUrl(storagePath);
        imageUrl = urlData.publicUrl;
      }

      /* -- generate order code -- */
      const orderCode = generateOrderCode();

      /* -- insert order -- */
      const { error: orderError } = await supabase.from('orders').insert({
        id: orderId,
        order_code: orderCode,
        customer_name: customerName.trim(),
        whatsapp_number: sanitizeWa(whatsapp),
        destination_id: destinationId,
        status: 'Pending',
        display_currency: currency,
        // DO NOT set final_weight_kg, cargo_fee_idr, total_price_idr,
        // tracking_number — RLS requires these to be null on anon insert.
      });

      if (orderError) {
        setSubmitError(`Gagal membuat pesanan: ${orderError.message}`);
        setSubmitting(false);
        return;
      }

      /* -- prepare all items to insert -- */
      const itemsToInsert = [];

      // 1. Cart items
      for (const item of cartItems) {
        itemsToInsert.push({
          order_id: orderId,
          product_id: item.productId,
          custom_name: item.name,
          custom_price_idr: item.priceIdr,
          quantity: item.quantity,
          custom_image_url: item.imageUrl,
          custom_note: null,
        });
      }

      // 2. Custom item (if filled)
      const priceNum = parseFloat(estimatedPrice) || 0;
      if (productLink.trim() || imageFile || notes.trim()) {
        const itemName = notes.trim()
          ? notes.trim().substring(0, 80)
          : 'Titipan custom';

        itemsToInsert.push({
          order_id: orderId,
          product_id: null,
          custom_name: itemName,
          custom_price_idr: priceNum,
          custom_image_url: imageUrl,
          custom_note: [productLink.trim(), notes.trim()]
            .filter(Boolean)
            .join('\n'),
          quantity,
        });
      }

      /* -- insert order items -- */
      if (itemsToInsert.length > 0) {
        const { error: itemError } = await supabase.from('order_items').insert(itemsToInsert);
        if (itemError) {
          setSubmitError(`Gagal menyimpan item: ${itemError.message}`);
          setSubmitting(false);
          return;
        }
      }

      /* -- build estimate label for WA message -- */
      const cartSubtotal = cartItems.reduce((sum, i) => sum + i.priceIdr * i.quantity, 0);
      const customSubtotal = priceNum * quantity;
      const goodsTotal = cartSubtotal + customSubtotal;
      
      let estimateLabel: string | undefined;
      if (goodsTotal > 0) {
        const est = goodsTotal + goodsTotal * SERVICE_MARGIN + PACKING_FEE_IDR;
        estimateLabel = `Rp ${est.toLocaleString('id-ID')}`;
      }

      /* -- find destination name for WA message -- */
      const destName =
        destinations.find((d) => d.id === destinationId)?.name ?? '';

      /* -- calculate total items for WA -- */
      const totalQty = cartItems.reduce((sum, i) => sum + i.quantity, 0) + (itemsToInsert.length > cartItems.length ? quantity : 0);

      /* -- redirect to WhatsApp -- */
      const waUrl = buildWhatsappUrl({
        orderCode,
        name: customerName.trim(),
        destination: destName,
        link: productLink.trim() || undefined,
        notes: notes.trim() || undefined,
        qty: totalQty,
        estimate: estimateLabel,
      });

      window.open(waUrl, '_blank');

      /* -- success: clear cart & show confirmation screen -- */
      clearCart();

      /* -- show confirmation screen -- */
      setResult({ orderCode, customerName: customerName.trim() });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan.';
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  /* ================================================================ */
  /*  Render: confirmation screen (post-submit)                        */
  /* ================================================================ */

  if (result) {
    return (
      <OrderConfirmation
        orderCode={result.orderCode}
        customerName={result.customerName}
      />
    );
  }

  /* ================================================================ */
  /*  Render: form                                                     */
  /* ================================================================ */

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* -------- Cart Summary (if any) -------- */}
      {cartItems.length > 0 && <CartSummary />}

      {/* -------- Customer name -------- */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Nama Pemesan <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Nama lengkap"
        />
      </div>

      {/* -------- WhatsApp number -------- */}
      <div>
        <label htmlFor="wa" className="block text-sm font-medium mb-1">
          Nomor WhatsApp <span className="text-red-500">*</span>
        </label>
        <input
          id="wa"
          type="tel"
          inputMode="numeric"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="08xxxxxxxxxx"
        />
      </div>

      {/* -------- Destination -------- */}
      <div>
        <label htmlFor="dest" className="block text-sm font-medium mb-1">
          Tujuan Pengiriman <span className="text-red-500">*</span>
        </label>

        {destLoading ? (
          <div className="flex items-center space-x-2 text-gray-500 py-3">
            <Loader2 className="animate-spin h-4 w-4" />
            <span>Memuat tujuan…</span>
          </div>
        ) : destError ? (
          <div className="flex items-center space-x-2">
            <span className="text-red-600 text-sm">
              Gagal memuat tujuan.
            </span>
            <button
              type="button"
              onClick={fetchDestinations}
              className="flex items-center space-x-1 text-sm text-primary underline"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Coba lagi</span>
            </button>
          </div>
        ) : (
          <select
            id="dest"
            value={destinationId}
            onChange={(e) => setDestinationId(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {destinations.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.iso_country_code})
              </option>
            ))}
          </select>
        )}
      </div>

      {/* -------- Product link -------- */}
      <div>
        <label htmlFor="link" className="block text-sm font-medium mb-1">
          Link Produk{' '}
          <span className="text-gray-400 text-xs">(opsional)</span>
        </label>
        <input
          id="link"
          type="url"
          value={productLink}
          onChange={(e) => setProductLink(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="https://tokopedia.com/…"
        />
      </div>

      {/* -------- Image upload -------- */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Foto Barang{' '}
          <span className="text-gray-400 text-xs">(opsional)</span>
        </label>
        <label
          htmlFor="image-upload"
          className="flex items-center justify-center gap-2 w-full rounded-lg border-2 border-dashed border-gray-300 px-4 py-6 cursor-pointer hover:border-primary transition-colors"
        >
          <Upload className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-500">
            {imageFile ? imageFile.name : 'Ketuk untuk pilih foto'}
          </span>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) =>
              handleImageChange(e.target.files?.[0] ?? null)
            }
          />
        </label>
        {imagePreview && (
          <div className="mt-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imagePreview}
              alt="Preview"
              className="rounded-lg max-h-48 object-contain"
            />
            <button
              type="button"
              onClick={() => handleImageChange(null)}
              className="text-xs text-red-500 underline mt-1"
            >
              Hapus foto
            </button>
          </div>
        )}
      </div>

      {/* -------- Notes -------- */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium mb-1">
          Catatan / Daftar Belanja{' '}
          <span className="text-gray-400 text-xs">
            (wajib jika tidak ada link & foto)
          </span>
        </label>
        <textarea
          id="notes"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Contoh: Sambal Bu Rudy 3 botol, Kopi Banyuwangi 2 bungkus…"
        />
      </div>

      {/* -------- Quantity -------- */}
      <div>
        <label htmlFor="qty" className="block text-sm font-medium mb-1">
          Jumlah
        </label>
        <input
          id="qty"
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
          className="w-24 rounded-lg border border-gray-300 px-4 py-3 text-base text-center focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* -------- Estimated price (optional) -------- */}
      <div>
        <label htmlFor="price" className="block text-sm font-medium mb-1">
          Perkiraan Harga Barang (IDR){' '}
          <span className="text-gray-400 text-xs">(opsional)</span>
        </label>
        <input
          id="price"
          type="number"
          inputMode="numeric"
          min={0}
          value={estimatedPrice}
          onChange={(e) => setEstimatedPrice(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Contoh: 50000"
        />
      </div>

      {/* -------- Cost estimate (shown when there is cart items or price is entered) -------- */}
      {(parseFloat(estimatedPrice) > 0 || cartItems.length > 0) && (
        <CostEstimate
          itemPriceIdr={parseFloat(estimatedPrice) || 0}
          quantity={quantity}
          cartSubtotalIdr={cartItems.reduce((sum, i) => sum + i.priceIdr * i.quantity, 0)}
          currency={currency}
          rate={currentRate?.rate_to_idr ?? null}
        />
      )}

      {/* -------- Error message -------- */}
      {submitError && (
        <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
          ⚠️ {submitError}
        </div>
      )}

      {/* -------- Submit button -------- */}
      <button
        type="submit"
        disabled={submitting || destLoading || destError}
        className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary text-white font-semibold py-4 text-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
      >
        {submitting ? (
          <>
            <Loader2 className="animate-spin h-5 w-5" />
            Mengirim…
          </>
        ) : (
          '📩 Kirim Pesanan via WhatsApp'
        )}
      </button>
    </form>
  );
}
