# Wigho AI — AI Business Memory and Attention Platform
## Product Requirements Document (PRD)

> Assessment phase: local prototype only. Single-page working local prototype with test/mock data.

### Assessment Requirements (Confirmed)

For this assessment, the following statements apply and are binding:

1. The application is being developed and tested locally for this assessment.
2. The database is PostgreSQL.
3. Authentication is Better Auth.
4. File storage is Cloudflare R2 (S3-compatible object storage).
5. Only test/mock data will be used.
6. No real passwords, API keys, access tokens, or private credentials should be committed to the repository.
7. Production deployment is not required for this assessment.

No live payment processing, no production sign-in, no public hosting, and no real secrets are in scope for this assessment.

---

## 1. Overview & Positioning

Wigho AI is an AI Business Memory & Attention Platform. It connects the tools a business already uses, understands what's happening across them, remembers what matters, tells the owner what needs their attention, and helps them act.

Tagline: "Remember your business. Understand your business. Tell you what you need. Help you act."

What this means in practice:

- **Remember:** unified memory of business conversations, commitments, deadlines, and follow-ups.
- **Understand:** extract commitments, deadlines, owners, and open threads from natural conversation.
- **Tell you what you need:** deadline/commitment-triggered nudges + a daily "Catch Me Up" brief — no real-time noise.
- **Help you act:** auto-draft replies (never auto-sent), auto-generated tasks linked to source, calendar visibility.

Private by default: single-user memory model for this prototype. No team/shared memory.

## 2. Target Persona

Small business owners, founders, freelancers, and busy professionals who manage business conversations and tasks scattered across email and social/communication platforms, making it easy to miss conversations, forget follow-ups, and lose important business information.

Key traits:

- Run sales, support, and admin themselves through direct conversations.
- Work across email + social/communication apps; no dedicated sales/support team.
- Biggest pain is not lack of tools — it is forgetting what was promised to whom.
- Want proactive help (reminders, drafts, tasks, briefs), not another inbox or CRM to maintain manually.

## 3. Core Features (Full Vision — Not All Built in Assessment)

- Personal memory + business memory, AI only acts on connected/authorized data.
  - Personal Memory: user history/preferences.
  - Business Memory: built only from explicitly connected/authorized channels.
  - Unauthorized sources are never ingested or acted on.
- Channels modeled as optional "plugins":
  - Phase 1: Gmail (official Gmail API) + manual paste/forward intake for any platform.
  - Phase 2: WhatsApp + Instagram via official Meta APIs only (no third-party aggregators, no unofficial WhatsApp access).
  - Phase 3: Facebook, TikTok, LinkedIn, X, Slack, Calendar sync.
- Deadline/commitment-triggered proactive nudges (not real-time).
  - Nudges fire on approaching/missed deadlines and stale open commitments only.
  - No high-frequency or real-time notifications.
- Auto-draft replies (Edit → Copy → Send, never auto-sent).
  - Context-aware drafts from conversation + memory.
  - User must explicitly edit/copy/send; no autonomous sending.
- Auto-generated tasks, linked back to source conversation.
  - Every task stores: source channel, source message/thread ID, client/contact, deadline if detected.
- "Catch Me Up" daily brief (Summarize → Prioritize → Act).
  - Morning brief: what changed, what is due/overdue, top 3 priorities, suggested actions.
- Correction loop for wrong memory extractions.
  - User can flag/edit a wrong commitment, deadline, task, or summary; correction updates stored memory and is used to improve future extractions.
- Tone settings: Executive / Friendly / Direct / Concise.
  - Global tone setting applied to nudges, drafts, and briefs.

Out of scope for this local prototype: team/shared memory, real-time notifications, autonomous sending, live payments/invoicing transactions.

## 4. Final Confirmed Technology Stack

This is the final confirmed technology stack for Wigho AI:

