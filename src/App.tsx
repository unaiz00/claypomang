/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Classes from './components/Classes';
import Workshops from './components/Workshops';
import BookingModal from './components/BookingModal';
import Gallery from './components/Gallery';
import Testimonials from './components/Testimonials';
import FAQs from './components/FAQs';
import Contact from './components/Contact';
import AdminPanel from './components/AdminPanel';

import { StudioSettings, Workshop } from './types';
import { getStudioSettings, fetchWorkshops, saveStudioSettings, submitBooking } from './utils/googleSheets';
import { HelpCircle, ChevronUp, Github, Sparkles, Settings } from 'lucide-react';

export default function App() {
  const [settings, setSettings] = useState<StudioSettings>({
    sheetCsvUrl: '',
    appsScriptUrl: '',
    isCustomConfigured: false
  });
  
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [isLoadingWorkshops, setIsLoadingWorkshops] = useState(true);
  
  const [activeWorkshop, setActiveWorkshop] = useState<Workshop | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Load initial settings and load upcoming workshops
  useEffect(() => {
    const loadedSettings = getStudioSettings();
    setSettings(loadedSettings);
    loadWorkshops(loadedSettings);

    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true' || params.get('setup') === 'true') {
      setIsAdminOpen(true);
    }

    const handleScrollBtn = () => {
      if (window.scrollY > 500) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScrollBtn);
    return () => window.removeEventListener('scroll', handleScrollBtn);
  }, []);

  const loadWorkshops = async (currentSettings: StudioSettings) => {
    setIsLoadingWorkshops(true);
    try {
      const data = await fetchWorkshops(currentSettings);
      setWorkshops(data);
    } catch (e) {
      console.error('Failed to load workshops in App.tsx', e);
    } finally {
      setIsLoadingWorkshops(false);
    }
  };

  const handleSaveSettings = (newSettings: StudioSettings) => {
    const updated = saveStudioSettings(newSettings);
    setSettings(updated);
    loadWorkshops(updated);
  };

  const handleBookingSubmission = async (payload: any) => {
    const response = await submitBooking(payload, settings);
    
    // Always decrement seats state locally on successful booking
    // so it visualizes instantly and prevents over-booking before any refresh
    if (response.success) {
      setWorkshops(prev => prev.map(w => {
        if (w.id === payload.workshopId) {
          const isMorning = payload.slot === 'morning';
          const isMorningActive = w.morningSlot && w.morningSlot.trim().toLowerCase() !== 'not available';
          const isAfternoonActive = w.afternoonSlot && w.afternoonSlot.trim().toLowerCase() !== 'not available';

          const currentM = w.morningAvailableSeats ?? (isMorningActive ? w.maxSeats : 0);
          const currentA = w.afternoonAvailableSeats ?? (isAfternoonActive ? w.maxSeats : 0);

          let newM = currentM;
          let newA = currentA;

          if (isMorning) {
            newM = Math.max(0, currentM - 1);
          } else {
            newA = Math.max(0, currentA - 1);
          }

          let newTotal = 0;
          if (isMorningActive) newTotal += newM;
          if (isAfternoonActive) newTotal += newA;
          if (!isMorningActive && !isAfternoonActive) {
            newTotal = Math.max(0, w.availableSeats - 1);
          }

          return {
            ...w,
            morningAvailableSeats: newM,
            afternoonAvailableSeats: newA,
            availableSeats: newTotal
          };
        }
        return w;
      }));
      
      // Also fetch updated data in the background if connected to external endpoint
      if (settings.appsScriptUrl || settings.sheetCsvUrl) {
        loadWorkshops(settings);
      }
    }
    
    return response;
  };

  const scrollToWorkshops = () => {
    const workshopsSection = document.getElementById('workshops');
    if (workshopsSection) {
      const offset = 80; // Height of navbar
      const y = workshopsSection.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleOpenAdminPanel = () => {
    setIsAdminOpen(true);
  };

  return (
    <div id="app-root-container" className="min-h-screen bg-brand-parchment font-sans flex flex-col text-brand-earth selection:bg-brand-clay/20 selection:text-brand-terracotta">
      
      {/* Top Navigation Panel */}
      <Navbar 
        onOpenAdmin={handleOpenAdminPanel}
        onScrollToWorkshops={scrollToWorkshops}
      />

      {/* Main Core Editorial Layout Sections */}
      <main className="flex-1 flex flex-col">
        <Hero 
          onScrollToWorkshops={scrollToWorkshops}
          onRefreshWorkshops={() => loadWorkshops(settings)}
          isCustomUrl={settings.isCustomConfigured}
          isLoading={isLoadingWorkshops}
        />
        
        <About />
        
        <Classes />
        
        <Workshops 
          workshops={workshops}
          isLoading={isLoadingWorkshops}
          onBookWorkshop={(ws) => setActiveWorkshop(ws)}
          isCustomUrl={settings.isCustomConfigured}
          onOpenAdmin={handleOpenAdminPanel}
        />
        
        <Gallery />
        
        <Testimonials />
        
        <FAQs />
        
        <Contact />
      </main>

      {/* Footer Block */}
      <footer className="bg-brand-earth text-brand-sand py-16 border-t border-brand-clay/10 relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-10 items-start border-b border-brand-sand/10 pb-12 mb-10">
          
          {/* Brand col */}
          <div className="md:col-span-7 space-y-4">
            <span className="font-serif text-2xl tracking-wider text-brand-sand uppercase leading-none font-bold block">
              Clay & Craft Studio
            </span>
            <span className="text-[10px] tracking-widest text-brand-ochre font-mono uppercase block mt-1">
              Boutique Creative Space • Mangalore, India
            </span>
            <p className="font-sans text-brand-sand/60 text-xs leading-relaxed max-w-md pt-2">
              Discover the peaceful rhythm of raw clay, traditional coiling, and high-kiln ceramic firing in our Mangalore hills sanctuary. Shape ideas into microwave-safe heirloom dining wares.
            </p>
          </div>

          {/* Quick links col */}
          <div className="md:col-span-5 space-y-3.5 md:pl-12">
            <h5 className="font-mono text-[11px] font-bold text-brand-ochre uppercase tracking-widest">Navigate</h5>
            <div className="grid grid-cols-2 gap-2 text-xs font-sans text-brand-sand/70">
              <button onClick={() => document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-brand-ochre text-left cursor-pointer transition-colors block">Welcome</button>
              <button onClick={scrollToWorkshops} className="hover:text-brand-ochre text-left cursor-pointer transition-colors block">Workshops</button>
              <button onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-brand-ochre text-left cursor-pointer transition-colors block">Our Story</button>
              <button onClick={() => document.getElementById('classes')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-brand-ochre text-left cursor-pointer transition-colors block">Classes</button>
              <button onClick={() => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-brand-ochre text-left cursor-pointer transition-colors block">Creative Gallery</button>
              <button onClick={() => document.getElementById('faqs')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-brand-ochre text-left cursor-pointer transition-colors block">Questions</button>
            </div>
          </div>

        </div>

        {/* Copyleft / Copyright footer line */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col sm:flex-row justify-between items-center text-[10px] font-mono uppercase tracking-wider text-brand-sand/40 gap-4">
          <span>© 2026 Clay & Craft Boutique Pottery Studio. Mangalore, Karnataka.</span>
          <span className="flex items-center gap-3">
            <span>Crafted with Dedication</span>
            <span>•</span>
            <button
              onClick={handleOpenAdminPanel}
              id="footer-admin-trigger-btn"
              className="hover:text-brand-ochre cursor-pointer transition-colors flex items-center gap-1 uppercase"
            >
              <Settings className="w-3 h-3 animate-spin duration-[4000ms] ease-linear" />
              <span>Studio Settings</span>
            </button>
          </span>
        </div>
      </footer>

      {/* Slide-over Setup panel container overlay */}
      {isAdminOpen && (
        <lazy-admin-settings-panel>
          <AdminPanel 
            isOpen={isAdminOpen}
            onClose={() => setIsAdminOpen(false)}
            onSaveSettings={handleSaveSettings}
            currentSettings={settings}
          />
        </lazy-admin-settings-panel>
      )}

      {/* Floating interactive checkout dialog overlay */}
      {activeWorkshop && (
        <BookingModal 
          workshop={workshops.find(w => w.id === activeWorkshop.id) || activeWorkshop}
          onClose={() => setActiveWorkshop(null)}
          onSubmitBooking={handleBookingSubmission}
        />
      )}

      {/* Visual Back-To-Top button */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          id="back-to-top-btn"
          aria-label="Scroll back to top of page"
          className="fixed bottom-6 right-6 z-40 bg-brand-terracotta hover:bg-brand-earth text-white p-3 rounded-full shadow-lg border border-white/10 hover:-translate-y-1 transition-all cursor-pointer"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}

    </div>
  );
}
