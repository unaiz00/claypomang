/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MapPin, Phone, Mail, Clock, MessageSquare, Compass } from 'lucide-react';

export default function Contact() {
  const contacts = [
    {
      icon: MapPin,
      title: 'Studio Address',
      details: 'Villa #14, Kadri Hills Compound, Behind Kadri Temple Road, Kadri Hills, Mangalore, Karnataka 575003',
      linkText: 'Open in Google Maps',
      linkUrl: 'https://maps.google.com/?q=Kadri+Hills,+Mangalore,+Karnataka,+India'
    },
    {
      icon: Phone,
      title: 'Phone Bookings',
      details: '+91 7907974566',
      linkText: 'Call Studio Coordinator',
      linkUrl: 'tel:7907974566'
    },
    {
      icon: Mail,
      title: 'Email Correspondence',
      details: 'coordinator@claycraftstudio.com',
      linkText: 'Send Email Enquiries',
      linkUrl: 'mailto:coordinator@claycraftstudio.com'
    },
    {
      icon: Clock,
      title: 'Hours of Operation',
      details: 'Tuesday - Sunday: 9:30 AM - 6:30 PM (Mondays Closed for Kiln Maintenance)',
      linkText: 'Closed on Mondays',
      linkUrl: '#'
    }
  ];

  return (
    <section id="contact" className="py-16 bg-brand-sand relative scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Core Header */}
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-mono tracking-widest text-brand-terracotta uppercase font-bold block mb-3">
            GET IN TOUCH WITH CLAY
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl tracking-tight text-brand-earth font-semibold mb-6">
            Visit Our Boutique Creative Workspace
          </h2>
          <p className="font-sans text-brand-meta text-sm md:text-base leading-relaxed">
            Find us tucked away in the serene, verdant hills of Kadri, Mangalore. Our garden-view studio provides a quiet, therapeutic atmosphere away from the bustle of the coastal metropolis, ideal for centering raw clay on the spinner.
          </p>
        </div>

        {/* Info contact split container layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          
          {/* Card List of contacts info - Left Column */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {contacts.map((c, index) => (
                <div
                  key={index}
                  className="bg-brand-bento-card border border-brand-bento-border p-6 rounded-[32px] relative overflow-hidden flex flex-col justify-between hover:shadow-md transition-all duration-300"
                >
                  <div>
                    {/* Circle icon frame */}
                    <div className="p-3 bg-brand-clay/10 text-brand-terracotta rounded-full h-fit w-fit mb-4">
                      <c.icon className="w-4 h-4" />
                    </div>
                    
                    <h3 className="font-sans font-bold text-brand-earth text-sm mb-1">{c.title}</h3>
                    <p className="font-sans text-brand-meta text-[11px] leading-relaxed mb-4">{c.details}</p>
                  </div>

                  {c.linkUrl !== '#' && (
                    <a
                      href={c.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-terracotta hover:text-brand-terracotta-hover font-sans text-xs font-semibold cursor-pointer underline flex items-center gap-1"
                    >
                      {c.linkText}
                    </a>
                  )}
                </div>
              ))}
            </div>

            {/* Live WhatsApp Floating Assist Box */}
            <div className="bg-brand-earth text-brand-sand p-6 rounded-[32px] border border-brand-clay/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex gap-4 items-center">
                <div className="p-3 bg-brand-clay/20 text-brand-ochre rounded-full shrink-0">
                  <MessageSquare className="w-6 h-6 fill-brand-ochre text-brand-earth" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-brand-sand leading-none">Instant WhatsApp Assistance</h4>
                  <p className="font-sans text-brand-sand/65 text-xs leading-normal mt-1.5">
                    Have any questions? Drop us a bubble message, and we will get back to you!
                  </p>
                </div>
              </div>
              <a
                href="https://wa.me/917907974566"
                target="_blank"
                rel="noopener noreferrer"
                className="whitespace-nowrap bg-brand-terracotta hover:bg-brand-terracotta-hover text-brand-sand px-5 py-3 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest transition-colors inline-block"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* Map display iframe - Right Column */}
          <div className="relative rounded-[32px] overflow-hidden shadow-xs border border-brand-bento-border h-[400px] lg:h-auto min-h-[350px] bg-brand-earth/5 p-2 bg-white">
            <div className="w-full h-full rounded-[24px] overflow-hidden relative">
              <iframe
                title="Clay & Craft Pottery Studio Address Pointer Map"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer"
                src="https://maps.google.com/maps?q=Kadri%20Hills,%20Mangalore,%20India&t=&z=14&ie=UTF8&iwloc=&output=embed"
                className="absolute inset-0"
              />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
