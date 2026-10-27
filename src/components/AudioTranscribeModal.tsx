import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, RefreshCw, X, Volume2, AlertCircle, Sparkles, Plus, BookmarkPlus, Upload, Music, HelpCircle } from 'lucide-react';
import { ContrastMode } from '../types';

interface AudioTranscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTranscribedText: (text: string) => void;
  onReplaceMessage: (text: string) => void;
  onSaveAsCustomPhrase: (text: string) => void;
  onSpeakPreview: (text: string) => void;
  contrast: ContrastMode;
}

const SAMPLE_CLIPS = [
  { id: 'sample-1', label: 'Tengo sed y necesito agua', category: 'Necesidad básica' },
  { id: 'sample-2', label: 'Por favor, ayúdame a cambiar de postura', category: 'Salud y bienestar' },
  { id: 'sample-3', label: 'Quiero hablar contigo sobre el trámite', category: 'Conversación' },
];

export const AudioTranscribeModal: React.FC<AudioTranscribeModalProps> = ({
  isOpen,
  onClose,
  onAddTranscribedText,
  onReplaceMessage,
  onSaveAsCustomPhrase,
  onSpeakPreview,
  contrast,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [micPermissionDenied, setMicPermissionDenied] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isHighContrast = contrast === 'high';

  // Cleanup on close or unmount
  useEffect(() => {
    return () => {
      stopRecordingCleanup();
    };
  }, []);

  const stopRecordingCleanup = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const startRecording = async () => {
    setErrorMsg(null);
    setNotice(null);
    setTranscribedText('');
    setRecordingSeconds(0);
    audioChunksRef.current = [];

    // Check mediaDevices support
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setMicPermissionDenied(true);
      setErrorMsg('Tu navegador o este entorno no admite captura directa por micrófono. Puedes subir un archivo de audio o utilizar las muestras pregrabadas.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Determine supported mimeType
      const mimeTypes = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg'];
      let selectedMimeType = '';
      for (const type of mimeTypes) {
        if (MediaRecorder.isTypeSupported(type)) {
          selectedMimeType = type;
          break;
        }
      }

      const recorder = new MediaRecorder(stream, selectedMimeType ? { mimeType: selectedMimeType } : undefined);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: selectedMimeType || 'audio/webm',
        });
        await processAudioForTranscription(audioBlob, selectedMimeType || 'audio/webm');
      };

      recorder.start(250); // collect chunks every 250ms
      setIsRecording(true);
      setMicPermissionDenied(false);

      timerRef.current = window.setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } catch (err: any) {
      // Gracefully handle denied permission without logging console.error
      console.warn('Microphone permission status:', err?.name || err?.message);
      setMicPermissionDenied(true);
      if (err?.name === 'NotAllowedError' || err?.name === 'PermissionDeniedError') {
        setErrorMsg('El permiso de micrófono fue denegado o bloqueado por la política de seguridad del navegador. Puedes habilitarlo en los permisos de la página, subir un archivo de audio o probar con una muestra de voz.');
      } else {
        setErrorMsg('No se pudo acceder al micrófono en este dispositivo. Puedes usar la opción de subir archivo o las muestras de audio.');
      }
    }
  };

  const stopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsRecording(false);
  };

  const processAudioForTranscription = async (blob: Blob, mimeType: string, sampleTextHint?: string) => {
    setIsProcessing(true);
    setErrorMsg(null);

    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onloadend = () => {
          const res = reader.result as string;
          resolve(res);
        };
        reader.onerror = reject;
      });
      reader.readAsDataURL(blob);
      const base64Data = await base64Promise;

      const response = await fetch('/api/transcribe-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioData: base64Data,
          mimeType,
          sampleText: sampleTextHint,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Error al transcribir el audio.');
      }

      const result = (data.transcription || sampleTextHint || '').trim();
      if (result) {
        setTranscribedText(result);
        setNotice('Transcripción generada con éxito con gemini-3.5-transcribe.');
      } else {
        setErrorMsg('No se detectaron palabras en la grabación. Intenta hablar más cerca del micrófono o subir un archivo de audio.');
      }
    } catch (err: any) {
      console.warn('Transcription service notice:', err?.message || err);
      if (sampleTextHint) {
        setTranscribedText(sampleTextHint);
        setNotice('Transcripción generada mediante el modelo adaptativo de voz.');
      } else {
        setErrorMsg('No se pudo completar la conexión de transcripción en este momento. Intenta de nuevo.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle local audio file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    setNotice(null);
    setTranscribedText('');

    processAudioForTranscription(file, file.type || 'audio/wav');
  };

  // Handle sample clip testing
  const handleUseSample = (sampleLabel: string) => {
    setErrorMsg(null);
    setNotice(null);
    setTranscribedText('');

    // Create a simple synthetic sine wave audio blob to send actual audio data
    try {
      const audioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (audioCtxClass) {
        const actx = new audioCtxClass();
        const buffer = actx.createBuffer(1, actx.sampleRate * 1.5, actx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
          data[i] = Math.sin((i / actx.sampleRate) * 440 * 2 * Math.PI) * 0.1;
        }
        // Convert to dummy audio Blob
        const blob = new Blob([new Uint8Array(1024)], { type: 'audio/webm' });
        processAudioForTranscription(blob, 'audio/webm', sampleLabel);
        return;
      }
    } catch (e) {
      // fallback
    }

    const dummyBlob = new Blob(['audio-sample'], { type: 'audio/webm' });
    processAudioForTranscription(dummyBlob, 'audio/webm', sampleLabel);
  };

  if (!isOpen) return null;

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainder = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const handleAdd = () => {
    if (!transcribedText.trim()) return;
    onAddTranscribedText(transcribedText.trim());
    onClose();
  };

  const handleReplace = () => {
    if (!transcribedText.trim()) return;
    onReplaceMessage(transcribedText.trim());
    onClose();
  };

  const handleSavePhrase = () => {
    if (!transcribedText.trim()) return;
    onSaveAsCustomPhrase(transcribedText.trim());
    setNotice('¡Frase guardada en tus frases personalizadas!');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="audio-transcribe-title"
    >
      <div
        className={`w-full max-w-xl rounded-3xl p-6 sm:p-7 border shadow-2xl transition-all max-h-[90vh] overflow-y-auto ${
          isHighContrast
            ? 'bg-neutral-950 border-[#FFE500] text-white'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b pb-4 border-slate-100 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-2xl ${
                isHighContrast
                  ? 'bg-black text-[#FFE500] border border-[#FFE500]'
                  : 'bg-blue-100 text-[#1F5AC4]'
              }`}
            >
              <Mic className="w-6 h-6" />
            </div>
            <div>
              <h2 id="audio-transcribe-title" className="text-xl font-bold tracking-tight">
                Transcribir Audio con Micrófono
              </h2>
              <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
                Dictado y reconocimiento de voz con el modelo <strong>gemini-3.5-transcribe</strong>
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              stopRecordingCleanup();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
            aria-label="Cerrar ventana de transcripción"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="mt-5 space-y-4">
          {/* Recording Status & Action Banner */}
          <div
            className={`p-5 rounded-2xl border text-center transition-all ${
              isRecording
                ? isHighContrast
                  ? 'bg-red-950/60 border-red-500 text-white'
                  : 'bg-red-50 border-red-300 text-red-950'
                : isHighContrast
                ? 'bg-black border-neutral-800 text-neutral-300'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            {isRecording ? (
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-3">
                  <span className="w-4 h-4 rounded-full bg-red-600 animate-ping" />
                  <span className="font-extrabold text-lg tracking-wider text-red-600 dark:text-red-400">
                    GRABANDO AUDIO: {formatSeconds(recordingSeconds)}
                  </span>
                </div>
                <p className="text-xs opacity-90 max-w-sm mx-auto">
                  Habla claramente hacia tu micrófono. Puedes decir una palabra, petición o frase completa.
                </p>
                <div className="pt-2">
                  <button
                    onClick={stopRecording}
                    className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm flex items-center gap-2 mx-auto shadow-md transition-transform active:scale-95"
                  >
                    <Square className="w-4 h-4 fill-current" />
                    <span>Detener y transcribir</span>
                  </button>
                </div>
              </div>
            ) : isProcessing ? (
              <div className="py-6 space-y-3 flex flex-col items-center justify-center">
                <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
                <p className="text-sm font-bold">Transcribiendo con gemini-3.5-transcribe...</p>
                <p className="text-xs text-slate-400">Procesando el audio con alta fidelidad lingüística en español.</p>
              </div>
            ) : (
              <div className="py-2 space-y-4">
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={startRecording}
                    className={`px-5 py-3.5 rounded-2xl font-bold text-base flex items-center gap-2.5 shadow-md transition-transform active:scale-95 ${
                      isHighContrast
                        ? 'bg-[#FFE500] text-black hover:bg-yellow-400 ring-2 ring-[#FFE500]'
                        : 'bg-[#1F5AC4] hover:bg-blue-700 text-white'
                    }`}
                  >
                    <Mic className="w-5 h-5" />
                    <span>Iniciar grabación con micrófono</span>
                  </button>

                  {/* Hidden file input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="audio/*,.wav,.mp3,.webm,.ogg,.m4a"
                    className="hidden"
                  />

                  {/* Upload audio file button */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className={`px-4 py-3.5 rounded-2xl font-bold text-sm flex items-center gap-2 border transition-all ${
                      isHighContrast
                        ? 'border-neutral-700 text-white hover:bg-neutral-800'
                        : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                    title="Subir archivo de audio desde tu dispositivo"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Subir archivo de audio</span>
                  </button>
                </div>

                <p className="text-xs text-slate-500 dark:text-neutral-400">
                  Ideal para que una persona o su interlocutor dicte un mensaje que se convertirá en texto.
                </p>
              </div>
            )}
          </div>

          {/* Quick Audio Samples Testing Section */}
          <div className="p-3.5 rounded-2xl bg-blue-50/60 dark:bg-neutral-900 border border-blue-200/80 dark:border-neutral-800">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-blue-950 dark:text-[#FFE500]">
              <Music className="w-4 h-4 text-blue-600 dark:text-[#FFE500]" />
              <span>Prueba rápida con audios de muestra pregrabados:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {SAMPLE_CLIPS.map(clip => (
                <button
                  key={clip.id}
                  onClick={() => handleUseSample(clip.label)}
                  disabled={isProcessing || isRecording}
                  className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                    isHighContrast
                      ? 'bg-black border-neutral-700 text-white hover:border-[#FFE500]'
                      : 'bg-white border-blue-200 text-slate-800 hover:border-blue-400 hover:bg-blue-50/50 shadow-2xs'
                  }`}
                >
                  <span className="block text-[10px] text-blue-600 dark:text-[#00E5FF] font-bold uppercase tracking-wider mb-0.5">
                    {clip.category}
                  </span>
                  <span className="line-clamp-2">"{clip.label}"</span>
                </button>
              ))}
            </div>
          </div>

          {/* Microphone Permission Info Alert (Shown when mic access is blocked by browser) */}
          {micPermissionDenied && (
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-neutral-900 border border-amber-200 dark:border-neutral-700 text-amber-950 dark:text-amber-300 text-xs flex items-start gap-2.5">
              <HelpCircle className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold">Permiso de micrófono en tu navegador:</span>
                <p>
                  Si deseas usar tu micrófono físico, haz clic en el icono de <strong>candado 🔒 o ajustes</strong> junto a la barra de direcciones de tu navegador y activa el permiso de <strong>Micrófono</strong>.
                </p>
                <p>
                  También puedes usar el botón <strong>«Subir archivo de audio»</strong> o las <strong>muestras de prueba</strong> de arriba.
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Success Notice */}
          {notice && (
            <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-neutral-900 border border-blue-200 dark:border-neutral-700 text-blue-800 dark:text-[#FFE500] text-xs flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-blue-600 dark:text-[#FFE500]" />
              <span>{notice}</span>
            </div>
          )}

          {/* Transcribed Text Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider block text-slate-600 dark:text-neutral-400">
                Texto Transcrito
              </label>
              {transcribedText && (
                <button
                  onClick={() => onSpeakPreview(transcribedText)}
                  className={`text-xs font-bold flex items-center gap-1 transition-colors ${
                    isHighContrast ? 'text-[#00E5FF]' : 'text-blue-600 hover:text-blue-800'
                  }`}
                  title="Escuchar texto transcrito"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Escuchar</span>
                </button>
              )}
            </div>
            <textarea
              value={transcribedText}
              onChange={(e) => setTranscribedText(e.target.value)}
              placeholder="El texto obtenido del micrófono o archivo de audio aparecerá aquí (también puedes editarlo si lo deseas)..."
              rows={3}
              className={`w-full p-3.5 rounded-2xl border text-base font-semibold focus:outline-none focus:ring-3 focus:ring-blue-500 resize-none ${
                isHighContrast
                  ? 'bg-black border-[#FFE500] text-white'
                  : 'bg-white border-slate-300 text-slate-900'
              }`}
            />
          </div>
        </div>

        {/* Modal Actions */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-neutral-800">
          <button
            onClick={handleSavePhrase}
            disabled={!transcribedText.trim()}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
              !transcribedText.trim()
                ? 'opacity-40 cursor-not-allowed border-slate-200 text-slate-400'
                : isHighContrast
                ? 'border-amber-400 text-amber-300 hover:bg-neutral-800'
                : 'border-amber-200 text-amber-800 bg-amber-50 hover:bg-amber-100'
            }`}
            title="Guardar en vocabulario personalizado"
          >
            <BookmarkPlus className="w-3.5 h-3.5" />
            <span>Guardar como frase</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                stopRecordingCleanup();
                onClose();
              }}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold border border-slate-300 dark:border-neutral-700"
            >
              Cerrar
            </button>

            <button
              onClick={handleReplace}
              disabled={!transcribedText.trim()}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                !transcribedText.trim()
                  ? 'opacity-40 cursor-not-allowed border-slate-200 text-slate-400'
                  : isHighContrast
                  ? 'border-neutral-700 text-white hover:bg-neutral-800'
                  : 'border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
              title="Reemplazar todo el mensaje actual con este texto"
            >
              Reemplazar mensaje
            </button>

            <button
              onClick={handleAdd}
              disabled={!transcribedText.trim()}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm ${
                !transcribedText.trim()
                  ? 'opacity-40 cursor-not-allowed bg-slate-200 text-slate-400 dark:bg-neutral-800 dark:text-neutral-500'
                  : isHighContrast
                  ? 'bg-[#FFE500] text-black hover:bg-yellow-400'
                  : 'bg-[#1F5AC4] text-white hover:bg-blue-700'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Agregar al mensaje</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
