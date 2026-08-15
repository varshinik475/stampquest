import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Home' },
  { to: '/passport', label: 'Passport' },
  { to: '/stamps', label: 'Stamps' },
  { to: '/explore', label: 'Explore' },
  { to: '/profile', label: 'Profile' }
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-container items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <NavLink to="/" className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-900">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-base shadow-soft">✈️</span>
          <span>StampQuest</span>
        </NavLink>

        <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-full px-3 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-soft'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
}
