import { getFrequency, getNoteName } from './audioEngine';

export interface DetectedPitch {
  freq: number;
  noteName: string;
  notePt: string;
  octave: number;
  cents: number;
  clarity: number;
  volume: number;
  timestamp: number;
}

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const NOTE_NAMES_PT = ['Dó', 'Dó#', 'Ré', 'Ré#', 'Mi', 'Fá', 'Fá#', 'Sol', 'Sol#', 'Lá', 'Lá#', 'Si'];

export class GuitarPitchDetector {
  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private micStream: MediaStream | null = null;
  private isListening: boolean = false;
  private buffer: Float32Array = new Float32Array(2048);
  private sensitivity: number = 0.015; // Noise gate RMS threshold
  private onPitchCallback: ((pitch: DetectedPitch | null) => void) | null = null;
  private animationFrameId: number | null = null;

  public async start(onPitch: (pitch: DetectedPitch | null) => void): Promise<boolean> {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Microfone não suportado pelo navegador.');
      }

      this.onPitchCallback = onPitch;

      this.micStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          autoGainControl: false,
          noiseSuppression: false,
        }
      });

      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioCtx();
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 2048;
      this.buffer = new Float32Array(this.analyser.fftSize);

      const source = this.audioCtx.createMediaStreamSource(this.micStream);
      source.connect(this.analyser);

      this.isListening = true;
      this.loop();
      return true;
    } catch (err) {
      console.warn('Erro ao inicializar microfone do detector:', err);
      this.stop();
      return false;
    }
  }

  public stop() {
    this.isListening = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    if (this.micStream) {
      this.micStream.getTracks().forEach((t) => t.stop());
      this.micStream = null;
    }
    if (this.audioCtx) {
      this.audioCtx.close();
      this.audioCtx = null;
    }
    this.onPitchCallback = null;
  }

  public getIsListening(): boolean {
    return this.isListening;
  }

  public setSensitivityLevel(level: 'low' | 'medium' | 'high') {
    if (level === 'low') this.sensitivity = 0.035; // precisa tocar mais forte
    else if (level === 'medium') this.sensitivity = 0.018; // balanceado
    else this.sensitivity = 0.008; // bem sensível
  }

  private loop = () => {
    if (!this.isListening || !this.analyser || !this.audioCtx) return;

    (this.analyser as any).getFloatTimeDomainData(this.buffer);

    // Compute RMS volume
    let sum = 0;
    for (let i = 0; i < this.buffer.length; i++) {
      sum += this.buffer[i] * this.buffer[i];
    }
    const rms = Math.sqrt(sum / this.buffer.length);
    const normalizedVolume = Math.min(1, rms * 8);

    if (rms > this.sensitivity) {
      const { freq, clarity } = this.autoCorrelate(this.buffer as any, this.audioCtx.sampleRate);

      // Guitar fundamentals typically range from ~70 Hz (Drop D / Low E) to ~900 Hz
      if (clarity >= 0.78 && freq >= 65 && freq <= 950) {
        const pitchData = this.freqToPitch(freq, clarity, normalizedVolume);
        if (this.onPitchCallback) {
          this.onPitchCallback(pitchData);
        }
      } else {
        if (this.onPitchCallback) {
          this.onPitchCallback(null);
        }
      }
    } else {
      if (this.onPitchCallback) {
        this.onPitchCallback(null);
      }
    }

    if (this.isListening) {
      this.animationFrameId = requestAnimationFrame(this.loop);
    }
  };

  private freqToPitch(freq: number, clarity: number, volume: number): DetectedPitch {
    // 12-TET midi note calculation
    // A4 = 440 Hz = MIDI 69
    const midi = 69 + 12 * Math.log2(freq / 440);
    const roundedMidi = Math.round(midi);
    const diffCents = Math.round((midi - roundedMidi) * 100);

    const noteIndex = (roundedMidi % 12 + 12) % 12;
    const octave = Math.floor(roundedMidi / 12) - 1;

    return {
      freq,
      noteName: NOTE_NAMES[noteIndex],
      notePt: NOTE_NAMES_PT[noteIndex],
      octave,
      cents: diffCents,
      clarity,
      volume,
      timestamp: performance.now(),
    };
  }

  // Check if detected pitch matches target guitar note (string + fret)
  public static matchesTarget(
    detected: DetectedPitch | null,
    targetString: number,
    targetFret: number,
    maxCentsError: number = 70
  ): boolean {
    if (!detected) return false;

    const targetFreq = getFrequency(targetString, targetFret);
    const targetNote = getNoteName(targetString, targetFret);

    // Direct frequency comparison in cents
    const centsDiff = Math.abs(1200 * Math.log2(detected.freq / targetFreq));
    if (centsDiff <= maxCentsError) {
      return true;
    }

    // Octave harmonic compensation (e.g., when the microphone picks up 2nd harmonic 2x freq)
    const harmonic2Diff = Math.abs(1200 * Math.log2(detected.freq / (targetFreq * 2)));
    if (harmonic2Diff <= maxCentsError) {
      return true;
    }

    // Sub-harmonic compensation (0.5x freq)
    const subHarmonicDiff = Math.abs(1200 * Math.log2(detected.freq / (targetFreq / 2)));
    if (subHarmonicDiff <= maxCentsError) {
      return true;
    }

    // If note name matches and cents within loose threshold (helps slightly detuned beginner guitars)
    if (detected.noteName === targetNote.en && Math.abs(detected.cents) <= 50) {
      return true;
    }

    return false;
  }

  // Autocorrelation algorithm (YIN-like peak detection)
  private autoCorrelate(buf: any, sampleRate: number): { freq: number; clarity: number } {
    const SIZE = buf.length;
    let r1 = 0;
    let r2 = SIZE - 1;
    const thres = 0.2;

    for (let i = 0; i < SIZE / 2; i++) {
      if (Math.abs(buf[i]) < thres) {
        r1 = i;
        break;
      }
    }
    for (let i = 1; i < SIZE / 2; i++) {
      if (Math.abs(buf[SIZE - i]) < thres) {
        r2 = SIZE - i;
        break;
      }
    }

    const trimmedBuf = buf.slice(r1, r2);
    const c = new Float32Array(trimmedBuf.length);
    for (let i = 0; i < trimmedBuf.length; i++) {
      for (let j = 0; j < trimmedBuf.length - i; j++) {
        c[i] += trimmedBuf[j] * trimmedBuf[j + i];
      }
    }

    let d = 0;
    while (c[d] > c[d + 1] && d < c.length - 1) d++;
    let maxval = -1;
    let maxpos = -1;
    for (let i = d; i < c.length; i++) {
      if (c[i] > maxval) {
        maxval = c[i];
        maxpos = i;
      }
    }

    let T0 = maxpos;
    if (T0 > 0 && T0 < c.length - 1) {
      const x1 = c[T0 - 1];
      const x2 = c[T0];
      const x3 = c[T0 + 1];
      const a = (x1 + x3 - 2 * x2) / 2;
      const b = (x3 - x1) / 2;
      if (a) {
        T0 = T0 - b / (2 * a);
      }
    }

    const freq = sampleRate / T0;
    const clarity = c[0] > 0 ? maxval / c[0] : 0;

    return { freq, clarity };
  }
}

export const guitarPitchDetector = new GuitarPitchDetector();
