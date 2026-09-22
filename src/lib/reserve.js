import { RESERVE_API_URL, CLAIM_API_SECRET } from '../config';

// Returns { reserved: true, type: 'nft' | 'token', mint? } or { reserved: false }
// (the reward is genuinely out of stock — someone else just took the last one).
export async function reserveReward({ walletAddress, rewardId }) {
  const response = await fetch(RESERVE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-claim-secret': CLAIM_API_SECRET,
    },
    body: JSON.stringify({ wallet: walletAddress, rewardId }),
  });

  if (!response.ok) {
    // Treat a server/network problem as "couldn't reserve" rather than
    // throwing — the spin should still gracefully fall back to something
    // else instead of breaking entirely.
    return { reserved: false };
  }

  return response.json();
}
