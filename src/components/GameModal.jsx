import ReaperRunner from './ReaperRunner';

export default function GameModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="game-modal-backdrop" onClick={onClose}>
      <div className="game-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="game-modal-close" onClick={onClose} aria-label="Close">✕</button>
        <ReaperRunner />
      </div>
    </div>
  );
}