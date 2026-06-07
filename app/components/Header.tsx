"use client";

import { useState, useEffect } from "react";
import {
  BsHouseDoor,
  BsPerson,
  BsHddStack,
  BsFileEarmarkText,
  BsMenuButton,
  BsImages,
  BsEnvelope,
  BsList,
  BsXLg,
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
    { id: "stats", label: "Project", icon: BsMenuButton },
    { id: "portfolio", label: "Portfolio", icon: BsImages },
    { id: "contact", label: "Contact", icon: BsEnvelope },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200; // Offset for accuracy
      
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
    // Initial call
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="fixed right-[15px] top-[15px] z-[9999] xl:hidden w-10 h-10 rounded-full flex items-center justify-center bg-[#ececec] text-[#444444] transition-colors duration-300 hover:bg-white text-xl"
        aria-label="Toggle Navigation"
      >
        {isOpen ? <BsXLg /> : <BsList />}
      </button>

      {/* Header Sidebar */}
      <header
        className={`fixed top-0 bottom-0 z-[997] w-[300px] px-[15px] py-4 flex flex-col justify-center transition-all duration-300 xl:left-0 ${
          isOpen ? "left-0" : "-left-[300px]"
        }`}
      >
        <div className="header-container flex flex-col justify-between h-full max-h-[90vh] w-full p-[15px] rounded-[20px] bg-[#1b1b1b] border border-white/20">
          
          {/* Navigation Menu */}
          <nav className="navmenu w-full mt-4">
            <ul className="list-none p-0 m-0 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center w-full px-[10px] py-[15px] font-['Nunito'] text-base transition-colors duration-300 ${
                        isActive
                          ? "text-white font-semibold"
                          : "text-[#ececec]/60 hover:text-white"
                      }`}
                    >
                      <Icon
                        className={`text-[20px] mr-[10px] transition-colors duration-300 ${
                          isActive ? "text-[#ececec]" : "text-[#ececec]/60 hover:text-white"
                        }`}
                      />
                      <span>{item.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Social Links */}
          <div className="social-links text-center mb-4">
            <a
              href="#"
              className="inline-flex items-center justify-center w-10 h-10 mx-[2px] rounded-full bg-white/10 text-white text-[16px] transition-colors duration-300 hover:bg-[#ececec] hover:text-[#444444]"
            >
              <BsTwitter />
            </a>
            <a
              href="#"
              className="inline-flex items-center justify-center w-10 h-10 mx-[2px] rounded-full bg-white/10 text-white text-[16px] transition-colors duration-300 hover:bg-[#ececec] hover:text-[#444444]"
            >
              <BsFacebook />
            </a>
            <a
              href="#"
              className="inline-flex items-center justify-center w-10 h-10 mx-[2px] rounded-full bg-white/10 text-white text-[16px] transition-colors duration-300 hover:bg-[#ececec] hover:text-[#444444]"
            >
              <BsInstagram />
            </a>
            <a
              href="https://github.com/ernandarevalino"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-10 h-10 mx-[2px] rounded-full bg-white/10 text-white text-[16px] transition-colors duration-300 hover:bg-[#ececec] hover:text-[#444444]"
            >
              <BsGithub />
            </a>
            <a
              href="https://www.linkedin.com/in/ernanda-revalino-493751246"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-10 h-10 mx-[2px] rounded-full bg-white/10 text-white text-[16px] transition-colors duration-300 hover:bg-[#ececec] hover:text-[#444444]"
            >
              <BsLinkedin />
            </a>
          </div>

        </div>
      </header>
    </>
  );
}
