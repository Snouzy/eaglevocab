import Navbar from "./components/landing/navbar";
import Hero from "./components/landing/hero";
import Features from "./components/landing/features";
import HowItWorks from "./components/landing/how-it-works";
import FinalCta from "./components/landing/final-cta";
import Footer from "./components/landing/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
