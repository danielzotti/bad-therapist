'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import styles from './SwipeCard.module.css';
import { Therapy } from '@/types/game';

interface SwipeCardProps {
  therapy: Therapy;
  onSwipe: (direction: 'left' | 'right') => void;
  disabled?: boolean;
}

export default function SwipeCard({ therapy, onSwipe, disabled = false }: SwipeCardProps) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [swipeState, setSwipeState] = useState<'idle' | 'swiping-left' | 'swiping-right'>('idle');

  const startPosRef = useRef({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const isPointerDownRef = useRef(false);

  // Threshold in pixels to commit to swipe action
  const SWIPE_THRESHOLD = 95;

  // Complete a programmatic or touch swipe
  const completeSwipe = useCallback(
    (direction: 'left' | 'right') => {
      if (disabled) return;
      setSwipeState(direction === 'left' ? 'swiping-left' : 'swiping-right');
      
      // Haptic feedback if available on device
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate(30);
        } catch {
          // Ignore vibrate restrictions
        }
      }

      // Allow fly-off animation to finish before notifying parent
      setTimeout(() => {
        onSwipe(direction);
      }, 260);
    },
    [disabled, onSwipe]
  );

  // --- TOUCH HANDLERS ---
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (disabled || swipeState !== 'idle') return;
    const touch = e.touches[0];
    startPosRef.current = { x: touch.clientX, y: touch.clientY };
    setIsDragging(true);
    isPointerDownRef.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current || disabled || swipeState !== 'idle') return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - startPosRef.current.x;
    const deltaY = touch.clientY - startPosRef.current.y;

    // Dampen vertical movement slightly to emphasize horizontal card flick
    setOffset({ x: deltaX, y: deltaY * 0.4 });
  };

  const handleTouchEnd = () => {
    if (!isPointerDownRef.current) return;
    isPointerDownRef.current = false;
    setIsDragging(false);

    if (Math.abs(offset.x) > SWIPE_THRESHOLD) {
      completeSwipe(offset.x > 0 ? 'right' : 'left');
    } else {
      // Spring back to center
      setOffset({ x: 0, y: 0 });
    }
  };

  // --- MOUSE HANDLERS (with window tracking so mouse doesn't get lost when dragged fast) ---
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || swipeState !== 'idle' || e.button !== 0) return;
    startPosRef.current = { x: e.clientX, y: e.clientY };
    setIsDragging(true);
    isPointerDownRef.current = true;
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isPointerDownRef.current || swipeState !== 'idle') return;
      const deltaX = e.clientX - startPosRef.current.x;
      const deltaY = e.clientY - startPosRef.current.y;
      setOffset({ x: deltaX, y: deltaY * 0.4 });
    };

    const handleMouseUp = () => {
      if (!isPointerDownRef.current) return;
      isPointerDownRef.current = false;
      setIsDragging(false);

      if (Math.abs(offset.x) > SWIPE_THRESHOLD) {
        completeSwipe(offset.x > 0 ? 'right' : 'left');
      } else {
        setOffset({ x: 0, y: 0 });
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, offset.x, swipeState, completeSwipe]);

  // Dynamic calculations for rotation & stamps
  const rotationDeg = offset.x * 0.08; // slightly rotates with horizontal drag
  const acceptOpacity = Math.max(0, Math.min(1, offset.x / SWIPE_THRESHOLD));
  const rejectOpacity = Math.max(0, Math.min(1, -offset.x / SWIPE_THRESHOLD));

  // Determine transform & transitions based on drag state
  let transformStyle = `translate3d(${offset.x}px, ${offset.y}px, 0) rotate(${rotationDeg}deg)`;
  let transitionStyle = 'none';

  if (swipeState === 'swiping-right') {
    transformStyle = 'translate3d(500px, 40px, 0) rotate(25deg)';
    transitionStyle = 'transform 0.28s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.28s ease';
  } else if (swipeState === 'swiping-left') {
    transformStyle = 'translate3d(-500px, 40px, 0) rotate(-25deg)';
    transitionStyle = 'transform 0.28s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.28s ease';
  } else if (!isDragging) {
    transitionStyle = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
  }

  // Pick a quirky emoji based on id
  const emojis = ['💊', '🧙‍♂️', '🦝', '🧨', '🪓', '⚡', '🛸', '🧀', '🪅', '🎺', '🪄', '🛁'];
  const therapyEmoji = emojis[therapy.id % emojis.length];

  return (
    <div>
      <div className={styles.cardContainer}>
        <div
          ref={cardRef}
          className={`${styles.card} ${isDragging ? styles.dragging : ''}`}
          style={{
            transform: transformStyle,
            transition: transitionStyle,
            opacity: swipeState !== 'idle' ? 0.3 : 1,
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          onMouseDown={handleMouseDown}
          role="region"
          aria-label="Swipeable therapy card"
        >
          {/* Reject Stamp (visible when swiping left) */}
          <div
            className={`${styles.stamp} ${styles.stampReject}`}
            style={{
              opacity: swipeState === 'swiping-left' ? 1 : rejectOpacity,
            }}
          >
            REJECT ❌
          </div>

          {/* Accept Stamp (visible when swiping right) */}
          <div
            className={`${styles.stamp} ${styles.stampAccept}`}
            style={{
              opacity: swipeState === 'swiping-right' ? 1 : acceptOpacity,
            }}
          >
            ACCEPT ✅
          </div>

          <div className={styles.cardHeader}>
            <span className={`${styles.tag} ${styles.therapyTag}`}>
              <span>⚡</span>
              <span>Therapy #{therapy.id}</span>
            </span>
            <span className={styles.cardNumber}>Card #{therapy.id}</span>
          </div>

          <div className={styles.cardBody}>
            <div className={styles.emojiIcon}>{therapyEmoji}</div>
            <p className={styles.therapyText}>&ldquo;{therapy.text}&rdquo;</p>
          </div>

          <div className={styles.cardFooter}>
            <span className={styles.hintLeft}>⬅️ Swipe to Reject</span>
            <span className={styles.hintRight}>Swipe to Accept ➡️</span>
          </div>
        </div>
      </div>

      {/* Accessible Tap Buttons for Pass-and-Play Convenience */}
      <div className={styles.actionRow}>
        <button
          type="button"
          className={`${styles.actionBtn} ${styles.rejectBtn}`}
          onClick={() => completeSwipe('left')}
          disabled={disabled || swipeState !== 'idle'}
          aria-label="Reject Therapy"
          title="Reject Therapy"
        >
          <span>✕</span>
          <span className={styles.actionBtnLabel}>REJECT</span>
        </button>

        <button
          type="button"
          className={`${styles.actionBtn} ${styles.acceptBtn}`}
          onClick={() => completeSwipe('right')}
          disabled={disabled || swipeState !== 'idle'}
          aria-label="Accept Therapy"
          title="Accept Therapy"
        >
          <span>✓</span>
          <span className={styles.actionBtnLabel}>ACCEPT</span>
        </button>
      </div>
    </div>
  );
}
