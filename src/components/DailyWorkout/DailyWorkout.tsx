import React, { useState, useEffect, useRef } from 'react';
import { audioEngine } from '../../services/audioEngine';
import { Exercise1234 } from '../Lessons/Exercise1234';
import { RhythmTrainer } from '../Lessons/RhythmTrainer';
import { ChordTrainer } from '../Chords/ChordTrainer';
import { RiffFlowPlayer } from '../RiffFlow/RiffFlowPlayer';
import { 
  Flame, 
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  Trophy,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface WorkoutStep {
  id: string;
  title: string;
  category: string;
  durationSeconds: number; // e.g. 180s = 3 min
  description: string;
  tip: string;
}

const WORKOUT_STEPS: WorkoutStep[] = [
  {
    id: 'spider',
    title: '1. Aquecimento da Aranha (1-2-3-4)',
    category: 'Independência dos Dedos',
    durationSeconds: 180, // 3 min
    description: 'Aqueça as articulações da mão esquerda tocando as casas 1, 2, 3 e 4 com os 4 dedos.',
    tip: 'Não force a velocidade. Mantenha os dedos arqueados e bem próximos dos trastes de metal.'
  },
  {
    id: 'chords',
    title: '2. Troca Rápida de Acordes (Em ➔ G)',
    category: 'Memória Muscular',
    durationSeconds: 240, // 4 min
    description: 'Treine a transição entre seus acordes sem parar a contagem mental.',
    tip: 'Tente manter o dedo 1 como guia deslizante ao invés de soltar a mão inteira no ar.'
  },
  {
    id: 'rhythm',
    title: '3. O Pêndulo de Ritmo (↓ ↑)',
    category: 'Coordenação Rítmica',
    durationSeconds: 240, // 4 min
    description: 'Sincronize a mão direita com o metrônomo no padrão Pop/Rock clássico.',
    tip: 'O braço direito nunca para de balançar, mesmo nos tempos de palhetada fantasma.'
  },
  {
    id: 'riff',
    title: '4. Riff Flow: Smoke on the Water',
    category: 'Diversão & Performance',
    durationSeconds: 240, // 4 min
    description: 'Coloque tudo em prática tocando as notas no tempo na pista do Riff Flow!',
    tip: 'Se errar uma nota, continue sem hesitar. No Rocksmith o show não para!'
  }
];

export const DailyWorkout: React.FC<{ isInvertedView?: boolean }> = ({ isInvertedView = false }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(WORKOUT_STEPS[0].durationSeconds);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isWorkoutCompleted, setIsWorkoutCompleted] = useState<boolean>(false);

  const timerRef = useRef<any>(null);
  const currentStep = WORKOUT_STEPS[currentStepIndex];

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetCurrentStepTimer = () => {
    setIsRunning(false);
    setTimeRemaining(currentStep.durationSeconds);
  };

  const nextStep = () => {
    setIsRunning(false);
    if (currentStepIndex < WORKOUT_STEPS.length - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      setTimeRemaining(WORKOUT_STEPS[nextIdx].durationSeconds);
    } else {
      setIsWorkoutCompleted(true);
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
    }
  };

  useEffect(() => {
    if (!isRunning) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          audioEngine.playClick(true);
          nextStep();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, currentStepIndex]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950/40 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
              <Flame className="w-3.5 h-3.5" />
              <span>Rotina Guiada do Rocksmith</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Treino Diário de 15 Minutos
            </h1>
            <p className="text-slate-400 text-sm max-w-xl">
              15 minutos focados por dia constroem calos e memória muscular 10x mais rápido do que 2 horas perdidas no fim de semana. Dê o play e deixe a rotina guiar você!
            </p>
          </div>

          {/* Big Timer Dial */}
          <div className="bg-slate-950/90 p-5 rounded-2xl border border-slate-800 flex items-center gap-5 min-w-[260px]">
            <div className="space-y-1">
              <div className="text-[10px] uppercase font-bold text-slate-400">Tempo Deste Bloco</div>
              <div className="text-3xl font-black font-mono text-amber-400">
                {formatTime(timeRemaining)}
              </div>
              <div className="text-[11px] text-slate-500">
                Etapa {currentStepIndex + 1} de {WORKOUT_STEPS.length}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={toggleTimer}
                className={`p-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-lg ${
                  isRunning
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                    : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                }`}
              >
                {isRunning ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                <span>{isRunning ? 'Pausar' : 'Iniciar'}</span>
              </button>

              <button
                onClick={nextStep}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold flex items-center justify-center gap-1"
              >
                <span>Pular</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Workout 4 Steps Roadmap */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          {WORKOUT_STEPS.map((step, idx) => {
            const isCurrent = currentStepIndex === idx;
            const isDone = currentStepIndex > idx || isWorkoutCompleted;

            return (
              <button
                key={step.id}
                onClick={() => {
                  setCurrentStepIndex(idx);
                  setTimeRemaining(step.durationSeconds);
                  setIsRunning(false);
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all relative ${
                  isCurrent
                    ? 'bg-slate-800 border-rose-500 shadow-md shadow-rose-500/15 ring-2 ring-rose-500/20'
                    : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/50'
                }`}
              >
                {isDone && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 absolute top-3 right-3" />
                )}
                <div className="text-[10px] uppercase font-bold text-slate-400">{step.category}</div>
                <div className="text-sm font-bold text-white mt-0.5 truncate">{step.title}</div>
                <div className="text-xs text-amber-400 font-mono mt-1">{step.durationSeconds / 60} minutos</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Step Arena */}
      {!isWorkoutCompleted ? (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">{currentStep.category}</span>
                <h2 className="text-2xl font-black text-white">{currentStep.title}</h2>
                <p className="text-sm text-slate-400">{currentStep.description}</p>
              </div>

              <div className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3.5 py-2 rounded-xl max-w-sm">
                💡 <span className="font-semibold">Dica de Ouro:</span> {currentStep.tip}
              </div>
            </div>

            {/* Embedded Active Widget */}
            <div className="pt-2">
              {currentStep.id === 'spider' && <Exercise1234 />}
              {currentStep.id === 'chords' && <ChordTrainer isInvertedView={isInvertedView} />}
              {currentStep.id === 'rhythm' && <RhythmTrainer />}
              {currentStep.id === 'riff' && <RiffFlowPlayer isInvertedView={isInvertedView} />}
            </div>
          </div>
        </div>
      ) : (
        /* Workout Complete Celebration Screen */
        <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
            <Trophy className="w-10 h-10 animate-bounce" />
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-black text-white">Treino de Hoje Concluído com Sucesso! 🎉</h2>
            <p className="text-slate-300 text-sm max-w-lg mx-auto">
              Você dedicou 15 minutos de prática real e deliberada. Seus dedos já estão mais fortes, e a memória muscular dos acordes foi consolidada para amanhã!
            </p>
          </div>

          <button
            onClick={() => {
              setCurrentStepIndex(0);
              setTimeRemaining(WORKOUT_STEPS[0].durationSeconds);
              setIsWorkoutCompleted(false);
              setIsRunning(false);
            }}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-sm shadow-xl hover:scale-105 transition-all"
          >
            Fazer Novo Treino
          </button>
        </div>
      )}

    </div>
  );
};

