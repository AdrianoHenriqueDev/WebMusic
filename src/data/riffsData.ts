import { RiffSong } from '../types';

export const RIFFS_DATA: RiffSong[] = [
  {
    id: 'smoke-on-the-water',
    title: 'Smoke on the Water',
    artist: 'Deep Purple',
    tempo: 112,
    difficulty: 'Fácil (1 corda)',
    description: 'O riff mais famoso do planeta! Toque na 4ª corda (Azul / Ré) usando as casas 0, 3 e 5. Simples e poderoso!',
    backingTone: 'electric',
    totalDurationMs: 8000,
    notes: [
      { timeMs: 400,  durationMs: 450, string: 4, fret: 0, label: '0' },
      { timeMs: 950,  durationMs: 450, string: 4, fret: 3, label: '3' },
      { timeMs: 1500, durationMs: 650, string: 4, fret: 5, label: '5' },
      
      { timeMs: 2400, durationMs: 450, string: 4, fret: 0, label: '0' },
      { timeMs: 2950, durationMs: 450, string: 4, fret: 3, label: '3' },
      { timeMs: 3500, durationMs: 350, string: 4, fret: 6, label: '6' },
      { timeMs: 3950, durationMs: 650, string: 4, fret: 5, label: '5' },

      { timeMs: 4900, durationMs: 450, string: 4, fret: 0, label: '0' },
      { timeMs: 5450, durationMs: 450, string: 4, fret: 3, label: '3' },
      { timeMs: 6000, durationMs: 650, string: 4, fret: 5, label: '5' },
      { timeMs: 6800, durationMs: 400, string: 4, fret: 3, label: '3' },
      { timeMs: 7300, durationMs: 700, string: 4, fret: 0, label: '0' },
    ]
  },
  {
    id: 'come-as-you-are',
    title: 'Come As You Are',
    artist: 'Nirvana',
    tempo: 120,
    difficulty: 'Básico',
    description: 'Ícone dos anos 90! Perfeito para treinar a transição entre a 6ª corda (Vermelha) e a 5ª corda (Amarela).',
    backingTone: 'electric',
    totalDurationMs: 6500,
    notes: [
      { timeMs: 300,  durationMs: 380, string: 6, fret: 0, label: '0' },
      { timeMs: 700,  durationMs: 380, string: 6, fret: 0, label: '0' },
      { timeMs: 1100, durationMs: 380, string: 6, fret: 1, label: '1', finger: 1 },
      { timeMs: 1500, durationMs: 380, string: 6, fret: 2, label: '2', finger: 2 },
      { timeMs: 1900, durationMs: 380, string: 5, fret: 0, label: '0' },
      { timeMs: 2300, durationMs: 380, string: 6, fret: 2, label: '2', finger: 2 },
      { timeMs: 2700, durationMs: 380, string: 5, fret: 0, label: '0' },
      { timeMs: 3100, durationMs: 380, string: 6, fret: 2, label: '2', finger: 2 },
      { timeMs: 3500, durationMs: 380, string: 6, fret: 2, label: '2', finger: 2 },
      { timeMs: 3900, durationMs: 380, string: 6, fret: 1, label: '1', finger: 1 },
      { timeMs: 4300, durationMs: 380, string: 6, fret: 0, label: '0' },
      { timeMs: 4700, durationMs: 380, string: 5, fret: 2, label: '2', finger: 2 },
      { timeMs: 5100, durationMs: 380, string: 6, fret: 0, label: '0' },
      { timeMs: 5500, durationMs: 380, string: 6, fret: 0, label: '0' },
    ]
  },
  {
    id: 'seven-nation-army',
    title: 'Seven Nation Army',
    artist: 'The White Stripes',
    tempo: 124,
    difficulty: 'Fácil (1 corda)',
    description: 'Você já ouviu esse baixo contagiante nos estádios de futebol. Tocado inteiramente na 5ª corda (Amarela / Lá).',
    backingTone: 'acoustic',
    totalDurationMs: 6000,
    notes: [
      { timeMs: 400,  durationMs: 700, string: 5, fret: 7,  label: '7',  finger: 3 },
      { timeMs: 1200, durationMs: 350, string: 5, fret: 7,  label: '7',  finger: 3 },
      { timeMs: 1650, durationMs: 450, string: 5, fret: 10, label: '10', finger: 4 },
      { timeMs: 2200, durationMs: 550, string: 5, fret: 7,  label: '7',  finger: 3 },
      { timeMs: 2900, durationMs: 700, string: 5, fret: 5,  label: '5',  finger: 1 },
      { timeMs: 3800, durationMs: 900, string: 5, fret: 3,  label: '3',  finger: 1 },
      { timeMs: 4900, durationMs: 950, string: 5, fret: 2,  label: '2',  finger: 1 },
    ]
  },
  {
    id: 'iron-man',
    title: 'Iron Man',
    artist: 'Black Sabbath',
    tempo: 76,
    difficulty: 'Intermediário',
    description: 'O riff mais pesado do mestre Tony Iommi na 6ª corda (Vermelha). Treine saltar casas no braço.',
    backingTone: 'electric',
    totalDurationMs: 6500,
    notes: [
      { timeMs: 400,  durationMs: 500, string: 6, fret: 2,  label: '2' },
      { timeMs: 1200, durationMs: 500, string: 6, fret: 5,  label: '5' },
      { timeMs: 2000, durationMs: 350, string: 6, fret: 5,  label: '5' },
      { timeMs: 2500, durationMs: 500, string: 6, fret: 7,  label: '7' },
      { timeMs: 3300, durationMs: 500, string: 6, fret: 7,  label: '7' },
      { timeMs: 4100, durationMs: 200, string: 6, fret: 10, label: '10' },
      { timeMs: 4350, durationMs: 200, string: 6, fret: 9,  label: '9' },
      { timeMs: 4600, durationMs: 200, string: 6, fret: 10, label: '10' },
      { timeMs: 4850, durationMs: 200, string: 6, fret: 9,  label: '9' },
      { timeMs: 5100, durationMs: 200, string: 6, fret: 10, label: '10' },
      { timeMs: 5400, durationMs: 500, string: 6, fret: 5,  label: '5' },
    ]
  }
];

