import { useMemo, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import HelpPageLayout from "../../components/help/HelpPageLayout";
import faqData from "./data/faqData";

const FAQ = () => {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [openIndex, setOpenIndex] = useState(null);

  const categories = useMemo(
    () => ["All", ...new Set(faqData.map((item) => item.category))],
    []
  );

  const filteredFAQs = faqData.filter((item) => {
    const matchesCategory =
      activeCategory === "All" || item.category === activeCategory;

    const matchesQuery =
      item.question.toLowerCase().includes(query.toLowerCase()) ||
      item.answer.toLowerCase().includes(query.toLowerCase());

    return matchesCategory && matchesQuery;
  });

  return (
    <HelpPageLayout
      title="Frequently Asked Questions"
      subtitle="Find quick answers about receipts, warranties, notifications, and your Billvora account."
    >
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-secondary" />
          <input
            type="text"
            placeholder="Search FAQs..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-2xl border border-default bg-surface py-3 pl-11 pr-4 text-primary placeholder:text-secondary focus:border-default focus:outline-none transition-theme"
          />
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-theme ${
              activeCategory === category
                ? "border-default bg-surface-secondary text-primary"
                : "border-default bg-surface text-secondary hover:bg-surface-hover hover:text-primary"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredFAQs.length === 0 ? (
          <div className="rounded-2xl border border-default bg-surface p-8 text-center transition-theme">
            <h3 className="text-lg font-semibold text-primary">
              No results found
            </h3>
            <p className="mt-2 text-secondary">
              Try a different keyword or category.
            </p>
          </div>
        ) : (
          filteredFAQs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={`${faq.question}-${index}`}
                className="overflow-hidden rounded-2xl border border-default bg-surface transition-theme"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left hover:bg-surface-hover transition-theme"
                >
                  <div>
                    <div className="mb-1 text-xs font-medium uppercase tracking-wide text-secondary">
                      {faq.category}
                    </div>
                    <h3 className="text-base font-semibold text-primary sm:text-lg">
                      {faq.question}
                    </h3>
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 text-secondary transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="border-t border-default px-5 pb-5 pt-4">
                    <p className="text-secondary leading-7">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </HelpPageLayout>
  );
};

export default FAQ;