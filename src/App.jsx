import { useMemo, useRef, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import ConnectButton from './components/ConnectButton';
import ReelSpinner from './components/ReelSpinner';
import RewardModal from './components/RewardModal';
import Vault from './components/Vault';
import BuyTickets from './components/BuyTickets';
import Leaderboard from './components/Leaderboard';
import HomePage from './components/HomePage';
import BackgroundSlideshow from './components/BackgroundSlideshow';
import AboutPage from './components/AboutPage';
import { REWARDS } from './data/rewards';
import { useLocalState } from './hooks/useLocalState';
import { claimRewardFromVault } from './lib/claimReward';
import { recordSpin } from './lib/leaderboard';
import ReaperRunner from './components/ReaperRunner';

export default function App() {
  const { publicKey, connected } = useWallet();
  const reelRef = useRef(null);
  const [page, setPage] = useState('home');

  const [spinning, setSpinning] = useState(false);
  const [pendingReward, setPendingReward] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [claimError, setClaimError] = useState(null);
  const [claimSuccess, setClaimSuccess] = useState(false);
  const [vaultClaimingId, setVaultClaimingId] = useState(null);
  const [vaultClaimErrors, setVaultClaimErrors] = useState({});

  const storageKey = publicKey ? `ldz_${publicKey.toBase58()}` : 'ldz_guest';
  const [walletState, setWalletState] = useLocalState(storageKey, {
    tickets: 0,
    spinCount: 0,
    vault: [],
  });

  const tickets = walletState.tickets || 0;
  const canSpin = connected && !spinning && tickets > 0;

  const statusText = useMemo(() => {
    if (!connected) return 'Not connected yet';
    if (spinning) return `Connected as ${short(publicKey)}`;
    if (tickets === 0) return `Connected as ${short(publicKey)} · buy a ticket to roll`;
    return `Connected as ${short(publicKey)}`;
  }, [connected, spinning, tickets, publicKey]);

  const primaryLabel = spinning
    ? 'Rolling…'
    : tickets === 0
      ? 'No tickets'
      : 'Roll the Reel (1 ticket)';

  function handleSpinClick() {
    if (!canSpin) return;
    setWalletState((s) => ({ ...s, tickets: s.tickets - 1 }));
    reelRef.current?.spin(walletState.spinCount, publicKey?.toBase58());
  }

  function handleTicketsBought(count) {
    setWalletState((s) => ({ ...s, tickets: s.tickets + count }));
  }

  function handleSpinStart() {
    setSpinning(true);
  }

  function handleResult(reward) {
    setSpinning(false);
    setPendingReward(reward);
    setModalOpen(true);
    setClaimSuccess(false);
    setWalletState((s) => ({ ...s, spinCount: s.spinCount + 1 }));
    if (publicKey) recordSpin(publicKey.toBase58());
  }

  async function handleClaim() {
    if (!pendingReward || !pendingReward.claimable) return;

    setClaiming(true);
    setClaimError(null);
    try {
      const { mint, signature } = await claimRewardFromVault({ walletAddress: publicKey.toBase58(), rewardId: pendingReward.id });
      setWalletState((s) => ({
        ...s,
        vault: [{ ...pendingReward, entryId: makeEntryId(pendingReward.id), time: Date.now(), mint, signature }, ...s.vault],
      }));
      setClaimSuccess(true);
    } catch (err) {
      console.error('Claim failed:', err);
      setClaimError(
        err?.message?.toLowerCase().includes('user rejected')
          ? 'You cancelled the claim transaction.'
          : `Claim failed: ${err?.message || 'unknown error'}`
      );
    } finally {
      setClaiming(false);
    }
  }

  function handleCloseModal() {
    if (claiming) return;

    if (!claimSuccess && pendingReward && pendingReward.claimable) {
      setWalletState((s) => ({
        ...s,
        vault: [{ ...pendingReward, entryId: makeEntryId(pendingReward.id), time: Date.now() }, ...s.vault],
      }));
    }

    setPendingReward(null);
    setModalOpen(false);
    setClaimError(null);
    setClaimSuccess(false);
  }

  async function handleClaimFromVault(entry) {
    if (!connected || vaultClaimingId) return;

    setVaultClaimingId(entry.entryId);
    setVaultClaimErrors((e) => ({ ...e, [entry.entryId]: null }));
    try {
      const { mint, signature } = await claimRewardFromVault({ walletAddress: publicKey.toBase58(), rewardId: entry.id });
      setWalletState((s) => ({
        ...s,
        vault: s.vault.map((v) => (v.entryId === entry.entryId ? { ...v, mint, signature } : v)),
      }));
    } catch (err) {
      console.error('Vault claim failed:', err);
      setVaultClaimErrors((e) => ({
        ...e,
        [entry.entryId]: err?.message?.toLowerCase().includes('user rejected')
          ? 'Cancelled.'
          : `Failed: ${err?.message || 'unknown error'}`,
      }));
    } finally {
      setVaultClaimingId(null);
    }
  }

  return (
    <>
      <BackgroundSlideshow />
      <div className="stars" aria-hidden="true" />
      <div className="wrap">
        <header>
          <div className="wordmark">
            <img className="wordmark-logo" src="/brand/logo.png" alt="" aria-hidden="true" />
            <span className="name">THE REAPERS</span>
          </div>
          <nav className="main-nav">
            <button className={page === 'home' ? 'active' : ''} onClick={() => setPage('home')}>Home</button>
            <button className={page === 'spin' ? 'active' : ''} onClick={() => setPage('spin')}>Spin</button>
            <button className={page === 'games' ? 'active' : ''} onClick={() => setPage('games')}>Games</button>
            <button className={page === 'about' ? 'active' : ''} onClick={() => setPage('about')}>About</button>
          </nav>
          <div className="header-right">
            <span className="beta-chip">Lucky Spins · Beta</span>
            {connected && <span className="ticket-badge">🎟 {tickets}</span>}
            <ConnectButton />
          </div>
        </header>

        <div className="page-transition" key={page}>
          {page === 'home' && (
            <HomePage
              onGoToSpin={() => setPage('spin')}
              onGoToAbout={() => setPage('about')}
              onGoToGames={() => setPage('games')}
            />
          )}
          {page === 'about' && <AboutPage onGoToGames={() => setPage('games')} />}

          {page === 'spin' && (
            <>
              <section className="hero">
                <h1>Roll the reel.<br />Wake an <em>NFT</em> from its slumber.</h1>
                <p>Enter the lair, connect your wallet, and roll once a day for a chance to claim rewards from The Reapers — from rare tokens and loot to exclusive NFT prizes. ☠️</p>
              </section>

              <ReelSpinner ref={reelRef} onSpinStart={handleSpinStart} onResult={handleResult} />

              <div className="controls">
                {connected && (
                  <>
                    <button className="btn" disabled={!canSpin} onClick={handleSpinClick}>
                      {primaryLabel}
                    </button>
                    <a className="btn btn-ghost" href="#vault">Enter the Vault</a>
                  </>
                )}
                <div className="status-line">{statusText}</div>
              </div>

              {connected && (
                <BuyTickets ticketCount={tickets} onBought={handleTicketsBought} />
              )}

              <div className="legend">
                {REWARDS.map((r) => (
                  <div className="legend-item" key={r.id}>
                    {r.image
                      ? <img className="legend-img" src={r.image} alt="" />
                      : <span className="swatch" style={{ background: r.color }} />}
                    {r.name}
                  </div>
                ))}
              </div>

              <div className="steps">
                <div className="step">
                  <span className="num">01</span>
                  <h3>Connect</h3>
                  <p>Link a real Solana wallet (Phantom or Solflare) to join the ritual.</p>
                </div>
                <div className="step">
                  <span className="num">02</span>
                  <h3>Buy tickets</h3>
                  <p>Send a small amount of SOL to pick up tickets — each roll costs one ticket.</p>
                </div>
                <div className="step">
                  <span className="num">03</span>
                  <h3>Roll &amp; claim</h3>
                  <p>Spend a ticket to roll the reel, then claim whatever lands under the marker into your Vault.</p>
                </div>
              </div>

              <div className="stats">
                <div className="stat"><span className="n">{walletState.spinCount}</span><span className="l">Your rolls</span></div>
                <div className="stat"><span className="n">{walletState.vault.filter((v) => v.mint).length}</span><span className="l">Rewards claimed</span></div>
              </div>

              <Leaderboard refreshKey={walletState.spinCount} />

              <Vault
                items={walletState.vault}
                onClaim={handleClaimFromVault}
                claimingId={vaultClaimingId}
                errors={vaultClaimErrors}
                canClaim={connected}
              />
            </>
          )}

          {page === 'games' && (
            <section className="hero">
              <h1>The Games</h1>
              <p>Outrun the reaper. Survive as long as you can.</p>
              <ReaperRunner />
            </section>
          )}
        </div>

        <footer>
             © 2026 Solana Grim Reaper. All rights reserved.
        </footer>
      </div>

      <RewardModal reward={pendingReward} open={modalOpen} onClaim={handleClaim} onClose={handleCloseModal} claiming={claiming} error={claimError} success={claimSuccess} />
    </>
  );
}

function short(publicKey) {
  if (!publicKey) return '';
  const s = publicKey.toBase58();
  return s.slice(0, 4) + '…' + s.slice(-4);
}

function makeEntryId(rewardId) {
  return `${rewardId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}