'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styles from './GameBoard.module.css';
import {
  GamePhase,
  Card,
  Player,
  GameData,
  Language,
  SubmittedTreatment,
} from '@/types/game';
import { TRANSLATIONS } from '@/utils/translations';
import PlayerSetup from './PlayerSetup';
import PassScreen from './PassScreen';
import TherapistSetup from './TherapistSetup';
import PatientTurn from './PatientTurn';
import JudgingScreen from './JudgingScreen';
import RoundResult from './RoundResult';
import ScoreBoard from './ScoreBoard';
import RulesModal from './RulesModal';

// Resilient Fallback Data
const FALLBACK_DATA: GameData = {
  it: {
    questions: [
      { id: 1, text: "Dottore, non riesco a dormire la notte perché ripenso a figure imbarazzanti fatte 12 anni fa." },
      { id: 2, text: "Continuo a innamorarmi solo di persone emotivamente non disponibili che mi lasciano in visualizzato." },
      { id: 3, text: "Ogni volta che qualcuno mi chiama al telefono senza mandarmi prima un messaggio, vado in iperventilazione." },
    ],
    answers: [
      { id: 1, text: "E la parte peggiore è che avevano assolutamente ragione tutti quanti." },
      { id: 2, text: "Quindi ho finto la mia morte e ho aperto un rifugio abusivo per alpaca." },
    ],
    treatments: [
      { id: 1, text: "Ti prescrivo un clistere di caffè bollente e un sonoro ceffone morale sulla nuca." },
      { id: 2, text: "Fingi di essere posseduto da uno spirito medievale durante la prossima riunione su Teams." },
      { id: 3, text: "Ecco 500mg di pillole placebo e il numero di uno sciamano che legge i fondi di tequila." },
      { id: 4, text: "Mangia un'intera cipolla cruda sotto la doccia al buio ascoltando cori gregoriani a tutto volume." },
      { id: 5, text: "Adotta un procione selvatico e portalo a ogni incontro sociale fingendo che sia il tuo avvocato." },
    ],
  },
  en: {
    questions: [
      { id: 1, text: "Doctor, I can't sleep at night because I relive excruciatingly embarrassing moments from 2012." },
      { id: 2, text: "I keep falling in love with emotionally unavailable people who leave me on delivered for four business days." },
      { id: 3, text: "Whenever someone calls me on the phone without texting first, my fight-or-flight response goes into hyperdrive." },
    ],
    answers: [
      { id: 1, text: "And the absolute worst part is that they were 100% correct about everything." },
      { id: 2, text: "So naturally, I faked my death and opened an unauthorized llama sanctuary." },
    ],
    treatments: [
      { id: 1, text: "I am prescribing a scalding coffee enema and a firm, non-consensual slap across the face." },
      { id: 2, text: "Pretend to be possessed by a 14th-century peasant during your next corporate review." },
      { id: 3, text: "Take these 500mg sugar pills and call this sketchy psychic who reads tequila dregs." },
      { id: 4, text: "Consume an entire raw onion in the shower while medieval war chants play on full blast." },
      { id: 5, text: "Adopt a feral raccoon and bring it to every social gathering as your licensed legal counsel." },
    ],
  },
};

