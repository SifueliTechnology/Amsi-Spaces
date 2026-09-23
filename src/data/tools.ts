// Tools tab + homepage "Tools & courses" seed data. Simple shape so this file
// can be edited directly to change what shows on both the homepage and
// /resources?tab=tools without touching any component code.
// Placeholder entries — swap for real affiliate partners once signed.

export interface ToolEntry {
  name: string;
  blurb: string;
  price?: string;
  href: string;
}

export const tools: ToolEntry[] = [
  {
    name: 'Mortgage Repayment Calculator',
    blurb: 'Estimate monthly repayments across currencies.',
    href: '/go/tool-calculator-partner',
  },
  {
    name: 'Currency Converter Widget',
    blurb: 'Live rates for AED, EUR, OMR, SAR, USD.',
    href: '/go/tool-fx-partner',
  },
];
