# Auren Estates Demo Template

Premium real-estate discovery demo built with React, TypeScript, Vite, React Router, and a small procedural Three.js viewer.

## Run locally

```sh
npm install
npm run dev
```

Create a production bundle with `npm run build`, or preview it with `npm run preview`.

## Customize

- Brand, fonts, locale, currency, units, contact placeholders and navigation: `src/data/config.ts`
- Local image mappings and complete inventory: `src/data/assets.ts` and `ASSET-INVENTORY.md`
- Fictional properties and developments: `src/data/properties.ts` and `src/data/developments.ts`
- Routes and shared page shell: `src/App.tsx`
- Admin repository and browser-local seed: `src/context/AdminDataContext.tsx`

## Admin prototype

Open `/admin` for the management studio. It includes an executive overview, property CRUD and publishing, development CRUD, leads and follow-up, viewing scheduling, agents, media, homepage editing, business settings, sample analytics, filtered CSV exports, and a security-readiness page.

Admin changes are stored in `localStorage` in the current browser and shared with the public pages in that browser. Use **Settings → Reset demo data** to restore the original fictional records. Public inquiry forms add records to this local CRM and, when a property and date are provided, to the local viewing schedule.

This is not a connected database. There is no authentication, server-side authorization, multi-user sync, audit-grade history or backup. Image uploads use temporary object URLs and disappear when the media page/session is reloaded; supplied project files are protected. Analytics chart values are sample events, not live traffic. CSV exports contain current local records. Inquiry and viewing statuses do not send messages or confirm an appointment with a customer.

Before production, connect a server-side data provider, authentication and role enforcement, secure media storage, validation, privacy controls, backups and verified analytics. Do not enter real customer information in this prototype.

Property and project data are fictional. Contact fields are placeholders. Forms show a local demo confirmation and store the inquiry only in the current browser; they do not transmit it to an email, CRM, WhatsApp or booking service. Replace these details and connect a verified form/CRM provider before launch.

No 3D model or floor-plan files were supplied. The architecture viewer is a procedural concept; the selectable floor plan is illustrative, not a construction drawing. WhatsApp is intentionally not linked until a verified business number is configured.

## Production follow-ups

- Add verified listings, project data, agent details, contact information, legal policies and real customer testimonials.
- Connect inquiries and viewing requests to a CRM or email service, with consent and privacy handling.
- Add actual floor plans, dedicated land/commercial imagery, and a property-specific 3D model if available.
- Generate responsive WebP/AVIF image variants and configure a production image-delivery strategy.
- Add automated route, form, accessibility and visual regression tests.