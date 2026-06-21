"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { getSkills } from "@/actions/portfolio";
import { BsCheckCircle } from "react-icons/bs";
import ScrollReveal from "./ScrollReveal";

interface Skill {
  id?: number;
  name: string;
  category: string;
  percentage: number;
  tooltip: string;
}

interface SkillsProps {
}

export default function Skills() {
  const locale = useLocale();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const isEn = locale === "en";

  useEffect(() => {
    async function loadSkills() {
      try {
        const res = await getSkills();
        if (res.success && res.data) {
          const mappedData = res.data.map((item: any) => ({
            id: item.id,
            name: item.name,
            category: item.category,
            percentage: Number(item.percentage),
            tooltip: isEn ? (item.tooltip_en || item.tooltip_id || "") : (item.tooltip_id || item.tooltip_en || "")
          }));
          setSkills(mappedData);
        }
      } catch (err) {
        console.error("Error loading skills:", err);
      } finally {
        setLoading(false);
      }
    }
    loadSkills();
  }, []);

  // Normalisasi kategori lama jika sewaktu-waktu ada data legacy di DB
  const normalizedSkills = skills.map(skill => {
    let category = skill.category;
    if (category === "UI/UX Design Skills" || category === "Front-end Development") {
      category = "UI/UX & Frontend Development";
    }
    if (category === "Data Analyst Tools") {
      category = "Framework & Other";
    }
    return { ...skill, category };
  });

  // Urutan pengelompokan 4 kategori utama
  const categoriesOrder = [
    "Soft Skills",
    "Back-end Development",
    "UI/UX & Frontend Development",
    "Framework & Other"
  ];

  const groupedCategories = categoriesOrder.map(title => {
    const catSkills = normalizedSkills.filter(s => s.category === title);
    return { title, skills: catSkills };
  }).filter(cat => cat.skills.length > 0);

  // Helper to return modern aesthetic badges per category
  const getCategoryMeta = (title: string) => {
    switch (title) {
      case "Soft Skills":
        return { desc: "Interpersonal & leadership strengths", countColor: "text-white/40" };
      case "Back-end Development":
        return { desc: "Scalable APIs, databases, & architectures", countColor: "text-white/40" };
      case "UI/UX & Frontend Development":
        return { desc: "Pixel-perfect & responsive client interfaces", countColor: "text-white/40" };
      case "Framework & Other":
        return { desc: "Libraries, tooling, frameworks, and utility platforms", countColor: "text-white/40" };
      default:
        return { desc: "Professional technical capabilities", countColor: "text-white/40" };
    }
  };

  return (
    <section id="skills" className="py-24 bg-[#1f1f1f] text-white relative">
      
      {/* Background Tech Accent */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.01] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>

      <div className="container mx-auto px-6 md:px-12 max-w-7xl relative z-10">
        
        {/* Section Header */}
        <div className="section-title text-center mb-16">
          <ScrollReveal delay={0}>
            <h2 className="text-3xl md:text-5xl font-black font-ubuntu tracking-tight text-white uppercase mt-4">
              My Expertise
            </h2>
            <p className="text-[#ececec]/60 mt-3 text-base md:text-lg max-w-xl mx-auto font-['Nunito']">
              Proven capabilities and technical tools I use to turn ideas into fully operational digital products.
            </p>
          </ScrollReveal>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          /* Premium Bento-Style Skills Grid Skeleton to prevent Layout Shift */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-[#232323] to-[#202020] p-8 md:p-10 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-8 h-full animate-pulse"
              >
                {/* Category Header Skeleton */}
                <div className="space-y-1.5 border-b border-white/5 pb-5">
                  <div className="flex justify-between items-center">
                    <div className="h-6 w-36 bg-white/10 rounded-lg"></div>
                    <div className="h-4 w-12 bg-white/10 rounded-md"></div>
                  </div>
                  <div className="h-3 w-48 bg-white/5 rounded-md"></div>
                </div>
                
                {/* Skill Items Bento Box List Skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Array.from({ length: 4 }).map((_, sIdx) => (
                    <div
                      key={sIdx}
                      className="p-4 bg-white/[0.015] border border-white/[0.03] rounded-2xl space-y-3"
                    >
                      <div className="flex justify-between items-center">
                        <div className="h-4 w-20 bg-white/10 rounded-md"></div>
                        <div className="h-3 w-8 bg-white/10 rounded"></div>
                      </div>
                      <div className="w-full h-[5px] bg-white/5 rounded-full mt-2.5 overflow-hidden">
                        <div className="h-full w-2/3 bg-white/10 rounded-full"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : groupedCategories.length === 0 ? (
          <div className="text-center py-24 text-[#ececec]/60 bg-white/[0.01] rounded-3xl border border-white/5 max-w-lg mx-auto">
            <p className="font-['Nunito'] font-medium mb-4">No skills registered yet.</p>
            <p className="text-xs text-[#ececec]/40">Add skills using your admin dashboard.</p>
          </div>
        ) : (
          /* Premium Bento-Style Skills Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {groupedCategories.map((category, idx) => {
              const meta = getCategoryMeta(category.title);
              return (
                <ScrollReveal
                  key={category.title}
                  delay={idx * 150}
                  className="w-full"
                >
                  <div
                    className="bg-gradient-to-br from-[#232323] to-[#202020] p-8 md:p-10 rounded-[2.5rem] border border-white/5 hover:border-white/10 shadow-2xl space-y-8 transition-all duration-500 hover:shadow-white/[0.01] group h-full"
                  >
                    {/* Category Header */}
                    <div className="space-y-1.5 border-b border-white/5 pb-5">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold font-ubuntu text-white tracking-wide">
                          {category.title}
                        </h3>
                        <span className={`text-xs font-mono ${meta.countColor}`}>
                          {category.skills.length} {category.skills.length === 1 ? 'Skill' : 'Skills'}
                        </span>
                      </div>
                      <p className="text-xs text-[#ececec]/40 font-medium font-['Nunito'] tracking-wide">
                        {meta.desc}
                      </p>
                    </div>
                    
                    {/* Skill Items Bento Box List with subtle micro staggered animation triggers inside bento cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {category.skills.map((skill, skillIdx) => (
                        <div
                          key={skill.name}
                          className="relative group/skill p-4 bg-white/[0.015] hover:bg-white/[0.04] border border-white/[0.03] hover:border-white/10 rounded-2xl transition-all duration-300 hover:-translate-y-0.5"
                          style={{
                            animationDelay: `${skillIdx * 75}ms`
                          }}
                        >
                          {/* Label & Dynamic Percentage Badges */}
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2 truncate">
                              <BsCheckCircle className="text-white/40 group-hover/skill:text-white shrink-0 text-xs transition-colors" />
                              <span className="text-sm font-bold text-[#ececec]/90 group-hover/skill:text-white transition-colors truncate font-['Nunito']">
                                {skill.name}
                              </span>
                            </div>
                            <span className="text-[10px] font-bold text-white bg-white/5 px-2 py-[2px] rounded border border-white/5">
                              {skill.percentage}%
                            </span>
                          </div>

                          {/* Progress Bar Track */}
                          <div className="w-full h-[5px] bg-white/5 rounded-full mt-2.5 overflow-hidden border border-white/5">
                            <div
                              className="h-full bg-gradient-to-r from-white/30 to-[#ececec] rounded-full transition-all duration-1000"
                              style={{ width: `${skill.percentage}%` }}
                            ></div>
                          </div>

                          {/* High-Fidelity Animated Tooltip on Hover */}
                          {skill.tooltip && (
                            <div className="absolute opacity-0 translate-y-1 group-hover/skill:opacity-100 group-hover/skill:translate-y-0 transition-all duration-300 pointer-events-none bottom-full mb-3 left-1/2 -translate-x-1/2 bg-[#ececec] text-[#1f1f1f] text-xs py-2 px-4 rounded-xl shadow-2xl w-max max-w-[240px] text-center z-30 font-bold">
                              <span className="relative z-10 leading-relaxed block">{skill.tooltip}</span>
                              {/* Triangle Indicator */}
                              <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-[#ececec]"></div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
