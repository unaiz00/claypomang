/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { Testimonial } from '../types';
import { motion, AnimatePresence } from 'motion/react';

export default function Testimonials() {
  const reviews: Testimonial[] = [
    {
      id: 'r-1',
      name: 'Deepika Kamath',
      role: 'Software Engineer • Mangalore',
      rating: 5,
      text: 'Our weekend wheel-throwing date was exceptional! As someone sitting in front of a monitor all week, the physical, tactile feel of shaping red wet clay was the absolute ultimate digital detox. The coaches and artisans were super encouraging and coached us step-by-step from zero. Highly recommended!',
      date: 'May 2026'
    },
    {
      id: 'r-2',
      name: 'Rohan D’Souza',
      role: 'Architect • Bejai, Mangalore',
      rating: 5,
      text: 'The 4-week Wheel Throwing Foundation course transformed how I view ceramics. The studio provides high-quality pottery wheels, clay, and premium tools. Glazing my custom-thrown mugs and drinking from them is a beautiful self-reclaiming feeling. Fantastic addition to Mangalore\'s creative scene.',
      date: 'April 2026'
    },
    {
      id: 'r-3',
      name: 'Prisha Hegde',
      role: 'Creative Designer • Kadri',
      rating: 5,
      text: 'I booked the Organic Slab & Handbuilding session for our family. Even my 8-year-old was able to pinch-mold and coil a lovely small flower pot and decorated bowl! The garden workshop environment is peaceful, clean, and full of positive artistic energy. We cannot wait to pick up our glazed items!',
      date: 'March 2026'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const handleDragEnd = (_event: any, info: any) => {
    const swipeThreshold = 50; // pixels
    if (info.offset.x < -swipeThreshold) {
      handleNext();
    } else if (info.offset.x > swipeThreshold) {
      handlePrev();
    }
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 120 : -120,
      opacity: 0,
      scale: 0.98
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring', stiffness: 350, damping: 30 },
        opacity: { duration: 0.25 }
      }
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 120 : -120,
      opacity: 0,
      scale: 0.98,
      transition: {
        x: { type: 'spring', stiffness: 350, damping: 30 },
        opacity: { duration: 0.2 }
      }
    })
  };

  const currentReview = reviews[currentIndex];

  return (
    <section id="testimonials" className="py-25 md:py-32 bg-brand-parchment relative overflow-hidden">
      {/* Background clay wheel graphic detail spot */}
      <div className="absolute top-1/2 -left-32 w-80 h-80 rounded-full border border-brand-clay/5 flex items-center justify-center pointer-events-none">
        <div className="w-56 h-56 rounded-full border border-brand-clay/3 flex items-center justify-center" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Header quote marker */}
        <div className="text-center max-w-2xl mx-auto mb-14 flex flex-col items-center">
          <Quote className="w-10 h-10 text-brand-clay/30 rotate-180" />
          <span className="text-xs font-mono tracking-widest text-brand-terracotta uppercase font-bold block mt-3 mb-2">
            STUDENT VOICES
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl tracking-tight text-brand-earth font-bold text-center leading-snug">
            Stories Shaped By Hand
          </h2>
          <p className="font-sans text-brand-earth/70 text-sm mt-3 leading-relaxed">
            Read real, heartwarming stories and feedback from beginners, seasoned ceramic creators, and families who discovered their inner artist inside our clay workshop.
          </p>
        </div>

        {/* Swipeable Carousel Area */}
        <div className="relative max-w-2xl mx-auto px-1 sm:px-10 mt-6 md:mt-10">
          
          {/* Controls - Left Chevron */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -ml-2 sm:-ml-4 z-20 w-11 h-11 rounded-full bg-white/90 backdrop-blur-xs border border-brand-earth/10 flex items-center justify-center text-brand-earth hover:bg-brand-clay hover:text-brand-sand transition-colors shadow-sm cursor-pointer"
            aria-label="Previous testimonial"
            id="testimonial-prev-btn"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          {/* Controls - Right Chevron */}
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 -mr-2 sm:-mr-4 z-20 w-11 h-11 rounded-full bg-white/90 backdrop-blur-xs border border-brand-earth/10 flex items-center justify-center text-brand-earth hover:bg-brand-clay hover:text-brand-sand transition-colors shadow-sm cursor-pointer"
            aria-label="Next testimonial"
            id="testimonial-next-btn"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Draggable Active Slide Frame */}
          <div className="overflow-hidden py-4 -my-4 relative min-h-[220px] sm:min-h-[240px] flex items-center justify-center touch-pan-y">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.8}
                onDragEnd={handleDragEnd}
                className="w-full bg-brand-bento-card border border-brand-bento-border rounded-[32px] p-6 sm:p-10 flex flex-col justify-between cursor-grab active:cursor-grabbing hover:shadow-xs transition-shadow duration-300 select-none"
                id={`testimonial-card-${currentReview.id}`}
              >
                <div>
                  {/* Rating Score & Date */}
                  <div className="flex items-center gap-1 text-brand-ochre mb-5 sm:mb-6">
                    {Array.from({ length: currentReview.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current text-amber-500 border-none" />
                    ))}
                    <span className="text-[10px] text-brand-meta font-mono ml-2 font-bold uppercase">{currentReview.date}</span>
                  </div>

                  {/* Clamped 2-Line Review Text */}
                  <div className="relative group">
                    <p 
                      id={`testimonial-text-${currentReview.id}`}
                      title={currentReview.text}
                      className="font-sans text-brand-earth/95 text-sm sm:text-base md:text-lg leading-relaxed mb-6 italic line-clamp-2 h-12 sm:h-14 overflow-hidden"
                    >
                      "{currentReview.text}"
                    </p>
                  </div>
                </div>

                {/* Author Information */}
                <div className="flex items-center gap-3 border-t border-[#f0ede6] pt-4 mt-2 sm:mt-4">
                  <div className="w-10 h-10 bg-brand-terracotta text-brand-sand font-serif italic text-base rounded-full flex items-center justify-center shrink-0 border border-brand-clay/30 shadow-xs">
                    {currentReview.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-serif text-sm text-brand-earth font-bold leading-none">{currentReview.name}</h4>
                    <span className="text-[10px] font-mono text-brand-earth/50 block mt-1.5">{currentReview.role}</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

        {/* Pagination/Active Indicator Dots */}
        <div className="flex justify-center gap-2 mt-8" id="testimonials-dots">
          {reviews.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                index === currentIndex 
                  ? 'bg-brand-terracotta w-6' 
                  : 'bg-brand-earth/20 hover:bg-brand-earth/40 w-2.5'
              }`}
              aria-label={`Go to slide ${index + 1}`}
              id={`testimonial-dot-${index}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
