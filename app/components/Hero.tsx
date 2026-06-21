"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { BsGithub, BsLinkedin, BsInstagram, BsArrowRight } from "react-icons/bs";
import ScrollReveal from "./ScrollReveal";

interface Profile {
  id: number;
  hero_title_id: string;
  hero_title_en: string;
  hero_name: string;
  hero_description_id: string;
  hero_description_en: string;
  typewriter_words_id: string[];
  typewriter_words_en: string[];
  github_url: string;
  linkedin_url: string;
  instagram_url: string;
}

// Custom Typewriter component for the typing effect
function Typewriter({ words, speed = 100, delay = 2000 }: { words: string[]; speed?: number; delay?: number }) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!words || words.length === 0) return;

    if (currentWordIndex >= words.length) {
      setCurrentWordIndex(0);
      setCurrentText("");
      setIsDeleting(false);
      return;
    }

    let timer: NodeJS.Timeout;
    const activeWord = words[currentWordIndex];
    if (!activeWord) return;

    const handleType = () => {
      if (!isDeleting) {
        setCurrentText(activeWord.substring(0, currentText.length + 1));
        if (currentText.length === activeWord.length) {
          timer = setTimeout(() => setIsDeleting(true), delay);
          return;
        }
      } else {
        setCurrentText(activeWord.substring(0, currentText.length - 1));
        if (currentText.length === 0) {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
          return;
        }
      }

      timer = setTimeout(handleType, isDeleting ? speed / 2 : speed);
    };

    timer = setTimeout(handleType, isDeleting ? speed / 2 : speed);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIndex, words, speed, delay]);

  if (!words || words.length === 0) return null;

  return (
    <span className="border-r-2 border-white/60 pr-1.5 animate-pulse text-white font-semibold">
      {currentText}
    </span>
  );
}

interface HeroProps {
  profile: Profile | null;
}

