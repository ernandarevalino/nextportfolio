import Header from "../components/Header";
import Hero from "../components/Hero";
import About from "../components/About";
import Skills from "../components/Skills";
import Resume from "../components/Resume";
import Portfolio from "../components/Portfolio";
import Contact from "../components/Contact";
import ScrollRestoration from "../components/ScrollRestoration";
import { getProjects, getProfile } from "@/actions/portfolio";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function Home({ params }: PageProps) {
  const { locale } = await params;

  const response = await getProjects();
  const projects = response?.data || [];

  const profileResponse = await getProfile();
  const profile = profileResponse?.success ? profileResponse.data : null;

  return (
    <div className="min-h-screen bg-[#1f1f1f] text-white">
      {/* Client-side Scroll Restoration */}
      <ScrollRestoration />

      {/* Top Header Navigation */}
      <Header />

      {/* Main Content Areas */}
      <main>
        <Hero profile={profile} />

        <About profile={profile} />

        <Skills />

        <Portfolio projects={projects} />

        <Resume />

        <Contact />

        {/* Footer */}
        <footer
          id="footer"
          className="py-12 bg-[#1b1b1b] border-t border-white/5 text-[#ececec]/60 text-sm"
        >
          <div className="container mx-auto px-6 md:px-12 max-w-7xl flex flex-col items-center justify-center text-center space-y-2">
            <p className="text-[#ececec] font-medium text-base font-ubuntu">
              &copy; {new Date().getFullYear()} Ernanda Revalino
            </p>
            <p className="text-[#ececec]/40 text-xs">
              nextportfolio.vercel.app
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
