import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NavigationMenu from '../components/NavigationMenu';
import GameShowcase from '../components/GameShowcase';
import DevelopersSection from '../components/DevelopersSection';
import TournamentsSection from '../components/TournamentsSection';
import { LoadingOverlay } from '../components/LoadingAnimation';
import { ChevronDown } from 'lucide-react';
import Leaderboard from '../components/Leaderboard';

type SectionId = 'hero' | 'games' | 'tournaments' | 'leaderboard' | 'developers';

const Home: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<SectionId>('hero');

  useEffect(() => {
    // Simulating loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section');
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          setActiveSection(section.id as SectionId);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sections: Array<{ id: SectionId; title: string; component: React.ReactNode }> = [
    { id: 'hero', title: 'Home', component: <div className="hero-section">...</div> },
    { id: 'games', title: 'Games', component: <GameShowcase /> },
    { id: 'tournaments', title: 'Tournaments', component: <TournamentsSection /> },
    { id: 'leaderboard', title: 'Leaderboard', component: <Leaderboard /> },
    { id: 'developers', title: 'Developers', component: <DevelopersSection /> }
  ];

  const navigateToSection = (sectionId: SectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  const handleNextSection = () => {
    const currentIndex = sections.findIndex(section => section.id === activeSection);
    const nextIndex = (currentIndex + 1) % sections.length;
    navigateToSection(sections[nextIndex].id);
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <AnimatePresence>
        {isLoading ? (
          <LoadingOverlay message="Loading awesome games..." />
        ) : (
          <>
            <NavigationMenu />
            <main className="pl-0 lg:pl-64">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {sections.map(({ id, component }) => (
                  <section key={id} id={id} className="min-h-screen">
                    {component}
                  </section>
                ))}
                <button
                  onClick={handleNextSection}
                  className="fixed bottom-8 right-8 p-4 bg-white/10 rounded-full backdrop-blur-sm hover:bg-white/20 transition-all"
                  aria-label="Next section"
                >
                  <ChevronDown className="w-6 h-6" />
                </button>
              </motion.div>
            </main>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home; 