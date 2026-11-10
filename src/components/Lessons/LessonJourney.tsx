import React, { useState } from 'react';
import { LESSONS_DATA } from '../../data/lessonsData';
import { LessonModule, LessonStep } from '../../types';
import { InteractiveFretboard } from '../Fretboard/InteractiveFretboard';
import { InteractiveQuiz } from './InteractiveQuiz';
import { Exercise1234 } from './Exercise1234';
import { RhythmTrainer } from './RhythmTrainer';
import { CHORDS_DATA } from '../../data/chordsData';
import { audioEngine } from '../../services/audioEngine';
import { 
  Sparkles, 
  Palette, 
  Activity, 
  Music, 
  Flame, 
  Zap, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Play
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface LessonJourneyProps {
  onNavigateTab: (tab: string, extra?: string) => void;
  isInvertedView?: boolean;
}

export const LessonJourney: React.FC<LessonJourneyProps> = ({
  onNavigateTab,
  isInvertedView = false,
}) => {
  const [activeModuleIndex, setActiveModuleIndex] = useState<number>(0);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const currentModule: LessonModule = LESSONS_DATA[activeModuleIndex];
  const currentStep: LessonStep = currentModule.steps[activeStepIndex];

  const markStepComplete = (stepId: string) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      next.add(stepId);
      return next;
    });
  };

  const handleNext = () => {
    markStepComplete(currentStep.id);

    if (activeStepIndex < currentModule.steps.length - 1) {
      setActiveStepIndex((i) => i + 1);
    } else if (activeModuleIndex < LESSONS_DATA.length - 1) {
      setActiveModuleIndex((i) => i + 1);
      setActiveStepIndex(0);
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handlePrev = () => {
    if (activeStepIndex > 0) {
      setActiveStepIndex((i) => i - 1);
    } else if (activeModuleIndex > 0) {
      const prevModule = LESSONS_DATA[activeModuleIndex - 1];
      setActiveModuleIndex((i) => i - 1);
      setActiveStepIndex(prevModule.steps.length - 1);
    }
  };

  // Get icon component dynamically
  const getModuleIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles': return Sparkles;
      case 'Palette': return Palette;
      case 'Activity': return Activity;
      case 'Music': return Music;
      case 'Flame': return Flame;
      case 'Zap': return Zap;
      default: return Sparkles;
    }
  };

  // Progress percentage
  const totalStepsCount = LESSONS_DATA.reduce((acc, m) => acc + m.steps.length, 0);
  const progressPercent = Math.round((completedSteps.size / totalStepsCount) * 100);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Top Welcome & Progress Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Aprenda no Seu Ritmo — Método Visual</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Trilha Guiada: Do Zero ao Seu Primeiro Riff
            </h1>
            <p className="text-slate-400 text-sm max-w-xl">
              Esqueça partituras complexas e teoria maçante. Aqui você aprende visualmente, com áudio imediato e passos práticos testados.
            </p>
          </div>

          {/* Progress Card */}
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 flex items-center gap-4 min-w-[240px]">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center font-mono font-black text-rose-400 text-lg">
              {progressPercent}%
            </div>
            <div>
              <div className="text-xs font-bold text-white">Seu Progresso Geral</div>
              <div className="text-[11px] text-slate-400">
                {completedSteps.size} de {totalStepsCount} etapas concluídas
              </div>
              <div className="w-28 h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-rose-500 to-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modules Navigation Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mt-6 pt-6 border-t border-slate-800/80">
          {LESSONS_DATA.map((module, mIdx) => {
            const Icon = getModuleIcon(module.iconName);
            const isCurrent = activeModuleIndex === mIdx;
            const isAllCompleted = module.steps.every(s => completedSteps.has(s.id));

            return (
              <button
                key={module.id}
                onClick={() => {
                  setActiveModuleIndex(mIdx);
                  setActiveStepIndex(0);
                }}
                className={`p-3 rounded-2xl border text-left transition-all relative ${
                  isCurrent
                    ? 'bg-slate-800 border-rose-500 shadow-md shadow-rose-500/15 scale-102 ring-2 ring-rose-500/20'
                    : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700'
                }`}
              >
                {isAllCompleted && (
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 absolute top-2 right-2" />
                )}
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center mb-1.5 ${
                  isCurrent ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-white line-clamp-1">{module.title}</div>
                <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{module.steps.length} etapas</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Step Content & Interactive Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        
        {/* Step Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                {currentStep.badge}
              </span>
              <span className="text-xs text-slate-500">
                Passo {activeStepIndex + 1} de {currentModule.steps.length} do Módulo {activeModuleIndex + 1}
              </span>
            </div>
            <h2 className="text-2xl font-black text-white mt-1.5">{currentStep.title}</h2>
            <p className="text-sm text-slate-400 mt-0.5">{currentStep.subtitle}</p>
          </div>

          {/* Quick Prev / Next Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={activeModuleIndex === 0 && activeStepIndex === 0}
              className="p-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-white text-xs font-semibold flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Anterior</span>
            </button>
            <button
              onClick={handleNext}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-rose-600/25"
            >
              <span>{activeStepIndex === currentModule.steps.length - 1 && activeModuleIndex === LESSONS_DATA.length - 1 ? 'Concluir Curso' : 'Próxima Etapa'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Step Explanation Text formatted cleanly */}
        <div className="text-slate-300 text-sm leading-relaxed space-y-3 prose prose-invert max-w-none">
          {currentStep.content.split('\n\n').map((paragraph, idx) => {
            if (paragraph.trim().startsWith('###')) {
              return <h3 key={idx} className="text-lg font-bold text-white pt-2">{paragraph.replace('###', '').trim()}</h3>;
            }
            if (paragraph.trim().startsWith('>')) {
              return (
                <div key={idx} className="p-3.5 rounded-xl bg-amber-500/10 border-l-4 border-amber-400 text-amber-200 text-xs">
                  {paragraph.replace('>', '').trim()}
                </div>
              );
            }
            return <p key={idx} className="text-slate-300">{paragraph}</p>;
          })}
        </div>

        {/* Dynamic Interactive Widget depending on step type */}
        <div className="pt-4">
          {currentStep.interactiveType === 'quiz' && currentStep.quiz && (
            <InteractiveQuiz
              question={currentStep.quiz.question}
              options={currentStep.quiz.options}
              correctIndex={currentStep.quiz.correctIndex}
              explanation={currentStep.quiz.explanation}
              onComplete={() => markStepComplete(currentStep.id)}
            />
          )}

          {currentStep.interactiveType === 'play_note' && currentStep.fretboardState && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 font-medium">
                🎯 {currentStep.fretboardState.instruction}
              </div>
              <InteractiveFretboard
                markers={currentStep.fretboardState.activeFrets}
                totalFrets={5}
                isInverted={isInvertedView}
                interactive={true}
              />
            </div>
          )}

          {currentStep.interactiveType === 'exercise_1234' && (
            <Exercise1234 />
          )}

          {currentStep.interactiveType === 'rhythm' && (
            <RhythmTrainer />
          )}

          {currentStep.interactiveType === 'chord_practice' && currentStep.practiceChord && (
            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 space-y-4">
              {(() => {
                const chord = CHORDS_DATA.find(c => c.id === currentStep.practiceChord) || CHORDS_DATA[0];
                const markers = chord.frets.map((fret, i) => {
                  const str = 6 - i;
                  return fret > 0 ? { string: str, fret, finger: chord.fingers[i], label: `D${chord.fingers[i]}` } : null;
                }).filter(Boolean);

                return (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-black text-white">{chord.name}</span>
                        <span className="text-xs text-slate-400">({chord.fullName})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => audioEngine.strumChord(chord.frets, 'down')}
                          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
                        >
                          <Play className="w-3.5 h-3.5 fill-white" />
                          <span>Tocar Batida</span>
                        </button>
                        <button
                          onClick={() => onNavigateTab('chords', chord.id)}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                        >
                          Abrir no Treinador
                        </button>
                      </div>
                    </div>

                    <InteractiveFretboard
                      markers={markers as any}
                      totalFrets={5}
                      isInverted={isInvertedView}
                      interactive={true}
                    />
                  </div>
                );
              })()}
            </div>
          )}

          {/* Quick link to Riff Flow if on module 6 */}
          {currentModule.id === 'first-riff' && (
            <div className="bg-gradient-to-r from-rose-950/40 to-slate-950 p-5 rounded-2xl border border-rose-900/40 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-base font-bold text-white">Pronto para tocar de verdade?</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Abra a aba Riff Flow para ver as notas correndo em tempo real estilo Rocksmith!
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('riffs')}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 hover:scale-105 transition-all whitespace-nowrap"
              >
                Abrir Riff Flow ⚡
              </button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

