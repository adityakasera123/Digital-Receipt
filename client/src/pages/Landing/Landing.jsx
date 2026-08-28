import Navbar from "../../components/layout/     Navbar";
import CTA from "./CTA";
import FAQ from "./FAQ";
import Features from "./Features";
import Footer from "./Footer";
import Hero from "./Hero";
import HowItWorks from "./HowItWorks";
import ReceiptProblems from "./ReceiptProblems";
import WhyBillvora from "./WhyBillvora";

function Landing() {
  return (
    <div className="landing-page min-h-screen text-white">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <WhyBillvora />
      <ReceiptProblems />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
}

export default Landing;