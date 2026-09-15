import { useState } from "react";
import liamAvatar from "@/assets/liam-avatar.png.asset.json";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { diaryAudio } from "@/lib/diaryAudio";

type Stage = "first" | "second" | "leaving" | "rejected";

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
        "h-auto min-w-[9rem] rounded-none px-10 py-3 text-xs font-normal uppercase tracking-editorial shadow-none transition-[color,background-color,border-color,transform] duration-500 hover:bg-transparent",
        "border",
        tone === "cream"
          ? "border-cream/70 text-cream hover:bg-cream hover:text-ink"
          : "border-cream/25 bg-background/15 font-[family-name:var(--font-display)] text-sm text-cream/65 italic hover:-translate-y-0.5 hover:border-destructive/70 hover:bg-destructive/10 hover:text-cream",
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
        <div className="lockout-paper absolute inset-0" aria-hidden="true" />
        <div className="lockout-shadow absolute inset-0" aria-hidden="true" />
        <span className="lockout-pencil lockout-pencil-one" aria-hidden="true" />
        <span className="lockout-pencil lockout-pencil-two" aria-hidden="true" />
        <div className="lockout-cross relative h-40 w-40 md:h-56 md:w-56" aria-hidden="true">
          <span className="lockout-stroke lockout-stroke-one" />
          <span className="lockout-stroke lockout-stroke-two" />
        </div>
        <p
          className="lockout-copy mt-12 text-center font-[family-name:var(--font-display)] text-5xl font-semibold text-destructive-foreground italic md:text-7xl"
        >
          Then fuck off then.
        </p>
        <p className="lockout-subcopy mt-5 text-center font-[family-name:var(--font-display)] text-lg text-destructive-foreground/65 italic">
          Reload it yourself if you’re that desperate.
        </p>
        <div className="lockout-signoff mt-11 flex flex-col items-center text-destructive-foreground" aria-label="Sincerely, Vaz.">
          <svg
            className="lockout-signature h-16 w-48 md:h-20 md:w-60"
            viewBox="0 0 240 80"
            fill="none"
            aria-hidden="true"
          >
            <path pathLength="1" className="lockout-signature-stroke lockout-signature-main" d="M89 8C80 27 72 49 72 57C72 65 79 62 88 51C96 41 99 35 97 31C95 27 91 34 91 42C91 52 98 57 106 50C115 42 120 25 116 23C111 20 104 31 104 40C104 52 114 57 124 48C135 38 145 30 159 27C173 24 181 29 176 39C170 51 151 59 126 62" />
            <path pathLength="1" className="lockout-signature-stroke lockout-signature-sweep" d="M8 61C46 59 82 64 119 65C158 66 196 65 230 64" />
            <path pathLength="1" className="lockout-signature-stroke lockout-signature-flick" d="M235 64L239 64" />
          </svg>
          <p className="lockout-sincerely font-[family-name:var(--font-display)] text-xl italic md:text-2xl">
            Sincerely, Vaz.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "entrance-scene grain fixed inset-0 z-40 overflow-hidden bg-background",
        stage === "leaving" && "animate-veil-out",
      )}
    >
      <img
        src={liamAvatar.url}
        alt="Liam Vazquez standing in his school uniform"
        className="absolute inset-y-0 right-[-12%] h-full w-[82%] scale-105 object-contain object-right opacity-50 brightness-[0.62] contrast-[1.12] saturate-[0.72] md:right-[2%] md:w-[62%]"
      />
      <div className="vignette absolute inset-0" />

      {stage === "leaving" ? (
        <div className="diary-entry-transition absolute inset-0 z-30" aria-hidden="true">
          <span className="diary-entry-iris" />
          <span className="diary-entry-ring diary-entry-ring-one" />
          <span className="diary-entry-ring diary-entry-ring-two" />
          <span className="diary-entry-sweep diary-entry-sweep-left" />
          <span className="diary-entry-sweep diary-entry-sweep-right" />
          <span className="diary-entry-mark">LV / 0915</span>
        </div>
      ) : null}

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
                diaryAudio.play("yes");
                setStage("second");
                return;
              }
              diaryAudio.play("yes");
              diaryAudio.startJazz();
              setStage("leaving");
              window.setTimeout(onEnter, 1100);
            }}
          >
            Yes
          </GateButton>
          <GateButton
            tone="ghost"
            onClick={() => {
              diaryAudio.play("denial");
              setStage("rejected");
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
