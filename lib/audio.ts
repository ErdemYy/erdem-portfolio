import { audioAssets } from "@/data/assets";
import { getExperience, setExperience } from "./experience";

type SoundName = keyof typeof audioAssets;

/**
 * Optional audio architecture. Silent by default, never autoplays, and every
 * failure path degrades to "no sound" — the site doesn't need any audio file.
 * Drop mp3s into /public/audio (names in data/assets.ts) and the toggle
 * appears automatically.
 */
class AudioController {
  private ctx: AudioContext | null = null;
  private buffers = new Map<SoundName, AudioBuffer | null>();
  private ambience: { src: AudioBufferSourceNode; gain: GainNode } | null = null;
  private master: GainNode | null = null;
  private available = new Set<SoundName>();

  /**
   * Which audio files exist is decided on the server (fs check in the layout),
   * so a missing file never produces a failing network request.
   */
  configure(files: Partial<Record<SoundName, boolean>>) {
    this.available = new Set(
      (Object.keys(files) as SoundName[]).filter((k) => files[k]),
    );
    setExperience({ soundAvailable: this.available.size > 0 });
  }

  private async load(name: SoundName) {
    if (this.buffers.has(name)) return this.buffers.get(name) ?? null;
    if (!this.ctx || !this.available.has(name)) {
      this.buffers.set(name, null);
      return null;
    }
    try {
      const res = await fetch(audioAssets[name]);
      const buf = await this.ctx.decodeAudioData(await res.arrayBuffer());
      this.buffers.set(name, buf);
      return buf;
    } catch {
      this.buffers.set(name, null);
      return null;
    }
  }

  async enable() {
    if (!this.ctx) {
      const Ctx =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!Ctx) return;
      this.ctx = new Ctx();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.6;
      this.master.connect(this.ctx.destination);
    }
    await this.ctx.resume();
    setExperience({ soundOn: true });
    void this.startAmbience("ambience");
  }

  async disable() {
    setExperience({ soundOn: false });
    this.ambience?.gain.gain.setTargetAtTime(0, this.ctx?.currentTime ?? 0, 0.2);
    await this.ctx?.suspend();
  }

  toggle() {
    return getExperience().soundOn ? this.disable() : this.enable();
  }

  private async startAmbience(name: SoundName) {
    if (!this.ctx || !this.master) return;
    const buf = await this.load(name);
    if (!buf) return;
    this.ambience?.src.stop();
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    const gain = this.ctx.createGain();
    gain.gain.value = 0;
    src.connect(gain).connect(this.master);
    src.start();
    gain.gain.setTargetAtTime(0.35, this.ctx.currentTime, 0.8);
    this.ambience = { src, gain };
  }

  /** One-shot UI sound (click, keyboard…). */
  async play(name: SoundName, volume = 0.4) {
    if (!getExperience().soundOn || !this.ctx || !this.master) return;
    const buf = await this.load(name);
    if (!buf) return;
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    const gain = this.ctx.createGain();
    gain.gain.value = volume;
    src.connect(gain).connect(this.master);
    src.start();
  }
}

export const audio = new AudioController();