| Layer | Choice |
|---|---|
| Framework | Next.js |
| UI Components | Radix UI |
| Database | PostgreSQL |
| Authentication | Better Auth |
| File Storage | Cloudflare R2 (S3-compatible object storage) |
| Reverse Proxy / Web Server | Caddy |
| Containers | Docker |
| Infrastructure / Edge | Cloudflare |
| AI / Retrieval | Haystack |
| Email | ZeptoMail |
| Version Control | GitHub |
| CI/CD | GitHub Actions |

Prototype runtime notes:

- No user accounts or authentication accounts are being created yet at this local prototype stage — the current `index.html` prototype runs entirely in the browser with mock data and no sign-in, and Better Auth wiring is deferred to the next phase.
- File storage (Cloudflare R2) is planned but not yet connected — no buckets, uploads, or storage calls exist in the prototype; the storage layer will be introduced via the S3-compatible API with test placeholders when ingestion begins.
- App, database, and auth run locally via Docker for this assessment — no public deployment.
- PostgreSQL runs as a local self-managed Docker container with local test/mock data only.
- Better Auth runs locally with local test users only — no working sign-in against production data.
- Cloudflare R2 is used via its S3-compatible API. In the local prototype it is accessed with placeholder/test credentials and test buckets only, or a local S3-compatible stub where appropriate. No production buckets, no real credentials.
- Haystack is used for AI/retrieval (extraction + memory search) against local test/mock data only.
- ZeptoMail, Cloudflare edge/DNS, and Caddy HTTPS are config placeholders / stubbed interfaces in this phase — no live email delivery, no public DNS/CDN wiring.
- GitHub + GitHub Actions are for source control and basic CI checks (lint/build) only in this phase — no production deploy pipeline.
- `.env.example` contains placeholder-only keys. Real `.env` files are git-ignored and never committed.
- No database tests in this assessment phase unless explicitly added later.

Authorization warning (required, not optional):

- Authorization (row-level access control) is NOT automatic with this stack — every query must be explicitly scoped to the authenticated user's own data in application code.
- Flagged as a required task in the implementation plan below, not an afterthought.
- Pattern to enforce: `where ownerId = session.user.id` (or equivalent) on every read/write; centralize in a data-access helper; review in every phase that touches data.

## 5. Implementation Plan (Ordered Phases)

> Assessment scope: only Phase 1 is required for this assessment — an initial single-page working local prototype. Phases 2–7 are planned but deferred; do not overbuild the complete Wigho AI platform yet.

### Phase 1: Local Scaffold + Single-Page Working Prototype — CURRENT PHASE

**Objective:** Prove the local runtime works end-to-end and deliver one working local page that demonstrates the product idea with mock data.

**Specific tasks:**

- Scaffold Next.js app, wire Radix UI, base layout + dark navy theme tokens.
- Set up Docker Compose: `web` (Next.js) + `db` (PostgreSQL) + `caddy` (local reverse proxy).
- Add PostgreSQL connection with test/mock seed data only.
- Wire Better Auth locally with local test users only.
- Add Cloudflare R2 client via S3-compatible API using placeholder/test config; simple upload/list against test bucket/stub only.
- Add minimal Haystack retrieval stub/hook with mock data for memory search display.
- Build one single local page showing: brief summary, mock commitments/tasks, mock draft, mock nudge.
- Add `.env.example` with placeholder-only keys; git-ignore real `.env`.
- Add README run-local instructions; GitHub repo init; GitHub Actions basic CI (lint/build) only.

**Expected output:**

- `docker compose up` yields a local app + local DB reachable through local Caddy.
- One single page loads locally and renders mock memory/attention content with no errors and no real credentials.

### Phase 2: Schema + Better Auth Per-User Scoping — PLANNED (Next Phase)

**Objective:** Persist domain data in PostgreSQL with strict per-user isolation.

**Specific tasks:**

- Create tables (minimum): `users`, `channels`, `messages`, `memories/commitments`, `tasks`, `drafts`, `briefs`, `corrections`, `preferences (tone)`, `files` (R2 object keys + metadata).
- Wire Better Auth to local Postgres with seed script for local test users.
- Build data-access helper enforcing `ownerId = session.user.id` on every query.
- Run manual authorization review checklist on every query path.

