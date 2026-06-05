/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Menu, X, Compass, Calendar, PhoneCall, HelpCircle, Layers, Settings } from 'lucide-react';

interface NavbarProps {
  onOpenAdmin: () => void;
  onScrollToWorkshops: () => void;
}

export default function Navbar({ onOpenAdmin, onScrollToWorkshops }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { title: 'Workshops', id: 'workshops', icon: Calendar },
    { title: 'About Pottery', id: 'about', icon: Compass },
    { title: 'Our Classes', id: 'classes', icon: Layers },
    { title: 'Art Gallery', id: 'gallery', icon: Layers },
    { title: 'FAQs', id: 'faqs', icon: HelpCircle },
    { title: 'Contact Us', id: 'contact', icon: PhoneCall },
  ];

  const handleScrollToSection = (id: string) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // height of navbar
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav
      id="main-nav"
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-brand-parchment/95 backdrop-blur-md shadow-sm border-b border-brand-earth/5 py-4"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Branding Title */}
        <div 
          role="button"
          tabIndex={0}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          onKeyDown={(e) => {
            if (e.key === 'Enter') window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 bg-brand-terracotta rounded-full flex items-center justify-center text-white font-serif italic text-xl shadow-xs">C</div>
          <div className="flex flex-col">
            <span className="font-serif text-lg tracking-tight text-brand-earth leading-none font-bold group-hover:text-brand-terracotta transition-colors">
              Clay & Craft Studio
            </span>
            <span className="text-[9px] tracking-[0.18em] text-brand-meta font-mono uppercase mt-1">
              Boutique Space • Mangalore
            </span>
          </div>
        </div>

        {/* Desktop Navigation Link Items */}
        <div className="hidden lg:flex items-center space-x-8">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleScrollToSection(item.id)}
              className="font-sans text-xs tracking-widest uppercase font-bold text-brand-meta hover:text-brand-terracotta transition-colors duration-200 cursor-pointer text-left"
            >
              {item.title}
            </button>
          ))}
          
          {/* Core Booking CTA */}
          <button
            onClick={onScrollToWorkshops}
            id="book-cta-nav-button"
            className="bg-brand-terracotta hover:bg-brand-terracotta-hover text-white tracking-widest text-xs uppercase font-bold px-6 py-3 rounded-full transition-all cursor-pointer shadow-sm"
          >
            Book Workshop
          </button>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center space-x-3 lg:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            id="mobile-menu-toggle"
            aria-label="Toggle navigation menu"
            className="p-2 text-brand-earth hover:text-brand-terracotta transition-colors cursor-pointer"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          id="mobile-drawer"
          className="lg:hidden absolute top-full left-0 right-0 bg-brand-parchment animate-fade-in divide-y divide-brand-earth/5 shadow-xl border-b border-brand-earth/10"
        >
          <div className="px-6 py-6 space-y-4 flex flex-col">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleScrollToSection(item.id)}
                className="flex items-center space-x-4 py-2.5 text-brand-earth hover:text-brand-terracotta font-sans text-base transition-colors duration-150 cursor-pointer text-left"
              >
                <item.icon className="w-4 h-4 text-brand-clay" />
                <span>{item.title}</span>
              </button>
            ))}
            <div className="pt-4 flex flex-col gap-3">
              <button
                onClick={onScrollToWorkshops}
                id="book-cta-mobile-btn"
                className="w-full bg-brand-terracotta text-white py-3 rounded text-center tracking-wider text-sm font-sans uppercase font-semibold cursor-pointer"
              >
                Book Workshop
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
