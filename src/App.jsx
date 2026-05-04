import React, { useState } from 'react';
import { MessageCircle, Image as ImageIcon, Send, FileSpreadsheet } from 'lucide-react';

function App() {
  const [numbers, setNumbers] = useState('');
  
  // A simple function to count lines/numbers pasted by the user
  const countNumbers = () => {
    if (!numbers.trim()) return 0;
    return numbers.split('\n').filter(n => n.trim().length >= 10).length;
  };

  return (
    <div className="min-h-screen font-sans text-gray-800">
      
      {/* TOP NAVIGATION */}
      <nav className="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <MessageCircle className="text-wa w-8 h-8" />
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Prachaar.ai</h1>
        </div>
        <div className="space-x-4">
          <button className="text-sm font-medium text-gray-600 hover:text-gray-900">English / हिंदी</button>
          <div className="w-8 h-8 bg-gray-200 rounded-full inline-block"></div> {/* Mock User Avatar */}
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="max-w-5xl mx-auto p-6 mt-6">
        
        {/* Step Indicator */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">New Campaign</h2>
          <p className="text-gray-500 mt-1">Send your AI poster to your customers in 2 minutes.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* LEFT COLUMN: Contacts */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <span className="bg-black text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">1</span>
              <h3 className="text-xl font-semibold">Who are we sending to?</h3>
            </div>

            {/* Paste Numbers Area */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Paste Phone Numbers (One per line)</label>
              <textarea 
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-wa focus:border-wa outline-none"
                rows="6"
                placeholder="9876543210&#10;9123456789&#10;..."
                value={numbers}
                onChange={(e) => setNumbers(e.target.value)}
              ></textarea>
              <div className="mt-2 text-sm font-medium text-wa bg-green-50 px-3 py-2 rounded-md inline-block">
                ✅ {countNumbers()} valid numbers detected
              </div>
            </div>

            <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">OR</span>
                <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {/* Upload Excel Area */}
            <div className="mt-4 border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition cursor-pointer">
              <FileSpreadsheet className="mx-auto text-gray-400 mb-2 w-10 h-10" />
              <p className="text-sm font-medium text-gray-700">Upload Excel or CSV</p>
              <p className="text-xs text-gray-500 mt-1">Drag and drop your customer list here</p>
            </div>
          </div>

          {/* RIGHT COLUMN: Poster & Message (Placeholder for next step) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 opacity-60">
            <div className="flex items-center space-x-2 mb-4">
              <span className="bg-gray-300 text-gray-600 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">2</span>
              <h3 className="text-xl font-semibold">Message & Poster</h3>
            </div>
            
            <button disabled className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-500">
              <ImageIcon className="w-8 h-8 mb-2" />
              <span className="font-medium">Generate AI Poster</span>
            </button>
            <div className="mt-4 h-24 bg-gray-100 rounded-lg border border-gray-200"></div>
          </div>

        </div>

        {/* BOTTOM ACTION BAR */}
        <div className="mt-10 flex justify-end border-t pt-6">
          <button className="bg-wa hover:bg-green-600 text-white font-bold text-lg py-4 px-8 rounded-full shadow-lg flex items-center transition transform hover:-translate-y-1">
            <Send className="w-5 h-5 mr-2" />
            Send to {countNumbers() || 0} Customers Now
          </button>
        </div>

      </main>
    </div>
  );
}

export default App;