import { RECORD_SPIN_API_URL, LEADERBOARD_API_URL, CLAIM_API_SECRET } from '../config';

// Fire-and-forget: a leaderboard miscount is not worth blocking or failing
// someone's spin over, so errors here are logged, not thrown.
export async function recordSpin(walletAddress) {
  try {
    await fetch(RECORD_SPIN_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-claim-secret': CLAIM_API_SECRET,
      },
      body: JSON.stringify({ wallet: walletAddress }),
    });
  } catch (err) {
    console.error('Failed to record spin for leaderboard:', err);
  }
}

export async function fetchLeaderboard() {
  const response = await fetch(LEADERBOARD_API_URL);
  if (!response.ok) throw new Error('Failed to load leaderboard');
  return response.json(); // [{ wallet, spins }, ...] sorted highest first
}
