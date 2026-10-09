# WIHGO AI

> Never lose the conversation or commitment behind your business.

## What the product does

WIHGO AI is an AI-powered business communication and productivity platform. It unifies a user's business conversations from Gmail, WhatsApp, and Instagram DMs into a private, AI-powered memory layer, then proactively acts on that memory.

Instead of just storing messages, WIHGO AI understands them — extracting commitments, deadlines, and open threads — and helps the user follow through by surfacing follow-ups, generating tasks, managing calendar commitments, drafting replies, and building living client records.

Core experience:
1. Connect a business channel (starting with Gmail)
2. WIHGO AI finds open commitments — e.g., "Found 3 open commitments you haven't followed up on"
3. Get proactive help — follow-up nudges, auto-drafted replies, auto-generated tasks, calendar entries
4. Start the day with a business brief / daily handoff — "Good morning — here's what needs your attention"

Platform: mobile app first (primary experience), web app as companion for deeper review, setup, and configuration.

## The problem it solves

Small business owners and freelancers run sales, support, and admin themselves across scattered channels — email, WhatsApp, Instagram DMs.

The biggest cost isn't a lack of tools; it's forgetting what was promised to whom.

Existing tools (CRMs, task apps, inboxes) store information but don't actively remember or act on commitments on the user's behalf. Promises slip, follow-ups are missed, and business is lost.

WIHGO AI solves this by:
- Unifying scattered conversations into one searchable business memory
- Automatically extracting what was promised, to whom, and by when
- Proactively nudging only when deadlines/commitments require it — avoiding notification fatigue
- Linking every task, calendar event, invoice, and CRM record back to the originating conversation

Example: "You told Sarah you'd send the quote by Friday — it's Thursday. Send it now?"

## Who the product is for

- Small business owners
- Solo founders and freelancers
- Anyone running their business primarily through direct conversations rather than a dedicated sales/support team

Private by default: single-user memory model at launch. No team-sharing complexity in v1.

## Main features of the current project

This is the initial version (v0.1) — PRD / foundation stage.

Current scope based on `docs/product requirement document.txt`:

1. **Unified Business Memory**
   - Ingests conversations from Gmail, WhatsApp, and Instagram DMs
   - Two memory layers: Personal Memory (user history/preferences) and Business Memory (connected channels)
   - Authorized AI Action only — AI acts only on explicitly connected channels
   - Smart search across all connected conversations and memory

2. **Proactive Actions (deadline/commitment-triggered only)**
   - Follow-up nudges as deadlines approach or pass
   - Auto-generated tasks, always linked to conversation + client
   - Auto-draft context-aware replies based on history
   - Strictly deadline-triggered, not real-time, to avoid fatigue

3. **Productivity Modules (bundled, conversation-linked)**
   - Tasks / to-dos
   - Calendar & scheduling
   - Invoicing & payments
   - Client/contact CRM records built from actual history, not manual entry

4. **Onboarding Flow**
   - Welcome → 60-second guided demo → Connect Gmail → Add WhatsApp/Instagram → Business brief & daily handoff

Out of scope for v1: team/shared memory, real-time notifications, additional channels beyond Gmail/WhatsApp/Instagram, desktop-first experience.

## Project structure

```
.
├── README.md
└── docs/
    └── product requirement document.txt
```

- `README.md` — product overview (this file)
- `docs/` — product requirements and design docs, preserved as-is

## Status

Initial version saved. No application code yet — foundation is the PRD. Next steps: user research validation, technical design for channel ingestion + memory layer, and mobile-first prototype.
