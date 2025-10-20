import React, { useState, useEffect } from 'react';
import { DistributionType } from '../types';

interface NavigationProps {
  activeSection: DistributionType;
  onSectionChange: (section: DistributionType) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeSection, onSectionChange }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showNav, setShowNav] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const sections = [
    { id: DistributionType.Discrete, label: 'Discrete', icon: '🎲', shortLabel: 'Discrete' },
    { id: DistributionType.Continuous, label: 'Continuous', icon: '📈', shortLabel: 'Continuous' },
    { id: DistributionType.CLT, label: 'CLT Simulator', icon: '🧮', shortLabel: 'CLT' },
    { id: DistributionType.Tools, label: 'Tools & Learning', icon: '🛠️', shortLabel: 'Tools' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show/hide based on scroll direction
      if (currentScrollY < lastScrollY || currentScrollY < 50) {
        setShowNav(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowNav(false);
        setIsMobileMenuOpen(false); // Close menu when hiding
      }
      
      setIsScrolled(currentScrollY > 10);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleSectionChange = (section: DistributionType) => {
    onSectionChange(section);
    setIsMobileMenuOpen(false); // Close menu after selection
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top
  };

  const activeLabel = sections.find(s => s.id === activeSection);

  return (
    <>
      {/* Mobile: Compact Bottom Navigation */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg safe-area-bottom">
        <div className="grid grid-cols-4 gap-0">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => handleSectionChange(section.id)}
              className={`
                flex flex-col items-center justify-center py-2 px-1 min-h-[64px]
                transition-all duration-200 relative
                ${activeSection === section.id
                  ? 'text-primary-600'
                  : 'text-gray-600 active:bg-gray-100'
                }
              `}
            >
              {/* Active indicator */}
              {activeSection === section.id && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-primary-600 rounded-b-full" />
              )}
              
              <span className="text-2xl mb-1">{section.icon}</span>
              <span className="text-[10px] font-medium leading-tight text-center">
                {section.shortLabel}
              </span>
            </button>
          ))}
        </div>
      </nav>

      {/* Tablet & Desktop: Top Navigation with auto-hide */}
      <nav 
        className={`
          hidden sm:block fixed top-0 left-0 right-0 z-50 
          bg-white border-b border-gray-200 
          transition-all duration-300 ease-in-out
          ${showNav ? 'translate-y-0' : '-translate-y-full'}
          ${isScrolled ? 'shadow-md' : 'shadow-sm'}
        `}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* App title (compact on scroll) */}
            <div className={`transition-all duration-300 ${isScrolled ? 'scale-90' : 'scale-100'}`}>
              <h2 className="text-sm font-semibold text-gray-800 hidden md:block">
                Probability Simulator
              </h2>
              <span className="text-xl md:hidden">🎲</span>
            </div>

            {/* Navigation tabs */}
            <div className="flex space-x-1 sm:space-x-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => handleSectionChange(section.id)}
                  className={`
                    flex items-center px-3 py-2 rounded-lg font-medium text-sm
                    transition-all duration-200 ease-in-out
                    ${activeSection === section.id
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                    }
                  `}
                >
                  <span className="mr-1.5">{section.icon}</span>
                  <span className="hidden lg:inline">{section.label}</span>
                  <span className="lg:hidden">{section.shortLabel}</span>
                </button>
              ))}
            </div>

            {/* Scroll indicator (show when nav is hidden) */}
            {!showNav && (
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="fixed bottom-20 right-4 sm:bottom-4 bg-primary-600 text-white p-3 rounded-full shadow-lg hover:bg-primary-700 transition-all z-40"
                aria-label="Scroll to top"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Spacer for fixed navigation */}
      <div className="h-0 sm:h-16" />
      
      {/* Mobile: Spacer for bottom nav */}
      <div className="h-16 sm:h-0" />
    </>
  );
};

export default Navigation;
