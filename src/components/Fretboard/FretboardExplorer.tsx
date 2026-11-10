import React, { useState } from 'react';
import { InteractiveFretboard } from './InteractiveFretboard';
import { STRING_CONFIGS } from '../../services/audioEngine';
import { FretMarker } from '../../types';
import { Sparkles, Eye, Filter } from 'lucide-react';

interface FretboardExplorerProps {
  isInvertedView?: boolean;
}

export const FretboardExplorer: React.FC<FretboardExplorerProps> = ({
  isInvertedView = false,
}) => {
  const [showAllNotes, setShowAllNotes] = useState<boolean>(false);
  const [selectedScale, setSelectedScale] = useState<'none' | 'penta_em' | 'penta_am' | 'natural_c'>('none');

  // Pentatonic scale positions
  const getScaleMarkers = (): FretMarker[] => {
    if (selectedScale === 'penta_em') {
      // Em Pentatonic (0, 3) (0, 2) (0, 2) (0, 2) (0, 3) (0, 3)
      return [
        { string: 6, fret: 0, label: 'E' }, { string: 6, fret: 3, label: 'G' },
        { string: 5, fret: 0, label: 'A' }, { string: 5, fret: 2, label: 'B' },
        { string: 4, fret: 0, label: 'D' }, { string: 4, fret: 2, label: 'E' },
        { string: 3, fret: 0, label: 'G' }, { string: 3, fret: 2, label: 'A' },
        { string: 2, fret: 0, label: 'B' }, { string: 2, fret: 3, label: 'D' },
        { string: 1, fret: 0, label: 'E' }, { string: 1, fret: 3, label: 'G' },
      ];
    }
    if (selectedScale === 'penta_am') {
      // Am Pentatonic Box 1 on fret 5 (5, 8) (5, 7) (5, 7) (5, 7) (5, 8) (5, 8)
      return [
        { string: 6, fret: 5, finger: 1, label: 'A' }, { string: 6, fret: 8, finger: 4, label: 'C' },
        { string: 5, fret: 5, finger: 1, label: 'D' }, { string: 5, fret: 7, finger: 3, label: 'E' },
        { string: 4, fret: 5, finger: 1, label: 'G' }, { string: 4, fret: 7, finger: 3, label: 'A' },
        { string: 3, fret: 5, finger: 1, label: 'C' }, { string: 3, fret: 7, finger: 3, label: 'D' },
        { string: 2, fret: 5, finger: 1, label: 'E' }, { string: 2, fret: 8, finger: 4, label: 'G' },
        { string: 1, fret: 5, finger: 1, label: 'A' }, { string: 1, fret: 8, finger: 4, label: 'C' },
      ];
    }
    return [];
  };

  const scaleMarkers = getScaleMarkers();

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Explorador Visual Livre</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Braço Interativo Completo
            </h1>
            <p className="text-slate-400 text-sm max-w-xl">
              Clique nas cordas e casas para descobrir cada nota, treinar o ouvido e visualizar os mapas de escalas mais famosos do Rock!
            </p>
          </div>

          {/* Quick Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowAllNotes(!showAllNotes)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                showAllNotes
                  ? 'bg-rose-600 border-rose-500 text-white'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>{showAllNotes ? 'Ocultar Todas as Notas' : 'Mostrar Todas as Notas'}</span>
            </button>

            {/* Scale Filter Dropdown */}
            <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedScale}
                onChange={(e) => setSelectedScale(e.target.value as any)}
                className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
              >
                <option value="none">Nenhuma Escala (Livre)</option>
                <option value="penta_em">Pentatônica de Mi Menor (Em Solta)</option>
                <option value="penta_am">Pentatônica de Lá Menor (Am na 5ª Casa)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Fretboard */}
      <div className="space-y-4">
        {selectedScale !== 'none' && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center justify-between">
            <span>
              ⭐ <strong>Escala Pentatônica Ativa:</strong> As notas destacadas em círculos são o "molho secreto" para solos de Rock e Blues!
            </span>
          </div>
        )}

        <InteractiveFretboard
          markers={scaleMarkers}
          totalFrets={12}
          isInverted={isInvertedView}
          interactive={true}
          showAllNoteLabels={showAllNotes}
        />
      </div>

    </div>
  );
};

