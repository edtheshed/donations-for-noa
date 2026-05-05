import { unstable_cache } from 'next/cache';

const URL = 'https://www.justgiving.com/page/donations-for-noa';

export type JustGivingTotal = {
  amount: number;
  currency: string;
  donationCount: number;
};

async function fetchTotal(): Promise<JustGivingTotal | null> {
  try {
    const res = await fetch(URL, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; donations-for-noa/1.0)' },
    });
    if (!res.ok) return null;
    const html = await res.text();

    // The data lives in a streamed Next.js payload, embedded inside a JS string
    // literal so every `"` appears as `\"`. The `\\?` makes the backslash optional
    // so this works whether or not JustGiving ever ships the same payload raw.
    const amountMatch = html.match(
      /\\?"totalAmount\\?":\s*\{\s*\\?"value\\?":\s*(\d+(?:\.\d+)?)\s*,\s*\\?"currencyCode\\?":\s*\\?"([a-z]{3})\\?"/i,
    );
    if (!amountMatch) return null;

    const countMatch = html.match(
      /\\?"donationSummary\\?":\s*\{[^}]*?\\?"donationCount\\?":\s*(\d+)[^}]*?\\?"totalAmount\\?":\s*\{\s*\\?"value\\?":/,
    );

    // `value` is in minor units (pence for GBP). Confirmed against an active
    // page: the structured blob has `"value":1737571` for a page displaying
    // £17,375.71 — i.e. divide by 100.
    return {
      amount: Number(amountMatch[1]) / 100,
      currency: amountMatch[2].toUpperCase(),
      donationCount: countMatch ? Number(countMatch[1]) : 0,
    };
  } catch {
    return null;
  }
}

export const getJustGivingTotal = unstable_cache(
  fetchTotal,
  ['justgiving-total'],
  { revalidate: 3600 },
);
