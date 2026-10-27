import { useState, useEffect, useCallback, useRef } from 'react';
import { playScanStepSound, playSelectSound } from '../utils/audioFeedback';

export interface ScannableItem {
  id: string;
  label: string;
  onSelect: () => void;
  group?: string;
}

interface UseScanningOptions {
  enabled: boolean;
  intervalSec: number;
  soundFeedback: boolean;
  onAnnounce?: (msg: string) => void;
}

export function useScanning(options: UseScanningOptions) {
  const { enabled, intervalSec, soundFeedback, onAnnounce } = options;

  const [items, setItems] = useState<ScannableItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const itemsRef = useRef<ScannableItem[]>([]);
  itemsRef.current = items;

  const currentIndexRef = useRef<number>(currentIndex);
  currentIndexRef.current = currentIndex;

  const isPausedRef = useRef<boolean>(isPaused);
  isPausedRef.current = isPaused;

  const registerItems = useCallback((newItems: ScannableItem[]) => {
    setItems(newItems);
    if (newItems.length > 0 && currentIndexRef.current === -1) {
      setCurrentIndex(0);
    } else if (newItems.length === 0) {
      setCurrentIndex(-1);
    }
  }, []);

  const selectCurrent = useCallback(() => {
    const list = itemsRef.current;
    const idx = currentIndexRef.current;
    if (idx >= 0 && idx < list.length) {
      playSelectSound();
      const selected = list[idx];
      selected.onSelect();
      if (onAnnounce) {
        onAnnounce(`Seleccionado: ${selected.label}`);
      }
    }
  }, [onAnnounce]);

  const stepNext = useCallback(() => {
    const list = itemsRef.current;
    if (list.length === 0) return;
    const nextIdx = (currentIndexRef.current + 1) % list.length;
    setCurrentIndex(nextIdx);
    if (soundFeedback) {
      playScanStepSound();
    }
    if (onAnnounce && list[nextIdx]) {
      onAnnounce(list[nextIdx].label);
    }
  }, [soundFeedback, onAnnounce]);

  const stepPrev = useCallback(() => {
    const list = itemsRef.current;
    if (list.length === 0) return;
    const prevIdx = (currentIndexRef.current - 1 + list.length) % list.length;
    setCurrentIndex(prevIdx);
    if (soundFeedback) {
      playScanStepSound();
    }
    if (onAnnounce && list[prevIdx]) {
      onAnnounce(list[prevIdx].label);
    }
  }, [soundFeedback, onAnnounce]);

  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  const restartScan = useCallback(() => {
    setIsPaused(false);
    setCurrentIndex(0);
    if (itemsRef.current[0] && onAnnounce) {
      onAnnounce(`Reiniciando barrido en: ${itemsRef.current[0].label}`);
    }
  }, [onAnnounce]);

  // Interval timer for automatic scanning
  useEffect(() => {
    if (!enabled || isPaused || items.length === 0) {
      return;
    }

    const timer = setInterval(() => {
      stepNext();
    }, intervalSec * 1000);

    return () => clearInterval(timer);
  }, [enabled, isPaused, intervalSec, items.length, stepNext]);

  // Keyboard navigation listener (Space, Enter, Arrows)
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      if (e.code === 'Space' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        selectCurrent();
      } else if (e.key === 'ArrowRight' || e.key === 'Tab') {
        if (e.key === 'Tab') e.preventDefault();
        stepNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        stepPrev();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        togglePause();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, selectCurrent, stepNext, stepPrev, togglePause]);

  return {
    items,
    currentIndex,
    currentScannedId: items[currentIndex]?.id || null,
    isPaused,
    registerItems,
    selectCurrent,
    stepNext,
    stepPrev,
    togglePause,
    restartScan,
  };
}
