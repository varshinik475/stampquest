export default function PageContainer({ children, className = '' }) {
  return <div className={`mx-auto w-full max-w-container px-4 py-8 sm:px-6 lg:px-8 ${className}`.trim()}>{children}</div>;
}
