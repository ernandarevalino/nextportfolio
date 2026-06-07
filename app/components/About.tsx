"use client";

import { BsCheckCircleFill, BsEnvelope, BsTelephone, BsGeoAlt } from "react-icons/bs";

export default function About() {
  return (
    <section id="about" className="py-20 bg-[#1f1f1f] text-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Profile Card Column */}
          <div className="lg:col-span-5">
            <div className="relative bg-gradient-to-br from-[#232323] to-[#282828] rounded-[2rem] p-10 text-center border border-white/10 shadow-2xl">
              
              <div className="relative mb-8">
                {/* Profile Image with Ring */}
                <div className="w-[160px] h-[160px] mx-auto rounded-full overflow-hidden border-4 border-[#ececec] shadow-xl">
                  <img
                    src="/assets/img/profile/profile-3.jpg"
                    alt="Ernanda Revalino Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Verified Badge */}
                <div className="absolute bottom-[10px] right-[calc(50%-65px)] w-8 h-8 bg-[#ececec] text-[#310606] rounded-full flex items-center justify-center border-[3px] border-[#232323]">
                  <BsCheckCircleFill className="text-sm" />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-bold font-ubuntu text-white">Ernanda Revalino</h3>
                <p className="text-[#ececec] font-medium text-sm">Web Development & Data Analyst Aspiring</p>

                <div className="flex flex-col gap-4 pt-4">
                  <a
                    href="mailto:ernandarevalino@gmail.com"
                    className="flex items-center gap-3 px-4 py-3 bg-[#1f1f1f] rounded-xl text-[#ececec] border border-white/10 hover:bg-[#ececec] hover:text-[#310606] hover:-translate-y-1 hover:shadow-lg hover:shadow-[#ececec]/20 transition-all duration-300"
                  >
                    <BsEnvelope className="text-base shrink-0" />
                    <span className="text-sm truncate">ernandarevalino@gmail.com</span>
                  </a>
                  <a
                    href="tel:+6285710209622"
                    className="flex items-center gap-3 px-4 py-3 bg-[#1f1f1f] rounded-xl text-[#ececec] border border-white/10 hover:bg-[#ececec] hover:text-[#310606] hover:-translate-y-1 hover:shadow-lg hover:shadow-[#ececec]/20 transition-all duration-300"
                  >
                    <BsTelephone className="text-base shrink-0" />
                    <span className="text-sm">+62 857-1020-9622</span>
                  </a>
                  <a
                    href="https://maps.app.goo.gl/uHZRvx4thS6Nh1PC7"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 bg-[#1f1f1f] rounded-xl text-[#ececec] border border-white/10 hover:bg-[#ececec] hover:text-[#310606] hover:-translate-y-1 hover:shadow-lg hover:shadow-[#ececec]/20 transition-all duration-300"
                  >
                    <BsGeoAlt className="text-base shrink-0" />
                    <span className="text-sm text-left">Serpong, Tangerang Selatan</span>
                  </a>
                </div>
              </div>

            </div>
          </div>

          {/* About Content Column */}
          <div className="lg:col-span-7">
            <div className="space-y-6 lg:pl-8">
              
              <div className="space-y-4">
                <span className="inline-block bg-gradient-to-r from-[#ececec] to-[#ffffff]/80 text-[#310606] px-6 py-2 rounded-full text-sm font-semibold tracking-wide">
                  Get to Know Me
                </span>
                <h2 className="text-3xl md:text-4xl font-bold font-ubuntu leading-tight text-white">
                  Writing code with purpose, turning data into direction
                </h2>
              </div>

              <div className="text-[#ececec]/80 text-base md:text-lg leading-relaxed space-y-4">
                <p>
                  Im an enthusiastic Information Systems student with a strong passion for web development and data analysis. With hands-on experience building from Python CLI systems to Laravel web apps, I always aim to align technology with real business needs.
                </p>
                <p>
                  I believe in teamwork is everything, continuous learning, and creating solutions that are not only impressive but also impactful. Currently, Im focusing on deepening my skills in Laravel backend and data analysis tools like Power BI and Looker Studio while continuing to strengthen my Python foundation.
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
