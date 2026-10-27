import React, { useState } from 'react';
import { Category, PhraseItem, ButtonSize, TextSize, ContrastMode } from '../types';
import { IconRenderer } from './IconRenderer';
import { Volume2, Star, PlusCircle } from 'lucide-react';

interface BoardGridProps {
  categories: Category[];
  phrases: PhraseItem[];
  activeCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
  onAddPhraseToMessage: (phrase: PhraseItem) => void;
  onDirectSpeakPhrase: (text: string) => void;
  onToggleFavorite: (phraseId: string) => void;
  onOpenAddCustomPhrase: () => void;
  buttonSize: ButtonSize;
  textSize: TextSize;
  columns: number;
  contrast: ContrastMode;
  scannedId?: string | null;
}

export const BoardGrid: React.FC<BoardGridProps> = ({
  categories,
  phrases,
  activeCategoryId,
  onSelectCategory,
  onAddPhraseToMessage,
  onDirectSpeakPhrase,
  onToggleFavorite,
  onOpenAddCustomPhrase,
  buttonSize,
  textSize,
  columns,
  contrast,
  scannedId,
}) => {
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const isHighContrast = contrast === 'high';

  // Filter phrases
  const activeCategory = categories.find(c => c.id === activeCategoryId);
  const displayedPhrases = phrases.filter(p => {
    if (showOnlyFavorites) return p.isFavorite;
    return p.categoryId === activeCategoryId;
  });

  // Size styling classes
  const buttonPaddingClass = {
    normal: 'p-3 min-h-[90px]',
    large: 'p-4 min-h-[110px]',
    xl: 'p-5 sm:p-6 min-h-[135px]',
  }[buttonSize];

  const iconSizeClass = {
    normal: 'w-7 h-7',
    large: 'w-9 h-9',
    xl: 'w-11 h-11',
  }[buttonSize];

  const textTypographyClass = {
    normal: 'text-sm font-semibold',
    large: 'text-base sm:text-lg font-bold',
    xl: 'text-lg sm:text-xl font-extrabold',
  }[textSize];

  // Grid layout class based on settings.columns
  const gridColumnsClass = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5',
    6: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6',
  }[columns] || 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4';

  return (
    <div className="space-y-4">
      {/* Category selector row */}
      <section
        aria-label="Selector de categorías de comunicación"
        className="overflow-x-auto pb-1 scrollbar-thin"
      >
        <div className="flex items-center gap-2 min-w-max p-1">
          {/* Quick Favorites tab */}
          <button
            id="cat-tab-favorites"
            onClick={() => setShowOnlyFavorites(prev => !prev)}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all border ${
              scannedId === 'cat-tab-favorites' ? 'scanning-highlight' : ''
            } ${
              showOnlyFavorites
                ? isHighContrast
                  ? 'bg-[#FFE500] text-black border-[#FFE500]'
                  : 'bg-amber-500 text-white border-amber-600 shadow-sm'
                : isHighContrast
                ? 'bg-neutral-900 border-neutral-700 text-amber-300 hover:bg-neutral-800'
                : 'bg-white border-slate-300 text-slate-900 font-bold hover:bg-amber-50 hover:text-amber-950 shadow-2xs'
            }`}
            aria-pressed={showOnlyFavorites}
          >
            <Star
              className={`w-4 h-4 ${
                showOnlyFavorites ? 'fill-current' : 'text-amber-500'
              }`}
            />
            <span>Favoritas</span>
          </button>

          {/* Standard categories */}
          {categories.map(cat => {
            const isSelected = !showOnlyFavorites && activeCategoryId === cat.id;
            const catId = `cat-tab-${cat.id}`;
            return (
              <button
                key={cat.id}
                id={catId}
                onClick={() => {
                  setShowOnlyFavorites(false);
                  onSelectCategory(cat.id);
                }}
                className={`px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2.5 transition-all border ${
                  scannedId === catId ? 'scanning-highlight' : ''
                } ${
                  isSelected
                    ? isHighContrast
                      ? 'bg-[#FFE500] text-black border-[#FFE500]'
                      : 'bg-[#1F5AC4] text-white border-[#1F5AC4] shadow-sm'
                    : isHighContrast
                    ? 'bg-neutral-900 border-neutral-700 text-white hover:bg-neutral-800'
                    : 'bg-white border-slate-300 text-slate-900 font-bold hover:bg-slate-100 hover:text-blue-950 shadow-2xs'
                }`}
                aria-current={isSelected ? 'true' : undefined}
              >
                <IconRenderer
                  name={cat.iconName}
                  className={`w-4 h-4 ${
                    isSelected
                      ? 'text-white dark:text-black'
                      : 'text-blue-600 dark:text-[#FFE500]'
                  }`}
                />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Category active information banner */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <h2
            className={`text-lg font-black tracking-tight ${
              isHighContrast ? 'text-[#FFE500]' : 'text-slate-950'
            }`}
          >
            {showOnlyFavorites
              ? 'Tus Frases Favoritas'
              : activeCategory?.name || 'Tablero'}
          </h2>
          <span className="text-xs text-slate-900 dark:text-neutral-200 font-black">
            ({displayedPhrases.length} disponibles)
          </span>
        </div>

        {/* Action to add a custom phrase if in personal category */}
        {activeCategoryId === 'personalizados' && !showOnlyFavorites && (
          <button
            onClick={onOpenAddCustomPhrase}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
              isHighContrast
                ? 'bg-neutral-900 border-[#00E5FF] text-[#00E5FF]'
                : 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Nueva Frase</span>
          </button>
        )}
      </div>

      {/* Phrases Grid */}
      <section
        aria-label="Frases disponibles para selección"
        className={`grid ${gridColumnsClass} gap-3 sm:gap-4`}
      >
        {displayedPhrases.length === 0 ? (
          <div
            className={`col-span-full py-12 px-4 text-center rounded-2xl border ${
              isHighContrast
                ? 'bg-neutral-900 border-neutral-700 text-neutral-200'
                : 'bg-white border-slate-300 text-slate-900 font-bold'
            }`}
          >
            <p className="text-base font-extrabold mb-2 text-slate-950 dark:text-white">
              {showOnlyFavorites
                ? 'Aún no has marcado frases como favoritas.'
                : 'No hay frases en esta categoría.'}
            </p>
            <p className="text-sm font-semibold text-slate-800 dark:text-neutral-300">
              {showOnlyFavorites
                ? 'Haz clic en la estrella de cualquier frase para agregarla a tus favoritas de acceso rápido.'
                : 'Puedes agregar tus propias frases personalizadas desde el botón superior o desde Vocabulario.'}
            </p>
          </div>
        ) : (
          displayedPhrases.map(phrase => {
            const phraseScanId = `phrase-btn-${phrase.id}`;
            const isScanned = scannedId === phraseScanId;

            return (
              <div
                key={phrase.id}
                id={phraseScanId}
                className={`relative group rounded-2xl border transition-all flex flex-col justify-between select-none ${buttonPaddingClass} ${
                  isScanned ? 'scanning-highlight' : ''
                } ${
                  isHighContrast
                    ? 'bg-neutral-900 border-neutral-700 text-white hover:border-[#FFE500]'
                    : 'bg-white border-slate-300 text-slate-950 hover:border-blue-500 hover:shadow-md'
                }`}
              >
                {/* Top card utility buttons: Quick Speak & Favorite */}
                <div className="flex items-center justify-between w-full mb-2">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      onDirectSpeakPhrase(phrase.text);
                    }}
                    className={`p-1.5 rounded-lg transition-colors ${
                      isHighContrast
                        ? 'text-[#00E5FF] hover:bg-neutral-800'
                        : 'text-blue-700 hover:text-blue-900 hover:bg-blue-100'
                    }`}
                    title="Escuchar esta frase inmediatamente"
                    aria-label={`Escuchar inmediatamente: ${phrase.text}`}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={e => {
                      e.stopPropagation();
                      onToggleFavorite(phrase.id);
                    }}
                    className={`p-1.5 rounded-lg transition-colors ${
                      phrase.isFavorite
                        ? 'text-amber-500 fill-amber-500'
                        : isHighContrast
                        ? 'text-neutral-500 hover:text-amber-400'
                        : 'text-slate-400 hover:text-amber-500'
                    }`}
                    title={
                      phrase.isFavorite
                        ? 'Quitar de favoritas'
                        : 'Marcar como favorita'
                    }
                    aria-label={`${
                      phrase.isFavorite ? 'Quitar de' : 'Agregar a'
                    } favoritas: ${phrase.text}`}
                  >
                    <Star
                      className={`w-4 h-4 ${
                        phrase.isFavorite ? 'fill-current' : ''
                      }`}
                    />
                  </button>
                </div>

                {/* Primary Card Target: Clicking adds to formed message */}
                <button
                  onClick={() => onAddPhraseToMessage(phrase)}
                  className="flex-1 w-full text-left flex flex-col items-center justify-center text-center focus:outline-none py-1"
                  aria-label={`Agregar al mensaje: ${phrase.text}`}
                >
                  <div
                    className={`mb-2.5 p-2 rounded-xl transition-transform group-hover:scale-105 ${
                      isHighContrast
                        ? 'bg-black text-[#FFE500]'
                        : 'bg-blue-50 text-[#1F5AC4]'
                    }`}
                  >
                    <IconRenderer
                      name={phrase.iconName}
                      className={iconSizeClass}
                    />
                  </div>
                  <span
                    className={`leading-snug tracking-tight ${textTypographyClass} ${
                      isHighContrast ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {phrase.text}
                  </span>
                </button>
              </div>
            );
          })
        )}
      </section>
    </div>
  );
};