export default function Hero({ profile }: HeroProps) {
  const locale = useLocale();
  const isEn = locale === "en";
  const data = {
    hero_title: (isEn ? profile?.hero_title_en : profile?.hero_title_id) || "Creative Developer",
    hero_name: profile?.hero_name || "Ernanda Revalino",
    hero_description: (isEn ? profile?.hero_description_en : profile?.hero_description_id) || "Passionate about designing and constructing state-of-the-art web applications that bridge elegance, usability, and modern high performance.",
    typewriter_words: (isEn ? profile?.typewriter_words_en : profile?.typewriter_words_id) || ["Frontend Developer", "Data Analyst", "React Enthusiast"],
    github_url: profile?.github_url || "https://github.com/ernandarevalino",
    linkedin_url: profile?.linkedin_url || "https://www.linkedin.com/in/ernanda-revalino-493751246",
    instagram_url: profile?.instagram_url || "https://instagram.com",
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden py-24 lg:py-0 bg-[#1f1f1f]">
      
      {/* Premium Tech Subtle Background Grid */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
      
      {/* Floating Background Circles with Smooth Glows */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[400px] h-[400px] rounded-full bg-white/[0.02] blur-3xl top-[5%] right-[10%] animate-float"></div>
        <div className="absolute w-[300px] h-[300px] rounded-full bg-white/[0.015] blur-2xl bottom-[15%] left-[5%] animate-float" style={{ animationDelay: "3s" }}></div>
      </div>

      {/* DISINI PERUBAHANNYA: Menambahkan lg:-translate-y-12 agar posisi konten naik ke atas secara proporsional */}
      <div className="container mx-auto px-6 md:px-12 max-w-7xl relative z-10 lg:-translate-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Text Intro Column */}
          <div className="lg:col-span-7 text-center lg:text-left order-2 lg:order-1">
            <ScrollReveal delay={0}>
              <div className="space-y-8 max-w-2xl mx-auto lg:mx-0">

                {/* Massive Typography Headline */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-ubuntu leading-[1.1] tracking-tight text-white">
                  My Name<br />
                  <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-white via-[#ececec] to-white/70">
                    {data.hero_name}
                  </span>
                </h1>
                
                {/* Typing Effect Container */}
                <p className="text-lg md:text-2xl font-['Nunito'] text-[#ececec]/80">
                  I'm <Typewriter words={data.typewriter_words} />
                </p>

                {/* Description */}
                <p className="text-[#ececec]/70 text-base md:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0 font-['Nunito']">
                  {data.hero_description}
                </p>

                {/* Action Buttons & Social Icons Wrapper */}
                <div className="flex flex-col lg:flex-row lg:items-center gap-6 pt-4">
                  {/* Interactive Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <a
                      href="#portfolio"
                      className="group px-8 py-4 text-sm md:text-base font-bold rounded-full bg-[#ececec] text-[#1f1f1f] hover:bg-white hover:scale-105 hover:-translate-y-0.5 active:scale-95 transition-all duration-300 ease-out flex items-center justify-center gap-2 shadow-lg shadow-white/5 cursor-pointer"
                    >
                      <span>View My Work</span>
                      <BsArrowRight className="text-base group-hover:translate-x-1 transition-transform duration-300" />
                    </a>
                    <a
                      href="#contact"
                      className="px-8 py-4 text-sm md:text-base font-bold rounded-full bg-white/5 text-[#ececec] border border-white/10 hover:bg-white/10 hover:border-white/20 hover:scale-105 hover:-translate-y-0.5 active:scale-95 transition-all duration-300 ease-out flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Get In Touch</span>
                    </a>
                  </div>

                  {/* Premium Social Media Icons */}
                  <div className="flex gap-3 justify-center lg:justify-start">
                    {data.instagram_url && (
                      <a
                        href={data.instagram_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/5 text-[#ececec]/60 rounded-full text-lg transition-all duration-300 hover:bg-[#ececec] hover:text-[#1f1f1f] hover:-translate-y-1 hover:shadow-lg hover:shadow-white/5"
                        aria-label="Instagram"
                      >
                        <BsInstagram />
                      </a>
                    )}
                    {data.github_url && (
                      <a
                        href={data.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/5 text-[#ececec]/60 rounded-full text-lg transition-all duration-300 hover:bg-[#ececec] hover:text-[#1f1f1f] hover:-translate-y-1 hover:shadow-lg hover:shadow-white/5"
                        aria-label="GitHub"
                      >
                        <BsGithub />
                      </a>
                    )}
                    {data.linkedin_url && (
                      <a
                        href={data.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/5 text-[#ececec]/60 rounded-full text-lg transition-all duration-300 hover:bg-[#ececec] hover:text-[#1f1f1f] hover:-translate-y-1 hover:shadow-lg hover:shadow-white/5"
                        aria-label="LinkedIn"
                      >
                        <BsLinkedin />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Visual Column */}
          <div className="lg:col-span-5 flex justify-center items-center order-1 lg:order-2">
            <ScrollReveal delay={200}>
              <div className="relative w-[280px] h-[280px] md:w-[380px] md:h-[380px] lg:w-[420px] lg:h-[420px] group">
                
                {/* Modern Decorative Glow Backdrop */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-white/0 rounded-[2.5rem] blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
                
                {/* Background Rotating Frame Accent */}
                <div className="absolute -inset-1 bg-white/5 border border-white/10 rounded-[2.5rem] -z-10 group-hover:scale-102 group-hover:rotate-1 transition-all duration-500"></div>
                
                {/* Actual Image Frame */}
                <div className="relative w-full h-full rounded-[2.2rem] overflow-hidden border border-white/10 bg-[#232323] shadow-2xl">
                  <img
                    src="/image-animation/video-1.gif"
                    alt="Hero animation"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  
                  {/* Interactive Glassmorphic Headline Tag inside image frame */}
                  <div className="absolute bottom-6 left-6 z-20 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white text-xs font-semibold uppercase tracking-wider opacity-0 translate-y-3 scale-95 pointer-events-none transition-all duration-500 ease-out delay-150 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    {data.hero_title}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

        </div>
      </div>

    </section>
  );
}