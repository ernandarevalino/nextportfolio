"use client";

import { useState, useEffect } from "react";
import { BsGithub, BsLinkedin, BsInstagram } from "react-icons/bs";

interface Profile {
  id: number;
  hero_title: string;
  hero_name: string;
  hero_description: string;
  typewriter_words: string[];
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

    // Reset index if out of bounds (e.g. if typewriter list changed)
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
    <span className="border-r-2 border-white/60 pr-1 animate-pulse text-[#ececec]">
      {currentText}
    </span>
  );
}

interface HeroProps {
  profile: Profile | null;
}

export default function Hero({ profile }: HeroProps) {
  const data = {
    hero_title: profile?.hero_title || "",
    hero_name: profile?.hero_name || "",
    hero_description: profile?.hero_description || "",
    typewriter_words: profile?.typewriter_words || [],
    github_url: profile?.github_url || "",
    linkedin_url: profile?.linkedin_url || "",
    instagram_url: profile?.instagram_url || "",
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden py-12 lg:py-0">
      
      {/* Floating Background Circles */}
      <div className="absolute inset-0 z-1 pointer-events-none overflow-hidden">
        <div className="absolute w-[300px] h-[300px] rounded-full bg-gradient-to-tr from-[#ececec]/10 to-[#ececec]/5 top-[10%] right-[10%] animate-float circle-1"></div>
        <div className="absolute w-[200px] h-[200px] rounded-full bg-gradient-to-tr from-[#ececec]/10 to-[#ececec]/5 bottom-[20%] left-[5%] animate-float circle-2" style={{ animationDelay: "2s" }}></div>
      </div>

      <div className="relative w-full z-10 px-4 md:px-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Text Intro Column */}
            <div className="lg:col-span-6 text-center lg:text-left order-2 lg:order-1">
              <div className="space-y-6">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold font-ubuntu leading-tight">
                  <span className="relative inline-block text-white">
                    {data.hero_title}
                    <span className="absolute bottom-[-5px] left-0 w-full h-[3px] bg-gradient-to-r from-[#ececec] to-[#ececec]/50"></span>
                  </span>
                </h1>
                
                <p className="text-xl md:text-2xl text-[#ececec]/90">
                  My Name Is <span className="text-2xl md:text-3xl font-bold text-white">{data.hero_name}</span>
                </p>

                <p className="text-xl md:text-2xl font-['Nunito'] text-white/80">
                  I'm a <Typewriter words={data.typewriter_words} />
                </p>

                <p className="text-[#ececec]/80 text-base md:text-lg max-w-lg mx-auto lg:mx-0 leading-relaxed">
                  {data.hero_description}
                </p>

                <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-2">
                  <a
                    href="#portfolio"
                    className="px-8 py-[14px] text-base font-semibold rounded-full border-2 border-[#ececec] bg-[#ececec] text-[#310606] hover:bg-transparent hover:text-[#ececec] transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-[#ececec]/20"
                  >
                    View My Work
                  </a>
                  <a
                    href="#contact"
                    className="px-8 py-[14px] text-base font-semibold rounded-full border-2 border-[#ececec] bg-transparent text-[#ececec] hover:bg-[#ececec] hover:text-[#310606] transition-all duration-300 hover:-translate-y-1"
                  >
                    Get In Touch
                  </a>
                </div>

                <div className="flex gap-4 justify-center lg:justify-start pt-4">
                  {data.instagram_url && (
                    <a
                      href={data.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-[50px] h-[50px] flex items-center justify-center bg-[#232323] text-[#ececec]/60 rounded-full text-xl transition-all duration-300 hover:bg-[#ececec] hover:text-[#310606] hover:-translate-y-1 hover:shadow-lg hover:shadow-[#ececec]/20"
                    >
                      <BsInstagram />
                    </a>
                  )}
                  {data.github_url && (
                    <a
                      href={data.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-[50px] h-[50px] flex items-center justify-center bg-[#232323] text-[#ececec]/60 rounded-full text-xl transition-all duration-300 hover:bg-[#ececec] hover:text-[#310606] hover:-translate-y-1 hover:shadow-lg hover:shadow-[#ececec]/20"
                    >
                      <BsGithub />
                    </a>
                  )}
                  {data.linkedin_url && (
                    <a
                      href={data.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-[50px] h-[50px] flex items-center justify-center bg-[#232323] text-[#ececec]/60 rounded-full text-xl transition-all duration-300 hover:bg-[#ececec] hover:text-[#310606] hover:-translate-y-1 hover:shadow-lg hover:shadow-[#ececec]/20"
                    >
                      <BsLinkedin />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Visual Column */}
            <div className="lg:col-span-6 flex justify-center items-center order-1 lg:order-2">
              <div className="relative w-[280px] h-[280px] md:w-[350px] md:h-[350px] lg:w-[400px] lg:h-[400px]">
                <div className="absolute top-[15px] left-[15px] w-full h-full bg-[#ececec]/10 border border-white/20 rounded-[30px] z-1"></div>
                <img
                  src="/image-animation/video-1.gif"
                  alt="Hero"
                  className="relative w-full h-full object-cover rounded-[30px] z-10 border border-white/10"
                />
              </div>
            </div>

          </div>
        </div>
      </div>

    </section>
  );
}
