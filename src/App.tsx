/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { UserSettings, PhraseItem, MessageToken, ContrastMode } from './types';
import { DEFAULT_SETTINGS, DEFAULT_CATEGORIES, INITIAL_PHRASES } from './data/defaultVocab';
import { useSpeech } from './hooks/useSpeech';
import { useScanning, ScannableItem } from './hooks/useScanning';
import { Header } from './components/Header';
import { ScanningBar } from './components/ScanningBar';
import { MessageBar } from './components/MessageBar';
import { BoardGrid } from './components/BoardGrid';
import { SettingsModal } from './components/SettingsModal';
import { VocabularyModal } from './components/VocabularyModal';
import { AboutModal } from './components/AboutModal';
import { WelcomeScreen } from './components/WelcomeScreen';
import { GeminiAssistModal } from './components/GeminiAssistModal';
import { AudioTranscribeModal } from './components/AudioTranscribeModal';

const SETTINGS_STORAGE_KEY = 'phone_caa_settings_v1';
const PHRASES_STORAGE_KEY = 'phone_caa_phrases_v1';

export default function App() {
  // Load settings from localStorage
  const [settings, setSettings] = useState<UserSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch (e) {
      console.warn('Failed to parse settings from localStorage', e);
    }
    return DEFAULT_SETTINGS;
  });

  // Load phrases from localStorage
  const [phrases, setPhrases] = useState<PhraseItem[]>(() => {
    try {
      const saved = localStorage.getItem(PHRASES_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse phrases from localStorage', e);
    }
    return INITIAL_PHRASES;
  });

  // Navigation state
  const [currentTab, setCurrentTab] = useState<'board' | 'settings' | 'vocabulary' | 'about' | 'welcome'>(
    () => (settings.hasSeenWelcome ? 'board' : 'welcome')
  );

  // Active category in board
  const [activeCategoryId, setActiveCategoryId] = useState<string>('basicas');

  // Formed message tokens
  const [tokens, setTokens] = useState<MessageToken[]>([]);

  // Modals state
  const [isGeminiModalOpen, setIsGeminiModalOpen] = useState(false);
  const [isTranscribeModalOpen, setIsTranscribeModalOpen] = useState(false);
  const [openVocabAddDirectly, setOpenVocabAddDirectly] = useState(false);

  // Screen reader announcement message
  const [srAnnouncement, setSrAnnouncement] = useState('');

  // Speech hook
  const {
    speechSupported,
    voices,
    spanishVoices,
    selectedVoice,
    setSelectedVoice,
    isSpeaking,
    voiceEngine,
    setVoiceEngine,
    audioSourceNotice,
    speak,
    stop,
  } = useSpeech();

  // Save settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to save settings to localStorage', e);
    }
  }, [settings]);

  // Save phrases to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(PHRASES_STORAGE_KEY, JSON.stringify(phrases));
    } catch (e) {
      console.warn('Failed to save phrases to localStorage', e);
    }
  }, [phrases]);

  // Apply high-contrast mode class to body element
  useEffect(() => {
    if (settings.contrast === 'high') {
      document.body.classList.add('high-contrast-mode');
    } else {
      document.body.classList.remove('high-contrast-mode');
    }
  }, [settings.contrast]);

  // Update settings handler
  const handleUpdateSettings = useCallback((newPartial: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...newPartial }));
  }, []);

  // Reset settings handler
  const handleResetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  // Reset vocabulary handler
  const handleResetVocabulary = useCallback(() => {
    setPhrases(INITIAL_PHRASES);
  }, []);

  // Toggle contrast mode
  const handleToggleContrast = useCallback(() => {
    setSettings(prev => ({
      ...prev,
      contrast: prev.contrast === 'high' ? 'normal' : 'high',
    }));
  }, []);

  // Message building handlers
  const handleAddPhraseToMessage = useCallback((phrase: PhraseItem) => {
    setTokens(prev => [
      ...prev,
      {
        id: `${phrase.id}-${Date.now()}`,
        phraseId: phrase.id,
        text: phrase.text,
        iconName: phrase.iconName,
      },
    ]);
    setSrAnnouncement(`Agregado al mensaje: ${phrase.text}`);
  }, []);

  const handleRemoveToken = useCallback((index: number) => {
    setTokens(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleRemoveLast = useCallback(() => {
    setTokens(prev => prev.slice(0, -1));
  }, []);

  const handleClearAll = useCallback(() => {
    setTokens([]);
  }, []);

  const handleMoveToken = useCallback((fromIndex: number, toIndex: number) => {
    setTokens(prev => {
      if (toIndex < 0 || toIndex >= prev.length) return prev;
      const updated = [...prev];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return updated;
    });
  }, []);

  // Voice speech triggers
  const handleSpeakSentence = useCallback(
    (textToSpeak: string) => {
      speak(textToSpeak, settings.speechRate, settings.speechVoiceUri);
    },
    [speak, settings.speechRate, settings.speechVoiceUri]
  );

  const handleDirectSpeakPhrase = useCallback(
    (text: string) => {
      speak(text, settings.speechRate, settings.speechVoiceUri);
    },
    [speak, settings.speechRate, settings.speechVoiceUri]
  );

  // Vocabulary handlers
  const handleAddCustomPhrase = useCallback(
    (newPhrase: Omit<PhraseItem, 'id'>) => {
      const phraseWithId: PhraseItem = {
        ...newPhrase,
        id: `custom-${Date.now()}`,
      };
      setPhrases(prev => [phraseWithId, ...prev]);
    },
    []
  );

  const handleDeletePhrase = useCallback((phraseId: string) => {
    setPhrases(prev => prev.filter(p => p.id !== phraseId));
  }, []);

  const handleToggleFavorite = useCallback((phraseId: string) => {
    setPhrases(prev =>
      prev.map(p => (p.id === phraseId ? { ...p, isFavorite: !p.isFavorite } : p))
    );
  }, []);

  const handleSaveFormedAsCustom = useCallback((fullText: string) => {
    const newPhrase: PhraseItem = {
      id: `saved-${Date.now()}`,
      categoryId: 'personalizados',
      text: fullText,
      iconName: 'Bookmark',
      isFavorite: true,
      isCustom: true,
    };
    setPhrases(prev => [newPhrase, ...prev]);
    setActiveCategoryId('personalizados');
  }, []);

  // Gemini assistant confirmation
  const handleConfirmGeminiSuggestion = useCallback((chosenSentence: string) => {
    setTokens([
      {
        id: `gemini-${Date.now()}`,
        text: chosenSentence,
        iconName: 'Sparkles',
      },
    ]);
    setSrAnnouncement(`Frase de Gemini seleccionada: ${chosenSentence}`);
  }, []);

  // Set up scannable items for sequential scanning
  const displayedPhrases = useMemo(() => {
    return phrases.filter(p => p.categoryId === activeCategoryId);
  }, [phrases, activeCategoryId]);

  const scannableItems: ScannableItem[] = useMemo(() => {
    if (currentTab !== 'board' || settings.accessMode !== 'scanning') {
      return [];
    }

    const items: ScannableItem[] = [];

    // 1. Actions in Message Bar
    items.push({
      id: 'scan-btn-transcribe',
      label: 'Dictar o transcribir audio con el micrófono',
      onSelect: () => setIsTranscribeModalOpen(true),
    });

    if (tokens.length > 0) {
      items.push({
        id: 'scan-btn-speak',
        label: `Hablar mensaje: ${tokens.map(t => t.text).join(' ')}`,
        onSelect: () => handleSpeakSentence(tokens.map(t => t.text).join(' ')),
      });
      items.push({
        id: 'scan-btn-gemini',
        label: 'Ayúdame a expresar esto con IA',
        onSelect: () => setIsGeminiModalOpen(true),
      });
      items.push({
        id: 'scan-btn-delete-last',
        label: 'Borrar último elemento',
        onSelect: handleRemoveLast,
      });
      items.push({
        id: 'scan-btn-clear-all',
        label: 'Limpiar todo el mensaje',
        onSelect: handleClearAll,
      });
    }

    // 2. Categories
    DEFAULT_CATEGORIES.forEach(cat => {
      items.push({
        id: `cat-tab-${cat.id}`,
        label: `Categoría ${cat.name}`,
        onSelect: () => setActiveCategoryId(cat.id),
      });
    });

    // 3. Phrases in active category
    displayedPhrases.forEach(phrase => {
      items.push({
        id: `phrase-btn-${phrase.id}`,
        label: `Frase: ${phrase.text}`,
        onSelect: () => handleAddPhraseToMessage(phrase),
      });
    });

    return items;
  }, [
    currentTab,
    settings.accessMode,
    tokens,
    displayedPhrases,
    handleSpeakSentence,
    handleRemoveLast,
    handleClearAll,
    handleAddPhraseToMessage,
  ]);

  // Scanning hook instance
  const scanning = useScanning({
    enabled: settings.accessMode === 'scanning' && currentTab === 'board',
    intervalSec: settings.scanInterval,
    soundFeedback: settings.scanFeedbackSound,
    onAnnounce: setSrAnnouncement,
  });

  // Register items whenever list changes
  useEffect(() => {
    scanning.registerItems(scannableItems);
  }, [scannableItems, scanning.registerItems]);

  const activeCategory = DEFAULT_CATEGORIES.find(c => c.id === activeCategoryId);

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors ${
        settings.contrast === 'high' ? 'bg-black text-white' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Hidden live region for accessibility screen reader announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {srAnnouncement}
      </div>

      {/* Header bar */}
      <Header
        currentTab={currentTab === 'welcome' ? 'board' : currentTab}
        onSelectTab={tab => setCurrentTab(tab)}
        contrast={settings.contrast}
        onToggleContrast={handleToggleContrast}
        accessMode={settings.accessMode}
        isSpeaking={isSpeaking}
        onStopSpeaking={stop}
      />

      {/* Sequential scanning status bar (rendered when scanning mode is enabled) */}
      {settings.accessMode === 'scanning' && currentTab === 'board' && (
        <ScanningBar
          isPaused={scanning.isPaused}
          onTogglePause={scanning.togglePause}
          onStepNext={scanning.stepNext}
          onStepPrev={scanning.stepPrev}
          onSelectCurrent={scanning.selectCurrent}
          onDisableScanning={() => handleUpdateSettings({ accessMode: 'direct' })}
          currentLabel={scanning.items[scanning.currentIndex]?.label}
          intervalSec={settings.scanInterval}
          contrast={settings.contrast}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Welcome Screen view */}
        {currentTab === 'welcome' && (
          <WelcomeScreen
            onStart={() => {
              handleUpdateSettings({ hasSeenWelcome: true });
              setCurrentTab('board');
            }}
            onOpenSettings={() => {
              handleUpdateSettings({ hasSeenWelcome: true });
              setCurrentTab('settings');
            }}
            contrast={settings.contrast}
          />
        )}

        {/* Board View */}
        {currentTab === 'board' && (
          <div className="space-y-6">
            {/* Message Construction Bar */}
            <MessageBar
              tokens={tokens}
              onRemoveToken={handleRemoveToken}
              onRemoveLast={handleRemoveLast}
              onClearAll={handleClearAll}
              onMoveToken={handleMoveToken}
              onSpeak={handleSpeakSentence}
              onStopSpeak={stop}
              isSpeaking={isSpeaking}
              onOpenGeminiAssist={() => setIsGeminiModalOpen(true)}
              onOpenTranscribe={() => setIsTranscribeModalOpen(true)}
              onSaveAsCustomPhrase={handleSaveFormedAsCustom}
              contrast={settings.contrast}
              scannedId={scanning.currentScannedId}
            />

            {/* Communication Grid */}
            <BoardGrid
              categories={DEFAULT_CATEGORIES}
              phrases={phrases}
              activeCategoryId={activeCategoryId}
              onSelectCategory={setActiveCategoryId}
              onAddPhraseToMessage={handleAddPhraseToMessage}
              onDirectSpeakPhrase={handleDirectSpeakPhrase}
              onToggleFavorite={handleToggleFavorite}
              onOpenAddCustomPhrase={() => {
                setOpenVocabAddDirectly(true);
                setCurrentTab('vocabulary');
              }}
              buttonSize={settings.buttonSize}
              textSize={settings.textSize}
              columns={settings.columns}
              contrast={settings.contrast}
              scannedId={scanning.currentScannedId}
            />
          </div>
        )}

        {/* Settings View */}
        {currentTab === 'settings' && (
          <SettingsModal
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onResetSettings={handleResetSettings}
            onClose={() => setCurrentTab('board')}
            availableVoices={spanishVoices.length > 0 ? spanishVoices : voices}
            onTestVoice={(rate, voiceUri) => {
              speak('Hola, esta es una prueba de voz para la aplicación PHONÉ.', rate, voiceUri);
            }}
            voiceEngine={voiceEngine}
            onSelectVoiceEngine={setVoiceEngine}
          />
        )}

        {/* Vocabulary Management View */}
        {currentTab === 'vocabulary' && (
          <VocabularyModal
            categories={DEFAULT_CATEGORIES}
            phrases={phrases}
            onAddPhrase={handleAddCustomPhrase}
            onDeletePhrase={handleDeletePhrase}
            onToggleFavorite={handleToggleFavorite}
            onResetVocabulary={handleResetVocabulary}
            onSpeakPhrase={handleDirectSpeakPhrase}
            contrast={settings.contrast}
            initialAddOpen={openVocabAddDirectly}
          />
        )}

        {/* About Research Prototype View */}
        {currentTab === 'about' && <AboutModal contrast={settings.contrast} />}
      </main>

      {/* Gemini AI Expression Assistant Modal */}
      <GeminiAssistModal
        isOpen={isGeminiModalOpen}
        onClose={() => setIsGeminiModalOpen(false)}
        selectedTokens={tokens.map(t => t.text)}
        activeCategoryTitle={activeCategory?.name}
        onConfirmSuggestion={handleConfirmGeminiSuggestion}
        onPreviewSpeak={text => speak(text, settings.speechRate, settings.speechVoiceUri)}
        contrast={settings.contrast}
      />

      {/* Audio Transcription with Microphone Modal (gemini-3.5-transcribe) */}
      <AudioTranscribeModal
        isOpen={isTranscribeModalOpen}
        onClose={() => setIsTranscribeModalOpen(false)}
        onAddTranscribedText={(text) =>
          handleAddPhraseToMessage({
            id: `transcribed-${Date.now()}`,
            categoryId: 'personalizados',
            text,
            iconName: 'Mic',
          })
        }
        onReplaceMessage={(text) =>
          setTokens([
            {
              id: `transcribed-${Date.now()}`,
              text,
              iconName: 'Mic',
            },
          ])
        }
        onSaveAsCustomPhrase={handleSaveFormedAsCustom}
        onSpeakPreview={handleDirectSpeakPhrase}
        contrast={settings.contrast}
      />

      {/* Footer */}
      <footer
        className={`border-t py-6 text-xs transition-colors ${
          settings.contrast === 'high'
            ? 'bg-black border-[#FFE500] text-neutral-300'
            : 'bg-white border-slate-300 text-slate-900 font-bold'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <span className="font-black text-slate-950 dark:text-white">PHONÉ</span>
            <span className="mx-2">•</span>
            <span className="text-slate-900 dark:text-neutral-200">«Tu voz, a tu manera»</span>
            <span className="mx-2">•</span>
            <span className="text-slate-800 dark:text-neutral-300">Instituto Tecnológico de Morelia</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentTab('about')}
              className="hover:underline font-extrabold text-blue-700 dark:text-[#FFE500]"
            >
              Acerca del prototipo de investigación
            </button>
            <button
              onClick={() => setCurrentTab('welcome')}
              className="hover:underline text-slate-800 dark:text-neutral-300 font-bold"
            >
              Bienvenida
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
