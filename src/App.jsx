import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  AtSign,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Cloud,
  FileSpreadsheet,
  Globe2,
  Hash,
  ImagePlus,
  Languages,
  Link2,
  Loader2,
  MessageSquareText,
  Moon,
  Palette,
  Phone,
  PlayCircle,
  Send,
  Settings2,
  ShieldCheck,
  Sparkles,
  Sun,
  Upload,
  UserRound,
  WandSparkles,
  X,
} from 'lucide-react';
import { extractContactTextFromFile, parseContactsFromText } from './lib/contacts';
import {
  WHATSAPP_PROVIDERS,
  buildProviderPayload,
  isProviderConfigured,
} from './lib/whatsappProviders';

const STORAGE_KEYS = {
  theme: 'broadcastwa-theme',
  lang: 'broadcastwa-lang',
  brand: 'broadcastwa-brand',
  api: 'broadcastwa-api',
};

const brandTypes = ['Salon', 'Gym', 'Spa', 'Restaurant', 'Retail Shop', 'Clinic'];
const offerTypes = ['Today Offer', 'Festival Greeting', 'Weekly Promo', 'Membership', 'New Service'];
const posterStyles = ['Vibrant', 'Elegant', 'Festive', 'Modern'];

const festivalIdeas = [
  { name: 'Summer Offer', month: 'May', tone: 'cooling service bundle' },
  { name: 'Raksha Bandhan', month: 'August', tone: 'family gifting' },
  { name: 'Independence Day', month: 'August', tone: 'tricolor sale' },
  { name: 'Janmashtami', month: 'August', tone: 'festive greeting' },
  { name: 'Ganesh Chaturthi', month: 'September', tone: 'auspicious launch' },
  { name: 'Navratri', month: 'September/October', tone: 'celebration package' },
  { name: 'Dussehra', month: 'October', tone: 'victory offer' },
  { name: 'Diwali', month: 'October/November', tone: 'premium festive sale' },
  { name: 'Christmas', month: 'December', tone: 'year-end delight' },
  { name: "New Year's Eve", month: 'December', tone: 'party-ready package' },
];

