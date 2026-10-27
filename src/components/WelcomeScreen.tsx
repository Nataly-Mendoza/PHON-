import React from 'react';
import { PhoneLogo } from './PhoneLogo';
import { MessageSquare, Sliders, ArrowRight, ShieldCheck, CheckCircle2, Sparkles, GraduationCap } from 'lucide-react';
import { ContrastMode } from '../types';

interface WelcomeScreenProps {
  onStart: () => void;
  onOpenSettings: () => void;
  contrast: ContrastMode;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onStart,
  onOpenSettings,
  contrast,
}) => {
  const isHighContrast = contrast === 'high';

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-8 max-w-4xl mx-auto text-center">
      {/* Brand & Slogan Badge */}
      <div className="mb-6 animate-in fade-in duration-300">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-blue-100/80 dark:bg-neutral-800 text-[#042C71] dark:text-[#FFE500] border border-blue-200 dark:border-neutral-700 mb-6">
          <GraduationCap className="w-3.5 h-3.5 text-blue-600 dark:text-[#FFE500]" />
          <span>Instituto Tecnológico de Morelia • Investigación en CAA</span>
        </div>

        <div className="flex justify-center mb-6">
          <PhoneLogo
            size="xl"
            showText={true}
            showSlogan={true}
            isHighContrast={isHighContrast}
            className="flex-col sm:flex-row gap-4 sm:gap-6 text-center sm:text-left"
          />
        </div>

        <h1
          className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tight max-w-2xl mx-auto leading-tight ${
            isHighContrast ? 'text-[#FFE500]' : 'text-[#042C71]'
          }`}
        >
          Comunicación Aumentativa y Alternativa para Adultos
        </h1>

        <p
          className={`mt-4 text-base sm:text-lg max-w-xl mx-auto leading-relaxed font-semibold ${
            isHighContrast ? 'text-white' : 'text-slate-900'
          }`}
        >
          Un modelo de software adaptativo diseñado en México para apoyar la autonomía de expresión mediante tableros personalizables, síntesis de voz en español y métodos alternativos de acceso.
        </p>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full my-8 text-left">
        <div
          className={`p-5 rounded-2xl border transition-all ${
            isHighContrast
              ? 'bg-neutral-900 border-[#FFE500] text-white'
              : 'bg-white border-slate-300 text-slate-900 shadow-sm'
          }`}
        >
          <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-black text-[#1F5AC4] dark:text-[#FFE500] flex items-center justify-center mb-3">
            <MessageSquare className="w-5 h-5" />
          </div>
          <h2 className="font-extrabold text-base mb-1.5 text-slate-900 dark:text-white">Vocabulario para Adultos</h2>
          <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-neutral-200 leading-relaxed">
            Frases organizadas por salud, necesidades, relaciones y decisiones, sin estéticas infantiles.
          </p>
        </div>

        <div
          className={`p-5 rounded-2xl border transition-all ${
            isHighContrast
              ? 'bg-neutral-900 border-[#FFE500] text-white'
              : 'bg-white border-slate-300 text-slate-900 shadow-sm'
          }`}
        >
          <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-black text-[#1F5AC4] dark:text-[#FFE500] flex items-center justify-center mb-3">
            <Sliders className="w-5 h-5" />
          </div>
          <h2 className="font-extrabold text-base mb-1.5 text-slate-900 dark:text-white">Acceso y Adaptación</h2>
          <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-neutral-200 leading-relaxed">
            Botones de tamaño adaptable, alto contraste WCAG AAA y simulación de barrido secuencial por conmutador.
          </p>
        </div>

        <div
          className={`p-5 rounded-2xl border transition-all ${
            isHighContrast
              ? 'bg-neutral-900 border-[#FFE500] text-white'
              : 'bg-white border-slate-300 text-slate-900 shadow-sm'
          }`}
        >
          <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-black text-[#1F5AC4] dark:text-[#FFE500] flex items-center justify-center mb-3">
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 className="font-extrabold text-base mb-1.5 text-slate-900 dark:text-white">Voz y Expresión</h2>
          <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-neutral-200 leading-relaxed">
            Síntesis de voz en español mexicano (es-MX) y asistente opcional de construcción de frases con Gemini.
          </p>
        </div>
      </div>

      {/* Primary Call to Action buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
        <button
          onClick={onStart}
          className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-lg transition-transform active:scale-95 ${
            isHighContrast
              ? 'bg-[#FFE500] text-black hover:bg-yellow-400 ring-2 ring-[#FFE500]'
              : 'bg-[#1F5AC4] hover:bg-blue-700 text-white'
          }`}
          aria-label="Comenzar a comunicar inmediatamente"
        >
          <span>Comenzar a comunicar</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        <button
          onClick={onOpenSettings}
          className={`w-full sm:w-auto px-6 py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2.5 border transition-all ${
            isHighContrast
              ? 'bg-black border-[#FFE500] text-white hover:bg-neutral-900'
              : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900'
          }`}
          aria-label="Ajustar preferencias de accesibilidad primero"
        >
          <Sliders className="w-5 h-5" />
          <span>Configurar accesibilidad primero</span>
        </button>
      </div>

      {/* Privacy and Respect disclaimer */}
      <div className="mt-8 flex items-center gap-2 text-xs sm:text-sm">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span className="font-bold text-slate-800 dark:text-neutral-200">
          No se requiere cuenta ni registro. Todas las preferencias se guardan de forma local en tu navegador.
        </span>
      </div>
    </div>
  );
};
