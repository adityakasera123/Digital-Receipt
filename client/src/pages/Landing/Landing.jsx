import { useState } from "react";

import Navbar from "../../components/layout/Navbar";
import CTA from "./CTA";
import FAQ from "./FAQ";
import Features from "./Features";
import Footer from "./Footer";
import Hero from "./Hero";
import HowItWorks from "./HowItWorks";
import ReceiptProblems from "./ReceiptProblems";
import WhyBillvora from "./WhyBillvora";

import PageLoader from "./components/PageLoader";
import BillvoraStory from "./BillvoraStory";

const ENABLE_PAGE_LOADER = false;

function Landing() {
  const [isLoading, setIsLoading] = useState(ENABLE_PAGE_LOADER);

  return (
    <>
      {isLoading && (
        <PageLoader onComplete={() => setIsLoading(false)} />
      )}

      <div
        className={`min-h-screen bg-[#050505] text-white transition-opacity duration-700 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
      >
        <Navbar />
        <Hero />
        <Features />
        <HowItWorks />
        <BillvoraStory/>
        <FAQ />
        <CTA />
        <Footer />
      </div>
    </>
  );
}

export default Landing;