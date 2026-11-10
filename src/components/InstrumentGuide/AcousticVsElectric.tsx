import React, { useState } from 'react';
import { audioEngine } from '../../services/audioEngine';
import { 
  Guitar, 
  HelpCircle, 
  Check, 
  Volume2, 
  ShieldCheck, 
  Flame, 
  Sparkles,
  Heart
} from 'lucide-react';

export const AcousticVsElectric: React.FC = () => {
  const [selectedInst, setSelectedInst] = useState<'nylon' | 'steel' | 'electric'>('nylon');

  const playDemo = (type: 'acoustic' | 'electric') => {
    audioEngine.setInstrument(type);
    // Play sweet chord Em -> G
    audioEngine.strumChord([0, 2, 2, 0, 0, 0], 'down', 30);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Guia Definitivo do Iniciante</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Violão ou Guitarra: Qual Escolher para Começar?
          </h1>
          <p className="text-slate-400 text-sm max-w-2xl">
            Existe um mito clássico de que "você precisa começar pelo violão antes da guitarra". Desmistificamos tudo de forma honesta e prática para você fazer a melhor escolha!
          </p>
        </div>
      </div>

      {/* 3 Main Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Violão Nylon */}
        <div 
          onClick={() => setSelectedInst('nylon')}
          className={`p-6 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
            selectedInst === 'nylon'
              ? 'bg-slate-800 border-amber-500 shadow-xl shadow-amber-500/10 ring-2 ring-amber-500/20'
              : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold">
              <Guitar className="w-6 h-6" />
            </div>

            <div>
              <div className="text-xs uppercase font-bold text-amber-400 tracking-wider">O Mais Amigável</div>
              <h3 className="text-xl font-black text-white mt-0.5">Violão de Nylon</h3>
              <p className="text-xs text-slate-400 mt-1">
                Cordas super macias, perfeitas para quem tem medo de dor nos dedos nas primeiras semanas.
              </p>
            </div>

            <div className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Cordas macias que não cortam a ponta dos dedos</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Não precisa de cabos, bateria ou amplificador</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Ideal para MPB, Bossa Nova, Sertanejo e Pop acústico</span>
              </div>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              playDemo('acoustic');
            }}
            className="mt-6 w-full py-2.5 rounded-xl bg-amber-600/20 hover:bg-amber-600 text-amber-300 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all"
          >
            <Volume2 className="w-4 h-4" />
            <span>Ouvir Timbre</span>
          </button>
        </div>

        {/* Violão Aço */}
        <div 
          onClick={() => setSelectedInst('steel')}
          className={`p-6 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
            selectedInst === 'steel'
              ? 'bg-slate-800 border-rose-500 shadow-xl shadow-rose-500/10 ring-2 ring-rose-500/20'
              : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 font-bold">
              <Flame className="w-6 h-6" />
            </div>

            <div>
              <div className="text-xs uppercase font-bold text-rose-400 tracking-wider">O Som Pop / Folk</div>
              <h3 className="text-xl font-black text-white mt-0.5">Violão de Aço (Folk)</h3>
              <p className="text-xs text-slate-400 mt-1">
                Som brilhante, encorpado e com volume alto. O padrão da música americana e rock acústico.
              </p>
            </div>

            <div className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Timbre rico e brilhante com muita presença</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Braço mais fino e confortável que o de nylon</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span>Exige 1 a 2 semanas até criar calos nos dedos</span>
              </div>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              playDemo('acoustic');
            }}
            className="mt-6 w-full py-2.5 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all"
          >
            <Volume2 className="w-4 h-4" />
            <span>Ouvir Timbre</span>
          </button>
        </div>

        {/* Guitarra Elétrica */}
        <div 
          onClick={() => setSelectedInst('electric')}
          className={`p-6 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
            selectedInst === 'electric'
              ? 'bg-slate-800 border-indigo-500 shadow-xl shadow-indigo-500/10 ring-2 ring-indigo-500/20'
              : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
              <Sparkles className="w-6 h-6" />
            </div>

            <div>
              <div className="text-xs uppercase font-bold text-indigo-400 tracking-wider">A Preferida do Rock</div>
              <h3 className="text-xl font-black text-white mt-0.5">Guitarra Elétrica</h3>
              <p className="text-xs text-slate-400 mt-1">
                Braço fino, cordas com baixíssima tensão e versatilidade ilimitada com distorção e fones de ouvido!
              </p>
            </div>

            <div className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Cordas muito macias (tensão mais baixa que violão)</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Pode tocar com fone de ouvido sem incomodar vizinhos</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span>Necessita de amplificador ou interface de áudio no PC</span>
              </div>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              playDemo('electric');
            }}
            className="mt-6 w-full py-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all"
          >
            <Volume2 className="w-4 h-4" />
            <span>Ouvir com Drive</span>
          </button>
        </div>

      </div>

      {/* Essential Beginner Tips & Myths */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>3 Verdades que Todo Professor Deveria Dizer no 1º Dia</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs leading-relaxed">
          
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-amber-400 text-sm">1. A dor na ponta dos dedos passa em 7 dias!</h4>
            <p className="text-slate-300">
              Não desista! Nos primeiros 4 a 7 dias, a pele fina das pontas dos dedos arde um pouco. O corpo humano é maravilhoso: em poucos dias uma camada resistente de calo protetor se forma e você nunca mais sente desconforto.
            </p>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-rose-400 text-sm">2. Se o instrumento for duro, regule a "Ação"!</h4>
            <p className="text-slate-300">
              Muitos iniciantes compram um violão e acham que tocar é quase impossível. O motivo? As cordas vieram muito altas longe do braço! Leve a um luthier ou amigo experiente para abaixar o rastilho/tensor. O instrumento vira uma manteiga!
            </p>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-indigo-400 text-sm">3. 15 minutos por dia é melhor que 2 horas no sábado</h4>
            <p className="text-slate-300">
              A memória muscular se consolida durante o sono! Tocar 15 a 20 minutos todos os dias trará 10 vezes mais resultado do que uma maratona de 3 horas apenas uma vez na semana que só cansa sua mão.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};

