import React, { useState, useEffect, useRef } from 'react';
import { SONGBOOK_DATA } from '../../data/songsLibraryData';
import { CHORDS_DATA } from '../../data/chordsData';
import { SongbookEntry } from '../../types';
import { audioEngine } from '../../services/audioEngine';
import { InteractiveFretboard } from '../Fretboard/InteractiveFretboard';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Music, 
  Sparkles, 
  Guitar, 
  BookOpen, 
  Layers, 
  CheckCircle2,
  Volume2
} from 'lucide-react';

interface SongbookViewProps {
  isInvertedView?: boolean;
  onSelectChord?: (chordId: string) => void;
}

export const SongbookView: React.FC<SongbookViewProps> = ({
  isInvertedView = false,
  onSelectChord
}) => {
  const [selectedSong, setSelectedSong] = useState<SongbookEntry>(SONGBOOK_DATA[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeLineIndex, setActiveLineIndex] = useState<number>(0);
  const [previewChord, setPreviewChord] = useState<typeof CHORDS_DATA[0] | null>(null);

  const timerRef = useRef<any>(null);

  const handleSelectSong = (song: SongbookEntry) => {
    setIsPlaying(false);
    setSelectedSong(song);
    setActiveLineIndex(0);
    setPreviewChord(null);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const togglePlayAlong = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (timerRef.current) clearInterval(timerRef.current);
    } else {
      setIsPlaying(true);
      // Play first chord
      playLineChord(0);
    }
  };

  const playLineChord = (lineIdx: number) => {
    const line = selectedSong.lines[lineIdx];
    if (line && line.chords.length > 0) {
      const firstChordName = line.chords[0].chord.toLowerCase();
      const chordDef = CHORDS_DATA.find(c => c.name.toLowerCase() === firstChordName);
      if (chordDef) {
        audioEngine.strumChord(chordDef.frets, 'down', 30);
      }
    }
  };

  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    // Advance lines based on song BPM (e.g. 4 bars per line)
    const lineDurationMs = (60 / selectedSong.bpm) * 4 * 1000;

    timerRef.current = setInterval(() => {
      setActiveLineIndex((prev) => {
        const next = (prev + 1) % selectedSong.lines.length;
        playLineChord(next);
        return next;
      });
    }, lineDurationMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, selectedSong]);

  const handleChordClick = (chordName: string) => {
    const chordDef = CHORDS_DATA.find(c => c.name.toLowerCase() === chordName.toLowerCase());
    if (chordDef) {
      setPreviewChord(chordDef);
      audioEngine.strumChord(chordDef.frets, 'down');
    }
  };

  const chordMarkers = previewChord ? previewChord.frets.map((fret, idx) => {
    const stringNum = 6 - idx;
    return fret > 0 ? {
      string: stringNum,
      fret,
      finger: previewChord.fingers[idx],
      label: `D${previewChord.fingers[idx]}`
    } : null;
  }).filter(Boolean) : [];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Cancioneiro do Iniciante</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Músicas que Você Já Consegue Tocar
            </h1>
            <p className="text-slate-400 text-sm max-w-xl">
              Com apenas 4 acordes básicos (Em, C, G e D) você já tem o poder de tocar os maiores clássicos do Rock e da MPB. Veja as cifras sincronizadas e pratique junto!
            </p>
          </div>

          {/* Quick Play-along Action */}
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlayAlong}
              className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl font-black text-sm shadow-xl transition-all hover:scale-105 active:scale-95 ${
                isPlaying
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                  : 'bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 text-white shadow-rose-600/30'
              }`}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
              <span>{isPlaying ? 'Pausar Acompanhamento' : 'Tocar Junto com Áudio'}</span>
            </button>
          </div>
        </div>

        {/* Songs Selector Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          {SONGBOOK_DATA.map((song) => {
            const isSelected = selectedSong.id === song.id;
            return (
              <button
                key={song.id}
                onClick={() => handleSelectSong(song)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'bg-slate-800 border-indigo-500 shadow-lg shadow-indigo-500/15 scale-102 ring-2 ring-indigo-500/30'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white truncate">{song.title}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {song.bpm} BPM
                  </span>
                </div>
                <p className="text-xs text-indigo-400 font-medium mt-0.5">{song.artist}</p>
                <div className="flex items-center gap-1 mt-2.5">
                  {song.requiredChords.map((c) => (
                    <span key={c} className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                      {c}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Songsheet View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Lyrics & Synced Chords */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">{selectedSong.genre}</span>
              <h2 className="text-2xl font-black text-white">{selectedSong.title}</h2>
              <p className="text-sm text-slate-400">{selectedSong.artist}</p>
            </div>

            {/* Strumming Pattern Indicator */}
            <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
              <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Batida Recomendada:</div>
              <div className="text-xs font-semibold text-amber-400">{selectedSong.strumPatternName}</div>
              <div className="flex gap-1.5 mt-1.5">
                {selectedSong.strumPattern.map((dir, i) => (
                  <span
                    key={i}
                    className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${
                      dir === 'down'
                        ? 'bg-rose-500/20 border border-rose-500/40 text-rose-300'
                        : dir === 'up'
                        ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-900 text-slate-600'
                    }`}
                  >
                    {dir === 'down' ? '↓' : dir === 'up' ? '↑' : '·'}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Lyrics and Chords Lines */}
          <div className="space-y-4">
            {selectedSong.lines.map((line, idx) => {
              const isCurrentLine = isPlaying && activeLineIndex === idx;

              return (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border transition-all ${
                    isCurrentLine
                      ? 'bg-indigo-950/50 border-indigo-500 shadow-md shadow-indigo-500/10 scale-102 ring-1 ring-indigo-500/30'
                      : 'bg-slate-950/40 border-slate-800/80 hover:bg-slate-950/70'
                  }`}
                >
                  {/* Chords Bar */}
                  <div className="flex gap-4 font-mono font-bold text-sm mb-1.5">
                    {line.chords.map((c, cIdx) => (
                      <button
                        key={cIdx}
                        onClick={() => handleChordClick(c.chord)}
                        className="px-2.5 py-0.5 rounded-lg bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-600 hover:text-white transition-all text-xs flex items-center gap-1"
                        title={`Clique para ver a posição do acorde ${c.chord}`}
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>{c.chord}</span>
                      </button>
                    ))}
                  </div>

                  {/* Lyrics Text */}
                  <div className={`text-base font-medium ${isCurrentLine ? 'text-white font-bold' : 'text-slate-300'}`}>
                    {line.text}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Chord Preview & Fretboard Inspector */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Guitar className="w-5 h-5 text-indigo-400" />
              <span>Acordes Usados Nesta Música</span>
            </h3>
            <p className="text-xs text-slate-400">
              Clique em qualquer acorde para ouvir o som e ver a posição dos dedos:
            </p>

            <div className="grid grid-cols-2 gap-2">
              {selectedSong.requiredChords.map((chordId) => {
                const chordDef = CHORDS_DATA.find(c => c.id === chordId);
                if (!chordDef) return null;
                const isSelected = previewChord?.id === chordDef.id;

                return (
                  <button
                    key={chordId}
                    onClick={() => {
                      setPreviewChord(chordDef);
                      audioEngine.strumChord(chordDef.frets, 'down');
                    }}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-400 shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <div className="text-lg font-black">{chordDef.name}</div>
                    <div className="text-[10px] text-slate-400 truncate">{chordDef.fullName}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Fretboard Preview Card */}
          {previewChord && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Como Montar:</div>
                  <h4 className="text-lg font-black text-white">{previewChord.name} ({previewChord.fullName})</h4>
                </div>
                <button
                  onClick={() => audioEngine.strumChord(previewChord.frets, 'down')}
                  className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white"
                  title="Ouvir acorde"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              <div className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
                💡 {previewChord.tips}
              </div>

              <div className="overflow-x-auto">
                <InteractiveFretboard
                  markers={chordMarkers as any}
                  totalFrets={5}
                  isInverted={isInvertedView}
                  interactive={true}
                />
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

