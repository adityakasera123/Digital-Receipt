import { useRef } from "react";

import WhyBillvora from "./WhyBillvora";
import ReceiptProblems from "./ReceiptProblems";

function BillvoraStory() {
  const cardRef = useRef(null);
  const handoffRef = useRef(null);

  return (
    <section className="relative bg-[#050505]">
      <WhyBillvora cardRef={cardRef} />

      <ReceiptProblems handoffRef={handoffRef} />
    </section>
  );
}

export default BillvoraStory;