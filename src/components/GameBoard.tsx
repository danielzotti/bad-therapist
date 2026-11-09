'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styles from './GameBoard.module.css';
import { GamePhase, Patient, Therapy, Player, GameData } from '@/types/game';
import SwipeCard from './SwipeCard';
import PatientCard from './PatientCard';
import PassDeviceScreen from './PassDeviceScreen';
import PlayerSetup from './PlayerSetup';
import ScoreBoard from './ScoreBoard';

// Resilient fallback data in case offline cache has not warmed up yet
const FALLBACK_PATIENTS: Patient[] = [
  { id: 1, text: "I have severe impostor syndrome at work, despite being employee of the month for six consecutive years." },
  { id: 2, text: "Whenever someone calls me on the phone without texting first, my fight-or-flight response activates immediately." },
  { id: 3, text: "I rehearse ordering coffee three times in my head and still say 'You too!' when the barista says 'Enjoy your drink'." },
  { id: 4, text: "I cannot start studying until my room is spotless, my laundry is done, and it is suddenly 3:00 AM." },
  { id: 5, text: "I keep adding $400 worth of luxury items to my online shopping cart just to feel a spark of joy, then close the tab." },
  { id: 6, text: "I get into heated imaginary arguments in the shower and end up furious with people who did nothing." }
];

const FALLBACK_THERAPIES: Therapy[] = [
  { id: 1, text: "Prescribe an emotional support raccoon. Bring it to all company zoom meetings without acknowledging it." },
  { id: 2, text: "Start a rumor in your workplace that you are actually a ghost who died on this floor in 1982." },
  { id: 3, text: "Yell 'OBJECTION!' at the top of your lungs whenever anyone asks you to take on additional responsibilities." },
  { id: 4, text: "Eat an entire raw onion in the shower while playing medieval war chants to intimidate your self-doubt." },
  { id: 5, text: "Flee the country under the alias 'Doctor Linguine' and start an artisanal goat cheese sanctuary." }
];

