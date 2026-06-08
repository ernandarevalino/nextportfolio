"use client";

import { useState } from "react";
import {
  BsEye,
  BsGithub
} from "react-icons/bs";
import Link from "next/link";

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
  const [activeFilter, setActiveFilter] = useState("all");
  const loading = false;

  const filters = [
    { key: "all", label: "All Projects" },
    { key: "webdev", label: "Web Development" },
    { key: "analyst", label: "Data Analyst" },
    { key: "mobdev", label: "Mobile Development" },
    { key: "etc", label: "Etc" },
  ];

  const mappedProjects: PortfolioItem[] = (projects && projects.length > 0)
    ? projects.map((item: any) => {
        // Helper function to map category string to expected key
        let catKey = "etc";
        const lowerCat = item.category.toLowerCase();
        if (lowerCat.includes("web")) catKey = "webdev";
        else if (lowerCat.includes("analyst") || lowerCat.includes("data")) catKey = "analyst";
        else if (lowerCat.includes("mobile")) catKey = "mobdev";

        return {
          id: item.id,
          title: item.title,
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

  return (
    <div className="space-y-20">
      
      {/* Portfolio Gallery Section */}
      <section id="portfolio" className="py-20 bg-[#1f1f1f] text-white">
        <div className="container mx-auto px-4 md:px-8">
          
          {/* Section Title */}
          <div className="section-title text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold font-ubuntu tracking-wide text-white uppercase inline-block">
              Portfolio
            </h2>
            <p className="text-[#ececec]/70 mt-4 text-base md:text-lg">
              A collection of projects i built from curiosity — here is my portfolio.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Filtering Sidebar */}
            <div className="lg:col-span-3">
              <div className="bg-[#232323] p-6 rounded-[2rem] border border-white/10 shadow-xl space-y-4 lg:sticky lg:top-8">
                <h3 className="text-lg font-bold font-ubuntu text-white border-b border-white/10 pb-3 pl-2">
                  Categories
                </h3>
                <ul className="space-y-2">
                  {filters.map((filter) => (
                    <li key={filter.key}>
                      <button
                        onClick={() => setActiveFilter(filter.key)}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm md:text-base font-semibold transition-all duration-300 ${
                          activeFilter === filter.key
                            ? "bg-[#ececec] text-[#310606]"
                            : "text-[#ececec]/70 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        {filter.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Gallery Content */}
            <div className="lg:col-span-9">
              {loading ? (
                <div className="bg-[#232323] p-12 rounded-[2rem] text-center border border-white/10 flex flex-col items-center justify-center space-y-4">
                  <div className="w-10 h-10 border-4 border-[#ececec] border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-[#ececec]/60">Loading projects...</p>
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="bg-[#232323] p-12 rounded-[2rem] text-center border border-white/10">
                  <p className="text-[#ececec]/60">No projects found in this category.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 transition-all duration-500">
                  {filteredItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="group relative overflow-hidden rounded-[2rem] bg-[#232323] border border-white/10 shadow-xl"
                    >
                      {/* Image Frame */}
                      <div className="aspect-[4/3] w-full overflow-hidden">
                        <img
                          src={item.imgSrc}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      </div>

                      {/* Information Overlay */}
                      <div className="absolute inset-0 bg-black/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center p-8 text-center space-y-4">
                        <span className="text-xs font-semibold tracking-wider text-[#ececec]/75 uppercase">
                          {item.category}
                        </span>
                        <h4 className="text-xl font-bold font-ubuntu text-white">
                          {item.title}
                        </h4>
                        
                        {/* Links inside overlay */}
                        <div className="flex gap-4 pt-2">
                          {item.githubUrl && item.githubUrl !== "#" && (
                            <a
                              href={item.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-11 h-11 bg-[#ececec] text-[#310606] rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300"
                              title="View Github Repo"
                            >
                              <BsGithub className="text-lg" />
                            </a>
                          )}
                          <Link
                            href={`/portfolio/${item.id}`}
                            className="w-11 h-11 bg-[#ececec] text-[#310606] rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300"
                            title="View Details"
                          >
                            <BsEye className="text-lg" />
                          </Link>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
