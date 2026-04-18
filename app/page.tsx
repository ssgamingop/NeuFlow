import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import AiNotMagicSection from "./components/AiNotMagicSection";
import LiveDemoSection from "./components/LiveDemoSection";
import LearningPathSection from "./components/LearningPathSection";
import InteractiveCardsSection from "./components/InteractiveCardsSection";
import WhySection from "./components/WhySection";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <AiNotMagicSection />
        <LiveDemoSection />
        <LearningPathSection />
        <InteractiveCardsSection />
        <WhySection />
      </main>
      <Footer />
    </>
  );
}
