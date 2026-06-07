"use client";

import { useState, useEffect } from "react";
import { getSkills } from "@/actions/portfolio";

interface Skill {
  id?: number;
  name: string;
  category: string;
  percentage: number;
  tooltip: string;
}

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

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
            tooltip: item.tooltip || ""
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
    return { ...skill, category };
  });

  // Urutan pengelompokan 4 kategori utama
  const categoriesOrder = [
    "Soft Skills",
    "Back-end Development",
    "UI/UX & Frontend Development",
    "Data Analyst Tools"
  ];

  const groupedCategories = categoriesOrder.map(title => {
    const catSkills = normalizedSkills.filter(s => s.category === title);
    return { title, skills: catSkills };
  }).filter(cat => cat.skills.length > 0);

  return (
    <section id="skills" className="py-20 bg-[#1f1f1f] text-white">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Section Header */}
        <div className="section-title text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold font-ubuntu tracking-wide text-white uppercase inline-block">
            Skills
          </h2>
          <p className="text-[#ececec]/70 mt-4 text-base md:text-lg">
            Skills I've Gained Through Real Projects.
          </p>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-12 h-12 border-4 border-[#ececec] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[#ececec]/60">Fetching skills...</p>
          </div>
        ) : groupedCategories.length === 0 ? (
          <div className="text-center py-20 text-[#ececec]/60">
            No skills to display. Silakan tambahkan melalui Admin Dashboard.
          </div>
        ) : (
          /* Skills Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {groupedCategories.map((category) => (
              <div
                key={category.title}
                className={`bg-[#232323] p-8 rounded-[2rem] border border-white/10 shadow-xl space-y-6 ${
                  category.title === "Data Analyst Tools" ? "md:col-span-2 max-w-4xl mx-auto w-full" : ""
                }`}
              >
                <h3 className="text-xl font-bold font-ubuntu text-white border-b border-white/10 pb-3">
                  {category.title}
                </h3>
                
                <div className="space-y-5">
                  {category.skills.map((skill) => (
                    <div key={skill.name} className="relative group">
                      
                      {/* Label & Percentage */}
                      <div className="flex justify-between items-center">
                        <span className="text-sm md:text-base font-semibold text-[#ececec]">
                          {skill.name}
                        </span>
                        <span className="text-sm font-bold text-white/90 bg-white/5 px-2 py-[2px] rounded">
                          {skill.percentage}%
                        </span>
                      </div>

                      {/* Progress Bar Container */}
                      <div className="w-full h-[6px] bg-white/10 rounded-full mt-2 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-white/40 to-[#ececec] rounded-full transition-all duration-500"
                          style={{ width: `${skill.percentage}%` }}
                        ></div>
                      </div>

                      {/* Tooltip on Hover */}
                      {skill.tooltip && (
                        <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bottom-full mb-2 left-1/2 -translate-x-1/2 bg-[#ececec] text-[#310606] text-xs py-2 px-3 rounded-lg shadow-xl w-max max-w-[260px] text-center z-30 font-medium">
                          {skill.tooltip}
                          {/* Triangle Pointer */}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-[#ececec]"></div>
                        </div>
                      )}

                    </div>
                  ))}
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}