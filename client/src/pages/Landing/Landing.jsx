import { useEffect, useState } from "react";

import Navbar from "../../components/layout/Navbar";
import CTA from "./CTA";
import FAQ from "./FAQ";
import Features from "./Features";
import Footer from "./Footer";
import Hero from "./Hero";
import HowItWorks from "./HowItWorks";

import PageLoader from "./components/PageLoader";
import BillvoraStory from "./BillvoraStory";

const ENABLE_PAGE_LOADER = true;

function Landing() {
  const [isLoading, setIsLoading] = useState(() => {
    if (!ENABLE_PAGE_LOADER) return false;

    // Back/Forward navigation → loader nahi
    const navigationEntry = performance.getEntriesByType("navigation")[0];

    if (navigationEntry?.type === "back_forward") {
      return false;
    }

    // Fresh load ya refresh → loader chalega
    return true;
  });

  return (
    <>
      {/* LOADER */}
      {isLoading && (
        <PageLoader
          onComplete={() => {
            setIsLoading(false);
          }}
        />
      )}

      {/* PAGE */}
      {!isLoading && (
        <div className="min-h-screen bg-[#050505] text-white">
          <Navbar />
          <Hero />
          <Features />
          <HowItWorks />
          <BillvoraStory />
          <FAQ />
          <CTA />
          <Footer />
        </div>
      )}
    </>
  );
}

export default Landing;