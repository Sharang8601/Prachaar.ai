import React, { useState, useRef } from 'react';
import {
  TrendingUp, Upload, MessageSquare, ImagePlus, Send,
  FileSpreadsheet, Sun, Moon, Globe, User, ChevronDown,
  AtSign, Hash, Share2, X
} from 'lucide-react';

// ─── P_growth Logo ───────────────────────────────────────────────────────────
function PrachaarLogo() {
  return (
    <div className="flex items-center gap-2 select-none">
      {/* Icon: bold "P" layered with a TrendingUp arrow */}
      <div className="relative w-9 h-9 flex items-center justify-center">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background: '#25D366' }}
        >
          <span className="text-white font-black text-xl leading-none" style={{ fontFamily: 'system-ui' }}>
            P
          </span>
          <TrendingUp
            className="absolute bottom-0 right-0 translate-x-1 translate-y-1"
            style={{ width: 14, height: 14, color: '#1a1a1a', strokeWidth: 2.5 }}
          />
        </div>
      </div>
      <span className="text-xl font-extrabold tracking-tight text-gray-900">
        Prachaar<span style={{ color: '#25D366' }}>.ai</span>
      </span>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [darkMode, setDarkMode]     = useState(false);
  const [lang, setLang]             = useState('en');
  const [numbers, setNumbers]       = useState('');
  const [message, setMessage]       = useState('');
  const [posterUrl, setPosterUrl]   = useState(null);
  const [dragging, setDragging]     = useState(false);
  const [socialOpen, setSocialOpen] = useState(false);
  const [social, setSocial]         = useState({ instagram: '', twitter: '', facebook: '' });
  const fileInputRef = useRef(null);

  // Count valid phone numbers (≥10 digits)
  const countNumbers = () => {
    if (!numbers.trim()) return 0;
    return numbers.split('\n').filter(n => n.replace(/\D/g, '').length >= 10).length;
  };

  // Handle CSV/Excel file drop or select
  const handleFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split(/[\r\n,;]+/).filter(t => t.replace(/\D/g, '').length >= 10);
      setNumbers(prev => [...new Set([...prev.split('\n'), ...lines])].filter(Boolean).join('\n'));
    };
    reader.readAsText(file);
  };

  // Handle image poster upload
  const handlePosterUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) setPosterUrl(URL.createObjectURL(file));
  };

  const bg       = darkMode ? '#1a1a1a' : '#f5f4f0';
  const surface  = darkMode ? '#2a2a2a' : '#ffffff';
  const border   = darkMode ? '#3a3a3a' : '#e5e7eb';
  const textMain = darkMode ? '#f3f4f6' : '#111827';
  const textSub  = darkMode ? '#9ca3af' : '#6b7280';
  const inputBg  = darkMode ? '#1f1f1f' : '#ffffff';

  const t = {
    en: {
      title: 'New Campaign',
      subtitle: 'Reach your customers in 2 minutes via WhatsApp.',
      step1: 'Step 1 — Contacts',
      who: 'Who are we sending to?',
      pasteLabel: 'Paste Phone Numbers (one per line)',
      pastePlaceholder: '9876543210\n9123456789\n...',
      detected: 'valid numbers detected',
      orUpload: 'OR upload a file',
      dragDrop: 'Drag & drop Excel / CSV here',
      clickUpload: 'or click to browse',
      step2: 'Step 2 — Message & Poster',
      posterLabel: 'AI Poster',
      generatePoster: 'Generate AI Poster',
      uploadPoster: 'Upload your own poster',
      messageLabel: 'Message',
      messagePlaceholder: 'Type your campaign message here…\n\nHi {name}, 🎉 Big sale today at our store!',
      socialLabel: 'Add Social Media IDs (optional)',
      sendBtn: (n) => `Send to ${n} Customers Now`,
    },
    hi: {
      title: 'नया अभियान',
      subtitle: 'WhatsApp पर 2 मिनट में अपने ग्राहकों तक पहुँचें।',
      step1: 'चरण 1 — संपर्क',
      who: 'हम किसे भेज रहे हैं?',
      pasteLabel: 'फोन नंबर दर्ज करें (एक प्रति पंक्ति)',
      pastePlaceholder: '9876543210\n9123456789\n...',
      detected: 'वैध नंबर मिले',
      orUpload: 'या फाइल अपलोड करें',
      dragDrop: 'Excel / CSV यहाँ खींचें',
      clickUpload: 'या क्लिक करें',
      step2: 'चरण 2 — संदेश और पोस्टर',
      posterLabel: 'AI पोस्टर',
      generatePoster: 'AI पोस्टर बनाएँ',
      uploadPoster: 'अपना पोस्टर अपलोड करें',
      messageLabel: 'संदेश',
      messagePlaceholder: 'यहाँ अपना संदेश लिखें…',
      socialLabel: 'सोशल मीडिया ID जोड़ें (वैकल्पिक)',
      sendBtn: (n) => `${n} ग्राहकों को अभी भेजें`,
    },
  };
  const tx = t[lang];

  return (
    <div className="min-h-screen font-sans transition-colors duration-300" style={{ background: bg, color: textMain }}>

      {/* ── TOP NAV ── */}
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 shadow-sm"
        style={{ background: surface, borderBottom: `1px solid ${border}` }}
      >
        <PrachaarLogo />

        <div className="flex items-center gap-3">
          {/* Language toggle */}
          <button
            onClick={() => setLang(l => l === 'en' ? 'hi' : 'en')}
            className="flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-full border transition hover:opacity-80"
            style={{ borderColor: border, color: textSub }}
          >
            <Globe size={14} />
            {lang === 'en' ? 'English / हिंदी' : 'हिंदी / English'}
          </button>

          {/* Dark mode toggle */}
          <button
            onClick={() => setDarkMode(d => !d)}
            className="w-9 h-9 rounded-full flex items-center justify-center border transition hover:opacity-80"
            style={{ borderColor: border, color: textSub }}
            title={darkMode ? 'Light mode' : 'Dark mode'}
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Avatar */}
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-sm"
            style={{ background: '#25D366' }}
            title="Profile"
          >
            <User size={16} />
          </div>
        </div>
      </nav>

      {/* ── MAIN ── */}
      <main className="max-w-6xl mx-auto px-4 py-8">

        {/* Page header */}
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold tracking-tight" style={{ color: textMain }}>
            {tx.title}
          </h2>
          <p className="mt-1 text-base" style={{ color: textSub }}>{tx.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ── LEFT COLUMN: CONTACTS ── */}
          <div
            className="rounded-2xl p-6 shadow-sm"
            style={{ background: surface, border: `1px solid ${border}` }}
          >
            {/* Step badge */}
            <div className="flex items-center gap-2 mb-5">
              <span
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ background: '#25D366' }}
              >1</span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#25D366' }}>{tx.step1}</p>
                <h3 className="text-lg font-bold" style={{ color: textMain }}>{tx.who}</h3>
              </div>
            </div>

            {/* Phone number textarea */}
            <label className="block text-sm font-medium mb-1.5" style={{ color: textSub }}>
              {tx.pasteLabel}
            </label>
            <div className="relative">
              <textarea
                className="w-full rounded-xl p-3 text-sm resize-none outline-none transition"
                style={{
                  background: inputBg,
                  border: `1.5px solid ${border}`,
                  color: textMain,
                  minHeight: 140,
                }}
                onFocus={e => (e.target.style.borderColor = '#25D366')}
                onBlur={e => (e.target.style.borderColor = border)}
                rows={6}
                placeholder={tx.pastePlaceholder}
                value={numbers}
                onChange={e => setNumbers(e.target.value)}
                spellCheck={false}
              />
              {/* Live counter badge */}
              <div
                className="absolute bottom-3 right-3 text-xs font-semibold px-2 py-1 rounded-full"
                style={{ background: '#25D366' + '22', color: '#25D366' }}
              >
                ✅ {countNumbers()} {tx.detected}
              </div>
            </div>

            {/* OR divider */}
            <div className="flex items-center my-5 gap-3">
              <div className="flex-1 h-px" style={{ background: border }} />
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: textSub }}>
                {tx.orUpload}
              </span>
              <div className="flex-1 h-px" style={{ background: border }} />
            </div>

            {/* Drag & Drop upload */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={e => {
                e.preventDefault();
                setDragging(false);
                handleFile(e.dataTransfer.files[0]);
              }}
              className="rounded-xl border-2 border-dashed p-8 flex flex-col items-center justify-center gap-2 cursor-pointer transition"
              style={{
                borderColor: dragging ? '#25D366' : border,
                background: dragging ? '#25D36610' : 'transparent',
              }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: '#25D366' + '18' }}
              >
                <FileSpreadsheet size={24} style={{ color: '#25D366' }} />
              </div>
              <p className="text-sm font-semibold" style={{ color: textMain }}>{tx.dragDrop}</p>
              <p className="text-xs" style={{ color: textSub }}>{tx.clickUpload}</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls,.txt"
                className="hidden"
                onChange={e => handleFile(e.target.files?.[0])}
              />
            </div>
          </div>

          {/* ── RIGHT COLUMN: POSTER & MESSAGE ── */}
          <div
            className="rounded-2xl p-6 shadow-sm flex flex-col gap-5"
            style={{ background: surface, border: `1px solid ${border}` }}
          >
            {/* Step badge */}
            <div className="flex items-center gap-2">
              <span
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ background: '#25D366' }}
              >2</span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#25D366' }}>{tx.step2}</p>
              </div>
            </div>

            {/* AI Poster area */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: textSub }}>{tx.posterLabel}</label>
              {posterUrl ? (
                <div className="relative rounded-xl overflow-hidden" style={{ border: `1.5px solid ${border}` }}>
                  <img src={posterUrl} alt="Campaign poster" className="w-full object-cover max-h-48" />
                  <button
                    onClick={() => setPosterUrl(null)}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-5 text-sm font-semibold transition hover:opacity-80"
                    style={{ borderColor: '#25D366', color: '#25D366' }}
                    onClick={() => alert('AI poster generation coming soon!')}
                  >
                    <ImagePlus size={22} />
                    {tx.generatePoster}
                  </button>
                  <label
                    className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-5 text-sm font-semibold cursor-pointer transition hover:opacity-80"
                    style={{ borderColor: border, color: textSub }}
                  >
                    <Upload size={22} />
                    {tx.uploadPoster}
                    <input type="file" accept="image/*" className="hidden" onChange={handlePosterUpload} />
                  </label>
                </div>
              )}
            </div>

            {/* Message Composer */}
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1.5" style={{ color: textSub }}>
                <MessageSquare size={13} className="inline mr-1" />
                {tx.messageLabel}
              </label>
              <textarea
                className="w-full rounded-xl p-3 text-sm resize-none outline-none transition"
                style={{
                  background: inputBg,
                  border: `1.5px solid ${border}`,
                  color: textMain,
                  minHeight: 110,
                }}
                onFocus={e => (e.target.style.borderColor = '#25D366')}
                onBlur={e => (e.target.style.borderColor = border)}
                rows={4}
                placeholder={tx.messagePlaceholder}
                value={message}
                onChange={e => setMessage(e.target.value)}
              />
              <div className="flex items-center gap-2 mt-1.5">
                {['😊', '🎉', '🛒', '📣', '🔥'].map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => setMessage(m => m + emoji)}
                    className="text-lg hover:scale-125 transition-transform"
                    title={`Insert ${emoji}`}
                  >{emoji}</button>
                ))}
              </div>
            </div>

            {/* Social Media IDs (collapsible) */}
            <div>
              <button
                onClick={() => setSocialOpen(o => !o)}
                className="flex items-center gap-1.5 text-sm font-medium transition hover:opacity-80"
                style={{ color: textSub }}
              >
                <ChevronDown
                  size={15}
                  className="transition-transform"
                  style={{ transform: socialOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                />
                {tx.socialLabel}
              </button>
              {socialOpen && (
                <div className="mt-3 grid grid-cols-1 gap-2">
                  {[
                    { key: 'instagram', Icon: AtSign,  placeholder: '@your_instagram' },
                    { key: 'twitter',   Icon: Hash,    placeholder: '@your_twitter'   },
                    { key: 'facebook',  Icon: Share2,  placeholder: 'facebook.com/yourpage' },
                  ].map(({ key, Icon, placeholder }) => (
                    <div key={key} className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ background: inputBg, border: `1.5px solid ${border}` }}>
                      <Icon size={15} style={{ color: textSub }} />
                      <input
                        type="text"
                        placeholder={placeholder}
                        value={social[key]}
                        onChange={e => setSocial(s => ({ ...s, [key]: e.target.value }))}
                        className="flex-1 bg-transparent text-sm outline-none"
                        style={{ color: textMain }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── BOTTOM ACTION BAR ── */}
        <div
          className="mt-8 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ background: surface, border: `1px solid ${border}` }}
        >
          <div style={{ color: textSub }} className="text-sm text-center sm:text-left">
            <span className="font-bold text-base" style={{ color: textMain }}>{countNumbers()}</span> contacts · 1 message · {posterUrl ? '1 poster' : 'no poster'}
          </div>
          <button
            className="flex items-center gap-2 text-white font-bold text-base py-4 px-8 rounded-full shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95"
            style={{ background: '#25D366', minWidth: 280 }}
            onClick={() => alert(`🚀 Sending to ${countNumbers()} customers…`)}
          >
            <Send size={18} />
            {tx.sendBtn(countNumbers())}
          </button>
        </div>

      </main>

      {/* ── FOOTER ── */}
      <footer className="text-center py-6 text-xs" style={{ color: textSub }}>
        © {new Date().getFullYear()} Prachaar.ai &mdash; Powered by WhatsApp Business API
      </footer>
    </div>
  );
}