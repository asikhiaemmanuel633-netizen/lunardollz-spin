export default function Vault({ items, onClaim, claimingId, errors, canClaim }) {
  return (
    <div className="vault" id="vault">
      <div className="vault-head">
        <h2>Your Vault</h2>
        <span className="count">{items.length} {items.length === 1 ? 'item' : 'items'}</span>
      </div>
      <div className="vault-list">
        {items.length === 0 ? (
          <div className="vault-empty">Nothing here yet — roll the reel to fill your vault.</div>
        ) : (
          items.map((v) => {
            const isClaimed = Boolean(v.mint);
            const isBusy = claimingId === v.entryId;
            const error = errors && errors[v.entryId];

            return (
              <div className="vault-row" key={v.entryId || `${v.id}-${v.time}`}>
                <div className="r-name">
                  {v.image
                    ? <img className="vault-img" src={v.image} alt="" />
                    : <span className="r-dot" style={{ background: v.color }} />}
                  {v.icon} {v.name}
                </div>
                <div className="r-right">
                  {isClaimed ? (
                    <a
                      className="r-link"
                      href={`https://explorer.solana.com/address/${v.mint}?cluster=devnet`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View on-chain
                    </a>
                  ) : (
                    <div className="r-claim">
                      <button
                        className="r-claim-btn"
                        disabled={!canClaim || isBusy}
                        onClick={() => onClaim(v)}
                      >
                        {isBusy ? 'Claiming…' : 'Claim'}
                      </button>
                      {error && <span className="r-claim-error">{error}</span>}
                    </div>
                  )}
                  <span className="r-time">{new Date(v.time).toLocaleDateString()}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
