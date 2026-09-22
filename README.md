# LunarDollz — Lucky Spins

A horizontal "roll the reel" prize page with a **real Solana wallet connection**
(Phantom / Solflare via `@solana/wallet-adapter`), built with Vite + React.

## Run it in VS Code

1. Open this folder in VS Code.
2. In the integrated terminal:
   ```bash
   npm install
   npm run dev
   ```
3. Open the printed `http://localhost:5173` link in a browser that has the
   [Phantom](https://phantom.app/) extension installed (Solflare works too).
4. Click **Connect Wallet** — a real Phantom popup will appear asking you to
   approve the connection.

That's it — no backend needed to see the wallet connect for real. The app
starts on Solana **devnet** so you don't need real funds to test with.

## What's real vs. what's a placeholder

| Piece | Status |
|---|---|
| Wallet connect / disconnect | **Real** — uses `@solana/wallet-adapter-react`, works with any installed wallet extension |
| Buying tickets | **Real** — sends an actual SOL transfer transaction to `TREASURY_WALLET` in `src/config.js`. **You must replace that placeholder address with your own wallet before this works.** |
| Reel spin + odds | Real client-side logic (weighted random pick), one ticket spent per roll |
| Claiming a reward | **Real, with a caveat.** Claiming mints a real 1-of-1 token directly into the player's own wallet (see `src/lib/claimReward.js`) — the player's wallet is its own minting authority and pays the tiny network fee, so no backend or private key is needed. The caveat: there's no server checking eligibility, so this only proves "this wallet asked to mint," not "this wallet actually won this prize" — fine for a beta, but for a version with real-value prizes, move minting to a backend or program that verifies the spin result first. It also mints a plain token, not a full Metaplex NFT with image/metadata — ask if you want that added next. |
| Spin history / ticket balance / vault | Real, but stored in the browser's `localStorage`, keyed per wallet address |

## Testing ticket purchases on devnet

Since the app runs on `devnet` by default, you need free test SOL, not real
money, to try buying tickets:

1. Get your wallet's devnet address (open Phantom, switch its network setting
   to **Devnet**, copy the address).
2. Airdrop yourself test SOL from a faucet, e.g. https://faucet.solana.com
3. Click **Buy 1** or **Buy 5** in the app — Phantom will pop up asking you to
   approve the transfer.

## Project structure

```
src/
  App.jsx                     — page layout, spin/claim orchestration
  config.js                   — ticket price + treasury wallet address
  index.css                   — all styling (cosmic/lunar theme)
  components/
    WalletContextProvider.jsx — sets up the Solana connection + wallet adapters
    ConnectButton.jsx         — connect/disconnect UI, opens the wallet picker modal
    BuyTickets.jsx            — sends a real SOL transfer to buy tickets
    ReelSpinner.jsx           — the horizontal reel, exposes spin() via ref
    RewardModal.jsx           — reveal modal after a spin, shows claim progress/errors
    Vault.jsx                 — claimed-rewards list, links to the mint on Solana Explorer
  data/rewards.js             — reward tiers, odds (weight), copy
  lib/claimReward.js          — mints the claimed reward token into the player's wallet
  hooks/useLocalState.js      — small localStorage-backed React state hook
```

## Before you go live

- Replace `TREASURY_WALLET` in `src/config.js` with a real wallet address you
  control — this is where ticket payments go.
- Switch `NETWORK` in `src/components/WalletContextProvider.jsx` from
  `'devnet'` to `'mainnet-beta'`.
- Adjust `TICKET_PRICE_SOL` in `src/config.js` to whatever you want to charge.
- Build the real claim endpoint described above, and swap the TODO block in
  `handleClaim()` for a call to it.
- Run `npm run build` to produce a static `dist/` folder you can deploy
  anywhere (Vercel, Netlify, Cloudflare Pages, your own server, etc.).
