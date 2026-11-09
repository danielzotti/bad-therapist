'use client';

import React, { useState } from 'react';
import styles from './JudgingScreen.module.css';
import { Card, Player, Language, SubmittedTreatment } from '@/types/game';
import { TRANSLATIONS } from '@/utils/translations';
import ComicStrip from './ComicStrip';

interface JudgingScreenProps {
  therapist: Player;
  question: Card;
  answer: Card;
  submittedTreatments: SubmittedTreatment[];
  language: Language;
  onAwardWinner: (winningSubmission: SubmittedTreatment) => void;
}

export default function JudgingScreen({
  therapist,
  question,
  answer,
  submittedTreatments,
  language,
  onAwardWinner,
}: JudgingScreenProps) {
  const t = TRANSLATIONS[language];
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const currentSelection = submittedTreatments[selectedIndex] || submittedTreatments[0];

  return (
    <div className={styles.container}>
      <div className={styles.introCard}>
        <div>
          <div className={styles.therapistBadge}>
            <span>{therapist.avatar}</span>
            <span>{t.therapist}: {therapist.name}</span>
          </div>
          <h2 className={styles.heading}>{t.judgingTitle}</h2>
          <p className={styles.subheading}>{t.judgingInstructions}</p>
        </div>
      </div>

      {/* Comic strip previewing the currently selected treatment option */}
      <ComicStrip
        question={question}
        answer={answer}
        treatment={currentSelection?.card || null}
        language={language}
      />

      <div className={styles.optionsSection}>
        <div className={styles.optionsNav}>
          {submittedTreatments.map((sub, idx) => (
            <button
              key={`${sub.playerId}-${idx}`}
              type="button"
              className={`${styles.optionTab} ${idx === selectedIndex ? styles.active : ''}`}
              onClick={() => setSelectedIndex(idx)}
            >
              {t.optionLabel.replace('{num}', String(idx + 1))}
            </button>
          ))}
        </div>

        <div className={styles.optionsCardsList}>
          {submittedTreatments.map((sub, idx) => {
            const isActive = idx === selectedIndex;
            return (
              <div
                key={`${sub.playerId}-${idx}`}
                className={`${styles.optionCard} ${isActive ? styles.active : ''}`}
                onClick={() => setSelectedIndex(idx)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setSelectedIndex(idx);
                  }
                }}
              >
                <div className={styles.optionNumber}>
                  {t.optionLabel.replace('{num}', String(idx + 1))}
                </div>
                <div className={styles.optionText}>&ldquo;{sub.card.text}&rdquo;</div>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          className={styles.awardBtn}
          onClick={() => {
            if (currentSelection) onAwardWinner(currentSelection);
          }}
        >
          <span>{t.awardWinnerBtn}</span>
        </button>
      </div>
    </div>
  );
}
