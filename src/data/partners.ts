// Partner registry — matches the "Partner registry" data model in the brief
// (Section 7): id, name, category, markets, referral mechanism, disclosure label.
// This seed file covers what's confirmed today (Palmera). Add financing
// partners here the same way once signed, each with its own `label`.

export type DisclosureLabel = 'referral-partner' | 'sponsored';

export interface Partner {
  id: string;
  name: string;
  category: 'property' | 'financing' | 'tools' | 'courses' | 'e-guide';
  markets: string[];
  referralMechanism: 'api' | 'manual' | 'link';
  label: DisclosureLabel;
  referralCode?: string;
  notes?: string;
}

export const partners: Partner[] = [
  {
    id: 'palmera',
    name: 'Palmera Elite Real Estate Brokerage L.L.C.',
    category: 'property',
    markets: ['uae', 'oman', 'georgia', 'cyprus'],
    referralMechanism: 'manual',
    label: 'referral-partner',
    referralCode: 'JZA7SG',
    notes:
      'RERA Licence Dubai 40780, Trade Licence 1306924. Paid 30% of Palmera\'s net ' +
      'commission on completed off-plan purchases only. No lead-submission API — ' +
      'enquiries are registered with Palmera manually via the Partner Area. ' +
      'Non-exclusive (contract clause 2.4).',
  },
];

export function getPartner(id: string): Partner | undefined {
  return partners.find((p) => p.id === id);
}

export const labelCopy: Record<DisclosureLabel, { text: string; description: string }> = {
  'referral-partner': {
    text: 'Referral partner',
    description:
      'Amsi Spaces earns a fee only if this leads to a completed transaction with the partner.',
  },
  sponsored: {
    text: 'Sponsored',
    description:
      'Amsi Spaces may earn a fee on a click or signup here, not tied to a property transaction.',
  },
};
