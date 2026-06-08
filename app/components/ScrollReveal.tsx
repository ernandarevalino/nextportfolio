"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

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
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Infinite dynamic triggers on scroll up and down
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold,
        rootMargin: "0px 0px -80px 0px", // Trigger slightly before fully entering viewport
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
  }, [threshold]);

  return (
    <div
      ref={elementRef}
      className={`transition-all ${duration} ease-out ${className} ${
        isVisible ? "opacity-100 translate-y-0 blur-0" : "opacity-0 translate-y-12 blur-[1px]"
      }`}
      style={{
        transitionDelay: isVisible ? `${delay}ms` : "0ms",
      }}
    >
      {children}
    </div>
  );
}
