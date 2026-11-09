'use client';

import React from 'react';
import styles from './RulesModal.module.css';
import { Language } from '@/types/game';
import { TRANSLATIONS } from '@/utils/translations';

interface RulesModalProps {
  language: Language;
  onClose: () => void;
}

export default function RulesModal({ language, onClose }: RulesModalProps) {
  const t = TRANSLATIONS[language];

  return (
    <div className={styles.backdrop} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3 className={styles.title}>📖 {t.rules}</h3>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className={styles.stepList}>
          {language === 'it' ? (
            <>
              <div className={styles.stepItem}>
                <div className={styles.stepNum}>1</div>
                <div className={styles.stepContent}>
                  <h4>Il Ruolo del Terapeuta</h4>
                  <p>In ogni turno, un giocatore diventa il Terapeuta (il giudice). Il ruolo ruota in senso orario alla fine di ogni turno.</p>
                </div>
              </div>
              <div className={styles.stepItem}>
                <div className={styles.stepNum}>2</div>
                <div className={styles.stepContent}>
                  <h4>Le Prime 2 Vignette (Domanda & Risposta)</h4>
                  <p>Il Terapeuta pesca la carta Domanda (Vignetta 1) e sceglie una delle Risposte (Vignetta 2) per impostare il dilemma del paziente.</p>
                </div>
              </div>
              <div className={styles.stepItem}>
                <div className={styles.stepNum}>3</div>
                <div className={styles.stepContent}>
                  <h4>Passa il Telefono ai Pazienti (Mano di 5 carte)</h4>
                  <p>A turno, gli altri giocatori tengono segreto lo schermo e scelgono dalla propria mano di 5 carte la Terapia più assurda da proporre per la 3ª vignetta.</p>
                </div>
              </div>
              <div className={styles.stepItem}>
                <div className={styles.stepNum}>4</div>
                <div className={styles.stepContent}>
                  <h4>Il Giudizio Finale</h4>
                  <p>Il telefono torna al Terapeuta, che legge ad alta voce le varie combinazioni anonime e premia la migliore. Chi l&apos;ha proposta guadagna 1 punto!</p>
                </div>
              </div>
              <div className={styles.stepItem}>
                <div className={styles.stepNum}>5</div>
                <div className={styles.stepContent}>
                  <h4>Vittoria</h4>
                  <p>Il primo giocatore a raggiungere 3 punti vince la partita!</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className={styles.stepItem}>
                <div className={styles.stepNum}>1</div>
                <div className={styles.stepContent}>
                  <h4>The Therapist Judge</h4>
                  <p>Each round, one player acts as the Therapist. The therapist role rotates clockwise after each round.</p>
                </div>
              </div>
              <div className={styles.stepItem}>
                <div className={styles.stepNum}>2</div>
                <div className={styles.stepContent}>
                  <h4>Panels 1 & 2 (Question & Answer)</h4>
                  <p>The Therapist draws a Question card (Panel 1) and chooses an Answer card (Panel 2) to set up the comedic dilemma.</p>
                </div>
              </div>
              <div className={styles.stepItem}>
                <div className={styles.stepNum}>3</div>
                <div className={styles.stepContent}>
                  <h4>Pass Device to Patients (5-Card Hand)</h4>
                  <p>One by one, the other players keep their screen hidden and pick the funniest Treatment card from their 5-card hand to complete Panel 3.</p>
                </div>
              </div>
              <div className={styles.stepItem}>
                <div className={styles.stepNum}>4</div>
                <div className={styles.stepContent}>
                  <h4>The Verdict</h4>
                  <p>The device is handed back to the Therapist, who reads each full comic out loud and awards the point to the best punchline!</p>
                </div>
              </div>
              <div className={styles.stepItem}>
                <div className={styles.stepNum}>5</div>
                <div className={styles.stepContent}>
                  <h4>Winning the Game</h4>
                  <p>The first player to reach 3 points wins!</p>
                </div>
              </div>
            </>
          )}
        </div>

        <button type="button" className={styles.gotItBtn} onClick={onClose}>
          {language === 'it' ? 'Ho capito, giochiamo! 🛋️' : 'Got it, let’s play! 🛋️'}
        </button>
      </div>
    </div>
  );
}
