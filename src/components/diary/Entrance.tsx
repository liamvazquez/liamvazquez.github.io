import { useState } from "react";
import liamAvatar from "@/assets/liam-avatar.png.asset.json";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Stage = "first" | "second" | "leaving" | "glitch" | "rejected";

function playDenialSound() {
  try {
    const context = new AudioContext();
    const master = context.createGain();
    const compressor = context.createDynamicsCompressor();
    const now = context.currentTime;

    master.gain.setValueAtTime(0.0001, now);
    master.gain.exponentialRampToValueAtTime(0.42, now + 0.012);
    master.gain.exponentialRampToValueAtTime(0.0001, now + 0.82);
    master.connect(compressor);
    compressor.connect(context.destination);

    const impact = context.createOscillator();
    const impactGain = context.createGain();
    impact.type = "sawtooth";
    impact.frequency.setValueAtTime(118, now);
    impact.frequency.exponentialRampToValueAtTime(38, now + 0.3);
    impactGain.gain.setValueAtTime(0.6, now);
    impactGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);
    impact.connect(impactGain).connect(master);
    impact.start(now);
    impact.stop(now + 0.4);

    [92, 111].forEach((frequency, index) => {
      const buzzer = context.createOscillator();
      const buzzerGain = context.createGain();
      buzzer.type = index === 0 ? "square" : "sawtooth";
      buzzer.frequency.setValueAtTime(frequency, now + 0.05);
      buzzer.frequency.linearRampToValueAtTime(frequency * 1.9, now + 0.7);
      buzzerGain.gain.setValueAtTime(0.0001, now);
      buzzerGain.gain.exponentialRampToValueAtTime(0.16, now + 0.06);
      buzzerGain.gain.setValueAtTime(0.13, now + 0.5);
      buzzerGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
      buzzer.connect(buzzerGain).connect(master);
      buzzer.start(now);
      buzzer.stop(now + 0.82);
    });

    const noiseBuffer = context.createBuffer(1, Math.floor(context.sampleRate * 0.5), context.sampleRate);
    const channel = noiseBuffer.getChannelData(0);
    for (let i = 0; i < channel.length; i += 1) channel[i] = Math.random() * 2 - 1;
    const noise = context.createBufferSource();
    const noiseFilter = context.createBiquadFilter();
    const noiseGain = context.createGain();
    noise.buffer = noiseBuffer;
    noiseFilter.type = "bandpass";
    noiseFilter.frequency.setValueAtTime(1800, now);
    noiseFilter.Q.setValueAtTime(0.7, now);
    noiseGain.gain.setValueAtTime(0.24, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.48);
    noise.connect(noiseFilter).connect(noiseGain).connect(master);
    noise.start(now);
    noise.stop(now + 0.5);

    window.setTimeout(() => void context.close(), 1100);
  } catch {
    // The visual rejection remains fully functional if browser audio is unavailable.
  }
}

function GateButton({
  children,
  onClick,
  tone = "cream",
}: {
  children: React.ReactNode;
  onClick: () => void;
  tone?: "cream" | "ghost";
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      onClick={onClick}
      className={cn(
        "h-auto min-w-[9rem] rounded-none px-10 py-3 text-xs font-normal uppercase tracking-editorial shadow-none transition-all duration-500 hover:bg-transparent",
        "border",
        tone === "cream"
          ? "border-cream/70 text-cream hover:bg-cream hover:text-ink"
          : "border-cream/20 text-cream/55 hover:border-cream/60 hover:text-cream",
      )}
    >
      {children}
    </Button>
  );
}

