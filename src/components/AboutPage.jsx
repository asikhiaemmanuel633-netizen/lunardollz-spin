export default function AboutPage({ onGoToSpin }) {
  return (
    <section className="page-about">
      <div className="about-hero">
        <img className="about-hero-icon" src="/brand/logo.png" alt="" aria-hidden="true" />
        <h1>Welcome to <em>The Reapers</em></h1>
        <p className="about-tagline">You just entered the darkness.</p>
      </div>

      <p className="about-intro">
        The Reapers is a community-driven NFT project building on Solana,
        centered around a collection of <strong>2,222 unique Reapers</strong>.
      </p>
      <p className="about-intro">
        Our goal isn't just to create another NFT collection. We're building
        a community, ecosystem, and identity around The Reapers.
      </p>

      <div className="bone-divider" aria-hidden="true">
        <span>🦴</span>
      </div>

      <div className="about-section">
        <h2>What Are The Reapers?</h2>
        <ul className="about-list">
          <li><span className="li-icon">💀</span>2,222 unique Reapers</li>
          <li><span className="li-icon">◈</span>Built on Solana</li>
          <li><span className="li-icon">🦴</span>Generative NFT collection</li>
          <li><span className="li-icon">☾</span>$REAPER ecosystem</li>
          <li><span className="li-icon">✦</span>Community rewards &amp; events</li>
        </ul>
      </div>

      <div className="about-section">
        <h2>Why Join?</h2>
        <p>By becoming part of the Reapers community, you'll get access to:</p>
        <ul className="about-list">
          <li><span className="li-icon">🎪</span>Community events</li>
          <li><span className="li-icon">🎁</span>Giveaways &amp; rewards</li>
          <li><span className="li-icon">📜</span>WL opportunities</li>
          <li><span className="li-icon">🛡</span>OG opportunities</li>
          <li><span className="li-icon">🪙</span>$REAPER community activities</li>
          <li><span className="li-icon">🔮</span>Future holder benefits</li>
        </ul>
      </div>

      <div className="about-section about-token">
        <h2>$REAPER</h2>
        <p>$REAPER is our community token.</p>
        <p>
          Members will be able to earn $REAPER through activities and
          community events, with future rewards and utilities planned around
          the ecosystem.
        </p>
        <p className="about-token-link">More details → #・$reaper</p>
      </div>

      <div className="bone-divider" aria-hidden="true">
        <span>🦴</span>
      </div>

      <div className="about-section">
        <h2>The Collection</h2>
        <div className="about-stats">
          <div className="about-stat">
            <span className="n">2,222</span>
            <span className="l">Supply</span>
          </div>
          <div className="about-stat">
            <span className="n">Solana</span>
            <span className="l">Network</span>
          </div>
          <div className="about-stat">
            <span className="n">Building</span>
            <span className="l">Status</span>
          </div>
        </div>
        <p className="about-note">Mint information will always be posted through our official announcements.</p>
      </div>

      <div className="about-section">
        <h2>What's Next?</h2>
        <p>We're currently building:</p>
        <ul className="about-list about-checklist">
          <li><span className="li-icon">🦴</span>The Reapers collection</li>
          <li><span className="li-icon">🦴</span>Mint website</li>
          <li><span className="li-icon">🦴</span>$REAPER ecosystem</li>
          <li><span className="li-icon">🦴</span>Community events</li>
          <li><span className="li-icon">🦴</span>Rewards &amp; giveaways</li>
          <li><span className="li-icon">🦴</span>Partnerships &amp; collaborations</li>
        </ul>
      </div>

      <div className="bone-divider" aria-hidden="true">
        <span>🦴</span>
      </div>

      {/* THE LAIR */}
      <div className="about-section rh-lair">
        <h2>The Lair</h2>
        <p>
          The Reapers are built around the people behind them. Join the
          community, meet other collectors, participate in events and stay
          close to what's happening inside the realm.
        </p>
        <div className="rh-hero-actions">
          <a className="btn" href="https://discord.gg/HPNknfkCz" target="_blank" rel="noreferrer">Join the Discord</a>
          <a className="btn btn-ghost" href="https://x.com/TheGrimRipear" target="_blank" rel="noreferrer">Follow on X</a>
        </div>
        <div className="rh-tagline">COMMUNITY &bull; EVENTS &bull; QUESTS &bull; GIVEAWAYS &bull; COLLABS</div>
      </div>

      {/* THE PATH AHEAD */}
      <div className="about-section">
        <h2>The Path Ahead</h2>
        <p>The realm is only beginning.</p>
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
      </div>

      {/* FINAL CTA */}
      <div className="rh-final-cta">
        <h2>Will You Answer the Call?</h2>
        <p>The realm is open.</p>
        <button className="btn" onClick={onGoToSpin}>Enter the Realm</button>
      </div>
    </section>
  );
}