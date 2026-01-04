🧭 FINAL DEV ROADMAP (Locked)
Project: Full-Screen Card-Based Business Site Builder
Goal: Rapidly generate branded, scroll-based business sites from structured cards
🧱 Core Stack (Do Not Revisit)
Frontend
React (Vite)
Tailwind CSS
Hosted on Vercel
Backend
Node.js + Express
Hosted on Render
Stateless API (important)
Media
Cloudinary (images only)
API stores URLs, never files
Data
sites.json (for now, intentionally)
File-based, human-readable, replaceable later
🏛️ High-Level Architecture
User
└─ React (Vercel)
├─ fetch()
├─ Cloudinary image URLs
↓
Node API (Render)
├─ sites.json
└─ Cloudinary upload proxy
No uploads folder. No image serving. No pain.
🗂️ Phase 1 — Data & Schema (Foundation)
1. Define Site Schema (Critical)
This drives everything.
{
"id": "site_abc123",
"slug": "acme-plumbing",
"theme": {
"bg": "#0f172a",
"highlight": "#38bdf8",
"secondary": "#94a3b8"
},
"cards": [
{
"type": "hero",
"title": "Acme Plumbing",
"subtitle": "Fast. Local. Reliable.",
"image": "https://res.cloudinary.com/..."
}
]
}
📌 Rule: The frontend never guesses. It only renders this.
🎨 Phase 2 — Theme System (Small Feature, Big Impact)
2. 3-Color Theme Model
User selects:
Background → page + card surfaces
Highlight → CTAs, icons, active elements
Secondary → text accents, borders, metadata
3. CSS Variable Injection
On site load:
:root {
--bg: #0f172a;
--highlight: #38bdf8;
--secondary: #94a3b8;
}
Tailwind usage:
bg-[var(--bg)]
text-[var(--secondary)]
bg-[var(--highlight)]
✅ Infinite themes
✅ No Tailwind rebuilds
✅ Zero design logic in cards
🖼️ Phase 3 — Cloudinary Integration (Scalability Unlock)
4. Cloudinary Setup
Create Cloudinary project
Store credentials in Render env vars
Organize uploads by site ID
/card-sites/{siteId}/hero
/card-sites/{siteId}/gallery
5. Image Upload Flow
User uploads image
React → Node API
API → Cloudinary
Cloudinary returns URL
URL saved in sites.json
📌 API never stores images. Ever.
🧩 Phase 4 — Card System (Reusable Engine)
6. Define Core Card Types (v1)
Hero
Text / Copy
Image
Services / Features
CTA
Contact
Each card:
Consumes theme
Consumes content
Has no stateful logic
Cards are dumb. This is a compliment.
🛠️ Phase 5 — Admin / Builder UI (Minimal, Not Fancy)
7. Site Creation Flow
Site name
Slug
Theme picker (3 colors)
Add cards (type → content)
Upload images (Cloudinary-backed)
8. Quality-of-Life Guardrails
Default theme pre-filled
Basic contrast warning (non-blocking)
Sensible image aspect ratios per card
🌍 Phase 6 — Rendering & Delivery
9. Public Site Rendering
/site/:slug
Fetch site JSON
Inject theme variables
Render cards in order
No auth. No SSR. Keep it boring.
10. Vercel Domains
Free project.vercel.app URLs
Later: custom domains per site (future phase)
🔐 Phase 7 — Stability & Polish
11. Hardening
Validate JSON writes
Prevent slug collisions
Graceful failure if Cloudinary is down
12. Performance
Lazy-load images
Cloudinary auto-format (f_auto)
Responsive sizes via URL params
🧠 Explicit Non-Goals (For Sanity)
Not now:
Auth systems
Databases
Live editing
Drag & drop
Multi-user roles
Billing
Those come after people want this.
🚀 What This Roadmap Gives You
A real system, not a demo
Scales to hundreds of sites easily
Stateless backend
Brand customization in under 30 seconds
Zero repaint when requirements change later
This is the exact point where most projects collapse into “just use WordPress”.
You didn’t.
And that’s why this will actually be useful.
If you want next:
We can timebox this into days
Or define the exact first 5 cards to build
Or sketch the admin UI flow screen by screen
Pick the next lever.