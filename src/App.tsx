import React, { useState } from 'react';
import { InstrumentType } from './types';
import { Navbar } from './components/Navbar';
import { LessonJourney } from './components/Lessons/LessonJourney';
import { FretboardExplorer } from './components/Fretboard/FretboardExplorer';
import { ChordTrainer } from './components/Chords/ChordTrainer';
import { RiffFlowPlayer } from './components/RiffFlow/RiffFlowPlayer';
import { InteractiveTuner } from './components/Tuner/InteractiveTuner';
import { AcousticVsElectric } from './components/InstrumentGuide/AcousticVsElectric';
import { MetronomeWidget } from './components/Metronome/MetronomeWidget';
import { Guitar, Sparkles, Heart } from 'lucide-react';

export function App() {
  const [currentTab, setCurrentTab] = useState<string>('lessons');
  const [instrument, setInstrument] = useState<InstrumentType>('acoustic');
  const [isInvertedView, setIsInvertedView] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.85);
  const [targetChordId, setTargetChordId] = useState<string>('em');

  const handleNavigateTab = (tab: string, extra?: string) => {
    if (tab === 'chords' && extra) {
      setTargetChordId(extra);
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080C14] text-slate-100 selection:bg-rose-500 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        instrument={instrument}
        onChangeInstrument={setInstrument}
        isInvertedView={isInvertedView}
        onToggleInvertView={() => setIsInvertedView(!isInvertedView)}
        volume={volume}
        onChangeVolume={setVolume}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {currentTab === 'lessons' && (
          <LessonJourney
            onNavigateTab={handleNavigateTab}
            isInvertedView={isInvertedView}
          />
        )}

        {currentTab === 'fretboard' && (
          <FretboardExplorer isInvertedView={isInvertedView} />
        )}

        {currentTab === 'chords' && (
          <ChordTrainer
            initialChordId={targetChordId}
            isInvertedView={isInvertedView}
          />
        )}

        {currentTab === 'riffs' && (
          <RiffFlowPlayer isInvertedView={isInvertedView} />
        )}

        {currentTab === 'tuner' && (
          <InteractiveTuner />
        )}

        {currentTab === 'guide' && (
          <AcousticVsElectric />
        )}
      </main>

      {/* Floating Bottom Metronome Bar */}
      <div className="sticky bottom-0 z-40 bg-[#0B0F17]/90 backdrop-blur-md border-t border-slate-800/80 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="w-full max-w-2xl mx-auto">
            <MetronomeWidget />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto space-y-2">
          <div className="flex items-center justify-center gap-2 text-slate-400">
            <span>FretFlow — Inspirado na intuitividade visual do Rocksmith</span>
            <span>•</span>
            <span>Para Violão e Guitarra</span>
          </div>
          <p className="text-slate-600">
            Desenvolvido para transformar o aprendizado de cordas em algo visual, divertido e imediato.
          </p>
        </div>
      </footer>

    </div>
  );
}

export default App;

