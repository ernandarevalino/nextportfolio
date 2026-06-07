"use client";

interface Skill {
  name: string;
  percentage: string;
  tooltip: string;
}

interface SkillCategory {
  title: string;
  skills: Skill[];
}

export default function Skills() {
  const skillCategories: SkillCategory[] = [
    {
      title: "Soft Skills",
      skills: [
        { name: "Communication", percentage: "90%", tooltip: "Able to convey ideas clearly in both verbal and written formats" },
        { name: "Teamwork", percentage: "85%", tooltip: "Collaborative mindset and ability to work well in diverse teams" },
        { name: "Adaptability", percentage: "70%", tooltip: "Quick to learn new tools, environments, and ways of working" },
        { name: "Problem Solving", percentage: "60%", tooltip: "Ability to analyze situations and develop effective solutions" },
        { name: "Attention to Detail", percentage: "85%", tooltip: "Consistently produces accurate and thorough work" }
      ]
    },
    {
      title: "Back-end Development",
      skills: [
        { name: "PHP", percentage: "90%", tooltip: "Web development using Laravel and native PHP" },
        { name: "Python", percentage: "90%", tooltip: "Python scripting, Django development, and data analysis (Pandas, NumPy)" },
        { name: "MySQL", percentage: "85%", tooltip: "Relational database management and optimization with MySQL" },
        { name: "SQL", percentage: "80%", tooltip: "Writing complex queries, joins, and managing databases efficiently" },
        { name: "Node.js", percentage: "55%", tooltip: "Server-side JavaScript development with Express.js and REST APIs" }
      ]
    },
    {
      title: "UI/UX Design Skills",
      skills: [
        { name: "Figma", percentage: "75%", tooltip: "Wireframing, prototyping, and UI design for websites and mobile apps" },
        { name: "Canva", percentage: "90%", tooltip: "Creating visual content for presentations, social media, and branding" },
        { name: "Adobe Illustrator", percentage: "60%", tooltip: "Vector design, icon creation, and digital illustration for branding" }
      ]
    },
    {
      title: "Front-end Development",
      skills: [
        { name: "HTML/CSS", percentage: "95%", tooltip: "Expertise in semantic HTML5, responsive layouts, and modern CSS3" },
        { name: "JavaScript", percentage: "85%", tooltip: "Proficient in ES6+, DOM manipulation, and basic asynchronous programming" }
      ]
    },
    {
      title: "Data Analyst Tools",
      skills: [
        { name: "Microsoft Excel", percentage: "85%", tooltip: "Data cleaning, pivot tables, formulas, and charting" },
        { name: "Google Sheets", percentage: "80%", tooltip: "Online spreadsheet collaboration, formulas, and dashboarding" },
        { name: "SPSS", percentage: "70%", tooltip: "Statistical analysis and hypothesis testing for research data" },
        { name: "Jupyter Notebook", percentage: "75%", tooltip: "Python scripting for data analysis and visualization" },
        { name: "Google Colab", percentage: "75%", tooltip: "Cloud-based Jupyter Notebook for collaborative data science" },
        { name: "Looker Studio", percentage: "80%", tooltip: "Creating interactive dashboards from Google Sheets and BigQuery" },
        { name: "Microsoft Power BI", percentage: "80%", tooltip: "Building interactive business dashboards and reports" }
      ]
    }
  ];

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

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skillCategories.map((category, catIdx) => (
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
                        {skill.percentage}
                      </span>
                    </div>

                    {/* Progress Bar Container */}
                    <div className="w-full h-[6px] bg-white/10 rounded-full mt-2 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-white/40 to-[#ececec] rounded-full transition-all duration-500"
                        style={{ width: skill.percentage }}
                      ></div>
                    </div>

                    {/* Tooltip on Hover */}
                    <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bottom-full mb-2 left-1/2 -translate-x-1/2 bg-[#ececec] text-[#310606] text-xs py-2 px-3 rounded-lg shadow-xl w-max max-w-[260px] text-center z-30 font-medium">
                      {skill.tooltip}
                      {/* Triangle Pointer */}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-[#ececec]"></div>
                    </div>

                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
