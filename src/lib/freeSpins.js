import { FREE_SPINS_API_URL, CLAIM_API_SECRET } from '../config';

// Returns { granted: true, alreadyClaimed: false, ticketsAwarded: 3 } the
// first time a wallet calls this, or { granted: false, alreadyClaimed: true,
// ticketsAwarded: 0 } every time after — safe to call on every connect.
export async function claimFreeSpins(walletAddress) {
  const response = await fetch(FREE_SPINS_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-claim-secret': CLAIM_API_SECRET,
    },
    body: JSON.stringify({ wallet: walletAddress }),
  });

  if (!response.ok) {
    // Treat a server/network problem as "nothing granted" rather than
    // throwing — a hiccup here shouldn't break the page.
    return { granted: false };
  }

  return response.json();
}