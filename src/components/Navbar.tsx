import React, { useState, useEffect } from 'react';
import { Car } from 'lucide-react';

const Navbar = () => {
  const [activeSection, setActiveSection] = useState('home');

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'models', 'demo', 'about'];
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      
      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="bg-gray-900/50 backdrop-blur-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center -left-14 relative">
            <Car className="w-8 h-8 text-indigo-500" />
            <span className="ml-2 text-xl font-bold">ChromaRide 3D</span>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {[
                { id: 'home', label: 'Home' },
                { id: 'models', label: 'Models' },
                { id: 'demo', label: 'Demo' },
                { id: 'about', label: 'About' }
              ].map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  className={`
                    px-3 py-2 rounded-md text-sm font-medium
                    transition-all duration-300 ease-in-out
                    relative
                    ${activeSection === id ? 'text-white' : 'text-gray-300 hover:text-white'}
                    group
                  `}
                >
                  {label}
                  <span className={`
                    absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500
                    transform origin-left transition-transform duration-300
                    ${activeSection === id ? 'scale-x-100' : 'scale-x-0'}
                    group-hover:scale-x-100
                  `}></span>
                </button>
              ))}
              <button
                onClick={() => scrollToSection('demo')}
                className="
                  bg-indigo-500 text-white px-4 py-2 rounded-md text-sm font-medium
                  transition-all duration-300 ease-in-out
                  hover:bg-indigo-600 hover:scale-105
                  transform active:scale-95
                "
              >
                Try Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;