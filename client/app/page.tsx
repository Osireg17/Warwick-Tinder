
import { ClientWrapper } from './client-wrapper';
import { CTASection } from './components/cta-section';
import { EventInfoSection } from './components/event-info-section';
import { Footer } from './components/footer';
import { Header } from './components/header';
import { HeroSection } from './components/hero-section';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 to-teal-100">
      <Header />
      <main className="pt-16">
        <HeroSection />
        <ClientWrapper />
        <EventInfoSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}