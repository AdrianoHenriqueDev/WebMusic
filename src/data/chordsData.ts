import { ChordDefinition } from '../types';

export const CHORDS_DATA: ChordDefinition[] = [
  {
    id: 'em',
    name: 'Em',
    fullName: 'Mi Menor',
    category: 'iniciante',
    difficulty: 'Fácil',
    // 6, 5, 4, 3, 2, 1
    frets: [0, 2, 2, 0, 0, 0],
    fingers: [0, 2, 3, 0, 0, 0], // ou dedos 1 e 2
    tips: 'O acorde mais fácil para começar! Apenas 2 dedos na 2ª casa. Deixe as outras 4 cordas vibrarem soltas. Mantenha os dedos arqueados na pontinha.',
    commonInSongs: ['Nothing Else Matters', 'Californication', 'Zombie', 'Tempo Perdido']
  },
  {
    id: 'e',
    name: 'E',
    fullName: 'Mi Maior',
    category: 'iniciante',
    difficulty: 'Fácil',
    frets: [0, 2, 2, 1, 0, 0],
    fingers: [0, 2, 3, 1, 0, 0],
    tips: 'É o mesmo formato do Em, mas adicionando o Dedo 1 na 1ª casa da 3ª corda (Laranja). Observe o som passar de triste (menor) para alegre (maior).',
    commonInSongs: ['Hey Joe', 'Wonderwall', 'Back in Black']
  },
  {
    id: 'am',
    name: 'Am',
    fullName: 'Lá Menor',
    category: 'iniciante',
    difficulty: 'Fácil',
    frets: [-1, 0, 2, 2, 1, 0],
    fingers: [0, 0, 2, 3, 1, 0],
    tips: 'Segredo de mestre: O formato do Am é IDÊNTICO ao Mi Maior (E), só que deslocado uma corda para baixo! Não toque a 6ª corda.',
    commonInSongs: ['Stairway to Heaven', 'Hurt', 'Paciência', 'Pais e Filhos']
  },
  {
    id: 'c',
    name: 'C',
    fullName: 'Dó Maior',
    category: 'iniciante',
    difficulty: 'Fácil',
    frets: [-1, 3, 2, 0, 1, 0],
    fingers: [0, 3, 2, 0, 1, 0],
    tips: 'Formato de "escadinha diagonal". O dedo 3 estica até a 3ª casa da corda Amarela (A). Cuidado para o dedo 1 não encostar na 1ª corda solta.',
    commonInSongs: ['Let It Be', 'Don\'t Stop Believin\'', 'Knockin\' on Heaven\'s Door']
  },
  {
    id: 'g',
    name: 'G',
    fullName: 'Sol Maior',
    category: 'iniciante',
    difficulty: 'Fácil',
    frets: [3, 2, 0, 0, 0, 3],
    fingers: [2, 1, 0, 0, 0, 3],
    tips: 'Um dos acordes mais usados na história da música. Estique bem o dedo na 6ª corda e na 1ª corda. Dica Rocksmith: você também pode usar os dedos 3 e 4!',
    commonInSongs: ['Sweet Home Alabama', 'Good Riddance', 'More Than Words']
  },
  {
    id: 'd',
    name: 'D',
    fullName: 'Ré Maior',
    category: 'iniciante',
    difficulty: 'Fácil',
    frets: [-1, -1, 0, 2, 3, 2],
    fingers: [0, 0, 0, 1, 3, 2],
    tips: 'Formato de triângulo nas cordas agudas! Toque apenas a partir da 4ª corda (Azul - Ré). Mantenha os dedos perto dos trastes para não chiar.',
    commonInSongs: ['Hotel California', 'With or Without You', 'Sweet Child O\' Mine']
  },
  {
    id: 'dm',
    name: 'Dm',
    fullName: 'Ré Menor',
    category: 'abertos',
    difficulty: 'Médio',
    frets: [-1, -1, 0, 2, 3, 1],
    fingers: [0, 0, 0, 2, 3, 1],
    tips: 'Versão menor do Ré. O dedo 1 vai até a 1ª casa da 1ª corda. Tem um tom melancólico e misterioso.',
    commonInSongs: ['Sultans of Swing', 'Come As You Are', 'Losing My Religion']
  },
  {
    id: 'a',
    name: 'A',
    fullName: 'Lá Maior',
    category: 'abertos',
    difficulty: 'Fácil',
    frets: [-1, 0, 2, 2, 2, 0],
    fingers: [0, 0, 1, 2, 3, 0],
    tips: 'Três dedos "apertadinhos" juntos na mesma 2ª casa! Uma alternativa muito usada em guitarra é usar apenas 1 dedo deitado (mini-pestana).',
    commonInSongs: ['Wild Thing', 'TNT', 'Back In Black']
  },
  {
    id: 'fmaj7',
    name: 'Fmaj7',
    fullName: 'Fá com 7ª Maior (Fá Fácil)',
    category: 'iniciante',
    difficulty: 'Fácil',
    frets: [-1, -1, 3, 2, 1, 0],
    fingers: [0, 0, 3, 2, 1, 0],
    tips: 'A alternativa secreta dos iniciantes! Substitui o temido Fá com pestana em quase todas as músicas pop e folk sem nenhuma dor na mão!',
    commonInSongs: ['House of the Rising Sun', 'Imagine', 'The Scientist']
  },
  {
    id: 'f',
    name: 'F',
    fullName: 'Fá Maior (Pestana)',
    category: 'com pestana',
    difficulty: 'Desafio',
    frets: [1, 3, 3, 2, 1, 1],
    fingers: [1, 3, 4, 2, 1, 1],
    barre: {
      fret: 1,
      fromString: 6,
      toString: 1,
      finger: 1
    },
    tips: 'O grande rito de passagem do violão! Dica de ouro: não use força bruta; use a lateral óssea do dedo indicador levemente inclinada e apoie com o peso do braço.',
    commonInSongs: ['Hey Jude', 'La Bamba', 'Creep']
  },
  {
    id: 'bm',
    name: 'Bm',
    fullName: 'Si Menor (Pestana na 2ª casa)',
    category: 'com pestana',
    difficulty: 'Desafio',
    frets: [-1, 2, 4, 4, 3, 2],
    fingers: [0, 1, 3, 4, 2, 1],
    barre: {
      fret: 2,
      fromString: 5,
      toString: 1,
      finger: 1
    },
    tips: 'Mesmo formato do Lá Menor (Am), porém com a pestana na 2ª casa. Toque a partir da 5ª corda.',
    commonInSongs: ['Hotel California', 'Wicked Game', 'Wish You Were Here']
  },
  {
    id: 'e5',
    name: 'E5 (Power Chord)',
    fullName: 'Mi 5ª (Power Chord de Rock)',
    category: 'iniciante',
    difficulty: 'Fácil',
    frets: [0, 2, 2, -1, -1, -1],
    fingers: [0, 1, 2, 0, 0, 0],
    tips: 'O som do Rock! Não é maior nem menor: soa potente em qualquer guitarra com distorção. Tocado apenas nas 2 ou 3 cordas mais graves.',
    commonInSongs: ['Smells Like Teen Spirit', 'Iron Man', 'Paranoid']
  }
];

