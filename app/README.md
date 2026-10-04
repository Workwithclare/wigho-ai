# WIHGO AI — Connect Hub backend (`app/`)

Fresh foundation: Next.js (App Router) + Better Auth + Drizzle + Neon Postgres, hosted on Netlify.
Old `web/` prototype is untouched and not used by this app.

## 1. Install
```powershell
cd app
npm install
```

## 2. Configure (local only — never commit)
```powershell
Copy-Item .env.example .env.local
```
Fill in `.env.local`:
- `DATABASE_URL` — from your Neon project (Connection Details, pooled connection string).
- `BETTER_AUTH_SECRET` — generate with `openssl rand -base64 32` (any long random string).
- `BETTER_AUTH_URL` — `http://localhost:3000` for local dev.
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — Google Cloud Console → APIs & Services → Credentials → OAuth client ID (Web application). Add `http://localhost:3000/api/auth/callback/google` as an authorized redirect URI. Leave blank until wiring connectors.

## 3. Database
```powershell
npm run db:generate
npm run db:migrate
```

## 4. Run
```powershell
npm run dev
# open http://localhost:3000
```

Auth endpoints live at `/api/auth/*` (Better Auth handler). The home page reports which services are configured.
