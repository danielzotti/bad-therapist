'use client';

import React, { useState } from 'react';
import styles from './TherapistSetup.module.css';
import { Card, Player, Language } from '@/types/game';
import { TRANSLATIONS } from '@/utils/translations';
import ComicStrip from './ComicStrip';

interface TherapistSetupProps {
  therapist: Player;
  question: Card;
  answerOptions: Card[];
  language: Language;
  onRerollQuestion: () => void;
  onConfirmSetup: (selectedAnswer: Card) => void;
}

export default function TherapistSetup({
  therapist,
  question,
  answerOptions,
  language,
  onRerollQuestion,
  onConfirmSetup,
}: TherapistSetupProps) {
  const t = TRANSLATIONS[language];
  const [selectedAnswer, setSelectedAnswer] = useState<Card>(answerOptions[0] || null);

  return (
    <div className={styles.container}>
      <div className={styles.introCard}>
        <div>
          <div className={styles.therapistBadge}>
            <span>{therapist.avatar}</span>
            <span>{t.therapist}: {therapist.name}</span>
          </div>
          <h2 className={styles.heading}>{t.therapistSetupTitle}</h2>
          <p className={styles.subheading}>{t.therapistSetupInstructions}</p>
        </div>

        <div className={styles.actionRow}>
          <button
            type="button"
            className={styles.rerollBtn}
            onClick={onRerollQuestion}
            title={t.rerollQuestion}
          >
            {t.rerollQuestion}
          </button>
        </div>
      </div>

      {/* Live Comic Strip Preview */}
      <ComicStrip
        question={question}
        answer={selectedAnswer}
        treatment={null}
        language={language}
        treatmentPlaceholderText={language === 'it' ? 'In attesa delle terapie dei pazienti...' : 'Awaiting patients’ treatments...'}
      />

      {/* Answer selection cards */}
      <div className={styles.answerSelectionSection}>
        <h3 className={styles.sectionTitle}>
          <span>💬</span>
          <span>{t.pickAnswerHeader}</span>
        </h3>

        <div className={styles.answersGrid}>
          {answerOptions.map((ans) => {
            const isSelected = selectedAnswer && selectedAnswer.id === ans.id;
            return (
              <div
                key={ans.id}
                className={`${styles.answerOptionCard} ${isSelected ? styles.selected : ''}`}
                onClick={() => setSelectedAnswer(ans)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setSelectedAnswer(ans);
                  }
                }}
              >
                <div className={styles.answerText}>&ldquo;{ans.text}&rdquo;</div>
                <div className={styles.cardFooter}>
                  {isSelected && <span className={styles.selectTag}>✓ {t.selectedCardBadge}</span>}
                </div>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          className={styles.confirmBtn}
          disabled={!selectedAnswer}
          onClick={() => {
            if (selectedAnswer) onConfirmSetup(selectedAnswer);
          }}
        >
          <span>{t.confirmSetupBtn}</span>
        </button>
      </div>
    </div>
  );
}
