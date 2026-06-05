/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Calendar, Clock, Armchair, CircleAlert, Sparkles, Filter } from 'lucide-react';
import { Workshop } from '../types';

interface WorkshopsProps {
  workshops: Workshop[];
  isLoading: boolean;
  onBookWorkshop: (workshop: Workshop) => void;
  isCustomUrl: boolean;
  onOpenAdmin: () => void;
}

export default function Workshops({ workshops, isLoading, onBookWorkshop, isCustomUrl, onOpenAdmin }: WorkshopsProps) {
  const [filter, setFilter] = useState<'all' | 'morning' | 'afternoon'>('all');

  // Filter items based on availability of slots
  const filteredWorkshops = workshops.filter((ws) => {
    if (filter === 'morning') return ws.morningSlot && ws.morningSlot !== 'Not Available';
    if (filter === 'afternoon') return ws.afternoonSlot && ws.afternoonSlot !== 'Not Available';
    return true;
  });

  const formatDate = (dateString: string) => {
    try {
      if (dateString === 'TBA') return 'Date to be Announced';
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return dateString; // Fallback to raw string
      
      const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      return d.toLocaleDateString('en-IN', options);
    } catch {
      return dateString;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Render Skeleton Placeholders while reading Google Sheets or code
  const renderSkeletons = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[1, 2, 3].map((n) => (
        <div key={n} className="bg-brand-parchment rounded-xl overflow-hidden border border-brand-earth/5 animate-pulse">
          <div className="h-56 bg-brand-earth/5 w-full" />
          <div className="p-6 md:p-8 space-y-4">
            <div className="h-4 bg-brand-earth/20 rounded w-1/3" />
            <div className="h-6 bg-brand-earth/15 rounded w-3/4" />
            <div className="h-12 bg-brand-earth/10 rounded w-full" />
            <div className="space-y-2 pt-4">
              <div className="h-4 bg-brand-earth/10 rounded w-1/2" />
              <div className="h-4 bg-brand-earth/10 rounded w-2/3" />
            </div>
            <div className="h-10 bg-brand-earth/20 rounded w-full pt-4" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <section id="workshops" className="py-20 md:py-28 bg-brand-parchment scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Title Block with dynamic badge */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-mono tracking-widest text-brand-terracotta uppercase font-bold block mb-3">
              RESERVE YOUR WHEEL
            </span>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="font-serif text-3xl sm:text-4xl tracking-tight text-brand-earth font-semibold">
                Upcoming Clay Workshops
              </h2>
            </div>
            <p className="font-sans text-brand-earth/70 text-sm mt-3 max-w-2xl">
              We host single-session weekend pottery classes. Scroll and select a theme that calls out to you, pick your preferred morning or afternoon slot, and book under 60 seconds!
            </p>
          </div>

          {/* Filtering buttons */}
          <div className="flex items-center gap-2 border border-brand-earth/10 bg-brand-sand/60 p-1 rounded-lg shrink-0 w-fit self-start md:self-end">
            <div className="p-1.5 text-brand-earth/50">
              <Filter className="w-3.5 h-3.5" />
            </div>
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-xs font-sans font-medium rounded transition-all cursor-pointer ${
                filter === 'all'
                  ? 'bg-brand-earth text-brand-sand shadow-sm'
                  : 'text-brand-earth/70 hover:text-brand-earth hover:bg-brand-earth/5'
              }`}
            >
              All Slots
            </button>
            <button
              onClick={() => setFilter('morning')}
              className={`px-3 py-1.5 text-xs font-sans font-medium rounded transition-all cursor-pointer ${
                filter === 'morning'
                  ? 'bg-brand-earth text-brand-sand shadow-sm'
                  : 'text-brand-earth/70 hover:text-brand-earth hover:bg-brand-earth/5'
              }`}
            >
              Morning Slots
            </button>
            <button
              onClick={() => setFilter('afternoon')}
              className={`px-3 py-1.5 text-xs font-sans font-medium rounded transition-all cursor-pointer ${
                filter === 'afternoon'
                  ? 'bg-brand-earth text-brand-sand shadow-sm'
                  : 'text-brand-earth/70 hover:text-brand-earth hover:bg-brand-earth/5'
              }`}
            >
              Afternoon Slots
            </button>
          </div>
        </div>

        {/* Content Body Grid */}
        {isLoading ? (
          renderSkeletons()
        ) : filteredWorkshops.length === 0 ? (
          <div className="bg-brand-bento-card border border-brand-bento-border rounded-[32px] p-12 text-center max-w-2xl mx-auto flex flex-col items-center shadow-xs">
            <CircleAlert className="w-12 h-12 text-brand-terracotta mb-4" />
            <h3 className="font-serif text-xl text-brand-earth font-bold mb-3">No Workshops Available</h3>
            <p className="font-sans text-brand-meta text-sm mb-6 max-w-md">
              There are no upcoming workshops found matching the selected slot filter. If you are the studio owner, connect or update your Google Sheet list to add workshops.
            </p>
            {!isCustomUrl && (
              <button
                onClick={onOpenAdmin}
                id="no-workshops-setup-btn"
                className="bg-brand-terracotta hover:bg-brand-earth text-brand-sand text-xs font-mono uppercase tracking-widest font-bold px-6 py-3 rounded-full transition-colors cursor-pointer"
              >
                Setup Sheets Connection
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkshops.map((ws) => {
              const isOnlyFewSeatsLeft = ws.availableSeats > 0 && ws.availableSeats <= 3;
              const isFullyBooked = ws.availableSeats <= 0;
              
              return (
                <div
                  key={ws.id}
                  id={`workshop-card-${ws.id}`}
                  className="bg-brand-bento-card rounded-[32px] overflow-hidden border border-brand-bento-border p-3 hover:shadow-md transition-all duration-300 flex flex-col h-full group"
                >
                  {/* Image and badges overlay */}
                  <div className="h-52 relative rounded-[24px] overflow-hidden bg-brand-earth/5 shrink-0">
                    <img
                      src={ws.image}
                      alt={ws.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    
                    {/* Status seat badge indicator */}
                    <div className="absolute top-4 left-4 z-10">
                      {isFullyBooked ? (
                        <span className="bg-brand-earth/95 text-brand-sand border border-white/10 text-[9px] uppercase tracking-widest font-mono font-bold px-3 py-1.5 rounded-lg shadow-sm">
                          FULLY BOOKED
                        </span>
                      ) : isOnlyFewSeatsLeft ? (
                        <span className="bg-rose-600 text-white animate-pulse text-[9px] uppercase tracking-widest font-mono font-bold px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5">
                          <CircleAlert className="w-3 h-3" />
                          <span>Only {ws.availableSeats} seats left</span>
                        </span>
                      ) : (
                        <span className="bg-emerald-600 text-white text-[9px] uppercase tracking-widest font-mono font-bold px-3 py-1.5 rounded-lg shadow-sm">
                          {ws.availableSeats} Seats Left
                        </span>
                      )}
                    </div>

                    {/* Cost pricing badge overlay */}
                    <div className="absolute bottom-4 right-4 bg-brand-earth/90 backdrop-blur-xs text-white px-3 py-1.5 font-bold font-sans text-xs rounded-lg border border-white/5 shadow-md">
                      {formatPrice(ws.price)}
                    </div>
                  </div>

                  {/* Body textual block */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Date details */}
                      <div className="flex items-center gap-1.5 text-brand-terracotta font-mono font-bold text-[10px] uppercase tracking-wider mb-2.5">
                        <Calendar className="w-3.5 h-3.5 text-brand-clay" />
                        <span>{formatDate(ws.date)}</span>
                      </div>

                      {/* Title */}
                      <h3 className="font-serif text-lg text-brand-earth font-bold tracking-tight mb-2 group-hover:text-brand-terracotta transition-colors leading-snug">
                        {ws.title}
                      </h3>

                      {/* Description */}
                      <p className="font-sans text-brand-meta text-xs leading-relaxed mb-6 line-clamp-3">
                        {ws.description}
                      </p>
                    </div>

                    <div>
                      {/* Time Slots display */}
                      <div className="border-t border-[#f0ede6] pt-4 space-y-2 mb-6">
                        <span className="text-[9px] font-mono uppercase tracking-[0.15em] text-brand-meta font-bold block mb-2">TIMINGS:</span>
                        
                        {ws.morningSlot && ws.morningSlot !== 'Not Available' && (
                          <div className="flex items-center justify-between text-xs text-brand-earth/80 font-sans">
                            <span className="font-bold text-[10px] tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">Morning</span>
                            <span className="text-[11px] text-brand-meta font-medium">{ws.morningSlot}</span>
                          </div>
                        )}

                        {ws.afternoonSlot && ws.afternoonSlot !== 'Not Available' && (
                          <div className="flex items-center justify-between text-xs text-brand-earth/80 font-sans mt-2">
                            <span className="font-bold text-[10px] tracking-wider text-brand-clay bg-brand-clay/10 px-2 py-0.5 rounded border border-brand-clay/20">Afternoon</span>
                            <span className="text-[11px] text-brand-meta font-medium">{ws.afternoonSlot}</span>
                          </div>
                        )}
                      </div>

                      {/* Main Booking Button */}
                      {isFullyBooked ? (
                        <div className="space-y-2.5">
                          <p id={`fully-booked-info-${ws.id}`} className="text-center text-xs font-sans text-amber-800 bg-amber-50 border border-amber-200/50 py-2.5 rounded-xl font-medium">
                            This workshop is fully booked.
                          </p>
                          <button
                            onClick={() => onBookWorkshop(ws)}
                            id={`waitlist-btn-${ws.id}`}
                            className="w-full bg-brand-clay hover:bg-brand-earth text-white font-mono text-[10px] tracking-widest uppercase font-bold py-3.5 rounded-full shadow-xs hover:shadow-md transition-all cursor-pointer text-center block"
                          >
                            Join Waitlist
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => onBookWorkshop(ws)}
                          id={`book-btn-${ws.id}`}
                          className="w-full bg-brand-terracotta hover:bg-brand-earth text-white font-mono text-[10px] tracking-widest uppercase font-bold py-3.5 rounded-full shadow-xs hover:shadow-md transition-all cursor-pointer text-center"
                        >
                          Book Your Spot
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
