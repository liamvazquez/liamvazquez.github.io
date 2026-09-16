const MUSIC_GAIN = 0.74;
const HORROR_GAIN = 0.3;

export type DiarySound =
  | "yes"
  | "no"
  | "denial"
  | "section"
  | "filter"
  | "like"
  | "unlike"
  | "comment"
  | "favorite"
  | "unfavorite"
  | "node"
  | "close"
  | "zoom-in"
  | "zoom-out"
  | "recenter"
  | "mute"
  | "pen";

const NOTES = {
  c2: 65.41,
  d2: 73.42,
  e2: 82.41,
  g2: 98,
  a2: 110,
  b2: 123.47,
  c3: 130.81,
  d3: 146.83,
  e3: 164.81,
  g3: 196,
  a3: 220,
  b3: 246.94,
  d4: 293.66,
  e4: 329.63,
  g4: 392,
  a4: 440,
  b4: 493.88,
  d5: 587.33,
} as const;

class DiaryAudio {
  private context: AudioContext | null = null;
  private master: GainNode | null = null;
  private effects: GainNode | null = null;
  private music: GainNode | null = null;
  private horror: GainNode | null = null;
  private timer: number | null = null;
  private nextBeat = 0;
  private step = 0;
  private musicPlaying = false;
  private denialRainPlaying = false;
  private denialNoiseSource: AudioBufferSourceNode | null = null;
  private denialRainTimer: number | null = null;
  private ambiencePlaying = false;
  private ambienceSource: AudioBufferSourceNode | null = null;
  private ambienceGain: GainNode | null = null;
  private musicVolume = 0.62;
  private musicMuted = false;
  private horrorPlaying = false;
  private horrorMode = false;
  private horrorSources: AudioScheduledSourceNode[] = [];
  private visibilityBound = false;

  constructor() {
    if (typeof window === "undefined") return;
    try {
      const saved = window.localStorage.getItem("liam-diary-jazz-volume");
      if (saved !== null) this.musicVolume = Math.min(1, Math.max(0, Number(saved)));
      this.musicMuted = this.musicVolume === 0;
    } catch {
      this.musicVolume = 0.62;
    }
  }

  init() {
    if (typeof window === "undefined") return false;
    if (!this.context) {
      const AudioContextClass = window.AudioContext;
      this.context = new AudioContextClass();
      this.master = this.context.createGain();
      this.effects = this.context.createGain();
      this.music = this.context.createGain();
      this.horror = this.context.createGain();
      const compressor = this.context.createDynamicsCompressor();
      this.master.gain.value = 0.72;
      this.effects.gain.value = 0.7;
      this.music.gain.value = this.musicMuted ? 0 : this.musicVolume * MUSIC_GAIN;
      this.horror.gain.value = 0;
      this.effects.connect(this.master);
      this.music.connect(this.master);
      this.horror.connect(this.master);
      this.master.connect(compressor);
      compressor.connect(this.context.destination);
    }
    if (this.context.state === "suspended") void this.context.resume();
    if (!this.visibilityBound) {
      document.addEventListener("visibilitychange", this.onVisibilityChange);
      this.visibilityBound = true;
    }
    return true;
  }

  private onVisibilityChange = () => {
    if (!this.context) return;
    if (document.hidden) void this.context.suspend();
    else if (this.musicPlaying || this.denialRainPlaying || this.horrorPlaying) void this.context.resume();
  };

