# BaFitD — Batswana and Friends in the Diaspora

A civic skills registry connecting skilled Batswana and friends of Botswana who pledge pro bono services to their communities.

**Live at:** [botswanaandfriends.com](https://botswanaandfriends.com)

---

## Stack

- **Frontend:** React + TypeScript + Vite + Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Edge Functions)
- **Hosting:** Cloudflare Pages

---

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/orionx-dev/bafitd.git
cd bafitd
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Fill in your Supabase project URL and anon key.

### 3. Set up the database

Run the migrations against your Supabase project:

```bash
npx supabase db push
# or run migrations manually in the Supabase dashboard
```

Migrations are in `supabase/migrations/`:
- `20260301000000_create_bafitd_registry.sql` — main table, RLS policies, stats RPC
- `20260316_bafitd_freeform_text.sql` — adds freeform essay submission support

### 4. Run locally

```bash
npm run dev
```

### 5. Build for production

```bash
npm run build
```

---

## Project Structure

```
src/
├── pages/
│   └── BaFitDPage.tsx        # Main page (6-step registration wizard)
├── services/
│   └── bafitdService.ts      # Supabase DB calls (submit, stats)
├── types/
│   └── bafitd.ts             # TypeScript types and constants
├── utils/
│   └── bafitdTranslations.ts # English / Setswana translations
├── components/
│   ├── Logo.tsx              # BaFitD logo
│   ├── NewFooter.tsx         # Page footer
│   ├── PageSEO.tsx           # Helmet SEO wrapper
│   ├── Particles.tsx         # WebGL particle background
│   └── ParticlesErrorBoundary.tsx
├── lib/
│   └── supabase.ts           # Supabase client
supabase/
└── migrations/               # SQL migrations
```

---

## Database

Single table: `bafitd_volunteers`

**RLS Policies:**
- `anon` and `authenticated` users can INSERT (public registration form)
- Only `@orionx.xyz` email users can SELECT / UPDATE

**RPC:**
- `get_bafitd_stats()` — returns aggregate statistics (no personal data). Callable by anon.

---

## Deployment (Cloudflare Pages)

1. Connect the GitHub repo to Cloudflare Pages
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
5. Set custom domain: `botswanaandfriends.com`

---

## Languages

The registration form supports:
- **English** (`en`)
- **Setswana** (`tn`) — toggle in the header

> Note: Setswana translations are community-contributed. Native speakers are encouraged to review and improve them.

---

*A re neng fiti beng betsho!*
