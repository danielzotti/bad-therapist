'use client';

import React from 'react';
import styles from './ScoreBoard.module.css';
import { Player } from '@/types/game';

interface ScoreBoardProps {
  players: Player[];
  isGameOver?: boolean;
  winner?: Player | null;
  onClose?: () => void;
  onRestart: () => void;
}

export default function ScoreBoard({
  players,
  isGameOver = false,
  winner,
  onClose,
  onRestart,
}: ScoreBoardProps) {
  // Sort players descending by score
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className={styles.backdrop} role="dialog" aria-modal="true" aria-label="Leaderboard">
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3 className={styles.title}>
            {isGameOver ? '🏆 Victory Banquet!' : '📊 Therapist Standings'}
          </h3>
          {!isGameOver && onClose && (
            <button
              type="button"
              className={styles.closeBtn}
              onClick={onClose}
              aria-label="Close Scoreboard"
            >
              ✕
            </button>
          )}
        </div>

        {isGameOver && winner && (
          <div className={styles.winnerBanner}>
            <div className={styles.winnerTrophy}>👑</div>
            <div className={styles.winnerTitle}>
              {winner.avatar} {winner.name} WINS!
            </div>
            <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#713f12' }}>
              Officially certified as the least catastrophic therapist in the clinic!
            </p>
          </div>
        )}

        <div className={styles.leaderboardList}>
          {sortedPlayers.map((player, index) => (
            <div key={player.id} className={styles.leaderRow}>
              <div
                className={`${styles.rankBadge} ${index === 0 ? styles.rankFirst : ''}`}
              >
                #{index + 1}
              </div>

              <div className={styles.playerInfo}>
                <div className={styles.playerName}>
                  <span>{player.avatar}</span>
                  <span>{player.name}</span>
                  {index === 0 && <span>⭐</span>}
                </div>
                <div className={styles.playerSub}>
                  {player.patientsCured} Cured • {player.malpracticeCases} Malpractice
                </div>
              </div>

              <div className={styles.scorePill}>{player.score} pts</div>
            </div>
          ))}
        </div>

        <div className={styles.actionButtons}>
          {!isGameOver && onClose && (
            <button
              type="button"
              className={styles.primaryBtn}
              onClick={onClose}
            >
              Back to Game
            </button>
          )}

          <button
            type="button"
            className={isGameOver ? styles.primaryBtn : styles.secondaryBtn}
            onClick={onRestart}
          >
            {isGameOver ? 'Play Again 🚀' : 'Restart'}
          </button>
        </div>
      </div>
    </div>
  );
}
