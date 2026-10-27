import React, { useState } from 'react';
import { UserSettings, PresetMode, ButtonSize, TextSize, ContrastMode, AccessMode } from '../types';
import { PRESET_CONFIGS, DEFAULT_CATEGORIES } from '../data/defaultVocab';
import { Sliders, RotateCcw, Check, Sparkles, AlertTriangle, X, Shield, Volume2, Radio } from 'lucide-react';
import { VoiceEngine } from '../hooks/useSpeech';

interface SettingsModalProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  onResetSettings: () => void;
  onClose: () => void;
  availableVoices: SpeechSynthesisVoice[];
  onTestVoice: (rate: number, voiceUri: string) => void;
  voiceEngine: VoiceEngine;
  onSelectVoiceEngine: (engine: VoiceEngine) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onResetSettings,
  onClose,
  availableVoices,
  onTestVoice,
  voiceEngine,
  onSelectVoiceEngine,
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const isHighContrast = settings.contrast === 'high';

  const handleApplyPreset = (presetKey: 'direct' | 'simplified' | 'scanning') => {
    const config = PRESET_CONFIGS[presetKey];
    onUpdateSettings({ ...config, activePreset: presetKey });
  };

  return (
    <div
      className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6"
      role="region"
      aria-label="Configuración de Adaptación de Interfaz y Accesibilidad"
    >
      {/* Top Banner */}
      <div
        className={`p-6 rounded-3xl border transition-colors ${
          isHighContrast
            ? 'bg-neutral-950 border-[#FFE500] text-white'
            : 'bg-white border-slate-300 text-slate-950 shadow-sm'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`p-3 rounded-2xl ${
                isHighContrast
                  ? 'bg-black text-[#FFE500] border border-[#FFE500]'
                  : 'bg-blue-100 text-[#1F5AC4]'
              }`}
            >
              <Sliders className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">Adaptación de la Interfaz</h1>
              <p className="text-sm font-bold text-slate-800 dark:text-neutral-200 mt-0.5">
                Personaliza en tiempo real los controles, tamaños, contraste, modo de acceso y voz.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowConfirmReset(true)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
              isHighContrast
                ? 'border-neutral-700 text-neutral-300 hover:border-red-400 hover:text-red-400'
                : 'border-slate-300 text-slate-800 hover:border-red-300 hover:text-red-600 hover:bg-red-50'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer preferencias</span>
          </button>
        </div>

        {/* Informative note */}
        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-neutral-800 flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-neutral-200">
          <Shield className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            Todas tus preferencias se guardan exclusivamente en la memoria local de tu navegador (localStorage). No recopilamos datos personales ni médicos.
          </span>
        </div>
      </div>

      {/* Preset Profiles Section */}
      <section
        aria-label="Perfiles predefinidos de accesibilidad"
        className={`p-6 rounded-3xl border transition-colors ${
          isHighContrast
            ? 'bg-neutral-950 border-[#FFE500] text-white'
            : 'bg-white border-slate-300 text-slate-950 shadow-sm'
        }`}
      >
        <div className="mb-4">
          <h2 className="text-lg font-black text-slate-950 dark:text-white">Perfiles de Configuración Rápida</h2>
          <p className="text-xs font-bold text-slate-800 dark:text-neutral-200 mt-0.5">
            Presets adaptativos de interfaz (no constituyen prescripciones médicas ni diagnósticos).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Preset 1: Direct Touch */}
          <button
            onClick={() => handleApplyPreset('direct')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              settings.activePreset === 'direct'
                ? isHighContrast
                  ? 'bg-neutral-900 border-[#FFE500] ring-2 ring-[#FFE500]'
                  : 'bg-blue-50 border-[#1F5AC4] ring-2 ring-[#1F5AC4]/30'
                : isHighContrast
                ? 'bg-black border-neutral-800 hover:border-neutral-700'
                : 'bg-slate-50 border-slate-300 hover:border-blue-400'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-extrabold text-sm text-blue-950 dark:text-[#FFE500]">Acceso Directo</span>
              {settings.activePreset === 'direct' && <Check className="w-4 h-4 text-blue-600 dark:text-[#FFE500]" />}
            </div>
            <p className="text-xs font-semibold text-slate-800 dark:text-neutral-200 leading-relaxed">
              Botones y texto grandes, 4 columnas de tablero, pensado para toque directo con pantalla o mouse.
            </p>
          </button>

          {/* Preset 2: Simplified */}
          <button
            onClick={() => handleApplyPreset('simplified')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              settings.activePreset === 'simplified'
                ? isHighContrast
                  ? 'bg-neutral-900 border-[#FFE500] ring-2 ring-[#FFE500]'
                  : 'bg-blue-50 border-[#1F5AC4] ring-2 ring-[#1F5AC4]/30'
                : isHighContrast
                ? 'bg-black border-neutral-800 hover:border-neutral-700'
                : 'bg-slate-50 border-slate-300 hover:border-blue-400'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-extrabold text-sm text-blue-950 dark:text-[#FFE500]">Acceso Simplificado</span>
              {settings.activePreset === 'simplified' && <Check className="w-4 h-4 text-blue-600 dark:text-[#FFE500]" />}
            </div>
            <p className="text-xs font-semibold text-slate-800 dark:text-neutral-200 leading-relaxed">
              Botones y tipografía Extra Grandes (XL), 2 columnas espaciadas, máxima área de pulsación.
            </p>
          </button>

          {/* Preset 3: Scanning */}
          <button
            onClick={() => handleApplyPreset('scanning')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              settings.activePreset === 'scanning'
                ? isHighContrast
                  ? 'bg-neutral-900 border-[#FFE500] ring-2 ring-[#FFE500]'
                  : 'bg-blue-50 border-[#1F5AC4] ring-2 ring-[#1F5AC4]/30'
                : isHighContrast
                ? 'bg-black border-neutral-800 hover:border-neutral-700'
                : 'bg-slate-50 border-slate-300 hover:border-blue-400'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-extrabold text-sm text-blue-950 dark:text-[#FFE500]">Barrido Secuencial</span>
              {settings.activePreset === 'scanning' && <Check className="w-4 h-4 text-blue-600 dark:text-[#FFE500]" />}
            </div>
            <p className="text-xs font-semibold text-slate-800 dark:text-neutral-200 leading-relaxed">
              Selección secuencial automática paso a paso, selección por tecla Espacio/Enter o conmutador simulado.
            </p>
          </button>
        </div>
      </section>

      {/* Detailed Granular Customization */}
      <section
        aria-label="Ajustes detallados de la interfaz"
        className={`p-6 rounded-3xl border transition-colors space-y-6 ${
          isHighContrast
            ? 'bg-neutral-950 border-[#FFE500] text-white'
            : 'bg-white border-slate-200 text-slate-900 shadow-xs'
        }`}
      >
        <h2 className="text-lg font-bold border-b pb-3 border-slate-100 dark:border-neutral-800">
          Ajustes Personalizados
        </h2>

        {/* Modo de Acceso */}
        <div className="space-y-2">
          <label className="text-sm font-bold block">Modo de Selección / Acceso</label>
          <div className="grid grid-cols-2 gap-3 max-w-md">
            <button
              onClick={() => onUpdateSettings({ accessMode: 'direct', activePreset: 'custom' })}
              className={`py-3 px-4 rounded-xl border text-sm font-bold transition-all ${
                settings.accessMode === 'direct'
                  ? isHighContrast
                    ? 'bg-[#FFE500] text-black border-[#FFE500]'
                    : 'bg-[#1F5AC4] text-white border-[#1F5AC4]'
                  : isHighContrast
                  ? 'bg-black border-neutral-700 text-white hover:bg-neutral-900'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              Selección Directa (Táctil / Ratón)
            </button>
            <button
              onClick={() => onUpdateSettings({ accessMode: 'scanning', activePreset: 'custom' })}
              className={`py-3 px-4 rounded-xl border text-sm font-bold transition-all ${
                settings.accessMode === 'scanning'
                  ? isHighContrast
                    ? 'bg-[#FFE500] text-black border-[#FFE500]'
                    : 'bg-[#1F5AC4] text-white border-[#1F5AC4]'
                  : isHighContrast
                  ? 'bg-black border-neutral-700 text-white hover:bg-neutral-900'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              Barrido Secuencial (Conmutador / Tecla)
            </button>
          </div>
        </div>

        {/* Barrido Interval Controls (Visible if scanning mode is active) */}
        {settings.accessMode === 'scanning' && (
          <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-neutral-900 border border-blue-200 dark:border-neutral-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-blue-950 dark:text-[#FFE500]">
                Velocidad de Barrido Secuencial: {settings.scanInterval} segundos
              </label>
            </div>
            <div className="flex items-center gap-3">
              {[1.0, 1.5, 2.0, 2.5, 3.0, 4.0].map((sec) => (
                <button
                  key={sec}
                  onClick={() => onUpdateSettings({ scanInterval: sec, activePreset: 'custom' })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                    settings.scanInterval === sec
                      ? isHighContrast
                        ? 'bg-[#FFE500] text-black border-[#FFE500]'
                        : 'bg-[#1F5AC4] text-white border-[#1F5AC4]'
                      : isHighContrast
                      ? 'bg-black text-white border-neutral-700'
                      : 'bg-white text-slate-700 border-slate-300'
                  }`}
                >
                  {sec}s
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="soundFeedbackCheck"
                checked={settings.scanFeedbackSound}
                onChange={(e) => onUpdateSettings({ scanFeedbackSound: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="soundFeedbackCheck" className="text-xs font-medium cursor-pointer">
                Emitir clic sonoro sutil en cada paso de barrido
              </label>
            </div>
          </div>
        )}

        {/* Tamaño de Botones */}
        <div className="space-y-2">
          <label className="text-sm font-bold block">Tamaño de los Botones del Tablero</label>
          <div className="grid grid-cols-3 gap-3 max-w-md">
            {(['normal', 'large', 'xl'] as ButtonSize[]).map((size) => (
              <button
                key={size}
                onClick={() => onUpdateSettings({ buttonSize: size, activePreset: 'custom' })}
                className={`py-2.5 px-3 rounded-xl border text-sm font-bold capitalize transition-all ${
                  settings.buttonSize === size
                    ? isHighContrast
                      ? 'bg-[#FFE500] text-black border-[#FFE500]'
                      : 'bg-[#1F5AC4] text-white border-[#1F5AC4]'
                    : isHighContrast
                    ? 'bg-black border-neutral-700 text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                {size === 'normal' ? 'Normal' : size === 'large' ? 'Grande' : 'Extra Grande (XL)'}
              </button>
            ))}
          </div>
        </div>

        {/* Tamaño del Texto */}
        <div className="space-y-2">
          <label className="text-sm font-bold block">Tamaño de Tipografía</label>
          <div className="grid grid-cols-3 gap-3 max-w-md">
            {(['normal', 'large', 'xl'] as TextSize[]).map((ts) => (
              <button
                key={ts}
                onClick={() => onUpdateSettings({ textSize: ts, activePreset: 'custom' })}
                className={`py-2.5 px-3 rounded-xl border text-sm font-bold capitalize transition-all ${
                  settings.textSize === ts
                    ? isHighContrast
                      ? 'bg-[#FFE500] text-black border-[#FFE500]'
                      : 'bg-[#1F5AC4] text-white border-[#1F5AC4]'
                    : isHighContrast
                    ? 'bg-black border-neutral-700 text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                {ts === 'normal' ? 'Normal' : ts === 'large' ? 'Grande' : 'Extra Grande'}
              </button>
            ))}
          </div>
        </div>

        {/* Columnas del Tablero */}
        <div className="space-y-2">
          <label className="text-sm font-bold block">Columnas en Pantalla</label>
          <div className="flex items-center gap-3">
            {[2, 3, 4, 5].map((cols) => (
              <button
                key={cols}
                onClick={() => onUpdateSettings({ columns: cols, activePreset: 'custom' })}
                className={`w-12 h-10 rounded-xl border font-bold text-sm transition-all ${
                  settings.columns === cols
                    ? isHighContrast
                      ? 'bg-[#FFE500] text-black border-[#FFE500]'
                      : 'bg-[#1F5AC4] text-white border-[#1F5AC4]'
                    : isHighContrast
                    ? 'bg-black border-neutral-700 text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                {cols}
              </button>
            ))}
          </div>
        </div>

        {/* Contraste */}
        <div className="space-y-2">
          <label className="text-sm font-bold block">Modo de Contraste</label>
          <div className="grid grid-cols-2 gap-3 max-w-md">
            <button
              onClick={() => onUpdateSettings({ contrast: 'normal' })}
              className={`py-2.5 px-4 rounded-xl border text-sm font-bold transition-all ${
                settings.contrast === 'normal'
                  ? 'bg-[#1F5AC4] text-white border-[#1F5AC4]'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              Normal (Azul PHONÉ)
            </button>
            <button
              onClick={() => onUpdateSettings({ contrast: 'high' })}
              className={`py-2.5 px-4 rounded-xl border text-sm font-bold transition-all ${
                settings.contrast === 'high'
                  ? 'bg-[#FFE500] text-black border-[#FFE500]'
                  : 'bg-black text-[#FFE500] border-neutral-800'
              }`}
            >
              Alto Contraste (WCAG AAA)
            </button>
          </div>
        </div>

        {/* Síntesis de Voz */}
        <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-neutral-800">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-base font-black block text-slate-950 dark:text-white">Motor y Síntesis de Voz</label>
              <p className="text-xs font-bold text-slate-800 dark:text-neutral-200 mt-0.5">
                Garantiza que siempre se reproduzca audio en cualquier sistema o navegador.
              </p>
            </div>
          </div>

          {/* Voice engine selection */}
          <div className="space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-wider block text-slate-900 dark:text-neutral-200">
              Seleccionar Motor de Audio
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => onSelectVoiceEngine('auto')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  voiceEngine === 'auto'
                    ? isHighContrast
                      ? 'bg-neutral-900 border-[#FFE500] ring-2 ring-[#FFE500]'
                      : 'bg-blue-50 border-[#1F5AC4] ring-2 ring-[#1F5AC4]/30'
                    : isHighContrast
                    ? 'bg-black border-neutral-700 text-white'
                    : 'bg-white border-slate-300 text-slate-900'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-extrabold text-xs text-blue-950 dark:text-[#FFE500]">Automático / Híbrido</span>
                  {voiceEngine === 'auto' && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-[#FFE500]" />}
                </div>
                <p className="text-[11px] font-semibold text-slate-800 dark:text-neutral-300">
                  Usa el navegador y conmuta al servidor si el sistema no tiene voces instaladas.
                </p>
              </button>

              <button
                type="button"
                onClick={() => onSelectVoiceEngine('cloud')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  voiceEngine === 'cloud'
                    ? isHighContrast
                      ? 'bg-neutral-900 border-[#FFE500] ring-2 ring-[#FFE500]'
                      : 'bg-blue-50 border-[#1F5AC4] ring-2 ring-[#1F5AC4]/30'
                    : isHighContrast
                    ? 'bg-black border-neutral-700 text-white'
                    : 'bg-white border-slate-300 text-slate-900'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-extrabold text-xs text-blue-950 dark:text-[#FFE500]">Voz Inteligente PHONÉ</span>
                  {voiceEngine === 'cloud' && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-[#FFE500]" />}
                </div>
                <p className="text-[11px] font-semibold text-slate-800 dark:text-neutral-300">
                  Voz Gemini TTS en español de alta definición (funciona en Linux Mint y cualquier SO).
                </p>
              </button>

              <button
                type="button"
                onClick={() => onSelectVoiceEngine('browser')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  voiceEngine === 'browser'
                    ? isHighContrast
                      ? 'bg-neutral-900 border-[#FFE500] ring-2 ring-[#FFE500]'
                      : 'bg-blue-50 border-[#1F5AC4] ring-2 ring-[#1F5AC4]/30'
                    : isHighContrast
                    ? 'bg-black border-neutral-700 text-white'
                    : 'bg-white border-slate-300 text-slate-900'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-extrabold text-xs text-blue-950 dark:text-[#FFE500]">Navegador Local</span>
                  {voiceEngine === 'browser' && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-[#FFE500]" />}
                </div>
                <p className="text-[11px] font-semibold text-slate-800 dark:text-neutral-300">
                  Web Speech API estándar del dispositivo ({availableVoices.length} voces encontradas).
                </p>
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <div>
              <span className="text-xs text-slate-900 dark:text-white font-extrabold block mb-1">
                Velocidad de habla: {settings.speechRate}x
              </span>
              <div className="flex items-center gap-2">
                {[0.75, 0.9, 1.0, 1.2].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => onUpdateSettings({ speechRate: rate })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black border transition-all ${
                      settings.speechRate === rate
                        ? isHighContrast
                          ? 'bg-[#FFE500] text-black border-[#FFE500]'
                          : 'bg-[#1F5AC4] text-white border-[#1F5AC4]'
                        : isHighContrast
                        ? 'bg-black text-white border-neutral-700'
                        : 'bg-white text-slate-900 font-bold border-slate-300'
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            </div>

            {/* Test voice button */}
            <div className="pt-4">
              <button
                onClick={() => onTestVoice(settings.speechRate, settings.speechVoiceUri)}
                className={`px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 border transition-all shadow-xs ${
                  isHighContrast
                    ? 'bg-neutral-900 border-[#00E5FF] text-[#00E5FF]'
                    : 'bg-blue-100 border-blue-300 text-blue-950 hover:bg-blue-200'
                }`}
              >
                <Volume2 className="w-4 h-4 text-blue-700 dark:text-[#00E5FF]" />
                <span>Probar voz ahora</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Confirmation Modal for Reset */}
      {showConfirmReset && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
          role="alertdialog"
          aria-labelledby="confirm-reset-title"
        >
          <div
            className={`w-full max-w-md rounded-3xl p-6 border shadow-2xl ${
              isHighContrast
                ? 'bg-neutral-950 border-[#FFE500] text-white'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center gap-3 text-amber-500 mb-3">
              <AlertTriangle className="w-6 h-6" />
              <h3 id="confirm-reset-title" className="text-lg font-bold">
                ¿Restablecer preferencias?
              </h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-neutral-300 leading-relaxed">
              Esta acción restaurará los tamaños de botones, modo de acceso y contraste a los valores iniciales. Tus frases creadas se mantendrán a salvo.
            </p>
            <div className="mt-5 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowConfirmReset(false)}
                className="px-4 py-2 rounded-xl text-sm font-semibold border border-slate-300 dark:border-neutral-700"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onResetSettings();
                  setShowConfirmReset(false);
                }}
                className="px-4 py-2 rounded-xl text-sm font-bold bg-red-600 hover:bg-red-700 text-white"
              >
                Sí, restablecer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
