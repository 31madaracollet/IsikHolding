export const SHIPPING_FEE = 79;
export const FREE_SHIPPING_THRESHOLD = 500;

export const COUPONS: Record<string, { rate: number; label: string }> = {
  ISIK15: { rate: 0.15, label: "Kulüp indirimi %15" },
  HOSGELDIN10: { rate: 0.1, label: "Hoş geldin indirimi %10" },
};

export function roundMoney(value: number) {
  return Math.round(value * 100) / 100;
}

export function calculateTotals(subtotal: number, couponCode?: string | null) {
  const normalized = couponCode?.trim().toUpperCase() ?? "";
  const coupon = COUPONS[normalized];
  const discount = coupon ? roundMoney(subtotal * coupon.rate) : 0;
  const afterDiscount = roundMoney(subtotal - discount);
  const shipping =
    afterDiscount === 0 || afterDiscount >= FREE_SHIPPING_THRESHOLD
      ? 0
      : SHIPPING_FEE;
  const total = roundMoney(afterDiscount + shipping);

  return {
    subtotal: roundMoney(subtotal),
    discount,
    shipping,
    total,
    coupon: coupon ? normalized : null,
    freeShippingRemaining: Math.max(
      0,
      roundMoney(FREE_SHIPPING_THRESHOLD - afterDiscount),
    ),
  };
}

export function makeOrderNumber() {
  const now = new Date();
  const date = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `ISH-${date}-${random}`;
}