export function Entrance({ onEnter }: { onEnter: () => void }) {
  const [stage, setStage] = useState<Stage>("first");

  if (stage === "rejected") {
    return (
      <div className="lockout-scene grain fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-destructive px-6 select-none">
        <div className="lockout-scanlines absolute inset-0" />
        <div className="lockout-fracture absolute inset-0" aria-hidden="true" />
        <span className="absolute top-7 left-7 font-mono text-[0.58rem] tracking-editorial text-destructive-foreground/55 uppercase">Access revoked // 00:00:00</span>
        <span className="absolute right-7 bottom-7 font-mono text-[0.58rem] tracking-editorial text-destructive-foreground/55 uppercase">Do not return</span>
        <div className="animate-cross-draw lockout-cross relative h-40 w-40 md:h-56 md:w-56">
          <span className="absolute top-1/2 left-0 h-[10px] w-full -translate-y-1/2 rotate-45 bg-destructive-foreground shadow-[0_0_30px_var(--destructive-foreground)]" />
          <span className="absolute top-1/2 left-0 h-[10px] w-full -translate-y-1/2 -rotate-45 bg-destructive-foreground shadow-[0_0_30px_var(--destructive-foreground)]" />
        </div>
        <p
          className="lockout-copy animate-soft-rise mt-14 text-center font-[family-name:var(--font-display)] text-4xl text-destructive-foreground md:text-6xl"
          data-text="Then fuck off then."
          style={{ animationDelay: "0.35s" }}
        >
          Then fuck off then.
        </p>
        <div className="absolute top-[18%] left-0 h-px w-[42%] rotate-6 bg-destructive-foreground/30" />
        <div className="absolute right-0 bottom-[23%] h-px w-[48%] -rotate-12 bg-destructive-foreground/30" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "entrance-scene grain fixed inset-0 z-40 overflow-hidden bg-background",
        stage === "glitch" && "animate-glitch-out",
        stage === "leaving" && "animate-veil-out",
      )}
    >
      <img
        src={liamAvatar.url}
        alt="Liam Vazquez standing in his school uniform"
        className="absolute inset-y-0 right-[-12%] h-full w-[82%] scale-105 object-contain object-right opacity-50 brightness-[0.62] contrast-[1.12] saturate-[0.72] md:right-[2%] md:w-[62%]"
      />
      <div className="vignette absolute inset-0" />

      <div className="pointer-events-none absolute inset-0 text-ash/50" aria-hidden="true">
        <div className="absolute top-8 left-7 border border-current px-4 py-3 text-[0.55rem] tracking-editorial uppercase md:top-12 md:left-12">
          <span className="block text-cream/75">Midori High</span>
          <span className="mt-1 block">Private archive · 09/15/26</span>
        </div>
        <div className="absolute top-8 right-7 text-right font-[family-name:var(--font-display)] text-xl text-cream/35 md:top-12 md:right-12 md:text-3xl">
          緑高校<br /><span className="text-[0.55rem] font-sans tracking-editorial uppercase">Personal record</span>
        </div>
        <div className="absolute bottom-9 left-7 font-mono text-[0.55rem] leading-loose tracking-[0.16em] uppercase md:bottom-12 md:left-12">
          35.6762° N<br />139.6503° E<br />File LV-0915
        </div>
        <div className="absolute bottom-10 left-1/2 h-12 w-px bg-cream/20 before:absolute before:top-1/2 before:left-1/2 before:h-px before:w-12 before:-translate-x-1/2 before:bg-cream/20" />
        <span className="entrance-tape absolute top-[20%] left-[5%] h-6 w-24 -rotate-6 bg-cream/10 md:left-[26%]" />
        <span className="absolute top-1/2 left-5 text-[4rem] font-thin text-cream/10 md:left-16">＋</span>
      </div>

      <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
        <p className="animate-soft-rise text-[0.6rem] tracking-editorial text-ash uppercase">
          Private property of Liam Vazquez
        </p>
        <h1
          key={stage}
          className="animate-soft-rise mt-8 max-w-3xl font-[family-name:var(--font-display)] text-3xl leading-tight font-light text-cream italic md:text-5xl"
        >
          {stage === "second" ? "Are you sure?" : "Are you sure you want to enter his diary?"}
        </h1>

        <div
          className="animate-soft-rise mt-14 flex flex-wrap items-center justify-center gap-5"
          style={{ animationDelay: "0.2s" }}
        >
          <GateButton
            onClick={() => {
              if (stage === "first") {
                setStage("second");
                return;
              }
              setStage("leaving");
              window.setTimeout(onEnter, 700);
            }}
          >
            Yes
          </GateButton>
          <GateButton
            tone="ghost"
            onClick={() => {
              if (stage === "second") {
                setStage("first");
                return;
              }
              playDenialSound();
              setStage("glitch");
              window.setTimeout(() => setStage("rejected"), 600);
            }}
          >
            No
          </GateButton>
        </div>

        <p className="mt-16 text-[0.6rem] tracking-editorial text-ash/60 uppercase">
          {stage === "second" ? "Last chance" : "Nothing here was written for you"}
        </p>
      </div>
    </div>
  );
}
