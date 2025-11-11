import Header from '../components/Header.jsx';
import Hero from '../components/Hero.jsx';
import Features from '../components/Features.jsx';
import Footer from '../components/Footer.jsx';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-light)]">
      <Header />
      <Hero />
      <Features />
      <Footer />
    </div>
  );
}
