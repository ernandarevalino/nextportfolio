import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";
import { BsArrowLeft, BsGithub } from "react-icons/bs";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { id } = await params;

  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !project) {
    notFound();
  }

  const galleryUrls: string[] = project.gallery_urls || [];

  return (
    <div className="min-h-screen bg-[#1f1f1f] text-white py-12 md:py-20 font-sans">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl space-y-12">
        
        {/* Back Button */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-full hover:bg-white/15 hover:border-white/25 transition-all text-sm font-semibold cursor-pointer"
          >
            <BsArrowLeft /> Back to Home
          </Link>
        </div>

        {/* Project Header Info */}
        <div className="space-y-4">
          <span className="px-3 py-1 bg-amber-400/10 border border-amber-400/20 text-amber-400 rounded-full text-xs font-bold uppercase tracking-wider">
            {project.category}
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold font-ubuntu tracking-tight text-white leading-tight">
            {project.title}
          </h1>
          
          {project.github_url && project.github_url !== "#" && (
            <div className="pt-2">
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black hover:bg-[#ececec] rounded-full transition-all text-sm font-bold shadow-lg cursor-pointer"
              >
                <BsGithub className="text-base" /> View Code Repository
              </a>
            </div>
          )}
        </div>

        {/* Banner Image */}
        <div className="aspect-[16/9] w-full rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl bg-black/40">
          <img
            src={project.image_url}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Project Article details */}
        <div className="bg-[#232323] p-8 md:p-12 rounded-[2rem] border border-white/10 shadow-xl space-y-6">
          <h2 className="text-2xl font-bold font-ubuntu border-b border-white/10 pb-4">
            About the Project
          </h2>
          <div className="text-base md:text-lg text-[#ececec]/90 leading-relaxed whitespace-pre-wrap font-sans">
            {project.details || (
              <span className="italic text-white/40">No case study article has been written for this project yet.</span>
            )}
          </div>
        </div>

        {/* Project Gallery Section */}
        {galleryUrls.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold font-ubuntu text-white border-b border-white/10 pb-4">
              Project Gallery
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {galleryUrls.map((url, idx) => (
                <a
                  key={idx}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black/40 shadow-md hover:border-amber-400/50 transition-all duration-300"
                >
                  <img
                    src={url}
                    alt={`${project.title} screenshot ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="px-3 py-1.5 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full text-xs font-bold text-white">
                      View Full Image
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
