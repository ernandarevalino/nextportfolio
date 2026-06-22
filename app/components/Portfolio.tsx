"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { BsEye, BsGithub, BsChevronLeft, BsChevronRight } from "react-icons/bs";
import Link from "next/link";
import ScrollReveal from "./ScrollReveal";

interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  categoryKey: string;
  imgSrc: string;
  githubUrl?: string;
  detailsUrl?: string;
}

interface PortfolioProps {
  projects?: any[];
}

export default function Portfolio({ projects = [] }: PortfolioProps) {
  const locale = useLocale();
  const searchParams = useSearchParams();
  const fromDetail = searchParams.get("from") === "detail";
  const [activeFilter, setActiveFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;
  const loading = false;
  const isEn = locale === "en";

  useEffect(() => {
    if (!fromDetail) return;

    const timer = setTimeout(() => {
      const element = document.getElementById("portfolio");
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [fromDetail]);

  const filters = [
    { key: "all", label: "All Projects" },
    { key: "webdev", label: "Web Development" },
    { key: "analyst", label: "Data Analyst" },
    { key: "mobdev", label: "Mobile Development" },
    { key: "etc", label: "Etc" },
  ];

  const mappedProjects: PortfolioItem[] = (projects && projects.length > 0)
    ? projects.map((item: any) => {
        let catKey = "etc";
        const lowerCat = item.category.toLowerCase();
        if (lowerCat.includes("web")) catKey = "webdev";
        else if (lowerCat.includes("analyst") || lowerCat.includes("data")) catKey = "analyst";
        else if (lowerCat.includes("mobile")) catKey = "mobdev";

        return {
          id: item.id,
          title: isEn ? (item.title_en || item.title_id) : (item.title_id || item.title_en),
          category: item.category,
          categoryKey: catKey,
          imgSrc: item.image_url,
          githubUrl: item.github_url || "#"
        };
      })
    : [];

  const filteredItems = activeFilter === "all"
    ? mappedProjects
    : mappedProjects.filter(item => item.categoryKey === activeFilter);

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);

  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleFilterChange = (key: string) => {
    setActiveFilter(key);
    setCurrentPage(1);
  };

  return (
    <section id="portfolio" className="py-24 bg-[#1f1f1f] text-white relative scroll-mt-20">
      
      {/* Background Tech Accent */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.01] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"></div>

      <div className="container mx-auto px-6 md:px-12 max-w-7xl relative z-10">
        
        {/* Section Title */}
        <div className="section-title text-center mb-16">
          <ScrollReveal delay={0}>
            <h2 className="text-3xl md:text-5xl font-black font-ubuntu tracking-tight text-white uppercase mt-4">
              Projects
            </h2>
            <p className="text-[#ececec]/60 mt-3 text-base md:text-lg max-w-xl mx-auto font-['Nunito']">
              A curated showcase of real-world products, dashboards, and apps I built to solve technical challenges.
            </p>
          </ScrollReveal>
        </div>

        {/* Clean flowing layout with centered top category tabs and full width gallery */}
        <div className="flex flex-col space-y-12 w-full">
          
          {/* Top Horizontal Tab Bar */}
          <div className="flex justify-center w-full">
            <ScrollReveal delay={150} className="w-full max-w-7xl">
              <div className="bg-gradient-to-r from-[#232323] to-[#202020] p-2 rounded-2xl md:rounded-full border border-white/5 shadow-2xl flex overflow-x-auto scrollbar-none whitespace-nowrap flex-nowrap md:flex-wrap md:justify-center gap-2">
                {filters.map((filter) => (
                  <button
                    key={filter.key}
                    onClick={() => handleFilterChange(filter.key)}
                    className={`px-6 py-3 rounded-xl md:rounded-full text-xs md:text-sm font-bold transition-all duration-300 cursor-pointer shrink-0 ${
                      activeFilter === filter.key
                        ? "bg-[#ececec] text-[#1f1f1f] shadow-lg shadow-white/5"
                        : "text-[#ececec]/60 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </ScrollReveal>
          </div>

          {/* Gallery Content (Full Width aligned with filter bar) */}
          <div className="w-full">
            {loading ? (
              <div className="bg-gradient-to-br from-[#232323] to-[#202020] p-16 rounded-[2.5rem] text-center border border-white/5 flex flex-col items-center justify-center space-y-4 shadow-xl">
                <div className="w-10 h-10 border-4 border-[#ececec] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-[#ececec]/50 text-sm font-medium">Loading projects...</p>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="bg-gradient-to-br from-[#232323] to-[#202020] p-16 rounded-[2.5rem] text-center border border-white/5 shadow-xl">
                <p className="text-[#ececec]/50 font-['Nunito'] font-medium">No projects found in this category.</p>
              </div>
            ) : (
              <>
                {/* Fixed Grid Layout (Removed glitchy transition-all from grid container) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {paginatedItems.map((item, idx) => (
                    /* Injecting activeFilter to key ensures distinct render animation lifecycle */
                    <ScrollReveal key={`project-${item.id || idx}-${activeFilter}`} delay={idx * 150}>
                      <div
                        className="group relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#232323] to-[#202020] border border-white/5 hover:border-white/10 shadow-2xl transition-all duration-500 hover:shadow-white/[0.01] h-full flex flex-col"
                      >
                        {/* Image Frame with overflow hidden */}
                        <div className="aspect-[4/3] w-full overflow-hidden relative bg-black/20">
                          <img
                            src={item.imgSrc}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                            onError={(e) => {
                              e.currentTarget.src = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600";
                            }}
                          />
                        </div>

                        {/* Mobile Information Block (Static, no hover, Mobile Only) */}
                        <div className="block md:hidden p-6 space-y-4 bg-gradient-to-b from-[#232323] to-[#202020] text-center flex-grow">
                          <span className="text-[10px] font-bold tracking-widest text-[#ececec]/50 uppercase">
                            {item.category}
                          </span>
                          <h4 className="text-lg font-black font-ubuntu text-white tracking-wide leading-tight px-2">
                            {item.title}
                          </h4>
                          <div className="flex gap-4 justify-center pt-2">
                            {item.githubUrl && item.githubUrl !== "#" && (
                              <a
                                href={item.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-12 h-12 bg-white/5 text-white border border-white/10 rounded-full flex items-center justify-center active:scale-95 transition-all duration-200 shadow-lg cursor-pointer"
                                title="View GitHub Repository"
                              >
                                <BsGithub className="text-base" />
                              </a>
                            )}
                            <Link
                              href={`/${locale}/portfolio/${item.id}`}
                              className="w-12 h-12 bg-[#ececec] text-[#1f1f1f] rounded-full flex items-center justify-center active:scale-95 transition-all duration-200 shadow-lg cursor-pointer"
                              title="View Case Study Details"
                            >
                              <BsEye className="text-base" />
                            </Link>
                          </div>
                        </div>

                        {/* Premium Glassmorphic Information Overlay (Fully Animated, Desktop Only) */}
                        <div className="hidden md:flex absolute inset-0 bg-[#1f1f1f]/90 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 flex-col justify-center items-center p-8 text-center space-y-4 animate-fade-in">
                          {/* Floating Category with slide down */}
                          <span className="text-[10px] font-bold tracking-widest text-[#ececec]/50 uppercase translate-y-[-10px] group-hover:translate-y-0 transition-transform duration-500 ease-out">
                            {item.category}
                          </span>
                          
                          {/* Floating Title with slide up */}
                          <h4 className="text-xl md:text-2xl font-black font-ubuntu text-white tracking-wide leading-tight px-4 translate-y-[10px] group-hover:translate-y-0 transition-transform duration-500 ease-out">
                            {item.title}
                          </h4>
                          
                          {/* Interactive Buttons with delay */}
                          <div className="flex gap-4 pt-3 translate-y-[15px] group-hover:translate-y-0 transition-all duration-500 delay-100 ease-out">
                            {item.githubUrl && item.githubUrl !== "#" && (
                              <a
                                href={item.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-12 h-12 bg-white/5 hover:bg-[#ececec] text-white hover:text-[#1f1f1f] border border-white/10 rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 shadow-lg cursor-pointer"
                                title="View GitHub Repository"
                              >
                                <BsGithub className="text-lg" />
                              </a>
                            )}
                            <Link
                              href={`/${locale}/portfolio/${item.id}`}
                              className="w-12 h-12 bg-[#ececec] text-[#1f1f1f] hover:bg-white rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 shadow-lg cursor-pointer"
                              title="View Case Study Details"
                            >
                              <BsEye className="text-lg" />
                            </Link>
                          </div>
                        </div>

                      </div>
                    </ScrollReveal>
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <ScrollReveal delay={100}>
                    <div className="flex justify-center items-center space-x-4 md:space-x-6 mt-12">
                      <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className={`flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-[#232323] to-[#202020] border border-white/5 shadow-xl transition-all duration-300 ${
                          currentPage === 1
                            ? "opacity-40 cursor-not-allowed"
                            : "hover:bg-white/5 hover:border-white/10 active:scale-95 cursor-pointer"
                        }`}
                        aria-label="Previous Page"
                      >
                        <BsChevronLeft className="text-lg text-[#ececec]" />
                      </button>

                      <span className="text-sm font-bold font-['Nunito'] text-[#ececec]/80 tracking-wide bg-gradient-to-r from-[#232323] to-[#202020] px-5 py-3 rounded-xl border border-white/5 shadow-xl">
                        Page <span className="text-white">{currentPage}</span> of{" "}
                        <span className="text-white">{totalPages}</span>
                      </span>

                      <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className={`flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-[#232323] to-[#202020] border border-white/5 shadow-xl transition-all duration-300 ${
                          currentPage === totalPages
                            ? "opacity-40 cursor-not-allowed"
                            : "hover:bg-white/5 hover:border-white/10 active:scale-95 cursor-pointer"
                        }`}
                        aria-label="Next Page"
                      >
                        <BsChevronRight className="text-lg text-[#ececec]" />
                      </button>
                    </div>
                  </ScrollReveal>
                )}
              </>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}