import React, { useState } from 'react';
import { Volume2, VolumeX, Trash2, Delete, Copy, Check, Sparkles, Plus, ArrowLeft, ArrowRight, BookmarkPlus, Mic } from 'lucide-react';
import { MessageToken, ContrastMode } from '../types';
import { IconRenderer } from './IconRenderer';

interface MessageBarProps {
  tokens: MessageToken[];
  onRemoveToken: (index: number) => void;
  onRemoveLast: () => void;
  onClearAll: () => void;
  onMoveToken: (fromIndex: number, toIndex: number) => void;
  onSpeak: (fullText: string) => void;
  onStopSpeak: () => void;
  isSpeaking: boolean;
  onOpenGeminiAssist: () => void;
  onOpenTranscribe: () => void;
  onSaveAsCustomPhrase: (text: string) => void;
  contrast: ContrastMode;
  scannedId?: string | null;
}

export const MessageBar: React.FC<MessageBarProps> = ({
  tokens,
  onRemoveToken,
  onRemoveLast,
  onClearAll,
  onMoveToken,
  onSpeak,
  onStopSpeak,
  isSpeaking,
  onOpenGeminiAssist,
  onOpenTranscribe,
  onSaveAsCustomPhrase,
  contrast,
  scannedId,
}) => {
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const isHighContrast = contrast === 'high';

  const fullSentence = tokens.map(t => t.text).join(' ');
  const hasContent = tokens.length > 0;

  const handleCopy = async () => {
    if (!fullSentence) return;
    try {
      await navigator.clipboard.writeText(fullSentence);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('Clipboard write error:', err);
    }
  };

  const handleSavePhrase = () => {
    if (!fullSentence) return;
    onSaveAsCustomPhrase(fullSentence);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <section
      aria-label="Área de construcción del mensaje"
      className={`border rounded-2xl p-4 sm:p-5 transition-colors shadow-sm ${
        isHighContrast
          ? 'bg-neutral-950 border-[#FFE500] text-white'
          : 'bg-white border-slate-200 text-slate-900'
      }`}
    >
      {/* Header bar of the message builder */}
      <div className="flex items-center justify-between mb-3 border-b pb-2.5 border-slate-200 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-[#FFE500]">
            Mensaje en construcción
          </span>
          {tokens.length > 0 && (
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-extrabold ${
                isHighContrast
                  ? 'bg-neutral-800 text-[#FFE500]'
                  : 'bg-blue-100 text-blue-900 border border-blue-200'
              }`}
            >
              {tokens.length} {tokens.length === 1 ? 'elemento' : 'elementos'}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Audio transcription via mic button */}
          <button
            id="scan-btn-transcribe"
            onClick={onOpenTranscribe}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              scannedId === 'scan-btn-transcribe' ? 'scanning-highlight' : ''
            } ${
              isHighContrast
                ? 'bg-neutral-900 border-[#FFE500] text-[#FFE500] hover:bg-neutral-800'
                : 'bg-white border-blue-300 text-blue-700 hover:bg-blue-50 shadow-2xs'
            }`}
            title="Dictar o transcribir audio con el micrófono (gemini-3.5-transcribe)"
            aria-label="Transcribir audio con micrófono"
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Dictar por voz</span>
          </button>

          {/* Optional AI Assistant button if user has composed ideas */}
          <button
            id="scan-btn-gemini"
            onClick={onOpenGeminiAssist}
            disabled={!hasContent}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              scannedId === 'scan-btn-gemini' ? 'scanning-highlight' : ''
            } ${
              !hasContent
                ? 'opacity-40 cursor-not-allowed text-slate-400'
                : isHighContrast
                ? 'bg-[#00E5FF] text-black hover:bg-cyan-300 ring-1 ring-[#00E5FF]'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
            }`}
            title="Sugerir hasta 3 frases completas en español mexicano con IA"
            aria-label="Ayúdame a expresar esto con inteligencia artificial"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ayúdame a expresar esto</span>
          </button>
        </div>
      </div>

      {/* Tokens sequence container */}
      <div
        className={`min-h-[76px] p-3 rounded-xl flex flex-wrap items-center gap-2.5 transition-colors border ${
          isHighContrast
            ? 'bg-black border-neutral-700'
            : 'bg-slate-50/80 border-slate-200'
        }`}
        aria-live="polite"
      >
        {!hasContent ? (
          <p
            className={`text-sm select-none py-2 px-1 font-bold ${
              isHighContrast ? 'text-neutral-300' : 'text-slate-800'
            }`}
          >
            Selecciona frases o palabras del tablero inferior para formar tu mensaje...
          </p>
        ) : (
          tokens.map((token, idx) => (
            <div
              key={`${token.id}-${idx}`}
              className={`group flex items-center gap-2 pl-3 pr-2 py-2 rounded-xl text-sm font-bold transition-all border shadow-xs ${
                isHighContrast
                  ? 'bg-neutral-900 border-[#FFE500] text-[#FFE500]'
                  : 'bg-white border-blue-300 text-slate-950'
              }`}
            >
              <IconRenderer name={token.iconName} className="w-4 h-4 shrink-0 text-blue-600 dark:text-[#FFE500]" />
              <span className="text-base text-slate-950 dark:text-white">{token.text}</span>

              {/* Reorder controls */}
              <div className="flex items-center opacity-80 group-hover:opacity-100 transition-opacity ml-1 gap-0.5">
                {idx > 0 && (
                  <button
                    onClick={() => onMoveToken(idx, idx - 1)}
                    className="p-1 hover:bg-blue-100 dark:hover:bg-neutral-800 rounded text-slate-900 dark:text-white"
                    title="Mover hacia la izquierda"
                    aria-label={`Mover "${token.text}" a la izquierda`}
                  >
                    <ArrowLeft className="w-3 h-3" />
                  </button>
                )}
                {idx < tokens.length - 1 && (
                  <button
                    onClick={() => onMoveToken(idx, idx + 1)}
                    className="p-1 hover:bg-blue-100 dark:hover:bg-neutral-800 rounded text-slate-900 dark:text-white"
                    title="Mover hacia la derecha"
                    aria-label={`Mover "${token.text}" a la derecha`}
                  >
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
                <button
                  onClick={() => onRemoveToken(idx)}
                  className="p-1 hover:bg-red-100 dark:hover:bg-red-950/60 text-red-600 dark:text-red-400 rounded"
                  title="Eliminar este elemento"
                  aria-label={`Eliminar "${token.text}" del mensaje`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Complete formed message text preview */}
      {hasContent && (
        <div className="mt-3 px-3.5 py-2.5 rounded-xl bg-blue-50/80 dark:bg-neutral-900 border border-blue-200 dark:border-neutral-800 flex items-center justify-between gap-3">
          <p className="text-lg font-black tracking-tight text-slate-950 dark:text-white leading-snug">
            "{fullSentence}"
          </p>
          <span className="text-xs text-blue-900 dark:text-[#00E5FF] shrink-0 font-extrabold uppercase tracking-wide">
            Listo para reproducir
          </span>
        </div>
      )}

      {/* Primary Action Buttons Bar */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-neutral-800">
        {/* Left side actions: Speak / Stop */}
        <div className="flex items-center gap-2">
          {isSpeaking ? (
            <button
              id="scan-btn-stop"
              onClick={onStopSpeak}
              className={`px-5 py-3 rounded-xl font-bold text-base flex items-center gap-2 shadow-md transition-transform active:scale-95 bg-red-600 hover:bg-red-700 text-white ${
                scannedId === 'scan-btn-stop' ? 'scanning-highlight' : ''
              }`}
              aria-label="Detener reproducción de voz"
            >
              <VolumeX className="w-5 h-5 animate-pulse" />
              <span>Detener voz</span>
            </button>
          ) : (
            <button
              id="scan-btn-speak"
              onClick={() => onSpeak(fullSentence)}
              disabled={!hasContent}
              className={`px-6 py-3 rounded-xl font-bold text-base flex items-center gap-2.5 shadow-md transition-all ${
                scannedId === 'scan-btn-speak' ? 'scanning-highlight' : ''
              } ${
                !hasContent
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed dark:bg-neutral-800 dark:text-neutral-500'
                  : isHighContrast
                  ? 'bg-[#FFE500] text-black hover:bg-yellow-400 ring-2 ring-[#FFE500]'
                  : 'bg-[#1F5AC4] hover:bg-blue-700 text-white active:scale-95'
              }`}
              title="Escuchar el mensaje formado completo con síntesis de voz en español"
              aria-label="Hablar: reproducir mensaje completo"
            >
              <Volume2 className="w-5 h-5" />
              <span>Hablar</span>
            </button>
          )}

          {/* Delete last item */}
          <button
            id="scan-btn-delete-last"
            onClick={onRemoveLast}
            disabled={!hasContent}
            className={`px-3.5 py-3 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-all border ${
              scannedId === 'scan-btn-delete-last' ? 'scanning-highlight' : ''
            } ${
              !hasContent
                ? 'opacity-40 cursor-not-allowed border-slate-200 text-slate-400'
                : isHighContrast
                ? 'border-neutral-700 text-white hover:bg-neutral-800'
                : 'border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
            title="Borrar último elemento agregado"
            aria-label="Borrar último elemento"
          >
            <Delete className="w-4 h-4" />
            <span className="hidden sm:inline">Borrar último</span>
          </button>

          {/* Clear all */}
          <button
            id="scan-btn-clear-all"
            onClick={onClearAll}
            disabled={!hasContent}
            className={`px-3.5 py-3 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-all border ${
              scannedId === 'scan-btn-clear-all' ? 'scanning-highlight' : ''
            } ${
              !hasContent
                ? 'opacity-40 cursor-not-allowed border-slate-200 text-slate-400'
                : isHighContrast
                ? 'border-red-500/60 text-red-400 hover:bg-red-950/40'
                : 'border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700'
            }`}
            title="Limpiar todo el mensaje actual"
            aria-label="Limpiar todo el mensaje"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Limpiar todo</span>
          </button>
        </div>

        {/* Right side actions: Copy, Save phrase */}
        <div className="flex items-center gap-2">
          {/* Save as favorite/custom */}
          <button
            onClick={handleSavePhrase}
            disabled={!hasContent}
            className={`px-3.5 py-3 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-all border ${
              !hasContent
                ? 'opacity-40 cursor-not-allowed border-slate-200 text-slate-400'
                : isHighContrast
                ? 'border-amber-400 text-amber-300 hover:bg-neutral-800'
                : 'border-amber-200 text-amber-800 bg-amber-50/70 hover:bg-amber-100'
            }`}
            title="Guardar este mensaje en tus frases personalizadas"
            aria-label="Guardar frase en personalizados"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">¡Guardada!</span>
              </>
            ) : (
              <>
                <BookmarkPlus className="w-4 h-4" />
                <span className="hidden sm:inline">Guardar frase</span>
              </>
            )}
          </button>

          {/* Copy to clipboard */}
          <button
            onClick={handleCopy}
            disabled={!hasContent}
            className={`px-3.5 py-3 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-all border ${
              !hasContent
                ? 'opacity-40 cursor-not-allowed border-slate-200 text-slate-400'
                : isHighContrast
                ? 'border-neutral-700 text-white hover:bg-neutral-800'
                : 'border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
            title="Copiar texto al portapapeles"
            aria-label="Copiar texto del mensaje al portapapeles"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">¡Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span className="hidden sm:inline">Copiar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};
