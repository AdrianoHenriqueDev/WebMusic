import { InstrumentType } from '../types';

// Standard 6 string base frequencies (Standard Tuning: E2, A2, D3, G3, B3, E4)
export const STRING_CONFIGS = [
  { number: 6, name: 'E', notePt: 'Mi', octave: 2, color: '#ef4444', colorName: 'Vermelho', baseFreq: 82.41, gauge: 3.5 },
  { number: 5, name: 'A', notePt: 'Lá', octave: 2, color: '#eab308', colorName: 'Amarelo', baseFreq: 110.00, gauge: 3.0 },
  { number: 4, name: 'D', notePt: 'Ré', octave: 3, color: '#3b82f6', colorName: 'Azul', baseFreq: 146.83, gauge: 2.5 },
  { number: 3, name: 'G', notePt: 'Sol', octave: 3, color: '#f97316', colorName: 'Laranja', baseFreq: 196.00, gauge: 2.0 },
  { number: 2, name: 'B', notePt: 'Si', octave: 3, color: '#22c55e', colorName: 'Verde', baseFreq: 246.94, gauge: 1.5 },
  { number: 1, name: 'E', notePt: 'Mi', octave: 4, color: '#a855f7', colorName: 'Roxo', baseFreq: 329.63, gauge: 1.0 },
];

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const NOTE_NAMES_PT = ['Dó', 'Dó#', 'Ré', 'Ré#', 'Mi', 'Fá', 'Fá#', 'Sol', 'Sol#', 'Lá', 'Lá#', 'Si'];

export function getNoteName(stringNum: number, fret: number): { en: string; pt: string } {
  const str = STRING_CONFIGS.find(s => s.number === stringNum);
  if (!str) return { en: '?', pt: '?' };

  const baseNoteMap: Record<string, number> = {
    'E': 4,
    'A': 9,
    'D': 2,
    'G': 7,
    'B': 11
  };

  const startIndex = baseNoteMap[str.name] ?? 0;
  const noteIndex = (startIndex + fret) % 12;

  return {
    en: NOTE_NAMES[noteIndex],
    pt: NOTE_NAMES_PT[noteIndex]
  };
}

export function getFrequency(stringNum: number, fret: number): number {
  const str = STRING_CONFIGS.find(s => s.number === stringNum);
  if (!str) return 440;
  return str.baseFreq * Math.pow(2, fret / 12);
}

