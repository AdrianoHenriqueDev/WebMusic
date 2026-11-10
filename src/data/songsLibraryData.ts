import { SongbookEntry } from '../types';

export const SONGBOOK_DATA: SongbookEntry[] = [
  {
    id: 'knockin-heavens-door',
    title: 'Knockin\' on Heaven\'s Door',
    artist: 'Bob Dylan / Guns N\' Roses',
    genre: 'Classic Rock / Folk',
    requiredChords: ['g', 'd', 'am', 'c'],
    strumPatternName: 'Pop/Rock Padrão (↓ - ↓ ↑ - ↑ ↓ ↑)',
    strumPattern: ['down', 'none', 'down', 'up', 'none', 'up', 'down', 'up'],
    bpm: 72,
    lines: [
      {
        chords: [{ chord: 'G', positionChar: 0 }, { chord: 'D', positionChar: 18 }, { chord: 'Am', positionChar: 34 }],
        text: 'Mama, take this badge off of me...'
      },
      {
        chords: [{ chord: 'G', positionChar: 0 }, { chord: 'D', positionChar: 18 }, { chord: 'C', positionChar: 34 }],
        text: 'I can\'t use it anymore...'
      },
      {
        chords: [{ chord: 'G', positionChar: 0 }, { chord: 'D', positionChar: 18 }, { chord: 'Am', positionChar: 34 }],
        text: 'It\'s gettin\' dark, too dark to see...'
      },
      {
        chords: [{ chord: 'G', positionChar: 0 }, { chord: 'D', positionChar: 18 }, { chord: 'C', positionChar: 34 }],
        text: 'Feel like I\'m knockin\' on heaven\'s door.'
      },
      {
        chords: [{ chord: 'G', positionChar: 0 }, { chord: 'D', positionChar: 18 }, { chord: 'Am', positionChar: 36 }],
        text: 'Knock, knock, knockin\' on heaven\'s door...'
      },
      {
        chords: [{ chord: 'G', positionChar: 0 }, { chord: 'D', positionChar: 18 }, { chord: 'C', positionChar: 36 }],
        text: 'Knock, knock, knockin\' on heaven\'s door...'
      }
    ]
  },
  {
    id: 'tempo-perdido',
    title: 'Tempo Perdido',
    artist: 'Legião Urbana',
    genre: 'Rock Nacional',
    requiredChords: ['em', 'c', 'g', 'd'],
    strumPatternName: 'Rock Básico Contínuo (↓ - ↓ - ↓ - ↓ ↑)',
    strumPattern: ['down', 'none', 'down', 'none', 'down', 'none', 'down', 'up'],
    bpm: 96,
    lines: [
      {
        chords: [{ chord: 'Em', positionChar: 0 }, { chord: 'C', positionChar: 24 }],
        text: 'Todos os dias quando acordo...'
      },
      {
        chords: [{ chord: 'G', positionChar: 0 }, { chord: 'D', positionChar: 24 }],
        text: 'Não tenho mais o tempo que passou...'
      },
      {
        chords: [{ chord: 'Em', positionChar: 0 }, { chord: 'C', positionChar: 24 }],
        text: 'Mas tenho muito tempo...'
      },
      {
        chords: [{ chord: 'G', positionChar: 0 }, { chord: 'D', positionChar: 24 }],
        text: 'Temos todo o tempo do mundo!'
      },
      {
        chords: [{ chord: 'Em', positionChar: 0 }, { chord: 'C', positionChar: 24 }],
        text: 'Todos os dias antes de dormir...'
      },
      {
        chords: [{ chord: 'G', positionChar: 0 }, { chord: 'D', positionChar: 24 }],
        text: 'Lembro e esqueço como foi o dia...'
      }
    ]
  },
  {
    id: 'zombie',
    title: 'Zombie',
    artist: 'The Cranberries',
    genre: 'Grunge / 90s Alternative',
    requiredChords: ['em', 'c', 'g', 'd'],
    strumPatternName: 'Palhetada Forte Rock (↓ - ↓ - ↓ ↑ ↓ ↑)',
    strumPattern: ['down', 'none', 'down', 'none', 'down', 'up', 'down', 'up'],
    bpm: 84,
    lines: [
      {
        chords: [{ chord: 'Em', positionChar: 0 }, { chord: 'C', positionChar: 25 }],
        text: 'Another head hangs lowly, child is slowly taken...'
      },
      {
        chords: [{ chord: 'G', positionChar: 0 }, { chord: 'D', positionChar: 28 }],
        text: 'And the violence caused such silence, who are we mistaken?'
      },
      {
        chords: [{ chord: 'Em', positionChar: 0 }, { chord: 'C', positionChar: 26 }],
        text: 'In your head, in your head, they are fighting...'
      },
      {
        chords: [{ chord: 'G', positionChar: 0 }, { chord: 'D', positionChar: 26 }],
        text: 'With their tanks and their bombs, and their bombs and their guns...'
      },
      {
        chords: [{ chord: 'Em', positionChar: 0 }, { chord: 'C', positionChar: 16 }, { chord: 'G', positionChar: 28 }, { chord: 'D', positionChar: 38 }],
        text: 'In your head, in your head, Zombie, Zombie, Zombie...'
      }
    ]
  },
  {
    id: 'stand-by-me',
    title: 'Stand by Me',
    artist: 'Ben E. King',
    genre: 'Soul / R&B Clássico',
    requiredChords: ['g', 'em', 'c', 'd'],
    strumPatternName: 'Levada Suave com Abafamento (↓ - ↓ - ↓ - ↓ ↑)',
    strumPattern: ['down', 'none', 'down', 'none', 'down', 'none', 'down', 'up'],
    bpm: 80,
    lines: [
      {
        chords: [{ chord: 'G', positionChar: 0 }, { chord: 'Em', positionChar: 30 }],
        text: 'When the night has come, and the land is dark...'
      },
      {
        chords: [{ chord: 'C', positionChar: 0 }, { chord: 'D', positionChar: 18 }, { chord: 'G', positionChar: 35 }],
        text: 'And the moon is the only light we\'ll see...'
      },
      {
        chords: [{ chord: 'G', positionChar: 0 }, { chord: 'Em', positionChar: 30 }],
        text: 'No, I won\'t be afraid, no, I won\'t be afraid...'
      },
      {
        chords: [{ chord: 'C', positionChar: 0 }, { chord: 'D', positionChar: 20 }, { chord: 'G', positionChar: 35 }],
        text: 'Just as long as you stand, stand by me!'
      }
    ]
  }
];
