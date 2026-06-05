/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { X, Copy, Check, Settings, Info, CloudLightning, ShieldAlert, Sparkles, Database, FileSpreadsheet, Play } from 'lucide-react';
import { StudioSettings, Workshop, Booking } from '../types';
import { fetchWorkshops } from '../utils/googleSheets';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSettings: (settings: StudioSettings) => void;
  currentSettings: StudioSettings;
}

export default function AdminPanel({ isOpen, onClose, onSaveSettings, currentSettings }: AdminPanelProps) {
  const [sheetCsvUrl, setSheetCsvUrl] = useState(currentSettings.sheetCsvUrl);
  const [appsScriptUrl, setAppsScriptUrl] = useState(currentSettings.appsScriptUrl);
  
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; data?: Workshop[] } | null>(null);
  
  const [copiedHeaders, setCopiedHeaders] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  useEffect(() => {
    setSheetCsvUrl(currentSettings.sheetCsvUrl);
    setAppsScriptUrl(currentSettings.appsScriptUrl);
    setTestResult(null);
  }, [currentSettings, isOpen]);

  if (!isOpen) return null;

  const headerList = "Workshop Title\tDescription\tDate\tMorning Slot\tAfternoon Slot\tMaximum Seats\tAvailable Seats\tPrice\tWorkshop Image";

  const copyHeadersToClipboard = () => {
    navigator.clipboard.writeText(headerList);
    setCopiedHeaders(true);
    setTimeout(() => setCopiedHeaders(false), 2000);
  };

  const appsScriptCode = `function doGet(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Bookings");
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify([]))
        .setMimeType(ContentService.MimeType.JSON)
        .addHeader("Access-Control-Allow-Origin", "*");
    }
    
    var data = sheet.getDataRange().getValues();
    if (data.length < 2) {
      return ContentService.createTextOutput(JSON.stringify([]))
        .setMimeType(ContentService.MimeType.JSON)
        .addHeader("Access-Control-Allow-Origin", "*");
    }
    
    var headers = data[0];
    var bookings = [];
    
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      var booking = {};
      for (var j = 0; j < headers.length; j++) {
        var header = headers[j].toString().toLowerCase().replace(/[\\s_\\-:]/g, '');
        var key = header;
        if (header === 'bookingid' || header === 'id') key = 'id';
        else if (header === 'workshopid') key = 'workshopId';
        else if (header === 'workshoptitle' || header === 'title') key = 'workshopTitle';
        else if (header === 'timeslot' || header === 'slottime') key = 'slotTime';
        else if (header === 'username' || header === 'name') key = 'userName';
        else if (header === 'userphone' || header === 'phone') key = 'userPhone';
        else if (header === 'useremail' || header === 'email') key = 'userEmail';
        else if (header === 'status') key = 'status';
        else if (header === 'timestamp') key = 'timestamp';
        else if (header === 'price') key = 'price';
        
        booking[key] = row[j];
      }
      bookings.push(booking);
    }
    
    return ContentService.createTextOutput(JSON.stringify(bookings))
      .setMimeType(ContentService.MimeType.JSON)
      .addHeader("Access-Control-Allow-Origin", "*");
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON)
      .addHeader("Access-Control-Allow-Origin", "*");
  }
}

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Bookings") 
                || SpreadsheetApp.getActiveSpreadsheet().insertSheet("Bookings");
    
    // Set headers if it is a fresh blank sheet page
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Booking ID", "Workshop ID", "Workshop Title", "Slot", "Time Slot", "Name", "Phone", "Email", "Timestamp", "Price", "Status"]);
    }
    
    var data = JSON.parse(e.postData.contents);
    sheet.appendRow([
      data.id || "",
      data.workshopId || "",
      data.workshopTitle || "",
      data.slot || "",
      data.slotTime || "",
      data.userName || "",
      "'" + (data.userPhone || ""), // Prevent truncation format
      data.userEmail || "",
      data.timestamp || "",
      data.price || "",
      data.status || "pending"
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ "status": "success", "bookingId": data.id }))
      .setMimeType(ContentService.MimeType.JSON)
      .addHeader("Access-Control-Allow-Origin", "*");
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON)
      .addHeader("Access-Control-Allow-Origin", "*");
  }
}`;

  const copyScriptToClipboard = () => {
    navigator.clipboard.writeText(appsScriptCode);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  const handleTestAndSave = async () => {
    setIsTesting(true);
    setTestResult(null);
    
    const testConfig: StudioSettings = {
      sheetCsvUrl,
      appsScriptUrl,
      isCustomConfigured: !!(sheetCsvUrl || appsScriptUrl)
    };

    try {
      if (!sheetCsvUrl.trim()) {
        const resetSettings: StudioSettings = {
          sheetCsvUrl: '',
          appsScriptUrl: '',
          isCustomConfigured: false
        };
        onSaveSettings(resetSettings);
        setTestResult({
          success: true,
          message: 'Settings successfully reset! The pottery website has re-synchronized default fallback files.'
        });
        setIsTesting(false);
        return;
      }

      // Live fetch parsing check
      const workshops = await fetchWorkshops(testConfig);
      
      if (workshops && workshops.length > 0) {
        onSaveSettings(testConfig);
        setTestResult({
          success: true,
          message: `Connection successful! Detected ${workshops.length} upcoming workshops in your spreadsheet rows.`,
          data: workshops
        });
      } else {
        setTestResult({
          success: false,
          message: 'Parsing failed. Verified columns headers in your sheet but found 0 valid rows.'
        });
      }
    } catch (e: any) {
      setTestResult({
        success: false,
        message: `HTTP connection failed. Verify you selected CSV (Comma-separated values) in 'Publish to Web' settings: ${e.message}`
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end">
      {/* Background slide screen overlay */}
      <div
        onClick={onClose}
        onKeyDown={(e) => { if (e.key === 'Escape') onClose(); }}
        role="button"
        tabIndex={0}
        aria-label="Exit settings dashboard"
        className="absolute inset-0 bg-brand-earth/50 backdrop-blur-xs transition-opacity animate-fade-in"
      />

      {/* Main Admin Sidebar Drawer content */}
      <div 
        id="admin-panel-sidebar"
        className="bg-brand-parchment w-full max-w-2xl h-full shadow-2xl relative z-10 border-l border-brand-earth/10 flex flex-col animate-slide-left overflow-hidden"
      >
        {/* Header Drawer Title */}
        <div className="p-6 md:p-8 border-b border-brand-earth/10 flex items-center justify-between bg-brand-sand">
          <div className="flex items-center gap-2.5">
            <Settings className="w-5 h-5 text-brand-terracotta" />
            <div>
              <h3 className="font-serif text-lg text-brand-earth font-bold">Studio Setup Room</h3>
              <span className="text-[10px] font-mono uppercase tracking-widest text-brand-clay block mt-0.5">
                Google Sheets & Webhook settings (Free CMS)
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close admin control panel"
            className="p-1.5 rounded-full hover:bg-brand-earth/5 text-brand-earth hover:text-brand-terracotta transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Setup Instructions & Admin Fields */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
          
          {/* Quick info introduction card */}
          <div className="bg-brand-sand border border-brand-clay/15 rounded-xl p-5 flex gap-4">
            <Info className="w-5 h-5 text-brand-terracotta shrink-0 mt-0.5" />
            <div className="text-xs font-sans text-brand-earth/80 space-y-1">
              <span className="font-bold text-brand-earth block mb-0.5">High Efficiency 0-Fee Architecture</span>
              <p>We use Google Sheets as a fully custom Content Management System. The owner gets unlimited updates, zero coding setup, and 100% free hosting permanently on our site.</p>
            </div>
          </div>

          {/* Setup Guide Step-by-Step */}
          <div className="space-y-6">
            <h4 className="font-serif text-sm uppercase tracking-widest text-brand-earth font-bold border-b border-brand-earth/5 pb-1.5 flex items-center gap-2">
              <Database className="w-4.5 h-4.5 text-brand-clay" />
              <span>Step-by-Step Spreadsheet Wizard</span>
            </h4>

            {/* STEP 1 */}
            <div className="space-y-3">
              <span className="inline-flex py-1 px-2 text-[10px] font-mono font-bold uppercase tracking-wider bg-brand-earth text-brand-sand rounded">
                Step 1: Create Google Sheet & Add Headers
              </span>
              <p className="font-sans text-brand-earth/70 text-xs">
                Create a standard blank Google Sheet in your personal Google Drive account. Add these exact text strings in Row 1 as headers:
              </p>

              {/* Display table header visualization */}
              <div className="bg-brand-sand border border-brand-earth/10 p-4 rounded-lg overflow-x-auto text-[10px] uppercase tracking-wider font-mono text-brand-earth leading-none">
                <div className="flex divide-x divide-brand-earth/15 whitespace-nowrap">
                  <span className="px-2 font-bold text-brand-terracotta">Workshop Title</span>
                  <span className="px-2">Description</span>
                  <span className="px-2">Date</span>
                  <span className="px-2">Morning Slot</span>
                  <span className="px-2">Afternoon Slot</span>
                  <span className="px-2">Maximum Seats</span>
                  <span className="px-2">Available Seats</span>
                  <span className="px-2">Price</span>
                  <span className="px-2">Workshop Image</span>
                </div>
              </div>

              {/* Multi action Copy button */}
              <button
                onClick={copyHeadersToClipboard}
                id="copy-headers-btn"
                className="flex items-center gap-1.5 text-xs text-brand-terracotta font-semibold hover:text-brand-earth transition-colors border border-brand-clay/20 bg-brand-clay/5 px-3.5 py-2 rounded cursor-pointer mt-2"
              >
                {copiedHeaders ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-600" />
                    <span>Headers Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Row 1 Headers (Paste in Google Sheets)</span>
                  </>
                )}
              </button>
            </div>

            {/* STEP 2 */}
            <div className="space-y-2.5 pt-4">
              <span className="inline-flex py-1 px-2 text-[10px] font-mono font-bold uppercase tracking-wider bg-brand-earth text-brand-sand rounded">
                Step 2: Publish Your Sheet to the Web
              </span>
              <ul className="list-decimal list-inside font-sans text-brand-earth/70 text-xs space-y-1">
                <li>On your Sheet top toolbar, click <span className="font-bold text-brand-earth">File ➔ Share ➔ Publish to the Web</span>.</li>
                <li>Choose <span className="font-bold text-brand-earth">Sheet1</span> (or Entire Document) instead of "Web Page".</li>
                <li>Under formatting selector, choose <span className="font-bold text-brand-terracotta">Comma-separated values (.csv)</span>.</li>
                <li>Click <span className="font-bold text-brand-earth">Publish</span>, copy the generated link, and paste it into the "Google Sheets CSV URL" field below!</li>
              </ul>
            </div>

            {/* STEP 3 (Apps Script) */}
            <div className="space-y-3 pt-4">
              <span className="inline-flex py-1 px-2 text-[10px] font-mono font-bold uppercase tracking-wider bg-brand-earth text-brand-sand rounded">
                Step 3: Free Booking Write-Back (Optional)
              </span>
              <p className="font-sans text-brand-earth/70 text-xs">
                To capture visitor workshop reservations straight back into your sheet in real time, we provide a secure, free Apps Script link. 
              </p>
              <ul className="list-decimal list-inside font-sans text-brand-earth/70 text-xs space-y-1 mb-2">
                <li>Inside your sheet, click <span className="font-bold text-brand-earth">Extensions ➔ Apps Script</span>.</li>
                <li>Delete any default filler code, copy our block code below, and paste it.</li>
                <li>Click <span className="font-weight-bold font-bold text-brand-earth">Deploy ➔ New Deployment</span>. Select type: <span className="font-bold">Web App</span>.</li>
                <li>Execute access as: <span className="font-bold text-brand-terracotta">Me</span> and Who has access: <span className="font-bold text-brand-terracotta">Anyone</span> (so users can submit). Click deploy, copy the Web App URL, and paste below!</li>
              </ul>

              {/* Collapsed view snippet */}
              <div className="relative">
                <pre className="p-4 bg-brand-earth text-brand-sand font-mono text-[10px] rounded-lg max-h-40 overflow-y-auto overflow-x-hidden border border-brand-clay/20 leading-relaxed text-left">
                  {appsScriptCode}
                </pre>
                
                {/* Float copies actions */}
                <button
                  onClick={copyScriptToClipboard}
                  id="copy-script-btn"
                  className="absolute top-2 right-2 bg-brand-parchment hover:bg-white text-brand-earth border border-brand-earth/10 p-1.5 rounded cursor-pointer shadow-sm transition-all text-[10px] font-sans font-bold flex items-center gap-1"
                >
                  {copiedScript ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>

          {/* Form Setup Fields */}
          <div className="space-y-6 pt-6 border-t border-brand-earth/10">
            <h4 className="font-serif text-sm uppercase tracking-widest text-brand-earth font-bold flex items-center gap-2">
              <CloudLightning className="w-4.5 h-4.5 text-brand-clay" />
              <span>Connect Spreadsheet Endpoints</span>
            </h4>

            {/* Sheets Input */}
            <div>
              <label htmlFor="sheets-csv-url-input" className="text-[11px] font-mono uppercase tracking-widest text-brand-earth/50 font-bold block mb-2">
                Google Sheets CSV Export URL
              </label>
              <input
                type="url"
                id="sheets-csv-url-input"
                placeholder="https://docs.google.com/spreadsheets/d/e/2PACX-1v.../pub?gid=0&single=true&output=csv"
                value={sheetCsvUrl}
                onChange={(e) => setSheetCsvUrl(e.target.value)}
                className="w-full bg-white border border-brand-earth/15 outline-none focus:border-brand-terracotta px-4 py-3.5 rounded text-xs text-brand-earth font-mono transition-colors"
              />
              <span className="text-[10px] text-brand-earth/40 mt-1.5 block">
                Must terminate with <code className="font-bold text-brand-terracotta">output=csv</code>. Leave empty and save to restore pre-compiled default workshops.
              </span>
            </div>

            {/* Scripts Input */}
            <div>
              <label htmlFor="apps-script-url-input" className="text-[11px] font-mono uppercase tracking-widest text-brand-earth/50 font-bold block mb-2">
                Google Apps Script Web App Endpoint URL (Optional)
              </label>
              <input
                type="url"
                id="apps-script-url-input"
                placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                value={appsScriptUrl}
                onChange={(e) => setAppsScriptUrl(e.target.value)}
                className="w-full bg-white border border-brand-earth/15 outline-none focus:border-brand-terracotta px-4 py-3.5 rounded text-xs text-brand-earth font-mono transition-colors"
              />
              <span className="text-[10px] text-brand-earth/40 mt-1.5 block animate-fade-in">
                Terminates with <code className="font-bold text-brand-clay">/exec</code>. Submits visitor bookings instantly back to your "Bookings" sheet tab!
              </span>
            </div>

            {/* Setup testing results feedbacks and overlays */}
            {testResult && (
              <div
                id="setup-test-callback-box"
                className={`p-4 rounded-xl border font-sans text-xs flex gap-3 ${
                  testResult.success
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}
              >
                {testResult.success ? (
                  <Database className="w-5 h-5 shrink-0 mt-0.5" />
                ) : (
                  <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
                )}
                <div>
                  <span className="font-bold block mb-0.5">{testResult.success ? 'Success!' : 'Configuration Warning'}</span>
                  <p>{testResult.message}</p>
                  
                  {testResult.success && testResult.data && (
                    <div className="mt-3 bg-white/60 rounded border border-emerald-200/50 p-2.5 space-y-1 uppercase font-mono text-[9px] tracking-wider text-emerald-900 leading-tight">
                      <span className="font-bold border-b border-emerald-300 block pb-0.5 mb-1.5 text-[10px]">Row entries detected:</span>
                      {testResult.data.map((ws, index) => (
                        <div key={index} className="flex justify-between">
                          <span>Row#{index + 1}: {ws.title}</span>
                          <span className="font-bold">Date: {ws.date}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Single Source of Truth Diagnostic Check */}
            <div className="mt-8 pt-6 border-t border-brand-earth/10 space-y-4">
              <h4 className="font-serif text-sm uppercase tracking-widest text-brand-earth font-bold flex items-center gap-2">
                <Database className="w-4.5 h-4.5 text-brand-clay" />
                <span>Single Source of Truth Check</span>
              </h4>
              
              <div className="bg-emerald-50/50 border border-emerald-200/50 rounded-xl p-4 space-y-3 text-left">
                <div className="flex items-start gap-2.5">
                  <Info className="w-4.5 h-4.5 text-emerald-700 shrink-0 mt-0.5" />
                  <div className="text-xs font-sans text-emerald-900 leading-relaxed">
                    <strong>Primacy of Google Sheets:</strong> Workshop seat capacities and <strong>Fully Booked / Join Waitlist</strong> states are calculated exclusively from live Google Sheets booking data fetched via Google Apps Script. 
                    <br /><br />
                    Local storage records are strictly ignored during seat arithmetic. Deleting or editing rows in your Google Sheet's <em>Bookings</em> sheet tab will immediately adjust wheel slot counts on the visitor website once updated.
                  </div>
                </div>
              </div>
            </div>

            {/* Action controls button */}
            <div className="flex gap-4 pt-2">
              <button
                type="button"
                onClick={handleTestAndSave}
                disabled={isTesting}
                id="test-save-settings-btn"
                className="flex-1 bg-brand-terracotta hover:bg-brand-earth disabled:bg-brand-earth/40 text-white font-sans font-semibold text-xs tracking-wider uppercase py-4 rounded shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isTesting ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white/25 border-t-white animate-spin block" />
                    <span>Compiling & Verifying Spreadsheet...</span>
                  </>
                ) : (
                  <>
                    <CloudLightning className="w-4 h-4" />
                    <span>Test & Save Sheet URL</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-6 py-4 bg-transparent hover:bg-brand-earth/5 text-brand-earth/70 font-sans font-semibold text-xs tracking-wider uppercase border border-brand-earth/15 rounded transition-colors cursor-pointer"
              >
                Close Panel
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
