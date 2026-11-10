import React, { useState, useEffect, useRef } from 'react';
import { audioEngine } from '../../services/audioEngine';
import { CHORDS_DATA } from '../../data/chordsData';
import { Play, Pause, RotateCcw, Flame } from 'lucide-react';

interface StrumBeat {
  label: string; // '1', '&', '2', '&', '3', '&', '4', '&'
  arrow: 'down' | 'up' | 'none';
}

const PATTERNS: { name: string; desc: string; bpm: number; beats: StrumBeat[] }[] = [
  {
    name: 'O Ritmo Pop/Rock Universal',
    desc: 'Usado em milhares de músicas (ex: Stand by Me, Wonderwall, Que País é Esse).',
    bpm: 80,
    beats: [
      { label: '1', arrow: 'down' },
      { label: '&', arrow: 'none' },
      { label: '2', arrow: 'down' },
      { label: '&', arrow: 'up' },
      { label: '3', arrow: 'none' },
      { label: '&', arrow: 'up' },
      { label: '4', arrow: 'down' },
      { label: '&', arrow: 'up' },
    ]
  },
  {
    name: 'Balada Folk Suave (4/4)',
    desc: 'Simples e calmo para acompanhar os primeiros acordes.',
    bpm: 75,
    beats: [
      { label: '1', arrow: 'down' },
      { label: '&', arrow: 'none' },
      { label: '2', arrow: 'down' },
      { label: '&', arrow: 'none' },
      { label: '3', arrow: 'down' },
      { label: '&', arrow: 'none' },
      { label: '4', arrow: 'down' },
      { label: '&', arrow: 'up' },
    ]
  },
  {
    name: 'Batida de Rock Direta (Todas para baixo)',
    desc: 'Excelente para desenvolver firmeza na palheta.',
    bpm: 90,
    beats: [
      { label: '1', arrow: 'down' },
      { label: '&', arrow: 'none' },
      { label: '2', arrow: 'down' },
      { label: '&', arrow: 'none' },
      { label: '3', arrow: 'down' },
      { label: '&', arrow: 'none' },
      { label: '4', arrow: 'down' },
      { label: '&', arrow: 'none' },
    ]
  }
];

export const RhythmTrainer: React.FC = () => {
  const [selectedPattern, setSelectedPattern] = useState(PATTERNS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [bpm, setBpm] = useState<number>(selectedPattern.bpm);

  const timerRef = useRef<any>(null);
  const chordEm = CHORDS_DATA[0].frets; // Em chord for rhythm sound

  const handleTogglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      setCurrentStep(-1);
      if (timerRef.current) clearInterval(timerRef.current);
    } else {
      setIsPlaying(true);
      setCurrentStep(0);
    }
  };

  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    // Eighth note interval in ms = (60 / bpm / 2) * 1000
    const intervalMs = (30 / bpm) * 1000;

    timerRef.current = setInterval(() => {
      setCurrentStep((prev) => {
        const next = (prev + 1) % selectedPattern.beats.length;
        const beat = selectedPattern.beats[next];

        // Trigger audio
        if (beat.arrow === 'down') {
          audioEngine.strumChord(chordEm, 'down', 25);
        } else if (beat.arrow === 'up') {
          audioEngine.strumChord(chordEm, 'up', 20);
        } else {
          audioEngine.playClick(next === 0);
        }

        return next;
      });
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, bpm, selectedPattern]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
            <Flame className="w-4 h-4" />
            <span>Treinador de Batida & Palhetada</span>
          </div>
          <h3 className="text-lg font-bold text-white mt-1">
            O Pêndulo da Mão Direita
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Siga as setas no tempo! Mantenha a mão descendo nos tempos e subindo nos contratempos.
          </p>
        </div>

        <button
          onClick={handleTogglePlay}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all hover:scale-105 ${
            isPlaying ? 'bg-amber-500 text-slate-950' : 'bg-rose-600 hover:bg-rose-500 text-white'
          }`}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          <span>{isPlaying ? 'Pausar Batida' : 'Ouvir e Tocar Junto'}</span>
        </button>
      </div>

      {/* Pattern Selectors */}
      <div className="flex flex-wrap gap-2">
        {PATTERNS.map((p, idx) => (
          <button
            key={idx}
            onClick={() => {
              setSelectedPattern(p);
              setBpm(p.bpm);
              setCurrentStep(-1);
              setIsPlaying(false);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedPattern.name === p.name
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                : 'bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* BPM Slider */}
      <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 flex items-center gap-4">
        <span className="text-xs text-slate-300 font-semibold whitespace-nowrap">
          Velocidade: <span className="text-amber-400 font-mono font-bold">{bpm} BPM</span>
        </span>
        <input
          type="range"
          min="50"
          max="120"
          step="5"
          value={bpm}
          onChange={(e) => setBpm(parseInt(e.target.value))}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
        />
      </div>

      {/* Visual Arrows Beats Flow */}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
        {selectedPattern.beats.map((beat, idx) => {
          const isActive = currentStep === idx;
          const isDown = beat.arrow === 'down';
          const isUp = beat.arrow === 'up';
          const isNone = beat.arrow === 'none';

          return (
            <div
              key={idx}
              className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                isActive
                  ? 'bg-rose-500 text-white scale-110 shadow-lg shadow-rose-500/30 border-white'
                  : isNone
                  ? 'bg-slate-950/40 border-slate-800/50 text-slate-600'
                  : 'bg-slate-950 border-slate-800 text-slate-200'
              }`}
            >
              <span className={`text-[11px] font-mono font-bold ${isActive ? 'text-white' : 'text-slate-400'}`}>
                {beat.label}
              </span>

              <div className="text-2xl font-black">
                {isDown ? '↓' : isUp ? '↑' : '·'}
              </div>

              <span className={`text-[9px] uppercase font-bold ${isActive ? 'text-white' : 'text-slate-500'}`}>
                {isDown ? 'Baixo' : isUp ? 'Cima' : 'Vazio'}
              </span>
            </div>
          );
        })}
      </div>

      <div className="text-xs text-slate-400 bg-slate-950/50 p-3 rounded-xl border border-slate-800/80">
        💡 <strong className="text-slate-200">Dica do Rocksmith:</strong> Nos tempos marcados com <strong>"·"</strong> (Vazio), deixe sua mão passar no ar sem tocar as cordas ("palhetada fantasma"). Isso mantém o balanço do seu corpo no tempo certo!
      </div>
    </div>
  );
};
