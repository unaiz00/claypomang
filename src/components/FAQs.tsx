/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { FAQItem } from '../types';

export default function FAQs() {
  const [openId, setOpenId] = useState<string | null>(null);

  const faqs: FAQItem[] = [
    {
      id: 'faq-1',
      question: 'Do I need any prior painting or sculpting experience to join a workshop?',
      answer: 'Absolutely not! Around 90% of our weekend workshop attendees are touching raw potting clay for the very first time. Our expert studio tutors guide you side-by-side with close, supportive hand instructions, so you easily complete at least 1-2 beautiful ceramic bowls or mugs.'
    },
    {
      id: 'faq-2',
      question: 'What is the dress code? Does pottery clay permanent stain clothes?',
      answer: 'We recommend comfortable casual clothes and flat shoes. Clay is water-soluble (especially our local Mangalore red tile clay) and washes out 100% in a normal laundry cycle. We also provide full-length protective cotton aprons. *Incredibly Important Tip:* We highly suggest trimming your fingernails short, as long nails make centering or pulling clay on the potter\'s wheel tricky!'
    },
    {
      id: 'faq-3',
      question: 'How and when do we pick up our finished pottery pieces?',
      answer: 'Your wet clay creations must air-dry slowly for 7-10 days to avoid structural clay cracks. They then receive a 950°C bisque fire. Following that, we apply your chosen studio glazes by hand, and fire them once more at 1220°C in our high-kiln chamber. Your final, premium kitchen-safe glazed cups/bowls will be ready for self-pickup or courier shipment within 14–21 days!'
    },
    {
      id: 'faq-4',
      question: 'Is there an age limit for clay workshops and classes?',
      answer: 'For our Handbuilding and Slab Clay shaping workshops, anyone aged 8 and above can participate! For potter\'s wheel throwing workshops, we recommend a minimum age of 12 years, as physical weight coordination is helpful to center clay on rotating steel heads.'
    },
    {
      id: 'faq-5',
      question: 'How do I change, reschedule, or cancel my booked workshop slot?',
      answer: 'No monthly maintenance fees mean we keep booking fully flexible! If you need to reschedule, simply message us directly on WhatsApp at 7907974566 at least 48 hours before your slot, and we will happily move you to any available slate at zero charge. Cancellations within 48 hours are non-refundable.'
    }
  ];

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faqs" className="py-16 bg-brand-parchment relative">
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-brand-clay/3 blur-3xl pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        {/* Header Block */}
        <div className="text-center max-w-2xl mx-auto mb-12 flex flex-col items-center">
          <HelpCircle className="w-8 h-8 text-brand-clay mb-4" />
          <span className="text-xs font-mono tracking-widest text-brand-terracotta uppercase font-bold block mb-2">
            HAVE QUESTIONS?
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl tracking-tight text-brand-earth font-semibold">
            Insights & FAQs
          </h2>
          <p className="font-sans text-brand-meta text-sm mt-3 leading-relaxed">
            Everything you need to know about setting up your nails, dress codes, pick-up timelines, and the therapeutic clay transformation process at our studio in Mangalore.
          </p>
        </div>

        {/* FAQs Accordion Accord listings */}
        <div className="space-y-3">
          {faqs.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className="bg-brand-bento-card rounded-[24px] border border-brand-bento-border overflow-hidden shadow-xs hover:border-brand-clay/15 transition-all duration-300"
              >
                {/* Trigger head */}
                <button
                  onClick={() => toggleFaq(item.id)}
                  id={`faq-trigger-${item.id}`}
                  className="w-full py-5 px-6 md:px-8 text-left font-serif text-brand-earth font-bold text-sm sm:text-base flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="leading-snug">{item.question}</span>
                  <span className="shrink-0 p-1 rounded-full bg-brand-sand/50 text-brand-terracotta transition-colors">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </span>
                </button>

                {/* Body Content */}
                <div
                  className={`transition-all duration-300 overflow-hidden ${
                    isOpen ? 'max-h-[500px] opacity-100 border-t border-brand-earth/5 bg-brand-sand/15' : 'max-h-0 opacity-0 pointer-events-none'
                  }`}
                >
                  <div className="p-6 md:p-8 font-sans text-brand-earth/75 text-xs sm:text-sm leading-relaxed">
                    {item.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
