import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';

function shorten(address) {
  return address.slice(0, 4) + '…' + address.slice(-4);
}

export default function ConnectButton() {
  const { publicKey, connecting, disconnect } = useWallet();
  const { setVisible } = useWalletModal();

  if (publicKey) {
    return (
      <button className="btn btn-ghost wallet-chip" onClick={disconnect} title="Click to disconnect">
        <span className="dot" aria-hidden="true" />
        {shorten(publicKey.toBase58())}
      </button>
    );
  }

  return (
    <button className="btn" onClick={() => setVisible(true)} disabled={connecting}>
      {connecting ? 'Connecting…' : 'Connect Wallet'}
    </button>
  );
}
