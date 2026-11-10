import React, { useState, useEffect, useRef } from 'react';
import { RIFFS_DATA } from '../../data/riffsData';
import { RiffSong } from '../../types';
import { audioEngine, STRING_CONFIGS, getNoteName, getFrequency } from '../../services/audioEngine';
import { guitarPitchDetector, DetectedPitch, GuitarPitchDetector } from '../../services/pitchDetector';
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
  Volume2,
  Mic,
  MicOff,
  Star,
  Sliders,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface RiffFlowPlayerProps {
  isInvertedView?: boolean;
}

interface NoteState {
  index: number;
  hit: boolean;
  missed: boolean;
  scoreAwarded?: number;
}

export const RiffFlowPlayer: React.FC<RiffFlowPlayerProps> = ({
  isInvertedView = false,
}) => {
  const [selectedSong, setSelectedSong] = useState<RiffSong>(RIFFS_DATA[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [currentTimeMs, setCurrentTimeMs] = useState<number>(0);
  const [activeFretMarker, setActiveFretMarker] = useState<{ string: number; fret: number; finger?: number } | null>(null);

  // 3D Perspective Mode
  const [is3DMode, setIs3DMode] = useState<boolean>(true);

  // Live Microphone Detection Mode
  const [isMicEnabled, setIsMicEnabled] = useState<boolean>(false);
  const [micSensitivity, setMicSensitivity] = useState<'low' | 'medium' | 'high'>('medium');
  const [currentPitch, setCurrentPitch] = useState<DetectedPitch | null>(null);
  const [micError, setMicError] = useState<string | null>(null);

  // Gamification & Scoring
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [hitFeedback, setHitFeedback] = useState<{ text: string; color: string } | null>(null);
  const [notesStatus, setNotesStatus] = useState<Record<number, NoteState>>({});
  const [isSongFinished, setIsSongFinished] = useState<boolean>(false);

  const requestRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);
  const playedAudioNotesRef = useRef<Set<number>>(new Set());
  const latestPitchRef = useRef<DetectedPitch | null>(null);

  const strings = isInvertedView ? [...STRING_CONFIGS].reverse() : [...STRING_CONFIGS];

  // Toggle Microphone Pitch Listening
  const toggleMic = async () => {
    if (isMicEnabled) {
      guitarPitchDetector.stop();
      setIsMicEnabled(false);
      setCurrentPitch(null);
      latestPitchRef.current = null;
    } else {
      setMicError(null);
      guitarPitchDetector.setSensitivityLevel(micSensitivity);
      const success = await guitarPitchDetector.start((pitch) => {
        setCurrentPitch(pitch);
        latestPitchRef.current = pitch;
      });

      if (success) {
        setIsMicEnabled(true);
      } else {
        setMicError('Não foi possível acessar seu microfone. Verifique as permissões do navegador!');
      }
    }
  };

  const handleSensitivityChange = (sens: 'low' | 'medium' | 'high') => {
    setMicSensitivity(sens);
    guitarPitchDetector.setSensitivityLevel(sens);
  };

  useEffect(() => {
    return () => {
      guitarPitchDetector.stop();
    };
  }, []);

  const handleSelectSong = (song: RiffSong) => {
    setIsPlaying(false);
    setSelectedSong(song);
    setCurrentTimeMs(0);
    playedAudioNotesRef.current.clear();
    setActiveFretMarker(null);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setHitFeedback(null);
    setNotesStatus({});
    setIsSongFinished(false);
    audioEngine.setInstrument(song.backingTone);
  };

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      if (currentTimeMs >= selectedSong.totalDurationMs || isSongFinished) {
        setCurrentTimeMs(0);
        playedAudioNotesRef.current.clear();
        setScore(0);
        setCombo(0);
        setNotesStatus({});
        setIsSongFinished(false);
      }
      setIsPlaying(true);
      lastTimestampRef.current = null;
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentTimeMs(0);
    playedAudioNotesRef.current.clear();
    setActiveFretMarker(null);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setHitFeedback(null);
    setNotesStatus({});
    setIsSongFinished(false);
  };

  // Triggered when a note is successfully hit (either via Mic or Manual)
  const registerNoteHit = (noteIndex: number, isPerfect: boolean, fromMic: boolean = false) => {
    const note = selectedSong.notes[noteIndex];
    if (!note) return;

    setNotesStatus((prev) => ({
      ...prev,
      [noteIndex]: { index: noteIndex, hit: true, missed: false }
    }));

    const basePoints = isPerfect ? 100 : 70;
    const bonus = combo >= 4 ? 2 : 1;
    const addedScore = basePoints * bonus;

    setScore((s) => s + addedScore);
    setCombo((c) => {
      const next = c + 1;
      if (next > maxCombo) setMaxCombo(next);
      return next;
    });

    setHitFeedback({
      text: fromMic ? (isPerfect ? 'PERFEITO NO INSTRUMENTO! 🔥' : 'NOTA DETECTADA! 🎸') : (isPerfect ? 'PERFEITO! 🔥' : 'BOA! 👍'),
      color: isPerfect ? '#22c55e' : '#38bdf8'
    });

    setTimeout(() => setHitFeedback(null), 700);

    // Audio feedback: confirm note
    if (!fromMic) {
      audioEngine.playNote(note.string, note.fret, 0.6, 1.0);
    }
  };

  // Triggered when a note crosses the line without being played
  const registerNoteMiss = (noteIndex: number) => {
    setNotesStatus((prev) => {
      if (prev[noteIndex]?.hit) return prev;
      return {
        ...prev,
        [noteIndex]: { index: noteIndex, hit: false, missed: true }
      };
    });

    setCombo(0);
    setHitFeedback({
      text: 'PASSOU! ❌',
      color: '#f43f5e'
    });
    setTimeout(() => setHitFeedback(null), 500);
  };

  // Keyboard Spacebar fallback hit handler
  const handleSpacebarHit = () => {
    if (!isPlaying) return;

    let closestIdx: number | null = null;
    let minDiff = 999999;

    selectedSong.notes.forEach((note, idx) => {
      if (notesStatus[idx]?.hit || notesStatus[idx]?.missed) return;
      const diff = Math.abs(note.timeMs - currentTimeMs);
      if (diff < minDiff && diff <= 250) {
        minDiff = diff;
        closestIdx = idx;
      }
    });

    if (closestIdx !== null) {
      const isPerfect = minDiff <= 110;
      registerNoteHit(closestIdx, isPerfect, false);
    } else {
      setCombo(0);
      setHitFeedback({ text: 'FORA DO TEMPO! ⏱️', color: '#f59e0b' });
      setTimeout(() => setHitFeedback(null), 500);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleSpacebarHit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, currentTimeMs, combo, notesStatus]);

  // Main Real-time Animation & Microphone Matching Loop
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

        // Auto backtrack audio playback
        selectedSong.notes.forEach((note, idx) => {
          if (!playedAudioNotesRef.current.has(idx)) {
            if (newTime >= note.timeMs && newTime <= note.timeMs + 80) {
              playedAudioNotesRef.current.add(idx);
              // Backing track guide sound
              audioEngine.playNote(note.string, note.fret, note.durationMs / 1000, isMicEnabled ? 0.35 : 0.85);
              setActiveFretMarker({ string: note.string, fret: note.fret, finger: note.finger });
              setTimeout(() => {
                setActiveFretMarker(null);
              }, note.durationMs * 0.85);
            }
          }

          // MICROPHONE REAL-TIME HIT DETECTION
          if (isMicEnabled && !notesStatus[idx]?.hit && !notesStatus[idx]?.missed) {
            // Check if note is in the hit window (±160ms around strike line)
            const timeDiff = newTime - note.timeMs;
            if (timeDiff >= -150 && timeDiff <= 170) {
              const detected = latestPitchRef.current;
              if (detected) {
                const matches = GuitarPitchDetector.matchesTarget(detected, note.string, note.fret, 65);
                if (matches) {
                  const isPerfect = Math.abs(timeDiff) <= 90;
                  registerNoteHit(idx, isPerfect, true);
                }
              }
            } else if (timeDiff > 220) {
              // Missed note
              registerNoteMiss(idx);
            }
          }
        });

        // Song Finished
        if (newTime >= selectedSong.totalDurationMs) {
          setIsPlaying(false);
          setIsSongFinished(true);
          confetti({ particleCount: 90, spread: 75, origin: { y: 0.5 } });
          return selectedSong.totalDurationMs;
        }

        return newTime;
      });

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, playbackSpeed, selectedSong, isMicEnabled, notesStatus]);

  const HIGHWAY_WIDTH_MS = 2500;
  const HIT_LINE_PERCENT = 18;

  // Accuracy Statistics
  const totalNotes = selectedSong.notes.length;
  const hitsCount = Object.values(notesStatus).filter((n) => n.hit).length;
  const accuracyPercent = totalNotes > 0 ? Math.round((hitsCount / totalNotes) * 100) : 0;

  const starsCount = accuracyPercent >= 95 ? 5 :
                     accuracyPercent >= 80 ? 4 :
                     accuracyPercent >= 65 ? 3 :
                     accuracyPercent >= 45 ? 2 : 1;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950/30 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
              <Zap className="w-3.5 h-3.5" />
              <span>Inovação Rocksmith: Pista de Notas com Detecção de Microfone</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Riff Flow: Pista Interativa ao Vivo
            </h1>
            <p className="text-slate-400 text-sm max-w-xl">
              Ative o microfone para tocar seu violão ou guitarra real e receber pontos e feedback na hora, ou use a barra de espaço para treinar o ritmo!
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

            {/* 3D Mode Toggle */}
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
              <span className="hidden sm:inline">{is3DMode ? 'Pista 3D' : 'Pista 2D'}</span>
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

        {/* Songs Selector */}
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

      {/* Microphone Control & Real-time Input Monitor Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
        
        {/* Mic Activation Button & VU Meter */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleMic}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg transition-all hover:scale-105 active:scale-95 ${
              isMicEnabled
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30 ring-2 ring-emerald-400/40'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
          >
            {isMicEnabled ? <Mic className="w-4 h-4 animate-pulse" /> : <MicOff className="w-4 h-4 text-slate-400" />}
            <span>{isMicEnabled ? 'Microfone Ativo (Ouvindo)' : 'Ativar Microfone ao Vivo'}</span>
          </button>

          {/* Live Sound Level / VU Meter */}
          {isMicEnabled && (
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">Volume:</span>
              <div className="w-20 h-2.5 bg-slate-950 rounded-full border border-slate-800 overflow-hidden flex items-center p-0.5">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 via-yellow-400 to-rose-500 rounded-full transition-all duration-75"
                  style={{ width: `${Math.min(100, (currentPitch?.volume || 0.05) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Live Detected Pitch Box */}
        {isMicEnabled ? (
          <div className="flex items-center gap-3 bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Nota Ouvida:</span>
            {currentPitch ? (
              <div className="flex items-center gap-2">
                <span className="text-base font-black font-mono text-emerald-400 animate-pulse">
                  {currentPitch.noteName}{currentPitch.octave} ({currentPitch.notePt})
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  {currentPitch.freq.toFixed(1)} Hz
                </span>
              </div>
            ) : (
              <span className="text-xs text-slate-500 italic">Toque uma corda no violão...</span>
            )}
          </div>
        ) : (
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Toque no violão com o microfone ligado, ou aperte <kbd className="px-1.5 py-0.5 bg-slate-800 text-white rounded font-mono text-[10px] border border-slate-700">Espaço</kbd></span>
          </div>
        )}

        {/* Sensitivity Dropdown */}
        {isMicEnabled && (
          <div className="flex items-center gap-2 text-xs">
            <Sliders className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400">Sensibilidade:</span>
            <div className="flex gap-1">
              {(['low', 'medium', 'high'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => handleSensitivityChange(lvl)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all ${
                    micSensitivity === lvl
                      ? 'bg-rose-500 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {lvl === 'low' ? 'Baixa' : lvl === 'medium' ? 'Média' : 'Alta'}
                </button>
              ))}
            </div>
          </div>
        )}

      </div>

      {micError && (
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{micError}</span>
        </div>
      )}

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

          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Acertos</div>
              <div className="text-xl font-black font-mono text-emerald-400">{hitsCount}/{totalNotes}</div>
            </div>
          </div>
        </div>

        {/* Live Feedback Toast */}
        <div className="h-8 flex items-center">
          {hitFeedback ? (
            <span 
              className="text-base font-black px-4 py-1 rounded-xl animate-bounce shadow-lg"
              style={{ backgroundColor: `${hitFeedback.color}25`, color: hitFeedback.color }}
            >
              {hitFeedback.text}
            </span>
          ) : (
            <span className="text-xs text-slate-500">
              {isMicEnabled ? 'Toque a nota no seu violão quando o bloco cruzar a barra dourada!' : 'Pressione ESPAÇO no momento exato!'}
            </span>
          )}
        </div>

        {!isMicEnabled && (
          <button
            onClick={() => handleSpacebarHit()}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/20 active:scale-95 transition-all"
          >
            Palhetar Agora! 🎸
          </button>
        )}
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

        {/* Highway Tracks Box with 3D Transform */}
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
              const state = notesStatus[idx];

              return (
                <div
                  key={idx}
                  style={{
                    left: `${leftPercent}%`,
                    top: `${rowTopPercent}%`,
                    backgroundColor: state?.hit ? '#22c55e' : state?.missed ? '#475569' : noteColor,
                    borderColor: state?.hit ? '#86efac' : isHitting ? '#ffffff' : `${noteColor}80`,
                    boxShadow: state?.hit ? '0 0 25px #22c55e, 0 0 10px white' : isHitting ? `0 0 25px ${noteColor}, 0 0 10px white` : `0 0 8px ${noteColor}60`,
                    opacity: state?.missed ? 0.35 : 1
                  }}
                  className={`absolute z-10 -translate-y-1/2 w-10 sm:w-12 h-7 sm:h-8 rounded-lg flex items-center justify-center font-black text-slate-950 border-2 shadow-lg transition-transform ${
                    isHitting ? 'scale-125 ring-2 ring-white' : ''
                  } ${state?.hit ? 'scale-110' : ''}`}
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

      {/* Song Completed Summary Card (Rocksmith Style) */}
      {isSongFinished && (
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950/50 to-slate-900 border-2 border-indigo-500/50 rounded-3xl p-8 sm:p-10 text-center space-y-6 shadow-2xl animate-fade-in">
          
          {/* Star Rating */}
          <div className="flex items-center justify-center gap-2">
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                className={`w-9 h-9 sm:w-11 sm:h-11 ${
                  i < starsCount
                    ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.8)] scale-110 animate-bounce'
                    : 'text-slate-700'
                }`}
              />
            ))}
          </div>

          <div className="space-y-1">
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              {accuracyPercent >= 90 ? 'Espetacular! Nível Rock Star! 🤘' :
               accuracyPercent >= 70 ? 'Muito bom! Você está pegando o ritmo!' :
               'Bom treino! A repetição leva à perfeição!'}
            </h3>
            <p className="text-slate-400 text-sm">
              Você tocou <strong>{selectedSong.title}</strong> ({selectedSong.artist})
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
              <div className="text-[10px] uppercase font-bold text-slate-400">Precisão</div>
              <div className="text-2xl font-black font-mono text-emerald-400">{accuracyPercent}%</div>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
              <div className="text-[10px] uppercase font-bold text-slate-400">Acertos</div>
              <div className="text-2xl font-black font-mono text-white">{hitsCount}/{totalNotes}</div>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
              <div className="text-[10px] uppercase font-bold text-slate-400">Maior Combo</div>
              <div className="text-2xl font-black font-mono text-amber-400">{maxCombo}x</div>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
              <div className="text-[10px] uppercase font-bold text-slate-400">Pontuação</div>
              <div className="text-2xl font-black font-mono text-rose-400">{score}</div>
            </div>
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={handleReset}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 text-white font-bold text-sm shadow-xl hover:scale-105 transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Jogar Novamente</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
