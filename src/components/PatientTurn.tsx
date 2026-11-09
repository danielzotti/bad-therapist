'use client';

import React, { useState } from 'react';
import styles from './PatientTurn.module.css';
import { Card, Player, Language } from '@/types/game';
import { TRANSLATIONS } from '@/utils/translations';
import ComicStrip from './ComicStrip';

interface PatientTurnProps {
  patient: Player;
  question: Card;
  answer: Card;
  language: Language;
  onSubmitTreatment: (card: Card) => void;
}

export default function PatientTurn({
  patient,
  question,
  answer,
  language,
  onSubmitTreatment,
}: PatientTurnProps) {
  const t = TRANSLATIONS[language];
  const [selectedCard, setSelectedCard] = useState<Card | null>(patient.hand[0] || null);

  const handleSubmit = () => {
    if (selectedCard) {
      onSubmitTreatment(selectedCard);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.patientBanner}>
        <div className={styles.titleArea}>
          <h2 className={styles.mainTitle}>{t.patientTurnTitle}</h2>
          <p className={styles.subtitle}>{t.patientTurnSubtitle}</p>
        </div>

        <div className={styles.playerTag}>
          <span className={styles.playerAvatar}>{patient.avatar}</span>
          <span>{patient.name}</span>
        </div>
      </div>

      {/* Comic strip preview with the selected treatment card */}
      <ComicStrip
        question={question}
        answer={answer}
        treatment={selectedCard}
        language={language}
        treatmentPlaceholderText={t.tapToSelect}
      />

      {/* Patient's Hand of 5 Treatment cards */}
      <div className={styles.handSection}>
        <div className={styles.handHeader}>
          <h3 className={styles.handTitle}>
            <span>🃏</span>
            <span>{t.yourHandTitle}</span>
          </h3>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-muted)' }}>
            {patient.hand.length} {language === 'it' ? 'carte' : 'cards'}
          </span>
        </div>

        <div className={styles.handCardsGrid}>
          {patient.hand.map((card) => {
            const isSelected = selectedCard?.id === card.id;
            return (
              <div
                key={card.id}
                className={`${styles.handCard} ${isSelected ? styles.selected : ''}`}
                onClick={() => setSelectedCard(card)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setSelectedCard(card);
                  }
                }}
              >
                <div className={styles.handCardText}>&ldquo;{card.text}&rdquo;</div>
                {isSelected && (
                  <div className={styles.handCardBadge}>✓ {t.selectedCardBadge}</div>
                )}
              </div>
            );
          })}
        </div>

        <button
          type="button"
          className={styles.submitBtn}
          disabled={!selectedCard}
          onClick={handleSubmit}
        >
          <span>{t.submitTreatmentBtn}</span>
        </button>
      </div>
    </div>
  );
}
