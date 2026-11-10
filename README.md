# 🎸 FretFlow — Aprenda Violão & Guitarra de Forma Visual

> Uma plataforma web moderna e ultra-intuitiva inspirada nos melhores princípios pedagógicos do jogo **Rocksmith** para iniciantes em violão e guitarra.

---

## 🌟 O Conceito: Por que inspirado no Rocksmith?

Aprender violão ou guitarra tradicionalmente assusta iniciantes por dois motivos:
1. **Partituras e cifras abstratas:** O cérebro precisa traduzir linhas e números em posições espaciais na madeira.
2. **Falta de feedback sonoro e visual imediato:** O aluno não sabe se a corda que está soando é a correta ou se está trastejando por falta de postura.

O **FretFlow** resolve isso adotando o sistema visual intuitivo do Rocksmith:
- 🔴🟡🔵🟠🟢🟣 **Sistema das 6 Cores das Cordas:** Cada corda tem uma cor neon exclusiva (6ª Mi Vermelho, 5ª Lá Amarelo, 4ª Ré Azul, 3ª Sol Laranja, 2ª Si Verde, 1ª Mi Roxo).
- 🎸 **Braço Interativo Realista (Fretboard):** Casas com trastes metálicos, inlays tradicionais de madrepérola (3, 5, 7, 9, 12) e indicação exata de dedos (1: Indicador, 2: Médio, 3: Anelar, 4: Mindinho).
- ⚡ **Riff Flow (Note Highway):** Pista animada em tempo real onde os blocos coloridos deslizam até a barra de palhetada (*Smoke on the Water*, *Come As You Are*, *Seven Nation Army*, *Iron Man*).
- 🔄 **Perspectiva Invertível:** Alterne entre a **Visão do Músico** (olhando de cima para o braço) e a **Visão Tablatura Padrão**.
- 🏆 **Desafio de Troca Rápida de Acordes (Minigame 30s):** Minigame para desenvolver memória muscular alternando entre acordes com metrônomo.
- 🎯 **Afinador Visual Integrado:** Afinação por ouvido (toques nas tarrachas) ou detecção automática ao vivo via microfone com ponteiro em tempo real.
- 🔊 **Síntese de Áudio Física:** Som realista gerado via Web Audio API, com alternância instantânea entre **Violão Acústico** e **Guitarra Elétrica com Overdrive**.

---

## 🚀 Como Executar

### Pré-requisitos
- Node.js instalado (v18+)

### Iniciar o Servidor de Desenvolvimento
```bash
npm run dev
```
Abra o navegador no endereço exibido (geralmente `http://localhost:5173`).

### Gerar Build de Produção
```bash
npm run build
```

---

## 📂 Estrutura do Projeto

```
src/
├── components/
│   ├── Chords/
│   │   └── ChordTrainer.tsx        # Dicionário visual e minigame de troca rápida
│   ├── Fretboard/
│   │   ├── FretboardExplorer.tsx   # Explorador livre de escalas e notas
│   │   └── InteractiveFretboard.tsx# O braço interativo com 6 cordas coloridas
│   ├── InstrumentGuide/
│   │   └── AcousticVsElectric.tsx  # Guia comparativo Violão vs Guitarra
│   ├── Lessons/
│   │   ├── Exercise1234.tsx        # Treinador de digitação da aranha
│   │   ├── InteractiveQuiz.tsx     # Desafios de fixação rápida com feedback
│   │   ├── LessonJourney.tsx       # Trilha de 6 módulos guiados passo a passo
│   │   └── RhythmTrainer.tsx       # Treinador visual de batidas (setas ↓ ↑)
│   ├── Metronome/
│   │   └── MetronomeWidget.tsx     # Metrônomo com BPM e compassos
│   ├── RiffFlow/
│   │   └── RiffFlowPlayer.tsx      # Note Highway estilo Rocksmith com riffs famosos
│   ├── Tuner/
│   │   └── InteractiveTuner.tsx    # Afinador com microfone e referência de ouvido
│   └── Navbar.tsx                  # Barra de navegação e troca de timbres
├── data/
│   ├── chordsData.ts               # Biblioteca de acordes iniciantes e com pestana
│   ├── lessonsData.ts              # Conteúdo pedagógico dos 6 módulos
│   └── riffsData.ts                # Tablaturas e tempos dos riffs icônicos
├── services/
│   ├── audioEngine.ts              # Síntese física de violão, guitarra e acordes
│   └── tunerEngine.ts              # Pitch detection via autocorrelação de microfone
├── types/
│   └── index.ts                    # Tipagens TypeScript completas
├── App.tsx                         # Componente raiz com navegação fluida
└── main.tsx                        # Ponto de entrada React
```

