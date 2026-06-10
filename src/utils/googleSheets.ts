/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Workshop, Booking, StudioSettings } from '../types';

// Default mock workshop list centered on Mangalore pottery business.
// Used as super rich content when a custom Google Sheet is not yet configured.
export const DEFAULT_WORKSHOPS: Workshop[] = [
  {
    id: 'ws-1',
    title: 'Intro to Ceramic Wheel Throwing',
    description: 'Learn the foundational art of centering, opening, and pulling clay on the potter\'s wheel. Guided step-by-step by our master potters. Ideal for beginners wishing to experience the magical tactile feel of rotating clay. Includes all raw clay, high-firing glaze service, and a finished bowl to take home.',
    date: '2026-06-13',
    morningSlot: '10:00 AM - 12:30 PM',
    afternoonSlot: '02:30 PM - 05:00 PM',
    maxSeats: 8,
    availableSeats: 3,
    price: 1800,
    image: 'https://images.unsplash.com/photo-1565192647048-f997ded87958?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'ws-2',
    title: 'Earthy Clay Handbuilding & Slab Work',
    description: 'Explore ancient hand-shaping pottery techniques including pinching, coiling, and structural slab work. Design and script organic shapes, custom textures, and personalized mugs, plates, or incense holders. Perfect for groups, couples, or solo makers looking for an artistic creative outlet in Mangalore.',
    date: '2026-06-20',
    morningSlot: '10:00 AM - 12:30 PM',
    afternoonSlot: '02:30 PM - 05:00 PM',
    maxSeats: 12,
    availableSeats: 8,
    price: 1500,
    image: 'card_image.png'
  },
  {
    id: 'ws-3',
    title: 'Glaze, Splatter & Luster Masterclass',
    description: 'Breathe vibrant high-contrast life into your bisque-fired ceramic wares. Learn premium brush applications, wax resistance designs, dipping controls, and abstract glaze splatters in our specialized glazing chamber. Your creations will then undergo a meticulous gas-red fire in our 1200°C pottery kiln.',
    date: '2026-06-27',
    morningSlot: '10:00 AM - 12:30 PM',
    afternoonSlot: 'Not Available',
    maxSeats: 6,
    availableSeats: 2,
    price: 2200,
    image: 'https://images.unsplash.com/photo-1535401991746-da3d9055713e?auto=format&fit=crop&q=80&w=800'
  }
];

// ============================================================================
// MANUAL IMAGE OVERRIDES (CODE-LEVEL)
// ============================================================================
// If you want to force specific image URLs or local file paths for specific workshops (both sheet and fallback defaults), 
// you can map the workshop Title to the image path/URL in this object.
// 
// Examples:
// - Absolute URL: 'https://images.unsplash.com/photo-...'
// - Local asset in src (imported or placed at project root like hero.jpeg): 'card_image.png'
// 
export const MANUAL_IMAGE_OVERRIDES: Record<string, string> = {
  'Hand Building Pottery': 'card_image.png', // Edit this string to change Hand Building Pottery image!
  'Unaiz Building Potter': 'card_image.png', // Edit this string to change Unaiz Building Potter image!
};

export function normalizeImageUrl(url: string): string {
  if (!url) return '';
  const clean = url.trim();
  
  // Convert Google Drive share links to high-speed direct render links
  if (clean.includes('drive.google.com')) {
    // Matches /file/d/(ID)/...
    const dMatch = clean.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
    if (dMatch && dMatch[1]) {
      return `https://lh3.googleusercontent.com/d/${dMatch[1]}`;
    }
    // Matches ?id=(ID)
    const idMatch = clean.match(/[?&]id=([a-zA-Z0-9-_]+)/);
    if (idMatch && idMatch[1]) {
      return `https://lh3.googleusercontent.com/d/${idMatch[1]}`;
    }
  }
  return clean;
}

