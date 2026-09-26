export default function HomePage({ onGoToSpin, onGoToAbout, onGoToGames }) {
  return (
    <div className="page-home-full">

      {/* HERO */}
      <section
        className="rh-hero rh-hero-bg"
        style={{ backgroundImage: 'url(/brand/hero-bg.jpg)' }}
      >
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

      <div className="bone-divider" aria-hidden="true"><span>🦴</span></div>

      {/* THE REALM AWAITS — preview cards */}
      <section className="rh-section">
        <h2>The Realm Awaits</h2>
        <p className="rh-section-intro">
          The Reapers are more than profile pictures. They're a growing
          community built around collectibles, rewards, games, quests and
          on-chain experiences.
        </p>
        <div className="rh-preview-cards">
          <div className="rh-preview-card" onClick={onGoToAbout}>
            <img src="/brand/card-reapers.jpg" alt="The Reapers" />
            <div className="rh-preview-label">
              <h3>The Reapers</h3>
              <p>Brand illustrated intro</p>
            </div>
          </div>
          <div className="rh-preview-card" onClick={onGoToSpin}>
            <img src="/brand/card-spin.jpg" alt="Spin" />
            <div className="rh-preview-label">
              <h3>Spin</h3>
              <p>Test your luck</p>
            </div>
          </div>
          <div className="rh-preview-card" onClick={onGoToGames}>
            <img src="/brand/card-games.jpg" alt="Games" />
            <div className="rh-preview-label">
              <h3>Games</h3>
              <p>Endless-runner preview</p>
            </div>
          </div>
          <div className="rh-preview-card" onClick={onGoToAbout}>
            <img src="/brand/card-collection.jpg" alt="Collection" />
            <div className="rh-preview-label">
              <h3>Collection</h3>
              <p>2,222 unique Reapers</p>
            </div>
          </div>
          <div className="rh-preview-card" onClick={onGoToAbout}>
            <img src="/brand/card-community.jpg" alt="Community" />
            <div className="rh-preview-label">
              <h3>Community</h3>
              <p>Join the realm</p>
            </div>
          </div>
        </div>
      </section>

      {/* THE LAIR */}
      <section className="rh-section rh-lair">
        <h2>The Lair</h2>
        <p className="rh-section-intro">
          The Reapers are built around the people behind them. Join the
          community, meet other collectors, participate in events and stay
          close to what's happening inside the realm.
        </p>
       <div className="rh-hero-actions">
          <a className="btn" href="https://discord.gg/HPNknfkCz" target="_blank" rel="noreferrer">Join the Discord</a>
          <a className="btn btn-ghost" href="https://x.com/TheGrimRipear" target="_blank" rel="noreferrer">Follow on X</a>
        </div>
        <div className="rh-tagline">COMMUNITY &bull; EVENTS &bull; QUESTS &bull; GIVEAWAYS &bull; COLLABS</div>
      </section>

      <div className="bone-divider" aria-hidden="true"><span>🦴</span></div>

      {/* THE PATH AHEAD */}
      <section className="rh-section">
        <h2>The Path Ahead</h2>
        <p className="rh-section-intro">The realm is only beginning.</p>
        <div className="rh-roadmap">
          <div className="rh-phase">
            <span className="rh-phase-num">01</span>
            <h3>The Awakening</h3>
            <ul>
              <li>Collection development</li>
              <li>Community building</li>
              <li>Website</li>
            </ul>
          </div>
          <div className="rh-phase">
            <span className="rh-phase-num">02</span>
            <h3>The Gathering</h3>
            <ul>
              <li>Mint</li>
              <li>Holder benefits</li>
              <li>Community events</li>
            </ul>
          </div>
          <div className="rh-phase">
            <span className="rh-phase-num">03</span>
            <h3>The Realm Expands</h3>
            <ul>
              <li>Missions</li>
              <li>Points</li>
              <li>Spins</li>
              <li>Rewards</li>
            </ul>
          </div>
          <div className="rh-phase">
            <span className="rh-phase-num">04</span>
            <h3>Beyond the Gate</h3>
            <ul>
              <li>Collaborations</li>
              <li>New experiences</li>
              <li>More ways to participate</li>
            </ul>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="rh-final-cta">
        <h2>Will You Answer the Call?</h2>
        <p>The realm is open.</p>
        <button className="btn" onClick={onGoToSpin}>Enter the Realm</button>
      </section>

    </div>
  );
}