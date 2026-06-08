"use client";

import { useState, useEffect } from "react";
import {
  BsGeoAlt,
  BsEnvelope,
  BsTelephone,
  BsMortarboard,
  BsBuilding,
  BsBriefcase,
  BsAward
} from "react-icons/bs";
import { getResumeData } from "@/actions/portfolio";

interface ResumeProfile {
  id: number;
  summary: string;
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
  title: string;
  subtitle: string;
  period: string;
  description: string;
  order_index: number;
}

export default function Resume() {
  const [profile, setProfile] = useState<ResumeProfile | null>(null);
  const [skills, setSkills] = useState<ResumeSkill[]>([]);
  const [items, setItems] = useState<ResumeItem[]>([]);
  const [loading, setLoading] = useState(true);

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
      <section id="resume" className="py-20 bg-[#1f1f1f] text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="w-12 h-12 border-4 border-[#ececec] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#ececec]/60">Loading resume content...</p>
        </div>
      </section>
    );
  }

  // Group items by type
  const educationItems = items.filter((item) => item.type === "education");
  const experienceItems = items.filter((item) => item.type === "experience");
  const certificationItems = items.filter((item) => item.type === "certification");

  return (
    <section id="resume" className="py-20 bg-[#1f1f1f] text-white">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Section Title */}
        <div className="section-title text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold font-ubuntu tracking-wide text-white uppercase inline-block">
            Resume
          </h2>
          <p className="text-[#ececec]/70 mt-4 text-base md:text-lg">
            A timeline of my academic and some project experience.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column (Summary, Contacts, Mini Skills) */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-[#232323] p-8 rounded-[2rem] border border-white/10 shadow-xl space-y-6">
              
              {/* Profile GIF */}
              {profile?.image_url && (
                <div className="overflow-hidden rounded-2xl border border-white/10 shadow-lg bg-black/20">
                  <img
                    src={profile.image_url}
                    alt="Resume profile animated"
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}

              {/* Summary */}
              <div className="space-y-3">
                <h3 className="text-xl font-bold font-ubuntu text-white">Summary</h3>
                <p className="text-sm md:text-base text-[#ececec]/85 italic leading-relaxed">
                  &ldquo;{profile?.summary || ""}&rdquo;
                </p>
              </div>

              {/* Contact Info */}
              <div className="space-y-4 border-t border-white/10 pt-4">
                <h3 className="text-xl font-bold font-ubuntu text-white">Contact Information</h3>
                <ul className="space-y-3 text-[#ececec]/80 text-sm md:text-base">
                  {profile?.location && (
                    <li className="flex items-center gap-3">
                      <BsGeoAlt className="text-white shrink-0 text-lg" />
                      <span>{profile.location}</span>
                    </li>
                  )}
                  {profile?.email && (
                    <li className="flex items-center gap-3">
                      <BsEnvelope className="text-white shrink-0 text-lg" />
                      <span className="truncate">{profile.email}</span>
                    </li>
                  )}
                  {profile?.phone && (
                    <li className="flex items-center gap-3">
                      <BsTelephone className="text-white shrink-0 text-lg" />
                      <span>{profile.phone}</span>
                    </li>
                  )}
                </ul>
              </div>

              {/* Technical Mini Skills */}
              {skills.length > 0 && (
                <div className="space-y-4 border-t border-white/10 pt-4">
                  <h3 className="text-xl font-bold font-ubuntu text-white">Technical Skills</h3>
                  <div className="space-y-4">
                    {skills.map((s) => (
                      <div key={s.id || s.name} className="space-y-1">
                        <div className="flex justify-between text-xs md:text-sm font-semibold text-[#ececec]">
                          <span>{s.name}</span>
                          <span>{s.percentage}%</span>
                        </div>
                        <div className="w-full h-[6px] bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-white/40 to-[#ececec] rounded-full"
                            style={{ width: `${s.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Right Column (Education & Experience Timeline) */}
          <div className="lg:col-span-8 lg:pl-6 space-y-12">
            
            {/* Education Section */}
            {educationItems.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold font-ubuntu text-white flex items-center gap-3 border-b border-white/10 pb-3">
                  <BsMortarboard className="text-2xl" /> Education
                </h3>

                <div className="relative border-l-2 border-white/10 pl-6 space-y-8 ml-3">
                  {educationItems.map((edu) => (
                    <div key={edu.id} className="resume-item">
                      <h4 className="text-lg md:text-xl font-bold text-white">{edu.title}</h4>
                      <span className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded text-xs font-semibold my-2 text-[#ececec]">
                        {edu.period}
                      </span>
                      {edu.subtitle && (
                        <p className="text-sm md:text-base text-white/70 flex items-center gap-2 mb-2 font-medium">
                          <BsBuilding className="shrink-0" /> {edu.subtitle}
                        </p>
                      )}
                      {edu.description && (
                        <p className="text-sm md:text-base text-[#ececec]/80 leading-relaxed">
                          {edu.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Experience Section */}
            {experienceItems.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold font-ubuntu text-white flex items-center gap-3 border-b border-white/10 pb-3">
                  <BsBriefcase className="text-2xl" /> Experience
                </h3>

                <div className="relative border-l-2 border-white/10 pl-6 space-y-8 ml-3">
                  {experienceItems.map((exp) => {
                    const descBullets = exp.description
                      ? exp.description.split("\n").filter((b) => b.trim() !== "")
                      : [];

                    return (
                      <div key={exp.id} className="resume-item">
                        <h4 className="text-lg md:text-xl font-bold text-white">{exp.title}</h4>
                        <span className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded text-xs font-semibold my-2 text-[#ececec]">
                          {exp.period}
                        </span>
                        {exp.subtitle && (
                          <p className="text-sm md:text-base text-white/70 flex items-center gap-2 mb-3 font-medium">
                            <BsBuilding className="shrink-0" /> {exp.subtitle}
                          </p>
                        )}
                        {descBullets.length > 0 && (
                          <ul className="list-disc pl-5 space-y-2 text-sm md:text-base text-[#ececec]/80 leading-relaxed">
                            {descBullets.map((bullet, idx) => (
                              <li key={idx} dangerouslySetInnerHTML={{ __html: bullet }}></li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Certifications Section */}
            {certificationItems.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold font-ubuntu text-white flex items-center gap-3 border-b border-white/10 pb-3">
                  <BsAward className="text-2xl" /> Certifications
                </h3>

                <div className="relative border-l-2 border-white/10 pl-6 space-y-8 ml-3">
                  {certificationItems.map((cert) => (
                    <div key={cert.id} className="resume-item">
                      <h4 className="text-lg md:text-xl font-bold text-white">{cert.title}</h4>
                      <span className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded text-xs font-semibold my-2 text-[#ececec]">
                        {cert.period}
                      </span>
                      {cert.subtitle && (
                        <p className="text-sm md:text-base text-white/70 flex items-center gap-2 mb-2 font-medium animate-pulse">
                          <BsBuilding className="shrink-0" /> {cert.subtitle}
                        </p>
                      )}
                      {cert.description && (
                        <p className="text-sm md:text-base text-[#ececec]/80 leading-relaxed">
                          {cert.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
