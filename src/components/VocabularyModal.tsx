import React, { useState } from 'react';
import { PhraseItem, Category, ContrastMode } from '../types';
import { IconRenderer } from './IconRenderer';
import { Bookmark, Plus, Trash2, Star, RotateCcw, Volume2, Check, AlertTriangle } from 'lucide-react';

interface VocabularyModalProps {
  categories: Category[];
  phrases: PhraseItem[];
  onAddPhrase: (phrase: Omit<PhraseItem, 'id'>) => void;
  onDeletePhrase: (phraseId: string) => void;
  onToggleFavorite: (phraseId: string) => void;
  onResetVocabulary: () => void;
  onSpeakPhrase: (text: string) => void;
  contrast: ContrastMode;
  initialAddOpen?: boolean;
}

const AVAILABLE_ICONS = [
  'MessageSquare',
  'Smile',
  'Frown',
  'Droplets',
  'Bath',
  'Utensils',
  'Bed',
  'Activity',
  'HeartHandshake',
  'ThumbsUp',
  'ThumbsDown',
  'Clock',
  'HelpCircle',
  'Music',
  'BookOpen',
  'Laptop',
  'Mail',
  'Users',
  'User',
  'Shield',
  'Sparkles',
  'AlertCircle',
  'CheckCircle2',
];

