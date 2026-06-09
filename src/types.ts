/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Workshop {
  id: string;
  title: string;
  description: string;
  date: string; // Format: YYYY-MM-DD or readable string
  morningSlot: string; // e.g., "10:00 AM - 12:30 PM" or "Not Available"
  afternoonSlot: string; // e.g., "2:30 PM - 5:00 PM" or "Not Available"
  maxSeats: number;
  morningMaxSeats?: number;
  afternoonMaxSeats?: number;
  morningAvailableSeats?: number;
  afternoonAvailableSeats?: number;
  availableSeats: number;
  price: number; // in INR (₹)
  image: string; // URL to the image
  isExpired?: boolean;
}

export interface Booking {
  id: string;
  workshopId: string;
  workshopTitle: string;
  workshopDate: string;
  slot: 'morning' | 'afternoon';
  slotTime: string;
  userName: string;
  userPhone: string;
  userEmail: string;
  timestamp: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'waitlist' | 'waitlisted';
  price?: number;
}

export interface StudioSettings {
  sheetCsvUrl: string; // Google Sheets CSV export link
  appsScriptUrl: string; // Google Apps Script Web App post URL
  isCustomConfigured: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  rating: number;
  text: string;
  date: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface GalleryItem {
  id: string;
  image: string;
  title: string;
  category: string;
}
