import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { REWARDS } from '../data/rewards';
import { INVENTORY_API_URL, SPIN_COUNT_API_URL } from '../config';
import { reserveReward } from '../lib/reserve';

const ITEM_WIDTH = 112;
const TRACK_LENGTH = 48;
const GOAL_INDEX = TRACK_LENGTH - 6;
const SPIN_DURATION_MS = 4300;
const PITY_SPIN_THRESHOLD = 5; // a wallet's first N spins can never land on an NFT

// `reward.nft` (not just "has an image") is what actually means "this is a
// scarce, unique vault item" — XMA/EMPIRE have images too (for display) but
// are fungible tokens with no stock limit, so they must NOT be treated like
// an NFT here. `availability` is the {rewardId: count} map from the vault
// server's /api/inventory — null means "couldn't check, assume available"
// so a network hiccup doesn't block spinning.
//
// Two separate eligibility rules, on purpose: what a wallet can actually
// WIN during its pity window is restricted (only `pityEligible` rewards),
// but what can appear as a scrolling filler TILE is not — NFTs should still
// tease past on the reel for excitement even while they can't be landed on
// yet, as long as they're actually still in stock.
function isResultEligible(reward, availability, safeMode) {
  if (safeMode) return !!reward.pityEligible;
  if (!reward.nft) return true;
  if (!availability) return true;
  return (availability[reward.id] ?? 0) > 0;
}

function isFillerEligible(reward, availability) {
  if (!reward.nft) return true;
  if (!availability) return true;
  return (availability[reward.id] ?? 0) > 0;
}

function randomReward(availability) {
  const eligible = REWARDS.filter((r) => isFillerEligible(r, availability));
  const pool = eligible.length ? eligible : REWARDS;
  return pool[Math.floor(Math.random() * pool.length)];
}

function pickWeightedReward(availability, safeMode) {
  const eligible = REWARDS.filter((r) => isResultEligible(r, availability, safeMode));
  const pool = eligible.length ? eligible : REWARDS;
  const total = pool.reduce((sum, r) => sum + r.weight, 0);
  let roll = Math.random() * total;
  for (const r of pool) {
    roll -= r.weight;
    if (roll <= 0) return r;
  }
  return pool[pool.length - 1];
}

function isUnderCap(reward, counts) {
  if (reward.maxInReel == null) return true; // uncapped (e.g. Try Again)
  return (counts[reward.id] || 0) < reward.maxInReel;
}

const APPROACH_ZONE_SIZE = 16; // how many tiles right before the stop get the "near miss" NFT flash

// Fills the scrolling reel. The last stretch before the stop is special:
// every NFT that's currently in stock gets exactly one appearance, at a
// random position within that stretch, scattered among token/Try Again
// tiles — so as the reel slows down toward landing, it genuinely looks like
// it could stop on any of them, building real suspense, before settling on
// whatever the actual result is. Everywhere else fills with normal random
// filler. `target` (the actual result) sits at GOAL_INDEX and counts toward
// its own cap like any other appearance.
function buildTrack(target, availability) {
  const counts = {};
  const items = new Array(TRACK_LENGTH);

  items[GOAL_INDEX] = target;
  counts[target.id] = 1;

  const nftCandidates = REWARDS.filter(
    (r) => r.nft && r.id !== target.id && isFillerEligible(r, availability)
  );

  const zoneStart = Math.max(0, GOAL_INDEX - APPROACH_ZONE_SIZE);
  const zoneIndices = [];
  for (let i = zoneStart; i < GOAL_INDEX; i++) zoneIndices.push(i);
  for (let i = zoneIndices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [zoneIndices[i], zoneIndices[j]] = [zoneIndices[j], zoneIndices[i]];
  }

  const nftSlotCount = Math.min(nftCandidates.length, zoneIndices.length);
  const reservedIndices = new Set([GOAL_INDEX]);
  for (let k = 0; k < nftSlotCount; k++) {
    const idx = zoneIndices[k];
    const nft = nftCandidates[k];
    items[idx] = nft;
    counts[nft.id] = (counts[nft.id] || 0) + 1;
    reservedIndices.add(idx);
  }

  for (let i = 0; i < TRACK_LENGTH; i++) {
    if (reservedIndices.has(i)) continue;

    let candidate = randomReward(availability);
    let attempts = 0;
    while (!isUnderCap(candidate, counts) && attempts < 30) {
      candidate = randomReward(availability);
      attempts++;
    }
    if (!isUnderCap(candidate, counts)) {
      // Nothing under its own cap was found. Never let this become an NFT
      // duplicate as a last resort — fall back to any non-NFT reward even
      // if it means that one slightly exceeds its own cap.
      candidate = REWARDS.find((r) => isUnderCap(r, counts))
        || REWARDS.find((r) => !r.nft)
        || candidate;
    }

    counts[candidate.id] = (counts[candidate.id] || 0) + 1;
    items[i] = candidate;
  }

  return items;
}

// The idle reel (before anyone has spun) only shows its first few tiles in
// the visible window — with plain random picks, that meant it was down to
// luck whether every reward type (like the token) ever showed up there, and
// nothing stopped the same tile appearing twice right next to each other.
// This guarantees one of every reward type appears (shuffled) before any
// repeats, so the resting reel always shows the full variety.
function buildIdleTrack() {
  const shuffled = [...REWARDS].sort(() => Math.random() - 0.5);
  const counts = {};
  shuffled.forEach((r) => { counts[r.id] = 1; });

  const items = [...shuffled];
  while (items.length < TRACK_LENGTH) {
    let candidate = randomReward();
    let attempts = 0;
    while (!isUnderCap(candidate, counts) && attempts < 30) {
      candidate = randomReward();
      attempts++;
    }
    if (!isUnderCap(candidate, counts)) {
      candidate = REWARDS.find((r) => isUnderCap(r, counts)) || candidate;
    }
    counts[candidate.id] = (counts[candidate.id] || 0) + 1;
    items.push(candidate);
  }

  return items;
}

