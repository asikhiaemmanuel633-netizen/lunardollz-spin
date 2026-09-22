import { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram, Transaction, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { TREASURY_WALLET, TICKET_PRICE_SOL } from '../config';

export default function BuyTickets({ ticketCount, onBought }) {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  async function buy(count) {
    if (!publicKey || busy) return;
    setError(null);

    if (TREASURY_WALLET === 'REPLACE_WITH_YOUR_WALLET_ADDRESS') {
      setError('Set TREASURY_WALLET in src/config.js to a real wallet address first.');
      return;
    }

    setBusy(true);
    try {
      const lamports = Math.round(TICKET_PRICE_SOL * LAMPORTS_PER_SOL) * count;
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(TREASURY_WALLET),
          lamports,
        })
      );

      // Set these explicitly rather than relying on the wallet to fill them
      // in — some wallets are stricter about needing a ready-to-sign
      // transaction than others.
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      const signature = await sendTransaction(transaction, connection);
      // Wait for the network to confirm before crediting tickets — otherwise
      // someone could close the tab mid-transaction and still get tickets
      // for a payment that never actually landed.
      await connection.confirmTransaction(signature, 'confirmed');

      onBought(count);
    } catch (err) {
      console.error('Ticket purchase failed:', err);
      const msg = err?.message || '';
      if (msg.toLowerCase().includes('insufficient')) {
        setError('Not enough SOL in your wallet.');
      } else if (msg.toLowerCase().includes('invalid account')) {
        // On Solana, a wallet that has never held any SOL doesn't exist as
        // an account on-chain yet — this is that case, not a real bug.
        setError('This wallet has no SOL yet. Add some SOL to your wallet first, then try again.');
      } else if (msg.toLowerCase().includes('user rejected')) {
        setError('You cancelled the transaction.');
      } else {
        // Surface the real message so you can tell what went wrong —
        // check the browser console for the full error too.
        setError(`Purchase failed: ${msg || 'unknown error'}`);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="buy-tickets">
      <div className="buy-tickets-head">
        <span className="ticket-count">🎟 {ticketCount} {ticketCount === 1 ? 'ticket' : 'tickets'}</span>
      </div>
      <div className="buy-tickets-row">
        <button className="btn btn-ghost" disabled={busy} onClick={() => buy(1)}>
          {busy ? 'Confirming…' : `Buy 1 (${TICKET_PRICE_SOL} SOL)`}
        </button>
        <button className="btn btn-ghost" disabled={busy} onClick={() => buy(5)}>
          {busy ? 'Confirming…' : `Buy 5 (${(TICKET_PRICE_SOL * 5).toFixed(2)} SOL)`}
        </button>
      </div>
      {error && <div className="buy-tickets-error">{error}</div>}
    </div>
  );
}
