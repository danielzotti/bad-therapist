'use client';

import { useEffect, useState } from 'react';

export default function ServiceWorkerRegister() {
  const [isOffline, setIsOffline] = useState(false);
  const [swReady, setSwReady] = useState(false);

  useEffect(() => {
    // Initial online/offline check
    setIsOffline(!navigator.onLine);

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Register Service Worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('[SW] Registered successfully with scope:', registration.scope);
            setSwReady(true);

            // Listen for SW updates
            registration.onupdatefound = () => {
              const installingWorker = registration.installing;
              if (installingWorker) {
                installingWorker.onstatechange = () => {
                  if (
                    installingWorker.state === 'installed' &&
                    navigator.serviceWorker.controller
                  ) {
                    console.log('[SW] New content is available; please refresh.');
                  }
                };
              }
            };
          })
          .catch((error) => {
            console.error('[SW] Registration failed:', error);
          });
      });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <>
      {isOffline && (
        <aside
          role="status"
          aria-live="polite"
          style={{
            position: 'fixed',
            top: 10,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#FFBE0B',
            color: '#18181B',
            border: '3px solid #18181B',
            borderRadius: '999px',
            padding: '6px 16px',
            fontSize: '0.85rem',
            fontWeight: 800,
            boxShadow: '3px 3px 0px #18181B',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            pointerEvents: 'none',
          }}
        >
          <span>⚡</span>
          <span>OFFLINE READY — Playing Local</span>
        </aside>
      )}
    </>
  );
}
