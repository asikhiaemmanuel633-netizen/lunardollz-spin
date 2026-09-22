import Confetti from './Confetti';

export default function RewardModal({ reward, open, onClaim, onClose, claiming, error, success }) {
  if (!reward) return null;

  const buttonLabel = !reward.claimable
    ? 'Close'
    : claiming
      ? 'Confirming in wallet…'
      : 'Claim to Wallet';

  return (
    <div className={`modal-overlay${open ? ' open' : ''}`} onClick={(e) => e.target === e.currentTarget && !claiming && onClose()}>
      {success && <Confetti />}
      <div className="modal">
        <button className="modal-close" onClick={onClose} disabled={claiming} aria-label="Close">✕</button>

        {success ? (
          <>
            <div className="badge success-badge">✓</div>
            <div className="eyebrow">Claimed!</div>
            <h3>{reward.name} is in your wallet</h3>
            <p>The transfer is confirmed on-chain — check your Vault below for the details.</p>
            <button className="btn" onClick={onClose}>Nice!</button>
          </>
        ) : (
          <>
            {reward.image
              ? <img className="badge-img" src={reward.image} alt="" />
              : <div className="badge" style={{ background: reward.color }}>{reward.icon}</div>}
            <div className="eyebrow">You pulled</div>
            <h3>{reward.name}</h3>
            <p>{reward.desc}</p>
            <button className="btn" onClick={reward.claimable ? onClaim : onClose} disabled={claiming}>
              {buttonLabel}
            </button>
            {error && <div className="modal-error">{error}</div>}
          </>
        )}
      </div>
    </div>
  );
}
