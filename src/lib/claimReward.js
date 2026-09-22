import { CLAIM_API_URL, CLAIM_API_SECRET } from '../config';

// Asks the vault server to send a real, pre-minted NFT to the winner's
// wallet. The winner doesn't sign anything here — receiving a token only
// needs their public address, not their signature — so this is a plain
// network request, not a wallet transaction.
export async function claimRewardFromVault({ walletAddress, rewardId }) {
  const response = await fetch(CLAIM_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-claim-secret': CLAIM_API_SECRET,
    },
    body: JSON.stringify({ wallet: walletAddress, rewardId }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Claim server returned ${response.status}`);
  }

  return data; // { signature, mint }
}
