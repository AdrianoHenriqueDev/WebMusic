import { LessonModule } from '../types';

export const LESSONS_DATA: LessonModule[] = [
  {
    id: 'intro',
    title: '1. O Primeiro Contato',
    shortDesc: 'Postura correta, palheta, e como tirar o melhor som sem cansar a mão.',
    iconName: 'Sparkles',
    steps: [
      {
        id: 'posture-choice',
        title: 'Violão ou Guitarra? Como Segurar',
        subtitle: 'A base para você não ter dores e conseguir tocar com fluidez',
        badge: 'Fundamento',
        content: `
### Bem-vindo ao universo do violão e da guitarra! 🎸
No Rocksmith e na vida real, o primeiro segredo não é a força, mas sim a **ergonomia e o alinhamento**:

1. **O Polegar Esquerdo:**
   - O polegar deve ficar **atrás do meio do braço**, na vertical ou levemente inclinado.
   - *Erro comum de iniciante:* "Abraçar" o braço com a mão inteira. Isso trava seus outros 4 dedos! Deixe um espaço oco como se estivesse segurando uma maçã.

2. **Pontas dos Dedos:**
   - Ao apertar uma corda, use a **ponta perpendicular do dedo**, quase a 90 graus em relação à madeira. Isso evita que sua pele esbarre e abafe as cordas vizinhas.

3. **Como Segurar a Palheta:**
   - Coloque a palheta no lado da primeira articulação do indicador e prenda-a com o polegar. Deixe apenas 3 a 5 milímetros da ponta para fora.
        `,
        interactiveType: 'inspect'
      },
      {
        id: 'anatomy-fret',
        title: 'Casas, Trastes e a Madeira',
        subtitle: 'Onde exatamente seu dedo deve apertar?',
        badge: 'Segredo de Ouro',
        content: `
### Por que o som às vezes fica chiado (trastejando)? 🤔

- **O Traste** é a barra metálica fininha incrustada no braço.
- **A Casa** é o espaço de madeira entre dois trastes metálicos.

**A REGRA DE OURO DO SOM LIMPO:**
> Pressione o dedo **o mais próximo possível do traste de metal à direita** (sem subir em cima dele!).
> Se você apertar muito longe ou no meio, a corda vai vibrar contra o ferro e fazer um som feio de zumbido ("buzz").
        `,
        interactiveType: 'quiz',
        quiz: {
          question: 'Onde seu dedo deve pressionar para o som sair nítido sem chiar e sem precisar de muita força?',
          options: [
            'Exatamente em cima da barra de metal do traste',
            'Bem perto do traste metálico da frente, sem subir em cima dele',
            'No canto mais distante possível do traste',
            'Com a mão reta encostando em todas as cordas'
          ],
          correctIndex: 1,
          explanation: 'Exato! Quanto mais perto do traste metálico, menos força você gasta e o som sai cristalino sem zumbido.'
        }
      }
    ]
  },
  {
    id: 'strings-colors',
    title: '2. O Sistema das 6 Cores',
    shortDesc: 'Aprenda o nome e a afinação das 6 cordas instantaneamente.',
    iconName: 'Palette',
    steps: [
      {
        id: 'color-code-intro',
        title: 'As 6 Cordas do Rocksmith',
        subtitle: 'Memorize as cores e nunca mais se perca na tablatura',
        badge: 'Visual Rocksmith',
        content: `
No Rocksmith, cada uma das 6 cordas possui uma cor vibrante exclusiva. Isso acaba com a confusão entre o Mi grave e o Mi agudo!

- 🔴 **6ª Corda (Mais Grossa / Grave):** **E (Mi)** - Vermelho
- 🟡 **5ª Corda:** **A (Lá)** - Amarelo
- 🔵 **4ª Corda:** **D (Ré)** - Azul
- 🟠 **3ª Corda:** **G (Sol)** - Laranja
- 🟢 **2ª Corda:** **B (Si)** - Verde
- 🟣 **1ª Corda (Mais Fina / Aguda):** **E (Mi)** - Roxo

*Frase mnemônica para lembrar as notas (E-A-D-G-B-E):*
**"Ele Ama Doce Gostoso Bem Enrolado"** 🍬
        `,
        interactiveType: 'play_note',
        fretboardState: {
          activeFrets: [
            { fret: 0, string: 6, label: 'E (Mi)' },
            { fret: 0, string: 5, label: 'A (Lá)' },
            { fret: 0, string: 4, label: 'D (Ré)' },
            { fret: 0, string: 3, label: 'G (Sol)' },
            { fret: 0, string: 2, label: 'B (Si)' },
            { fret: 0, string: 1, label: 'E (Mi)' },
          ],
          instruction: 'Clique nas cordas soltas no braço interativo abaixo para ouvir cada afinação!'
        }
      },
      {
        id: 'quiz-strings',
        title: 'Desafio das Cordas',
        subtitle: 'Teste rápido de reflexo visual',
        badge: 'Quiz Rápido',
        content: `
Vamos ver se seu cérebro já gravou as cores das cordas como um jogador do Rocksmith!
        `,
        interactiveType: 'quiz',
        quiz: {
          question: 'Qual é a 4ª corda da guitarra/violão no sistema Rocksmith?',
          options: [
            'Corda Vermelha (E / Mi grave)',
            'Corda Azul (D / Ré)',
            'Corda Verde (B / Si)',
            'Corda Laranja (G / Sol)'
          ],
          correctIndex: 1,
          explanation: 'Parabéns! A 4ª corda é a Ré (D), representada pela cor Azul.'
        }
      }
    ]
  },
  {
    id: 'finger-exercise',
    title: '3. A Ginástica dos Dedos (1-2-3-4)',
    shortDesc: 'Desenvolva independência, força e velocidade na mão esquerda.',
    iconName: 'Activity',
    steps: [
      {
        id: 'spider-walk',
        title: 'O Famoso Exercício da Aranha',
        subtitle: 'O aquecimento obrigatório de 99% dos guitarristas profissionais',
        badge: 'Treino Prático',
        content: `
Seus dedos ainda não têm a memória muscular para trocar de acordes rápido? **Este exercício resolve isso em 7 dias!**

**Como numeramos os dedos da mão esquerda:**
- **Dedo 1:** Indicador
- **Dedo 2:** Médio
- **Dedo 3:** Anelar
- **Dedo 4:** Mindinho

**A Sequência:**
1. Casa 1 com o **Dedo 1**
2. Casa 2 com o **Dedo 2** (mantenha o dedo 1 apoiado!)
3. Casa 3 com o **Dedo 3**
4. Casa 4 com o **Dedo 4**

*Regra de ouro:* Toque devagar com o metrônomo interativo abaixo. Velocidade é consequência da precisão!
        `,
        interactiveType: 'exercise_1234'
      }
    ]
  },
  {
    id: 'first-chords',
    title: '4. Seus Primeiros 4 Acordes Mágicos',
    shortDesc: 'Com Em, C, G e D você já consegue tocar mais de 500 músicas populares!',
    iconName: 'Music',
    steps: [
      {
        id: 'chord-em-g',
        title: 'O Primeiro Acorde: Mi Menor (Em)',
        subtitle: 'Apenas 2 dedos para seu primeiro som harmônico',
        badge: 'Prática de Acorde',
        content: `
O acorde de **Mi Menor (Em)** é a porta de entrada perfeita:
- Coloque o **Dedo 2** na 2ª casa da 5ª corda (Amarela).
- Coloque o **Dedo 3** na 2ª casa da 4ª corda (Azul).
- Toque todas as 6 cordas de cima para baixo com a palheta ou polegar!

Ouça como o som é encorpado, profundo e melancólico. Use o botão **"Tocar Dedilhado"** no painel de acordes para checar se nenhuma corda está abafada.
        `,
        interactiveType: 'chord_practice',
        practiceChord: 'em'
      },
      {
        id: 'chord-magic-progression',
        title: 'A Progressão dos 4 Acordes Sagrados',
        subtitle: 'Em, C, G e D: O segredo da música pop mundial',
        badge: 'Super Dica',
        content: `
Você sabia que músicas como *Let It Be* (Beatles), *With or Without You* (U2), *Pais e Filhos* (Legião Urbana) e centenas de hits usam exatamente estes 4 acordes?

Ao praticar no nosso **Treinador de Acordes**, alterne entre:
1. **Em** ➔ 2. **C** ➔ 3. **G** ➔ 4. **D**

*Dica Rocksmith de transição:* Ao mudar de acorde, não levante a mão inteira no ar! Encontre "dedos âncoras" ou guias que deslizam suavemente pela corda.
        `,
        interactiveType: 'chord_practice',
        practiceChord: 'g'
      }
    ]
  },
  {
    id: 'rhythm-strumming',
    title: '5. Batidas e Levadas da Mão Direita',
    shortDesc: 'A mão direita é o motor da música! Aprenda a tocar no tempo certo.',
    iconName: 'Flame',
    steps: [
      {
        id: 'strum-basics',
        title: 'Palhetada Baixo e Cima (↓ ↑)',
        subtitle: 'O pêndulo constante que nunca para',
        badge: 'Ritmo & Groove',
        content: `
O maior erro de quem começa é parar a mão direita entre uma troca e outra.
Pense no seu braço direito como um **pêndulo de relógio**:
- Ele sobe e desce em um ritmo contínuo:
  - Tempo 1: Cai (↓)
  - Tempo &: Sobe (↑)
  - Tempo 2: Cai (↓)
  - Tempo &: Sobe (↑)

Mesmo quando você não encostar nas cordas em um tempo (uma "palhetada fantasma"), o braço continua balançando no mesmo ritmo!
        `,
        interactiveType: 'rhythm'
      }
    ]
  },
  {
    id: 'first-riff',
    title: '6. Seu Primeiro Riff de Rock',
    shortDesc: 'Toque Smoke on the Water no Riff Flow animado estilo Rocksmith!',
    iconName: 'Zap',
    steps: [
      {
        id: 'smoke-intro',
        title: 'O Riff Imortal: 0 - 3 - 5',
        subtitle: 'Sinta a vibração de tocar um clássico do Rock logo na primeira aula',
        badge: 'Rock N Roll',
        content: `
O riff de *Smoke on the Water* (Deep Purple) é lendário por uma razão: ele soa incrível e você só precisa de uma corda!

**Como funciona a notação:**
- **0:** Corda solta (não aperte nenhuma casa, apenas palhete a corda).
- **3:** Aperte a 3ª casa com o **Dedo 1** (Indicador) ou Dedo 3.
- **5:** Aperte a 5ª casa com o **Dedo 3** (Anelar).

Experimente a nossa aba **"Riff Flow"** para ver as notas correndo na tela em tempo real, ajustar a velocidade e tocar junto!
        `,
        interactiveType: 'inspect'
      }
    ]
  }
];