const translations = {
  en: {
    navSubtitle: 'WhatsApp campaign cockpit',
    newCampaign: 'New Campaign',
    brand: 'Brand',
    contacts: 'Contacts',
    poster: 'Poster',
    message: 'Message',
    preview: 'Preview',
    apiSetup: 'API Setup',
    liveProgress: 'Live Progress',
    businessProfile: 'Business profile',
    businessName: 'Business name',
    businessType: 'Business type',
    city: 'City',
    phone: 'Booking phone',
    logo: 'Logo',
    uploadLogo: 'Upload logo',
    social: 'Social handles',
    instagram: 'Instagram',
    facebook: 'Facebook',
    youtube: 'YouTube',
    twitter: 'Twitter/X',
    providerTitle: 'Customer WhatsApp API',
    providerIntro: 'Choose the route your customer already has. The backend can normalize all of them through one broadcast adapter.',
    connectionReady: 'Connection details complete',
    connectionMissing: 'Add required API fields',
    openDocs: 'Docs',
    pasteNumbers: 'Paste or import numbers',
    pastePlaceholder: '9876543210\n+91 91234 56789\ncustomer, 9988776655',
    uploadContacts: 'Upload CSV / TXT / XLSX',
    valid: 'valid',
    duplicates: 'duplicates',
    invalid: 'invalid',
    fileReady: 'Imported',
    offerDetails: 'Offer details',
    offerType: 'Offer type',
    offerValue: 'Offer value',
    posterStyle: 'Poster style',
    generatePoster: 'Generate poster draft',
    uploadPoster: 'Upload poster',
    messageTemplate: 'Message template',
    messageLanguage: 'Message language',
    english: 'English',
    hindi: 'Hindi',
    both: 'Both',
    characterCount: 'characters',
    festivalBanner: 'Upcoming campaign idea',
    useTemplate: 'Use template',
    sendNow: 'Send now',
    sending: 'Sending...',
    summary: 'Campaign summary',
    sent: 'Sent',
    failed: 'Failed',
    total: 'Total',
    noPoster: 'No poster yet',
    readyToSend: 'Ready to send',
    needsAttention: 'Needs attention',
    tokenNote: 'Production backend should encrypt tokens and send only approved WhatsApp templates.',
  },
  hi: {
    navSubtitle: 'WhatsApp अभियान कॉकपिट',
    newCampaign: 'नया अभियान',
    brand: 'ब्रांड',
    contacts: 'संपर्क',
    poster: 'पोस्टर',
    message: 'संदेश',
    preview: 'प्रीव्यू',
    apiSetup: 'API सेटअप',
    liveProgress: 'लाइव प्रगति',
    businessProfile: 'बिजनेस प्रोफाइल',
    businessName: 'बिजनेस नाम',
    businessType: 'बिजनेस प्रकार',
    city: 'शहर',
    phone: 'बुकिंग फोन',
    logo: 'लोगो',
    uploadLogo: 'लोगो अपलोड करें',
    social: 'सोशल हैंडल',
    instagram: 'इंस्टाग्राम',
    facebook: 'फेसबुक',
    youtube: 'यूट्यूब',
    twitter: 'ट्विटर/X',
    providerTitle: 'ग्राहक का WhatsApp API',
    providerIntro: 'ग्राहक जिसके API का इस्तेमाल करता है, वही चुनें। बैकेंड सबको एक ब्रॉडकास्ट एडेप्टर में बदल सकता है।',
    connectionReady: 'कनेक्शन जानकारी पूरी है',
    connectionMissing: 'जरूरी API जानकारी जोड़ें',
    openDocs: 'डॉक्स',
    pasteNumbers: 'नंबर पेस्ट या इम्पोर्ट करें',
    pastePlaceholder: '9876543210\n+91 91234 56789\ncustomer, 9988776655',
    uploadContacts: 'CSV / TXT / XLSX अपलोड करें',
    valid: 'वैध',
    duplicates: 'डुप्लिकेट',
    invalid: 'अमान्य',
    fileReady: 'इम्पोर्ट हुआ',
    offerDetails: 'ऑफर विवरण',
    offerType: 'ऑफर प्रकार',
    offerValue: 'ऑफर वैल्यू',
    posterStyle: 'पोस्टर स्टाइल',
    generatePoster: 'पोस्टर ड्राफ्ट बनाएं',
    uploadPoster: 'पोस्टर अपलोड करें',
    messageTemplate: 'संदेश टेम्पलेट',
    messageLanguage: 'संदेश भाषा',
    english: 'English',
    hindi: 'हिंदी',
    both: 'दोनों',
    characterCount: 'अक्षर',
    festivalBanner: 'आने वाला अभियान आइडिया',
    useTemplate: 'टेम्पलेट लगाएं',
    sendNow: 'अभी भेजें',
    sending: 'भेज रहा है...',
    summary: 'अभियान सारांश',
    sent: 'भेजे गए',
    failed: 'फेल',
    total: 'कुल',
    noPoster: 'अभी पोस्टर नहीं',
    readyToSend: 'भेजने के लिए तैयार',
    needsAttention: 'ध्यान चाहिए',
    tokenNote: 'प्रोडक्शन बैकेंड में टोकन एन्क्रिप्ट करें और केवल approved WhatsApp templates भेजें।',
  },
};

