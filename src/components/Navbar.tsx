import React from 'react';
import { InstrumentType } from '../types';
import { audioEngine } from '../services/audioEngine';
import { 
  BookOpen, 
  Guitar, 
  Music2, 
  Zap, 
  Mic2, 
  Sliders, 
  HelpCircle, 
  Volume2, 
  VolumeX,
  Repeat
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  instrument: InstrumentType;
  onChangeInstrument: (inst: InstrumentType) => void;
  isInvertedView: boolean;
  onToggleInvertView: () => void;
  volume: number;
  onChangeVolume: (v: number) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  instrument,
  onChangeInstrument,
  isInvertedView,
  onToggleInvertView,
  volume,
  onChangeVolume,
}) => {
  const [isMuted, setIsMuted] = React.useState(false);
  const [prevVol, setPrevVol] = React.useState(volume);

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      onChangeVolume(prevVol || 0.8);
      audioEngine.setVolume(prevVol || 0.8);
    } else {
      setPrevVol(volume);
      setIsMuted(true);
      onChangeVolume(0);
      audioEngine.setVolume(0);
    }
  };

  const navItems = [
    { id: 'lessons', label: 'Trilha de Aulas', icon: BookOpen, badge: 'Iniciante' },
    { id: 'fretboard', label: 'Braço Interativo', icon: Guitar },
    { id: 'chords', label: 'Acordes & Treino', icon: Music2 },
    { id: 'riffs', label: 'Riff Flow', icon: Zap, highlight: true },
    { id: 'tuner', label: 'Afinador', icon: Mic2 },
    { id: 'guide', label: 'Violão vs Guitarra', icon: HelpCircle },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0c121e]/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelectTab('lessons')}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 via-amber-500 to-indigo-600 shadow-lg shadow-rose-500/20">
              <Guitar className="w-6 h-6 text-white" />
              {/* String color indicator dots */}
              <div className="absolute -bottom-1 flex gap-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  Fret<span className="text-rose-500">Flow</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  Visual
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Método intuitivo para violão e guitarra</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800/80">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all relative ${
                    isActive
                      ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-md shadow-rose-600/25'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge && !isActive && (
                    <span className="text-[10px] font-semibold px-1 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {item.badge}
                    </span>
                  )}
                  {item.highlight && !isActive && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Audio & Settings Toolbar */}
          <div className="flex items-center gap-3">
            
            {/* Instrument Toggle: Violão vs Guitarra */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
              <button
                onClick={() => {
                  onChangeInstrument('acoustic');
                  audioEngine.setInstrument('acoustic');
                  audioEngine.playNote(5, 0, 1.2, 0.8);
                }}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
                  instrument === 'acoustic'
                    ? 'bg-amber-600/90 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Timbre de Violão Acústico"
              >
                <span>Violão</span>
              </button>
              <button
                onClick={() => {
                  onChangeInstrument('electric');
                  audioEngine.setInstrument('electric');
                  audioEngine.playNote(5, 0, 1.2, 0.8);
                }}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
                  instrument === 'electric'
                    ? 'bg-rose-600/90 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Timbre de Guitarra Elétrica com Overdrive"
              >
                <span>Guitarra</span>
              </button>
            </div>

            {/* Invert Perspective Button (Rocksmith feature) */}
            <button
              onClick={onToggleInvertView}
              className={`p-2 rounded-lg border text-xs flex items-center gap-1.5 transition-colors ${
                isInvertedView 
                  ? 'bg-indigo-950/60 border-indigo-700/60 text-indigo-300' 
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title={isInvertedView ? 'Visão: Corda 1 no topo (Padrão Tablatura)' : 'Visão: Corda 6 no topo (Visão do Tocador olhando para baixo)'}
            >
              <Repeat className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {isInvertedView ? 'Modo Tab' : 'Modo Rocksmith'}
              </span>
            </button>

            {/* Volume Control */}
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1">
              <button 
                onClick={toggleMute}
                className="text-slate-400 hover:text-white transition-colors"
                title={isMuted ? 'Desmutar' : 'Mutar som'}
              >
                {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  onChangeVolume(val);
                  setIsMuted(val === 0);
                  audioEngine.setVolume(val);
                }}
                className="w-14 sm:w-18 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
            </div>

          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex lg:hidden overflow-x-auto py-2 gap-1 border-t border-slate-800/80 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-rose-600 text-white'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-900/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};