export default function GameBoard() {
  const [gameData, setGameData] = useState<GameData>({
    patients: FALLBACK_PATIENTS,
    therapies: FALLBACK_THERAPIES,
  });

  const [phase, setPhase] = useState<GamePhase>('setup');
  const [players, setPlayers] = useState<Player[]>([
    { id: '1', name: 'Dr. Quack', avatar: '🩺', score: 0, patientsCured: 0, malpracticeCases: 0 },
    { id: '2', name: 'Dr. Chaos', avatar: '🧠', score: 0, patientsCured: 0, malpracticeCases: 0 },
  ]);
  const [activePlayerIndex, setActivePlayerIndex] = useState(0);
  const [roundNumber, setRoundNumber] = useState(1);
  const [targetScore, setTargetScore] = useState<number>(3);

  // Current turn cards
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
  const [currentTherapy, setCurrentTherapy] = useState<Therapy | null>(null);
  const [turnAction, setTurnAction] = useState<'accepted' | 'rejected' | null>(null);
  const [scoreAwarded, setScoreAwarded] = useState<boolean>(false);

  // Deck pools to avoid immediate repeats
  const [remainingPatientIds, setRemainingPatientIds] = useState<number[]>([]);
  const [remainingTherapyIds, setRemainingTherapyIds] = useState<number[]>([]);

  // Modals & UI states
  const [showScoreModal, setShowScoreModal] = useState(false);

  // Load public/data.json
  useEffect(() => {
    fetch('/data.json')
      .then((res) => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then((data: GameData) => {
        if (data && data.patients && data.therapies) {
          setGameData(data);
          setRemainingPatientIds(data.patients.map((p) => p.id));
          setRemainingTherapyIds(data.therapies.map((t) => t.id));
        }
      })
      .catch((err) => {
        console.warn('[GameBoard] Using fallback data:', err);
        setRemainingPatientIds(FALLBACK_PATIENTS.map((p) => p.id));
        setRemainingTherapyIds(FALLBACK_THERAPIES.map((t) => t.id));
      });
  }, []);

  // Pick random patient
  const drawRandomPatient = useCallback((): Patient => {
    let pool = remainingPatientIds;
    if (pool.length === 0) {
      pool = gameData.patients.map((p) => p.id);
    }
    const randomIndex = Math.floor(Math.random() * pool.length);
    const chosenId = pool[randomIndex];
    setRemainingPatientIds(pool.filter((id) => id !== chosenId));
    return gameData.patients.find((p) => p.id === chosenId) || gameData.patients[0];
  }, [gameData.patients, remainingPatientIds]);

  // Pick random therapy
  const drawRandomTherapy = useCallback((): Therapy => {
    let pool = remainingTherapyIds;
    if (pool.length === 0) {
      pool = gameData.therapies.map((t) => t.id);
    }
    const randomIndex = Math.floor(Math.random() * pool.length);
    const chosenId = pool[randomIndex];
    setRemainingTherapyIds(pool.filter((id) => id !== chosenId));
    return gameData.therapies.find((t) => t.id === chosenId) || gameData.therapies[0];
  }, [gameData.therapies, remainingTherapyIds]);

  // Start game from setup
  const handleStartGame = (configuredPlayers: Player[], goal: number) => {
    setPlayers(configuredPlayers);
    setTargetScore(goal);
    setActivePlayerIndex(0);
    setRoundNumber(1);
    setPhase('pass_device');
  };

  // Current active player object
  const currentPlayer = players[activePlayerIndex] || players[0];

  // Pass device "Ready" clicked -> Draw patient and show dilemma
  const handlePassReady = () => {
    const patient = drawRandomPatient();
    setCurrentPatient(patient);
    setTurnAction(null);
    setScoreAwarded(false);
    setPhase('read_patient');
  };

  // Patient read out loud -> Draw therapy and start swipe phase
  const handleProceedToTherapy = () => {
    const therapy = drawRandomTherapy();
    setCurrentTherapy(therapy);
    setPhase('prescribe');
  };

  // Swiped left or right on therapy card
  const handleSwipe = (direction: 'left' | 'right') => {
    const action = direction === 'right' ? 'accepted' : 'rejected';
    setTurnAction(action);
    setPhase('result');
  };

  // Group verdict award
  const handleRecordVerdict = (cured: boolean) => {
    setPlayers((prev) =>
      prev.map((p, idx) => {
        if (idx !== activePlayerIndex) return p;
        return {
          ...p,
          score: cured ? p.score + 1 : p.score,
          patientsCured: cured ? p.patientsCured + 1 : p.patientsCured,
          malpracticeCases: cured ? p.malpracticeCases : p.malpracticeCases + 1,
        };
      })
    );
    setScoreAwarded(true);
  };

  // Advance turn to next player
  const handleNextTurn = () => {
    // Check if current player just won
    if (targetScore > 0 && currentPlayer.score >= targetScore) {
      setPhase('game_over');
      return;
    }

    const nextIndex = (activePlayerIndex + 1) % players.length;
    if (nextIndex === 0) {
      setRoundNumber((r) => r + 1);
    }
    setActivePlayerIndex(nextIndex);
    setTurnAction(null);
    setScoreAwarded(false);
    setPhase('pass_device');
  };

  // Restart / Reset game
  const handleRestart = () => {
    setShowScoreModal(false);
    setPlayers((prev) =>
      prev.map((p) => ({
        ...p,
        score: 0,
        patientsCured: 0,
        malpracticeCases: 0,
      }))
    );
    setActivePlayerIndex(0);
    setRoundNumber(1);
    setPhase('setup');
  };

  // Current winner if any
  const winner = useMemo(() => {
    if (targetScore <= 0) return null;
    return players.find((p) => p.score >= targetScore) || null;
  }, [players, targetScore]);

  return (
    <main className={styles.wrapper}>
      {/* Top Bar Header */}
      <header className={styles.topBar}>
        <div className={styles.brand}>
          <span className={styles.brandIcon}>🛋️</span>
          <span>Bad Therapist</span>
        </div>

        <div className={styles.topControls}>
          {phase !== 'setup' && (
            <button
              type="button"
              className={styles.iconBtn}
              onClick={() => setShowScoreModal(true)}
              aria-label="View Leaderboard"
            >
              <span>📊</span>
              <span>Standings</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Game Screen depending on phase */}
      <section className={styles.mainArea}>
        {phase === 'setup' && (
          <PlayerSetup
            initialPlayers={players}
            targetScore={targetScore}
            onStartGame={handleStartGame}
          />
        )}

        {phase === 'pass_device' && (
          <PassDeviceScreen
            player={currentPlayer}
            roundNumber={roundNumber}
            onReady={handlePassReady}
          />
        )}

        {phase === 'read_patient' && currentPatient && (
          <PatientCard
            patient={currentPatient}
            currentPlayer={currentPlayer}
            onProceedToTherapy={handleProceedToTherapy}
          />
        )}

        {phase === 'prescribe' && currentTherapy && currentPatient && (
          <div className={styles.prescribeContainer}>
            <div className={styles.patientMiniReminder}>
              <div className={styles.reminderTitle}>
                Patient Dilemma (Dr. {currentPlayer.name}&apos;s turn):
              </div>
              <p className={styles.reminderText}>
                &ldquo;{currentPatient.text}&rdquo;
              </p>
            </div>

            <SwipeCard
              therapy={currentTherapy}
              onSwipe={handleSwipe}
            />
          </div>
        )}

        {phase === 'result' && currentTherapy && currentPatient && (
          <div className={styles.resultCard}>
            <div
              className={`${styles.verdictBadge} ${
                turnAction === 'accepted' ? styles.badgeAccepted : styles.badgeRejected
              }`}
            >
              {turnAction === 'accepted' ? '✅ THERAPY ACCEPTED!' : '❌ THERAPY REJECTED!'}
            </div>

            <h3 className={styles.resultTitle}>
              {currentPlayer.name}&apos;s Diagnosis
            </h3>

            <div className={styles.resultRecap}>
              <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: 4 }}>
                Proposed Treatment:
              </div>
              &ldquo;{currentTherapy.text}&rdquo;
            </div>

            {!scoreAwarded ? (
              <>
                <p className={styles.votePrompt}>
                  Group Verdict: Did this save or doom the patient?
                </p>

                <div className={styles.voteButtonGroup}>
                  <button
                    type="button"
                    className={styles.voteBtnSuccess}
                    onClick={() => handleRecordVerdict(true)}
                  >
                    🏆 Genius Diagnosis! (+1 Point)
                  </button>

                  <button
                    type="button"
                    className={styles.voteBtnFail}
                    onClick={() => handleRecordVerdict(false)}
                  >
                    💀 Pure Malpractice! (0 Points)
                  </button>
                </div>
              </>
            ) : (
              <button
                type="button"
                className={styles.nextTurnBtn}
                onClick={handleNextTurn}
              >
                Pass To Next Therapist 👉
              </button>
            )}
          </div>
        )}

        {phase === 'game_over' && (
          <ScoreBoard
            players={players}
            isGameOver={true}
            winner={winner}
            onRestart={handleRestart}
          />
        )}
      </section>

      {/* Standings Modal during game */}
      {showScoreModal && (
        <ScoreBoard
          players={players}
          isGameOver={false}
          onClose={() => setShowScoreModal(false)}
          onRestart={handleRestart}
        />
      )}

      {/* Footer */}
      <footer className={styles.footer}>
        100% Offline PWA • bad-therapist.zotti.dev
      </footer>
    </main>
  );
}