export default function GameBoard() {
  const [language, setLanguage] = useState<Language>('it');
  const [gameData, setGameData] = useState<GameData>(FALLBACK_DATA);
  const [phase, setPhase] = useState<GamePhase>('setup');

  const [players, setPlayers] = useState<Player[]>([
    { id: '1', name: 'Dr. Quack', avatar: '🩺', score: 0, hand: [] },
    { id: '2', name: 'Dr. Chaos', avatar: '🧠', score: 0, hand: [] },
    { id: '3', name: 'Dr. Panic', avatar: '☕', score: 0, hand: [] },
  ]);

  const [therapistIndex, setTherapistIndex] = useState(0);
  const [roundNumber, setRoundNumber] = useState(1);
  const [targetScore, setTargetScore] = useState<number>(3);

  // Deck pool state
  const [remainingQuestions, setRemainingQuestions] = useState<Card[]>([]);
  const [remainingAnswers, setRemainingAnswers] = useState<Card[]>([]);
  const [remainingTreatments, setRemainingTreatments] = useState<Card[]>([]);

  // Current Round State
  const [currentQuestion, setCurrentQuestion] = useState<Card | null>(null);
  const [answerOptions, setAnswerOptions] = useState<Card[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<Card | null>(null);

  // Patient Submissions Queue
  const [patientQueue, setPatientQueue] = useState<string[]>([]);
  const [currentPatientId, setCurrentPatientId] = useState<string | null>(null);
  const [submittedTreatments, setSubmittedTreatments] = useState<SubmittedTreatment[]>([]);
  const [winningSubmission, setWinningSubmission] = useState<SubmittedTreatment | null>(null);

  // Modals
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);

  const t = TRANSLATIONS[language];

  // Fetch /data.json
  useEffect(() => {
    fetch('/data.json')
      .then((res) => {
        if (!res.ok) throw new Error('Data fetch failed');
        return res.json();
      })
      .then((data: GameData) => {
        if (data && data.it && data.en) {
          setGameData(data);
        }
      })
      .catch((err) => {
        console.warn('[GameBoard] Using fallback cards:', err);
      });
  }, []);

  // Update deck pools when gameData or language changes
  useEffect(() => {
    const deck = gameData[language] || FALLBACK_DATA[language];
    setRemainingQuestions([...deck.questions]);
    setRemainingAnswers([...deck.answers]);
    setRemainingTreatments([...deck.treatments]);
  }, [gameData, language]);

  // Card Draw Helpers
  const drawCard = useCallback((deckType: 'questions' | 'answers' | 'treatments'): Card => {
    const currentDeck = gameData[language] || FALLBACK_DATA[language];
    const source = currentDeck[deckType];

    let pool =
      deckType === 'questions'
        ? remainingQuestions
        : deckType === 'answers'
        ? remainingAnswers
        : remainingTreatments;

    if (pool.length === 0) {
      pool = [...source];
    }

    const randomIndex = Math.floor(Math.random() * pool.length);
    const chosen = pool[randomIndex];
    const nextPool = pool.filter((_, i) => i !== randomIndex);

    if (deckType === 'questions') setRemainingQuestions(nextPool);
    else if (deckType === 'answers') setRemainingAnswers(nextPool);
    else setRemainingTreatments(nextPool);

    return chosen || source[0];
  }, [gameData, language, remainingAnswers, remainingQuestions, remainingTreatments]);

  // Draw 5 Treatment cards for a player's initial hand
  const drawTreatmentHand = useCallback((count = 5): Card[] => {
    const hand: Card[] = [];
    for (let i = 0; i < count; i++) {
      hand.push(drawCard('treatments'));
    }
    return hand;
  }, [drawCard]);

  // 1. START GAME FROM SETUP
  const handleStartGame = (configuredPlayers: Player[], goal: number) => {
    // Deal 5 Treatment cards to each player
    const initializedPlayers: Player[] = configuredPlayers.map((p) => ({
      ...p,
      score: 0,
      hand: drawTreatmentHand(5),
    }));

    setPlayers(initializedPlayers);
    setTargetScore(goal);
    setTherapistIndex(0);
    setRoundNumber(1);
    setPhase('pass_therapist');
  };

  const currentTherapist = players[therapistIndex] || players[0];

  // 2. THERAPIST PASS SCREEN -> READY
  const handleTherapistReady = () => {
    const q = drawCard('questions');
    const a1 = drawCard('answers');
    const a2 = drawCard('answers');
    setCurrentQuestion(q);
    setAnswerOptions([a1, a2]);
    setSelectedAnswer(a1);
    setPhase('therapist_setup');
  };

  // 3. THERAPIST REROLL QUESTION
  const handleRerollQuestion = () => {
    const newQ = drawCard('questions');
    setCurrentQuestion(newQ);
  };

  // 4. THERAPIST CONFIRMS PANELS 1 & 2
  const handleConfirmTherapistSetup = (chosenAnswer: Card) => {
    setSelectedAnswer(chosenAnswer);
    setSubmittedTreatments([]);

    // Build the queue of patients who must submit (everyone except current therapist)
    const patientIds = players
      .filter((_, idx) => idx !== therapistIndex)
      .map((p) => p.id);

    setPatientQueue(patientIds);
    setCurrentPatientId(patientIds[0]);
    setPhase('pass_patient');
  };

  // Current Patient submitting
  const currentPatient = useMemo(() => {
    return players.find((p) => p.id === currentPatientId) || players[0];
  }, [players, currentPatientId]);

  // 5. PATIENT PASS SCREEN -> READY
  const handlePatientReady = () => {
    setPhase('patient_turn');
  };

  // 6. PATIENT SUBMITS TREATMENT CARD
  const handleSubmitTreatment = (submittedCard: Card) => {
    if (!currentPatientId) return;

    // Remove submitted card from player's hand and draw a new one
    const newReplacement = drawCard('treatments');
    setPlayers((prev) =>
      prev.map((p) => {
        if (p.id !== currentPatientId) return p;
        const newHand = p.hand.filter((c) => c.id !== submittedCard.id);
        newHand.push(newReplacement);
        return { ...p, hand: newHand };
      })
    );

    // Record submission
    const newSubmissions: SubmittedTreatment[] = [
      ...submittedTreatments,
      { playerId: currentPatientId, card: submittedCard },
    ];
    setSubmittedTreatments(newSubmissions);

    // Check next player in queue
    const remainingQueue = patientQueue.filter((id) => id !== currentPatientId);
    setPatientQueue(remainingQueue);

    if (remainingQueue.length > 0) {
      setCurrentPatientId(remainingQueue[0]);
      setPhase('pass_patient');
    } else {
      // If only 1 patient played (2-player game), add a random dummy card from deck
      let finalSubmissions = [...newSubmissions];
      if (finalSubmissions.length < 2) {
        finalSubmissions.push({
          playerId: 'dummy',
          card: drawCard('treatments'),
          isDummy: true,
        });
      }

      // Shuffle submissions anonymously using Fisher-Yates
      for (let i = finalSubmissions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [finalSubmissions[i], finalSubmissions[j]] = [
          finalSubmissions[j],
          finalSubmissions[i],
        ];
      }

      setSubmittedTreatments(finalSubmissions);
      setPhase('pass_back_to_therapist');
    }
  };

  // 7. PASS BACK TO THERAPIST -> START JUDGING
  const handleJudgingReady = () => {
    setPhase('judging');
  };

  // 8. THERAPIST AWARDS WINNER
  const handleAwardWinner = (winningSub: SubmittedTreatment) => {
    setWinningSubmission(winningSub);

    // If real player won, increment score
    if (!winningSub.isDummy) {
      setPlayers((prev) =>
        prev.map((p) =>
          p.id === winningSub.playerId ? { ...p, score: p.score + 1 } : p
        )
      );
    }

    setPhase('round_result');
  };

  // Find winning player object
  const roundWinnerPlayer = useMemo(() => {
    if (!winningSubmission) return currentTherapist;
    if (winningSubmission.isDummy) {
      return {
        id: 'dummy',
        name: language === 'it' ? 'Intelligenza Malasanitaria 🤖' : 'Medical Malpractice AI 🤖',
        avatar: '🤖',
        score: 0,
        hand: [],
      };
    }
    return players.find((p) => p.id === winningSubmission.playerId) || currentTherapist;
  }, [winningSubmission, currentTherapist, language, players]);

  // Is game ending this round?
  const isGameEnding = useMemo(() => {
    if (targetScore <= 0) return false;
    return players.some((p) => p.score >= targetScore);
  }, [players, targetScore]);

  // 9. ADVANCE TURN / NEXT ROUND
  const handleNextRound = () => {
    if (isGameEnding) {
      setPhase('game_over');
      return;
    }

    const nextIndex = (therapistIndex + 1) % players.length;
    if (nextIndex === 0) {
      setRoundNumber((r) => r + 1);
    }
    setTherapistIndex(nextIndex);
    setCurrentQuestion(null);
    setAnswerOptions([]);
    setSelectedAnswer(null);
    setSubmittedTreatments([]);
    setWinningSubmission(null);
    setPhase('pass_therapist');
  };

  // Restart Game
  const handleRestart = () => {
    setShowScoreModal(false);
    setPlayers((prev) =>
      prev.map((p) => ({
        ...p,
        score: 0,
        hand: drawTreatmentHand(5),
      }))
    );
    setTherapistIndex(0);
    setRoundNumber(1);
    setCurrentQuestion(null);
    setAnswerOptions([]);
    setSelectedAnswer(null);
    setSubmittedTreatments([]);
    setWinningSubmission(null);
    setPhase('setup');
  };

  // Overall winner
  const overallWinner = useMemo(() => {
    if (targetScore <= 0) return null;
    return players.find((p) => p.score >= targetScore) || null;
  }, [players, targetScore]);

  return (
    <main className={styles.wrapper}>
      {/* Top Header Bar */}
      <header className={styles.topBar}>
        <div className={styles.brand}>
          <span className={styles.brandIcon}>🛋️</span>
          <span>{t.appTitle}</span>
        </div>

        <div className={styles.topControls}>
          {/* Language Toggle in Header */}
          <button
            type="button"
            className={styles.iconBtn}
            onClick={() => setLanguage((l) => (l === 'it' ? 'en' : 'it'))}
            aria-label="Toggle language"
            title="Switch Language"
          >
            <span>{language === 'it' ? '🇮🇹 IT' : '🇬🇧 EN'}</span>
          </button>

          {/* Rules Modal Button */}
          <button
            type="button"
            className={styles.iconBtn}
            onClick={() => setShowRulesModal(true)}
            aria-label="Game Rules"
            title={t.rules}
          >
            <span>📖</span>
            <span>{t.rules}</span>
          </button>

          {/* Standings Modal Button */}
          {phase !== 'setup' && (
            <button
              type="button"
              className={styles.iconBtn}
              onClick={() => setShowScoreModal(true)}
              aria-label="View Standings"
              title={t.standings}
            >
              <span>📊</span>
              <span>{t.standings}</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Game Screen */}
      <section className={styles.mainArea}>
        {/* Phase 1: Setup */}
        {phase === 'setup' && (
          <PlayerSetup
            initialPlayers={players}
            targetScore={targetScore}
            language={language}
            onLanguageChange={setLanguage}
            onStartGame={handleStartGame}
          />
        )}

        {/* Phase 2: Pass Device to Therapist */}
        {phase === 'pass_therapist' && (
          <PassScreen
            player={currentTherapist}
            roundNumber={roundNumber}
            mode="to_therapist"
            language={language}
            onReady={handleTherapistReady}
          />
        )}

        {/* Phase 3: Therapist Sets Panels 1 & 2 */}
        {phase === 'therapist_setup' && currentQuestion && (
          <TherapistSetup
            therapist={currentTherapist}
            question={currentQuestion}
            answerOptions={answerOptions}
            language={language}
            onRerollQuestion={handleRerollQuestion}
            onConfirmSetup={handleConfirmTherapistSetup}
          />
        )}

        {/* Phase 4: Pass to Patient */}
        {phase === 'pass_patient' && currentPatient && (
          <PassScreen
            player={currentPatient}
            roundNumber={roundNumber}
            mode="to_patient"
            language={language}
            onReady={handlePatientReady}
          />
        )}

        {/* Phase 5: Patient's Turn (5-Card Hand Selection) */}
        {phase === 'patient_turn' && currentPatient && currentQuestion && selectedAnswer && (
          <PatientTurn
            patient={currentPatient}
            question={currentQuestion}
            answer={selectedAnswer}
            language={language}
            onSubmitTreatment={handleSubmitTreatment}
          />
        )}

        {/* Phase 6: Pass Back to Therapist */}
        {phase === 'pass_back_to_therapist' && (
          <PassScreen
            player={currentTherapist}
            roundNumber={roundNumber}
            mode="back_to_therapist"
            language={language}
            onReady={handleJudgingReady}
          />
        )}

        {/* Phase 7: Therapist Judging */}
        {phase === 'judging' && currentQuestion && selectedAnswer && (
          <JudgingScreen
            therapist={currentTherapist}
            question={currentQuestion}
            answer={selectedAnswer}
            submittedTreatments={submittedTreatments}
            language={language}
            onAwardWinner={handleAwardWinner}
          />
        )}

        {/* Phase 8: Round Result */}
        {phase === 'round_result' && currentQuestion && selectedAnswer && winningSubmission && (
          <RoundResult
            winnerPlayer={roundWinnerPlayer}
            question={currentQuestion}
            answer={selectedAnswer}
            winningTreatment={winningSubmission.card}
            language={language}
            isGameEnding={isGameEnding}
            onNextTurn={handleNextRound}
          />
        )}

        {/* Phase 9: Game Over */}
        {phase === 'game_over' && (
          <ScoreBoard
            players={players}
            language={language}
            isGameOver={true}
            winner={overallWinner}
            onRestart={handleRestart}
          />
        )}
      </section>

      {/* Floating / Dialog Modals */}
      {showScoreModal && (
        <ScoreBoard
          players={players}
          language={language}
          isGameOver={false}
          onClose={() => setShowScoreModal(false)}
          onRestart={handleRestart}
        />
      )}

      {showRulesModal && (
        <RulesModal
          language={language}
          onClose={() => setShowRulesModal(false)}
        />
      )}

      <footer className={styles.footer}>
        🛋️ Horrible Therapist • 100% Offline Pass &amp; Play PWA • 3-Panel Comic Edition
      </footer>
    </main>
  );
}
