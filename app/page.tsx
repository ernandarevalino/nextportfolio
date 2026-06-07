import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Resume from "./components/Resume";
import Portfolio from "./components/Portfolio";
import Contact from "./components/Contact";
import { getProjects } from "@/actions/portfolio";

export default async function Home() {
  const response = await getProjects();
  const projects = response?.data || [];

  return (
    <div className="min-h-screen bg-[#1f1f1f] text-white">
      
      {/* Sidebar Navigation */}
      <Header />

      {/* Main Content Areas */}
      <main className="xl:pl-[300px] transition-all duration-300">
        
        <Hero />
        
        <About />
        
        <Skills />
        
        <Resume />
        
        <Portfolio projects={projects} />
        
        <Contact />

        {/* Footer */}
        <footer id="footer" className="py-12 bg-[#1b1b1b] border-t border-white/5 text-[#ececec]/60 text-sm">
          <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <div>
              <p>
                &copy; 2025 <strong className="text-white">Ernanda Revalino</strong>. All Rights Reserved.
              </p>
            </div>
            <div>
              <p className="text-xs">
                Designed by Bootstrap | Reimagined with Next.js & Tailwind CSS
              </p>
            </div>
          </div>
        </footer>

      </main>

    </div>
  );
}
