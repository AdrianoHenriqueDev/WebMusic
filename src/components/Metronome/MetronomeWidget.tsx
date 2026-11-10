import React, { useState, useEffect, useRef } from 'react';
import { audioEngine } from '../../services/audioEngine';
import { Play, Pause, Plus, Minus, Volume2 } from 'lucide-react';

export const MetronomeWidget: React.FC = () => {
  const [bpm, setBpm] = useState<number>(80);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentBeat, setCurrentBeat] = useState<number>(0); // 0, 1, 2, 3
  const [beatsPerBar, setBeatsPerBar] = useState<number>(4);

  const timerRef = useRef<any>(null);

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      setCurrentBeat(0);
      if (timerRef.current) clearInterval(timerRef.current);
    } else {
      setIsPlaying(true);
      setCurrentBeat(0);
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
      setCurrentBeat((prev) => {
        const next = (prev + 1) % beatsPerBar;
        audioEngine.playClick(next === 0);
        return next;
      });
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, bpm, beatsPerBar]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <button
          onClick={togglePlay}
          className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all hover:scale-105 ${
            isPlaying ? 'bg-amber-500 text-slate-950' : 'bg-rose-600 hover:bg-rose-500 text-white'
          }`}
          title={isPlaying ? 'Pausar Metrônomo' : 'Iniciar Metrônomo'}
        >
          {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
        </button>

        <div>
          <div className="text-xs font-bold text-white flex items-center gap-2">
            <span>Metrônomo</span>
            <span className="text-amber-400 font-mono">{bpm} BPM</span>
          </div>
          <div className="flex gap-1 mt-1">
            {Array.from({ length: beatsPerBar }, (_, i) => (
              <span
                key={i}
                className={`w-3 h-1.5 rounded-full transition-all ${
                  isPlaying && currentBeat === i
                    ? i === 0 ? 'bg-amber-400 scale-125' : 'bg-white scale-110'
                    : 'bg-slate-800'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setBpm((b) => Math.max(40, b - 5))}
          className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center text-xs"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>

        <input
          type="range"
          min="40"
          max="180"
          value={bpm}
          onChange={(e) => setBpm(parseInt(e.target.value))}
          className="w-24 sm:w-32 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
        />

        <button
          onClick={() => setBpm((b) => Math.min(200, b + 5))}
          className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center text-xs"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>

        <select
          value={beatsPerBar}
          onChange={(e) => setBeatsPerBar(parseInt(e.target.value))}
          className="bg-slate-800 border border-slate-700 rounded-lg text-xs text-white px-2 py-1 font-mono font-semibold"
        >
          <option value={4}>4/4</option>
          <option value={3}>3/4</option>
          <option value={2}>2/4</option>
        </select>
      </div>
    </div>
  );
};
