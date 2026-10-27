import { useState, useEffect, useCallback, useRef } from 'react';

export type VoiceEngine = 'auto' | 'cloud' | 'browser';

export function useSpeech() {
  const [speechSupported, setSpeechSupported] = useState<boolean>(true);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [spanishVoices, setSpanishVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [voiceEngine, setVoiceEngine] = useState<VoiceEngine>('auto');
  const [audioSourceNotice, setAudioSourceNotice] = useState<string>('');

  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Pre-initialize and discover voices
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!('speechSynthesis' in window)) {
      setSpeechSupported(false);
      return;
    }

    const loadVoices = () => {
      try {
        const available = window.speechSynthesis.getVoices();
        setVoices(available);

        // Filter Spanish voices
        const spanish = available.filter(v => v.lang.toLowerCase().startsWith('es'));
        setSpanishVoices(spanish);

        // Prioritize Mexican Spanish (es-MX)
        const mexican = spanish.find(v => v.lang.toLowerCase() === 'es-mx' || v.lang.toLowerCase() === 'es_mx');
        if (mexican) {
          setSelectedVoice(mexican);
        } else if (spanish.length > 0) {
          setSelectedVoice(spanish[0]);
        } else if (available.length > 0) {
          setSelectedVoice(available[0]);
        }
      } catch (err) {
        console.warn('Could not retrieve speech synthesis voices:', err);
      }
    };

    loadVoices();

    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    // Workaround for Chromium voice list delay
    const retryTimer = setTimeout(loadVoices, 300);

    return () => {
      clearTimeout(retryTimer);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        audioPlayerRef.current = null;
      }
    };
  }, []);

  const stop = useCallback(() => {
    if (typeof window !== 'undefined') {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        audioPlayerRef.current.currentTime = 0;
        audioPlayerRef.current = null;
      }
      setIsSpeaking(false);
    }
  }, []);

  // Server-side Gemini high-fidelity TTS playback (WAV audio)
  const speakWithServerTTS = useCallback(async (text: string, rate: number = 1.0) => {
    try {
      setIsSpeaking(true);
      setAudioSourceNotice('Reproduciendo con voz inteligente PHONÉ...');

      const res = await fetch('/api/speak-tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voiceName: 'Kore',
        }),
      });

      if (!res.ok) {
        throw new Error(`TTS server returned status ${res.status}`);
      }

      const data = await res.json();
      if (!data.audioBase64) {
        throw new Error('Respuesta de audio vacía del servidor.');
      }

      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }

      const audio = new Audio(`data:audio/wav;base64,${data.audioBase64}`);
      audioPlayerRef.current = audio;
      audio.playbackRate = Math.max(0.7, Math.min(1.4, rate));

      audio.onended = () => {
        setIsSpeaking(false);
        setAudioSourceNotice('');
      };

      audio.onerror = (e) => {
        console.warn('HTML5 Audio playback error:', e);
        setIsSpeaking(false);
        setAudioSourceNotice('');
      };

      await audio.play();
    } catch (err) {
      console.warn('Server TTS failed, attempting browser fallback:', err);
      setIsSpeaking(false);
      setAudioSourceNotice('');
    }
  }, []);

  // Main speak function combining browser Web Speech API + automatic Server TTS fallback
  const speak = useCallback(
    (text: string, rate: number = 0.95, customVoiceUri?: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      // Stop any existing sound
      stop();

      // If user explicitly chose Cloud TTS or browser has no synthesis support
      if (voiceEngine === 'cloud' || typeof window === 'undefined' || !('speechSynthesis' in window)) {
        speakWithServerTTS(trimmed, rate);
        return;
      }

      // Check available browser voices
      const currentVoices = window.speechSynthesis.getVoices();
      const hasSpanish = currentVoices.some(v => v.lang.toLowerCase().startsWith('es'));

      // In Linux Mint or environments with 0 voices or 0 Spanish voices,
      // fallback to high-fidelity server TTS so the user always hears sound!
      if (currentVoices.length === 0 || (!hasSpanish && voiceEngine === 'auto')) {
        speakWithServerTTS(trimmed, rate);
        return;
      }

      try {
        // Unlock / unpause speech synthesis if browser paused it
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }

        const utterance = new SpeechSynthesisUtterance(trimmed);
        utteranceRef.current = utterance;
        // Retain on window to avoid V8 garbage collection bug in Chrome
        (window as any).__phone_utterance = utterance;

        // Voice matching
        let targetVoice = selectedVoice;
        if (customVoiceUri) {
          const matched = currentVoices.find(v => v.voiceURI === customVoiceUri);
          if (matched) targetVoice = matched;
        }

        if (targetVoice) {
          utterance.voice = targetVoice;
          utterance.lang = targetVoice.lang;
        } else {
          utterance.lang = 'es-MX';
        }

        utterance.rate = Math.max(0.6, Math.min(1.4, rate));
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        let hasStarted = false;

        utterance.onstart = () => {
          hasStarted = true;
          setIsSpeaking(true);
        };

        utterance.onend = () => {
          setIsSpeaking(false);
          (window as any).__phone_utterance = null;
        };

        utterance.onerror = (e) => {
          console.warn('SpeechSynthesis error:', e.error);
          setIsSpeaking(false);
          (window as any).__phone_utterance = null;

          // If browser speech fails (e.g. not-allowed, network, synthesis-unavailable),
          // fallback immediately to Server TTS!
          if (!hasStarted) {
            speakWithServerTTS(trimmed, rate);
          }
        };

        // Ensure Chrome doesn't cancel utterance immediately by running in next tick
        setTimeout(() => {
          try {
            if (window.speechSynthesis.paused) {
              window.speechSynthesis.resume();
            }
            window.speechSynthesis.speak(utterance);
          } catch (speakErr) {
            console.warn('Direct speak call failed, falling back to server TTS:', speakErr);
            speakWithServerTTS(trimmed, rate);
          }
        }, 30);
      } catch (err) {
        console.warn('Speech synthesis preparation failed, using server TTS:', err);
        speakWithServerTTS(trimmed, rate);
      }
    },
    [selectedVoice, voiceEngine, speakWithServerTTS, stop]
  );

  return {
    speechSupported,
    voices,
    spanishVoices,
    selectedVoice,
    setSelectedVoice,
    isSpeaking,
    voiceEngine,
    setVoiceEngine,
    audioSourceNotice,
    speak,
    speakWithServerTTS,
    stop,
  };
}
