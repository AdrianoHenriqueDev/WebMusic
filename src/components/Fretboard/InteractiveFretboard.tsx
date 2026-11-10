import React, { useState } from 'react';
import { STRING_CONFIGS, getNoteName, audioEngine } from '../../services/audioEngine';
import { FretMarker } from '../../types';
import { Volume2 } from 'lucide-react';

interface InteractiveFretboardProps {
  markers?: FretMarker[];
  interactive?: boolean;
  totalFrets?: number;
  isInverted?: boolean; // If true, string 1 is at top (Tab style). If false, string 6 is at top (Player look-down style)
  onFretClick?: (stringNum: number, fret: number) => void;
  showAllNoteLabels?: boolean;
}

export const InteractiveFretboard: React.FC<InteractiveFretboardProps> = ({
  markers = [],
  interactive = true,
  totalFrets = 12,
  isInverted = false,
  onFretClick,
  showAllNoteLabels = false,
}) => {
  const [activePluck, setActivePluck] = useState<{ stringNum: number; fret: number } | null>(null);

  // Determine strings order based on inversion
  const strings = isInverted ? [...STRING_CONFIGS].reverse() : [...STRING_CONFIGS];

  const handlePluck = (stringNum: number, fret: number) => {
    if (!interactive) return;
    audioEngine.playNote(stringNum, fret, 2.0, 0.85);
    setActivePluck({ stringNum, fret });
    setTimeout(() => {
      setActivePluck((curr) => (curr?.stringNum === stringNum && curr?.fret === fret ? null : curr));
    }, 400);

    if (onFretClick) {
      onFretClick(stringNum, fret);
    }
  };

  // Helper to check for marker at specific string and fret
  const getMarkerAt = (stringNum: number, fret: number) => {
    return markers.find((m) => m.string === stringNum && m.fret === fret);
  };

  // Fret inlays (traditional dots on guitar neck)
  const isSingleDotFret = (f: number) => [3, 5, 7, 9].includes(f);
  const isDoubleDotFret = (f: number) => f === 12;

  return (
    <div className="w-full bg-[#141210] rounded-2xl p-3 sm:p-5 border border-amber-950/40 shadow-2xl overflow-x-auto select-none">
      
      {/* Top Legend / Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-medium text-slate-300">
            {interactive ? 'Clique em qualquer casa ou corda solta para ouvir o som' : 'Visualização do braço'}
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-slate-500">
            {isInverted ? 'Visão: Corda 1 no topo (Padrão Tab)' : 'Visão: Corda 6 no topo (Olhando de cima)'}
          </span>
        </div>
      </div>

      {/* Main Fretboard Board Container */}
      <div className="min-w-[760px] relative rounded-xl border-y-4 border-amber-900/60 bg-gradient-to-b from-[#1c1815] via-[#241f1a] to-[#171310] shadow-inner py-3 px-2">
        
        {/* Inlay Position Marker Dots (embedded behind strings) */}
        <div className="absolute inset-0 pointer-events-none flex">
          {/* Fret 0 / Nut space */}
          <div className="w-16 flex-shrink-0" />
          
          {/* Frets 1 to totalFrets */}
          {Array.from({ length: totalFrets }, (_, i) => i + 1).map((fret) => (
            <div key={fret} className="flex-1 flex flex-col justify-center items-center relative">
              {isSingleDotFret(fret) && (
                <div className="w-3.5 h-3.5 rounded-full bg-amber-100/20 shadow-inner" />
              )}
              {isDoubleDotFret(fret) && (
                <div className="flex flex-col gap-6">
                  <div className="w-3.5 h-3.5 rounded-full bg-amber-100/20 shadow-inner" />
                  <div className="w-3.5 h-3.5 rounded-full bg-amber-100/20 shadow-inner" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Fretboard Grid & Strings */}
        <div className="relative z-10 flex flex-col space-y-4 sm:space-y-5">
          {strings.map((str) => {
            const isVibrating = activePluck?.stringNum === str.number;

            return (
              <div key={str.number} className="relative flex items-center h-8 sm:h-9">
                
                {/* Nut / Open String Tuning Box (Casa 0) */}
                <button
                  onClick={() => handlePluck(str.number, 0)}
                  style={{
                    borderColor: str.color,
                    boxShadow: isVibrating ? `0 0 15px ${str.color}` : undefined
                  }}
                  className={`w-16 flex-shrink-0 h-full rounded-l-lg border-2 flex items-center justify-between px-2 transition-all ${
                    isVibrating ? 'bg-slate-800 scale-105' : 'bg-slate-900/90 hover:bg-slate-800/80'
                  }`}
                  title={`Corda ${str.number} Solta (${str.name} / ${str.notePt}) - Clique para afinação`}
                >
                  <div className="flex flex-col items-start leading-tight">
                    <span className="font-mono font-bold text-xs" style={{ color: str.color }}>
                      {str.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-sans">
                      {str.number}ª {str.notePt}
                    </span>
                  </div>
                  <Volume2 className="w-3.5 h-3.5 opacity-60" style={{ color: str.color }} />
                </button>

                {/* Nut Bar (A Pestana Branca de Osso) */}
                <div className="w-2 h-full bg-gradient-to-r from-amber-100 to-amber-200 border-y border-amber-300 shadow-md flex-shrink-0" />

                {/* Frets for this string */}
                <div className="flex-1 flex h-full relative">
                  
                  {/* Metal String Line running across frets */}
                  <div 
                    className={`absolute inset-x-0 top-1/2 -translate-y-1/2 pointer-events-none transition-all ${
                      isVibrating ? 'string-vibrating' : ''
                    }`}
                    style={{
                      height: `${str.gauge + 0.5}px`,
                      backgroundColor: str.color,
                      opacity: 0.9,
                      boxShadow: isVibrating ? `0 0 10px ${str.color}, 0 0 4px white` : `0 1px 2px rgba(0,0,0,0.8)`
                    }}
                  />

                  {/* Frets cells 1..totalFrets */}
                  {Array.from({ length: totalFrets }, (_, i) => i + 1).map((fret) => {
                    const marker = getMarkerAt(str.number, fret);
                    const note = getNoteName(str.number, fret);
                    const isPlucked = activePluck?.stringNum === str.number && activePluck?.fret === fret;

                    return (
                      <div
                        key={fret}
                        onClick={() => handlePluck(str.number, fret)}
                        className={`flex-1 relative flex items-center justify-center border-r-2 border-slate-300/60 cursor-pointer group transition-colors ${
                          interactive ? 'hover:bg-white/5' : ''
                        }`}
                      >
                        {/* Interactive Click Indicator / Hover Preview */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/80 text-white shadow-lg border border-slate-600">
                            {note.en}
                          </span>
                        </div>

                        {/* Active Note Plucked Ripple */}
                        {isPlucked && (
                          <div 
                            className="absolute w-8 h-8 rounded-full animate-ping pointer-events-none"
                            style={{ backgroundColor: str.color, opacity: 0.7 }}
                          />
                        )}

                        {/* Finger Marker or Chord Position Badge */}
                        {marker ? (
                          <div
                            style={{
                              backgroundColor: str.color,
                              boxShadow: `0 0 12px ${str.color}`
                            }}
                            className="z-20 w-6 h-6 sm:w-7 sm:h-7 rounded-full text-slate-950 font-black text-xs flex items-center justify-center border-2 border-white shadow-lg transform transition-transform hover:scale-110"
                            title={`Corda ${str.number}, Casa ${fret}${marker.finger ? ` (Dedo ${marker.finger})` : ''}`}
                          >
                            {marker.finger !== undefined && marker.finger > 0 ? (
                              <span>{marker.finger}</span>
                            ) : marker.label ? (
                              <span className="text-[10px]">{marker.label}</span>
                            ) : (
                              <span>{note.en}</span>
                            )}
                          </div>
                        ) : showAllNoteLabels ? (
                          <div className="z-10 text-[10px] font-mono font-medium text-slate-400 bg-slate-900/60 px-1 rounded">
                            {note.en}
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>

              </div>
            );
          })}
        </div>

        {/* Fret Numbers on Bottom */}
        <div className="flex pt-3 text-xs text-slate-500 font-mono">
          <div className="w-16 text-center text-slate-400 font-bold">Solta</div>
          <div className="w-2" />
          {Array.from({ length: totalFrets }, (_, i) => i + 1).map((fret) => (
            <div key={fret} className="flex-1 text-center font-semibold">
              <span className={`px-1.5 py-0.5 rounded ${[3, 5, 7, 9, 12].includes(fret) ? 'text-amber-400 font-black bg-amber-400/10' : ''}`}>
                {fret}
              </span>
            </div>
          ))}
        </div>

      </div>

      {/* String Colors Legend */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs">
        {STRING_CONFIGS.map((str) => (
          <div 
            key={str.number}
            onClick={() => handlePluck(str.number, 0)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all hover:scale-105"
          >
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: str.color }} />
            <span className="font-semibold text-slate-200">{str.number}ª</span>
            <span className="text-slate-400 font-mono">({str.name} / {str.notePt})</span>
          </div>
        ))}
      </div>

    </div>
  );
};

