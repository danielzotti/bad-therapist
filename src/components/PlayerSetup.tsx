'use client';

import React, { useState } from 'react';
import styles from './PlayerSetup.module.css';
import { Player } from '@/types/game';

interface PlayerSetupProps {
  initialPlayers: Player[];
  targetScore: number;
  onStartGame: (players: Player[], targetScore: number) => void;
}

const AVAILABLE_AVATARS = ['🩺', '🧠', '🕶️', '🤡', '☕', '🐱', '🦖', '🎭', '🥑', '🛸', '🍕', '🦄'];

export default function PlayerSetup({
  initialPlayers,
  targetScore,
  onStartGame,
}: PlayerSetupProps) {
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [scoreGoal, setScoreGoal] = useState<number>(targetScore);

  const handleNameChange = (id: string, newName: string) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, name: newName } : p))
    );
  };

  const handleCycleAvatar = (id: string) => {
    setPlayers((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const currentIndex = AVAILABLE_AVATARS.indexOf(p.avatar);
        const nextIndex = (currentIndex + 1) % AVAILABLE_AVATARS.length;
        return { ...p, avatar: AVAILABLE_AVATARS[nextIndex] };
      })
    );
  };

  const handleAddPlayer = () => {
    if (players.length >= 8) return;
    const newId = String(Date.now());
    const nextAvatar = AVAILABLE_AVATARS[players.length % AVAILABLE_AVATARS.length];
    setPlayers((prev) => [
      ...prev,
      {
        id: newId,
        name: `Therapist ${prev.length + 1}`,
        avatar: nextAvatar,
        score: 0,
        patientsCured: 0,
        malpracticeCases: 0,
      },
    ]);
  };

  const handleRemovePlayer = (id: string) => {
    if (players.length <= 2) return;
    setPlayers((prev) => prev.filter((p) => p.id !== id));
  };

  const handleStart = () => {
    // Sanitize player names
    const cleaned = players.map((p, idx) => ({
      ...p,
      name: p.name.trim() || `Therapist ${idx + 1}`,
    }));
    onStartGame(cleaned, scoreGoal);
  };

  return (
    <div className={styles.container}>
      <div className={styles.setupCard}>
        <div className={styles.titleArea}>
          <h2 className={styles.title}>Assemble The Board</h2>
          <p className={styles.subtitle}>Pass & Play Setup (2 to 8 Therapists)</p>
        </div>

        <div className={styles.playerList}>
          {players.map((player) => (
            <div key={player.id} className={styles.playerRow}>
              <button
                type="button"
                className={styles.avatarButton}
                onClick={() => handleCycleAvatar(player.id)}
                title="Tap to change avatar"
                aria-label="Change avatar"
              >
                {player.avatar}
              </button>

              <input
                type="text"
                className={styles.nameInput}
                value={player.name}
                maxLength={18}
                onChange={(e) => handleNameChange(player.id, e.target.value)}
                placeholder="Therapist name"
                aria-label={`Name for player ${player.id}`}
              />

              <button
                type="button"
                className={styles.removeButton}
                disabled={players.length <= 2}
                onClick={() => handleRemovePlayer(player.id)}
                title="Remove player"
                aria-label={`Remove ${player.name}`}
              >
                ✕
              </button>
            </div>
          ))}

          <button
            type="button"
            className={styles.addPlayerButton}
            onClick={handleAddPlayer}
            disabled={players.length >= 8}
          >
            <span>+ Add Another Therapist</span>
          </button>
        </div>

        <div className={styles.targetSection}>
          <span className={styles.targetLabel}>Victory Condition:</span>
          <div className={styles.targetOptions}>
            <button
              type="button"
              className={`${styles.targetOptionBtn} ${scoreGoal === 3 ? styles.targetOptionActive : ''}`}
              onClick={() => setScoreGoal(3)}
            >
              First to 3
            </button>
            <button
              type="button"
              className={`${styles.targetOptionBtn} ${scoreGoal === 5 ? styles.targetOptionActive : ''}`}
              onClick={() => setScoreGoal(5)}
            >
              First to 5
            </button>
            <button
              type="button"
              className={`${styles.targetOptionBtn} ${scoreGoal === 0 ? styles.targetOptionActive : ''}`}
              onClick={() => setScoreGoal(0)}
            >
              Endless Party
            </button>
          </div>
        </div>
      </div>

      <button
        type="button"
        className={styles.startButton}
        onClick={handleStart}
      >
        <span>Open The Clinic 🛋️</span>
      </button>
    </div>
  );
}
