import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import BuildSection from "@/components/sections/BuildSection";
import LaptopSection from "@/components/sections/LaptopSection";
import ProjectShowcase from "@/components/projects/ProjectShowcase";
import SkillsSection from "@/components/sections/SkillsSection";
import EngineeringSection from "@/components/sections/EngineeringSection";
import JourneySection from "@/components/sections/JourneySection";
import GithubSection from "@/components/sections/GithubSection";
import ContactSection from "@/components/sections/ContactSection";
import Footer from "@/components/sections/Footer";

/**
 * All DOM content, in scroll order. Every <Chapter> inside is one camera
 * pose; this layer sits above the fixed canvas and lets pointer events fall
 * through except on interactive elements.
 */
export default function ExperienceOverlay() {
  return (
    <>
      <main id="content" className="pointer-events-none relative z-10">
        <HeroSection />
        <AboutSection />
        <BuildSection />
        <LaptopSection />
        <ProjectShowcase />
        <SkillsSection />
        <EngineeringSection />
        <JourneySection />
        <GithubSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}

