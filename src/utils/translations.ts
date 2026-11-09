import { Language } from '@/types/game';

export const TRANSLATIONS = {
  it: {
    appTitle: 'Horrible Therapist',
    tagline: 'Il party game a 3 vignette di malasanità comica',
    standings: 'Classifica',
    rules: 'Regole',
    round: 'Turno',
    therapist: 'Terapeuta',
    patient: 'Paziente',

    // Setup
    setupTitle: 'Prepara la Clinica',
    setupSubtitle: 'Party Game Passa & Gioca (da 2 a 8 giocatori)',
    therapistsList: 'Giocatori & Terapeuti',
    addPlayer: '+ Aggiungi Giocatore',
    targetScoreLabel: 'Punti per Vincere:',
    pointsGoal3: '3 Punti (Ufficiale)',
    pointsGoal5: '5 Punti (Maratona)',
    pointsGoalEndless: 'Infinito (Party Libero)',
    languageLabel: 'Lingua Carte & Gioco:',
    minPlayersWarning: 'Aggiungi almeno 2 giocatori (consigliati 3 o più)',
    startGame: 'Inizia la Partita 🚀',

    // Pass Screen
    passToTherapistTitle: 'Passa il Dispositivo al Terapeuta',
    passToPatientTitle: 'Passa il Dispositivo al Giocatore',
    passBackToTherapistTitle: 'Tutti Hanno Scelto!',
    passBackSubtitle: 'Restituisci il telefono al Terapeuta per il giudizio finale.',
    secretShield: '🤫 Solo per gli occhi di:',
    secretWarning: 'Gli altri giocatori (e soprattutto il Terapeuta) NON devono guardare lo schermo!',
    iAmReady: 'Sono {name} • Inizia',

    // Panels
    panel1Badge: '1. Domanda del Paziente',
    panel2Badge: '2. Risposta del Paziente',
    panel3Badge: '3. Terapia / Trattamento',

    // Therapist Setup
    therapistSetupTitle: 'Crea il Caso Clinico',
    therapistSetupInstructions: 'Leggi la domanda e seleziona una risposta per impostare il fumetto:',
    rerollQuestion: '🎲 Cambia Domanda',
    pickAnswerHeader: 'Scegli la seconda vignetta:',
    confirmSetupBtn: 'Conferma Caso & Passa ai Pazienti ➡️',

    // Patient Turn
    patientTurnTitle: 'Prescrivi la Terapia!',
    patientTurnSubtitle: 'Leggi la situazione e seleziona la carta più divertente o spietata dalla tua mano:',
    yourHandTitle: 'La Tua Mano (5 Carte Trattamento)',
    tapToSelect: 'Tocca per provare nel fumetto',
    selectedCardBadge: 'Selezionata',
    submitTreatmentBtn: 'Invia Questo Trattamento 💊',

    // Judging
    judgingTitle: 'Il Verdetto del Terapeuta',
    judgingInstructions: 'Leggi il fumetto con ciascuna delle proposte anonime ad alta voce e scegli la vincente:',
    optionLabel: 'Proposta #{num}',
    awardWinnerBtn: '🏆 Scegli Questo Trattamento Vincente (+1 Punto)',

    // Round Result
    roundResultTitle: 'E il vincitore è...',
    submittedBy: 'Trattamento prescritto da',
    winningComicHeader: 'Fumetto Vincitore del Turno:',
    nextTurnBtn: 'Prossimo Turno (Ruota Terapeuta) 🔄',
    finishGameBtn: 'Vedi il Vincitore 👑',

    // Game Over
    gameOverTitle: '🏆 Trionfo Clinico!',
    winnerTagline: 'È ufficialmente il terapeuta più cinico e brillante della clinica!',
    playAgain: 'Nuova Partita 🔄',
    close: 'Chiudi',
  },
  en: {
    appTitle: 'Horrible Therapist',
    tagline: 'The 3-panel comic party game of comedic malpractice',
    standings: 'Standings',
    rules: 'Rules',
    round: 'Round',
    therapist: 'Therapist',
    patient: 'Patient',

    // Setup
    setupTitle: 'Assemble the Clinic',
    setupSubtitle: 'Pass & Play Party Game (2 to 8 players)',
    therapistsList: 'Players & Therapists',
    addPlayer: '+ Add Player',
    targetScoreLabel: 'Target Score to Win:',
    pointsGoal3: '3 Points (Official)',
    pointsGoal5: '5 Points (Marathon)',
    pointsGoalEndless: 'Endless (Party Mode)',
    languageLabel: 'Card & Game Language:',
    minPlayersWarning: 'Add at least 2 players (3+ recommended)',
    startGame: 'Start Game 🚀',

    // Pass Screen
    passToTherapistTitle: 'Hand Device to the Therapist',
    passToPatientTitle: 'Hand Device to the Player',
    passBackToTherapistTitle: 'All Treatments Submitted!',
    passBackSubtitle: 'Return device to the Therapist for the final verdict.',
    secretShield: '🤫 Eyes Only For:',
    secretWarning: 'Other players (especially the Therapist) MUST NOT look at the screen!',
    iAmReady: "I am {name} • Let's Go",

    // Panels
    panel1Badge: "1. Patient's Question",
    panel2Badge: "2. Patient's Answer",
    panel3Badge: '3. Treatment / Punchline',

    // Therapist Setup
    therapistSetupTitle: 'Set Up The Case',
    therapistSetupInstructions: 'Read the question and select an answer card to set up the 2-panel comic:',
    rerollQuestion: '🎲 Reroll Question',
    pickAnswerHeader: 'Pick Panel 2 to complete the premise:',
    confirmSetupBtn: 'Confirm Setup & Pass to Patients ➡️',

    // Patient Turn
    patientTurnTitle: 'Prescribe The Treatment!',
    patientTurnSubtitle: 'Read the situation and choose the funniest or most unhinged card from your hand:',
    yourHandTitle: 'Your Hand (5 Treatment Cards)',
    tapToSelect: 'Tap to preview in comic',
    selectedCardBadge: 'Selected',
    submitTreatmentBtn: 'Submit This Treatment 💊',

    // Judging
    judgingTitle: "The Therapist's Verdict",
    judgingInstructions: 'Read each anonymous combination out loud to the room and pick the winning punchline:',
    optionLabel: 'Option #{num}',
    awardWinnerBtn: '🏆 Award Point to This Treatment (+1 Point)',

    // Round Result
    roundResultTitle: 'And the winner is...',
    submittedBy: 'Treatment prescribed by',
    winningComicHeader: 'Winning 3-Panel Comic Strip:',
    nextTurnBtn: 'Next Round (Rotate Therapist) 🔄',
    finishGameBtn: 'See Game Champion 👑',

    // Game Over
    gameOverTitle: '🏆 Clinical Champion!',
    winnerTagline: 'Officially certified as the most gloriously unhinged therapist in the clinic!',
    playAgain: 'Play Again 🔄',
    close: 'Close',
  },
};
