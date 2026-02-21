import Navbar from './components/landing/navbar';
import Hero from './components/landing/hero';
import Problem from './components/landing/problem';
import Method from './components/landing/method';
import Features from './components/landing/features';
import AppPreview from './components/landing/app-preview';
import Testimonials from './components/landing/testimonials';
import Faq from './components/landing/faq';
import FinalCta from './components/landing/final-cta';
import Footer from './components/landing/footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <Method />
        <Features />
        <AppPreview />
        <Testimonials />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
