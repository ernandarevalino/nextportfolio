"use client";

import {
  BsGeoAlt,
  BsEnvelope,
  BsTelephone,
  BsMortarboard,
  BsBuilding,
  BsBriefcase,
  BsAward
} from "react-icons/bs";

export default function Resume() {
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
              <div className="overflow-hidden rounded-2xl border border-white/10 shadow-lg">
                <img
                  src="https://i.pinimg.com/originals/62/c2/a2/62c2a216def9a504b2ff23adb67853b7.gif"
                  alt="Ernanda profile animated"
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* Summary */}
              <div className="space-y-3">
                <h3 className="text-xl font-bold font-ubuntu text-white">Summary</h3>
                <p className="text-sm md:text-base text-[#ececec]/85 italic leading-relaxed">
                  &ldquo;Turn hope into ideas, ideas into logic, logic into impact.&rdquo;
                </p>
              </div>

              {/* Contact Info */}
              <div className="space-y-4 border-t border-white/10 pt-4">
                <h3 className="text-xl font-bold font-ubuntu text-white">Contact Information</h3>
                <ul className="space-y-3 text-[#ececec]/80 text-sm md:text-base">
                  <li className="flex items-center gap-3">
                    <BsGeoAlt className="text-white shrink-0 text-lg" />
                    <span>Serpong, Tangerang Selatan</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <BsEnvelope className="text-white shrink-0 text-lg" />
                    <span className="truncate">ernandarevalino@gmail.com</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <BsTelephone className="text-white shrink-0 text-lg" />
                    <span>+62 857-1020-9622</span>
                  </li>
                </ul>
              </div>

              {/* Technical Mini Skills */}
              <div className="space-y-4 border-t border-white/10 pt-4">
                <h3 className="text-xl font-bold font-ubuntu text-white">Technical Skills</h3>
                <div className="space-y-4">
                  {[
                    { name: "Web Development", percent: "95%" },
                    { name: "Data Analyst", percent: "85%" },
                    { name: "Project Management", percent: "80%" },
                    { name: "Mobile Development", percent: "70%" },
                  ].map((s) => (
                    <div key={s.name} className="space-y-1">
                      <div className="flex justify-between text-xs md:text-sm font-semibold text-[#ececec]">
                        <span>{s.name}</span>
                        <span>{s.percent}</span>
                      </div>
                      <div className="w-full h-[6px] bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-white/40 to-[#ececec] rounded-full"
                          style={{ width: s.percent }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Right Column (Education & Experience Timeline) */}
          <div className="lg:col-span-8 lg:pl-6 space-y-12">
            
            {/* Education Section */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold font-ubuntu text-white flex items-center gap-3 border-b border-white/10 pb-3">
                <BsMortarboard className="text-2xl" /> Education
              </h3>

              <div className="relative border-l-2 border-white/10 pl-6 space-y-8 ml-3">
                
                {/* Edu 1 */}
                <div className="resume-item">
                  <h4 className="text-lg md:text-xl font-bold text-white">Madrasah Tsanawiyah</h4>
                  <span className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded text-xs font-semibold my-2 text-[#ececec]">
                    2016 - 2019
                  </span>
                  <p className="text-sm md:text-base text-white/70 flex items-center gap-2 mb-2 font-medium">
                    <BsBuilding className="shrink-0" /> MTS Serpong Kota Tangerang Selatan
                  </p>
                  <p className="text-sm md:text-base text-[#ececec]/80 leading-relaxed">
                    Graduated with good academic performance.
                  </p>
                </div>

                {/* Edu 2 */}
                <div className="resume-item">
                  <h4 className="text-lg md:text-xl font-bold text-white">Science Major</h4>
                  <span className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded text-xs font-semibold my-2 text-[#ececec]">
                    2019 - 2022
                  </span>
                  <p className="text-sm md:text-base text-white/70 flex items-center gap-2 mb-2 font-medium">
                    <BsBuilding className="shrink-0" /> MAN 1 Kota Tangerang Selatan
                  </p>
                  <p className="text-sm md:text-base text-[#ececec]/80 leading-relaxed">
                    Science stream with focus on mathematics and informatics.
                  </p>
                </div>

                {/* Edu 3 */}
                <div className="resume-item">
                  <h4 className="text-lg md:text-xl font-bold text-white">Information Systems</h4>
                  <span className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded text-xs font-semibold my-2 text-[#ececec]">
                    2023 - Now
                  </span>
                  <p className="text-sm md:text-base text-white/70 flex items-center gap-2 mb-2 font-medium">
                    <BsBuilding className="shrink-0" /> BSI University
                  </p>
                  <p className="text-sm md:text-base text-[#ececec]/80 leading-relaxed">
                    Dean's List recipient (all semesters), GPA 4.00 / 4.00. Active in HIMSI and various academic projects in data analysis and web development.
                  </p>
                </div>

              </div>
            </div>

            {/* Experience Section */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold font-ubuntu text-white flex items-center gap-3 border-b border-white/10 pb-3">
                <BsBriefcase className="text-2xl" /> Experience
              </h3>

              <div className="relative border-l-2 border-white/10 pl-6 space-y-8 ml-3">
                
                {/* Exp 1 */}
                <div className="resume-item">
                  <h4 className="text-lg md:text-xl font-bold text-white">Information Systems Student Association (HIMSI)</h4>
                  <span className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded text-xs font-semibold my-2 text-[#ececec]">
                    2023 - Present
                  </span>
                  <p className="text-sm md:text-base text-white/70 flex items-center gap-2 mb-3 font-medium">
                    <BsBuilding className="shrink-0" /> Bina Sarana Informatika University
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-sm md:text-base text-[#ececec]/80 leading-relaxed">
                    <li>Actively participated in HIMSI activities and various technology seminars</li>
                    <li>Developed collaboration between members and divisions through internal projects and skill training programs</li>
                    <li>HIMSI Teaching Program: Taught information technology-related materials to members/students/external participants to enhance communication and leadership skills</li>
                  </ul>
                </div>

                {/* Exp 2 */}
                <div className="resume-item">
                  <h4 className="text-lg md:text-xl font-bold text-white">Business Intelligence Project - Power BI</h4>
                  <span className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded text-xs font-semibold my-2 text-[#ececec]">
                    January - July 2025
                  </span>
                  <p className="text-sm md:text-base text-white/70 flex items-center gap-2 mb-3 font-medium">
                    <BsBuilding className="shrink-0" /> 4th Semester Final Project
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-sm md:text-base text-[#ececec]/80 leading-relaxed">
                    <li>Conducted analysis of best-selling video games in Europe by genre and platform using <i>Video Game Sales</i> dataset from Kaggle</li>
                    <li>Cleaned, modeled, and visualized data using Microsoft Power BI</li>
                    <li>Presented visual insights on popular genres and platforms, year-over-year sales trends, and genre-platform correlations</li>
                    <li>Concluded the dominance of <i>Sports</i> and <i>Action</i> genres, with PlayStation as the most popular platform in the European market</li>
                  </ul>
                </div>

                {/* Exp 3 */}
                <div className="resume-item">
                  <h4 className="text-lg md:text-xl font-bold text-white">SMP Anak Bangsa E-Learning Project - Laravel</h4>
                  <span className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded text-xs font-semibold my-2 text-[#ececec]">
                    August - December 2024
                  </span>
                  <p className="text-sm md:text-base text-white/70 flex items-center gap-2 mb-3 font-medium">
                    <BsBuilding className="shrink-0" /> 3rd Semester Final Project
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-sm md:text-base text-[#ececec]/80 leading-relaxed">
                    <li>Developed a Laravel and MySQL-based school administration website for SMP Anak Bangsa</li>
                    <li>Implemented multi-role login features (admin, teacher, student) with authentication system and different access permissions</li>
                    <li>Provided structured CRUD features for managing teacher, student, class, and subject data through admin dashboard</li>
                    <li>Created complex database relationships (ERD) using Laravel Eloquent ORM covering users, teachers, students, subjects, assignments, and attendance</li>
                  </ul>
                </div>

                {/* Exp 4 */}
                <div className="resume-item">
                  <h4 className="text-lg md:text-xl font-bold text-white">Data Analysis Project - SPSS & Excel</h4>
                  <span className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded text-xs font-semibold my-2 text-[#ececec]">
                    August - December 2024
                  </span>
                  <p className="text-sm md:text-base text-white/70 flex items-center gap-2 mb-3 font-medium">
                    <BsBuilding className="shrink-0" /> 3rd Semester Final Project
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-sm md:text-base text-[#ececec]/80 leading-relaxed">
                    <li>Analyzed fashion preference data from 130 Tangerang respondents via Google Forms</li>
                    <li>Performed data validation, Spearman correlation tests, and age distribution analysis using SPSS</li>
                    <li>Created visualizations of respondents and fashion preferences using pie charts and bar graphs</li>
                    <li>Concluded that lifestyle has more influence than age on fashion preferences</li>
                  </ul>
                </div>

                {/* Exp 5 */}
                <div className="resume-item">
                  <h4 className="text-lg md:text-xl font-bold text-white">Laptop Data Analysis Project - Jupyter & Colab</h4>
                  <span className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded text-xs font-semibold my-2 text-[#ececec]">
                    January - July 2024
                  </span>
                  <p className="text-sm md:text-base text-white/70 flex items-center gap-2 mb-3 font-medium">
                    <BsBuilding className="shrink-0" /> 2nd Semester Final Project
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-sm md:text-base text-[#ececec]/80 leading-relaxed">
                    <li>Processed and analyzed laptop survey data using Python, Jupyter & Google Colab</li>
                    <li>Displayed price distribution, brands, and specifications with interactive visualizations</li>
                    <li>Performed data cleaning and correlation analysis between features using Pandas and Seaborn</li>
                    <li>Compiled visual reports based on purchasing trends and consumer preferences</li>
                  </ul>
                </div>

                {/* Exp 6 */}
                <div className="resume-item">
                  <h4 className="text-lg md:text-xl font-bold text-white">Car Showroom Project - Python CLI</h4>
                  <span className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded text-xs font-semibold my-2 text-[#ececec]">
                    August - December 2023
                  </span>
                  <p className="text-sm md:text-base text-white/70 flex items-center gap-2 mb-3 font-medium">
                    <BsBuilding className="shrink-0" /> 1st Semester Final Project
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-sm md:text-base text-[#ececec]/80 leading-relaxed">
                    <li>Developed a Command-Line Interface (CLI) application for managing a virtual car showroom using Python</li>
                    <li>Implemented key features such as order processing, dynamic discount system, cash & credit payments, and stock management</li>
                    <li>Integrated user input validation and real-time receipt generation with simulated promotional offers</li>
                    <li>Enabled users to search, filter, add, edit, and delete car stock data interactively</li>
                    <li>Utilized Python libraries including Colorama, Datetime, and Random for interactive visuals and random promo generation</li>
                  </ul>
                </div>

              </div>
            </div>

            {/* Certifications Section */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold font-ubuntu text-white flex items-center gap-3 border-b border-white/10 pb-3">
                <BsAward className="text-2xl" /> Certifications
              </h3>

              <div className="relative border-l-2 border-white/10 pl-6 space-y-8 ml-3">
                
                <div className="resume-item">
                  <h4 className="text-lg md:text-xl font-bold text-white">Google Cloud Certification</h4>
                  <span className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded text-xs font-semibold my-2 text-[#ececec]">
                    2021
                  </span>
                </div>

              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
