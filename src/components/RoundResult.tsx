'use client';

import React from 'react';
import styles from './RoundResult.module.css';
import { Card, Player, Language } from '@/types/game';
import { TRANSLATIONS } from '@/utils/translations';
import ComicStrip from './ComicStrip';

interface RoundResultProps {
  winnerPlayer: Player;
  question: Card;
  answer: Card;
  winningTreatment: Card;
  language: Language;
  isGameEnding: boolean;
  onNextTurn: () => void;
}

export default function RoundResult({
  winnerPlayer,
  question,
  answer,
  winningTreatment,
  language,
  isGameEnding,
  onNextTurn,
}: RoundResultProps) {
  const t = TRANSLATIONS[language];

  return (
    <div className={styles.container}>
      <div className={styles.winnerCard}>
        <div className={styles.winnerInfo}>
          <div className={styles.avatarBox}>{winnerPlayer.avatar}</div>
          <div className={styles.winnerText}>
            <span className={styles.winnerSub}>{t.submittedBy}</span>
            <span className={styles.winnerName}>{winnerPlayer.name}</span>
          </div>
        </div>

        <div className={styles.scoreDelta}>+1 {language === 'it' ? 'Punto' : 'Point'}!</div>
      </div>

      <div style={{ marginTop: 6, marginBottom: 2 }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--color-dark)' }}>
          {t.winningComicHeader}
        </h3>
      </div>

      <ComicStrip
        question={question}
        answer={answer}
        treatment={winningTreatment}
        language={language}
        isWinningStrip={true}
      />

      <button
        type="button"
        className={styles.nextTurnBtn}
        onClick={onNextTurn}
      >
        <span>{isGameEnding ? t.finishGameBtn : t.nextTurnBtn}</span>
      </button>
    </div>
  );
}
