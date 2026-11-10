import React, { useState, useEffect } from 'react';
import { CHORDS_DATA } from '../../data/chordsData';
import { ChordDefinition } from '../../types';
import { audioEngine, STRING_CONFIGS } from '../../services/audioEngine';
import { InteractiveFretboard } from '../Fretboard/InteractiveFretboard';
import { 
  Play, 
  RotateCcw, 
  Sparkles, 
  Trophy, 
  Music, 
  CheckCircle2, 
  HelpCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ChordTrainerProps {
  initialChordId?: string;
  isInvertedView?: boolean;
}

export const ChordTrainer: React.FC<ChordTrainerProps> = ({
  initialChordId = 'em',
  isInvertedView = false,
}) => {
  const [selectedChord, setSelectedChord] = useState<ChordDefinition>(
    CHORDS_DATA.find((c) => c.id === initialChordId) || CHORDS_DATA[0]
  );
  const [activeCategory, setActiveCategory] = useState<'todos' | 'iniciante' | 'abertos' | 'com pestana'>('todos');

  // Minigame State: Chord Switch Challenge (Rocksmith Style)
  const [isGameActive, setIsGameActive] = useState(false);
  const [targetChordA, setTargetChordA] = useState<ChordDefinition>(CHORDS_DATA[0]); // Em
  const [targetChordB, setTargetChordB] = useState<ChordDefinition>(CHORDS_DATA[4]); // G
  const [currentPrompt, setCurrentPrompt] = useState<'A' | 'B'>('A');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);

  const filteredChords = activeCategory === 'todos' 
    ? CHORDS_DATA 
    : CHORDS_DATA.filter(c => c.category === activeCategory);

  // Convert chord frets/fingers into FretMarker format for the fretboard
  const chordMarkers = React.useMemo(() => {
    const markers = [];
    for (let i = 0; i < 6; i++) {
      const stringNum = 6 - i; // 6, 5, 4, 3, 2, 1
      const fret = selectedChord.frets[i];
      const finger = selectedChord.fingers[i];

      if (fret > 0) {
        markers.push({
          string: stringNum,
          fret,
          finger,
          label: finger > 0 ? `D${finger}` : undefined
        });
      }
    }
    return markers;
  }, [selectedChord]);

  const handlePlayStrum = (dir: 'down' | 'up' = 'down') => {
    audioEngine.strumChord(selectedChord.frets, dir);
  };

  const handlePlayArpeggio = () => {
    audioEngine.arpeggiateChord(selectedChord.frets);
  };

  // Minigame Timer Loop
  useEffect(() => {
    let timer: any;
    if (isGameActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
        audioEngine.playClick(false);
      }, 1000);
    } else if (isGameActive && timeLeft === 0) {
      setIsGameActive(false);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
    return () => clearInterval(timer);
  }, [isGameActive, timeLeft]);

  const handleGameSwitch = () => {
    if (!isGameActive) return;
    setScore((s) => s + 1);
    const next = currentPrompt === 'A' ? 'B' : 'A';
    setCurrentPrompt(next);
    const targetChord = next === 'A' ? targetChordA : targetChordB;
    audioEngine.strumChord(targetChord.frets, 'down');
  };

  const startMinigame = () => {
    setIsGameActive(true);
    setScore(0);
    setTimeLeft(30);
    setCurrentPrompt('A');
    audioEngine.strumChord(targetChordA.frets, 'down');
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Dicionário Visual & Treinador de Troca</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Acordes Essenciais de Violão e Guitarra
            </h1>
            <p className="text-slate-400 text-sm max-w-xl">
              Veja exatamente onde posicionar cada dedo, escute o dedilhado para conferir se alguma corda está trastejando, e treine a velocidade da sua troca de acordes!
            </p>
          </div>

          {/* Quick Action Sound Buttons */}
          <div className="flex flex-wrap sm:flex-nowrap gap-3">
            <button
              onClick={() => handlePlayStrum('down')}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-sm shadow-lg shadow-rose-600/30 transition-all hover:scale-105 active:scale-95"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Tocar Batida ↓</span>
            </button>
            <button
              onClick={handlePlayArpeggio}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 transition-all hover:scale-105 active:scale-95"
              title="Escute corda por corda para checar se o som está limpo"
            >
              <Music className="w-4 h-4 text-amber-400" />
              <span>Ouvir Corda a Corda</span>
            </button>
          </div>
        </div>

        {/* Chord Filter Badges */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-6 border-t border-slate-800/80">
          <span className="text-xs font-medium text-slate-400 mr-2">Filtrar:</span>
          {(['todos', 'iniciante', 'abertos', 'com pestana'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                activeCategory === cat
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat === 'todos' ? 'Todos os Acordes' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Chord Selection Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {filteredChords.map((chord) => {
          const isSelected = selectedChord.id === chord.id;
          return (
            <button
              key={chord.id}
              onClick={() => {
                setSelectedChord(chord);
                audioEngine.strumChord(chord.frets, 'down');
              }}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'bg-slate-800 border-rose-500 shadow-lg shadow-rose-500/10 scale-102 ring-2 ring-rose-500/30'
                  : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xl font-black text-white">{chord.name}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  chord.difficulty === 'Fácil' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                  chord.difficulty === 'Médio' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                  'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}>
                  {chord.difficulty}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 line-clamp-1">{chord.fullName}</p>
            </button>
          );
        })}
      </div>

      {/* Current Chord Detailed View & Interactive Fretboard */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        
        {/* Chord Header & Strings Diagram Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-black text-white">{selectedChord.name}</h2>
              <span className="text-sm text-slate-400 font-medium">({selectedChord.fullName})</span>
            </div>
            <p className="text-slate-300 text-sm mt-2 max-w-2xl leading-relaxed">
              💡 <span className="font-semibold text-amber-400">Dica de Postura:</span> {selectedChord.tips}
            </p>
          </div>

          {/* Quick String Status Diagram (X = Mute, O = Open, Number = Fret) */}
          <div className="flex items-center gap-2 bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
            {selectedChord.frets.map((fret, idx) => {
              const stringNum = 6 - idx;
              const strConfig = STRING_CONFIGS.find(s => s.number === stringNum);
              const finger = selectedChord.fingers[idx];

              return (
                <div key={stringNum} className="flex flex-col items-center gap-1">
                  {/* Status Indicator */}
                  <div 
                    className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center ${
                      fret === -1
                        ? 'bg-rose-950/80 text-rose-400 border border-rose-800'
                        : fret === 0
                        ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                        : 'bg-slate-800 text-white border border-slate-700'
                    }`}
                  >
                    {fret === -1 ? 'X' : fret === 0 ? 'O' : `${fret}ª`}
                  </div>

                  {/* String Color Dot & Name */}
                  <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: strConfig?.color }} />
                    <span>{strConfig?.name}</span>
                  </div>

                  {/* Finger used */}
                  <span className="text-[9px] text-slate-500">
                    {finger > 0 ? `Dedo ${finger}` : fret === -1 ? 'Muda' : 'Solta'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Fretboard Rendering */}
        <div>
          <div className="text-xs font-semibold text-slate-400 mb-2 flex items-center justify-between">
            <span>Visualização no Braço (Casas 0 a 5):</span>
            <span className="text-indigo-400">Cores = Sistema Rocksmith | Números nos círculos = Dedos da mão</span>
          </div>
          <InteractiveFretboard
            markers={chordMarkers}
            totalFrets={5}
            isInverted={isInvertedView}
            interactive={true}
          />
        </div>

        {/* Famous Songs using this chord */}
        {selectedChord.commonInSongs.length > 0 && (
          <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Músicas famosas com este acorde:</span>
            {selectedChord.commonInSongs.map((song) => (
              <span key={song} className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-200 border border-slate-700">
                🎵 {song}
              </span>
            ))}
          </div>
        )}

      </div>

      {/* Rocksmith-Inspired "Desafio de Troca de Acordes" (Muscle Memory Minigame) */}
      <div className="bg-gradient-to-br from-indigo-950/40 via-slate-900 to-purple-950/30 border border-indigo-900/40 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <h3 className="text-xl font-bold text-white">Desafio Rocksmith: Treinador de Troca Rápida</h3>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              O maior desafio do iniciante é mudar de acorde a tempo. Treine a troca entre dois acordes em 30 segundos!
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Chord Pair Selectors */}
            <div className="flex items-center gap-2 text-xs">
              <select
                value={targetChordA.id}
                onChange={(e) => setTargetChordA(CHORDS_DATA.find(c => c.id === e.target.value) || CHORDS_DATA[0])}
                disabled={isGameActive}
                className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-bold"
              >
                {CHORDS_DATA.map(c => <option key={c.id} value={c.id}>Acorde A: {c.name}</option>)}
              </select>
              <ArrowRight className="w-4 h-4 text-slate-500" />
              <select
                value={targetChordB.id}
                onChange={(e) => setTargetChordB(CHORDS_DATA.find(c => c.id === e.target.value) || CHORDS_DATA[4])}
                disabled={isGameActive}
                className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-bold"
              >
                {CHORDS_DATA.map(c => <option key={c.id} value={c.id}>Acorde B: {c.name}</option>)}
              </select>
            </div>

            {!isGameActive ? (
              <button
                onClick={startMinigame}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all"
              >
                Iniciar Desafio (30s)
              </button>
            ) : (
              <button
                onClick={() => setIsGameActive(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold text-sm hover:bg-slate-700"
              >
                Parar
              </button>
            )}
          </div>
        </div>

        {/* Minigame Active Arena */}
        {isGameActive ? (
          <div className="bg-slate-950/80 rounded-2xl p-6 border border-indigo-500/30 flex flex-col items-center justify-center space-y-6 text-center animate-fade-in">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2 text-amber-400 font-mono text-lg font-bold">
                <Clock className="w-5 h-5" />
                <span>{timeLeft}s restantes</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400 font-mono text-lg font-bold">
                <Trophy className="w-5 h-5" />
                <span>{score} trocas perfeitas</span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs uppercase tracking-wider text-slate-400 font-bold">MUDE AGORA PARA O ACORDE:</p>
              <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-amber-300 to-emerald-400 animate-pulse">
                {currentPrompt === 'A' ? targetChordA.name : targetChordB.name}
              </div>
              <p className="text-sm text-slate-400">
                Posicione os dedos no seu violão/guitarra e clique no botão abaixo ou pressione a barra de espaço!
              </p>
            </div>

            <button
              onClick={handleGameSwitch}
              className="px-10 py-5 rounded-2xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-black text-lg shadow-2xl shadow-rose-600/40 hover:scale-105 active:scale-95 transition-all"
            >
              Troquei com Sucesso! 🎸 (Próximo)
            </button>
          </div>
        ) : score > 0 ? (
          <div className="bg-slate-950/80 rounded-2xl p-6 border border-amber-500/30 text-center space-y-3">
            <h4 className="text-xl font-bold text-amber-400">Fim do Treino! Pontuação: {score} trocas</h4>
            <p className="text-sm text-slate-300">
              {score >= 20 ? '🔥 Incrível! Sua memória muscular está no nível intermediário!' :
               score >= 12 ? '👏 Muito bom! Você já consegue acompanhar músicas com essa progressão.' :
               '💪 Ótimo começo! Repita mais 2 vezes hoje para fixar a posição dos dedos.'}
            </p>
            <button
              onClick={startMinigame}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-white hover:bg-slate-700 text-sm font-semibold"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Tentar Novamente</span>
            </button>
          </div>
        ) : null}

      </div>

    </div>
  );
};
