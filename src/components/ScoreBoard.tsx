'use client';

import React from 'react';
import styles from './ScoreBoard.module.css';
import { Player, Language } from '@/types/game';
import { TRANSLATIONS } from '@/utils/translations';

interface ScoreBoardProps {
  players: Player[];
  language: Language;
  isGameOver?: boolean;
  winner?: Player | null;
  onClose?: () => void;
  onRestart: () => void;
}

export default function ScoreBoard({
  players,
  language,
  isGameOver = false,
  winner,
  onClose,
  onRestart,
}: ScoreBoardProps) {
  const t = TRANSLATIONS[language];
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className={styles.backdrop} role="dialog" aria-modal="true" aria-label="Leaderboard">
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3 className={styles.title}>
            {isGameOver ? t.gameOverTitle : `📊 ${t.standings}`}
          </h3>
          {!isGameOver && onClose && (
            <button
              type="button"
              className={styles.closeBtn}
              onClick={onClose}
              aria-label={t.close}
            >
              ✕
            </button>
          )}
        </div>

        {isGameOver && winner && (
          <div className={styles.winnerBanner}>
            <div className={styles.winnerTrophy}>👑</div>
            <div className={styles.winnerTitle}>
              {winner.avatar} {winner.name} {language === 'it' ? 'VINCE!' : 'WINS!'}
            </div>
            <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#713f12' }}>
              {t.winnerTagline}
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
              </div>

              <div className={styles.scorePill}>
                {player.score} {language === 'it' ? 'pt' : 'pts'}
              </div>
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
              {language === 'it' ? 'Torna al Gioco' : 'Back to Game'}
            </button>
          )}

          <button
            type="button"
            className={isGameOver ? styles.primaryBtn : styles.secondaryBtn}
            onClick={onRestart}
          >
            {isGameOver ? t.playAgain : (language === 'it' ? 'Ricomincia Partita' : 'Restart')}
          </button>
        </div>
      </div>
    </div>
  );
}
