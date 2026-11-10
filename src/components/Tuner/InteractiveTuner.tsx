import React, { useState, useEffect } from 'react';
import { STRING_CONFIGS, audioEngine } from '../../services/audioEngine';
import { tunerEngine, TunerResult } from '../../services/tunerEngine';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  HelpCircle, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

export const InteractiveTuner: React.FC = () => {
  const [isMicActive, setIsMicActive] = useState<boolean>(false);
  const [tunerData, setTunerData] = useState<TunerResult | null>(null);
  const [activeManualString, setActiveManualString] = useState<typeof STRING_CONFIGS[0] | null>(null);
  const [micError, setMicError] = useState<string | null>(null);

  const toggleMic = async () => {
    if (isMicActive) {
      tunerEngine.stopListening();
      setIsMicActive(false);
      setTunerData(null);
    } else {
      setMicError(null);
      const success = await tunerEngine.startListening((res) => {
        setTunerData(res);
      });
      if (success) {
        setIsMicActive(true);
      } else {
        setMicError('Não foi possível acessar seu microfone. Verifique as permissões do navegador ou use o modo por ouvido abaixo!');
      }
    }
  };

  useEffect(() => {
    return () => {
      tunerEngine.stopListening();
    };
  }, []);

  const playReferenceTone = (str: typeof STRING_CONFIGS[0]) => {
    setActiveManualString(str);
    audioEngine.playNote(str.number, 0, 3.5, 0.9);
  };

  const currentString = tunerData?.closestString || activeManualString || STRING_CONFIGS[0];
  const diffCents = tunerData ? tunerData.diffCents : 0;
  const isInTune = tunerData ? tunerData.inTune : false;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/20 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Afinador Rocksmith de Precisão</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Afine Seu Violão ou Guitarra
            </h1>
            <p className="text-slate-400 text-sm max-w-lg">
              No Rocksmith, afinar antes de cada sessão é sagrado! Toque a corda no seu instrumento com o microfone ativado, ou clique para afinar de ouvido.
            </p>
          </div>

          {/* Microphone Activation Button */}
          <div>
            <button
              onClick={toggleMic}
              className={`flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-bold text-sm shadow-xl transition-all hover:scale-105 active:scale-95 ${
                isMicActive
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-white shadow-emerald-500/30'
              }`}
            >
              {isMicActive ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              <span>{isMicActive ? 'Desativar Microfone' : 'Ativar Microfone ao Vivo'}</span>
            </button>
          </div>
        </div>

        {micError && (
          <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{micError}</span>
          </div>
        )}
      </div>

      {/* Main Tuner Gauge Dial */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8 text-center shadow-2xl relative overflow-hidden">
        
        {/* String Glow background */}
        <div 
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl opacity-15 pointer-events-none transition-colors"
          style={{ backgroundColor: currentString.color }}
        />

        {/* Note Target Display */}
        <div className="space-y-1 relative z-10">
          <div className="flex items-center justify-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: currentString.color }} />
            <span className="text-xs uppercase font-bold tracking-widest text-slate-400">
              {currentString.number}ª Corda ({currentString.notePt})
            </span>
          </div>
          
          <div className="text-7xl font-black font-mono tracking-tight text-white drop-shadow-md">
            {currentString.name}
          </div>

          <div className="text-xs font-mono text-slate-400">
            Frequência Alvo: <span className="text-slate-200 font-semibold">{currentString.baseFreq.toFixed(1)} Hz</span>
            {tunerData && (
              <span className="ml-3 text-emerald-400">
                Detectado: {tunerData.detectedFreq.toFixed(1)} Hz
              </span>
            )}
          </div>
        </div>

        {/* Visual Needle / Meter */}
        <div className="max-w-md mx-auto space-y-3 relative z-10">
          
          {/* Cent indicators */}
          <div className="flex justify-between text-[11px] font-mono text-slate-500 px-2">
            <span>-50¢ (Grave)</span>
            <span className="text-emerald-400 font-bold">0 (Perfeito)</span>
            <span>+50¢ (Agudo)</span>
          </div>

          {/* Meter Bar */}
          <div className="h-6 bg-slate-950 rounded-full border border-slate-800 relative flex items-center px-1 overflow-hidden">
            {/* Center target line */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 bg-emerald-500/80 z-10 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            
            {/* Tolerable In-Tune Zone */}
            <div className="absolute left-[45%] right-[45%] top-0 bottom-0 bg-emerald-500/15" />

            {/* Sliding Needle */}
            <div 
              className={`absolute top-1 bottom-1 w-3 rounded-full transition-all duration-100 shadow-md ${
                isInTune 
                  ? 'bg-emerald-400 shadow-[0_0_15px_#34d399]' 
                  : 'bg-rose-500 shadow-[0_0_10px_#f43f5e]'
              }`}
              style={{
                left: `${Math.max(5, Math.min(95, 50 + (diffCents / 50) * 45))}%`,
                transform: 'translateX(-50%)'
              }}
            />
          </div>

          {/* Feedback Message */}
          <div className="h-6">
            {isMicActive ? (
              tunerData ? (
                isInTune ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 animate-bounce">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Na afinação! Perfeito! ✨</span>
                  </span>
                ) : diffCents < -4 ? (
                  <span className="text-xs font-semibold text-amber-400">
                    Aperte a tarracha (Som está baixo/frouxo)
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-rose-400">
                    Afrouxe a tarracha (Som está muito alto/esticado)
                  </span>
                )
              ) : (
                <span className="text-xs text-slate-500 animate-pulse">
                  Toque uma corda solta no seu instrumento...
                </span>
              )
            ) : (
              <span className="text-xs text-slate-500">
                Clique nas tarrachas abaixo para ouvir o som de referência de cada corda
              </span>
            )}
          </div>
        </div>

      </div>

      {/* Headstock / 6 Tuning Pegs Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-300 text-center uppercase tracking-wider">
          Afinação por Ouvido (Clique para escutar)
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {STRING_CONFIGS.map((str) => {
            const isSelected = currentString.number === str.number;

            return (
              <button
                key={str.number}
                onClick={() => playReferenceTone(str)}
                style={{
                  borderColor: isSelected ? str.color : undefined
                }}
                className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center gap-2 ${
                  isSelected
                    ? 'bg-slate-800 shadow-lg scale-105'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
                }`}
              >
                {/* String Indicator */}
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-mono font-black text-lg text-slate-950 shadow-md"
                  style={{ backgroundColor: str.color }}
                >
                  {str.name}
                </div>

                <div>
                  <div className="text-xs font-bold text-slate-200">
                    {str.number}ª Corda
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {str.notePt} ({str.colorName})
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono">
                  <Volume2 className="w-3 h-3 text-slate-400" />
                  <span>{str.baseFreq.toFixed(0)} Hz</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};

