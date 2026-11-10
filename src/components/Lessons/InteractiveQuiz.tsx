import React, { useState } from 'react';
import { CheckCircle2, XCircle, ArrowRight, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuizProps {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  onComplete?: () => void;
}

export const InteractiveQuiz: React.FC<QuizProps> = ({
  question,
  options,
  correctIndex,
  explanation,
  onComplete,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);

  const handleSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedIndex(index);
    setIsAnswered(true);

    if (index === correctIndex) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
      if (onComplete) onComplete();
    }
  };

  const handleReset = () => {
    setSelectedIndex(null);
    setIsAnswered(false);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
      <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
        <Sparkles className="w-4 h-4" />
        <span>Desafio de Fixação Rápida</span>
      </div>

      <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
        {question}
      </h3>

      <div className="space-y-2.5">
        {options.map((option, idx) => {
          const isSelected = selectedIndex === idx;
          const isCorrect = idx === correctIndex;

          let btnClass = 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/60';
          if (isAnswered) {
            if (isCorrect) {
              btnClass = 'bg-emerald-950/80 border-emerald-500 text-emerald-200';
            } else if (isSelected && !isCorrect) {
              btnClass = 'bg-rose-950/80 border-rose-500 text-rose-200';
            } else {
              btnClass = 'opacity-40 border-slate-900 bg-slate-950 text-slate-500';
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={isAnswered}
              className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${btnClass}`}
            >
              <span>{option}</span>
              {isAnswered && (
                <div>
                  {isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  ) : isSelected ? (
                    <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                  ) : null}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <div className={`p-4 rounded-xl text-xs leading-relaxed ${
          selectedIndex === correctIndex
            ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300'
            : 'bg-rose-500/10 border border-rose-500/20 text-rose-300'
        }`}>
          <p className="font-bold mb-1">
            {selectedIndex === correctIndex ? '✨ Resposta Correta!' : '❌ Quase lá!'}
          </p>
          <p>{explanation}</p>

          {selectedIndex !== correctIndex && (
            <button
              onClick={handleReset}
              className="mt-3 px-3 py-1.5 rounded-lg bg-rose-900/60 hover:bg-rose-800 text-white font-semibold text-xs"
            >
              Tentar novamente
            </button>
          )}
        </div>
      )}
    </div>
  );
};

