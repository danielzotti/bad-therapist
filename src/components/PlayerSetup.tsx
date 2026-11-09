'use client';

import React, { useState } from 'react';
import styles from './PlayerSetup.module.css';
import { Player, Language } from '@/types/game';
import { TRANSLATIONS } from '@/utils/translations';

interface PlayerSetupProps {
  initialPlayers: Player[];
  targetScore: number;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onStartGame: (players: Player[], targetScore: number) => void;
}

const AVAILABLE_AVATARS = ['🩺', '🧠', '🕶️', '🤡', '☕', '🐱', '🦖', '🎭', '🥑', '🛸', '🍕', '🦄'];

export default function PlayerSetup({
  initialPlayers,
  targetScore,
  language,
  onLanguageChange,
  onStartGame,
}: PlayerSetupProps) {
  const t = TRANSLATIONS[language];
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
    const defaultName = language === 'it' ? `Giocatore ${players.length + 1}` : `Player ${players.length + 1}`;
    setPlayers((prev) => [
      ...prev,
      {
        id: newId,
        name: defaultName,
        avatar: nextAvatar,
        score: 0,
        hand: [],
      },
    ]);
  };

  const handleRemovePlayer = (id: string) => {
    if (players.length <= 2) return;
    setPlayers((prev) => prev.filter((p) => p.id !== id));
  };

  const handleStart = () => {
    const cleaned = players.map((p, idx) => ({
      ...p,
      name: p.name.trim() || (language === 'it' ? `Giocatore ${idx + 1}` : `Player ${idx + 1}`),
    }));
    onStartGame(cleaned, scoreGoal);
  };

  return (
    <div className={styles.container}>
      <div className={styles.setupCard}>
        <div className={styles.titleArea}>
          <h2 className={styles.title}>{t.setupTitle}</h2>
          <p className={styles.subtitle}>{t.setupSubtitle}</p>
        </div>

        {/* Language selector */}
        <div className={styles.targetSection}>
          <span className={styles.targetLabel}>{t.languageLabel}</span>
          <div className={styles.targetOptions}>
            <button
              type="button"
              className={`${styles.targetOptionBtn} ${language === 'it' ? styles.targetOptionActive : ''}`}
              onClick={() => onLanguageChange('it')}
            >
              🇮🇹 Italiano
            </button>
            <button
              type="button"
              className={`${styles.targetOptionBtn} ${language === 'en' ? styles.targetOptionActive : ''}`}
              onClick={() => onLanguageChange('en')}
            >
              🇬🇧 English
            </button>
          </div>
        </div>

        {/* Players list */}
        <div className={styles.playerList}>
          <span className={styles.targetLabel}>{t.therapistsList}:</span>
          {players.map((player) => (
            <div key={player.id} className={styles.playerRow}>
              <button
                type="button"
                className={styles.avatarButton}
                onClick={() => handleCycleAvatar(player.id)}
                title="Change avatar"
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
                placeholder="Name"
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
            <span>{t.addPlayer}</span>
          </button>
        </div>

        {/* Target score */}
        <div className={styles.targetSection}>
          <span className={styles.targetLabel}>{t.targetScoreLabel}</span>
          <div className={styles.targetOptions}>
            <button
              type="button"
              className={`${styles.targetOptionBtn} ${scoreGoal === 3 ? styles.targetOptionActive : ''}`}
              onClick={() => setScoreGoal(3)}
            >
              {t.pointsGoal3}
            </button>
            <button
              type="button"
              className={`${styles.targetOptionBtn} ${scoreGoal === 5 ? styles.targetOptionActive : ''}`}
              onClick={() => setScoreGoal(5)}
            >
              {t.pointsGoal5}
            </button>
            <button
              type="button"
              className={`${styles.targetOptionBtn} ${scoreGoal === 0 ? styles.targetOptionActive : ''}`}
              onClick={() => setScoreGoal(0)}
            >
              {t.pointsGoalEndless}
            </button>
          </div>
        </div>
      </div>

      <button
        type="button"
        className={styles.startButton}
        onClick={handleStart}
      >
        <span>{t.startGame}</span>
      </button>
    </div>
  );
}
