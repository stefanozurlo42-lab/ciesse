# Ciesse Intermediazioni — sito + sistema preventivi

## What it is
1:1 port (Vite/React/TS + FastAPI) of the Ciesse site (originally CRA, source recovered from its sourcemap):
Home, /collezioni, /servizi, /preventivo, /contatti — same design (Cormorant Garamond + Hanken Grotesk, cream #f4f0ea / ink #0b0b0b / clay #b4532a).
User asked: DO NOT change anything beyond what they explicitly request (design must stay identical).
Logo: official client logo (PDF → /public/logo-ciesse.svg + recoloured /public/logo-ciesse-light.svg for dark bg), used via components/Logo.tsx.
Home: "I nostri partner" section removed; home services section hides 4 services (HIDDEN_ON_HOME in ServicesDark.tsx);
/servizi page still lists all 8. Categories/stats/about texts updated per client (data/site.ts, About.tsx).

## Quote flow (/preventivo)
3 steps: 01 Intervento (tipologia chip) → 02 Prodotti (categorie chips, descrizione, quantità, tempistiche chips) → 03 Contatti
(nome*, cognome*, email*, telefono [* if preferenza=telefono], comune, preferenza contatto, privacy checkbox*).
POST /api/quotes → saved in Mongo `quotes` FIRST (progressive `numero` via `counters`), then emailed to OWNER_EMAIL via
Emergent-managed Resend (lib/email.py). email_status = inviata|fallita. Success screen text:
"Richiesta di preventivo inviata con successo. Ti contatteremo al più presto." On request failure: error box + retry,
form draft persisted in localStorage (key ciesse-quote-draft). Rate limit 8/h per IP (429).
POST /api/contact (Contatti form) → saved in `contact_messages` + emailed to owner.

## Admin (/admin)
Single password (env ADMIN_PASSWORD) → POST /api/auth/login sets httpOnly JWT cookie `ciesse_admin` (12h).
GET /api/auth/me, POST /api/auth/logout. Admin endpoints (401 without cookie):
GET /api/admin/quotes?status=, GET /api/admin/stats, GET/PATCH /api/admin/quotes/{id} (status, note_interne),
POST /api/admin/quotes/{id}/resend-email.
Statuses: nuova, in_lavorazione, preventivo_inviato, chiusa.

## Env (backend/.env)
EMERGENT_EMAIL_KEY, EMAIL_FROM_NAME, OWNER_EMAIL, ADMIN_PASSWORD, ADMIN_JWT_SECRET, PUBLIC_SITE_URL.
