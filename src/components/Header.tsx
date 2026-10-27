import React from 'react';
import { PhoneLogo } from './PhoneLogo';
import { Contrast, Settings, Bookmark, Info, Sparkles, Volume2 } from 'lucide-react';
import { ContrastMode, AccessMode } from '../types';

interface HeaderProps {
  currentTab: 'board' | 'settings' | 'vocabulary' | 'about';
  onSelectTab: (tab: 'board' | 'settings' | 'vocabulary' | 'about') => void;
  contrast: ContrastMode;
  onToggleContrast: () => void;
  accessMode: AccessMode;
  isSpeaking: boolean;
  onStopSpeaking: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  contrast,
  onToggleContrast,
  accessMode,
  isSpeaking,
  onStopSpeaking,
}) => {
  const isHighContrast = contrast === 'high';

  return (
    <header
      className={`border-b sticky top-0 z-40 transition-colors ${
        isHighContrast
          ? 'bg-black border-[#FFE500] text-white'
          : 'bg-white/95 backdrop-blur-md border-slate-200 text-slate-900 shadow-xs'
      }`}
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Zone 1: Brand wordmark & logo */}
        <button
          onClick={() => onSelectTab('board')}
          className="focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-600 rounded-xl p-1 text-left transition-transform active:scale-95"
          aria-label="PHONÉ - Inicio del tablero de comunicación"
        >
          <PhoneLogo
            size="md"
            showText={true}
            showSlogan={true}
            isHighContrast={isHighContrast}
          />
        </button>

        {/* Zone 2: Navigation links */}
        <nav
          className="hidden md:flex items-center gap-2 lg:gap-3 text-sm font-semibold"
          aria-label="Navegación principal"
        >
          <button
            onClick={() => onSelectTab('board')}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
              currentTab === 'board'
                ? isHighContrast
                  ? 'bg-[#FFE500] text-black font-bold ring-2 ring-[#FFE500]'
                  : 'bg-[#1F5AC4] text-white shadow-sm'
                : isHighContrast
                ? 'text-white hover:bg-neutral-800'
                : 'text-slate-900 font-bold hover:text-blue-900 hover:bg-blue-50'
            }`}
            aria-current={currentTab === 'board' ? 'page' : undefined}
          >
            <span>Tablero</span>
          </button>

          <button
            onClick={() => onSelectTab('settings')}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
              currentTab === 'settings'
                ? isHighContrast
                  ? 'bg-[#FFE500] text-black font-bold ring-2 ring-[#FFE500]'
                  : 'bg-[#1F5AC4] text-white shadow-sm'
                : isHighContrast
                ? 'text-white hover:bg-neutral-800'
                : 'text-slate-900 font-bold hover:text-blue-900 hover:bg-blue-50'
            }`}
            aria-current={currentTab === 'settings' ? 'page' : undefined}
          >
            <Settings className="w-4 h-4" aria-hidden="true" />
            <span>Adaptación</span>
            {accessMode === 'scanning' && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-900 font-bold uppercase tracking-wider">
                Barrido
              </span>
            )}
          </button>

          <button
            onClick={() => onSelectTab('vocabulary')}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
              currentTab === 'vocabulary'
                ? isHighContrast
                  ? 'bg-[#FFE500] text-black font-bold ring-2 ring-[#FFE500]'
                  : 'bg-[#1F5AC4] text-white shadow-sm'
                : isHighContrast
                ? 'text-white hover:bg-neutral-800'
                : 'text-slate-900 font-bold hover:text-blue-900 hover:bg-blue-50'
            }`}
            aria-current={currentTab === 'vocabulary' ? 'page' : undefined}
          >
            <Bookmark className="w-4 h-4" aria-hidden="true" />
            <span>Vocabulario</span>
          </button>

          <button
            onClick={() => onSelectTab('about')}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
              currentTab === 'about'
                ? isHighContrast
                  ? 'bg-[#FFE500] text-black font-bold ring-2 ring-[#FFE500]'
                  : 'bg-[#1F5AC4] text-white shadow-sm'
                : isHighContrast
                ? 'text-white hover:bg-neutral-800'
                : 'text-slate-900 font-bold hover:text-blue-900 hover:bg-blue-50'
            }`}
            aria-current={currentTab === 'about' ? 'page' : undefined}
          >
            <Info className="w-4 h-4" aria-hidden="true" />
            <span>Acerca del prototipo</span>
          </button>
        </nav>

        {/* Zone 3: Quick Accessibility & Speaking Status Action */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Speaking stop button if currently speaking */}
          {isSpeaking && (
            <button
              onClick={onStopSpeaking}
              className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm animate-pulse"
              title="Detener voz"
              aria-label="Detener voz en reproducción"
            >
              <Volume2 className="w-4 h-4" />
              <span className="hidden sm:inline">Detener</span>
            </button>
          )}

          {/* High Contrast Toggle Button */}
          <button
            onClick={onToggleContrast}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border ${
              isHighContrast
                ? 'bg-[#FFE500] text-black border-[#FFE500] hover:bg-yellow-300'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
            }`}
            title="Alternar modo de alto contraste (WCAG AAA)"
            aria-label={`Modo de contraste: actualmente ${isHighContrast ? 'Alto contraste' : 'Normal'}`}
          >
            <Contrast className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">
              {isHighContrast ? 'Contraste Alto' : 'Contraste'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div
        className={`md:hidden flex items-center justify-around border-t py-2 px-2 text-xs font-semibold ${
          isHighContrast ? 'border-neutral-800 bg-black' : 'border-slate-100 bg-slate-50'
        }`}
      >
        <button
          onClick={() => onSelectTab('board')}
          className={`px-2.5 py-1.5 rounded-lg ${
            currentTab === 'board'
              ? isHighContrast
                ? 'bg-[#FFE500] text-black font-bold'
                : 'bg-blue-600 text-white'
              : 'text-slate-700'
          }`}
        >
          Tablero
        </button>
        <button
          onClick={() => onSelectTab('settings')}
          className={`px-2.5 py-1.5 rounded-lg ${
            currentTab === 'settings'
              ? isHighContrast
                ? 'bg-[#FFE500] text-black font-bold'
                : 'bg-blue-600 text-white'
              : 'text-slate-700'
          }`}
        >
          Adaptar
        </button>
        <button
          onClick={() => onSelectTab('vocabulary')}
          className={`px-2.5 py-1.5 rounded-lg ${
            currentTab === 'vocabulary'
              ? isHighContrast
                ? 'bg-[#FFE500] text-black font-bold'
                : 'bg-blue-600 text-white'
              : 'text-slate-700'
          }`}
        >
          Frases
        </button>
        <button
          onClick={() => onSelectTab('about')}
          className={`px-2.5 py-1.5 rounded-lg ${
            currentTab === 'about'
              ? isHighContrast
                ? 'bg-[#FFE500] text-black font-bold'
                : 'bg-blue-600 text-white'
              : 'text-slate-700'
          }`}
        >
          Acerca de
        </button>
      </div>
    </header>
  );
};
