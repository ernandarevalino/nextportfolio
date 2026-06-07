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

const defaultProfile: ResumeProfile = {
  id: 1,
  summary: "Turn hope into ideas, ideas into logic, logic into impact.",
  location: "Serpong, Tangerang Selatan",
  email: "ernandarevalino@gmail.com",
  phone: "+62 857-1020-9622",
  image_url: "https://i.pinimg.com/originals/62/c2/a2/62c2a216def9a504b2ff23adb67853b7.gif"
};

const defaultSkills: ResumeSkill[] = [
  { id: 1, name: "Web Development", percentage: 95 },
  { id: 2, name: "Data Analyst", percentage: 85 },
  { id: 3, name: "Project Management", percentage: 80 },
  { id: 4, name: "Mobile Development", percentage: 70 }
];

const defaultItems: ResumeItem[] = [
  // Education
  {
    id: 1,
    type: "education",
    title: "Madrasah Tsanawiyah",
    subtitle: "MTS Serpong Kota Tangerang Selatan",
    period: "2016 - 2019",
    description: "Graduated with good academic performance.",
    order_index: 1
  },
  {
    id: 2,
    type: "education",
    title: "Science Major",
    subtitle: "MAN 1 Kota Tangerang Selatan",
    period: "2019 - 2022",
    description: "Science stream with focus on mathematics and informatics.",
    order_index: 2
  },
  {
    id: 3,
    type: "education",
    title: "Information Systems",
    subtitle: "BSI University",
    period: "2023 - Now",
    description: "Dean's List recipient (all semesters), GPA 4.00 / 4.00. Active in HIMSI and various academic projects in data analysis and web development.",
    order_index: 3
  },
  // Experience
  {
    id: 4,
    type: "experience",
    title: "Information Systems Student Association (HIMSI)",
    subtitle: "Bina Sarana Informatika University",
    period: "2023 - Present",
    description: "Actively participated in HIMSI activities and various technology seminars\nDeveloped collaboration between members and divisions through internal projects and skill training programs\nHIMSI Teaching Program: Taught information technology-related materials to members/students/external participants to enhance communication and leadership skills",
    order_index: 4
  },
  {
    id: 5,
    type: "experience",
    title: "Business Intelligence Project - Power BI",
    subtitle: "4th Semester Final Project",
    period: "January - July 2025",
    description: "Conducted analysis of best-selling video games in Europe by genre and platform using Video Game Sales dataset from Kaggle\nCleaned, modeled, and visualized data using Microsoft Power BI\nPresented visual insights on popular genres and platforms, year-over-year sales trends, and genre-platform correlations\nConcluded the dominance of Sports and Action genres, with PlayStation as the most popular platform in the European market",
    order_index: 5
  },
  {
    id: 6,
    type: "experience",
    title: "SMP Anak Bangsa E-Learning Project - Laravel",
    subtitle: "3rd Semester Final Project",
    period: "August - December 2024",
    description: "Developed a Laravel and MySQL-based school administration website for SMP Anak Bangsa\nImplemented multi-role login features (admin, teacher, student) with authentication system and different access permissions\nProvided structured CRUD features for managing teacher, student, class, and subject data through admin dashboard\nCreated complex database relationships (ERD) using Laravel Eloquent ORM covering users, teachers, students, subjects, assignments, and attendance",
    order_index: 6
  },
  {
    id: 7,
    type: "experience",
    title: "Data Analysis Project - SPSS & Excel",
    subtitle: "3rd Semester Final Project",
    period: "August - December 2024",
    description: "Analyzed fashion preference data from 130 Tangerang respondents via Google Forms\nPerformed data validation, Spearman correlation tests, and age distribution analysis using SPSS\nCreated visualizations of respondents and fashion preferences using pie charts and bar graphs\nConcluded that lifestyle has more influence than age on fashion preferences",
    order_index: 7
  },
  {
    id: 8,
    type: "experience",
    title: "Laptop Data Analysis Project - Jupyter & Colab",
    subtitle: "2nd Semester Final Project",
    period: "January - July 2024",
    description: "Processed and analyzed laptop survey data using Python, Jupyter & Google Colab\nDisplayed price distribution, brands, and specifications with interactive visualizations\nPerformed data cleaning and correlation analysis between features using Pandas and Seaborn\nCompiled visual reports based on purchasing trends and consumer preferences",
    order_index: 8
  },
  {
    id: 9,
    type: "experience",
    title: "Car Showroom Project - Python CLI",
    subtitle: "1st Semester Final Project",
    period: "August - December 2023",
    description: "Developed a Command-Line Interface (CLI) application for managing a virtual car showroom using Python\nImplemented key features such as order processing, dynamic discount system, cash & credit payments, and stock management\nIntegrated user input validation and real-time receipt generation with simulated promotional offers\nEnabled users to search, filter, add, edit, and delete car stock data interactively\nUtilized Python libraries including Colorama, Datetime, and Random for interactive visuals and random promo generation",
    order_index: 9
  },
  // Certifications
  {
    id: 10,
    type: "certification",
    title: "Google Cloud Certification",
    subtitle: "Google Cloud",
    period: "2021",
    description: "",
    order_index: 10
  }
];

export default function Resume() {
  const [profile, setProfile] = useState<ResumeProfile>(defaultProfile);
  const [skills, setSkills] = useState<ResumeSkill[]>(defaultSkills);
  const [items, setItems] = useState<ResumeItem[]>(defaultItems);
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
              {profile.image_url && (
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
                  &ldquo;{profile.summary}&rdquo;
                </p>
              </div>

              {/* Contact Info */}
              <div className="space-y-4 border-t border-white/10 pt-4">
                <h3 className="text-xl font-bold font-ubuntu text-white">Contact Information</h3>
                <ul className="space-y-3 text-[#ececec]/80 text-sm md:text-base">
                  {profile.location && (
                    <li className="flex items-center gap-3">
                      <BsGeoAlt className="text-white shrink-0 text-lg" />
                      <span>{profile.location}</span>
                    </li>
                  )}
                  {profile.email && (
                    <li className="flex items-center gap-3">
                      <BsEnvelope className="text-white shrink-0 text-lg" />
                      <span className="truncate">{profile.email}</span>
                    </li>
                  )}
                  {profile.phone && (
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
