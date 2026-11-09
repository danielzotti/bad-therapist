# Horrible Therapist 🛋️⚡

A 100% offline-capable digital **"Pass and Play"** party game inspired by **Horrible Therapist** (Exploding Kittens). Built with **Next.js (App Router)**, **TypeScript**, **CSS Modules**, and native browser APIs (zero third-party dependencies).

Deployed as a standalone Progressive Web App (PWA) to **[bad-therapist.zotti.dev](https://bad-therapist.zotti.dev)** via GitHub Pages.

---

## 🎮 How to Play (3-Panel Comic Rules)

Each round creates an unhinged, comedic 3-panel comic strip about therapy:
- **Panel 1 (Question)**: The patient's problem/dilemma.
- **Panel 2 (Answer)**: The patient's ridiculous escalation or reaction.
- **Panel 3 (Treatment)**: The punchline therapy prescribed to the patient.

### Round Gameplay:
1. **The Therapist Setup**:
   - The device is handed to the active **Therapist** (the judge).
   - The Therapist draws a **Question card** (Panel 1) and selects an **Answer card** (Panel 2) from drawn options to establish the premise.
2. **Pass to the Patients (5-Card Hand)**:
   - The phone is passed to each non-therapist player one by one behind a privacy shield.
   - Each player examines the comic premise, views their private hand of **5 Treatment cards**, and picks the funniest/darkest punchline to submit.
   - Submitted cards are replaced instantly from the deck so hands always stay at 5.
3. **The Therapist's Verdict**:
   - The device returns to the Therapist.
   - The Therapist reviews all submitted treatments (shuffled anonymously), reads each full 3-panel comic out loud to the party, and awards **+1 Point** to the best punchline!
4. **Rotate & Win**:
   - The Therapist role rotates clockwise.
   - The first player to reach **3 points** (or configurable 5 / endless mode) wins the game!

---

## 🌐 Language Selector & Custom Cards

- **Bilingual Support (🇮🇹 Italian & 🇬🇧 English)**: Easily switch languages anytime directly from the setup screen or header toggle.
- **Customizable Cards (`public/data.json`)**: Easily add, edit, or import custom cards across `questions`, `answers`, and `treatments` in either language.

---

## 🛠️ Architecture & Strict Constraints Met

- **Next.js & Static Export**: App Router with `output: 'export'` in `next.config.mjs` for fast static hosting on GitHub Pages.
- **Zero Third-Party Libraries**: No external state management or UI libraries; everything uses native React 19 and standard Web APIs.
- **Vanilla Service Worker (`public/sw.js`)**:
  - Implements **Stale-While-Revalidate** caching.
  - Automatically caches the shell (`/`, `/index.html`), `data.json`, `manifest.json`, and static assets.
  - Fully offline capable after the first load.
- **Comic & Neo-Brutalist Styling**: 3-panel comic strip design, speech bubbles, vibrant pastel palette, thick borders, and hard drop shadows.

---

## 🚀 Development & Build

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build and export static site to /out
npm run build
```

---

## 🌐 Deployment to GitHub Pages

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the Next.js static export and publishes it to GitHub Pages with the custom domain configured in `public/CNAME` (`bad-therapist.zotti.dev`).
