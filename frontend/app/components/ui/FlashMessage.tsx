'use client';

import { useEffect, useState } from 'react';
import styles from './FlashMessage.module.css';

interface FlashMessageProps {
  message: string;
  type: 'success' | 'error';
  onClose?: () => void;
  autoClose?: boolean;
  duration?: number;
}

export default function FlashMessage({ 
  message, 
  type, 
  onClose,
  autoClose = true,
  duration = 5000 
}: FlashMessageProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Reset and trigger animation when message changes
    setIsVisible(true);
    setIsAnimating(true);

    if (autoClose) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [message, autoClose, duration]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 300); // Match animation duration
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`${styles.flashMessage} ${styles[type]} ${isAnimating ? styles.animateIn : styles.animateOut}`}
      role="alert"
    >
      <div className={styles.iconWrapper}>
        {type === 'success' ? (
          <svg 
            className={styles.icon} 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor"
            strokeWidth="2"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M5 13l4 4L19 7" 
            />
          </svg>
        ) : (
          <svg 
            className={styles.icon} 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor"
            strokeWidth="2"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M6 18L18 6M6 6l12 12" 
            />
          </svg>
        )}
      </div>
      
      <div className={styles.content}>
        <p className={styles.message}>{message}</p>
      </div>

      <button 
        className={styles.closeButton}
        onClick={handleClose}
        aria-label="Close notification"
      >
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor"
          strokeWidth="2"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M6 18L18 6M6 6l12 12" 
          />
        </svg>
      </button>
    </div>
  );
}
