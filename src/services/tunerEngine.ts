import { STRING_CONFIGS } from './audioEngine';

export interface TunerResult {
  detectedFreq: number;
  closestString: typeof STRING_CONFIGS[0];
  diffCents: number;
  inTune: boolean;
  clarity: number; // 0 to 1
}

export class TunerEngine {
  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private micStream: MediaStream | null = null;
  private isListening: boolean = false;
  private buffer: Float32Array = new Float32Array(2048);

  public async startListening(onUpdate: (result: TunerResult | null) => void): Promise<boolean> {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Microfone não suportado neste navegador.');
      }

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
      this.processLoop(onUpdate);
      return true;
    } catch (err) {
      console.warn('Microphone error or permission denied:', err);
      this.stopListening();
      return false;
    }
  }

  public stopListening() {
    this.isListening = false;
    if (this.micStream) {
      this.micStream.getTracks().forEach(track => track.stop());
      this.micStream = null;
    }
    if (this.audioCtx) {
      this.audioCtx.close();
      this.audioCtx = null;
    }
  }

  public getIsListening(): boolean {
    return this.isListening;
  }

  private processLoop(onUpdate: (result: TunerResult | null) => void) {
    if (!this.isListening || !this.analyser || !this.audioCtx) return;

    (this.analyser as any).getFloatTimeDomainData(this.buffer);
    const { freq, clarity } = this.autoCorrelate(this.buffer as any, this.audioCtx.sampleRate);

    if (clarity > 0.8 && freq >= 60 && freq <= 450) {
      // Find closest guitar string
      let closestStr = STRING_CONFIGS[0];
      let minDiffCents = 999999;

      for (const str of STRING_CONFIGS) {
        const cents = 1200 * Math.log2(freq / str.baseFreq);
        if (Math.abs(cents) < Math.abs(minDiffCents)) {
          minDiffCents = cents;
          closestStr = str;
        }
      }

      // If within a reasonable guitar window (e.g. ±120 cents of any string)
      if (Math.abs(minDiffCents) < 140) {
        onUpdate({
          detectedFreq: freq,
          closestString: closestStr,
          diffCents: Math.round(minDiffCents),
          inTune: Math.abs(minDiffCents) <= 4,
          clarity
        });
      } else {
        onUpdate(null);
      }
    } else {
      onUpdate(null);
    }

    if (this.isListening) {
      requestAnimationFrame(() => this.processLoop(onUpdate));
    }
  }

  // Autocorrelation algorithm for robust pitch tracking
  private autoCorrelate(buf: any, sampleRate: number): { freq: number; clarity: number } {
    const SIZE = buf.length;
    let rms = 0;
    for (let i = 0; i < SIZE; i++) {
      rms += buf[i] * buf[i];
    }
    rms = Math.sqrt(rms / SIZE);
    // Noise floor threshold
    if (rms < 0.015) {
      return { freq: -1, clarity: 0 };
    }

    // Trim leading / trailing quiet edges
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
      // Parabolic interpolation for fine frequency resolution
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

export const tunerEngine = new TunerEngine();
