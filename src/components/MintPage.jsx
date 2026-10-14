export default function MintPage({ onGoToAbout }) {
  return (
    <section className="page-about page-mint-bg">
      <div className="about-hero">
        <img className="about-hero-icon" src="/brand/logo.png" alt="" aria-hidden="true" />
        <h1>The <em>Mint</em> Is Coming</h1>
        <p className="about-tagline">2,222 Reapers awaken soon</p>
      </div>

      <p className="about-intro">
        The Reapers collection isn't live yet — we're putting the final touches on art, traits, and the mint mechanics. Check back soon, or follow our socials for the official date.
      </p>

      <div className="bone-divider" aria-hidden="true"><span>🦴</span></div>

      <div className="about-section">
        <h2>Mint Details</h2>
        <div className="about-stats">
          <div className="about-stat">
            <span className="n">2,222</span>
            <span className="l">Supply</span>
          </div>
          <div className="about-stat">
            <span className="n">TBA</span>
            <span className="l">Price</span>
          </div>
          <div className="about-stat">
            <span className="n">Solana</span>
            <span className="l">Network</span>
          </div>
        </div>
        <p className="about-note">Mint date, price, and whitelist details will be announced through our official channels.</p>
      </div>

      <div className="about-section" style={{ textAlign: 'center' }}>
        <button className="btn" disabled>Mint — Coming Soon</button>
        {onGoToAbout && (
          <p style={{ marginTop: '14px' }}>
            <a className="r-link" href="#" onClick={(e) => { e.preventDefault(); onGoToAbout(); }}>
              Learn more about The Reapers
            </a>
          </p>
        )}
      </div>
    </section>
  );
}