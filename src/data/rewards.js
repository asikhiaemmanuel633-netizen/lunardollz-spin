// Each reward's `weight` controls its odds (weights don't need to sum to 100,
// they're just relative). `claimable: false` means "no prize" (e.g. Try Again).
// `maxInReel` caps how many times that reward can appear in the scrolling
// reel for a single spin (the visual filler tiles, not the real odds) —
// keep the non-NFT caps generous (well over half of TRACK_LENGTH combined)
// so there's always enough room to fill the reel without ever needing to
// duplicate an NFT tile as a fallback. `pityEligible: true` marks a reward
// as one a wallet's first few spins are allowed to land on (see
// PITY_SPIN_THRESHOLD in ReelSpinner.jsx) — everything else is excluded
// during that window. The NFT rewards stay capped at 1 in the reel — each
// is a unique piece, so it should never appear twice in the same spin.
export const REWARDS = [
  { id: 'tryagain',  name: 'Try Again',          weight: 60,  color: '#3A3066', text: '#EEE9FA', icon: '✕', maxInReel: 12, pityEligible: true, desc: 'No relic this time. The moon is quiet — come back soon.', claimable: false },
  { id: 'empire',    name: 'EMPIRE',              weight: 100, color: '#D98A3D', text: '#2B1500', icon: '🏙', image: '/nft/empire-token.png', maxInReel: 15, pityEligible: true, desc: '$EMPIRE tokens added to your wallet.', claimable: true },
  { id: 'points',    name: 'XMA',                   weight: 750, color: '#A56CF0', text: '#1A1330', icon: '✦', image: '/nft/xma-token.png', maxInReel: 20, pityEligible: true, desc: '5 $XMA tokens added to your wallet.', claimable: true },
  { id: 'mask',      name: 'MEFO',                   weight: 25,  color: '#6B3FCB', text: '#EEE9FA', icon: '◈', image: '/nft/rare-doll-mask.jpg', maxInReel: 1, desc: 'A rare MEFO. Only a fraction of spinners pull this.', nft: true, claimable: true },
  { id: 'punk',      name: 'MEFO',                  weight: 15,  color: '#5AC8E8', text: '#0B2733', icon: '✷', image: '/nft/mefo-punk.jpg', maxInReel: 1, desc: 'A MEFOLabs punk with fire in its eyes.', nft: true, claimable: true },
  { id: 'skeleton',  name: 'MEFO (Skeleton)',     weight: 8,   color: '#7A2E2E', text: '#F5E6C8', icon: '☠', image: '/nft/skeleton.jpg', maxInReel: 1, desc: 'A skeleton MEFO in ornate armor, standing watch under a full moon.', nft: true, claimable: true },
  { id: 'sharx',     name: 'LeSharx',                weight: 8,   color: '#1D6FA5', text: '#EAF6FF', icon: '🦈', image: '/nft/lesharx.jpg', maxInReel: 1, desc: 'A deep-sea diver MEFO, pipe and all.', nft: true, claimable: true },
  { id: 'gigabug',   name: 'Gigabug',             weight: 8,   color: '#3F6B3A', text: '#EAF6E4', icon: '🪲', image: '/nft/gigabug.jpg', maxInReel: 1, desc: 'A ceremonial beetle, cloaked in violet armor.', nft: true, claimable: true },
  { id: 'sotr',       name: 'Shadow of the Sun',   weight: 8,   color: '#D4AF37', text: '#241A05', icon: '🛡', image: '/nft/shadow-of-the-sun.jpg', maxInReel: 1, desc: 'A monkey king in golden armor, sword drawn.', nft: true, claimable: true },
  { id: 'charm',     name: 'MEFO (Epic)',         weight: 3,   color: '#E7B75D', text: '#241A05', icon: '❖', image: '/nft/epic-voodoo-charm.jpg', maxInReel: 1, desc: 'An epic MEFO, said to bring good fortune to its holder.', nft: true, claimable: true },
  { id: 'moonstone', name: 'MEFO',                   weight: 1,   color: '#FBE8B8', text: '#241A05', icon: '☾', image: '/nft/legendary-moonstone.jpg', maxInReel: 1, desc: 'The rarest MEFO on the reel. Very few holders will ever see one.', nft: true, claimable: true },
];