  private tone(
    frequency: number,
    start: number,
    duration: number,
    volume: number,
    type: OscillatorType = "sine",
    destination = this.effects,
  ) {
    const context = this.context;
    if (!context || !destination) return;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(gain).connect(destination);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.02);
  }

  private slidingTone(
    from: number,
    to: number,
    start: number,
    duration: number,
    volume: number,
    type: OscillatorType,
  ) {
    const context = this.context;
    if (!context || !this.effects) return;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(from, start);
    oscillator.frequency.exponentialRampToValueAtTime(to, start + duration);
    gain.gain.setValueAtTime(volume, start);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(gain).connect(this.effects);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.02);
  }

  private noise(start: number, duration: number, volume: number, frequency: number, destination = this.effects) {
    const context = this.context;
    if (!context || !destination) return;
    const buffer = context.createBuffer(1, Math.ceil(context.sampleRate * duration), context.sampleRate);
    const channel = buffer.getChannelData(0);
    for (let i = 0; i < channel.length; i += 1) channel[i] = Math.random() * 2 - 1;
    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();
    source.buffer = buffer;
    filter.type = "bandpass";
    filter.frequency.value = frequency;
    filter.Q.value = 0.8;
    gain.gain.setValueAtTime(volume, start);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    source.connect(filter).connect(gain).connect(destination);
    source.start(start);
    source.stop(start + duration);
  }

  play(sound: DiarySound) {
    if (!this.init() || !this.context) return;
    const t = this.context.currentTime + 0.005;
    switch (sound) {
      case "yes":
        this.tone(NOTES.e4, t, 0.18, 0.12, "triangle");
        this.tone(NOTES.a4, t + 0.07, 0.34, 0.09, "sine");
        break;
      case "no":
        this.slidingTone(NOTES.e3, NOTES.b2, t, 0.18, 0.1, "triangle");
        break;
      case "denial":
        this.slidingTone(88, 34, t, 0.5, 0.34, "sine");
        this.tone(55, t, 0.62, 0.26, "sine");
        this.noise(t, 0.16, 0.16, 190);
        this.noise(t + 0.18, 0.48, 0.045, 720);
        break;
      case "section":
        this.tone(NOTES.d4, t, 0.1, 0.055, "triangle");
        this.tone(NOTES.a4, t + 0.045, 0.15, 0.04, "sine");
        break;
      case "filter":
        this.noise(t, 0.065, 0.055, 2400);
        this.tone(NOTES.g4, t, 0.08, 0.035, "sine");
        break;
      case "like":
        this.tone(NOTES.a2, t, 0.12, 0.13, "sine");
        this.tone(NOTES.e3, t + 0.13, 0.18, 0.11, "sine");
        break;
      case "unlike":
        this.tone(NOTES.e3, t, 0.1, 0.07, "sine");
        this.tone(NOTES.a2, t + 0.08, 0.13, 0.06, "sine");
        break;
      case "comment":
        this.tone(185, t, 0.13, 0.08, "square");
        this.tone(174, t + 0.09, 0.2, 0.07, "triangle");
        break;
      case "favorite":
        [NOTES.e4, NOTES.a4, NOTES.d5].forEach((note, index) => this.tone(note, t + index * 0.055, 0.2, 0.055, "sine"));
        break;
      case "unfavorite":
        this.slidingTone(NOTES.d5, NOTES.e4, t, 0.2, 0.055, "sine");
        break;
      case "node":
        this.tone(NOTES.d3, t, 0.4, 0.08, "sine");
        this.tone(NOTES.a3, t + 0.025, 0.48, 0.045, "triangle");
        break;
      case "close":
        this.noise(t, 0.045, 0.045, 900);
        break;
      case "zoom-in":
        this.slidingTone(NOTES.d3, NOTES.a3, t, 0.14, 0.05, "sine");
        break;
      case "zoom-out":
        this.slidingTone(NOTES.a3, NOTES.d3, t, 0.14, 0.05, "sine");
        break;
      case "recenter":
        this.tone(NOTES.d3, t, 0.12, 0.05, "triangle");
        this.tone(NOTES.d4, t + 0.075, 0.16, 0.05, "triangle");
        break;
      case "mute":
        this.tone(NOTES.g3, t, 0.1, 0.045, "sine");
        break;
      case "pen":
        for (let index = 0; index < 15; index += 1) {
          const offset = index * 0.09 + Math.random() * 0.025;
          this.noise(t + offset, 0.07 + Math.random() * 0.055, 0.026 + Math.random() * 0.018, 2200 + Math.random() * 1700);
        }
        this.noise(t + 1.34, 0.5, 0.035, 1550);
        this.noise(t + 1.78, 0.12, 0.04, 2900);
        break;
    }
  }

  startDenialRain() {
    if (!this.init() || !this.context || !this.effects || this.denialRainPlaying) return;
    this.denialRainPlaying = true;
    const context = this.context;
    const duration = 2.4;
    const buffer = context.createBuffer(1, Math.ceil(context.sampleRate * duration), context.sampleRate);
    const channel = buffer.getChannelData(0);
    let brown = 0;
    for (let index = 0; index < channel.length; index += 1) {
      const white = Math.random() * 2 - 1;
      brown = (brown + 0.018 * white) / 1.018;
      channel[index] = white * 0.16 + brown * 4.2;
    }

    const source = context.createBufferSource();
    const lowpass = context.createBiquadFilter();
    const highpass = context.createBiquadFilter();
    const gain = context.createGain();
    const lfo = context.createOscillator();
    const lfoDepth = context.createGain();
    source.buffer = buffer;
    source.loop = true;
    lowpass.type = "lowpass";
    lowpass.frequency.value = 1850;
    lowpass.Q.value = 0.35;
    highpass.type = "highpass";
    highpass.frequency.value = 120;
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.052, context.currentTime + 1.8);
    lfo.type = "sine";
    lfo.frequency.value = 0.11;
    lfoDepth.gain.value = 0.008;
    lfo.connect(lfoDepth).connect(gain.gain);
    source.connect(highpass).connect(lowpass).connect(gain).connect(this.effects);
    source.start();
    lfo.start();
    this.denialNoiseSource = source;
    const scheduleDrops = () => {
      if (!this.context || !this.denialRainPlaying) return;
      const now = this.context.currentTime + 0.015;
      for (let index = 0; index < 3; index += 1) {
        const offset = Math.random() * 1.25;
        this.noise(now + offset, 0.08 + Math.random() * 0.12, 0.006 + Math.random() * 0.007, 850 + Math.random() * 950);
      }
    };
    scheduleDrops();
    this.denialRainTimer = window.setInterval(scheduleDrops, 1200);
  }

  private ambienceLevel() {
    return this.musicMuted ? 0 : this.musicVolume * 0.16;
  }

  /** Soft brown-noise bed for the entrance screen. */
  startEntranceAmbience() {
    if (!this.init() || !this.context || !this.master || this.ambiencePlaying) return;
    this.ambiencePlaying = true;
    const context = this.context;
    const duration = 3;
    const buffer = context.createBuffer(1, Math.ceil(context.sampleRate * duration), context.sampleRate);
    const channel = buffer.getChannelData(0);
    let brown = 0;
    for (let index = 0; index < channel.length; index += 1) {
      const white = Math.random() * 2 - 1;
      brown = (brown + 0.021 * white) / 1.021;
      channel[index] = brown * 3.2;
    }

    const source = context.createBufferSource();
    const lowpass = context.createBiquadFilter();
    const highpass = context.createBiquadFilter();
    const gain = context.createGain();
    const sway = context.createOscillator();
    const swayDepth = context.createGain();
    source.buffer = buffer;
    source.loop = true;
    lowpass.type = "lowpass";
    lowpass.frequency.value = 640;
    lowpass.Q.value = 0.3;
    highpass.type = "highpass";
    highpass.frequency.value = 45;
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.linearRampToValueAtTime(this.ambienceLevel(), context.currentTime + 2.4);
    sway.type = "sine";
    sway.frequency.value = 0.06;
    swayDepth.gain.value = 0.012;
    sway.connect(swayDepth).connect(gain.gain);
    source.connect(highpass).connect(lowpass).connect(gain).connect(this.master);
    source.start();
    sway.start();
    this.ambienceSource = source;
    this.ambienceGain = gain;

    if (context.state !== "running") {
      const resume = () => {
        void context.resume();
        window.removeEventListener("pointerdown", resume);
        window.removeEventListener("keydown", resume);
      };
      window.addEventListener("pointerdown", resume);
      window.addEventListener("keydown", resume);
    }
  }

  stopEntranceAmbience() {
    if (!this.ambiencePlaying || !this.context) return;
    this.ambiencePlaying = false;
    const source = this.ambienceSource;
    const gain = this.ambienceGain;
    this.ambienceSource = null;
    this.ambienceGain = null;
    if (gain) {
      const now = this.context.currentTime;
      gain.gain.cancelScheduledValues(now);
      gain.gain.setValueAtTime(gain.gain.value, now);
      gain.gain.linearRampToValueAtTime(0.0001, now + 1.4);
    }
    window.setTimeout(() => {
      try {
        source?.stop();
      } catch {
        // Already stopped.
      }
    }, 1600);
  }

  startJazz() {
    if (!this.init() || !this.context || this.musicPlaying) return;
    this.stopEntranceAmbience();
    this.musicPlaying = true;
    this.nextBeat = this.context.currentTime + 0.08;
    this.step = 0;
    this.scheduler();
    this.timer = window.setInterval(() => this.scheduler(), 25);
  }

  setHorrorMode(enabled: boolean) {
    if (!this.init() || !this.context || !this.music || !this.horror) return;
    const now = this.context.currentTime;
    const target = this.musicMuted ? 0 : this.musicVolume;
    this.horrorMode = enabled;

    if (enabled && !this.horrorPlaying) this.startHorrorTexture();

    this.music.gain.cancelScheduledValues(now);
    this.horror.gain.cancelScheduledValues(now);
    this.music.gain.setValueAtTime(this.music.gain.value, now);
    this.horror.gain.setValueAtTime(this.horror.gain.value, now);
    this.music.gain.linearRampToValueAtTime(enabled ? 0 : target * MUSIC_GAIN, now + 2);
    this.horror.gain.linearRampToValueAtTime(enabled ? target * HORROR_GAIN : 0, now + 2);
  }

  private startHorrorTexture() {
    const context = this.context;
    const destination = this.horror;
    if (!context || !destination) return;
    this.horrorPlaying = true;

    const drone = context.createOscillator();
    const uneasy = context.createOscillator();
    const wobble = context.createOscillator();
    const wobbleDepth = context.createGain();
    const lowpass = context.createBiquadFilter();
    drone.type = "sine";
    drone.frequency.value = 43.65;
    uneasy.type = "triangle";
    uneasy.frequency.value = 65.8;
    wobble.type = "sine";
    wobble.frequency.value = 0.19;
    wobbleDepth.gain.value = 2.4;
    lowpass.type = "lowpass";
    lowpass.frequency.value = 620;
    lowpass.Q.value = 2.8;
    wobble.connect(wobbleDepth);
    wobbleDepth.connect(uneasy.detune);
    drone.connect(lowpass);
    uneasy.connect(lowpass);
    lowpass.connect(destination);
    drone.start();
    uneasy.start();
    wobble.start();
    this.horrorSources.push(drone, uneasy, wobble);

    const duration = 3.7;
    const buffer = context.createBuffer(1, Math.ceil(context.sampleRate * duration), context.sampleRate);
    const channel = buffer.getChannelData(0);
    let previous = 0;
    for (let index = 0; index < channel.length; index += 1) {
      const white = Math.random() * 2 - 1;
      previous = previous * 0.985 + white * 0.015;
      channel[index] = previous * 0.7;
    }
    const tape = context.createBufferSource();
    const tapeFilter = context.createBiquadFilter();
    tape.buffer = buffer;
    tape.loop = true;
    tapeFilter.type = "bandpass";
    tapeFilter.frequency.value = 1280;
    tapeFilter.Q.value = 0.5;
    tape.connect(tapeFilter).connect(destination);
    tape.start();
    this.horrorSources.push(tape);
  }

  private scheduler() {
    const context = this.context;
    if (!context || !this.music || !this.musicPlaying) return;
    const eighth = 60 / 92 / 2;
    while (this.nextBeat < context.currentTime + 0.12) {
      this.scheduleJazzStep(this.step, this.nextBeat, eighth);
      this.nextBeat += eighth;
      this.step = (this.step + 1) % 32;
    }
  }

  private scheduleJazzStep(step: number, time: number, eighth: number) {
    const bass = [NOTES.a2, NOTES.c3, NOTES.e3, NOTES.g2, NOTES.d2, NOTES.e2, NOTES.g2, NOTES.b2];
    if (step % 2 === 0) {
      const bassNote = bass[(step / 2) % bass.length];
      if (bassNote) this.tone(bassNote, time, eighth * 1.7, 0.12, "triangle", this.music);
    }
    if (step % 8 === 0) {
      const chords = step % 16 === 0
        ? [NOTES.a3, NOTES.c3 * 2, NOTES.e4, NOTES.g4]
        : [NOTES.d3, NOTES.a3, NOTES.c3 * 2, NOTES.e4];
      chords.forEach((note, index) => this.tone(note, time + 0.018 * index, eighth * 5.4, 0.027, "sine", this.music));
    }
    if (step % 4 === 2) this.noise(time, 0.16, 0.025, 3600, this.music);
    if (step % 8 === 4) this.noise(time, 0.24, 0.04, 1300, this.music);
    if (step % 16 === 14) {
      this.tone(NOTES.b4, time, 0.16, 0.025, "triangle", this.music);
      this.tone(NOTES.a4, time + eighth * 0.48, 0.19, 0.025, "triangle", this.music);
    }
  }

  getMusicVolume() {
    return this.musicMuted ? 0 : this.musicVolume;
  }

  setMusicVolume(value: number) {
    this.init();
    const next = Math.min(1, Math.max(0, value));
    this.musicVolume = next;
    this.musicMuted = next === 0;
    if (this.music && this.context) {
      this.music.gain.setTargetAtTime(this.horrorMode ? 0 : next * MUSIC_GAIN, this.context.currentTime, 0.045);
      if (this.horror) this.horror.gain.setTargetAtTime(this.horrorMode ? next * HORROR_GAIN : 0, this.context.currentTime, 0.045);
      if (this.ambienceGain) this.ambienceGain.gain.setTargetAtTime(this.ambienceLevel(), this.context.currentTime, 0.08);
    }
    try {
      window.localStorage.setItem("liam-diary-jazz-volume", String(next));
    } catch {
      // Audio still works when storage is unavailable.
    }
    return next;
  }

  toggleMusicMute() {
    const nextMuted = !this.musicMuted;
    this.musicMuted = nextMuted;
    if (!nextMuted && this.musicVolume === 0) this.musicVolume = 0.62;
    if (this.music && this.context) {
      this.music.gain.setTargetAtTime(nextMuted ? 0 : this.musicVolume * MUSIC_GAIN, this.context.currentTime, 0.045);
      if (this.horror && this.horrorMode) {
        this.music.gain.setTargetAtTime(0, this.context.currentTime, 0.045);
        this.horror.gain.setTargetAtTime(nextMuted ? 0 : this.musicVolume * HORROR_GAIN, this.context.currentTime, 0.045);
      }
      if (this.ambienceGain) this.ambienceGain.gain.setTargetAtTime(this.ambienceLevel(), this.context.currentTime, 0.08);
    }
    if (!nextMuted) this.play("mute");
    if (!nextMuted) {
      try {
        window.localStorage.setItem("liam-diary-jazz-volume", String(this.musicVolume));
      } catch {
        // Audio still works when storage is unavailable.
      }
    }
    return nextMuted;
  }
}

export const diaryAudio = new DiaryAudio();
