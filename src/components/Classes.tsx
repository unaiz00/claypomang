/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Users, Hourglass, HelpCircle, ArrowUpRight } from 'lucide-react';

export default function Classes() {
  const classesList = [
    {
      title: 'Beginner’s Wheel Throwing (4-Week Course)',
      meta: '4 Sessions • 2.5 Hrs Each • Weekend batches',
      price: '₹6,500',
      description: 'Our flagship foundational pottery course. You will progress from raw centering to independent throwing of cups, bowls, cylindrical vases, and master structural bottom trimming and glaze coats.',
      iconText: '4W',
      bgImg: 'card_image.png'
    },
    {
      title: 'Earthy Slab & Handbuilding (4-Week Course)',
      meta: '4 Sessions • 2 Hrs Each • Weekday batches',
      price: '₹5,500',
      description: 'No wheel required. Harness traditional pinching and coiling to construct beautiful dinnerware plates, textured mugs, succulent planters, and wall carvings with customized slip decoration.',
      iconText: '4H',
      bgImg: 'card_image.png'
    },
    {
      title: 'Private Couples / Friends Pottery Session',
      meta: 'Single Session • 2 Hrs • Flexible Scheduling',
      price: '₹3,500 per couple',
      description: 'An intimate, immersive romantic date or friends outing. Enjoy a private tutor directing two wheels. Throw two functional clay bowls each and select customizable studio glazes.',
      iconText: '1P',
      bgImg: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=600'
    }
  ];

  return (
    <section id="classes" className="py-16 bg-brand-sand relative"> {/* exact brand-sand from design */}
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-brand-ochre/5 blur-3xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Header Block */}
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-mono tracking-widest text-brand-terracotta uppercase font-bold block mb-3">
            STRUCTURED LEARNING PATHS
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl tracking-tight text-brand-earth font-semibold mb-4">
            Our Regular Pottery & Clay Sculpting Classes
          </h2>
          <p className="font-sans text-brand-meta text-sm leading-relaxed">
            While our one-off weekend workshops are perfect for a playful, creative single session, our structured 4-week regular courses are designed for clay enthusiasts based in Mangalore who wish to truly master the potter’s wheel and advanced glazing techniques.
          </p>
        </div>

        {/* Classes Multi Grid (3 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {classesList.map((item, idx) => (
            <div
              key={idx}
              className="bg-brand-bento-card rounded-[32px] overflow-hidden border border-brand-bento-border p-3 hover:shadow-md transition-all duration-300 flex flex-col group h-full"
            >
              {/* Dynamic Image frame */}
              <div className="h-48 relative rounded-[24px] overflow-hidden bg-brand-earth/10">
                <img
                  src={item.bgImg}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Meta price tag overlay */}
                <div className="absolute top-4 right-4 bg-brand-earth/90 backdrop-blur-xs text-brand-sand px-3 py-1.5 text-xs font-sans font-bold rounded-lg border border-white/10">
                  {item.price}
                </div>

                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold tracking-widest text-brand-terracotta border border-brand-bento-border">
                  {item.meta}
                </div>
              </div>

              {/* Descriptions body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-lg text-brand-earth font-bold mb-3 leading-snug group-hover:text-brand-terracotta transition-colors">
                    {item.title}
                  </h3>
                  <p className="font-sans text-brand-meta text-xs leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                {/* Arrow up right links info */}
                <div className="border-t border-[#f0ede6] pt-4 flex items-center justify-between mt-auto">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-brand-meta/75">Includes firing + materials</span>
                  <a
                    href="https://wa.me/917907974566"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-brand-terracotta font-bold hover:text-brand-earth transition-colors"
                  >
                    <span>Enquire</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info bento callout block */}
        <div className="bg-brand-bento-card border border-brand-bento-border rounded-[32px] p-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 shadow-xs">
          <div className="flex gap-4 items-start">
            <div className="p-3 bg-[#faf9f6] text-brand-terracotta rounded-2xl h-fit border border-[#f0ede6]">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-base font-bold text-brand-earth mb-1">
                Unsure which learning format fits your schedule?
              </h4>
              <p className="font-sans text-brand-meta text-xs leading-relaxed max-w-xl">
                Single-session workshops are perfect if you want to experiment, try clay throwing, or create an organic handmade gift. Dynamic 4-week regular courses provide advanced technical centering and glazing mechanics.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              const el = document.getElementById('workshops');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="whitespace-nowrap bg-brand-earth hover:bg-brand-terracotta text-brand-sand px-6 py-3.5 text-xs font-mono uppercase font-bold rounded-full tracking-wider transition-colors cursor-pointer self-start md:self-auto"
          >
            Browse Single Workshops
          </button>
        </div>

      </div>
    </section>
  );
}
