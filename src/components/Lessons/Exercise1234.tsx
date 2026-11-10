import React, { useState, useEffect, useRef } from 'react';
import { audioEngine, STRING_CONFIGS } from '../../services/audioEngine';
import { InteractiveFretboard } from '../Fretboard/InteractiveFretboard';
import { Play, Pause, RotateCcw, Activity, ArrowRight } from 'lucide-react';

export const Exercise1234: React.FC = () => {
  const [selectedString, setSelectedString] = useState<number>(6); // Default 6th string
  const [bpm, setBpm] = useState<number>(70);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0); // 1, 2, 3, 4 (0 = idle)

  const timerRef = useRef<any>(null);

  const fingers = [
    { fret: 1, finger: 1, name: 'Indicador', desc: 'Dedo 1' },
    { fret: 2, finger: 2, name: 'Médio',     desc: 'Dedo 2' },
    { fret: 3, finger: 3, name: 'Anelar',    desc: 'Dedo 3' },
    { fret: 4, finger: 4, name: 'Mindinho',  desc: 'Dedo 4' },
  ];

  const handleTogglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      setCurrentStep(0);
      if (timerRef.current) clearInterval(timerRef.current);
    } else {
      setIsPlaying(true);
      setCurrentStep(1);
      audioEngine.playNote(selectedString, 1, 0.8, 0.9);
      audioEngine.playClick(true);
    }
  };

  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const intervalMs = (60 / bpm) * 1000;
    timerRef.current = setInterval(() => {
      setCurrentStep((prev) => {
        const next = prev >= 4 ? 1 : prev + 1;
        audioEngine.playNote(selectedString, next, 0.8, 0.9);
        audioEngine.playClick(next === 1);
        return next;
      });
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, bpm, selectedString]);

  const markers = fingers.map((f) => ({
    string: selectedString,
    fret: f.fret,
    finger: f.finger,
    label: `D${f.finger}`,
  }));

  const activeMarker = currentStep > 0 ? [
    {
      string: selectedString,
      fret: currentStep,
      finger: currentStep,
      label: `D${currentStep}`
    }
  ] : markers;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <Activity className="w-4 h-4" />
            <span>Treinador Interativo de Digitação</span>
          </div>
          <h3 className="text-lg font-bold text-white mt-1">
            Exercício 1 - 2 - 3 - 4 (Aranha)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Mantenha cada dedo apoiado enquanto o próximo dedo bate!
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleTogglePlay}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all hover:scale-105 ${
              isPlaying
                ? 'bg-amber-500 text-slate-950'
                : 'bg-rose-600 hover:bg-rose-500 text-white'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isPlaying ? 'Pausar Metrônomo' : 'Praticar no Tempo'}</span>
          </button>
        </div>
      </div>

      {/* BPM & String Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950/70 p-4 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-300 font-semibold mb-1">
            <span>Velocidade do Metrônomo:</span>
            <span className="text-amber-400 font-mono font-bold">{bpm} BPM</span>
          </div>
          <input
            type="range"
            min="40"
            max="120"
            step="5"
            value={bpm}
            onChange={(e) => setBpm(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
          />
        </div>

        <div>
          <div className="text-xs text-slate-300 font-semibold mb-1.5">
            Escolha a corda para praticar:
          </div>
          <div className="flex gap-1.5">
            {STRING_CONFIGS.map((str) => (
              <button
                key={str.number}
                onClick={() => setSelectedString(str.number)}
                className={`flex-1 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                  selectedString === str.number
                    ? 'text-slate-950 shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
                style={{
                  backgroundColor: selectedString === str.number ? str.color : undefined
                }}
              >
                {str.number}ª
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4 Fingers Step Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {fingers.map((f) => {
          const isActive = currentStep === f.fret;
          return (
            <div
              key={f.fret}
              className={`p-3 rounded-xl border text-center transition-all ${
                isActive
                  ? 'bg-amber-500/20 border-amber-400 text-white scale-105 shadow-lg shadow-amber-500/10'
                  : 'bg-slate-950/50 border-slate-800/80 text-slate-400'
              }`}
            >
              <div className="text-xs uppercase font-bold text-slate-400">
                Casa {f.fret}
              </div>
              <div className="text-base font-extrabold text-white mt-0.5">
                {f.desc}
              </div>
              <div className="text-[11px] text-slate-400">
                ({f.name})
              </div>
            </div>
          );
        })}
      </div>

      {/* Fretboard Preview */}
      <div>
        <InteractiveFretboard
          markers={activeMarker}
          totalFrets={5}
          interactive={true}
        />
      </div>
    </div>
  );
};
