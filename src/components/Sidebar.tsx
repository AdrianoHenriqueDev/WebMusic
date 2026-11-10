import React, { useState } from 'react';
import { InstrumentType } from '../types';
import { audioEngine } from '../services/audioEngine';
import { 
  BookOpen, 
  Guitar, 
  Music2, 
  Zap, 
  Mic2, 
  HelpCircle, 
  Flame, 
  BookMarked, 
  Volume2, 
  VolumeX, 
  Repeat,
  Menu,
  X,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  instrument: InstrumentType;
  onChangeInstrument: (inst: InstrumentType) => void;
  isInvertedView: boolean;
  onToggleInvertView: () => void;
  volume: number;
  onChangeVolume: (v: number) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  instrument,
  onChangeInstrument,
  isInvertedView,
  onToggleInvertView,
  volume,
  onChangeVolume,
}) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [prevVol, setPrevVol] = useState(volume);

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
    { id: 'songs', label: 'Músicas Cifradas', icon: BookMarked },
    { id: 'workout', label: 'Treino 15 Min', icon: Flame, badge: 'Diário' },
    { id: 'tuner', label: 'Afinador', icon: Mic2 },
    { id: 'guide', label: 'Violão vs Guitarra', icon: HelpCircle },
  ];

  const handleNavClick = (tabId: string) => {
    onSelectTab(tabId);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* ======================================================== */}
      {/* 1. TOP BAR FOR MOBILE / TABLET (visível apenas em < lg) */}
      {/* ======================================================== */}
      <header className="lg:hidden sticky top-0 z-40 bg-[#0c121e]/95 backdrop-blur-md border-b border-slate-800 px-4 h-16 flex items-center justify-between">
        
        {/* Left: Hamburger Button + Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileOpen(true)}
            aria-label="Abrir menu de navegação"
            className="p-2 -ml-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-white hover:bg-slate-800 active:scale-95 transition-all"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div 
            onClick={() => handleNavClick('lessons')} 
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 via-amber-500 to-indigo-600 flex items-center justify-center shadow-md">
              <Guitar className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-black tracking-tight text-white">
              Fret<span className="text-rose-500">Flow</span>
            </span>
          </div>
        </div>

        {/* Right: Preserved Text Mode Switch Button (Modo Tab vs Modo Rocksmith) */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleInvertView}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-sm ${
              isInvertedView 
                ? 'bg-indigo-950/80 border-indigo-600 text-indigo-300 ring-1 ring-indigo-500/30' 
                : 'bg-rose-950/80 border-rose-600 text-rose-300 ring-1 ring-rose-500/30'
            }`}
            title={isInvertedView ? 'Visão: Corda 1 no topo (Padrão Tablatura)' : 'Visão: Corda 6 no topo (Visão do Tocador olhando para baixo)'}
          >
            <Repeat className="w-3.5 h-3.5 flex-shrink-0" />
            {/* Texto sempre preservado no mobile conforme solicitado */}
            <span className="text-[11px] font-black uppercase tracking-tight">
              {isInvertedView ? 'Modo Tab' : 'Modo Rocksmith'}
            </span>
          </button>
        </div>
      </header>

      {/* ======================================================== */}
      {/* 2. MOBILE DRAWER SLIDEOVER (Menu lateral no celular)    */}
      {/* ======================================================== */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity animate-fade-in"
            onClick={() => setIsMobileOpen(false)}
          />

          {/* Drawer container */}
          <div className="relative w-80 max-w-[85vw] bg-[#0c121e] border-r border-slate-800 p-5 flex flex-col justify-between overflow-y-auto shadow-2xl z-10 animate-slide-right">
            
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 via-amber-500 to-indigo-600 flex items-center justify-center shadow-md">
                    <Guitar className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-lg font-black text-white">
                        Fret<span className="text-rose-500">Flow</span>
                      </span>
                      <span className="text-[9px] uppercase font-bold px-1 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                        Visual
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400">Violão & Guitarra Intuitivo</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                  aria-label="Fechar menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Items in Drawer */}
              <nav className="space-y-1.5">
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-2 mb-2">
                  Navegação
                </div>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-white font-bold shadow-md shadow-rose-600/20'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
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
            </div>

            {/* Bottom Controls in Drawer */}
            <div className="pt-6 border-t border-slate-800 space-y-4">
              
              {/* Perspective Button with Full Explanatory Text */}
              <div className="space-y-1.5">
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  Orientação das Cordas
                </div>
                <button
                  onClick={onToggleInvertView}
                  className={`w-full p-3 rounded-xl border text-left transition-all ${
                    isInvertedView
                      ? 'bg-indigo-950/70 border-indigo-600 text-white'
                      : 'bg-rose-950/70 border-rose-600 text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Repeat className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-black">
                        {isInvertedView ? 'Modo Tablatura Ativo' : 'Modo Rocksmith Ativo'}
                      </div>
                      <div className="text-[11px] text-slate-300 mt-0.5">
                        {isInvertedView 
                          ? 'Corda 1 (Mi agudo) no topo' 
                          : 'Corda 6 (Mi grave) no topo (Visão de cima)'}
                      </div>
                    </div>
                  </div>
                </button>
              </div>

              {/* Instrument Toggle */}
              <div className="space-y-1.5">
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  Timbre do Instrumento
                </div>
                <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
                  <button
                    onClick={() => {
                      onChangeInstrument('acoustic');
                      audioEngine.setInstrument('acoustic');
                      audioEngine.playNote(5, 0, 1.2, 0.8);
                    }}
                    className={`py-2 text-xs font-bold rounded-lg transition-all ${
                      instrument === 'acoustic'
                        ? 'bg-amber-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Violão Acústico
                  </button>
                  <button
                    onClick={() => {
                      onChangeInstrument('electric');
                      audioEngine.setInstrument('electric');
                      audioEngine.playNote(5, 0, 1.2, 0.8);
                    }}
                    className={`py-2 text-xs font-bold rounded-lg transition-all ${
                      instrument === 'electric'
                        ? 'bg-rose-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Guitarra Elétrica
                  </button>
                </div>
              </div>

              {/* Volume */}
              <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
                <button 
                  onClick={toggleMute}
                  className="text-slate-400 hover:text-white flex items-center gap-2 text-xs font-medium"
                >
                  {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-slate-400" />}
                  <span>{isMuted ? 'Mudo' : `${Math.round(volume * 100)}%`}</span>
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
                  className="w-28 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. DESKTOP PERMANENT SIDEBAR (Visível em lg: e acima)    */}
      {/* ======================================================== */}
      <aside className="hidden lg:flex w-64 xl:w-72 bg-[#0c121e]/95 backdrop-blur-md border-r border-slate-800 h-screen sticky top-0 flex-col justify-between p-5 z-30 select-none">
        
        {/* Top: Brand & Menu Links */}
        <div className="space-y-6">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => onSelectTab('lessons')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 via-amber-500 to-indigo-600 shadow-lg shadow-rose-500/20 group-hover:scale-105 transition-transform">
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
                <span className="text-xl font-black tracking-tight text-white">
                  Fret<span className="text-rose-500">Flow</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  Visual
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Violão & Guitarra Intuitivo</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-3 mb-2">
              Menu Principal
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-white font-bold shadow-md shadow-rose-600/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
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

        </div>

        {/* Bottom: Settings & Tools */}
        <div className="pt-4 border-t border-slate-800/80 space-y-3">
          
          {/* Rocksmith / Tab Mode Switch Button with Clear Descriptive Text */}
          <button
            onClick={onToggleInvertView}
            className={`w-full p-2.5 rounded-xl border text-left transition-all hover:scale-102 ${
              isInvertedView 
                ? 'bg-indigo-950/70 border-indigo-600 text-white' 
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
            }`}
            title="Alterne a perspectiva das cordas no braço interativo"
          >
            <div className="flex items-center gap-2.5">
              <Repeat className={`w-4 h-4 flex-shrink-0 ${isInvertedView ? 'text-indigo-400' : 'text-rose-400'}`} />
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>{isInvertedView ? 'Modo Tablatura' : 'Modo Rocksmith'}</span>
                  <span className="text-[9px] px-1 rounded bg-slate-800 text-slate-400 font-normal">
                    {isInvertedView ? '1ª no topo' : '6ª no topo'}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400">
                  {isInvertedView ? 'Padrão tradicional de cifras' : 'Visão do tocador (olhando de cima)'}
                </div>
              </div>
            </div>
          </button>

          {/* Instrument Selector Toggle */}
          <div className="grid grid-cols-2 gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => {
                onChangeInstrument('acoustic');
                audioEngine.setInstrument('acoustic');
                audioEngine.playNote(5, 0, 1.2, 0.8);
              }}
              className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                instrument === 'acoustic'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Violão
            </button>
            <button
              onClick={() => {
                onChangeInstrument('electric');
                audioEngine.setInstrument('electric');
                audioEngine.playNote(5, 0, 1.2, 0.8);
              }}
              className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                instrument === 'electric'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Guitarra
            </button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center justify-between bg-slate-950 px-3 py-2 rounded-xl border border-slate-800">
            <button 
              onClick={toggleMute}
              className="text-slate-400 hover:text-white flex items-center gap-2 text-xs font-medium"
              title={isMuted ? 'Desmutar' : 'Mutar som'}
            >
              {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-slate-400" />}
              <span className="text-[11px] font-mono">{isMuted ? 'Mudo' : `${Math.round(volume * 100)}%`}</span>
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
              className="w-24 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
          </div>

        </div>

      </aside>
    </>
  );
};