export const VocabularyModal: React.FC<VocabularyModalProps> = ({
  categories,
  phrases,
  onAddPhrase,
  onDeletePhrase,
  onToggleFavorite,
  onResetVocabulary,
  onSpeakPhrase,
  contrast,
  initialAddOpen = false,
}) => {
  const [isAdding, setIsAdding] = useState(initialAddOpen);
  const [newText, setNewText] = useState('');
  const [selectedCat, setSelectedCat] = useState('personalizados');
  const [selectedIcon, setSelectedIcon] = useState('MessageSquare');
  const [filterCat, setFilterCat] = useState<string>('all');
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const isHighContrast = contrast === 'high';

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;

    onAddPhrase({
      categoryId: selectedCat,
      text: newText.trim(),
      iconName: selectedIcon,
      isFavorite: false,
      isCustom: true,
    });

    setNewText('');
    setIsAdding(false);
  };

  const filteredPhrases = phrases.filter(p => {
    if (filterCat === 'all') return true;
    if (filterCat === 'favorites') return p.isFavorite;
    return p.categoryId === filterCat;
  });

  return (
    <div
      className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6"
      role="region"
      aria-label="Administración de Vocabulario y Frases"
    >
      {/* Header bar */}
      <div
        className={`p-6 rounded-3xl border transition-colors ${
          isHighContrast
            ? 'bg-neutral-950 border-[#FFE500] text-white'
            : 'bg-white border-slate-200 text-slate-900 shadow-xs'
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
              <Bookmark className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white">Vocabulario y Frases</h1>
              <p className="text-sm text-slate-900 font-semibold dark:text-neutral-300">
                Agrega nuevas expresiones, organiza tus favoritas y gestiona el repertorio de PHONÉ.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAdding(prev => !prev)}
              className={`px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-sm transition-all ${
                isHighContrast
                  ? 'bg-[#FFE500] text-black hover:bg-yellow-400'
                  : 'bg-[#1F5AC4] text-white hover:bg-blue-700'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>{isAdding ? 'Cerrar formulario' : 'Nueva frase'}</span>
            </button>

            <button
              onClick={() => setShowConfirmReset(true)}
              className={`p-2.5 rounded-xl border text-slate-800 hover:text-red-700 transition-colors ${
                isHighContrast ? 'border-neutral-700 text-neutral-300' : 'border-slate-300 hover:bg-red-50'
              }`}
              title="Restaurar vocabulario inicial predeterminado"
              aria-label="Restaurar vocabulario inicial"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Add New Phrase Form Card */}
      {isAdding && (
        <form
          onSubmit={handleCreate}
          className={`p-6 rounded-3xl border transition-colors space-y-4 animate-in fade-in ${
            isHighContrast
              ? 'bg-neutral-900 border-[#00E5FF] text-white'
              : 'bg-blue-50/60 border-blue-200 text-slate-900 shadow-xs'
          }`}
        >
          <h2 className="text-lg font-bold text-blue-950 dark:text-[#FFE500]">
            Crear Frase Personalizada
          </h2>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider block">
              Texto de la frase o mensaje
            </label>
            <input
              type="text"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="Ejemplo: Por favor, enciende la lámpara"
              required
              className={`w-full px-4 py-3 rounded-xl border text-base font-semibold focus:outline-none focus:ring-3 focus:ring-blue-500 ${
                isHighContrast
                  ? 'bg-black border-[#FFE500] text-white'
                  : 'bg-white border-slate-300 text-slate-900'
              }`}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider block">Categoría</label>
              <select
                value={selectedCat}
                onChange={(e) => setSelectedCat(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border text-sm font-semibold focus:outline-none ${
                  isHighContrast
                    ? 'bg-black border-neutral-700 text-white'
                    : 'bg-white border-slate-300 text-slate-900'
                }`}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Icon selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider block">
                Símbolo / Icono Asociado
              </label>
              <div className="flex flex-wrap items-center gap-1.5 max-h-28 overflow-y-auto p-2 rounded-xl border bg-white dark:bg-black border-slate-200 dark:border-neutral-800">
                {AVAILABLE_ICONS.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setSelectedIcon(icon)}
                    className={`p-2 rounded-lg transition-all ${
                      selectedIcon === icon
                        ? isHighContrast
                          ? 'bg-[#FFE500] text-black ring-2 ring-[#FFE500]'
                          : 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-800'
                    }`}
                    title={icon}
                  >
                    <IconRenderer name={icon} className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-xl text-sm font-semibold border border-slate-300 dark:border-neutral-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 ${
                isHighContrast
                  ? 'bg-[#FFE500] text-black hover:bg-yellow-400'
                  : 'bg-[#1F5AC4] text-white hover:bg-blue-700'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>Guardar Frase</span>
            </button>
          </div>
        </form>
      )}

      {/* Filter tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        <button
          onClick={() => setFilterCat('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
            filterCat === 'all'
              ? isHighContrast
                ? 'bg-[#FFE500] text-black'
                : 'bg-slate-900 text-white'
              : 'bg-slate-100 dark:bg-neutral-800 text-slate-900 dark:text-neutral-200 border border-slate-300'
          }`}
        >
          Todas ({phrases.length})
        </button>
        <button
          onClick={() => setFilterCat('favorites')}
          className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 transition-all ${
            filterCat === 'favorites'
              ? isHighContrast
                ? 'bg-[#FFE500] text-black'
                : 'bg-amber-600 text-white'
              : 'bg-slate-100 dark:bg-neutral-800 text-slate-900 dark:text-neutral-200 border border-slate-300'
          }`}
        >
          <Star className="w-3.5 h-3.5 fill-current" />
          <span>Favoritas ({phrases.filter(p => p.isFavorite).length})</span>
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setFilterCat(c.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all ${
              filterCat === c.id
                ? isHighContrast
                  ? 'bg-[#FFE500] text-black'
                  : 'bg-blue-700 text-white'
                : 'bg-slate-100 dark:bg-neutral-800 text-slate-900 dark:text-neutral-200 border border-slate-300'
            }`}
          >
            {c.name} ({phrases.filter(p => p.categoryId === c.id).length})
          </button>
        ))}
      </div>

      {/* Phrases List Table / Grid */}
      <div
        className={`rounded-3xl border overflow-hidden transition-colors ${
          isHighContrast
            ? 'bg-neutral-950 border-[#FFE500]'
            : 'bg-white border-slate-200 shadow-xs'
        }`}
      >
        <div className="divide-y divide-slate-100 dark:divide-neutral-800">
          {filteredPhrases.length === 0 ? (
            <div className="p-8 text-center text-sm font-bold text-slate-900 dark:text-neutral-300">
              No hay frases para mostrar en este filtro.
            </div>
          ) : (
            filteredPhrases.map((phrase) => {
              const cat = categories.find(c => c.id === phrase.categoryId);
              return (
                <div
                  key={phrase.id}
                  className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-neutral-900 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-2.5 rounded-xl shrink-0 ${
                        isHighContrast
                          ? 'bg-neutral-900 text-[#FFE500]'
                          : 'bg-blue-50 text-blue-700'
                      }`}
                    >
                      <IconRenderer name={phrase.iconName} className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-base font-bold text-slate-950 dark:text-white truncate">
                        {phrase.text}
                      </p>
                      <span className="text-xs font-semibold text-slate-800 dark:text-neutral-300">
                        {cat?.name || 'General'} {phrase.isCustom ? '• Creada por ti' : ''}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Speak phrase */}
                    <button
                      onClick={() => onSpeakPhrase(phrase.text)}
                      className="p-2 rounded-lg text-slate-800 hover:text-blue-700 hover:bg-blue-100 transition-colors"
                      title="Escuchar frase"
                      aria-label={`Escuchar: ${phrase.text}`}
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>

                    {/* Toggle Favorite */}
                    <button
                      onClick={() => onToggleFavorite(phrase.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        phrase.isFavorite
                          ? 'text-amber-500'
                          : 'text-slate-400 hover:text-amber-500'
                      }`}
                      title={phrase.isFavorite ? 'Quitar favorita' : 'Marcar favorita'}
                      aria-label={`${phrase.isFavorite ? 'Quitar' : 'Marcar'} favorita: ${phrase.text}`}
                    >
                      <Star className={`w-4 h-4 ${phrase.isFavorite ? 'fill-current' : ''}`} />
                    </button>

                    {/* Delete button (available for custom phrases or user edits) */}
                    {phrase.isCustom && (
                      <button
                        onClick={() => onDeletePhrase(phrase.id)}
                        className="p-2 rounded-lg text-red-700 hover:text-red-800 hover:bg-red-50 transition-colors"
                        title="Eliminar frase personalizada"
                        aria-label={`Eliminar: ${phrase.text}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Confirmation Modal for Reset */}
      {showConfirmReset && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
          role="alertdialog"
          aria-labelledby="confirm-reset-vocab-title"
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
              <h3 id="confirm-reset-vocab-title" className="text-lg font-bold">
                ¿Restablecer vocabulario inicial?
              </h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-neutral-300 leading-relaxed">
              Esta acción devolverá las frases y categorías a sus valores por defecto en español mexicano.
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
                  onResetVocabulary();
                  setShowConfirmReset(false);
                }}
                className="px-4 py-2 rounded-xl text-sm font-bold bg-red-600 hover:bg-red-700 text-white"
              >
                Sí, restablecer vocabulario
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