export function normalizeDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '';
  const clean = dateStr.toString().trim();
  
  // 1. Convert month name strings (e.g. "10-Jun-2026" or "10 June" or "June 10") beforehand
  // to avoid standard JS parsers making them browser-local and causing crossing day offsets.
  const monthsMap: Record<string, string> = {
    jan: '01', january: '01',
    feb: '02', february: '02',
    mar: '03', march: '03',
    apr: '04', april: '04',
    may: '05',
    jun: '06', june: '06',
    jul: '07', july: '07',
    aug: '08', august: '08',
    sep: '09', september: '09', sept: '09',
    oct: '10', october: '10',
    nov: '11', november: '11',
    dec: '12', december: '12'
  };

  const cleanLower = clean.toLowerCase();
  let hasMonthName = false;
  let matchedMonthKey = '';
  for (const mName of Object.keys(monthsMap)) {
    const rx = new RegExp(`(?:[^a-z]|^)${mName}(?:[^a-z]|$)`);
    if (rx.test(cleanLower)) {
      matchedMonthKey = mName;
      hasMonthName = true;
      break;
    }
  }

  if (hasMonthName) {
    const monthNumStr = monthsMap[matchedMonthKey];
    const numbers = cleanLower.match(/\d+/g);
    if (numbers && numbers.length >= 2) {
      let dayVal = '';
      let yearVal = '';
      const first = numbers[0];
      const second = numbers[1];
      
      if (first.length === 4) {
        yearVal = first;
        dayVal = second;
      } else if (second.length === 4) {
        yearVal = second;
        dayVal = first;
      } else if (second.length === 2) {
        yearVal = '20' + second;
        dayVal = first;
      } else {
        dayVal = first;
        yearVal = new Date().getFullYear().toString();
      }
      
      return `${yearVal}-${monthNumStr}-${dayVal.padStart(2, '0')}`;
    }
  }

  // 2. Check for standard Indian/UK date-only formats: DD-MM-YYYY, DD/MM/YYYY, DD.MM.YYYY
  const dmyMatch = clean.match(/^(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{4})$/);
  if (dmyMatch) {
    const dStr = dmyMatch[1];
    const mStr = dmyMatch[2];
    const yStr = dmyMatch[3];
    
    const dVal = parseInt(dStr, 10);
    const mVal = parseInt(mStr, 10);
    
    let day = dStr;
    let month = mStr;
    
    if (dVal > 12 && mVal <= 12) {
      day = dStr;
      month = mStr;
    } else if (mVal > 12 && dVal <= 12) {
      day = mStr;
      month = dStr;
    }
    
    return `${yStr}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  // 3. Check for standard YYYY-MM-DD or YYYY/MM/DD date-only formats
  const ymdMatch = clean.match(/^(\d{4})[/\-.](\d{1,2})[/\-.](\d{1,2})$/);
  if (ymdMatch) {
    return `${ymdMatch[1]}-${ymdMatch[2].padStart(2, '0')}-${ymdMatch[3].padStart(2, '0')}`;
  }
  
  // 4. Fallback to standard JS Date parsing but enforce UTC to Asia/Kolkata (+05:30) 
  // timezone shift to make results 100% browser-location agnostic!
  try {
    const parsedDate = new Date(clean);
    if (!isNaN(parsedDate.getTime())) {
      const kolkataOffsetMs = 5.5 * 60 * 60 * 1000;
      const kolkataTime = new Date(parsedDate.getTime() + kolkataOffsetMs);
      const y = kolkataTime.getUTCFullYear();
      const m = String(kolkataTime.getUTCMonth() + 1).padStart(2, '0');
      const d = String(kolkataTime.getUTCDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    }
  } catch (e) {
    // ignore
  }

  // 5. Backup split patterns
  if (clean.includes('T')) {
    const parted = clean.split('T')[0];
    if (/^\d{4}-\d{2}-\d{2}$/.test(parted)) {
      return parted;
    }
  }
  
  if (clean.includes(' ')) {
    const parted = clean.split(' ')[0];
    if (/^\d{4}-\d{2}-\d{2}$/.test(parted)) {
      return parted;
    }
  }

  return clean;
}

const LOCAL_STORAGE_KEY = 'clay_craft_studio_settings';

/**
 * Auto-transforms any standard Google Sheets edit or share URL into a working CSV export URL.
 */
export function normalizeSheetUrl(url: string): string {
  if (!url) return '';
  const cleanUrl = url.trim();
  
  if (cleanUrl.toLowerCase().includes('output=csv') || cleanUrl.toLowerCase().includes('format=csv')) {
    return cleanUrl;
  }
  
  // Extract "Publish to Web" URL token: /spreadsheets/d/e/2PACX-1v.../pubhtml
  if (cleanUrl.toLowerCase().includes('/spreadsheets/d/e/')) {
    const pubMatch = cleanUrl.match(/\/spreadsheets\/d\/e\/([a-zA-Z0-9-_]+)/);
    if (pubMatch && pubMatch[1]) {
      const publishToken = pubMatch[1];
      
      // Check for a gid parameter inside the "Publish to Web" URL
      let gid = '';
      const gidMatch = cleanUrl.match(/[#?&]gid=([0-9]+)/);
      if (gidMatch && gidMatch[1]) {
        gid = gidMatch[1];
      }
      
      return `https://docs.google.com/spreadsheets/d/e/${publishToken}/pub?output=csv${gid ? `&gid=${gid}` : ''}`;
    }
  }

  // Extract regular spreadsheet ID (e.g. /spreadsheets/d/1A2B3C4D5E/...)
  const idMatch = cleanUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (idMatch && idMatch[1]) {
    const spreadsheetId = idMatch[1];
    
    // Check if there is a gid parameter (e.g. #gid=12345 or ?gid=12345)
    let gid = '0';
    const gidMatch = cleanUrl.match(/[#?&]gid=([0-9]+)/);
    if (gidMatch && gidMatch[1]) {
      gid = gidMatch[1];
    }
    
    return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${gid}`;
  }
  
  return cleanUrl;
}

// Fetch settings from local storage
export function getStudioSettings(): StudioSettings {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed.sheetCsvUrl) {
        parsed.sheetCsvUrl = normalizeSheetUrl(parsed.sheetCsvUrl);
      }
      return parsed;
    }
  } catch (e) {
    console.warn('Failed to read studio settings', e);
  }

  // Support fallback environment variables if set during the hosting platform's build phase
  const metaEnv = (import.meta as any).env || {};
  const envSheetUrl = normalizeSheetUrl((metaEnv.VITE_SHEET_CSV_URL as string) || '');
  const envAppsScriptUrl = (metaEnv.VITE_APPS_SCRIPT_URL as string) || '';

  // Single active diagnostic log to help verify build configuration on platforms like Vercel
  console.log('%c[Clay & Pottery Diagnostics]', 'color: #c97d60; font-weight: bold; font-size: 11px;', {
    VITE_SHEET_CSV_URL_PRESENT: !!metaEnv.VITE_SHEET_CSV_URL,
    VITE_SHEET_CSV_URL_VALUE: metaEnv.VITE_SHEET_CSV_URL || '(not set)',
    VITE_APPS_SCRIPT_URL_PRESENT: !!metaEnv.VITE_APPS_SCRIPT_URL,
    VITE_APPS_SCRIPT_URL_VALUE: metaEnv.VITE_APPS_SCRIPT_URL || '(not set)'
  });

  return {
    sheetCsvUrl: envSheetUrl,
    appsScriptUrl: envAppsScriptUrl,
    isCustomConfigured: !!(envSheetUrl || envAppsScriptUrl)
  };
}

// Save settings to local storage
export function saveStudioSettings(settings: Partial<StudioSettings>): StudioSettings {
  const current = getStudioSettings();
  
  const normalizedSheet = settings.sheetCsvUrl ? normalizeSheetUrl(settings.sheetCsvUrl) : (settings.sheetCsvUrl ?? current.sheetCsvUrl);
  
  const updated = {
    ...current,
    ...settings,
    sheetCsvUrl: normalizedSheet,
    isCustomConfigured: !!(normalizedSheet || (settings.appsScriptUrl ?? current.appsScriptUrl))
  };
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

// Simple custom CSV parser that handles quotes and multiple formats securely
export function parseCSV(csvText: string): string[][] {
  const result: string[][] = [];
  let row: string[] = [];
  let currentVal = '';
  let inQuotes = false;
  
  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];
    
    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          currentVal += '"';
          i++; // skip next quote
        } else {
          inQuotes = false;
        }
      } else {
        currentVal += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        row.push(currentVal.trim());
        currentVal = '';
      } else if (char === '\n' || char === '\r') {
        if (char === '\r' && nextChar === '\n') {
          i++;
        }
        row.push(currentVal.trim());
        result.push(row);
        row = [];
        currentVal = '';
      } else {
        currentVal += char;
      }
    }
  }
  
  if (row.length > 0 || currentVal) {
    row.push(currentVal.trim());
    result.push(row);
  }
  
  return result.filter(r => r.length > 0 && r.some(cell => cell.length > 0));
}

// Helper to normalize column naming
function findColumnIndex(headers: string[], options: string[]): number {
  const normalizedHeaders = headers.map(h => h.toLowerCase().replace(/[\s_\-:]/g, ''));
  
  // 1st pass: Look for an exact match to prevent broad keywords (like 'capacity') from matching specialized ones
  for (const opt of options) {
    const normOpt = opt.toLowerCase().replace(/[\s_\-:]/g, '');
    const idx = normalizedHeaders.findIndex(h => h === normOpt);
    if (idx !== -1) return idx;
  }
  
  // 2nd pass: Fallback to partial sub-string match
  for (const opt of options) {
    const normOpt = opt.toLowerCase().replace(/[\s_\-:]/g, '');
    const idx = normalizedHeaders.findIndex(h => h.includes(normOpt) || normOpt.includes(h));
    if (idx !== -1) return idx;
  }
  return -1;
}

// Fetch bookings from Google Apps Script endpoint and merge with local bookings
export async function fetchBookings(settings: StudioSettings = getStudioSettings()): Promise<Booking[]> {
  // If NO apps script URL is set, return local mock bookings (Demo/simulation mode)
  if (!settings.appsScriptUrl) {
    let localBookings: Booking[] = [];
    try {
      const data = localStorage.getItem('clay_craft_local_bookings');
      if (data) {
        localBookings = JSON.parse(data);
      }
    } catch (e) {
      console.warn('Failed to parse local bookings', e);
    }
    console.log('%c[Availability Data Source] Using strictly local device simulated bookings.', 'color: #3b82f6; font-weight: bold;', localBookings);
    return localBookings;
  }

  // If Apps Script URL is set (Live Mode), fetch from the GET endpoint, live sheet serves as sole source of truth
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout for cold starts
    const url = `${settings.appsScriptUrl}${settings.appsScriptUrl.includes('?') ? '&' : '?'}action=getBookings&nocache=${Date.now()}`;
    const response = await fetch(url, {
      signal: controller.signal,
      cache: 'no-store'
    });
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Apps Script responded with status: ${response.status}`);
    }
    const data = await response.json();
    if (Array.isArray(data)) {
      console.log('%c[Availability Data Source] Successfully connected to Apps Script. Using live spreadsheet bookings as single source of truth.', 'color: #10b981; font-weight: bold;', {
        appsScriptBookings: data
      });
      return data;
    }
    console.warn('[Availability Data Source] Apps Script response was not an array.', data);
    return [];
  } catch (error) {
    console.warn('Failed to fetch bookings from Apps Script. Returning empty array in live mode to prevent stale, device-specific deviations.', error);
    return [];
  }
}

