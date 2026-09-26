export default function HomePage({ onGoToSpin, onGoToAbout, onGoToGames }) {
  return (
    <div className="page-home-full page-home-compact">

      {/* HERO */}
      <section className="rh-hero">
        <div className="rh-hero-text">
          <span className="rh-eyebrow">THE REAPERS</span>
          <h1>Enter the Realm of the <em>Reapers</em>.</h1>
          <p>
            A community-driven collection of 2,222 unique Reapers forged on
            Solana. Connect your wallet, spin the wheel, complete missions,
            earn $REAPER points, and hunt for rare digital relics.
          </p>
          <div className="rh-hero-actions">
            <button className="btn" onClick={onGoToSpin}>Enter the Spin</button>
            <button className="btn btn-ghost" onClick={onGoToAbout}>Explore the Reapers</button>
          </div>
          <div className="rh-tagline">2,222 REAPERS &bull; SOLANA &bull; COMMUNITY DRIVEN</div>
        </div>
        <img className="rh-hero-character" src="/brand/hero-character.png" alt="" aria-hidden="true" />
      </section>

      {/* PREVIEW CARDS */}
      <section className="rh-preview-section">
        <div className="rh-preview-cards">
          <div className="rh-preview-card" onClick={onGoToAbout}>
            <img src="/brand/card-reapers.jpg" alt="The Reapers" />
          </div>
          <div className="rh-preview-card" onClick={onGoToSpin}>
            <img src="/brand/card-spin.jpg" alt="Spin" />
          </div>
          <div className="rh-preview-card" onClick={onGoToGames}>
            <img src="/brand/card-games.jpg" alt="Games" />
          </div>
          <div className="rh-preview-card" onClick={onGoToAbout}>
            <img src="/brand/card-collection.jpg" alt="Collection" />
          </div>
          <div className="rh-preview-card" onClick={onGoToAbout}>
            <img src="/brand/card-community.jpg" alt="Community" />
          </div>
        </div>
      </section>

    </div>
  );
}