// Exposes a `spin()` method via ref so the parent decides when a spin is
// allowed (wallet connected, has a ticket, etc.) and reacts to the result.
const ReelSpinner = forwardRef(function ReelSpinner({ onSpinStart, onResult }, ref) {
  const windowRef = useRef(null);
  const trackRef = useRef(null);
  const spinningRef = useRef(false);
  const [items, setItems] = useState(() => buildIdleTrack());

  useImperativeHandle(ref, () => ({
    async spin(localSpinsSoFar = 0, walletAddress) {
      if (spinningRef.current) return;
      spinningRef.current = true;
      onSpinStart && onSpinStart();

      // Ask the vault server how many spins this wallet has actually
      // completed — this is what makes the pity window apply per-wallet
      // no matter which browser/device someone uses, rather than trusting
      // whatever this browser's own localStorage happens to say. Falls
      // back to the locally-tracked count if the server can't be reached,
      // so a network hiccup doesn't change the game's behavior unexpectedly.
      let spinsSoFar = localSpinsSoFar;
      if (walletAddress) {
        try {
          const res = await fetch(`${SPIN_COUNT_API_URL}/${walletAddress}`);
          if (res.ok) {
            const data = await res.json();
            spinsSoFar = data.spins;
          }
        } catch (err) {
          console.warn('Could not verify spin count from server — using local count as fallback:', err);
        }
      }

      const safeMode = spinsSoFar < PITY_SPIN_THRESHOLD;

      // Check real vault stock before picking a result, so a sold-out NFT
      // can never be "won" and then fail to claim.
      let availability = null;
      try {
        const res = await fetch(INVENTORY_API_URL);
        if (res.ok) availability = await res.json();
      } catch (err) {
        console.warn('Could not reach vault server for stock check — spinning without it:', err);
      }

      // Pick a result — and if it's an NFT, actually reserve that specific
      // mint with the vault server right now (not just trust the stock
      // count above, which could already be stale by the time this runs).
      // This is what stops two people spinning at the same moment from both
      // being told they won the same one-of-a-kind piece: whoever's
      // reservation lands first gets it, the other sees it as sold out and
      // gets re-rolled onto something else instead.
      let reward = pickWeightedReward(availability, safeMode);
      let reserved = !reward.nft; // only real NFTs need reservation
      let attempts = 0;
      while (!reserved && attempts < 5) {
        if (!walletAddress) break; // can't reserve without knowing who's spinning
        const result = await reserveReward({ walletAddress, rewardId: reward.id });
        if (result.reserved) {
          reserved = true;
          break;
        }
        availability = { ...(availability || {}), [reward.id]: 0 };
        reward = pickWeightedReward(availability, safeMode);
        reserved = !reward.nft;
        attempts++;
      }
      if (!reserved) {
        // Couldn't secure any NFT (or no wallet address to reserve under) —
        // fall back to a reward that never needs reservation, so the spin
        // always completes with something real rather than a phantom win.
        const noNftAvailability = { ...(availability || {}) };
        REWARDS.filter((r) => r.nft).forEach((r) => { noNftAvailability[r.id] = 0; });
        reward = pickWeightedReward(noNftAvailability, safeMode);
      }

      setItems(buildTrack(reward, availability));

      const track = trackRef.current;
      const win = windowRef.current;
      if (!track || !win) return;

      // Reset instantly to the start, then animate forward to the goal —
      // this is what gives every spin the same "run-up" length.
      track.style.transition = 'none';
      track.style.transform = 'translateX(0px)';
      // eslint-disable-next-line no-unused-expressions
      track.offsetWidth; // force reflow so the reset above actually applies

      const winWidth = win.getBoundingClientRect().width;
      const jitter = (Math.random() * 0.6 - 0.3) * ITEM_WIDTH;
      const targetCenter = GOAL_INDEX * ITEM_WIDTH + ITEM_WIDTH / 2;
      const finalX = -(targetCenter - winWidth / 2 + jitter);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          track.style.transition = '';
          track.style.transform = `translateX(${finalX}px)`;
        });
      });

      window.setTimeout(() => {
        spinningRef.current = false;
        onResult(reward);
      }, SPIN_DURATION_MS);
    },
  }));

  return (
    <div className="reel-stage">
      <div className="reel-arrow" aria-hidden="true" />
      <div className="reel-window" ref={windowRef}>
        <div className="reel-track" ref={trackRef}>
          {items.map((r, i) => (
            <div className={`reel-item${r.image ? ' has-image' : ''}`} key={i} style={{ background: r.color, color: r.text }}>
              {r.image ? (
                <>
                  <img className="reel-item-bg" src={r.image} alt={r.name} />
                  <span className="reel-item-label">{r.name}</span>
                </>
              ) : (
                <>
                  <span className="ic">{r.icon}</span>
                  <span className="nm">{r.name}</span>
                </>
              )}
            </div>
          ))}
        </div>
        <div className="reel-fade left" aria-hidden="true" />
        <div className="reel-fade right" aria-hidden="true" />
      </div>
    </div>
  );
});

export default ReelSpinner;
