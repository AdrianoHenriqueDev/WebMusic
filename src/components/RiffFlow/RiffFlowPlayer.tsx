import React, { useState, useEffect, useRef } from 'react';
import { RIFFS_DATA } from '../../data/riffsData';
import { RiffSong } from '../../types';
import { audioEngine, STRING_CONFIGS } from '../../services/audioEngine';
import { InteractiveFretboard } from '../Fretboard/InteractiveFretboard';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Gauge, 
  Zap, 
  Sparkles,
  Trophy,
  Layers,
  Flame,
  Volume2
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface RiffFlowPlayerProps {
  isInvertedView?: boolean;
}

export const RiffFlowPlayer: React.FC<RiffFlowPlayerProps> = ({
  isInvertedView = false,
}) => {
  const [selectedSong, setSelectedSong] = useState<RiffSong>(RIFFS_DATA[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [currentTimeMs, setCurrentTimeMs] = useState<number>(0);
  const [activeFretMarker, setActiveFretMarker] = useState<{ string: number; fret: number; finger?: number } | null>(null);

  // 3D Perspective Mode (Signature Rocksmith Camera Angle)
  const [is3DMode, setIs3DMode] = useState<boolean>(true);

  // Play-Along Gamification (Hit Scoring & Streak)
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [hitFeedback, setHitFeedback] = useState<{ text: string; color: string } | null>(null);

  const requestRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);
  const playedNotesRef = useRef<Set<number>>(new Set());

  const strings = isInvertedView ? [...STRING_CONFIGS].reverse() : [...STRING_CONFIGS];

  const handleSelectSong = (song: RiffSong) => {
    setIsPlaying(false);
    setSelectedSong(song);
    setCurrentTimeMs(0);
    playedNotesRef.current.clear();
    setActiveFretMarker(null);
    setScore(0);
    setCombo(0);
    setHitFeedback(null);
    audioEngine.setInstrument(song.backingTone);
  };

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      if (currentTimeMs >= selectedSong.totalDurationMs) {
        setCurrentTimeMs(0);
        playedNotesRef.current.clear();
        setScore(0);
        setCombo(0);
      }
      setIsPlaying(true);
      lastTimestampRef.current = null;
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentTimeMs(0);
    playedNotesRef.current.clear();
    setActiveFretMarker(null);
    setScore(0);
    setCombo(0);
    setHitFeedback(null);
  };

  // User hits key or clicks to play along
  const handleUserHit = (hitString?: number) => {
    if (!isPlaying) return;

    // Find note closest to current time
    let closestNote: typeof selectedSong.notes[0] | null = null;
    let minDiff = 999999;

    selectedSong.notes.forEach((note) => {
      const diff = Math.abs(note.timeMs - currentTimeMs);
      if (diff < minDiff) {
        minDiff = diff;
        closestNote = note;
      }
    });

    if (closestNote && minDiff <= 250) {
      // Hit success!
      const isPerfect = minDiff <= 110;
      const points = isPerfect ? 100 : 60;
      setScore((s) => s + points * (combo >= 4 ? 2 : 1));
      setCombo((c) => {
        const next = c + 1;
        if (next > maxCombo) setMaxCombo(next);
        return next;
      });

      setHitFeedback({
        text: isPerfect ? 'PERFEITO! 🔥' : 'BOA! 👍',
        color: isPerfect ? '#22c55e' : '#eab308'
      });

      audioEngine.playNote((closestNote as any).string, (closestNote as any).fret, 0.6, 1.0);
    } else {
      // Miss
      setCombo(0);
      setHitFeedback({
        text: 'QUASE! ⏱️',
        color: '#f43f5e'
      });
    }

    setTimeout(() => setHitFeedback(null), 600);
  };

  // Keyboard listener for play-along (Space or keys 1..6)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleUserHit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, currentTimeMs, combo]);

  // Main Animation Loop
  useEffect(() => {
    if (!isPlaying) {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      lastTimestampRef.current = null;
      return;
    }

    const animate = (timestamp: number) => {
      if (!lastTimestampRef.current) {
        lastTimestampRef.current = timestamp;
      }
      const delta = (timestamp - lastTimestampRef.current) * playbackSpeed;
      lastTimestampRef.current = timestamp;

      setCurrentTimeMs((prevTime) => {
        const newTime = prevTime + delta;

        // Auto audio playback
        selectedSong.notes.forEach((note, idx) => {
          if (!playedNotesRef.current.has(idx)) {
            if (newTime >= note.timeMs && newTime <= note.timeMs + 100) {
              playedNotesRef.current.add(idx);
              audioEngine.playNote(note.string, note.fret, note.durationMs / 1000, 0.9);
              setActiveFretMarker({ string: note.string, fret: note.fret, finger: note.finger });
              setTimeout(() => {
                setActiveFretMarker(null);
              }, note.durationMs * 0.85);
            }
          }
        });

        if (newTime >= selectedSong.totalDurationMs) {
          playedNotesRef.current.clear();
          if (score > 300) {
            confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
          }
          return 0;
        }

        return newTime;
      });

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, playbackSpeed, selectedSong, score]);

  const HIGHWAY_WIDTH_MS = 2500;
  const HIT_LINE_PERCENT = 18;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950/30 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
              <Zap className="w-3.5 h-3.5" />
              <span>Inovação Rocksmith: Pista de Notas em Tempo Real</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Riff Flow: Pista de Notas 3D
            </h1>
            <p className="text-slate-400 text-sm max-w-xl">
              As notas coloridas deslizam pela pista até a linha de palhetada. Toque no seu instrumento ou pressione a barra de espaço para praticar o tempo!
            </p>
          </div>

          {/* Controls Bar */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={togglePlay}
              className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl font-black text-sm shadow-xl transition-all hover:scale-105 active:scale-95 ${
                isPlaying
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                  : 'bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 text-white shadow-rose-600/30'
              }`}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
              <span>{isPlaying ? 'Pausar' : 'Iniciar Riff'}</span>
            </button>

            <button
              onClick={handleReset}
              className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all hover:scale-105"
              title="Reiniciar riff do começo"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            {/* 3D Perspective Toggle */}
            <button
              onClick={() => setIs3DMode(!is3DMode)}
              className={`p-3.5 rounded-2xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
                is3DMode
                  ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
              title="Alternar entre Perspectiva 3D do Rocksmith e 2D Plano"
            >
              <Layers className="w-4 h-4" />
              <span className="hidden sm:inline">{is3DMode ? 'Modo 3D' : 'Modo 2D'}</span>
            </button>

            {/* Speed Selector */}
            <div className="flex items-center bg-slate-800/90 rounded-2xl p-1 border border-slate-700">
              <span className="text-xs font-semibold text-slate-400 px-2 flex items-center gap-1">
                <Gauge className="w-3.5 h-3.5" />
              </span>
              {[0.5, 0.75, 1.0].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setPlaybackSpeed(spd)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    playbackSpeed === spd
                      ? 'bg-rose-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {spd * 100}%
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Song Select Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          {RIFFS_DATA.map((song) => {
            const isSelected = selectedSong.id === song.id;
            return (
              <button
                key={song.id}
                onClick={() => handleSelectSong(song)}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'bg-slate-800 border-rose-500 shadow-md shadow-rose-500/15 scale-102 ring-2 ring-rose-500/30'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white truncate">{song.title}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {song.tempo} BPM
                  </span>
                </div>
                <p className="text-xs text-rose-400 font-medium mt-0.5">{song.artist}</p>
                <p className="text-[11px] text-slate-400 mt-2 line-clamp-2">{song.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Gamified Play-Along Score & Combo Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Pontuação</div>
              <div className="text-xl font-black font-mono text-white">{score} pts</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Flame className={`w-5 h-5 ${combo >= 4 ? 'text-rose-500 animate-bounce' : 'text-slate-500'}`} />
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Combo</div>
              <div className="text-xl font-black font-mono text-amber-400">
                {combo}x {combo >= 4 && <span className="text-xs text-rose-400 font-bold">(Bônus 2x!)</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Live Feedback Toast */}
        <div className="h-8 flex items-center">
          {hitFeedback ? (
            <span 
              className="text-base font-black px-3 py-1 rounded-xl animate-bounce shadow-lg"
              style={{ backgroundColor: `${hitFeedback.color}25`, color: hitFeedback.color }}
            >
              {hitFeedback.text}
            </span>
          ) : (
            <span className="text-xs text-slate-500 hidden sm:inline">
              Pressione <kbd className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-xs border border-slate-700">ESPAÇO</kbd> no momento da nota para pontuar!
            </span>
          )}
        </div>

        <button
          onClick={() => handleUserHit()}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/20 active:scale-95 transition-all"
        >
          Palhetar Agora! 🎸
        </button>
      </div>

      {/* Note Highway Viewport Container */}
      <div 
        className="bg-[#0b0f17] border border-slate-800 rounded-3xl p-4 sm:p-6 space-y-4 shadow-2xl relative overflow-hidden"
        style={{ perspective: is3DMode ? '800px' : 'none' }}
      >
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <span className="font-semibold text-slate-200">
              {is3DMode ? 'Pista 3D Estilo Rocksmith' : 'Pista 2D Padrão'}
            </span>
            <span className="text-slate-500 hidden sm:inline">— Toque a nota quando o bloco cruzar a barra dourada!</span>
          </div>

          <div className="font-mono text-slate-400 font-semibold">
            {((currentTimeMs % selectedSong.totalDurationMs) / 1000).toFixed(1)}s / {(selectedSong.totalDurationMs / 1000).toFixed(1)}s
          </div>
        </div>

        {/* Highway Tracks Box with Optional 3D Rotation */}
        <div 
          className="relative h-64 sm:h-72 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 rounded-2xl border-2 border-slate-800 overflow-hidden shadow-inner select-none transition-transform duration-500"
          style={{
            transform: is3DMode ? 'rotateX(18deg) scaleY(1.05)' : 'none',
            transformOrigin: 'bottom center'
          }}
        >
          
          {/* Target Strike Line (Barra Dourada) */}
          <div 
            className="absolute top-0 bottom-0 z-20 w-1.5 bg-gradient-to-b from-amber-400 via-yellow-200 to-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.9)] pointer-events-none"
            style={{ left: `${HIT_LINE_PERCENT}%` }}
          >
            <div className="absolute -top-1 -translate-x-1/2 bg-amber-400 text-slate-950 font-black text-[9px] px-1 rounded uppercase tracking-wider">
              Palheta
            </div>
          </div>

          {/* 6 Horizontal String Rails */}
          <div className="absolute inset-0 flex flex-col justify-around py-3">
            {strings.map((str) => (
              <div key={str.number} className="relative w-full flex items-center h-8">
                
                {/* Left String Label */}
                <div 
                  className="w-12 h-6 flex items-center justify-center rounded-r-md font-mono text-xs font-black z-30"
                  style={{ backgroundColor: `${str.color}25`, color: str.color, borderRight: `3px solid ${str.color}` }}
                >
                  {str.name}
                </div>

                {/* String Track Line */}
                <div 
                  className="w-full opacity-40 transition-all"
                  style={{
                    height: `${str.gauge + 0.5}px`,
                    backgroundColor: str.color,
                  }}
                />
              </div>
            ))}
          </div>

          {/* Flowing Notes Blocks */}
          <div className="absolute inset-0 pointer-events-none">
            {selectedSong.notes.map((note, idx) => {
              const strIndex = strings.findIndex((s) => s.number === note.string);
              if (strIndex === -1) return null;

              const strConfig = STRING_CONFIGS.find((s) => s.number === note.string);
              const noteColor = strConfig?.color || '#ef4444';

              const timeDiff = note.timeMs - currentTimeMs;
              const leftPercent = HIT_LINE_PERCENT + (timeDiff / HIGHWAY_WIDTH_MS) * (100 - HIT_LINE_PERCENT);

              if (leftPercent < -15 || leftPercent > 115) return null;

              const rowTopPercent = (strIndex / 6) * 100 + 4;
              const isHitting = Math.abs(timeDiff) < 80;

              return (
                <div
                  key={idx}
                  style={{
                    left: `${leftPercent}%`,
                    top: `${rowTopPercent}%`,
                    backgroundColor: noteColor,
                    borderColor: isHitting ? '#ffffff' : `${noteColor}80`,
                    boxShadow: isHitting ? `0 0 25px ${noteColor}, 0 0 10px white` : `0 0 8px ${noteColor}60`
                  }}
                  className={`absolute z-10 -translate-y-1/2 w-10 sm:w-12 h-7 sm:h-8 rounded-lg flex items-center justify-center font-black text-slate-950 border-2 shadow-lg transition-transform ${
                    isHitting ? 'scale-125 ring-2 ring-white' : ''
                  }`}
                >
                  <span className="text-xs sm:text-sm font-mono tracking-tighter">
                    {note.label ?? note.fret}
                  </span>
                  {note.finger && (
                    <span className="absolute -bottom-2 -right-1 text-[8px] bg-black text-white px-1 rounded font-sans">
                      D{note.finger}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

        </div>

        {/* Real-time Synced Fretboard Display */}
        <div className="pt-2">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold text-slate-200">Espelho no Braço do Instrumento:</span>
            <span className="text-slate-500">Acompanhe a posição da casa em tempo real</span>
          </div>

          <InteractiveFretboard
            markers={activeFretMarker ? [activeFretMarker] : []}
            totalFrets={12}
            isInverted={isInvertedView}
            interactive={true}
          />
        </div>

      </div>

    </div>
  );
};
