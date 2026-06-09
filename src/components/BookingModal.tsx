/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Calendar, Clock, Sparkles, CheckCircle, MessageCircle, AlertCircle } from 'lucide-react';
import { Workshop, Booking } from '../types';

interface BookingModalProps {
  workshop: Workshop | null;
  onClose: () => void;
  onSubmitBooking: (bookingData: Omit<Booking, 'id' | 'timestamp' | 'status'> & { status?: 'pending' | 'waitlist' }) => Promise<{ success: boolean; message: string }>;
}

export default function BookingModal({ workshop, onClose, onSubmitBooking }: BookingModalProps) {
  const [selectedSlot, setSelectedSlot] = useState<'morning' | 'afternoon' | 'none'>('none');
  const [name, setName] = useState(() => {
    try {
      const draft = localStorage.getItem('clay_draft_booking_name');
      return draft || '';
    } catch {
      return '';
    }
  });
  const [phone, setPhone] = useState(() => {
    try {
      const draft = localStorage.getItem('clay_draft_booking_phone');
      return draft || '';
    } catch {
      return '';
    }
  });
  const [email, setEmail] = useState(() => {
    try {
      const draft = localStorage.getItem('clay_draft_booking_email');
      return draft || '';
    } catch {
      return '';
    }
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [bookingResult, setBookingResult] = useState<{ success: boolean; whatsappUrl: string } | null>(null);

  // Sync draft variables to localStorage on every keystroke
  React.useEffect(() => {
    try {
      localStorage.setItem('clay_draft_booking_name', name);
    } catch (e) {}
  }, [name]);

  React.useEffect(() => {
    try {
      localStorage.setItem('clay_draft_booking_phone', phone);
    } catch (e) {}
  }, [phone]);

  React.useEffect(() => {
    try {
      localStorage.setItem('clay_draft_booking_email', email);
    } catch (e) {}
  }, [email]);

  if (!workshop) return null;

  const isNotAvailable = (slot: string | undefined | null) => {
    if (!slot) return true;
    const s = slot.trim().toLowerCase();
    return s === '' || s === 'not available' || s === 'n/a' || s === 'na' || s === 'none' || s === 'null' || s === 'no' || s === 'false';
  };

  const isMorningAvailable = workshop.morningSlot && !isNotAvailable(workshop.morningSlot);
  const isAfternoonAvailable = workshop.afternoonSlot && !isNotAvailable(workshop.afternoonSlot);

  const isSelectedSlotFull = selectedSlot === 'none'
    ? workshop.availableSeats <= 0
    : (selectedSlot === 'morning' 
       ? (workshop.morningAvailableSeats ?? 0) <= 0 
       : (workshop.afternoonAvailableSeats ?? 0) <= 0);

  // Automatically select the only available slot if only one exists
  React.useEffect(() => {
    if (isMorningAvailable && !isAfternoonAvailable) {
      setSelectedSlot('morning');
    } else if (!isMorningAvailable && isAfternoonAvailable) {
      setSelectedSlot('afternoon');
    } else {
      setSelectedSlot('none');
    }
  }, [workshop, isMorningAvailable, isAfternoonAvailable]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (selectedSlot === 'none') {
      setErrorMsg('Please select a workshop time slot to continue.');
      return;
    }

    if (!name.trim() || !phone.trim() || !email.trim()) {
      setErrorMsg('Please fill in all requested fields.');
      return;
    }

    // Phone validation
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit phone number.');
      return;
    }

    setIsSubmitting(true);

    try {
      const slotTime = selectedSlot === 'morning' ? workshop.morningSlot : workshop.afternoonSlot;
      
      const payload = {
        workshopId: workshop.id,
        workshopTitle: workshop.title,
        workshopDate: workshop.date,
        slot: selectedSlot as 'morning' | 'afternoon',
        slotTime: slotTime,
        userName: name,
        userPhone: phone,
        userEmail: email,
        price: workshop.price,
        date: workshop.date,
        status: (isSelectedSlotFull ? 'waitlist' : 'pending') as 'pending' | 'waitlist'
      };

      const result = await onSubmitBooking(payload);
      
      if (result.success) {
        setBookingResult({
          success: true,
          whatsappUrl: result.message
        });
        
        // Purge temporary booking form drafts from localStorage upon registration
        try {
          localStorage.removeItem('clay_draft_booking_name');
          localStorage.removeItem('clay_draft_booking_phone');
          localStorage.removeItem('clay_draft_booking_email');
        } catch (e) {}
      } else {
        setErrorMsg('Booking write failed. Please contact us directly at 7907974566.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg('A temporary issue occurred. Kindly click the WhatsApp button on bottom instead.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark overlay backdrop */}
      <div 
        onClick={onClose}
        onKeyDown={(e) => { if (e.key === 'Escape') onClose(); }}
        role="button"
        tabIndex={0}
        id="modal-backdrop"
        className="absolute inset-0 bg-brand-earth/60 backdrop-blur-xs transition-opacity animate-fade-in"
        aria-label="Close booking details dialog"
      />

      {/* Main Container Content */}
      <div 
        id="modal-body"
        className="bg-brand-parchment w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl relative z-10 border border-brand-earth/10 flex flex-col max-h-[90vh]"
      >
        {/* Header toolbar */}
        <div className="p-5 md:p-6 border-b border-brand-earth/10 flex items-center justify-between bg-brand-sand">
          <div className="flex flex-col">
            <span className="text-[10px] font-mono uppercase tracking-widest text-brand-terracotta font-bold">
              Secure Checkout Room
            </span>
            <h3 className="font-serif text-lg text-brand-earth font-bold mt-0.5">
              {bookingResult 
                ? (isSelectedSlotFull ? 'Waitlist Registration Saved!' : 'Booking Confirmed!') 
                : (isSelectedSlotFull ? 'Join the Guest Waitlist' : 'Book Your Session')}
            </h3>
          </div>
          
          <button
            onClick={onClose}
            id="close-modal-btn"
            className="p-1.5 rounded-full hover:bg-brand-earth/5 text-brand-earth/60 hover:text-brand-earth transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Core Body */}
        <div className="overflow-y-auto p-6 md:p-8 flex-1">
          
          {bookingResult ? (
            /* ================= CONFIRMATION SCREEN ================= */
            <div className="text-center py-6 animate-scale-up flex flex-col items-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6 border border-emerald-200">
                <CheckCircle className="w-10 h-10 text-emerald-600" />
              </div>

              <h4 className="font-serif text-2xl text-brand-earth font-bold tracking-tight mb-3">
                Your Clay Wheel is Saved!
              </h4>
              <p className="font-sans text-brand-earth/70 text-sm max-w-md leading-relaxed mb-8">
                Your raw booking entry was successfully compiled into Google Sheets. To complete payment confirmation, verify availability, and secure your materials, please click below to send your reservation directly to our coordinator on WhatsApp.
              </p>

              {/* Dynamic booked summary card */}
              <div className="bg-brand-sand/70 rounded-xl p-5 border border-brand-clay/15 text-left w-full mb-8">
                <div className="font-sans font-bold text-brand-earth text-sm border-b border-brand-earth/10 pb-2 mb-3">
                  Reservation Ticket Summary
                </div>
                
                <div className="space-y-2 font-sans text-xs">
                  <div className="flex justify-between">
                    <span className="text-brand-earth/50">Workshop:</span>
                    <span className="font-semibold text-brand-earth">{workshop.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-earth/50">Date:</span>
                    <span className="font-semibold text-brand-earth">{workshop.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-earth/50">Chosen Slot:</span>
                    <span className="font-semibold text-brand-earth capitalize">{selectedSlot} Slot</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-earth/50">Time Frame:</span>
                    <span className="font-semibold text-brand-earth">
                      {selectedSlot === 'morning' ? workshop.morningSlot : workshop.afternoonSlot}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-brand-earth/10 pt-2 mt-2">
                    <span className="text-brand-earth/50 font-bold">Price:</span>
                    <span className="font-bold text-brand-terracotta">{formatPrice(workshop.price)}</span>
                  </div>
                </div>
              </div>

              {/* Major Actionable buttons */}
              <div className="w-full flex flex-col gap-3">
                <a
                  href={bookingResult.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="modal-send-whatsapp-btn"
                  className="w-full py-4 px-6 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-sans font-medium text-sm tracking-widest uppercase flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                >
                  <MessageCircle className="w-4 h-4 fill-white text-emerald-600 border-none" />
                  <span>Send Confirmation Message</span>
                </a>

                <button
                  onClick={onClose}
                  id="modal-finish-close-btn"
                  className="w-full py-3.5 px-6 rounded bg-transparent hover:bg-brand-earth/5 text-brand-earth/70 font-sans font-semibold text-xs tracking-wider uppercase transition-colors uppercase border border-brand-earth/10 cursor-pointer"
                >
                  Return to Website
                </button>
              </div>
            </div>
          ) : (
            /* ================= BOOKING FORM SCREEN ================= */
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {isSelectedSlotFull && (
                <div id="fully-booked-modal-warning" className="p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl space-y-1 text-xs">
                  <span className="font-bold flex items-center gap-1.5 uppercase tracking-wider font-mono">
                    ⚠️ {selectedSlot === 'none' ? 'This workshop is fully booked.' : 'This session slot is fully booked.'}
                  </span>
                  <p className="font-sans">
                    All of our standard potter's wheels for this slot are currently reserved. You may submit the form below to join our priority waitlist. We will contact you immediately if a spot opens up!
                  </p>
                </div>
              )}

              {/* Workshop Summary Card Top */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-brand-sand border border-brand-earth/5">
                <img
                  src={workshop.image}
                  alt={workshop.title}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded object-cover border border-brand-earth/10"
                />
                <div>
                  <h4 className="font-serif text-sm text-brand-earth font-bold leading-tight">{workshop.title}</h4>
                  <div className="flex items-center gap-1.5 font-mono text-[10px] text-brand-earth/50 uppercase tracking-wider mt-1.5">
                    <Calendar className="w-3 h-3 text-brand-clay" />
                    <span>{workshop.date}</span>
                  </div>
                  <span className="font-sans font-bold text-brand-terracotta text-xs block mt-1">
                    {formatPrice(workshop.price)} per attendee
                  </span>
                </div>
              </div>

              {/* Slot Toggles */}
              <div className="space-y-3">
                <label className="text-[11px] font-mono uppercase tracking-widest text-brand-earth/60 font-bold block">
                  Select Workshop Timing Slot
                </label>

                <div className="grid grid-cols-2 gap-4">
                  {/* Morning Option */}
                  <div
                    onClick={() => isMorningAvailable && setSelectedSlot('morning')}
                    className={`p-4 rounded-lg border-2 text-left cursor-pointer transition-all flex flex-col justify-between h-20 ${
                      !isMorningAvailable
                        ? 'bg-brand-earth/2 border-brand-earth/5 opacity-40 cursor-not-allowed'
                        : selectedSlot === 'morning'
                        ? 'border-brand-terracotta bg-brand-terracotta/5'
                        : 'border-brand-earth/10 bg-white hover:border-brand-earth/30'
                    }`}
                  >
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-earth flex items-center gap-1">
                      <Clock className="w-3 h-3 text-emerald-600" />
                      <span>Morning Slot</span>
                    </span>
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[10px] text-brand-earth/60 font-medium leading-none truncate max-w-[60%]">
                        {isMorningAvailable ? workshop.morningSlot : 'Not Available'}
                      </span>
                      {isMorningAvailable && (
                        <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded shrink-0 ${
                          (workshop.morningAvailableSeats ?? 0) <= 0 
                            ? 'text-amber-800 bg-amber-100/50' 
                            : 'text-emerald-800 bg-emerald-100/50'
                        }`}>
                          {(workshop.morningAvailableSeats ?? 0) <= 0 ? 'Waitlist' : `${workshop.morningAvailableSeats} spots`}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Afternoon Option */}
                  <div
                    onClick={() => isAfternoonAvailable && setSelectedSlot('afternoon')}
                    className={`p-4 rounded-lg border-2 text-left cursor-pointer transition-all flex flex-col justify-between h-20 ${
                      !isAfternoonAvailable
                        ? 'bg-brand-earth/2 border-brand-earth/4 opacity-40 cursor-not-allowed'
                        : selectedSlot === 'afternoon'
                        ? 'border-brand-terracotta bg-brand-terracotta/5'
                        : 'border-brand-earth/10 bg-white hover:border-brand-earth/30'
                    }`}
                  >
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-earth flex items-center gap-1">
                      <Clock className="w-3 h-3 text-brand-clay" />
                      <span>Afternoon Slot</span>
                    </span>
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[10px] text-brand-earth/60 font-medium leading-none truncate max-w-[60%]">
                        {isAfternoonAvailable ? workshop.afternoonSlot : 'Not Available'}
                      </span>
                      {isAfternoonAvailable && (
                        <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded shrink-0 ${
                          (workshop.afternoonAvailableSeats ?? 0) <= 0 
                            ? 'text-amber-800 bg-amber-100/50' 
                            : 'text-emerald-800 bg-emerald-100/50'
                        }`}>
                          {(workshop.afternoonAvailableSeats ?? 0) <= 0 ? 'Waitlist' : `${workshop.afternoonAvailableSeats} spots`}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Visitor Contact Fields */}
              <div className="space-y-4 pt-2">
                <label className="text-[11px] font-mono uppercase tracking-widest text-brand-earth/60 font-bold block border-b border-brand-earth/5 pb-1">
                  Your Personal Details
                </label>

                <div className="grid grid-cols-1 gap-4">
                  {/* Name field */}
                  <div>
                    <label htmlFor="user-name-input" className="text-[11px] font-sans font-medium text-brand-earth/60 block mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="user-name-input"
                      placeholder="e.g. Aditi Shetty"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full bg-white border border-brand-earth/15 outline-none focus:border-brand-terracotta px-4 py-3 rounded text-sm text-brand-earth font-sans transition-colors"
                    />
                  </div>

                  {/* Phone & Email Fields Side-By-Side */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="user-phone-input" className="text-[11px] font-sans font-medium text-brand-earth/60 block mb-1.5">
                        Phone Number (WhatsApp)
                      </label>
                      <input
                        type="tel"
                        id="user-phone-input"
                        placeholder="e.g. 9876543210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className="w-full bg-white border border-brand-earth/15 outline-none focus:border-brand-terracotta px-4 py-3 rounded text-sm text-brand-earth font-sans transition-colors"
                      />
                    </div>
                    <div>
                      <label htmlFor="user-email-input" className="text-[11px] font-sans font-medium text-brand-earth/60 block mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="user-email-input"
                        placeholder="e.g. aditi@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full bg-white border border-brand-earth/15 outline-none focus:border-brand-terracotta px-4 py-3 rounded text-sm text-brand-earth font-sans transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Status and Error handling logs */}
              {errorMsg && (
                <div id="booking-error" className="flex items-start gap-2 bg-rose-50 border border-rose-200 p-3 rounded text-xs text-rose-800 font-sans">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Submit CTA button */}
              <button
                type="submit"
                disabled={isSubmitting}
                id="modal-confirm-submit-btn"
                className="w-full bg-brand-terracotta hover:bg-brand-earth disabled:bg-brand-earth/40 text-white font-sans font-semibold text-xs tracking-wider uppercase py-4 rounded shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white/25 border-t-white animate-spin block" />
                    <span>{isSelectedSlotFull ? 'Adding to Waitlist...' : 'Reserving Wheel Spot...'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isSelectedSlotFull ? 'Join Waitlist & Get Message' : 'Confirm Booking & Get Message'}</span>
                  </>
                )}
              </button>

              <p className="text-[10px] text-brand-earth/40 text-center leading-normal">
                By booking, your reservation row is saved. Firing results, glazes preference can be changed on site. Feel free to contact the studio coordinate directly.
              </p>

            </form>
          )}

        </div>
      </div>
    </div>
  );
}
