'use client';

import React from 'react';
import styles from './PassScreen.module.css';
import { Player, Language } from '@/types/game';
import { TRANSLATIONS } from '@/utils/translations';

export type PassMode = 'to_therapist' | 'to_patient' | 'back_to_therapist';

interface PassScreenProps {
  player: Player;
  roundNumber: number;
  mode: PassMode;
  language: Language;
  onReady: () => void;
}

export default function PassScreen({
  player,
  roundNumber,
  mode,
  language,
  onReady,
}: PassScreenProps) {
  const t = TRANSLATIONS[language];

  let title = t.passToTherapistTitle;
  let subtitle = '';
  let showSecretWarning = false;

  if (mode === 'to_therapist') {
    title = t.passToTherapistTitle;
  } else if (mode === 'to_patient') {
    title = t.passToPatientTitle;
    showSecretWarning = true;
  } else if (mode === 'back_to_therapist') {
    title = t.passBackToTherapistTitle;
    subtitle = t.passBackSubtitle;
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <span className={styles.pillBadge}>
          🔄 {t.round} #{roundNumber}
        </span>

        <h2 className={styles.mainHeading}>{title}</h2>

        <div className={styles.avatarCircle}>{player.avatar}</div>

        <div className={styles.playerName}>{player.name}</div>

        <div className={styles.roleBadge}>
          {mode === 'to_patient' ? t.patient : t.therapist} • {player.score} {language === 'it' ? 'Punti' : 'Pts'}
        </div>

        {subtitle && <p style={{ fontWeight: 600, color: 'var(--color-muted)' }}>{subtitle}</p>}

        {showSecretWarning && (
          <div className={styles.secretWarning}>
            <strong>{t.secretShield}</strong> {player.name}
            <div style={{ marginTop: 4, fontWeight: 600 }}>{t.secretWarning}</div>
          </div>
        )}
      </div>

      <button
        type="button"
        className={styles.readyBtn}
        onClick={onReady}
      >
        <span>{t.iAmReady.replace('{name}', player.name)}</span>
        <span>👉</span>
      </button>
    </div>
  );
}
