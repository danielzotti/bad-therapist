'use client';

import React from 'react';
import styles from './ComicStrip.module.css';
import { Card, Language } from '@/types/game';
import { TRANSLATIONS } from '@/utils/translations';

interface ComicStripProps {
  question: Card | null;
  answer: Card | null;
  treatment: Card | null;
  language: Language;
  treatmentPlaceholderText?: string;
  isWinningStrip?: boolean;
}

export default function ComicStrip({
  question,
  answer,
  treatment,
  language,
  treatmentPlaceholderText,
  isWinningStrip = false,
}: ComicStripProps) {
  const t = TRANSLATIONS[language];

  return (
    <div className={styles.stripContainer}>
      {/* Panel 1: Question */}
      <div className={`${styles.panel} ${styles.panel1}`}>
        <div className={styles.panelHeader}>
          <span>{t.panel1Badge}</span>
          <span>🛋️</span>
        </div>
        <div className={styles.panelBody}>
          <div className={styles.avatarSpeaker}>😰</div>
          {question ? (
            <div className={styles.speechBubble}>&ldquo;{question.text}&rdquo;</div>
          ) : (
            <div className={styles.placeholder}>...</div>
          )}
        </div>
      </div>

      {/* Panel 2: Answer */}
      <div className={`${styles.panel} ${styles.panel2}`}>
        <div className={styles.panelHeader}>
          <span>{t.panel2Badge}</span>
          <span>💥</span>
        </div>
        <div className={styles.panelBody}>
          <div className={styles.avatarSpeaker}>🤦</div>
          {answer ? (
            <div className={styles.speechBubble}>&ldquo;{answer.text}&rdquo;</div>
          ) : (
            <div className={styles.placeholder}>...</div>
          )}
        </div>
      </div>

      {/* Panel 3: Treatment */}
      <div className={`${styles.panel} ${styles.panel3}`}>
        {isWinningStrip && <div className={styles.winningBanner}>Winner!</div>}
        <div className={styles.panelHeader}>
          <span>{t.panel3Badge}</span>
          <span>💊</span>
        </div>
        <div className={styles.panelBody}>
          <div className={styles.avatarSpeaker}>🩺</div>
          {treatment ? (
            <div className={styles.speechBubble}>&ldquo;{treatment.text}&rdquo;</div>
          ) : (
            <div className={styles.placeholder}>
              <span className={styles.placeholderIcon}>❓</span>
              <span>{treatmentPlaceholderText || '...'}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
