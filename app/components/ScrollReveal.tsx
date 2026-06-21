"use client";

import { useEffect, useRef, useState, ReactNode } from "react";
import { useSearchParams } from "next/navigation";

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number; // Delay in milliseconds for staggered animation
  duration?: string; // Tailwind transition duration
  threshold?: number; // Visibility trigger percentage
  className?: string; // Optional custom wrapper classes
}

export default function ScrollReveal({
  children,
  delay = 0,
  duration = "duration-1000",
  threshold = 0.1,
  className = "",
}: ScrollRevealProps) {
  const searchParams = useSearchParams();
  const fromDetail = searchParams.get("from") === "detail";
  const [isVisible, setIsVisible] = useState(fromDetail);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (fromDetail) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Hanya trigger satu kali (trigger once) saat elemen memasuki viewport.
        // Ini meningkatkan performa secara signifikan dan memutus loop guncangan scroll (scroll bouncing loop).
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (elementRef.current) {
            observer.unobserve(elementRef.current);
          }
        }
      },
      {
        threshold,
        rootMargin: "0px 0px -80px 0px", // Trigger sedikit sebelum elemen masuk penuh ke dalam viewport
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [threshold, fromDetail]);

  return (
    <div
      ref={elementRef}
      className={`transition-all ${duration} ease-out ${className} ${
        isVisible ? "opacity-100 translate-y-0 blur-0" : "opacity-0 translate-y-12 blur-[1px]"
      }`}
      style={{
        transitionDelay: fromDetail ? "0ms" : `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
