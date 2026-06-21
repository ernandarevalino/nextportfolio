"use client";

import { useLocale } from "next-intl";
import { BsCheckCircleFill, BsEnvelope, BsTelephone, BsGeoAlt, BsArrowUpRight } from "react-icons/bs";
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
  about_image_url?: string;
  about_name?: string;
  about_title_id?: string;
  about_title_en?: string;
  about_email?: string;
  about_phone?: string;
  about_location_id?: string;
  about_location_en?: string;
  about_maps_url?: string;
  about_heading_id?: string;
  about_heading_en?: string;
  about_bio_1_id?: string;
  about_bio_1_en?: string;
  about_bio_2_id?: string;
  about_bio_2_en?: string;
}

interface AboutProps {
  profile: Profile | null;
}

export default function About({ profile }: AboutProps) {
  const locale = useLocale();
  const isEn = locale === "en";
  const data = {
    about_image_url: profile?.about_image_url || "",
    about_name: profile?.about_name || "Ernanda Revalino",
    about_title: (isEn ? profile?.about_title_en : profile?.about_title_id) || "Full Stack Developer & Data Enthusiast",
    about_email: profile?.about_email || "ernandarevalino@gmail.com",
    about_phone: profile?.about_phone || "+62 857-1020-9622",
    about_location: (isEn ? profile?.about_location_en : profile?.about_location_id) || "Serpong, Tangerang Selatan",
    about_maps_url: profile?.about_maps_url || "https://maps.google.com",
    about_heading: (isEn ? profile?.about_heading_en : profile?.about_heading_id) || "Designing Systems, Analyzing Data, and Crafting Experiences",
    about_bio_1: (isEn ? profile?.about_bio_1_en : profile?.about_bio_1_id) || "I am a multi-disciplinary developer dedicated to building high-performance web applications and extracting analytical insights from complex data. I love translating challenging requirements into scalable architecture with beautiful, clean code.",
    about_bio_2: (isEn ? profile?.about_bio_2_en : profile?.about_bio_2_id) || "My journey combines full-stack development and data analytics tools, enabling me to build seamless software that delivers tangible impact. Let's create something extraordinary together.",
  };

  // Otomatis bersihkan spasi/strip dan ubah format 08xx / +62 ke link WhatsApp resmi yang valid
  const cleanPhone = data.about_phone.replace(/\D/g, ""); 
  const finalWaNumber = cleanPhone.startsWith("0") ? "62" + cleanPhone.slice(1) : cleanPhone;
  const whatsappLink = `https://wa.me/${finalWaNumber}`;

  return (
    <section id="about" className="py-24 bg-[#1f1f1f] text-white overflow-hidden relative">
      
      {/* Background Subtle Gradient Glow */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"></div>

      <div className="container mx-auto px-6 md:px-12 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Profile Card Column (Left Side) */}
          <div className="lg:col-span-5">
            <ScrollReveal delay={0}>
              <div className="group relative bg-gradient-to-br from-[#232323] via-[#252525] to-[#202020] rounded-[2.5rem] p-8 md:p-10 text-center border border-white/5 hover:border-white/10 shadow-2xl transition-all duration-500 hover:shadow-white/[0.02] hover:-translate-y-1">
                
                {/* Outer hover lighting effect */}
                <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-tr from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                <div className="relative mb-8 inline-block">
                  {/* Profile Image with Modern Double Layer Glow */}
                  <div className="w-[170px] h-[170px] mx-auto rounded-full overflow-hidden border-2 border-white/20 p-1 bg-black/20 relative z-10 transition-transform duration-500 group-hover:scale-102">
                    <img
                      src={data.about_image_url || "/assets/profile.jpg"}
                      alt={`${data.about_name} Profile`}
                      className="w-full h-full object-cover rounded-full"
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300";
                      }}
                    />
                  </div>
                  {/* Micro-interactive Pulse Circle Behind Profile */}
                  <div className="absolute inset-0 rounded-full bg-[#ececec]/5 animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Verified Badge */}
                  <div className="absolute bottom-[5px] right-[5px] w-8 h-8 bg-[#ececec] text-[#1f1f1f] rounded-full flex items-center justify-center border-4 border-[#232323] z-20 shadow-md">
                    <BsCheckCircleFill className="text-xs" />
                  </div>
                </div>

                {/* Bio Name & Title */}
                <div className="space-y-4 relative z-10">
                  <h3 className="text-2xl font-bold font-ubuntu text-white tracking-wide">{data.about_name}</h3>
                  <p className="text-[#ececec]/60 font-medium text-sm tracking-wider uppercase">{data.about_title}</p>

                  {/* Contact Rows formatted as sleek bento items */}
                  <div className="flex flex-col gap-3 pt-6">
                    {data.about_email && (
                      <a
                        href={`mailto:${data.about_email}`}
                        className="group/item flex items-center justify-between gap-3 px-5 py-4 bg-white/[0.02] hover:bg-white/[0.05] rounded-2xl text-[#ececec] border border-white/5 hover:border-white/10 transition-all duration-300"
                      >
                        <div className="flex items-center gap-3 truncate">
                          <BsEnvelope className="text-[#ececec]/60 group-hover/item:text-white text-base shrink-0 transition-colors" />
                          <span className="text-sm truncate font-medium text-[#ececec]/80 group-hover/item:text-white transition-colors">{data.about_email}</span>
                        </div>
                        <BsArrowUpRight className="text-xs text-[#ececec]/30 group-hover/item:text-white group-hover/item:translate-x-0.5 group-hover/item:-translate-y-0.5 transition-all" />
                      </a>
                    )}
                    {data.about_phone && (
                      <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/item flex items-center justify-between gap-3 px-5 py-4 bg-white/[0.02] hover:bg-white/[0.05] rounded-2xl text-[#ececec] border border-white/5 hover:border-white/10 transition-all duration-300"
                      >
                        <div className="flex items-center gap-3">
                          <BsTelephone className="text-[#ececec]/60 group-hover/item:text-white text-base shrink-0 transition-colors" />
                          <span className="text-sm font-medium text-[#ececec]/80 group-hover/item:text-white transition-colors">{data.about_phone}</span>
                        </div>
                        <BsArrowUpRight className="text-xs text-[#ececec]/30 group-hover/item:text-white group-hover/item:translate-x-0.5 group-hover/item:-translate-y-0.5 transition-all" />
                      </a>
                    )}
                    {data.about_location && (
                      <a
                        href={data.about_maps_url || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/item flex items-center justify-between gap-3 px-5 py-4 bg-white/[0.02] hover:bg-white/[0.05] rounded-2xl text-[#ececec] border border-white/5 hover:border-white/10 transition-all duration-300"
                      >
                        <div className="flex items-center gap-3 truncate">
                          <BsGeoAlt className="text-[#ececec]/60 group-hover/item:text-white text-base shrink-0 transition-colors" />
                          <span className="text-sm text-left truncate font-medium text-[#ececec]/80 group-hover/item:text-white transition-colors">{data.about_location}</span>
                        </div>
                        <BsArrowUpRight className="text-xs text-[#ececec]/30 group-hover/item:text-white group-hover/item:translate-x-0.5 group-hover/item:-translate-y-0.5 transition-all" />
                      </a>
                    )}
                  </div>
                </div>

              </div>
            </ScrollReveal>
          </div>

          {/* About Content Column (Right Side) */}
          <div className="lg:col-span-7">
            <div className="space-y-8 lg:pl-6 text-center lg:text-left">
              
              <ScrollReveal delay={150}>
                <div className="space-y-4">
                  <span className="inline-block bg-white/5 border border-white/10 text-white px-5 py-2 rounded-full text-xs font-bold tracking-widest uppercase">
                    Get to Know Me
                  </span>
                  <h2 className="text-3xl md:text-5xl font-black font-ubuntu leading-tight text-white tracking-tight">
                    {data.about_heading}
                  </h2>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={250}>
                <div className="text-[#ececec]/85 text-base md:text-lg leading-relaxed space-y-6 font-['Nunito']">
                  {data.about_bio_1 && <p>{data.about_bio_1}</p>}
                  {data.about_bio_2 && <p>{data.about_bio_2}</p>}
                </div>
              </ScrollReveal>

              {/* Bento Box Stats Inside About Section with Staggered Delays */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6">
                <ScrollReveal delay={300}>
                  <div className="bg-white/[0.02] p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 group text-center lg:text-left h-full">
                    <span className="block text-3xl font-black text-white font-ubuntu mb-1">3+</span>
                    <span className="text-[8px] text-[#ececec]/40 uppercase tracking-wider font-semibold">Years Semi Experience</span>
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={450}>
                  <div className="bg-white/[0.02] p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 group text-center lg:text-left h-full">
                    <span className="block text-3xl font-black text-white font-ubuntu mb-1">20+</span>
                    <span className="text-[8px] text-[#ececec]/40 uppercase tracking-wider font-semibold">Completed Projects (Personal/Side/Real)</span>
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={600} className="col-span-2 sm:col-span-1">
                  <div className="bg-white/[0.02] p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 group text-center lg:text-left h-full">
                    <span className="block text-3xl font-black text-white font-ubuntu mb-1">10+</span>
                    <span className="text-[8px] text-[#ececec]/40 uppercase tracking-wider font-semibold">Technologies Mastered</span>
                  </div>
                </ScrollReveal>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}