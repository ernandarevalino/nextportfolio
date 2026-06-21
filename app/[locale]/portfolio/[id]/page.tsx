import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";
import { BsArrowLeft, BsGithub } from "react-icons/bs";
import ScrollReveal from "../../../components/ScrollReveal";

interface PageProps {
  params: Promise<{ id: string; locale: string }>;
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { id, locale } = await params;

  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !project) {
    notFound();
  }

  const galleryUrls: string[] = project.gallery_urls || [];
  const isEn = locale === "en";

  return (
    <div className="min-h-screen bg-[#1f1f1f] text-white py-12 md:py-20 font-sans">
      <div className="container mx-auto px-6 md:px-12 max-w-7xl space-y-12">
        
        {/* Back Button */}
        <ScrollReveal delay={0}>
          <div>
            <Link
              href={`/${locale}?from=detail#portfolio`}
              scroll={false}
              className="group inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-full hover:bg-white/15 hover:border-white/25 transition-all text-sm font-semibold cursor-pointer"
            >
              <BsArrowLeft className="transition-transform duration-300 group-hover:-translate-x-1" /> Back to Home
            </Link>
          </div>
        </ScrollReveal>

        {/* Banner Image */}
        <ScrollReveal delay={150}>
          <div className="group aspect-[16/9] w-full rounded-[2rem] overflow-hidden border border-white/10 hover:border-amber-400/30 shadow-2xl bg-black/40 transition-colors duration-500">
            <img
              src={project.image_url}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-103"
            />
          </div>
        </ScrollReveal>

        {/* Restructured 2-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Kolom Kiri Meta Box (lg:col-span-4, sticky) */}
          <aside className="lg:col-span-4 lg:sticky lg:top-8 space-y-6">
            <ScrollReveal delay={250}>
              <div className="bg-[#232323] p-8 rounded-[2rem] border border-white/10 hover:border-white/20 shadow-xl space-y-6 transition-all duration-300">
                <div className="space-y-4">
                  <span className="inline-block px-3 py-1 bg-amber-400/10 border border-amber-400/20 text-amber-400 rounded-full text-xs font-bold uppercase tracking-wider">
                    {project.category}
                  </span>
                  
                  <h1 className="text-2xl md:text-3xl font-extrabold font-ubuntu tracking-tight text-white leading-tight">
                    {isEn ? (project.title_en || project.title_id) : (project.title_id || project.title_en)}
                  </h1>

                  {/* Info Pelengkap */}
                  <div className="pt-2 border-t border-white/5 space-y-3">
                    <div className="flex flex-col">
                      <span className="text-xs text-[#ececec]/40 uppercase tracking-widest font-semibold">Status</span>
                      <span className="text-sm text-emerald-400 font-bold">Completed</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-[#ececec]/40 uppercase tracking-widest font-semibold">Role</span>
                      <span className="text-sm text-white/80 font-medium">Lead Developer</span>
                    </div>
                  </div>
                </div>

                {project.github_url && project.github_url !== "#" && (
                  <div className="pt-2">
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/github inline-flex items-center justify-center gap-2 w-full px-5 py-3 bg-white text-black hover:bg-[#ececec] rounded-full hover:scale-[1.02] transition-all text-sm font-bold shadow-lg cursor-pointer"
                    >
                      <BsGithub className="text-base transition-transform duration-300 group-hover/github:rotate-12" /> View GitHub Repository
                    </a>
                  </div>
                )}
              </div>
            </ScrollReveal>
          </aside>

          {/* Kolom Kanan Article Box (lg:col-span-8) */}
          <main className="lg:col-span-8 space-y-12">
            
            {/* Project Article Details */}
            <ScrollReveal delay={350}>
              <article className="bg-[#232323] p-8 md:p-12 rounded-[2rem] border border-white/10 hover:border-white/15 shadow-xl space-y-6 transition-all duration-300">
                <h2 className="text-2xl font-bold font-ubuntu border-b border-white/10 pb-4">
                  About the Project
                </h2>
                <div>
                  {(() => {
                    const text = isEn ? (project.details_en || project.details_id) : (project.details_id || project.details_en);
                    if (!text) {
                      return (
                        <p className="italic text-white/40 text-base md:text-lg whitespace-pre-wrap font-sans">
                          No case study article has been written for this project yet.
                        </p>
                      );
                    }

                    const parts = text.split(/(!\[.*?\]\(.*?\))/g);
                    return parts.map((part: string, index: number) => {
                      const match = part.match(/^!\[(.*?)\]\((.*?)\)$/);
                      if (match) {
                        const caption = match[1];
                        const url = match[2];
                        return (
                          <div key={index} className="my-8 space-y-3 text-center group">
                            <img
                              src={url}
                              alt={caption}
                              className="mx-auto rounded-2xl border border-white/10 max-h-[500px] object-contain shadow-2xl transition-transform duration-500 group-hover:scale-[1.01]"
                            />
                            {caption && (
                              <p className="text-xs md:text-sm text-center text-[#ececec]/50 italic tracking-wide max-w-xl mx-auto px-4">
                                {caption}
                              </p>
                            )}
                          </div>
                        );
                      } else {
                        const cleanText = part.replace(/^\n+|\n+$/g, '');
                        if (!cleanText.trim()) return null;
                        return (
                          <p
                            key={index}
                            className="mb-6 text-base md:text-lg text-[#ececec]/90 leading-relaxed whitespace-pre-wrap font-sans"
                          >
                            {cleanText}
                          </p>
                        );
                      }
                    });
                  })()}
                </div>
              </article>
            </ScrollReveal>

            {/* Project Gallery Section */}
            {galleryUrls.length > 0 && (
              <div className="space-y-6">
                <ScrollReveal delay={450}>
                  <h2 className="text-2xl font-bold font-ubuntu text-white border-b border-white/10 pb-4">
                    Project Screenshots
                  </h2>
                </ScrollReveal>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {galleryUrls.map((url, idx) => (
                    <ScrollReveal key={idx} delay={450 + idx * 100}>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black/40 shadow-md hover:border-amber-400/50 hover:border-white/20 transition-all duration-300"
                      >
                        <img
                          src={url}
                          alt={`${project.title_en || project.title_id} screenshot ${idx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-1000"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <span className="px-3 py-1.5 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full text-xs font-bold text-white transition-all transform translate-y-2 group-hover:translate-y-0 duration-300">
                            View Full Image
                          </span>
                        </div>
                      </a>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            )}
          </main>

        </div>

      </div>
    </div>
  );
}
