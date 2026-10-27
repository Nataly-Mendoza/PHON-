import React from 'react';
import { Play, Pause, ChevronLeft, ChevronRight, CheckCircle2, XCircle, Keyboard } from 'lucide-react';
import { ContrastMode } from '../types';

interface ScanningBarProps {
  isPaused: boolean;
  onTogglePause: () => void;
  onStepNext: () => void;
  onStepPrev: () => void;
  onSelectCurrent: () => void;
  onDisableScanning: () => void;
  currentLabel?: string;
  intervalSec: number;
  contrast: ContrastMode;
}

export const ScanningBar: React.FC<ScanningBarProps> = ({
  isPaused,
  onTogglePause,
  onStepNext,
  onStepPrev,
  onSelectCurrent,
  onDisableScanning,
  currentLabel,
  intervalSec,
  contrast,
}) => {
  const isHighContrast = contrast === 'high';

  return (
    <section
      aria-label="Controles del sistema de barrido secuencial"
      className={`border-b transition-colors ${
        isHighContrast
          ? 'bg-neutral-900 border-[#FFE500] text-white'
          : 'bg-blue-50/90 border-blue-200 text-blue-950'
      } py-2.5 px-4 shadow-inner`}
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Scanning status and keyboard reminder */}
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${
              isHighContrast
                ? 'bg-black text-[#FFE500] border border-[#FFE500]'
                : isPaused
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : 'bg-blue-600 text-white shadow-xs'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isPaused
                  ? 'bg-amber-500'
                  : isHighContrast
                  ? 'bg-[#FFE500] animate-pulse'
                  : 'bg-white animate-pulse'
              }`}
              aria-hidden="true"
            />
            <span>{isPaused ? 'Barrido Pausado' : `Barrido (${intervalSec}s)`}</span>
          </div>

          {currentLabel && (
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold">
              <span className="opacity-70">Enfoque:</span>
              <span
                className={`px-2 py-0.5 rounded font-bold truncate max-w-xs ${
                  isHighContrast ? 'bg-black text-[#00E5FF]' : 'bg-white text-blue-900 shadow-xs'
                }`}
              >
                {currentLabel}
              </span>
            </div>
          )}
        </div>

        {/* Action Controls for Switch & Keyboard Navigation */}
        <div className="flex items-center gap-2">
          {/* Step Back */}
          <button
            onClick={onStepPrev}
            className={`p-2 rounded-lg text-xs font-bold flex items-center gap-1 transition-all border ${
              isHighContrast
                ? 'bg-black text-white border-[#FFE500] hover:bg-neutral-800'
                : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100 shadow-xs'
            }`}
            title="Paso anterior (Flecha Izquierda)"
            aria-label="Paso anterior de barrido"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Pause / Resume */}
          <button
            onClick={onTogglePause}
            className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all border ${
              isHighContrast
                ? 'bg-[#FFE500] text-black border-[#FFE500] hover:bg-yellow-400'
                : 'bg-white text-blue-900 border-blue-300 hover:bg-blue-100 shadow-xs'
            }`}
            title={isPaused ? 'Reanudar barrido automático' : 'Pausar barrido automático'}
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            <span className="hidden md:inline">{isPaused ? 'Reanudar' : 'Pausar'}</span>
          </button>

          {/* Step Next */}
          <button
            onClick={onStepNext}
            className={`p-2 rounded-lg text-xs font-bold flex items-center gap-1 transition-all border ${
              isHighContrast
                ? 'bg-black text-white border-[#FFE500] hover:bg-neutral-800'
                : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100 shadow-xs'
            }`}
            title="Paso siguiente (Flecha Derecha o Tab)"
            aria-label="Paso siguiente de barrido"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Select Current Button (Conmutador / Switch trigger) */}
          <button
            onClick={onSelectCurrent}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
              isHighContrast
                ? 'bg-[#00E5FF] text-black hover:bg-cyan-300 ring-2 ring-[#00E5FF]'
                : 'bg-[#1F5AC4] text-white hover:bg-blue-700'
            }`}
            title="Seleccionar elemento resaltado (Tecla Espacio o Enter)"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Seleccionar [Espacio / Enter]</span>
          </button>

          {/* Disable scanning button */}
          <button
            onClick={onDisableScanning}
            className={`p-2 rounded-lg text-xs font-medium opacity-80 hover:opacity-100 transition-opacity ${
              isHighContrast ? 'text-white' : 'text-slate-600'
            }`}
            title="Desactivar modo barrido (volver a selección directa)"
            aria-label="Desactivar modo barrido"
          >
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
