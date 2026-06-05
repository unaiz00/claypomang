/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { GalleryItem } from '../types';

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('all');

  const galleryItems: GalleryItem[] = [
    {
      id: 'g-1',
      title: 'Sienna Splatter Espresso Mug',
      category: 'Glazed Ceramics',
      image: 'https://images.unsplash.com/photo-1535401991746-da3d9055713e?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 'g-2',
      title: 'Minimally Center-Thrown Earth Bowl',
      category: 'Wheel-Thrown',
      image: 'card_image.png'
    },
    {
      id: 'g-3',
      title: 'Structured Coiling Clay Pitcher',
      category: 'Handbuilt',
      image: 'card_image.png'
    },
    {
      id: 'g-4',
      title: 'Ocean Blue Speckled Dinnerware Set',
      category: 'Glazed Ceramics',
      image: 'card_image.png'
    },
    {
      id: 'g-5',
      title: 'Textured Slab Succulent Pots',
      category: 'Handbuilt',
      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 'g-6',
      title: 'Traditional Terracotta Glazed Incense Trays',
      category: 'Wheel-Thrown',
      image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=600'
    }
  ];

  const categories = ['all', 'Wheel-Thrown', 'Handbuilt', 'Glazed Ceramics'];

  const filteredItems = activeCategory === 'all'
    ? galleryItems
    : galleryItems.filter(item => item.category === activeCategory);

  return (
    <section id="gallery" className="py-16 bg-brand-sand">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Gallery Title Area */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-mono tracking-widest text-brand-terracotta uppercase font-bold block mb-3">
              KILN-FIRED CREATIONS
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl tracking-tight text-brand-earth font-semibold">
              The Clay & Craft Studio Gallery
            </h2>
            <p className="font-sans text-brand-meta text-sm mt-3 max-w-xl leading-relaxed">
              Take a look at real beautiful creations shaped, carved, and coated by students and workshop participants in our Mangalore studio. You will make something just as beautiful!
            </p>
          </div>

          {/* Categories Tab selector */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-[10px] tracking-widest uppercase font-mono font-bold border transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-brand-earth text-brand-sand border-brand-earth'
                    : 'bg-white text-brand-meta border-[#eee8df] hover:border-brand-clay hover:text-brand-terracotta'
                }`}
              >
                {cat === 'all' ? 'View All' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Masonry Items Display Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group relative h-80 bg-brand-earth/5 overflow-hidden rounded-[32px] border border-brand-bento-border p-2.5 bg-white shadow-xs hover:shadow-md transition-all duration-300"
            >
              <div className="w-full h-full rounded-[24px] overflow-hidden relative">
                <img
                  src={item.image}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Overlay card descriptor appearing on desktop hover, permanently available on mobile touch */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-earth via-brand-earth/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-brand-ochre font-bold">
                    {item.category}
                  </span>
                  <h4 className="font-serif text-lg text-white font-bold tracking-tight mt-1 leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-white/60 text-[11px] font-sans mt-1">
                    Crafted by a first-time student during our weekend sessions.
                  </p>
                </div>

                {/* Minimalist Mobile Tag Indicator (Hidden on LG hover) */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-lg text-[9px] uppercase tracking-widest font-mono font-bold text-brand-terracotta lg:group-hover:hidden shadow-xs border border-brand-bento-border">
                  {item.category}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
