# Horrible Therapist 🛋️⚡

A 100% offline-capable digital **"Pass and Play"** party game inspired by **Horrible Therapist** (Exploding Kittens). Built with **Next.js (App Router)**, **TypeScript**, **CSS Modules**, and native browser APIs (zero third-party dependencies).

Deployed as a standalone Progressive Web App (PWA) to **[bad-therapist.zotti.dev](https://bad-therapist.zotti.dev)** via GitHub Pages.

---

## 🎮 How to Play / Regole del Gioco

Each round creates an unhinged, comedic 3-panel comic strip about therapy:
- **Panel 1 / Vignetta 1 (Question / Domanda)**: The patient's dilemma, confession, or problem.
- **Panel 2 / Vignetta 2 (Answer / Risposta)**: The patient's ridiculous escalation or unexpected reaction.
- **Panel 3 / Vignetta 3 (Treatment / Trattamento)**: The punchline therapy prescribed by the player to "cure" the patient.

---

### 🇮🇹 Regole del Gioco (Italiano)

1. **Preparazione (2-8 Giocatori)**:
   - Inserisci i nomi dei giocatori, seleziona avatar e lingua (Italiano o Inglese), e imposta l'obiettivo di punti (**3 punti** regola ufficiale, **5 punti** maratona, o **Infinito**).
   - A ogni giocatore viene distribuita una mano segreta di **5 carte Trattamento**.
2. **Fase 1: Il Caso Clinico (Il Terapeuta)**:
   - Il giocatore di turno nel ruolo di **Terapeuta** (il giudice) tiene il dispositivo.
   - Viene pescata una carta **Domanda** (Vignetta 1) — con possibilità di cambiarla con il tasto *🎲 Cambia Domanda*.
   - Il Terapeuta sceglie una delle opzioni di **Risposta** (Vignetta 2) pescate dal mazzo per impostare la premessa comica.
3. **Fase 2: Prescrivi la Terapia (I Pazienti - Mano di 5 Carte)**:
   - Il dispositivo viene passato a turno a ciascun altro giocatore dietro uno schermo di riservatezza (*Solo per gli occhi di...*).
   - Ciascun paziente legge la premessa delle prime due vignette, consulta la propria mano di **5 carte Trattamento** e seleziona la chiusura più assurda, cinica o esilarante per la Vignetta 3.
   - Una volta inviata la carta, questa viene rimpiazzata immediatamente dal mazzo: la mano resta sempre a 5 carte.
4. **Fase 3: Il Verdetto del Terapeuta**:
   - Il telefono ritorna al Terapeuta.
   - Le proposte ricevute vengono mescolate in modo anonimo *(in partite a 2 giocatori viene aggiunta automaticamente una proposta extra dall'"Intelligenza Malasanitaria 🤖" per garantire sempre una scelta cieca)*.
   - Il Terapeuta legge ad alta voce ogni combinazione completa di 3 vignette al gruppo e premia con **+1 Punto** il Trattamento migliore!
5. **Rotazione & Vittoria**:
   - Il ruolo del Terapeuta passa in senso orario al giocatore successivo.
   - Il primo giocatore che raggiunge **3 punti** (o il traguardo configurato) vince la partita!

---

### 🇬🇧 How to Play (English)

1. **Setup (2-8 Players)**:
   - Set up players, pick emojis and preferred language (Italian or English), and select the win condition (**3 Points** official rules, **5 Points** marathon, or **Endless** party mode).
   - Every player is dealt an initial secret hand of **5 Treatment cards**.
2. **Phase 1: Set Up The Case (The Therapist)**:
   - The device is handed to the active **Therapist** (the round's judge).
   - A **Question card** is drawn for Panel 1 (with an option to *🎲 Reroll Question*).
   - The Therapist selects an **Answer card** (Panel 2) from the drawn options to establish the premise.
3. **Phase 2: Pass to the Patients (5-Card Hand)**:
   - The phone is passed to each non-therapist player one by one behind a privacy shield (*Eyes Only For...*).
   - Each player views the 2-panel setup, checks their hand of **5 Treatment cards**, and submits their funniest or darkest punchline for Panel 3.
   - The submitted card is instantly replaced from the deck so hands always stay at 5.
4. **Phase 3: The Therapist's Verdict**:
   - The device returns to the Therapist.
   - All submitted treatments are shuffled anonymously *(in 2-player games, an extra dummy card from the "Medical Malpractice AI 🤖" is added so the judge always has multiple anonymous options)*.
   - The Therapist reads each full 3-panel comic out loud with dramatic delivery and awards **+1 Point** to the best punchline!
5. **Rotate & Win**:
   - The Therapist role rotates clockwise.
   - The first player to reach **3 points** (or the chosen target) wins the game!

---

## 🌐 Bilingual Deck & Content Details

- **860 Unique Cards per Language (1,720 Total)**:
  - 🛋️ **200 Questions** (Patient dilemmas & confessions)
  - 💥 **60 Answers** (Escalations & unexpected reactions)
  - 💊 **600 Treatments** (Hilarious, dark, and unhinged punchlines)
- **Instant Language Switching**: Toggle between Italian (🇮🇹) and English (🇬🇧) at any time.
- **Customizable Cards (`public/data.json`)**: Easily add, edit, or rebuild decks using `npm run deck:build`.

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
