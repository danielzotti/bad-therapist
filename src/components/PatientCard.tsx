'use client';

import React from 'react';
import styles from './PatientCard.module.css';
import { Patient, Player } from '@/types/game';

interface PatientCardProps {
  patient: Patient;
  currentPlayer: Player;
  onProceedToTherapy: () => void;
}

export default function PatientCard({
  patient,
  currentPlayer,
  onProceedToTherapy,
}: PatientCardProps) {
  // Fun list of patient emojis
  const patientEmojis = ['😰', '🫣', '🥺', '😵‍💫', '🤯', '😭', '🫠', '😬', '🤕', '🥱'];
  const avatar = patientEmojis[patient.id % patientEmojis.length];

  return (
    <div className={styles.container}>
      <div className={styles.instructionAlert}>
        📢 Read this dilemma aloud to everyone!
      </div>

      <div className={styles.patientCard}>
        <div className={styles.header}>
          <span className={styles.badge}>
            <span>📋</span>
            <span>Patient Case #{patient.id}</span>
          </span>
          <span className={styles.patientNumber}>
            Dr. {currentPlayer.name}&apos;s Office
          </span>
        </div>

        <div className={styles.body}>
          <div className={styles.patientAvatar}>{avatar}</div>
          <p className={styles.problemQuote}>&ldquo;{patient.text}&rdquo;</p>
        </div>
      </div>

      <button
        type="button"
        className={styles.drawButton}
        onClick={onProceedToTherapy}
      >
        <span>💊 Draw Therapy Treatment</span>
        <span>👉</span>
      </button>
    </div>
  );
}
