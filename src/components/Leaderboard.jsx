import { useEffect, useState } from 'react';
import { fetchLeaderboard } from '../lib/leaderboard';

function shortAddress(addr) {
  return addr.slice(0, 4) + '…' + addr.slice(-4);
}

// `refreshKey` — pass something that changes after each spin (e.g. total
// spin count) so this refetches and a new #1 shows up without a page reload.
export default function Leaderboard({ refreshKey }) {
  const [entries, setEntries] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchLeaderboard()
      .then((data) => { if (!cancelled) setEntries(data); })
      .catch(() => { if (!cancelled) setEntries([]); })
      .finally(() => { if (!cancelled) setLoaded(true); });
    return () => { cancelled = true; };
  }, [refreshKey]);

  if (!loaded || entries.length === 0) return null;

  return (
    <div className="leaderboard">
      <h2>Top Spinners</h2>
      <div className="leaderboard-list">
        {entries.map((e, i) => (
          <div className="leaderboard-row" key={e.wallet}>
            <span className="lb-rank">#{i + 1}</span>
            <span className="lb-wallet">
              {i === 0 && <span className="lb-medal" title="Top spinner">🥇</span>}
              {shortAddress(e.wallet)}
            </span>
            <span className="lb-spins">{e.spins} {e.spins === 1 ? 'spin' : 'spins'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
