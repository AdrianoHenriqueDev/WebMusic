export type InstrumentType = 'acoustic' | 'electric';

export interface StringConfig {
  number: number; // 1 to 6 (1 = high E, 6 = low E)
  name: string; // 'E', 'B', 'G', 'D', 'A', 'E'
  notePt: string; // 'Mi', 'Si', 'Sol', 'Ré', 'Lá', 'Mi'
  octave: number; // 4, 3, 3, 3, 2, 2
  color: string; // Tailwind hex color
  colorName: string; // 'Roxo', 'Verde', etc.
  baseFreq: number; // Frequency in Hz (e.g., E4 = 329.63)
  gauge: number; // Relative thickness for visual render (1 to 4)
}

export interface FretMarker {
  fret: number;
  string: number; // 1 to 6
  finger?: number; // 1: Indicador, 2: Médio, 3: Anelar, 4: Mindinho, 0: Solto
  label?: string; // Optional custom text (e.g. note name)
  isRoot?: boolean;
}

export interface ChordDefinition {
  id: string;
  name: string;
  fullName: string;
  category: 'iniciante' | 'abertos' | 'com pestana';
  difficulty: 'Fácil' | 'Médio' | 'Desafio';
  frets: [number, number, number, number, number, number];
  fingers: [number, number, number, number, number, number];
  barre?: {
    fret: number;
    fromString: number;
    toString: number;
    finger: number;
  };
  tips: string;
  commonInSongs: string[];
}

export interface RiffNote {
  timeMs: number;
  durationMs: number;
  string: number; // 1 to 6
  fret: number; // 0 to 12
  finger?: number;
  label?: string;
}

export interface RiffSong {
  id: string;
  title: string;
  artist: string;
  tempo: number; // BPM
  difficulty: 'Fácil (1 corda)' | 'Básico' | 'Intermediário';
  description: string;
  backingTone: InstrumentType;
  notes: RiffNote[];
  totalDurationMs: number;
}

export interface LessonStep {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  content: string;
  fretboardState?: {
    activeFrets: FretMarker[];
    focusedStrings?: number[];
    instruction?: string;
  };
  interactiveType?: 'inspect' | 'play_note' | 'quiz' | 'exercise_1234' | 'chord_practice' | 'rhythm';
  quiz?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  practiceChord?: string;
}

export interface LessonModule {
  id: string;
  title: string;
  shortDesc: string;
  iconName: string;
  steps: LessonStep[];
}

export interface SongLyricLine {
  chords: { chord: string; positionChar: number }[];
  text: string;
}

export interface SongbookEntry {
  id: string;
  title: string;
  artist: string;
  genre: string;
  requiredChords: string[]; // e.g. ['em', 'c', 'g', 'd']
  strumPatternName: string;
  strumPattern: ('down' | 'up' | 'none')[];
  bpm: number;
  lines: SongLyricLine[];
}
