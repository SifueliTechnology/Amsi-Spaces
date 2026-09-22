// Prices are always shown in the project's own market currency — never
// converted (brief Section 4 and Section 7 compliance rules). This just
// formats, it never converts.

const LOCALES: Record<string, string> = {
  AED: 'en-AE',
  EUR: 'en-CY',
  OMR: 'en-OM',
  SAR: 'en-SA',
  USD: 'en-US',
};

export function formatPrice(amount: number | null, currency: string): string {
  if (amount == null) return 'Price on application';
  const locale = LOCALES[currency] ?? 'en-US';
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}
