import React from 'react';
import { ContrastMode } from '../types';
import { PhoneLogo } from './PhoneLogo';
import { GraduationCap, CheckCircle2, AlertTriangle, ShieldAlert, Terminal, Layers, Info, Sparkles, BookOpen } from 'lucide-react';

interface AboutModalProps {
  contrast: ContrastMode;
}

export const AboutModal: React.FC<AboutModalProps> = ({ contrast }) => {
  const isHighContrast = contrast === 'high';

  return (
    <div
      className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6"
      role="region"
      aria-label="Acerca del prototipo de investigación PHONÉ"
    >
      {/* Institutional Academic Card */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border transition-colors ${
          isHighContrast
            ? 'bg-neutral-950 border-[#FFE500] text-white'
            : 'bg-white border-slate-200 text-slate-900 shadow-xs'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6 border-slate-100 dark:border-neutral-800">
          <div className="flex items-center gap-4">
            <PhoneLogo size="lg" showText={true} showSlogan={true} isHighContrast={isHighContrast} />
          </div>
          <div className="flex items-center gap-2 text-xs font-black text-slate-900 dark:text-neutral-200 bg-slate-100 dark:bg-neutral-900 px-3 py-2 rounded-xl border border-slate-300 dark:border-neutral-800">
            <GraduationCap className="w-4 h-4 text-blue-700 dark:text-[#FFE500]" />
            <span>Instituto Tecnológico de Morelia</span>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <span className="text-xs uppercase font-black tracking-wider text-blue-900 dark:text-[#FFE500]">
            Proyecto de Investigación Tecnológica
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug text-slate-950 dark:text-white">
            “Diseño y desarrollo de un modelo de software adaptativo de Comunicación Aumentativa y Alternativa para adultos con parálisis cerebral en el contexto mexicano”
          </h1>
          <p className="text-sm sm:text-base text-slate-900 font-medium dark:text-neutral-200 leading-relaxed">
            PHONÉ (del griego antiguo <em>φωνή</em>, voz/sonido) es una plataforma de Comunicación Aumentativa y Alternativa (CAA) concebida para respetar la autonomía, dignidad y derechos comunicativos de personas adultas. Su objetivo es brindar un entorno adaptable a diversas necesidades motoras y sensoriales, con vocabulario propio del contexto cotidiano de México.
          </p>
        </div>
      </div>

      {/* Transparent Disclaimer Box */}
      <div
        className={`p-6 rounded-3xl border flex items-start gap-4 ${
          isHighContrast
            ? 'bg-neutral-900 border-[#FFE500] text-[#FFE500]'
            : 'bg-amber-50/80 border-amber-200 text-amber-950'
        }`}
      >
        <ShieldAlert className="w-6 h-6 shrink-0 text-amber-600 mt-1" />
        <div className="space-y-1.5 text-xs sm:text-sm leading-relaxed">
          <h2 className="font-extrabold text-sm sm:text-base">
            Aviso de Transparencia Académica y Ética
          </h2>
          <p>
            Este software es un <strong>prototipo académico y tecnológico de demostración de viabilidad técnica</strong> para evaluación universitaria y pruebas preliminares de interacción.
          </p>
          <p>
            <strong>No está clínicamente validado</strong> ni pretende sustituir intervenciones fonoaudiológicas, médicas o de terapia ocupacional. La validación con usuarios adultos con parálisis cerebral requiere una fase posterior con el correspondiente protocolo y comité de ética institucional.
          </p>
        </div>
      </div>

      {/* Grid of Implemented vs Simulated Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Real Implemented Features */}
        <section
          className={`p-6 rounded-3xl border transition-colors space-y-4 ${
            isHighContrast
              ? 'bg-neutral-950 border-[#FFE500] text-white'
              : 'bg-white border-slate-200 text-slate-900 shadow-xs'
          }`}
          aria-label="Funciones funcionales implementadas"
        >
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
            <h2 className="text-lg font-bold">Funciones 100% Funcionales</h2>
          </div>

          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-900 font-medium dark:text-neutral-200">
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">✓</span>
              <span><strong>Tablero dinámico de CAA:</strong> Selección y concatenación de frases estructuradas por categorías de adultos en México.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">✓</span>
              <span><strong>Área de construcción de mensajes:</strong> Reordenamiento secuencial, borrado por token, borrado total y copia al portapapeles.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">✓</span>
              <span><strong>Síntesis de voz real:</strong> Integración dual Web Speech API + voz Gemini TTS de alta fidelidad priorizando español de México (<code>es-MX</code>).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">✓</span>
              <span><strong>Adaptación visual:</strong> Cambio instantáneo de tamaños de botón (Normal, Grande, XL), tamaño tipográfico y columnas.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">✓</span>
              <span><strong>Modo de Alto Contraste:</strong> Cumplimiento estricto con pautas WCAG 2.1 nivel AA / AAA para personas con baja agudeza visual.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">✓</span>
              <span><strong>Persistencia local:</strong> Guardado de preferencias y frases personalizadas en <code>localStorage</code> sin recabar datos sensibles.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">✓</span>
              <span><strong>Asistencia Gemini (“Ayúdame a expresar esto”):</strong> Propuestas opcionales de frases completas en español mexicano procesadas en servidor seguro.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">✓</span>
              <span><strong>Transcripción de audio con micrófono:</strong> Entrada de voz por micrófono y transcripción fiel en español impulsada por el modelo <code>gemini-3.5-transcribe</code>.</span>
            </li>
          </ul>
        </section>

        {/* Simulated vs Future Work */}
        <section
          className={`p-6 rounded-3xl border transition-colors space-y-4 ${
            isHighContrast
              ? 'bg-neutral-950 border-[#FFE500] text-white'
              : 'bg-white border-slate-200 text-slate-900 shadow-xs'
          }`}
          aria-label="Funciones simuladas y trabajo futuro"
        >
          <div className="flex items-center gap-2 text-blue-700 dark:text-[#00E5FF]">
            <Layers className="w-5 h-5" />
            <h2 className="text-lg font-bold">Simulaciones y Alcance</h2>
          </div>

          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-900 font-medium dark:text-neutral-200">
            <li className="flex items-start gap-2">
              <span className="text-blue-700 font-bold">ℹ</span>
              <span><strong>Simulador de barrido secuencial:</strong> Permite evaluar y demostrar la lógica de barrido automático y manual con conmutadores simulados mediante las teclas <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-neutral-800 border border-slate-400 font-bold">Espacio</kbd> o <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-neutral-800 border border-slate-400 font-bold">Enter</kbd>, sin requerir hardware externo de acceso.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-700 font-bold">ℹ</span>
              <span><strong>Simulación de conmutador físico:</strong> No equivale a un switch de pulsación clínica calibrado individualmente; es un mecanismo de prueba de interacción.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-700 font-bold">⚠</span>
              <span><strong>Trabajo Futuro (Excluido deliberadamente):</strong> El seguimiento ocular por webcam (Eye-Tracking) no se implementa en esta fase debido a la falta de precisión milimétrica sin hardware infrarrojo dedicado.</span>
            </li>
          </ul>
        </section>
      </div>

      {/* Linux Mint & Local Execution Instructions Card */}
      <section
        className={`p-6 sm:p-8 rounded-3xl border transition-colors space-y-4 ${
          isHighContrast
            ? 'bg-neutral-950 border-[#FFE500] text-white'
            : 'bg-white border-slate-200 text-slate-900 shadow-xs'
        }`}
        aria-label="Instrucciones de ejecución local en Linux Mint"
      >
        <div className="flex items-center gap-3">
          <Terminal className="w-6 h-6 text-blue-700 dark:text-[#FFE500]" />
          <h2 className="text-xl font-bold">Instrucciones de Ejecución Local (Linux Mint / Ubuntu)</h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-900 font-medium dark:text-neutral-200 leading-relaxed">
          Para ejecutar este prototipo localmente en una máquina con Linux Mint, Ubuntu o cualquier distribución derivada de Debian:
        </p>

        <div className="p-4 rounded-2xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto space-y-2 border border-slate-800">
          <p className="text-slate-400"># 1. Asegúrate de tener Node.js (v18 o superior) y npm instalados:</p>
          <p className="text-emerald-400">node -v && npm -v</p>
          <p className="text-slate-400 mt-2"># Si no están instalados en Linux Mint:</p>
          <p className="text-emerald-400">sudo apt update && sudo apt install -y nodejs npm</p>
          <p className="text-slate-400 mt-2"># 2. Clona o descomprime el código en tu carpeta de proyectos y navega allí:</p>
          <p className="text-emerald-400">cd phone-caa-adultos</p>
          <p className="text-slate-400 mt-2"># 3. Instala las dependencias del proyecto:</p>
          <p className="text-emerald-400">npm install</p>
          <p className="text-slate-400 mt-2"># 4. Inicia el servidor de desarrollo completo (Express + Vite en puerto 3000):</p>
          <p className="text-emerald-400">npm run dev</p>
          <p className="text-slate-400 mt-2"># 5. Abre tu navegador (Firefox, Chrome o Chromium) en:</p>
          <p className="text-cyan-300">http://localhost:3000</p>
        </div>
      </section>
    </div>
  );
};
