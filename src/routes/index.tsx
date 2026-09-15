import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Volume1, Volume2, VolumeX } from "lucide-react";
import { Entrance } from "@/components/diary/Entrance";
import { VisitorCounter } from "@/components/diary/VisitorCounter";
import { BlogFeed } from "@/components/diary/BlogFeed";
import { RelationshipGraph } from "@/components/diary/RelationshipGraph";
import { Backstory } from "@/components/diary/Backstory";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { diaryAudio } from "@/lib/diaryAudio";
import { Slider } from "@/components/ui/slider";
import { incrementDiaryVisit } from "@/lib/visits.functions";
import waterfallImage from "@/assets/waterfall.png";

const TITLE = "Vazquez's Diary";
const DESCRIPTION =
  `╰ˋˋ→ 🏵️┃"Who even fucking cares anyways..? Don't you have nothing better to do...? I guess you could check it out then,"`;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Section = "blog" | "relationships" | "backstory";
type TransitionDirection = "into" | "out" | null;

function Index() {
  const [entered, setEntered] = useState(false);
  const [visits, setVisits] = useState(0);
  const [section, setSection] = useState<Section>("blog");
  const [transitionDirection, setTransitionDirection] = useState<TransitionDirection>(null);
  const [musicVolume, setMusicVolume] = useState(() => diaryAudio.getMusicVolume());
  const [musicMuted, setMusicMuted] = useState(musicVolume === 0);
  const visitCounted = useRef(false);

  useEffect(() => {
    if (visitCounted.current) return;
    visitCounted.current = true;
    incrementDiaryVisit()
      .then(setVisits)
      .catch(() => setVisits(0));
  }, []);

  const handleEnter = () => {
    setEntered(true);
  };

  const changeSection = (next: Section) => {
    if (next === section || transitionDirection) return;
    diaryAudio.play("section");
    const touchesBackstory = next === "backstory" || section === "backstory";
    if (!touchesBackstory) {
      setSection(next);
      return;
    }

    const direction: TransitionDirection = next === "backstory" ? "into" : "out";
    setTransitionDirection(direction);
    diaryAudio.setHorrorMode(next === "backstory");
    window.setTimeout(() => setSection(next), direction === "into" ? 560 : 440);
    window.setTimeout(() => {
      setTransitionDirection(null);
    }, 1450);
  };

  if (!entered) return <Entrance onEnter={handleEnter} />;

  return (
    <main className={cn("diary-shell animate-veil-in grain relative min-h-dvh overflow-hidden bg-background", section === "backstory" && "backstory-active")}>
      {transitionDirection && (
        <div className={cn("backstory-transition fixed inset-0 z-40", `backstory-transition-${transitionDirection}`)} aria-hidden="true">
          <span className="backstory-transition-iris" />
          <span className="backstory-transition-slit backstory-transition-slit-one" />
          <span className="backstory-transition-slit backstory-transition-slit-two" />
          <span className="backstory-transition-flash" />
        </div>
      )}
      <div className="diary-ambient" aria-hidden="true">
        <div className="waterfall-scene">
          <img className="waterfall-photo" src={waterfallImage} alt="" />
        </div>
        <span className="diary-window-light" />
        <span className="diary-paper-shadow diary-paper-shadow-one" />
        <span className="diary-paper-shadow diary-paper-shadow-two" />
        <span className="diary-dust diary-dust-one" />
        <span className="diary-dust diary-dust-two" />
      </div>
      <header className="relative z-30 flex items-start justify-between gap-6 px-5 pt-6 md:px-10">
        <VisitorCounter count={visits} />

        <nav className="flex items-start gap-4 pt-1">
          <div className="flex flex-col items-end gap-1">
          {(["blog", "relationships", "backstory"] as const).map((key) => (
            <Button
              type="button"
              variant="ghost"
              key={key}
              onClick={() => changeSection(key)}
              disabled={transitionDirection !== null}
              className={cn(
                "h-auto rounded-none px-0 py-0 text-[0.66rem] font-normal tracking-editorial uppercase shadow-none hover:bg-transparent",
                key === "backstory" && "backstory-tab",
                key === "backstory" && section === "backstory" && "backstory-tab-active",
                section === key ? "text-cream" : "text-ash/60 hover:text-cream/80",
              )}
            >
              <span className={cn(section === key && "border-b border-cream pb-1")}>{key}</span>
            </Button>
          ))}
          </div>
          <div className="music-control flex h-8 items-center border border-border bg-background/70 backdrop-blur-sm">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={musicMuted ? "Turn sound on" : "Mute sound"}
              aria-pressed={musicMuted}
              onClick={() => {
                const nextMuted = diaryAudio.toggleMusicMute();
                setMusicMuted(nextMuted);
                setMusicVolume(diaryAudio.getMusicVolume());
              }}
              className="h-7 w-7 rounded-none text-ash shadow-none hover:bg-accent hover:text-cream"
            >
              {musicMuted ? <VolumeX className="h-3.5 w-3.5" /> : musicVolume < 0.5 ? <Volume1 className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
            </Button>
            <Slider
              aria-label="Atmosphere volume"
              min={0}
              max={100}
              step={1}
              value={[musicMuted ? 0 : Math.round(musicVolume * 100)]}
              onValueChange={(value) => {
                const next = (value[0] ?? 0) / 100;
                setMusicVolume(diaryAudio.setMusicVolume(next));
                setMusicMuted(next === 0);
              }}
              className="mr-2 w-16 md:w-20"
            />
          </div>
        </nav>
      </header>

      <div className="px-2 pt-10 md:px-6">
        {section === "blog" ? (
          <BlogFeed />
        ) : section === "relationships" ? (
          <div className="animate-soft-rise">
            <div className="mx-auto max-w-[34rem] px-3">
              <h2 className="font-[family-name:var(--font-display)] text-5xl font-light text-cream italic">
                Relationships
              </h2>
              <p className="mt-3 text-xs tracking-[0.2em] text-ash uppercase">
                Drag to move · scroll to zoom · click a face
              </p>
            </div>
            <RelationshipGraph />
          </div>
        ) : (
          <Backstory />
        )}
      </div>
    </main>
  );
}
