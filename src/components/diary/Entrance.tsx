import { useState } from "react";
import liamAvatar from "@/assets/liam-avatar.png.asset.json";
import { cn } from "@/lib/utils";

type Stage = "first" | "second" | "leaving" | "glitch" | "rejected";

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
    <button
      onClick={onClick}
      className={cn(
        "min-w-[9rem] px-10 py-3 text-xs uppercase tracking-editorial transition-all duration-500",
        "border",
        tone === "cream"
          ? "border-cream/70 text-cream hover:bg-cream hover:text-ink"
          : "border-cream/20 text-cream/55 hover:border-cream/60 hover:text-cream",
      )}
    >
      {children}
    </button>
  );
}

export function Entrance({ onEnter }: { onEnter: () => void }) {
  const [stage, setStage] = useState<Stage>("first");

  if (stage === "rejected") {
    return (
      <div className="grain fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#4a0206] px-6 select-none">
        <div className="animate-cross-draw relative h-40 w-40 md:h-56 md:w-56">
          <span className="absolute top-1/2 left-0 h-[10px] w-full -translate-y-1/2 rotate-45 bg-white" />
          <span className="absolute top-1/2 left-0 h-[10px] w-full -translate-y-1/2 -rotate-45 bg-white" />
        </div>
        <p
          className="animate-soft-rise mt-14 text-center font-[family-name:var(--font-display)] text-4xl text-white md:text-6xl"
          style={{ animationDelay: "0.35s" }}
        >
          Then fuck off then.
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grain fixed inset-0 z-40 overflow-hidden bg-black",
        stage === "glitch" && "animate-glitch-out",
        stage === "leaving" && "animate-veil-out",
      )}
    >
      <img
        src={liamAvatar.url}
        alt="Liam Vazquez standing in his school uniform"
        className="absolute inset-0 h-full w-full scale-105 object-contain opacity-45 brightness-[0.6] contrast-[1.1] saturate-[0.7]"
      />
      <div className="vignette absolute inset-0" />

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