**Expected output:**

- Two local test users see only their own seeded data; cross-user access returns not-found.

### Phase 3: Ingest — Gmail Connector (Mock-First) + Manual Intake + R2 Attachments

**Objective:** Ingest conversations from mock Gmail + manual paste, with file attachments stored in R2.

**Specific tasks:**

- Define channel plugin interface: `connect / sync / normalize`.
- Build Gmail plugin using official Gmail API with local fixtures + manual paste/forward fallback.
- Store normalized `messages` (channel, thread ID, sender, timestamp, body).
- Store attachments in Cloudflare R2 (test bucket) and persist object keys in Postgres.

**Expected output:**

- Paste an email thread (or sync mock fixture) → visible in local inbox/memory list with attachment links backed by R2 test config.

### Phase 4: Memory Extraction + Correction Loop (Haystack)

**Objective:** Turn ingested messages into linked commitments via Haystack.

**Specific tasks:**

- Build extraction job with Haystack: commitments, deadlines, owners, open threads.
- Link every extraction to source message/thread.
- Build correction UI: edit/flag wrong extraction → update memory + log correction.

**Expected output:**

- Conversation yields "promised X to Y by Z" card with source link + working correct/edit flow.

### Phase 5: Tasks + Drafts + Tone

**Objective:** Generate actionable outputs that are never auto-sent.

**Specific tasks:**

- Auto-generate tasks from commitments, linked to source + client.
- Auto-draft replies with Edit → Copy → Send flow only; no send API wired.
- Apply global tone setting (Executive / Friendly / Direct / Concise).
- Enforce per-user scoping on all task/draft reads/writes.

**Expected output:**

- Open commitment → linked task + editable draft in selected tone, copyable to clipboard.

### Phase 6: Nudges + "Catch Me Up" Brief

**Objective:** Deliver the attention system (deadline-triggered only).

**Specific tasks:**

- Build nudge engine (due-soon, overdue, stale open thread); no real-time push.
- Build daily brief page: Summarize → Prioritize → Act.
- Apply tone setting to nudges + brief.

**Expected output:**

- Seeded overdue commitment surfaces as nudge + appears in today's local brief.

### Phase 7: Channel Stubs + Polish

**Objective:** Leave clean seams for future channels without live wiring.

**Specific tasks:**

- Add disabled/placeholder cards for WhatsApp + Instagram (official Meta APIs only) and Facebook/TikTok/LinkedIn/X/Slack/Calendar behind the plugin interface.
- Keep ZeptoMail + Cloudflare edge as stubbed interfaces with TODO markers.
- Design system pass: deep teal + silver, dark navy, glowing network motif, rounded cards, glowing buttons, white typography.

**Expected output:**

- Local demo script runs end-to-end on mock data: connect (mock) → ingest → extract → task/draft → nudge → brief → correct.

Explicitly deferred (not in assessment): live email delivery, production sign-in, database test suites, production deploy steps, real credentials/secrets, public hosting.

## 6. Design System

- Palette: deep teal + silver, dark navy background.
- Motif: glowing network motif (memory/graph feel, subtle, non-distracting).
- Components: rounded cards, glowing buttons, white typography.
- UI base: Radix UI primitives styled to the above tokens.
- Tone: sharp and proactive, yet warm and professional; concise and clear; confident, never arrogant.

## 7. Agent Steering Notes

### Agent Steering Decision: Cloudflare R2 Instead of Amazon S3 (Prototype Stage)

- **Decision:** Use Cloudflare R2 instead of Amazon S3 for file storage during the prototype stage.
- **Reasoning:**
  1. Cloudflare R2 is S3-compatible, so existing S3 API clients, SDKs, and patterns work without locking us to AWS.
  2. It fits naturally with the Cloudflare infrastructure already selected for Wigho AI (Infrastructure/Edge: Cloudflare), keeping the edge + storage story coherent.
  3. It is suitable for the initial prototype while keeping storage costs low, which matters for assessment-stage iteration with test/mock data only.
