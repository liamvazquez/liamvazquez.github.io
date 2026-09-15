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
  | "mute";

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
  private timer: number | null = null;
  private nextBeat = 0;
  private step = 0;
  private musicPlaying = false;
  private musicVolume = 0.62;
  private musicMuted = false;
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
      const compressor = this.context.createDynamicsCompressor();
      this.master.gain.value = 0.72;
      this.effects.gain.value = 0.7;
      this.music.gain.value = this.musicMuted ? 0 : this.musicVolume * 0.16;
      this.effects.connect(this.master);
      this.music.connect(this.master);
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
    else if (this.musicPlaying) void this.context.resume();
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
        this.slidingTone(122, 38, t, 0.42, 0.28, "sawtooth");
        this.slidingTone(94, 188, t + 0.04, 0.72, 0.12, "square");
        this.noise(t, 0.52, 0.2, 1700);
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
    }
  }

  startJazz() {
    if (!this.init() || !this.context || this.musicPlaying) return;
    this.musicPlaying = true;
    this.nextBeat = this.context.currentTime + 0.08;
    this.step = 0;
    this.scheduler();
    this.timer = window.setInterval(() => this.scheduler(), 25);
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
      this.music.gain.setTargetAtTime(next * 0.16, this.context.currentTime, 0.045);
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
      this.music.gain.setTargetAtTime(nextMuted ? 0 : this.musicVolume * 0.16, this.context.currentTime, 0.045);
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
