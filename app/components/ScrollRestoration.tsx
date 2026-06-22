"use client";

import { useEffect } from "react";

export default function ScrollRestoration() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const hasPortfolioHash = window.location.hash === "#portfolio";
    const hasPortfolioQuery = window.location.search.includes("from=detail");

    if (hasPortfolioHash && hasPortfolioQuery) {
      const handleCustomScroll = () => {
        const element = document.getElementById("portfolio");
        if (element) {
          // Calculate absolute coordinate of the element on the page
          const rect = element.getBoundingClientRect();
          const targetPosition = rect.top + window.pageYOffset;
          const offset = 100; // 100px safe offset as requested

          window.scrollTo({
            top: targetPosition - offset,
            behavior: "smooth",
          });

          // Clean up the "?from=detail" query parameter to prevent repeat scrolling on refresh
          const newUrl = window.location.pathname + window.location.hash;
          window.history.replaceState({}, "", newUrl);
        }
      };

      // Wait 400ms to allow ScrollReveal and assets to stabilize layout (prevent Layout Shift)
      const timer = setTimeout(handleCustomScroll, 400);

      // Also listen for full window load to make sure everything is completely aligned
      const handleLoad = () => {
        setTimeout(handleCustomScroll, 100);
      };

      window.addEventListener("load", handleLoad);

      return () => {
        clearTimeout(timer);
        window.removeEventListener("load", handleLoad);
      };
    }
  }, []);

  return null;
}
