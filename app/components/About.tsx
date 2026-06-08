"use client";

import { BsCheckCircleFill, BsEnvelope, BsTelephone, BsGeoAlt } from "react-icons/bs";

interface Profile {
  id: number;
  hero_title: string;
  hero_name: string;
  hero_description: string;
  typewriter_words: string[];
  github_url: string;
  linkedin_url: string;
  instagram_url: string;
  about_image_url?: string;
  about_name?: string;
  about_title?: string;
  about_email?: string;
  about_phone?: string;
  about_location?: string;
  about_maps_url?: string;
  about_heading?: string;
  about_bio_1?: string;
  about_bio_2?: string;
}

interface AboutProps {
  profile: Profile | null;
}

export default function About({ profile }: AboutProps) {
  const data = {
    about_image_url: profile?.about_image_url || "",
    about_name: profile?.about_name || "",
    about_title: profile?.about_title || "",
    about_email: profile?.about_email || "",
    about_phone: profile?.about_phone || "",
    about_location: profile?.about_location || "",
    about_maps_url: profile?.about_maps_url || "",
    about_heading: profile?.about_heading || "",
    about_bio_1: profile?.about_bio_1 || "",
    about_bio_2: profile?.about_bio_2 || "",
  };

  return (
    <section id="about" className="py-20 bg-[#1f1f1f] text-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Profile Card Column */}
          <div className="lg:col-span-5">
            <div className="relative bg-gradient-to-br from-[#232323] to-[#282828] rounded-[2rem] p-10 text-center border border-white/10 shadow-2xl">
              
              <div className="relative mb-8">
                {/* Profile Image with Ring */}
                <div className="w-[160px] h-[160px] mx-auto rounded-full overflow-hidden border-4 border-[#ececec] shadow-xl bg-black/20">
                  <img
                    src={data.about_image_url}
                    alt={`${data.about_name} Profile`}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Verified Badge */}
                <div className="absolute bottom-[10px] right-[calc(50%-65px)] w-8 h-8 bg-[#ececec] text-[#310606] rounded-full flex items-center justify-center border-[3px] border-[#232323]">
                  <BsCheckCircleFill className="text-sm" />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-bold font-ubuntu text-white">{data.about_name}</h3>
                <p className="text-[#ececec] font-medium text-sm">{data.about_title}</p>

                <div className="flex flex-col gap-4 pt-4">
                  {data.about_email && (
                    <a
                      href={`mailto:${data.about_email}`}
                      className="flex items-center gap-3 px-4 py-3 bg-[#1f1f1f] rounded-xl text-[#ececec] border border-white/10 hover:bg-[#ececec] hover:text-[#310606] hover:-translate-y-1 hover:shadow-lg hover:shadow-[#ececec]/20 transition-all duration-300"
                    >
                      <BsEnvelope className="text-base shrink-0" />
                      <span className="text-sm truncate">{data.about_email}</span>
                    </a>
                  )}
                  {data.about_phone && (
                    <a
                      href={`tel:${data.about_phone.replace(/\s+/g, "")}`}
                      className="flex items-center gap-3 px-4 py-3 bg-[#1f1f1f] rounded-xl text-[#ececec] border border-white/10 hover:bg-[#ececec] hover:text-[#310606] hover:-translate-y-1 hover:shadow-lg hover:shadow-[#ececec]/20 transition-all duration-300"
                    >
                      <BsTelephone className="text-base shrink-0" />
                      <span className="text-sm">{data.about_phone}</span>
                    </a>
                  )}
                  {data.about_location && (
                    <a
                      href={data.about_maps_url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-3 bg-[#1f1f1f] rounded-xl text-[#ececec] border border-white/10 hover:bg-[#ececec] hover:text-[#310606] hover:-translate-y-1 hover:shadow-lg hover:shadow-[#ececec]/20 transition-all duration-300"
                    >
                      <BsGeoAlt className="text-base shrink-0" />
                      <span className="text-sm text-left truncate">{data.about_location}</span>
                    </a>
                  )}
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
                  {data.about_heading}
                </h2>
              </div>

              <div className="text-[#ececec]/80 text-base md:text-lg leading-relaxed space-y-4">
                {data.about_bio_1 && <p>{data.about_bio_1}</p>}
                {data.about_bio_2 && <p>{data.about_bio_2}</p>}
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