const templateCopy = {
  offer: {
    en: ({ brand, offer }) => `Hi! ${brand.businessName || 'Our store'} has a special offer today: ${offer.value || '20% off'} on selected services. Book now: ${brand.phone || 'your number'}`,
    hi: ({ brand, offer }) => `नमस्ते! ${brand.businessName || 'हमारे स्टोर'} में आज खास ऑफर है: ${offer.value || '20% छूट'} चुनिंदा सेवाओं पर। अभी बुक करें: ${brand.phone || 'आपका नंबर'}`,
  },
  festival: {
    en: ({ brand, festival }) => `${festival.name} wishes from ${brand.businessName || 'our team'}! Celebrate with our ${festival.tone} offer in ${brand.city || 'your city'}.`,
    hi: ({ brand, festival }) => `${brand.businessName || 'हमारी टीम'} की ओर से ${festival.name} की शुभकामनाएं! ${brand.city || 'आपके शहर'} में हमारा खास ऑफर पाएं।`,
  },
  promo: {
    en: ({ brand, offer }) => `This week at ${brand.businessName || 'our business'}: ${offer.value || 'premium service bundle'} for loyal customers. Reply on WhatsApp to reserve your slot.`,
    hi: ({ brand, offer }) => `इस हफ्ते ${brand.businessName || 'हमारे बिजनेस'} पर: ${offer.value || 'प्रीमियम सर्विस बंडल'}। अपना स्लॉट बुक करने के लिए WhatsApp पर जवाब दें।`,
  },
  membership: {
    en: ({ brand }) => `Join the ${brand.businessName || 'business'} membership plan and get exclusive monthly benefits. Limited seats this week.`,
    hi: ({ brand }) => `${brand.businessName || 'बिजनेस'} मेंबरशिप प्लान जॉइन करें और हर महीने खास फायदे पाएं। इस हफ्ते सीमित सीटें।`,
  },
  custom: {
    en: () => '',
    hi: () => '',
  },
};

