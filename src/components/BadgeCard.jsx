import { stampCatalog } from '../data/stamps';
import { useTravel } from '../context/TravelContext';

export default function BadgeCard() {
  const { travelData } = useTravel();
  const visits = travelData.visits || [];
  const visitedCount = visits.length;
  const countryCount = new Set(visits.map((visit) => visit.country).filter(Boolean)).size;
  const unlockedBadgeIds = new Set(travelData.stamps || []);

  const getBadgeState = (badge) => {
    const currentCount = badge.type === 'countries' ? countryCount : visitedCount;
    const unlocked = unlockedBadgeIds.has(badge.id) || currentCount >= badge.requirement;
    return { unlocked, progress: Math.min(currentCount / badge.requirement, 1) };
  };

  return (
    <section className="badges-grid">
      {stampCatalog.map((badge) => {
        const { unlocked, progress } = getBadgeState(badge);
        return (
          <article key={badge.id} className={`badge-card ${unlocked ? 'unlocked' : ''}`}>
            <div className="badge-icon">{badge.icon}</div>
            <h3>{badge.name}</h3>
            <p>{badge.description}</p>
            <span>{unlocked ? 'Unlocked' : `Need ${badge.requirement}`}</span>
            <div className="progress-bar" aria-hidden="true">
              <div className="progress-bar__fill" style={{ width: `${Math.round(progress * 100)}%` }} />
            </div>
          </article>
        );
      })}
    </section>
  );
}