- **Impact:**
  - All file storage code must use the S3-compatible API against R2 configuration (endpoint, bucket, placeholder credentials in local dev).
  - Do not introduce AWS S3-specific services or IAM assumptions in the prototype; keep the storage layer swappable via a thin `storage` interface.
  - Production storage decisions can be revisited later without rewriting call sites; prototype uses test buckets/stubs only, no real credentials committed.
- **Constraints for agents:**
  - Use test/mock buckets and placeholder keys only.
  - Never commit real R2 credentials, API tokens, or account IDs.
  - Do not configure production R2 buckets, public access, or Cloudflare production services in this phase.

### Prior Database Decision (Retained)

- PostgreSQL remains self-managed in local Docker for this prototype because it matches production intent, validates Docker + Caddy + Better Auth wiring early, and keeps the assessment runtime fully local with test/mock data.

### Agent Steering Decision: Database Adapter for Better Auth + PostgreSQL — Drizzle

- **Decision:** Use Drizzle as the ORM/adapter connecting Better Auth to PostgreSQL.
- **Reasoning:**
  1. It has a first-class, official Better Auth adapter.
  2. It stays close to raw SQL, making it easier to understand and debug queries directly while iterating quickly.
  3. No codegen step required on every schema change, which suits a prototype phase where the schema will change often.
  4. Prisma was considered but adds an extra abstraction layer and build step not needed at this stage.

  Drizzle was chosen over Prisma because it keeps every query visible as near-raw SQL, which makes debugging straightforward while the schema is still changing daily during prototyping. Unlike Prisma, Drizzle needs no client codegen step on each schema change and it ships a first-class official Better Auth adapter, removing integration risk for the upcoming auth phase. Prisma's heavier abstraction would only slow down this early stage without adding value until the data model stabilizes.
- **Impact:**
  - All Better Auth database wiring must use the Drizzle adapter against local PostgreSQL.
  - Keep schema definitions in Drizzle; avoid introducing Prisma schema/client in this phase.
- **Constraints for agents:**
  - Do not add Prisma as a dependency unless this decision is explicitly revisited.
  - Use local test/mock data only; no production database wiring.

## Design Refinement Note

Requested change: Keep the existing Wigho AI color palette of deep teal, silver, and black. Make one specific visual improvement: improve the typography hierarchy and text contrast.

What was changed in `design.html` (palette and layout unchanged):
- Main page heading (h1) made more prominent: 52px to 60px, weight 800, tighter leading, balanced wrap, pure white (#FFFFFF) on dark navy.
- Section headings (h2) made clearly distinguishable from supporting text: silver (#C0C5CE), uppercase, letter-spacing, rule below, increased to 16px / weight 800.
- Supporting text contrast strengthened for dark-background readability: body kept at #E5E7EB, lede raised to 20px / weight 600 in white, footer/meta raised from muted #9CA3AF 13.5px to silver #C0C5CE 14px, nudge text increased to 16-17px with improved line-height.

Why: ensure hierarchy (h1 > h2 > body is instantly scannable) and WCAG-oriented readability on the dark professional theme, while keeping the design mature, modern, and suitable for an AI business platform.

## Current Development Phase

Status: reached **Phase 1 of the implementation plan — initial local prototype**.

- Built `index.html`: WihGo AI dashboard showing a "Welcome back, Clare" header, a Catch Me Up brief summarizing open commitments (1 overdue, 1 due soon, 1 draft ready), and 3 recent messages clearly labeled by source platform (Gmail, WhatsApp, Instagram) with commitment detection shown against each, plus a Tasks preview. Working buttons/checkboxes in vanilla JS.
- Built `design.html`: documents the deep teal + silver design system (dark navy background), typography hierarchy, glowing teal button, and styled text input.
- All data is mock/test data only, running locally in the browser with no server, no auth, and no database connected yet. No real credentials or keys in either file.

Next phase: connect the Next.js app (already scaffolded in `web/`) to Better Auth and self-managed PostgreSQL, then wire up the Gmail connector to replace the mock messages with real ingested data and begin the memory extraction pipeline.
