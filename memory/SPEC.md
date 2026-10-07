# Ciesse Intermediazioni — sito + sistema preventivi

## What it is
1:1 port (Vite/React/TS + FastAPI) of the Ciesse site (originally CRA, source recovered from its sourcemap):
Home, /collezioni, /servizi, /preventivo, /contatti — same design (Cormorant Garamond + Hanken Grotesk, cream #f4f0ea / ink #0b0b0b / clay #b4532a).
User asked: DO NOT change anything beyond what they explicitly request (design must stay identical).
Logo: official client logo (PDF → /public/logo-ciesse.svg + recoloured /public/logo-ciesse-light.svg for dark bg), used via components/Logo.tsx.
Home: "I nostri partner" section removed; SERVICES now has 4 items (home + /servizi). Categories/stats/about texts updated
per client (data/site.ts, About.tsx). Long titles in narrow bento tiles use a smaller size (titleSize in CategoriesBento.tsx).
Favicon = orange helmet from the logo (favicon.svg/.ico/png, apple-touch-icon). Email header shows
PUBLIC_SITE_URL/email-logo-ciesse.png (falls back to text wordmark if PUBLIC_SITE_URL is not https).
Category photos: Category.photos[] ({src, alt, pos=object-position}) in data/site.ts; 01–03 are the client's real photos in
/public/img/categorie/*.webp (Weber rotated upright). >1 photo cross-fades every 5s (components/CategoryPhotos.tsx,
offset i*2500ms so tiles don't switch together), used by home bento + /collezioni (Collezioni uses `wide ?? photos`).
02 = U-Power+Bosch joined side by side (02-upower-bosch.webp). 03 = ferro + magazzino (cross-fade).
04 = tintometro + pitture: cross-fade on home narrow tile, joined side-by-side (04-tintometro-pitture.webp) in Collezioni.
05–06 still Unsplash (waiting for client photos).
"Chi siamo": team photo removed, aerial photo centred (md:col-start-3 md:col-span-8, same size).

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
