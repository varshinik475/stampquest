import AddVisitForm from '../components/AddVisitForm';
import TravelStats from '../components/TravelStats';
import StampCard from '../components/StampCard';

export default function Home() {
  return (
    <div className="page">
      <section className="hero-card">
        <h1>Welcome to StampQuest</h1>
        <p>Track your adventures, collect passport stamps, and unlock achievements.</p>
      </section>
      <div className="content-grid">
        <AddVisitForm />
        <div className="side-stack">
          <TravelStats />
          <StampCard />
        </div>
      </div>
    </div>
  );
}
