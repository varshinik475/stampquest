import { useTravel } from '../context/TravelContext';
import StampCard from './StampCard';

export default function Passport() {
  const { travelData } = useTravel();

  return (
    <section className="passport-card">
      <h2>{travelData.travelerName}'s Passport</h2>
      <p>Collected stamps from around the world.</p>
      <div className="passport-grid">
        {travelData.visits.map((visit) => (
          <StampCard key={visit.id} visit={visit} />
        ))}
      </div>
    </section>
  );
}
