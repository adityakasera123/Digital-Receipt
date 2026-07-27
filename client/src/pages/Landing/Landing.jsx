import Navbar from "../../components/layout/     Navbar";
import CTA from "./CTA";
import FAQ from "./FAQ";
import Features from "./Features";
import Hero from "./Hero";
import HowItWorks from "./HowItWorks";
import ReceiptProblems from "./ReceiptProblems";
import WhyBillvora from "./WhyBillvora";

function Landing() {
  return (
    <div className="min-h-screen text-white">
      <Navbar />
      <Hero />
      <Features/>
      <HowItWorks />
      <WhyBillvora />
      <ReceiptProblems />
      <FAQ />
      <CTA />
    </div>
  );
}

export default Landing;