import { useEffect, useState } from "react";
import "../styles/pageLoader.css";

function PageLoader({ onComplete }) {
  const [phase, setPhase] = useState("loading");

  useEffect(() => {
    // Lock background scroll while loader is active
    const originalOverflow = document.body.style.overflow;
    const originalHeight = document.body.style.height;

    document.body.style.overflow = "hidden";
    document.body.style.height = "100vh";

    const revealTimer = setTimeout(() => {
      setPhase("revealing");
    }, 350);

    const zoomTimer = setTimeout(() => {
      setPhase("zooming");
    }, 3900);

    const completeTimer = setTimeout(() => {
      onComplete?.();
    }, 6600);

    return () => {
      clearTimeout(revealTimer);
      clearTimeout(zoomTimer);
      clearTimeout(completeTimer);

      // Restore normal scrolling after loader unmounts
      document.body.style.overflow = originalOverflow;
      document.body.style.height = originalHeight;
    };
  }, [onComplete]);

  return (
    <div
      className={`page-loader ${
        phase === "revealing" ? "is-revealing" : ""
      } ${phase === "zooming" ? "is-zooming" : ""}`}
    >
      <div className="page-loader__brand">
        <svg
          className="page-loader__svg"
          viewBox="0 0 1600 500"
          preserveAspectRatio="xMidYMid meet"
          aria-label="Billvora"
        >
          <defs>
            <clipPath id="billvora-text-clip">
              <text
                x="50%"
                y="58%"
                textAnchor="middle"
                className="page-loader__text"
              >
                BILLVORA
              </text>
            </clipPath>

            <linearGradient
              id="billvora-loader-gradient"
              x1="0"
              y1="0"
              x2="1"
              y2="0"
            >
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#f4f7f6" />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>
          </defs>

          {/* Base text */}
          <text
            x="50%"
            y="58%"
            textAnchor="middle"
            className="page-loader__text page-loader__text--base"
          >
            BILLVORA
          </text>

          {/* Animated fill */}
          <g clipPath="url(#billvora-text-clip)">
            <path
              className="page-loader__wave"
              fill="url(#billvora-loader-gradient)"
              d="
                M 0 500
                V 350
                Q 100 300 200 350
                T 400 350
                T 600 350
                T 800 350
                T 1000 350
                T 1200 350
                T 1400 350
                T 1600 350
                V 500
                Z
              "
            />
          </g>
        </svg>
      </div>
    </div>
  );
}

export default PageLoader;