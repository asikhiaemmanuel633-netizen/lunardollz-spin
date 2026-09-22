export default function HomePage({ onGoToSpin }) {
  return (
    <section className="page-home">
      <img className="home-hero-icon" src="/brand/logo.png" alt="" aria-hidden="true" />
      <h1>THE <em>REAPERS</em></h1>
      <p>
        A community-driven NFT collection of 2,222 unique Reapers, built on
        Solana. Connect your wallet, spin the reel, and claim real on-chain
        rewards — from $REAPER points to rare Reaper relics.
      </p>
      <button className="btn" onClick={onGoToSpin}>Go to Spin</button>
    </section>
  );
}
