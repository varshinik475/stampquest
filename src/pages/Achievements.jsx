import BadgeCard from '../components/BadgeCard';

export default function Achievements() {
  return (
    <div className="page">
      <section className="hero-card">
        <h1>Achievements</h1>
        <p>Unlock new travel badges as you add more visits.</p>
      </section>
      <BadgeCard />
    </div>
  );
}
