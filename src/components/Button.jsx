import { Link } from 'react-router-dom';

export default function Button({ children, to, href, variant = 'primary', className = '', type = 'button' }) {
  const baseClasses = 'inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2';
  const variants = {
    primary: 'bg-primary text-slate-900 shadow-soft hover:bg-sky-400',
    secondary: 'border border-border bg-white/70 text-foreground hover:bg-slate-50',
    muted: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
    accent: 'bg-accent text-white hover:bg-emerald-500'
  };

  const classes = `${baseClasses} ${variants[variant]} ${className}`.trim();

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} className={classes}>
      {children}
    </button>
  );
}
