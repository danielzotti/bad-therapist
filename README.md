# Bad Therapist 🛋️⚡

A 100% offline-capable digital **"Pass and Play"** party game built with **Next.js (App Router)**, **TypeScript**, **CSS Modules**, and **native browser APIs** (zero third-party dependencies).

Deployed as a standalone Progressive Web App (PWA) to **[bad-therapist.zotti.dev](https://bad-therapist.zotti.dev)** via GitHub Pages.

---

## 🎮 How to Play

1. **Assemble the Board**: Set up 2 to 8 therapists, customize your names, and choose your avatar (🩺, 🧠, 🕶️, 🤡, etc.). Choose your goal (First to 3, 5, or Endless Party mode).
2. **Pass the Device**: Hand the device to the active therapist.
3. **Examine the Patient**: The active therapist draws a random patient dilemma and reads it out loud to the room.
4. **Prescribe & Swipe**: The therapist draws a bizarre therapy card:
   - **Swipe Right** (or tap **ACCEPT**): Prescribe the outrageous therapy!
   - **Swipe Left** (or tap **REJECT**): Reject the malpractice!
5. **Group Verdict & Banter**: The party laughs, debates, and votes: Did this therapy cure the patient (+1 Point) or result in devastating malpractice (0 Points)?
6. **Pass to the Next Therapist**: The device is handed off and the next round begins!

---

## 🛠️ Architecture & Strict Constraints Met

- **Next.js & Static Export**: App Router with `output: 'export'` in `next.config.mjs` for fast static hosting on GitHub Pages.
- **Zero Third-Party Libraries**: No Framer Motion, no swipe libraries, no PWA wrappers like `next-pwa` or `@serwist/next`. Everything uses native React and standard browser APIs.
- **Vanilla Service Worker (`public/sw.js`)**:
  - Implements **Stale-While-Revalidate** caching.
  - Automatically caches the shell (`/`, `/index.html`), `data.json`, `manifest.json`, and static assets.
  - Serves cached responses instantly while revalidating and refreshing the cache in the background.
  - Fully offline capable after the first load.
- **Native Gesture Swipe Engine (`SwipeCard.tsx`)**:
  - Built with native `onTouchStart`, `onTouchMove`, `onTouchEnd` and matching `mouse` events.
  - Dynamic rotation proportional to horizontal drag distance.
  - Slanted comic "ACCEPT" and "REJECT" stamps fading in smoothly based on drag distance.
  - Spring-back physics when released under threshold; swift fly-off animation when passed threshold.
  - `touch-action: none` and `overscroll-behavior: none` to prevent pull-to-refresh bounces.
  - Accessible on-screen action buttons as accessible fallbacks.
- **Comic & Playful Neo-Brutalist Styling**: Thick 3.5px/4px borders, hard drop shadows, punchy pastel palette, and rounded corners.

---

## 🚀 Development & Build

```bash
# Install dependencies (only core Next.js & React)
npm install

# Run development server
npm run dev

# Build and export static site to /out
npm run build
```

---

## 🌐 Deployment to GitHub Pages

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the Next.js static export and publishes it to GitHub Pages with the custom domain configured in `public/CNAME` (`bad-therapist.zotti.dev`).
