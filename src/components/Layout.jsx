import Navbar from './Navbar';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pb-12">{children}</main>
    </div>
  );
}
