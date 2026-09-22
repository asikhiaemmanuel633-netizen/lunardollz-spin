import { useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import { MAINNET_RPC_URL } from '../config';

// This must match the vault server's RPC_URL network. Real assets and real
// SOL are involved on mainnet-beta — no faucets, nothing free, nothing
// reversible from here.
const NETWORK = 'mainnet-beta';

export default function WalletContextProvider({ children }) {
  const endpoint = useMemo(() => {
    // Use a dedicated RPC (Helius/QuickNode/etc.) on mainnet if one's been
    // set — Solana's public mainnet endpoint often 403s real browser
    // traffic. Falls back to the public endpoint (and devnet always uses
    // it, since that one's fine for testing).
    if (NETWORK === 'mainnet-beta' && MAINNET_RPC_URL && !MAINNET_RPC_URL.startsWith('REPLACE')) {
      return MAINNET_RPC_URL;
    }
    return clusterApiUrl(NETWORK);
  }, []);

  // No manual adapter list needed: modern wallets (Phantom, Solflare,
  // Backpack, etc.) register themselves automatically via the Wallet
  // Standard as long as their browser extension is installed. This also
  // avoids @solana/wallet-adapter-wallets, whose dependency tree pulls in
  // adapters for other chains (Stellar, WalletConnect, ...) you don't need.
  const wallets = useMemo(() => [], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
