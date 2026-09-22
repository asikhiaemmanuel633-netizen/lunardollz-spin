// --- CHANGE THIS before going live -----------------------------------------
// This is the wallet address that receives SOL when someone buys tickets.
// It must be a normal wallet address (not a program address) — put your own
// Phantom/Solflare address here so test purchases actually land somewhere.
// A leftover placeholder here is why "purchase failed" can happen: Solana's
// System Program address (the previous placeholder) refuses to receive
// transfers because it's a program, not a wallet.
export const TREASURY_WALLET = '3DZ6p4Ro6E8HH6FVPf7RGHNYjjgxz8mJ3595h8n3PfSj';
// -----------------------------------------------------------------------

// Price per ticket, in SOL. On devnet this is test SOL (free from a faucet);
// on mainnet-beta it would be real money.
export const TICKET_PRICE_SOL = 0.01;

// --- Vault claim server ------------------------------------------------
// Where the vault backend (the separate lunardollz-vault-server project)
// is running. While testing locally with `npm start` there, this is right.
export const CLAIM_API_URL = 'https://lunardollz.duckdns.org/api/claim';
export const INVENTORY_API_URL = 'https://lunardollz.duckdns.org/api/inventory';
export const RESERVE_API_URL = 'https://lunardollz.duckdns.org/api/reserve';
export const RECORD_SPIN_API_URL = 'https://lunardollz.duckdns.org/api/record-spin';
export const LEADERBOARD_API_URL = 'https://lunardollz.duckdns.org/api/leaderboard';
export const SPIN_COUNT_API_URL = 'https://lunardollz.duckdns.org/api/spin-count';
// Must match CLAIM_SHARED_SECRET in the vault server's .env exactly.
// This is visible to anyone who inspects the website's code — it's a basic
// filter, not real security. See the vault server's README for the full
// security note.
export const CLAIM_API_SECRET = '9dace0da-1451-4398-b5be-ea0bb3f7d3d3';
// -----------------------------------------------------------------------

// --- Mainnet RPC endpoint -----------------------------------------------
// Solana's default public mainnet RPC (used automatically otherwise)
// frequently returns 403 Access Forbidden for real browser traffic — it's
// rate-limited and not meant for actual app use. Get a free API key from
// https://www.helius.dev (or QuickNode, Alchemy, Triton, etc.) and paste
// your mainnet RPC URL here. Leave it as the placeholder and the site falls
// back to the public endpoint, which is what's causing the 403 right now.
export const MAINNET_RPC_URL = 'https://mainnet.helius-rpc.com/?api-key=a0991911-46ae-438f-b8b2-7b821aa7706a';
// -----------------------------------------------------------------------