// Fetch workshops from public Google Sheet or fallback
export async function fetchWorkshops(settings: StudioSettings = getStudioSettings()): Promise<Workshop[]> {
  let rawWorkshops: Workshop[] = [];

  if (!settings.sheetCsvUrl) {
    // If not configured, load deep cloned defaults
    rawWorkshops = JSON.parse(JSON.stringify(DEFAULT_WORKSHOPS));
  } else {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout for cold starts
      
      let sheetUrl = normalizeSheetUrl(settings.sheetCsvUrl);
      if (sheetUrl.includes('?')) {
        sheetUrl += `&cb=${Date.now()}`;
      } else {
        sheetUrl += `?cb=${Date.now()}`;
      }
      
      const response = await fetch(sheetUrl, {
        signal: controller.signal,
        cache: 'no-store'
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Google Sheet HTTP Error: ${response.status}`);
      }
      
      const text = await response.text();
      const rows = parseCSV(text);
      
      if (rows.length < 2) {
        throw new Error('Google Sheet is empty or missing data rows.');
      }
      
      const headers = rows[0];
      
      // Find column positions
      const idIdx = findColumnIndex(headers, ['workshopid', 'id']);
      const titleIdx = findColumnIndex(headers, ['workshoptitle', 'title', 'workshop', 'name']);
      const descIdx = findColumnIndex(headers, ['description', 'info', 'details']);
      const dateIdx = findColumnIndex(headers, ['workshopdate', 'date', 'day']);
      const morningIdx = findColumnIndex(headers, ['morningslot', 'morning', 'slot1', 'am']);
      const afternoonIdx = findColumnIndex(headers, ['afternoonslot', 'afternoon', 'slot2', 'pm']);
      const maxSeatsIdx = findColumnIndex(headers, ['maximum', 'maxseats', 'capacity', 'seats']);
      const morningMaxSeatsIdx = findColumnIndex(headers, ['morningcapacity', 'morningmaxseats', 'morningseats', 'amcapacity', 'amslots', 'amseats']);
      const afternoonMaxSeatsIdx = findColumnIndex(headers, ['afternooncapacity', 'afternoonmaxseats', 'afternoonseats', 'pmcapacity', 'pmslots', 'pmseats']);
      const priceIdx = findColumnIndex(headers, ['price', 'cost', 'fee', 'charge']);
      const imageIdx = findColumnIndex(headers, ['workshopimage', 'image', 'photo', 'url', 'pic']);
      
      const getIndexVal = (idx: number, rowArr: string[], fallback: string): string => {
        return idx !== -1 && idx < rowArr.length ? rowArr[idx] : fallback;
      };
      
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (row.length < 2) continue; // Skip empty rows
        
        const id = idIdx !== -1 ? getIndexVal(idIdx, row, `sheet-${i}`).trim() || `sheet-${i}` : `sheet-${i}`;
        const title = getIndexVal(titleIdx, row, `Pottery Workshop #${i}`);
        const description = getIndexVal(descIdx, row, 'Premium hands-on clay crafting session at our boutique studio in Mangalore.');
        const date = getIndexVal(dateIdx, row, 'TBA');
        const morningSlot = getIndexVal(morningIdx, row, '10:00 AM - 12:30 PM');
        const afternoonSlot = getIndexVal(afternoonIdx, row, '02:30 PM - 05:00 PM');
        
        // Clean max seats and price for robust numeric parsing (handles things like "₹ 1,500" or commas gracefully)
        const maxSeatsStr = getIndexVal(maxSeatsIdx, row, '8').replace(/[^0-9]/g, '');
        const maxSeats = Math.max(1, parseInt(maxSeatsStr, 10) || 8);
        
        const morningMaxSeatsStr = morningMaxSeatsIdx !== -1 ? getIndexVal(morningMaxSeatsIdx, row, '').replace(/[^0-9]/g, '') : '';
        const morningMaxSeats = morningMaxSeatsStr ? Math.max(1, parseInt(morningMaxSeatsStr, 10)) : maxSeats;
        
        const afternoonMaxSeatsStr = afternoonMaxSeatsIdx !== -1 ? getIndexVal(afternoonMaxSeatsIdx, row, '').replace(/[^0-9]/g, '') : '';
        const afternoonMaxSeats = afternoonMaxSeatsStr ? Math.max(1, parseInt(afternoonMaxSeatsStr, 10)) : maxSeats;
        
        const priceStr = getIndexVal(priceIdx, row, '1500').replace(/[^0-9.]/g, '');
        const price = Math.max(0, parseFloat(priceStr) || 1500);
        
        let image = normalizeImageUrl(getIndexVal(imageIdx, row, '').trim());
        
        // Apply manual code-level override if mapped
        if (title && MANUAL_IMAGE_OVERRIDES[title.trim()]) {
          image = MANUAL_IMAGE_OVERRIDES[title.trim()];
        }
        
        // Check if the image string is a valid remote URL or a recognizable local file/asset path (e.g. "card_image.png")
        const isValidImageRef = image && (
          image.startsWith('http') ||
          image.startsWith('/') ||
          image.startsWith('./') ||
          image.startsWith('data:') ||
          image.includes('.') ||
          image.toLowerCase().endsWith('.png') ||
          image.toLowerCase().endsWith('.jpg') ||
          image.toLowerCase().endsWith('.jpeg') ||
          image.toLowerCase().endsWith('.webp')
        );
        
        if (!isValidImageRef) {
          const fallbacks = [
            'https://images.unsplash.com/photo-1565192647048-f997ded87958?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1535401991746-da3d9055713e?auto=format&fit=crop&q=80&w=800'
          ];
          image = fallbacks[(i - 1) % fallbacks.length];
        }
        
        rawWorkshops.push({
          id,
          title,
          description,
          date,
          morningSlot,
          afternoonSlot,
          maxSeats,
          morningMaxSeats,
          afternoonMaxSeats,
          morningAvailableSeats: morningMaxSeats,
          afternoonAvailableSeats: afternoonMaxSeats,
          availableSeats: maxSeats, // starts as maxSeats, updated below with active bookings
          price,
          image
        });
      }
    } catch (error) {
      console.warn('Failed to fetch from Google Sheets, using fallback', error);
      rawWorkshops = JSON.parse(JSON.stringify(DEFAULT_WORKSHOPS));
    }
  }

  // Inject dynamic capacity calculations by analyzing booking data
  try {
    const bookings = await fetchBookings(settings);
    
    rawWorkshops = rawWorkshops.map(ws => {
      // Find matching bookings
      const matches = bookings.filter(b => {
        // Waitlisted and Cancelled reservations do NOT subtract from wheel capacity (case-insensitive)
        const statusClean = (b.status || '').trim().toLowerCase();
        const isCountable = statusClean !== 'cancelled' && statusClean !== 'waitlist' && statusClean !== 'waitlisted';
        if (!isCountable) return false;

        const idMatches = !!(b.workshopId && ws.id && b.workshopId.trim().toLowerCase() === ws.id.trim().toLowerCase());

        // Match by title AND date if both are available, or fallback to title if date is missing/empty (for backwards compatibility)
        const titleMatches = b.workshopTitle?.trim().toLowerCase() === ws.title.trim().toLowerCase();
        
        const bDate = normalizeDate(b.workshopDate);
        const wsDate = normalizeDate(ws.date);
        const dateMatches = bDate && wsDate ? bDate === wsDate : true;

        const titleAndDateMatches = titleMatches && dateMatches;

        return idMatches || titleAndDateMatches;
      });
      
      // Separate matching bookings by slot robustly, verifying raw attributes returned from sheet
      const morningBookings = matches.filter(b => {
        const slotRaw = b.slot || (b as any).selectedslot || (b as any).workshopslot || (b as any).chosenslot || (b as any).selectedSlot || (b as any).workshopSlot || (b as any).chosenSlot || '';
        const bSlot = slotRaw.toString().trim().toLowerCase();
        
        const bSlotTime = (b.slotTime || '').trim().toLowerCase();
        const wsMorningTime = (ws.morningSlot || '').trim().toLowerCase();
        
        const isMorningBySlot = bSlot === 'morning' || 
               bSlot === 'morning slot' || 
               bSlot === 'am' || 
               bSlot === 'slot1' || 
               bSlot === 'slot 1' ||
               bSlot.startsWith('morning') ||
               bSlot.startsWith('am') ||
               bSlot.includes('10:') ||
               bSlot.includes('11:') ||
               bSlot.includes('09:') ||
               bSlot.includes('08:') ||
               bSlot.includes('9:') ||
               bSlot.includes('8:');

        const isMorningByTime = bSlotTime && wsMorningTime && (
          bSlotTime === wsMorningTime || 
          bSlotTime.includes(wsMorningTime) || 
          wsMorningTime.includes(bSlotTime)
        );

        return isMorningBySlot || isMorningByTime;
      });

      const afternoonBookings = matches.filter(b => {
        const slotRaw = b.slot || (b as any).selectedslot || (b as any).workshopslot || (b as any).chosenslot || (b as any).selectedSlot || (b as any).workshopSlot || (b as any).chosenSlot || '';
        const bSlot = slotRaw.toString().trim().toLowerCase();
        
        const bSlotTime = (b.slotTime || '').trim().toLowerCase();
        const wsAfternoonTime = (ws.afternoonSlot || '').trim().toLowerCase();
        
        const isAfternoonBySlot = bSlot === 'afternoon' || 
               bSlot === 'afternoon slot' || 
               bSlot === 'pm' || 
               bSlot === 'slot2' || 
               bSlot === 'slot 2' ||
               bSlot.startsWith('afternoon') ||
               bSlot.startsWith('pm') ||
               bSlot.includes('2:') ||
               bSlot.includes('3:') ||
               bSlot.includes('4:') ||
               bSlot.includes('5:') ||
               bSlot.includes('14:') ||
               bSlot.includes('15:') ||
               bSlot.includes('16:') ||
               bSlot.includes('17:') ||
               bSlot.includes('12:') ||
               bSlot.includes('13:');

        const isAfternoonByTime = bSlotTime && wsAfternoonTime && (
          bSlotTime === wsAfternoonTime || 
          bSlotTime.includes(wsAfternoonTime) || 
          wsAfternoonTime.includes(bSlotTime)
        );

        return isAfternoonBySlot || isAfternoonByTime;
      });

      // Get separate capacities (fallback to overall maxSeats)
      const mMax = ws.morningMaxSeats ?? ws.maxSeats;
      const aMax = ws.afternoonMaxSeats ?? ws.maxSeats;

      // Check which slots are active (Not Available means deactivated)
      const isMorningActive = ws.morningSlot && ws.morningSlot.trim().toLowerCase() !== 'not available';
      const isAfternoonActive = ws.afternoonSlot && ws.afternoonSlot.trim().toLowerCase() !== 'not available';

      // Compute available seats per active slot
      const morningAvailableSeats = isMorningActive ? Math.max(0, mMax - morningBookings.length) : 0;
      const afternoonAvailableSeats = isAfternoonActive ? Math.max(0, aMax - afternoonBookings.length) : 0;

      // Combined available seats: standard sum of available spots in active sessions
      let availableSeats = 0;
      if (isMorningActive) availableSeats += morningAvailableSeats;
      if (isAfternoonActive) availableSeats += afternoonAvailableSeats;

      // If neither slot is technically active, fallback to old behavior
      if (!isMorningActive && !isAfternoonActive) {
        availableSeats = Math.max(0, ws.maxSeats - matches.length);
      }

      // Log capacity calculations details for workshop wk001 specifically as requested
      if (ws.id === 'wk001' || ws.id.trim() === 'wk001') {
        console.log('%c--- [Capacity Calculation Log for wk001] ---', 'color: #ea580c; font-weight: bold; font-size: 11px;');
        console.log(`- Number of bookings returned by Apps Script: ${bookings.length}`);
        console.log(`- Number of bookings used in capacity calculation for wk001: ${matches.length}`);
        console.log(`- morningBookings (count: ${morningBookings.length}):`, morningBookings);
        console.log(`- afternoonBookings (count: ${afternoonBookings.length}):`, afternoonBookings);
        console.log(`- morningAvailableSeats: ${morningAvailableSeats} (out of max ${mMax})`);
        console.log(`- afternoonAvailableSeats: ${afternoonAvailableSeats} (out of max ${aMax})`);
        console.log('-------------------------------------------');
      }

      return {
        ...ws,
        morningMaxSeats: mMax,
        afternoonMaxSeats: aMax,
        morningAvailableSeats,
        afternoonAvailableSeats,
        availableSeats
      };
    });
  } catch (e) {
    console.warn('Error computing dynamic available seats:', e);
  }

  // Filter out any past/expired workshops dynamically
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Start of today

  return rawWorkshops.filter(ws => {
    if (ws.date && ws.date !== 'TBA') {
      try {
        const normDateStr = normalizeDate(ws.date);
        const workshopDate = new Date(normDateStr);
        if (!isNaN(workshopDate.getTime()) && workshopDate < today) {
          return false; // Hide past workshop
        }
      } catch (e) {
        console.warn('Could not parse date for expiration check:', ws.date, e);
      }
    }
    return true;
  });
}