class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private currentInstrument: InstrumentType = 'acoustic';
  private distortionCurve: Float32Array | null = null;

  constructor() {
    // Lazily initialized on first user interaction
  }

  public init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.85, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
      this.distortionCurve = this.makeDistortionCurve(30);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setInstrument(type: InstrumentType) {
    this.currentInstrument = type;
  }

  public getInstrument(): InstrumentType {
    return this.currentInstrument;
  }

  public setVolume(volume: number) { // 0 to 1
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(Math.max(0, Math.min(1, volume)), this.ctx.currentTime, 0.05);
    }
  }

  private makeDistortionCurve(amount: number): Float32Array {
    const k = typeof amount === 'number' ? amount : 50;
    const nSamples = 44100;
    const curve = new Float32Array(nSamples);
    const deg = Math.PI / 180;
    for (let i = 0; i < nSamples; ++i) {
      const x = (i * 2) / nSamples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve;
  }

  // Realistic Physical Guitar Synthesis (Karplus-Strong Hybrid with multi-harmonics)
  public playNote(stringNum: number, fret: number, duration: number = 2.0, velocity: number = 0.8) {
    this.init();
    if (!this.ctx || !this.masterGain) return;

    const freq = getFrequency(stringNum, fret);
    const now = this.ctx.currentTime;
    const isElectric = this.currentInstrument === 'electric';

    // Output bus for this pluck
    const noteGain = this.ctx.createGain();
    noteGain.gain.setValueAtTime(velocity * (isElectric ? 0.6 : 0.9), now);

    // Karplus-Strong string loop simulation using BufferSource or Rich Harmonic Osc
    // Rich multi-harmonic model with pick transient
    const fundamental = this.ctx.createOscillator();
    const secondHarmonic = this.ctx.createOscillator();
    const thirdHarmonic = this.ctx.createOscillator();

    fundamental.type = isElectric ? 'sawtooth' : 'triangle';
    secondHarmonic.type = 'sine';
    thirdHarmonic.type = isElectric ? 'sawtooth' : 'sine';

    fundamental.frequency.setValueAtTime(freq, now);
    secondHarmonic.frequency.setValueAtTime(freq * 2, now);
    thirdHarmonic.frequency.setValueAtTime(freq * 3, now);

    // Filter to simulate guitar body / wood resonance & string dampening
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    const initialCutoff = isElectric ? 3500 : 2200;
    filter.frequency.setValueAtTime(initialCutoff, now);
    // Dynamic filter decay (damping over time)
    filter.frequency.exponentialRampToValueAtTime(isElectric ? 600 : 250, now + duration * 0.8);

    // Pick noise impulse
    const noiseBuffer = this.ctx.createBuffer(1, Math.floor(this.ctx.sampleRate * 0.03), this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseBuffer.length; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.006));
    }
    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.3 * velocity, now);

    // Pluck Envelope
    const oscGain = this.ctx.createGain();
    oscGain.gain.setValueAtTime(0.001, now);
    // Instant attack
    oscGain.gain.linearRampToValueAtTime(1.0, now + 0.008);
    // Natural exponential string decay
    const decayRate = isElectric ? duration * 1.2 : duration * 0.8;
    oscGain.gain.exponentialRampToValueAtTime(0.0001, now + decayRate);

    // Wire up oscillators
    const harm2Gain = this.ctx.createGain();
    harm2Gain.gain.setValueAtTime(0.4, now);
    const harm3Gain = this.ctx.createGain();
    harm3Gain.gain.setValueAtTime(isElectric ? 0.35 : 0.15, now);

    fundamental.connect(oscGain);
    secondHarmonic.connect(harm2Gain);
    harm2Gain.connect(oscGain);
    thirdHarmonic.connect(harm3Gain);
    harm3Gain.connect(oscGain);

    oscGain.connect(filter);
    noiseSource.connect(noiseGain);
    noiseGain.connect(filter);

    if (isElectric && this.distortionCurve) {
      // Add subtle overdrive and cabinet simulation
      const waveShaper = this.ctx.createWaveShaper();
      (waveShaper as any).curve = this.distortionCurve;
      waveShaper.oversample = '4x';
      filter.connect(waveShaper);
      waveShaper.connect(noteGain);
    } else {
      filter.connect(noteGain);
    }

    noteGain.connect(this.masterGain);

    fundamental.start(now);
    secondHarmonic.start(now);
    thirdHarmonic.start(now);
    noiseSource.start(now);

    fundamental.stop(now + decayRate + 0.1);
    secondHarmonic.stop(now + decayRate + 0.1);
    thirdHarmonic.stop(now + decayRate + 0.1);
  }

  // Play a full chord with humanized strum delay
  public strumChord(frets: [number, number, number, number, number, number], direction: 'down' | 'up' = 'down', speedMs: number = 35) {
    this.init();
    const stringIndices = direction === 'down' 
      ? [6, 5, 4, 3, 2, 1] 
      : [1, 2, 3, 4, 5, 6];

    stringIndices.forEach((stringNum, idx) => {
      // frets array is ordered [str6, str5, str4, str3, str2, str1]
      const arrayIndex = 6 - stringNum;
      const fret = frets[arrayIndex];

      if (fret !== -1) {
        // String is not muted
        setTimeout(() => {
          this.playNote(stringNum, fret, 2.5, 0.75 + Math.random() * 0.1);
        }, idx * speedMs);
      }
    });
  }

  // Play chord string by string (Arpeggio)
  public arpeggiateChord(frets: [number, number, number, number, number, number], speedMs: number = 220) {
    this.init();
    const validStrings: { stringNum: number; fret: number }[] = [];
    for (let s = 6; s >= 1; s--) {
      const fret = frets[6 - s];
      if (fret !== -1) {
        validStrings.push({ stringNum: s, fret });
      }
    }

    validStrings.forEach((item, idx) => {
      setTimeout(() => {
        this.playNote(item.stringNum, item.fret, 2.0, 0.85);
      }, idx * speedMs);
    });
  }

  // Metronome tick sound
  public playClick(isAccented: boolean = false) {
    this.init();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(isAccented ? 1200 : 800, now);

    gain.gain.setValueAtTime(isAccented ? 0.6 : 0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.06);
  }
}

export const audioEngine = new AudioEngine();
