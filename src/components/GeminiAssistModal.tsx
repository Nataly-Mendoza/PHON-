import React, { useState, useEffect } from 'react';
import { Sparkles, X, Check, AlertCircle, RefreshCw, Volume2, ShieldCheck } from 'lucide-react';
import { ContrastMode } from '../types';

interface GeminiAssistModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTokens: string[];
  activeCategoryTitle?: string;
  onConfirmSuggestion: (chosenText: string) => void;
  onPreviewSpeak: (text: string) => void;
  contrast: ContrastMode;
}

export const GeminiAssistModal: React.FC<GeminiAssistModalProps> = ({
  isOpen,
  onClose,
  selectedTokens,
  activeCategoryTitle,
  onConfirmSuggestion,
  onPreviewSpeak,
  contrast,
}) => {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const isHighContrast = contrast === 'high';

  const fetchSuggestions = async () => {
    if (selectedTokens.length === 0) return;
    setLoading(true);
    setErrorMsg(null);
    setNotice(null);
    setSelectedIdx(null);

    try {
      const res = await fetch('/api/assist-expression', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selectedTokens,
          categoryTitle: activeCategoryTitle || 'General',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al conectar con el servidor.');
      }

      setSuggestions(data.suggestions || []);
      if (data.notice) {
        setNotice(data.notice);
      }
    } catch (err: any) {
      console.warn('Gemini request failed:', err);
      // Fallback suggestions
      const joined = selectedTokens.join(' ');
      setSuggestions([
        `Por favor, ${joined.toLowerCase()}.`,
        `Me gustaría decir: ${joined}.`,
        `Necesito apoyo con ${joined.toLowerCase()}, gracias.`
      ]);
      setNotice('La conexión con Gemini no estuvo disponible; se generaron opciones alternativas locales.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchSuggestions();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleApply = () => {
    if (selectedIdx !== null && suggestions[selectedIdx]) {
      onConfirmSuggestion(suggestions[selectedIdx]);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gemini-assist-title"
    >
      <div
        className={`w-full max-w-xl rounded-3xl p-6 sm:p-7 border shadow-2xl transition-all ${
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
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 id="gemini-assist-title" className="text-xl font-bold tracking-tight text-slate-950 dark:text-white">
                Ayúdame a expresar esto
              </h2>
              <p className="text-xs text-slate-800 font-bold dark:text-neutral-300 mt-0.5">
                Propuestas de frases breves en español mexicano basadas en tu selección voluntaria
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-700 hover:text-slate-950 dark:hover:text-white transition-colors"
            aria-label="Cerrar ventana de sugerencias"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Tokens Reference */}
        <div className="mt-4 p-3 rounded-xl bg-slate-100 dark:bg-neutral-900 border border-slate-300 dark:border-neutral-800 text-xs">
          <span className="font-bold text-slate-800 dark:text-neutral-300">Conceptos que elegiste:</span>
          <p className="text-sm font-black mt-1 text-blue-950 dark:text-[#FFE500]">
            "{selectedTokens.join(' • ')}"
          </p>
        </div>

        {/* Body content */}
        <div className="mt-5 space-y-3">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-blue-700 animate-spin" />
              <p className="text-sm font-bold text-slate-950 dark:text-white">Generando propuestas respetuosas...</p>
              <p className="text-xs font-semibold text-slate-800 dark:text-neutral-300 max-w-sm">
                Procesando únicamente los conceptos elegidos sin acceder a datos personales.
              </p>
            </div>
          ) : (
            <>
              {notice && (
                <div className="p-3 rounded-xl bg-blue-50 dark:bg-neutral-900 border border-blue-300 dark:border-neutral-700 flex items-start gap-2 text-xs font-bold text-blue-950 dark:text-[#FFE500]">
                  <AlertCircle className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                  <span>{notice}</span>
                </div>
              )}

              <p className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-neutral-200">
                Selecciona la opción que mejor represente lo que deseas decir:
              </p>

              <div className="space-y-2.5">
                {suggestions.map((sugg, i) => {
                  const isChecked = selectedIdx === i;
                  return (
                    <div
                      key={i}
                      onClick={() => setSelectedIdx(i)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                        isChecked
                          ? isHighContrast
                            ? 'bg-neutral-900 border-[#FFE500] ring-2 ring-[#FFE500] text-[#FFE500]'
                            : 'bg-blue-50 border-[#1F5AC4] ring-2 ring-[#1F5AC4]/30 text-blue-950 font-bold'
                          : isHighContrast
                          ? 'bg-black border-neutral-800 text-white hover:border-neutral-600'
                          : 'bg-white border-slate-200 text-slate-800 hover:border-blue-300 hover:bg-slate-50/70'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                            isChecked
                              ? isHighContrast
                                ? 'border-[#FFE500] bg-[#FFE500]'
                                : 'border-[#1F5AC4] bg-[#1F5AC4]'
                              : 'border-slate-300 dark:border-neutral-700'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 text-white dark:text-black" />}
                        </div>
                        <span className="text-base sm:text-lg leading-snug">{sugg}</span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onPreviewSpeak(sugg);
                        }}
                        className={`p-2 rounded-xl transition-colors shrink-0 ${
                          isHighContrast
                            ? 'text-[#00E5FF] hover:bg-neutral-800'
                            : 'text-slate-700 hover:text-blue-700 hover:bg-blue-100'
                        }`}
                        title="Escuchar vista previa"
                        aria-label={`Escuchar opción: ${sugg}`}
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Ethical / Privacy transparency pill */}
        <div className="mt-5 pt-3 border-t border-slate-100 dark:border-neutral-800 flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-neutral-300">
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>
            Las propuestas son sugerencias opcionales. Tú siempre tienes el control total y puedes descartarlas o editarlas.
          </span>
        </div>

        {/* Footer Actions */}
        <div className="mt-5 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className={`px-4 py-2.5 rounded-xl text-sm font-bold border ${
              isHighContrast
                ? 'border-neutral-700 text-white hover:bg-neutral-800'
                : 'border-slate-300 text-slate-900 hover:bg-slate-100'
            }`}
          >
            Descartar
          </button>

          <button
            onClick={fetchSuggestions}
            disabled={loading}
            className={`px-3 py-2.5 rounded-xl text-sm font-bold border flex items-center gap-1.5 ${
              isHighContrast
                ? 'border-neutral-700 text-white hover:bg-neutral-800'
                : 'border-slate-300 text-slate-900 hover:bg-slate-100'
            }`}
            title="Volver a generar opciones"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Reintentar</span>
          </button>

          <button
            onClick={handleApply}
            disabled={selectedIdx === null || loading}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm ${
              selectedIdx === null || loading
                ? 'opacity-40 cursor-not-allowed bg-slate-300 text-slate-500'
                : isHighContrast
                ? 'bg-[#FFE500] text-black hover:bg-yellow-400'
                : 'bg-[#1F5AC4] text-white hover:bg-blue-700'
            }`}
          >
            <Check className="w-4 h-4" />
            <span>Usar esta frase</span>
          </button>
        </div>
      </div>
    </div>
  );
};
