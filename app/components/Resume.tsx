"use client";

import { useState, useEffect } from "react";
import {
  BsGeoAlt,
  BsEnvelope,
  BsTelephone,
  BsMortarboard,
  BsBuilding,
  BsBriefcase,
  BsAward,
  BsChevronDown
} from "react-icons/bs";
import { getResumeData } from "@/actions/portfolio";
import { useLocale } from "next-intl";
import ScrollReveal from "./ScrollReveal";

interface ResumeProfile {
  id: number;
  summary_id: string;
  summary_en: string;
  location: string;
  email: string;
  phone: string;
  image_url: string;
}

interface ResumeSkill {
  id: number;
  name: string;
  percentage: number;
}

interface ResumeItem {
  id: number;
  type: "education" | "experience" | "certification";
  title_id: string;
  title_en: string;
  subtitle_id: string;
  subtitle_en: string;
  period_id: string;
  period_en: string;
  description_id: string;
  description_en: string;
  order_index: number;
}

export default function Resume() {
  const locale = useLocale();
  const [profile, setProfile] = useState<ResumeProfile | null>(null);
  const [skills, setSkills] = useState<ResumeSkill[]>([]);
  const [items, setItems] = useState<ResumeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAllExperience, setShowAllExperience] = useState(false);
  const [showAllEducation, setShowAllEducation] = useState(false);
  const [showAllCertifications, setShowAllCertifications] = useState(false);
  const isEn = locale === "en";

  useEffect(() => {
    async function loadResumeData() {
      try {
        const res = await getResumeData();
        if (res.success && res.data) {
          if (res.data.profile) {
            setProfile(res.data.profile);
          }
          if (res.data.skills && res.data.skills.length > 0) {
            setSkills(res.data.skills);
          }
          if (res.data.items && res.data.items.length > 0) {
            setItems(res.data.items);
          }
        }
      } catch (err) {
        console.error("Error fetching resume data in component:", err);
      } finally {
        setLoading(false);
      }
    }
    loadResumeData();
  }, []);

  if (loading) {
    return (
      <section id="resume" className="py-24 bg-[#1f1f1f] text-white relative scroll-mt-20">
        <div className="container mx-auto px-6 md:px-12 max-w-7xl relative z-10 animate-pulse">
          
          {/* Section Title Skeleton */}
          <div className="section-title text-center mb-16">
            <div className="h-10 w-48 bg-white/10 rounded-xl mx-auto mb-4"></div>
            <div className="h-4 w-96 bg-white/5 rounded-md mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Column Profile Card Skeleton */}
            <div className="lg:col-span-4 space-y-8">
              <div className="bg-gradient-to-br from-[#232323] to-[#202020] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-6">
                
                {/* Profile Image Frame Skeleton */}
                <div className="rounded-2xl border border-white/5 bg-white/5 aspect-[4/3] w-full"></div>

                {/* Summary Skeleton */}
                <div className="space-y-3">
                  <div className="h-5 w-24 bg-white/10 rounded border border-white/5"></div>
                  <div className="space-y-2 pt-2">
                    <div className="h-4 w-full bg-white/5 rounded"></div>
                    <div className="h-4 w-5/6 bg-white/5 rounded"></div>
                  </div>
                </div>

                {/* Contact Info Skeleton */}
                <div className="space-y-4 border-t border-white/5 pt-4">
                  <div className="h-5 w-28 bg-white/10 rounded border border-white/5"></div>
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, rIdx) => (
                      <div key={rIdx} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 shrink-0"></div>
                        <div className="h-4 w-40 bg-white/5 rounded"></div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Right Column Timeline Skeleton */}
            <div className="lg:col-span-8 lg:pl-6 space-y-16">
              
              {/* Education Section Skeleton */}
              <div className="space-y-8">
                <div className="h-8 w-44 bg-white/10 rounded-xl"></div>

                <div className="space-y-6">
                  {Array.from({ length: 2 }).map((_, idx) => (
                    <div key={idx} className="pl-8 border-l border-white/10 relative pb-6 last:pb-0">
                      <div className="absolute left-0 top-1.5 -translate-x-1/2 w-4 h-4 rounded-full bg-[#1f1f1f] border-[3px] border-white/10"></div>
                      <div className="bg-white/[0.02] p-6 rounded-2xl border border-white/5 space-y-3">
                        <div className="h-6 w-3/4 bg-white/10 rounded"></div>
                        <div className="h-4 w-24 bg-white/5 rounded-lg"></div>
                        <div className="h-4 w-1/2 bg-white/5 rounded"></div>
                        <div className="h-12 w-full bg-white/5 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>
    );
  }

  // Group items by type
  const educationItems = items.filter((item) => item.type === "education");
  const experienceItems = items.filter((item) => item.type === "experience");
  const certificationItems = items.filter((item) => item.type === "certification");

  // Logika pembuatan link interaktif otomatis
  const cleanPhone = profile?.phone ? profile.phone.replace(/\D/g, "") : "";
  const finalWaNumber = cleanPhone.startsWith("0") ? "62" + cleanPhone.slice(1) : cleanPhone;
  const whatsappLink = `https://wa.me/${finalWaNumber}`;
  const emailLink = `mailto:${profile?.email || ""}`;
  const mapsLink = profile?.location ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(profile.location)}` : "#";

  return (
    <section id="resume" className="py-24 bg-[#1f1f1f] text-white relative">
      <div className="container mx-auto px-6 md:px-12 max-w-7xl relative z-10">
        
        {/* Section Title */}
        <div className="section-title text-center mb-16">
          <ScrollReveal delay={0}>
            <h2 className="text-3xl md:text-5xl font-black font-ubuntu tracking-tight text-white uppercase mt-4">
              Resume
            </h2>
            <p className="text-[#ececec]/60 mt-3 text-base md:text-lg max-w-xl mx-auto font-['Nunito']">
              A comprehensive look at my professional journey, academic timeline, and core competencies.
            </p>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column (Summary, Contacts, Mini Skills Bento-style) */}
          <div className="lg:col-span-4 space-y-8">
            <ScrollReveal delay={150}>
              <div className="bg-gradient-to-br from-[#232323] to-[#202020] p-8 rounded-[2.5rem] border border-white/5 hover:border-white/10 shadow-2xl space-y-6 transition-all duration-300">
                
                {/* Profile Image with subtle zoom */}
                {profile?.image_url && (
                  <div className="overflow-hidden rounded-2xl border border-white/5 shadow-lg bg-black/20 group relative aspect-[4/3]">
                    <img
                      src={profile.image_url}
                      alt="Resume profile animated"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1f1f1f]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                )}

                {/* Summary */}
                <div className="space-y-3">
                  <h3 className="text-lg font-bold font-ubuntu text-white tracking-wide uppercase border-b border-white/5 pb-2">Summary</h3>
                  <p className="text-sm md:text-base text-[#ececec]/80 italic leading-relaxed font-['Nunito']">
                    &ldquo;{(isEn ? profile?.summary_en : profile?.summary_id) || "Passionate software engineer focused on pixel-perfect modern web development and data-driven systems."}&rdquo;
                  </p>
                </div>

                {/* Contact Info (Sleek & Elegant) */}
                <div className="space-y-4 border-t border-white/5 pt-5">
                  <h3 className="text-xs font-bold font-ubuntu text-white/30 tracking-wider uppercase">Information</h3>
                  <ul className="space-y-3 text-sm md:text-base">
                    {profile?.location && (
                      <li>
                        <a 
                          href={mapsLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3.5 group/contact text-white/60 hover:text-white transition-colors duration-300 w-full"
                        >
                          <div className="w-8 h-8 rounded-xl bg-white/[0.02] group-hover/contact:bg-white/[0.08] flex items-center justify-center shrink-0 border border-white/5 group-hover/contact:border-white/20 transition-all duration-300">
                            <BsGeoAlt className="text-white/50 group-hover/contact:text-white transition-colors duration-300 text-sm" />
                          </div>
                          <span className="font-['Nunito'] font-medium tracking-wide">{profile.location}</span>
                        </a>
                      </li>
                    )}
                    
                    {profile?.email && (
                      <li>
                        <a 
                          href={emailLink}
                          className="flex items-center gap-3.5 group/contact text-white/60 hover:text-white transition-colors duration-300 w-full"
                        >
                          <div className="w-8 h-8 rounded-xl bg-white/[0.02] group-hover/contact:bg-white/[0.08] flex items-center justify-center shrink-0 border border-white/5 group-hover/contact:border-white/20 transition-all duration-300">
                            <BsEnvelope className="text-white/50 group-hover/contact:text-white transition-colors duration-300 text-sm" />
                          </div>
                          <span className="truncate font-['Nunito'] font-medium tracking-wide">{profile.email}</span>
                        </a>
                      </li>
                    )}
                    
                    {profile?.phone && (
                      <li>
                        <a 
                          href={whatsappLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3.5 group/contact text-white/60 hover:text-white transition-colors duration-300 w-full"
                        >
                          <div className="w-8 h-8 rounded-xl bg-white/[0.02] group-hover/contact:bg-white/[0.08] flex items-center justify-center shrink-0 border border-white/5 group-hover/contact:border-white/20 transition-all duration-300">
                            <BsTelephone className="text-white/50 group-hover/contact:text-white transition-colors duration-300 text-sm" />
                          </div>
                          <span className="font-['Nunito'] font-medium tracking-wide">{profile.phone}</span>
                        </a>
                      </li>
                    )}
                  </ul>
                </div>

                {/* Technical Mini Skills */}
                {skills.length > 0 && (
                  <div className="space-y-4 border-t border-white/5 pt-4">
                    <h3 className="text-lg font-bold font-ubuntu text-white tracking-wide uppercase pb-2">Technical Skills</h3>
                    <div className="space-y-4">
                      {skills.map((s) => (
                        <div key={s.id || s.name} className="space-y-1.5 group/skill">
                          <div className="flex justify-between text-xs md:text-sm font-bold text-[#ececec]/90">
                            <span className="transition-colors duration-300 group-hover/skill:text-white">{s.name}</span>
                            <span className="bg-white/5 px-1.5 py-[1px] rounded text-[10px]">{s.percentage}%</span>
                          </div>
                          <div className="w-full h-[6px] bg-white/5 rounded-full overflow-hidden border border-white/5">
                            <div
                              className="h-full bg-gradient-to-r from-white/30 to-[#ececec] rounded-full transition-all duration-1000"
                              style={{ width: `${s.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </ScrollReveal>
          </div>

          {/* Right Column (Education & Experience Premium Timeline) */}
          <div className="lg:col-span-8 lg:pl-6 space-y-16">
            
            {/* Education Section */}
            {educationItems.length > 0 && (
              <div className="space-y-8">
                <ScrollReveal delay={0}>
                  <h3 className="text-2xl font-bold font-ubuntu text-white flex items-center gap-3 border-b border-white/5 pb-4 tracking-wide uppercase">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
                      <BsMortarboard className="text-xl" />
                    </div>
                    Education
                  </h3>
                </ScrollReveal>

                <div className="space-y-6">
                  {(showAllEducation ? educationItems : educationItems.slice(0, 1)).map((edu, idx) => (
                    <ScrollReveal key={edu.id} delay={idx * 150}>
                      <div className="group relative pl-8 border-l border-white/10 last:border-transparent pb-6 last:pb-0">
                        
                        <div className="absolute left-0 top-1.5 -translate-x-1/2 w-4 h-4 rounded-full bg-[#1f1f1f] border-[3px] border-white/30 group-hover:border-white group-hover:scale-125 transition-all duration-300 shadow-md flex items-center justify-center z-10">
                          <div className="w-1.5 h-1.5 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>

                        <div className="bg-white/[0.02] group-hover:bg-white/[0.04] p-6 rounded-2xl border border-white/5 group-hover:border-white/15 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10 relative">
                          <h4 className="text-lg md:text-xl font-bold text-white group-hover:text-[#ececec] transition-colors duration-300">
                            {isEn ? edu.title_en : edu.title_id}
                          </h4>
                          
                          <span className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-semibold my-2 text-[#ececec]/80 font-['Nunito']">
                            {isEn ? edu.period_en : edu.period_id}
                          </span>
                          
                          {(isEn ? edu.subtitle_en : edu.subtitle_id) && (
                            <p className="text-sm md:text-base text-[#ececec]/60 flex items-center gap-2 mb-2 font-medium font-['Nunito']">
                              <BsBuilding className="shrink-0 text-xs" /> {isEn ? edu.subtitle_en : edu.subtitle_id}
                            </p>
                          )}
                          {(isEn ? edu.description_en : edu.description_id) && (
                            <p className="text-sm md:text-base text-[#ececec]/70 leading-relaxed font-['Nunito'] mt-3">
                              {isEn ? edu.description_en : edu.description_id}
                            </p>
                          )}
                        </div>

                      </div>
                    </ScrollReveal>
                  ))}
                </div>

                {educationItems.length > 1 && (
                  <div className="flex justify-center mt-5">
                    <button
                      type="button"
                      onClick={() => setShowAllEducation(!showAllEducation)}
                      className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white/40 hover:text-white/80 transition-colors duration-300 group cursor-pointer"
                    >
                      <span>
                        {showAllEducation
                          ? (isEn ? "Show Less" : "Tampilkan Lebih Sedikit")
                          : (isEn ? "Load More Education" : "Tampilkan Lebih Banyak Pendidikan")}
                      </span>
                      <BsChevronDown
                        className={`text-[10px] transition-transform duration-300 ${
                          showAllEducation ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Experience Section */}
            {experienceItems.length > 0 && (
              <div className="space-y-8">
                <ScrollReveal delay={0}>
                  <h3 className="text-2xl font-bold font-ubuntu text-white flex items-center gap-3 border-b border-white/5 pb-4 tracking-wide uppercase">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
                      <BsBriefcase className="text-xl" />
                    </div>
                    Experience
                  </h3>
                </ScrollReveal>

                <div className="space-y-6">
                  {(showAllExperience ? experienceItems : experienceItems.slice(0, 1)).map((exp, idx) => {
                    const descText = isEn ? exp.description_en : exp.description_id;
                    const descBullets = descText
                      ? descText.split("\n").filter((b) => b.trim() !== "")
                      : [];

                    return (
                      <ScrollReveal key={exp.id} delay={idx * 150}>
                        <div className="group relative pl-8 border-l border-white/10 last:border-transparent pb-6 last:pb-0">
                          
                          <div className="absolute left-0 top-1.5 -translate-x-1/2 w-4 h-4 rounded-full bg-[#1f1f1f] border-[3px] border-white/30 group-hover:border-white group-hover:scale-125 transition-all duration-300 shadow-md flex items-center justify-center z-10">
                            <div className="w-1.5 h-1.5 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </div>

                          <div className="bg-white/[0.02] group-hover:bg-white/[0.04] p-6 rounded-2xl border border-white/5 group-hover:border-white/15 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10 relative">
                            <h4 className="text-lg md:text-xl font-bold text-white group-hover:text-[#ececec] transition-colors duration-300">
                              {isEn ? exp.title_en : exp.title_id}
                            </h4>
                            
                            <span className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-semibold my-2 text-[#ececec]/80 font-['Nunito']">
                              {isEn ? exp.period_en : exp.period_id}
                            </span>
                            
                            {(isEn ? exp.subtitle_en : exp.subtitle_id) && (
                              <p className="text-sm md:text-base text-[#ececec]/60 flex items-center gap-2 mb-3 font-medium font-['Nunito']">
                                <BsBuilding className="shrink-0 text-xs" /> {isEn ? exp.subtitle_en : exp.subtitle_id}
                              </p>
                            )}
                            {descBullets.length > 0 && (
                              <ul className="list-disc pl-5 space-y-2 text-sm md:text-base text-[#ececec]/70 leading-relaxed font-['Nunito'] mt-3">
                                {descBullets.map((bullet, idx) => (
                                  <li key={idx} dangerouslySetInnerHTML={{ __html: bullet }}></li>
                                ))}
                              </ul>
                            )}
                          </div>

                        </div>
                      </ScrollReveal>
                    );
                  })}
                </div>

                {experienceItems.length > 1 && (
                  <div className="flex justify-center mt-5">
                    <button
                      type="button"
                      onClick={() => setShowAllExperience(!showAllExperience)}
                      className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white/40 hover:text-white/80 transition-colors duration-300 group cursor-pointer"
                    >
                      <span>
                        {showAllExperience
                          ? (isEn ? "Show Less" : "Tampilkan Lebih Sedikit")
                          : (isEn ? "Load More Experience" : "Tampilkan Lebih Banyak Pengalaman")}
                      </span>
                      <BsChevronDown
                        className={`text-[10px] transition-transform duration-300 ${
                          showAllExperience ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Certifications Section */}
            {certificationItems.length > 0 && (
              <div className="space-y-8">
                <ScrollReveal delay={0}>
                  <h3 className="text-2xl font-bold font-ubuntu text-white flex items-center gap-3 border-b border-white/5 pb-4 tracking-wide uppercase">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
                      <BsAward className="text-xl" />
                    </div>
                    Certifications
                  </h3>
                </ScrollReveal>

                <div className="space-y-6">
                  {(showAllCertifications ? certificationItems : certificationItems.slice(0, 1)).map((cert, idx) => (
                    <ScrollReveal key={cert.id} delay={idx * 150}>
                      <div className="group relative pl-8 border-l border-white/10 last:border-transparent pb-6 last:pb-0">
                        
                        <div className="absolute left-0 top-1.5 -translate-x-1/2 w-4 h-4 rounded-full bg-[#1f1f1f] border-[3px] border-white/30 group-hover:border-white group-hover:scale-125 transition-all duration-300 shadow-md flex items-center justify-center z-10">
                          <div className="w-1.5 h-1.5 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>

                        <div className="bg-white/[0.02] group-hover:bg-white/[0.04] p-6 rounded-2xl border border-white/5 group-hover:border-white/15 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10 relative">
                          <h4 className="text-lg md:text-xl font-bold text-white group-hover:text-[#ececec] transition-colors duration-300">
                            {isEn ? cert.title_en : cert.title_id}
                          </h4>
                          
                          <span className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-semibold my-2 text-[#ececec]/80 font-['Nunito']">
                            {isEn ? cert.period_en : cert.period_id}
                          </span>
                          
                          {(isEn ? cert.subtitle_en : cert.subtitle_id) && (
                            <p className="text-sm md:text-base text-[#ececec]/60 flex items-center gap-2 mb-2 font-medium font-['Nunito']">
                              <BsBuilding className="shrink-0 text-xs" /> {isEn ? cert.subtitle_en : cert.subtitle_id}
                            </p>
                          )}
                          {(isEn ? cert.description_en : cert.description_id) && (
                            <p className="text-sm md:text-base text-[#ececec]/70 leading-relaxed font-['Nunito'] mt-3">
                              {isEn ? cert.description_en : cert.description_id}
                            </p>
                          )}
                        </div>

                      </div>
                    </ScrollReveal>
                  ))}
                </div>

                {certificationItems.length > 1 && (
                  <div className="flex justify-center mt-5">
                    <button
                      type="button"
                      onClick={() => setShowAllCertifications(!showAllCertifications)}
                      className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white/40 hover:text-white/80 transition-colors duration-300 group cursor-pointer"
                    >
                      <span>
                        {showAllCertifications
                          ? (isEn ? "Show Less" : "Tampilkan Lebih Sedikit")
                          : (isEn ? "Load More Certifications" : "Tampilkan Lebih Banyak Sertifikasi")}
                      </span>
                      <BsChevronDown
                        className={`text-[10px] transition-transform duration-300 ${
                          showAllCertifications ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}