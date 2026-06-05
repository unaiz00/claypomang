/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Compass, ShieldCheck, HeartPulse, Award } from 'lucide-react';

export default function About() {
  const highlights = [
    {
      icon: Compass,
      title: 'Heritage Mangalore Clay',
      desc: 'We use premium, organic, mineral-rich red pottery clay sourced directly from local river beds on the outskirts of Mangalore.'
    },
    {
      icon: ShieldCheck,
      title: 'Boutique Class Sizes',
      desc: 'To maximize individual instruction, we limit all pottery workshops and courses to a maximum of 6–12 seats.'
    },
    {
      icon: HeartPulse,
      title: 'Mindful Clay Therapy',
      desc: 'Working raw clay on the spinning wheel is a deeply meditative tactile practice that relieves tension and anxiety.'
    },
    {
      icon: Award,
      title: 'Artisanal Kiln Firing',
      desc: 'All crafted wares undergo professional double-kiln firing (bisque and 1220°C glazing) so they are oven, microwave, and dishwasher safe.'
    }
  ];

  return (
    <section id="about" className="py-16 bg-brand-parchment">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Studio Ambiance - Left Side Bento-Frame (5 Cols) */}
          <div className="lg:col-span-5 relative rounded-[32px] overflow-hidden min-h-[400px] shadow-sm border border-brand-bento-border group">
            <img
              src="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=800"
              alt="Cozy interior of Clay & Craft pottery workshop in Mangalore with rustic wooden benches"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            
            {/* Elegant Floating Stat Badge overlay in the bento layout */}
            <div className="absolute bottom-6 left-6 right-6 bg-brand-earth/95 backdrop-blur-md text-brand-sand p-6 rounded-[24px] shadow-xl border border-white/10">
              <span className="font-serif text-3xl font-bold tracking-tight text-brand-ochre">100%</span>
              <span className="text-[10px] font-mono uppercase tracking-widest block mt-1 text-white/90">
                Natural Materials
              </span>
              <p className="text-xs text-brand-sand/70 leading-normal mt-1.5 font-sans">
                No chemical additives, pure organic coastal therapeutic clay.
              </p>
            </div>
          </div>

          {/* Core Studio Story and Highlights - Right Side Bento (7 Cols) */}
          <div className="lg:col-span-7 bg-brand-bento-card rounded-[32px] border border-brand-bento-border p-8 md:p-12 flex flex-col justify-between shadow-xs hover:shadow-md transition-all">
            <div>
              <span className="text-xs font-mono tracking-widest text-brand-terracotta uppercase font-bold block mb-3">
                OUR CREATIVE SANCTUARY
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl tracking-tight text-brand-earth font-semibold mb-6">
                Vibrant Potter’s Wheel in the Heart of Coastal Mangalore
              </h2>
              
              <p className="font-sans text-brand-earth/80 text-sm leading-relaxed mb-6">
                Clay & Craft Studio was born out of a profound passion to preserve the delicate, ancient, tactile craftsmanship of earthwork. In a hyper-digital era, we invite you to unplug your mind, roll up your sleeves, and experience the pure physical joy of shaping raw earth.
              </p>
              <p className="font-sans text-brand-earth/70 text-sm leading-relaxed mb-8">
                Set in a peaceful garden setting in Mangalore, our boutique pottery studio provides professional pottery equipment, individual high-performance wheels, and fine liquid glazes.
              </p>
            </div>

            {/* Subtle bento grids for studio features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {highlights.map((item, index) => (
                <div key={index} className="p-4 rounded-2xl bg-[#faf9f6] border border-[#f0ede6] flex gap-3 h-full">
                  <div className="p-2 bg-brand-clay/15 text-brand-terracotta rounded-xl h-fit shrink-0">
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-sans font-semibold text-brand-earth text-xs mb-1">
                      {item.title}
                    </h3>
                    <p className="font-sans text-brand-meta text-[11px] leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
