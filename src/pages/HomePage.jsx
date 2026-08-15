import { Link } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import PageContainer from '../components/PageContainer';
import SectionHeader from '../components/SectionHeader';

const quickLinks = [
  { title: 'Passport', description: 'Your personal travel log and collected memories.', to: '/passport' },
  { title: 'Stamps', description: 'Browse the digital seal collection you have earned.', to: '/stamps' },
  { title: 'Explore', description: 'Discover upcoming stops and new destinations.', to: '/explore' }
];

export default function HomePage() {
  return (
    <PageContainer>
      <section className="grid gap-6 lg:grid-cols-[1.5fr_0.9fr] lg:items-center">
        <Card className="bg-[linear-gradient(135deg,#dff7ff_0%,#f1fef1_100%)] p-8 sm:p-10">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">Travel smarter</p>
          <h1 className="max-w-xl text-display font-black text-slate-900">Collect stories, stamps, and memories across every journey.</h1>
          <p className="mt-4 max-w-xl text-body text-slate-600">
            StampQuest helps you keep a personal digital passport, unlock memorable travel stamps, and revisit the places that shaped your adventures.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button to="/passport">Open passport</Button>
            <Button to="/explore" variant="secondary">Explore destinations</Button>
          </div>
        </Card>

        <Card className="bg-slate-900 p-7 text-white">
          <p className="text-sm uppercase tracking-[0.2em] text-sky-200">This week</p>
          <div className="mt-6 space-y-5">
            <div>
              <p className="text-3xl font-black text-white">12</p>
              <p className="text-sm text-slate-300">Stamps collected</p>
            </div>
            <div>
              <p className="text-3xl font-black text-white">6</p>
              <p className="text-sm text-slate-300">Countries explored</p>
            </div>
            <div>
              <p className="text-3xl font-black text-white">3</p>
              <p className="text-sm text-slate-300">New destinations queued</p>
            </div>
          </div>
        </Card>
      </section>

      <section className="mt-10">
        <SectionHeader
          eyebrow="Overview"
          title="Your travel passport, reimagined"
          description="A clean digital home for the places you’ve visited, the stamps you’ve earned, and the dream trips still on your list."
        />

        <div className="grid gap-5 md:grid-cols-3">
          {quickLinks.map((item) => (
            <Card key={item.title} className="h-full bg-white/80">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-2xl">✦</div>
              <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{item.description}</p>
              <div className="mt-5">
                <Link to={item.to} className="inline-flex items-center text-sm font-semibold text-sky-700 hover:text-sky-900">
                  Visit {item.title} →
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </PageContainer>
  );
}