// Store booking to Google Sheets or perform fallback simulator
export async function submitBooking(
  booking: Omit<Booking, 'id' | 'timestamp' | 'status'> & { price: number; date: string; status?: Booking['status'] },
  settings: StudioSettings = getStudioSettings()
): Promise<{ success: boolean; message: string }> {
  const bookingId = 'BK-' + Math.floor(100000 + Math.random() * 900000);
  const timestamp = new Date().toISOString();
  
  const { price, date, status, ...bookingPayload } = booking;
  const bookingStatus = status || 'pending';
  
  // Establish explicit insertion order matching the spreadsheet columns list precisely
  const fullBooking: Booking = {
    id: bookingId,
    workshopId: bookingPayload.workshopId || '',
    workshopTitle: bookingPayload.workshopTitle || '',
    workshopDate: bookingPayload.workshopDate || date || '',
    slot: bookingPayload.slot || 'morning',
    slotTime: bookingPayload.slotTime || '',
    userName: bookingPayload.userName || '',
    userPhone: bookingPayload.userPhone || '',
    userEmail: bookingPayload.userEmail || '',
    timestamp: timestamp,
    price: booking.price,
    status: bookingStatus
  };
  
  const isWaitlist = bookingStatus === 'waitlist' || bookingStatus === 'waitlisted';
  const formattedPrice = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(booking.price);
  
  // Make beautiful custom WhatsApp text
  const whatsappText = isWaitlist
    ? `Hello Clay & Craft Studio!\n\nI see that your workshop is currently *FULLY BOOKED*, and I would love to join your *WAITLIST*!\n\n⏳ *Workshop:* ${booking.workshopTitle}\n📅 *Date:* ${booking.date}\n🕒 *Slot:* ${booking.slot.toUpperCase()} (${booking.slotTime})\n👤 *Name:* ${booking.userName}\n📞 *Phone:* ${booking.userPhone}\n✉️ *Email:* ${booking.userEmail}\n💳 *Price:* ${formattedPrice}\n🆔 *Waitlist ID:* ${bookingId}\n\nPlease let me know if a wheel spot opens up. Thank you!`
    : `Hello Clay & Craft Studio!\n\nI was hoping to book a slot for your workshop! Here are my details:\n\n✨ *Workshop:* ${booking.workshopTitle}\n📅 *Date:* ${booking.date}\n🕒 *Slot:* ${booking.slot.toUpperCase()} (${booking.slotTime})\n👤 *Name:* ${booking.userName}\n📞 *Phone:* ${booking.userPhone}\n✉️ *Email:* ${booking.userEmail}\n💳 *Price:* ${formattedPrice}\n🆔 *Booking ID:* ${bookingId}\n\nCan you please confirm my availability and share the payment details? Thank you!`;
  
  const encodedMsg = encodeURIComponent(whatsappText);
  const whatsappUrl = `https://wa.me/917907974566?text=${encodedMsg}`;
  
  // Save locally as mock database ONLY when in Demo/Simulation Mode
  if (!settings.appsScriptUrl) {
    try {
      const existingBookings = JSON.parse(localStorage.getItem('clay_craft_local_bookings') || '[]');
      existingBookings.push(fullBooking);
      localStorage.setItem('clay_craft_local_bookings', JSON.stringify(existingBookings));
    } catch (e) {
      console.warn('Local mock booking save failed', e);
    }
  } else {
    // Keep client storage completely clean in live mode to avoid residual stale simulation data
    try {
      localStorage.removeItem('clay_craft_local_bookings');
    } catch (e) {
      // ignore
    }
  }
  
  // If Google Apps Script is configured, post booking data securely in background
  if (settings.appsScriptUrl) {
    try {
      await fetch(settings.appsScriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain'
        },
        body: JSON.stringify(fullBooking)
      });
    } catch (error) {
      console.warn('Backend Apps Script write failed, continuing with WhatsApp direct confirmation', error);
    }
  }
  
  return {
    success: true,
    message: whatsappUrl
  };
}

export function clearLocalBookings(): void {
  try {
    localStorage.removeItem('clay_craft_local_bookings');
  } catch (e) {
    console.warn('Failed to clear local bookings', e);
  }
}
