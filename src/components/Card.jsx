export default function Card({ children, className = '', as: Component = 'div' }) {
  return (
    <Component className={`rounded-3xl border border-border bg-card p-6 shadow-card ${className}`.trim()}>
      {children}
    </Component>
  );
}