function getStoredValue(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function useStoredState(key, fallback) {
  const [value, setValue] = useState(() => getStoredValue(key, fallback));

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

function initials(name) {
  return String(name || 'BWA')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || 'B';
}

function Field({ label, children }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <Field label={label}>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </Field>
  );
}

function TextField({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <Field label={label}>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </Field>
  );
}

function Section({ title, icon: Icon, action, children }) {
  return (
    <section className="panel">
      <div className="panel-title">
        <div className="panel-heading">
          <Icon size={18} />
          <h2>{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function Metric({ label, value, tone = 'neutral' }) {
  return (
    <div className={`metric metric-${tone}`}>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function SegmentControl({ options, value, onChange }) {
  return (
    <div className="segments">
      {options.map((option) => (
        <button
          key={option.value}
          className={value === option.value ? 'active' : ''}
          type="button"
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

async function loadImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = url;
  });
}

async function makePosterDraft({ brand, offer, language, festival }) {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1080;
  const ctx = canvas.getContext('2d');
  const green = '#25D366';
  const ink = '#102019';
  const cream = '#fff7e2';
  const coral = '#ff6f61';
  const teal = '#0f766e';

  ctx.fillStyle = cream;
  ctx.fillRect(0, 0, 1080, 1080);
  ctx.fillStyle = ink;
  ctx.fillRect(0, 0, 1080, 270);
  ctx.fillStyle = green;
  ctx.fillRect(0, 270, 1080, 26);
  ctx.fillStyle = coral;
  ctx.fillRect(74, 368, 932, 14);
  ctx.fillStyle = teal;
  ctx.fillRect(74, 900, 932, 92);

  ctx.fillStyle = '#ffffff';
  ctx.font = '700 42px "Plus Jakarta Sans", Arial';
  ctx.fillText(brand.businessName || 'BroadcastWA Pro', 74, 96);
  ctx.font = '500 27px "Plus Jakarta Sans", Arial';
  ctx.fillText(`${brand.businessType || 'Business'} • ${brand.city || 'Your city'}`, 74, 144);

  ctx.fillStyle = '#153528';
  ctx.font = '800 80px "Plus Jakarta Sans", Arial';
  ctx.fillText(offer.value || '30% OFF', 74, 500);

  ctx.fillStyle = '#30433a';
  ctx.font = '600 37px "Plus Jakarta Sans", Arial';
  ctx.fillText(offer.type || festival.name, 74, 570);

  ctx.fillStyle = '#40544b';
  ctx.font = language === 'hi' ? '500 34px "Noto Sans Devanagari", Arial' : '500 34px "Plus Jakarta Sans", Arial';
  const posterLine = language === 'hi'
    ? 'आज ही अपना स्लॉट बुक करें'
    : `Book now with ${brand.businessName || 'us'}`;
  ctx.fillText(posterLine, 74, 650);

  if (brand.logoUrl) {
    try {
      const logo = await loadImage(brand.logoUrl);
      ctx.save();
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(815, 64, 170, 170);
      ctx.clip();
      ctx.drawImage(logo, 815, 64, 170, 170);
      ctx.restore();
    } catch {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(815, 64, 170, 170);
    }
  } else {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(815, 64, 170, 170);
    ctx.fillStyle = green;
    ctx.font = '800 58px "Plus Jakarta Sans", Arial';
    ctx.fillText(initials(brand.businessName), 850, 165);
  }

  ctx.fillStyle = '#ffffff';
  ctx.font = '700 31px "Plus Jakarta Sans", Arial';
  const socials = [
    brand.social.instagram && `@${brand.social.instagram.replace(/^@/, '')}`,
    brand.social.facebook,
    brand.social.youtube,
    brand.social.twitter && `X ${brand.social.twitter.replace(/^@/, '')}`,
  ].filter(Boolean).join('  •  ');
  ctx.fillText(socials || brand.phone || 'Follow us on social media', 96, 956);

  return canvas.toDataURL('image/png');
}

function App() {
  const systemDark = typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  const [theme, setTheme] = useStoredState(STORAGE_KEYS.theme, systemDark ? 'dark' : 'light');
  const [lang, setLang] = useStoredState(STORAGE_KEYS.lang, 'en');
  const [brand, setBrand] = useStoredState(STORAGE_KEYS.brand, {
    businessName: 'GlowUp Salon',
    businessType: 'Salon',
    city: 'Jaipur',
    phone: '+91 98765 43210',
    logoUrl: '',
    social: {
      instagram: 'glowup.jaipur',
      facebook: 'GlowUp Jaipur',
      youtube: 'GlowUp Studio',
      twitter: '',
    },
  });
  const [apiConfig, setApiConfig] = useStoredState(STORAGE_KEYS.api, {
    provider: 'meta',
    accessToken: '',
    phoneNumberId: '',
    templateName: '',
    apiEndpoint: '',
    bearerToken: '',
    channelNumber: '',
    apiKey: '',
    campaignName: '',
    source: 'BroadcastWA Pro',
    apiToken: '',
  });
  const [contactText, setContactText] = useState('9876543210\n9123456789\n+91 99887 76655');
  const [fileState, setFileState] = useState({ name: '', error: '' });
  const [offer, setOffer] = useState({
    type: 'Today Offer',
    value: '30% off hair spa',
    style: 'Elegant',
  });
  const [messageLang, setMessageLang] = useState('both');
  const [templateKey, setTemplateKey] = useState('offer');
  const [customMessage, setCustomMessage] = useState('');
  const [festival, setFestival] = useState(festivalIdeas[0]);
  const [posterUrl, setPosterUrl] = useState('');
  const [posterBusy, setPosterBusy] = useState(false);
  const [progress, setProgress] = useState({ status: 'idle', total: 0, sent: 0, failed: 0 });
  const fileInputRef = useRef(null);
  const posterInputRef = useRef(null);
  const logoInputRef = useRef(null);
  const tx = translations[lang];
  const isDark = theme === 'dark';

  const parsedContacts = useMemo(() => parseContactsFromText(contactText), [contactText]);
  const provider = WHATSAPP_PROVIDERS[apiConfig.provider] || WHATSAPP_PROVIDERS.meta;
  const providerReady = isProviderConfigured(apiConfig.provider, apiConfig);
  const message = useMemo(() => {
    if (templateKey === 'custom') return customMessage;

    const compose = (language) => templateCopy[templateKey][language]({ brand, offer, festival });
    return messageLang === 'both' ? `${compose('en')}\n\n${compose('hi')}` : compose(messageLang);
  }, [brand, customMessage, festival, messageLang, offer, templateKey]);
  const canSend = parsedContacts.valid.length > 0 && message.trim() && posterUrl && providerReady;

  const payloadPreview = useMemo(() => buildProviderPayload(apiConfig.provider, apiConfig, {
    to: parsedContacts.valid[0] || '+919876543210',
    broadcastName: `${brand.businessName || 'Broadcast'} campaign`,
    languageCode: messageLang === 'hi' ? 'hi' : 'en_US',
    userName: 'Customer',
    mediaUrl: posterUrl ? '<poster-public-url>' : '',
    mediaName: 'campaign-poster.png',
    variables: [brand.businessName, offer.value],
    parameters: [{ name: 'offer', value: offer.value }],
    templateParams: [brand.businessName, offer.value],
    components: [
      {
        type: 'body',
        parameters: [
          { type: 'text', text: brand.businessName || 'Business' },
          { type: 'text', text: offer.value || 'Offer' },
        ],
      },
    ],
  }), [apiConfig, brand.businessName, messageLang, offer.value, parsedContacts.valid, posterUrl]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.lang = lang === 'hi' ? 'hi' : 'en';
  }, [theme, lang]);

  useEffect(() => {
    if (progress.status !== 'running') return undefined;

    const timer = window.setInterval(() => {
      setProgress((current) => {
        const nextBatch = Math.min(34, current.total - current.sent - current.failed);
        const failedInBatch = Math.random() < 0.12 ? 1 : 0;
        const nextSent = current.sent + Math.max(0, nextBatch - failedInBatch);
        const nextFailed = current.failed + failedInBatch;

        if (nextSent + nextFailed >= current.total) {
          return { ...current, sent: nextSent, failed: nextFailed, status: 'done' };
        }

        return { ...current, sent: nextSent, failed: nextFailed };
      });
    }, 220);

    return () => window.clearInterval(timer);
  }, [progress.status]);

  function updateBrand(key, value) {
    setBrand((current) => ({ ...current, [key]: value }));
  }

  function updateSocial(key, value) {
    setBrand((current) => ({
      ...current,
      social: { ...current.social, [key]: value },
    }));
  }

  function updateApi(key, value) {
    setApiConfig((current) => ({ ...current, [key]: value }));
  }

  async function handleContactFile(file) {
    if (!file) return;

    try {
      const extracted = await extractContactTextFromFile(file);
      const merged = `${contactText}\n${extracted}`;
      const parsed = parseContactsFromText(merged);
      setContactText(parsed.displayText);
      setFileState({ name: file.name, error: '' });
    } catch (error) {
      setFileState({ name: file.name, error: error.message });
    }
  }

  function handleImageFile(file, callback) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => callback(reader.result);
    reader.readAsDataURL(file);
  }

  async function handlePosterGenerate() {
    setPosterBusy(true);
    const dataUrl = await makePosterDraft({ brand, offer, language: messageLang === 'hi' ? 'hi' : 'en', festival });
    setPosterUrl(dataUrl);
    setPosterBusy(false);
  }

  function applyFestival(nextFestival) {
    setFestival(nextFestival);
    setTemplateKey('festival');
    setOffer((current) => ({ ...current, type: 'Festival Greeting', value: `${nextFestival.name} special` }));
  }

  function handleSend() {
    if (!canSend) return;
    setProgress({ status: 'running', total: parsedContacts.valid.length, sent: 0, failed: 0 });
  }

  const progressPercent = progress.total ? Math.round(((progress.sent + progress.failed) / progress.total) * 100) : 0;

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-mark">
          <div className="logo-box">B</div>
          <div>
            <h1>BroadcastWA Pro</h1>
            <p>{tx.navSubtitle}</p>
          </div>
        </div>

        <div className="topbar-actions">
          <button className="icon-text-btn" type="button" onClick={() => setLang(lang === 'en' ? 'hi' : 'en')} title="Switch language">
            <Languages size={17} />
            <span>{lang === 'en' ? 'हिंदी' : 'English'}</span>
          </button>
          <button className="icon-btn" type="button" onClick={() => setTheme(isDark ? 'light' : 'dark')} title={isDark ? 'Light mode' : 'Dark mode'}>
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button className="avatar" type="button" title="Account">
            <UserRound size={18} />
          </button>
        </div>
      </header>

      <main className="workspace">
        <div className="page-title">
          <div>
            <span className="eyebrow"><Sparkles size={14} /> MVP v2.0</span>
            <h2>{tx.newCampaign}</h2>
          </div>
          <div className={`status-pill ${canSend ? 'ready' : 'attention'}`}>
            {canSend ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{canSend ? tx.readyToSend : tx.needsAttention}</span>
          </div>
        </div>

        <div className="campaign-grid">
          <div className="left-stack">
            <Section title={tx.businessProfile} icon={Settings2}>
              <div className="form-grid two">
                <TextField label={tx.businessName} value={brand.businessName} onChange={(value) => updateBrand('businessName', value)} placeholder="GlowUp Salon" />
                <SelectField label={tx.businessType} value={brand.businessType} onChange={(value) => updateBrand('businessType', value)} options={brandTypes} />
                <TextField label={tx.city} value={brand.city} onChange={(value) => updateBrand('city', value)} placeholder="Jaipur" />
                <TextField label={tx.phone} value={brand.phone} onChange={(value) => updateBrand('phone', value)} placeholder="+91 98765 43210" />
              </div>

              <div className="logo-social-row">
                <button className="upload-tile compact" type="button" onClick={() => logoInputRef.current?.click()}>
                  {brand.logoUrl ? <img src={brand.logoUrl} alt="Business logo" /> : <BadgeCheck size={24} />}
                  <span>{tx.uploadLogo}</span>
                </button>
                <input
                  ref={logoInputRef}
                  className="hidden"
                  type="file"
                  accept="image/*"
                  onChange={(event) => handleImageFile(event.target.files?.[0], (url) => updateBrand('logoUrl', url))}
                />

                <div className="social-grid">
                  <TextField label={tx.instagram} value={brand.social.instagram} onChange={(value) => updateSocial('instagram', value)} placeholder="@handle" />
                  <TextField label={tx.facebook} value={brand.social.facebook} onChange={(value) => updateSocial('facebook', value)} placeholder="Page name" />
                  <TextField label={tx.youtube} value={brand.social.youtube} onChange={(value) => updateSocial('youtube', value)} placeholder="Channel" />
                  <TextField label={tx.twitter} value={brand.social.twitter} onChange={(value) => updateSocial('twitter', value)} placeholder="@handle" />
                </div>
              </div>
            </Section>

            <Section title={tx.providerTitle} icon={Cloud}>
              <p className="section-note">{tx.providerIntro}</p>
              <div className="provider-grid">
                {Object.values(WHATSAPP_PROVIDERS).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`provider-card ${apiConfig.provider === item.id ? 'selected' : ''}`}
                    onClick={() => updateApi('provider', item.id)}
                  >
                    <span>{item.name}</span>
                    <small>{item.badge}</small>
                  </button>
                ))}
              </div>

              <div className="provider-detail">
                <div>
                  <h3>{provider.name}</h3>
                  <p>{provider.summary}</p>
                </div>
                <a href={provider.docsUrl} target="_blank" rel="noreferrer" className="docs-link">
                  <Link2 size={15} />
                  {tx.openDocs}
                </a>
              </div>

              <div className="form-grid two">
                {provider.fields.map((field) => (
                  <TextField
                    key={field.key}
                    label={field.label}
                    type={field.type || 'text'}
                    value={apiConfig[field.key] || ''}
                    placeholder={field.placeholder}
                    onChange={(value) => updateApi(field.key, value)}
                  />
                ))}
              </div>

              <div className={`connection-state ${providerReady ? 'ready' : ''}`}>
                <ShieldCheck size={17} />
                <span>{providerReady ? tx.connectionReady : tx.connectionMissing}</span>
              </div>
              <p className="token-note">{tx.tokenNote}</p>
            </Section>
          </div>

          <div className="right-stack">
            <Section title={tx.pasteNumbers} icon={ClipboardList}>
              <textarea
                className="contact-box"
                value={contactText}
                placeholder={tx.pastePlaceholder}
                onChange={(event) => setContactText(event.target.value)}
              />
              <div className="metrics-row">
                <Metric label={tx.valid} value={parsedContacts.valid.length} tone="success" />
                <Metric label={tx.duplicates} value={parsedContacts.duplicates} tone="warning" />
                <Metric label={tx.invalid} value={parsedContacts.invalid} tone="danger" />
              </div>

              <button className="upload-tile" type="button" onClick={() => fileInputRef.current?.click()}>
                <FileSpreadsheet size={24} />
                <span>{tx.uploadContacts}</span>
                <ChevronRight size={18} />
              </button>
              <input
                ref={fileInputRef}
                className="hidden"
                type="file"
                accept=".csv,.txt,.xlsx,.xls"
                onChange={(event) => handleContactFile(event.target.files?.[0])}
              />
              {(fileState.name || fileState.error) && (
                <p className={`file-state ${fileState.error ? 'error' : ''}`}>
                  {fileState.error ? fileState.error : `${tx.fileReady}: ${fileState.name}`}
                </p>
              )}
            </Section>

            <Section title={tx.festivalBanner} icon={CalendarDays}>
              <div className="festival-strip">
                {festivalIdeas.slice(0, 5).map((item) => (
                  <button
                    type="button"
                    key={item.name}
                    className={festival.name === item.name ? 'active' : ''}
                    onClick={() => applyFestival(item)}
                  >
                    <strong>{item.name}</strong>
                    <span>{item.month}</span>
                  </button>
                ))}
              </div>
            </Section>
          </div>
        </div>

        <div className="builder-grid">
          <Section title={tx.offerDetails} icon={Palette}>
            <div className="form-grid three">
              <SelectField label={tx.offerType} value={offer.type} onChange={(value) => setOffer((current) => ({ ...current, type: value }))} options={offerTypes} />
              <TextField label={tx.offerValue} value={offer.value} onChange={(value) => setOffer((current) => ({ ...current, value }))} placeholder="30% off hair spa" />
              <SelectField label={tx.posterStyle} value={offer.style} onChange={(value) => setOffer((current) => ({ ...current, style: value }))} options={posterStyles} />
            </div>

            <div className="poster-actions">
              <button className="primary-soft-btn" type="button" onClick={handlePosterGenerate} disabled={posterBusy}>
                {posterBusy ? <Loader2 size={18} className="spin" /> : <WandSparkles size={18} />}
                {tx.generatePoster}
              </button>
              <button className="secondary-btn" type="button" onClick={() => posterInputRef.current?.click()}>
                <Upload size={18} />
                {tx.uploadPoster}
              </button>
              <input
                ref={posterInputRef}
                className="hidden"
                type="file"
                accept="image/*"
                onChange={(event) => handleImageFile(event.target.files?.[0], setPosterUrl)}
              />
            </div>
          </Section>

          <Section title={tx.message} icon={MessageSquareText}>
            <div className="message-toolbar">
              <SegmentControl
                value={templateKey}
                onChange={setTemplateKey}
                options={[
                  { label: 'Offer', value: 'offer' },
                  { label: 'Festival', value: 'festival' },
                  { label: 'Promo', value: 'promo' },
                  { label: 'Member', value: 'membership' },
                  { label: 'Custom', value: 'custom' },
                ]}
              />
              <SegmentControl
                value={messageLang}
                onChange={setMessageLang}
                options={[
                  { label: tx.english, value: 'en' },
                  { label: tx.hindi, value: 'hi' },
                  { label: tx.both, value: 'both' },
                ]}
              />
            </div>
            <textarea
              className="message-box"
              value={message}
              onChange={(event) => {
                setTemplateKey('custom');
                setCustomMessage(event.target.value);
              }}
            />
            <div className="composer-footer">
              <span>{message.length} {tx.characterCount}</span>
              {['😊', '🎉', '🪔', '🔥', '🙏'].map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => {
                    setTemplateKey('custom');
                    setCustomMessage(`${message}${emoji}`);
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </Section>
        </div>

        <div className="preview-grid">
          <Section title={tx.preview} icon={Phone}>
            <div className="phone-preview">
              <div className="wa-header">
                <div className="wa-avatar">{initials(brand.businessName)}</div>
                <div>
                  <strong>{brand.businessName || 'Business'}</strong>
                  <span>{brand.city || 'City'} • WhatsApp</span>
                </div>
              </div>
              <div className="wa-chat">
                {posterUrl ? (
                  <div className="poster-frame">
                    <img src={posterUrl} alt="Campaign poster preview" />
                    <button className="remove-poster" type="button" onClick={() => setPosterUrl('')} title="Remove poster">
                      <X size={15} />
                    </button>
                  </div>
                ) : (
                  <div className="poster-empty">
                    <ImagePlus size={28} />
                    <span>{tx.noPoster}</span>
                  </div>
                )}
                <div className="message-bubble">{message || 'Your campaign message will appear here.'}</div>
              </div>
            </div>
          </Section>

          <Section title={tx.apiSetup} icon={Globe2}>
            <div className="api-preview">
              <div className="api-preview-head">
                <strong>{provider.name}</strong>
                <span>{payloadPreview.method}</span>
              </div>
              <code>{payloadPreview.url}</code>
              <pre>{JSON.stringify(payloadPreview.body, null, 2)}</pre>
            </div>
          </Section>

          <Section title={tx.liveProgress} icon={Send}>
            <div className="summary-grid">
              <Metric label={tx.total} value={progress.total || parsedContacts.valid.length} />
              <Metric label={tx.sent} value={progress.sent} tone="success" />
              <Metric label={tx.failed} value={progress.failed} tone="danger" />
            </div>
            <div className="progress-track">
              <span style={{ width: `${progressPercent}%` }} />
            </div>
            <button className="send-btn" type="button" disabled={!canSend || progress.status === 'running'} onClick={handleSend}>
              {progress.status === 'running' ? <Loader2 size={19} className="spin" /> : <Send size={19} />}
              {progress.status === 'running' ? tx.sending : tx.sendNow}
            </button>
            {progress.status === 'done' && (
              <div className="done-note">
                <CheckCircle2 size={18} />
                <span>{tx.summary}: {progress.sent} {tx.sent}, {progress.failed} {tx.failed}</span>
              </div>
            )}
          </Section>
        </div>
      </main>

      <footer className="app-footer">
        <AtSign size={14} />
        <span>{brand.social.instagram || 'broadcastwa'} </span>
        <Hash size={14} />
        <span>{brand.social.facebook || 'Campaign engine'} </span>
        <PlayCircle size={14} />
        <span>{brand.social.youtube || 'WhatsApp marketing'} </span>
      </footer>
    </div>
  );
}

export default App;
