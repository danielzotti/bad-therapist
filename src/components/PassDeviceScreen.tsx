'use client';

import React from 'react';
import styles from './PassDeviceScreen.module.css';
import { Player } from '@/types/game';

interface PassDeviceScreenProps {
  player: Player;
  roundNumber: number;
  onReady: () => void;
}

export default function PassDeviceScreen({
  player,
  roundNumber,
  onReady,
}: PassDeviceScreenProps) {
  return (
    <div className={styles.container}>
      <div className={styles.passCard}>
        <span className={styles.topPill}>
          🔄 Pass & Play • Round #{roundNumber}
        </span>

        <h2 className={styles.mainHeading}>Hand Device To</h2>

        <div className={styles.avatarCircle}>{player.avatar}</div>

        <div className={styles.playerName}>{player.name}</div>

        <div className={styles.statsBar}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{player.score}</span>
            <span className={styles.statLabel}>Score</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{player.patientsCured}</span>
            <span className={styles.statLabel}>Cured</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{player.malpracticeCases}</span>
            <span className={styles.statLabel}>Malpractice</span>
          </div>
        </div>
      </div>

      <button
        type="button"
        className={styles.readyButton}
        onClick={onReady}
      >
        <span>I am {player.name} — Start Turn</span>
        <span>👉</span>
      </button>
    </div>
  );
}
