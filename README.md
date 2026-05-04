# BroadcastWA Pro

React MVP prototype for a WhatsApp campaign tool for Indian small businesses.

## What is built

- Brand setup: business name, type, city, phone, logo, and social handles.
- WhatsApp API setup: customer can choose Meta Cloud API, WATI, AiSensy, or a custom BSP adapter.
- Contact loading: paste numbers or upload CSV/TXT/XLSX; numbers are normalized, deduplicated, and counted.
- Poster workflow: generate a branded poster draft in-browser or upload a manual poster.
- Message workflow: offer, festival, promo, membership, and custom templates with English/Hindi/bilingual copy.
- Hindi UI toggle, dark/light mode, festival campaign ideas, preview, payload preview, and simulated live send progress.

## API strategy

Yes, a customer can bring their existing WhatsApp API route. The app should store a provider type and credentials, then the backend sends through a provider adapter:

- `Meta Cloud API`: access token, phone number ID, approved template name.
- `WATI`: API endpoint, bearer token, template name, channel number.
- `AiSensy`: API key, live API campaign name, source.
- `Interakt / Other BSP`: custom endpoint, token, template name.

Production note: never store these tokens in plain text. Encrypt at rest, proxy every send through the backend, and only send opt-in contacts with approved WhatsApp templates.

## Local development

```bash
npm install
npm run dev
```

## Verification

```bash
npm run lint
npm run build
```
