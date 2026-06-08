"use client";

import { useState, useEffect } from "react";
import {
  BsHouseDoor,
  BsPerson,
  BsHddStack,
  BsFileEarmarkText,
  BsImages,
  BsEnvelope,
  BsTwitter,
  BsFacebook,
  BsInstagram,
  BsGithub,
  BsLinkedin,
} from "react-icons/bs";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  const menuItems = [
    { id: "hero", label: "Home", icon: BsHouseDoor },
    { id: "about", label: "About", icon: BsPerson },
    { id: "skills", label: "Skills", icon: BsHddStack },
    { id: "resume", label: "Resume", icon: BsFileEarmarkText },
    { id: "portfolio", label: "Portfolio", icon: BsImages },
    { id: "contact", label: "Contact", icon: BsEnvelope },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 250; // Adjusted offset for modern layout

      for (const item of menuItems) {
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);

  // High-Fidelity Custom Cinematic Smooth Scroll Utility
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    if (!targetElement) return;

    // Header offset consideration (Sticky header height is 80px)
    const headerOffset = 80;
    
    // Get absolute position of target element relative to page top
    const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
    const startPosition = window.scrollY;
    const targetPosition = elementPosition - headerOffset;
    const distance = targetPosition - startPosition;
    
    let startTime: number | null = null;
    const duration = 950; // Cinematic animation duration in ms

    // Easing mathematical formula: Quadratic easeInOut
    const easeInOutQuad = (t: number, b: number, c: number, d: number) => {
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t + b;
      t--;
      return (-c / 2) * (t * (t - 2) - 1) + b;
    };

    const animation = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const nextScroll = easeInOutQuad(timeElapsed, startPosition, distance, duration);
      
      window.scrollTo(0, nextScroll);
      
      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      } else {
        // Perfect terminal scroll placement
        window.scrollTo(0, targetPosition);
      }
    };

    requestAnimationFrame(animation);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#1f1f1f]/75 backdrop-blur-md border-b border-white/5 transition-all duration-300 ease-in-out">
      <div className="container mx-auto px-6 md:px-12 max-w-7xl h-20 flex justify-between items-center relative">
        
        {/* Desktop Navigation (Left-aligned) */}
        <nav className="hidden xl:flex items-center space-x-1">
          {menuItems.map((item) => {
            const isActive = activeSection === item.id;
            const isPortfolio = item.label === "Portfolio";
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleSmoothScroll(e, item.id)}
                className={`relative py-2 px-4 text-sm font-medium transition-all duration-300 font-['Nunito'] ${
                  isPortfolio
                    ? "text-[#FFB900] hover:text-[#ffca43] drop-shadow-[0_0_8px_rgba(255,185,0,0.3)] hover:scale-105 transition-transform"
                    : isActive
                    ? "text-white"
                    : "text-[#ececec]/60 hover:text-white"
                } group flex items-center gap-2 cursor-pointer`}
              >
                {/* Micro-interaction active/hover dot */}
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isPortfolio ? "bg-[#FFB900]" : "bg-[#ececec]"
                  } transition-all duration-300 ${
                    isActive
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-50 group-hover:opacity-50 group-hover:scale-100"
                  }`}
                />
                <span className="relative z-10">{item.label}</span>

                {/* Background Pill */}
                <span
                  className={`absolute inset-0 rounded-full bg-white/5 transition-all duration-300 ease-in-out -z-10 ${
                    isActive
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100"
                  }`}
                />

                {/* Underline expanding from center */}
                <span
                  className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[1.5px] ${
                    isPortfolio ? "bg-[#FFB900]" : "bg-[#ececec]/80"
                  } rounded-full transition-all duration-300 ease-in-out ${
                    isActive ? "w-1/3" : "w-0 group-hover:w-1/3"
                  }`}
                />
              </a>
            );
          })}
        </nav>

        {/* Right-aligned Group: Socials + Mobile Menu Button */}
        <div className="flex items-center gap-6 ml-auto">
          {/* Compact Header Social Icons */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="#"
              className="text-[#ececec]/40 hover:text-white transition-all duration-300 hover:-translate-y-0.5"
              aria-label="Twitter"
            >
              <BsTwitter className="text-base" />
            </a>
            <a
              href="#"
              className="text-[#ececec]/40 hover:text-white transition-all duration-300 hover:-translate-y-0.5"
              aria-label="Facebook"
            >
              <BsFacebook className="text-base" />
            </a>
            <a
              href="#"
              className="text-[#ececec]/40 hover:text-white transition-all duration-300 hover:-translate-y-0.5"
              aria-label="Instagram"
            >
              <BsInstagram className="text-base" />
            </a>
            <a
              href="https://github.com/ernandarevalino"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#ececec]/40 hover:text-white transition-all duration-300 hover:-translate-y-0.5"
              aria-label="GitHub"
            >
              <BsGithub className="text-base" />
            </a>
            <a
              href="https://www.linkedin.com/in/ernanda-revalino-493751246"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#ececec]/40 hover:text-white transition-all duration-300 hover:-translate-y-0.5"
              aria-label="LinkedIn"
            >
              <BsLinkedin className="text-base" />
            </a>
          </div>

          {/* Mobile Menu Button - Animating Hamburger to X */}
          <div className="flex xl:hidden">
            <button
              onClick={toggleSidebar}
              className="flex flex-col justify-center items-center w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 text-[#ececec] transition-all duration-300 gap-[6px] relative z-50 focus:outline-none cursor-pointer"
              aria-label="Toggle Navigation"
            >
              <span
                className={`h-[2px] w-5 bg-current rounded-full transition-all duration-300 ease-in-out ${
                  isOpen ? "rotate-45 translate-y-[8px]" : ""
                }`}
              />
              <span
                className={`h-[2px] w-5 bg-current rounded-full transition-all duration-300 ease-in-out ${
                  isOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`h-[2px] w-5 bg-current rounded-full transition-all duration-300 ease-in-out ${
                  isOpen ? "-rotate-45 -translate-y-[8px]" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      <div
        className={`xl:hidden absolute top-20 left-0 right-0 bg-[#1f1f1f]/95 backdrop-blur-lg border-b border-white/5 transition-all duration-300 ease-in-out origin-top overflow-hidden ${
          isOpen
            ? "opacity-100 max-h-[500px] py-6"
            : "opacity-0 max-h-0 py-0 pointer-events-none"
        }`}
      >
        <div className="container mx-auto px-6 flex flex-col space-y-3">
          <nav className="flex flex-col space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              const isPortfolio = item.label === "Portfolio";
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => {
                    setIsOpen(false);
                    handleSmoothScroll(e, item.id);
                  }}
                  className={`flex items-center px-4 py-3 rounded-xl transition-all duration-300 font-['Nunito'] cursor-pointer ${
                    isPortfolio
                      ? `text-[#FFB900] hover:text-[#ffca43] drop-shadow-[0_0_8px_rgba(255,185,0,0.3)] hover:scale-105 transition-transform font-semibold ${
                          isActive ? "bg-white/10" : "bg-white/5"
                        }`
                      : isActive
                      ? "text-white bg-white/10 font-semibold"
                      : "text-[#ececec]/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className={`text-lg mr-3 ${isPortfolio ? "text-[#FFB900]" : ""}`} />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </nav>

          {/* Divider */}
          <div className="h-[1px] bg-white/5 my-3" />

          {/* Mobile Social Links */}
          <div className="flex items-center justify-center space-x-3.5 pb-2">
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-white/5 text-[#ececec]/60 hover:bg-[#ececec] hover:text-[#1f1f1f] flex items-center justify-center transition-all duration-300"
            >
              <BsTwitter className="text-base" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-white/5 text-[#ececec]/60 hover:bg-[#ececec] hover:text-[#1f1f1f] flex items-center justify-center transition-all duration-300"
            >
              <BsFacebook className="text-base" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-white/5 text-[#ececec]/60 hover:bg-[#ececec] hover:text-[#1f1f1f] flex items-center justify-center transition-all duration-300"
            >
              <BsInstagram className="text-base" />
            </a>
            <a
              href="https://github.com/ernandarevalino"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/5 text-[#ececec]/60 hover:bg-[#ececec] hover:text-[#1f1f1f] flex items-center justify-center transition-all duration-300"
            >
              <BsGithub className="text-base" />
            </a>
            <a
              href="https://www.linkedin.com/in/ernanda-revalino-493751246"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/5 text-[#ececec]/60 hover:bg-[#ececec] hover:text-[#1f1f1f] flex items-center justify-center transition-all duration-300"
            >
              <BsLinkedin className="text-base" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
