/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

interface HeroProps {
  onScrollToWorkshops: () => void;
  onRefreshWorkshops?: () => void;
  isCustomUrl?: boolean;
  isLoading?: boolean;
}

export default function Hero({ onScrollToWorkshops }: HeroProps) {
  return (
    <section 
      id="hero" 
      className="relative min-h-[90vh] flex items-center bg-brand-earth overflow-hidden pt-24"
    >
      {/* Immersive background image with fallback styles */}
      <div className="absolute inset-0 overflow-hidden">
        <img 
          src="hero.jpeg"
          alt="Hands shaping raw clay on a potter's wheel"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center transition-transform duration-1000 scale-[1.01] opacity-[0.65]"
        />
      </div>
      
      {/* Premium dark overlay gradients for high readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/45" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent hidden lg:block" />

      {/* Decorative ambient clay glow */}
      <div className="absolute top-1/4 left-1/4 -translate-y-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-brand-clay/10 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full relative z-10 py-16 flex flex-col items-center lg:items-start text-center lg:text-left animate-fade-in">
        <div className="max-w-3xl">
          
          {/* Main Display Headline */}
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6.5xl text-white leading-[1.1] mb-6 tracking-tight">
            Shape Raw Earth <br />
            <span className="italic text-brand-clay font-normal">into Beautiful Art</span>
          </h1>
          
          {/* Conversational Description */}
          <p className="font-sans text-neutral-200 text-sm sm:text-base md:text-lg leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0">
            Join our peaceful, expert-led weekend pottery classes in Mangalore's quiet hills. Experience the therapeutic rhythm of clay throwing, traditional hand-coiling, and kiln firing under warm guidance.
          </p>

          {/* Premium Compact Lifestyle CTAs */}
          <div className="flex flex-row items-center gap-3 sm:gap-4 justify-center lg:justify-start w-full">
            <button
              onClick={onScrollToWorkshops}
              id="hero-view-cta-btn"
              className="w-1/2 max-w-[210px] sm:w-[210px] select-none bg-transparent hover:bg-white/10 text-white border-[1.5px] border-white font-sans text-[16px] sm:text-[18px] font-medium h-[52px] rounded-[10px] transition-all duration-300 hover:-translate-y-0.5 cursor-pointer flex items-center justify-center text-center px-2 sm:px-4"
            >
              View Workshops
            </button>

            <button
              onClick={onScrollToWorkshops}
              id="hero-book-cta-btn"
              className="w-1/2 max-w-[210px] sm:w-[210px] select-none bg-white hover:bg-neutral-100 text-brand-earth font-sans text-[16px] sm:text-[18px] font-medium h-[52px] rounded-[10px] shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 cursor-pointer flex items-center justify-center text-center px-2 sm:px-4"
            >
              Book Your Workshop
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
