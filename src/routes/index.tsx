import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Entrance } from "@/components/diary/Entrance";
import { VisitorCounter } from "@/components/diary/VisitorCounter";
import { BlogFeed } from "@/components/diary/BlogFeed";
import { RelationshipGraph } from "@/components/diary/RelationshipGraph";
import { cn } from "@/lib/utils";

const TITLE = "Liam Vazquez — Private Diary";
const DESCRIPTION =
  "The private diary of Liam Vazquez: entries, photographs and the people tangled up in his life.";

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

const STORAGE_KEY = "liam-diary-visits";

type Section = "blog" | "relationships";

function Index() {
  const [entered, setEntered] = useState(false);
  const [visits, setVisits] = useState(0);
  const [section, setSection] = useState<Section>("blog");

  const handleEnter = () => {
    let next = 1;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      next = (raw ? parseInt(raw, 10) || 0 : 0) + 1;
      window.localStorage.setItem(STORAGE_KEY, String(next));
    } catch {
      next = 1;
    }
    setVisits(next);
    setEntered(true);
  };

  if (!entered) return <Entrance onEnter={handleEnter} />;

  return (
    <main className="animate-veil-in grain min-h-dvh bg-background">
      <header className="flex items-start justify-between gap-6 px-5 pt-6 md:px-10">
        <VisitorCounter count={visits} />

        <nav className="flex flex-col items-end gap-1 pt-1">
          {(["blog", "relationships"] as const).map((key) => (
            <button
              key={key}
              onClick={() => setSection(key)}
              className={cn(
                "text-[0.66rem] tracking-editorial uppercase transition-colors duration-300",
                section === key ? "text-cream" : "text-ash/60 hover:text-cream/80",
              )}
            >
              <span className={cn(section === key && "border-b border-cream pb-1")}>{key}</span>
            </button>
          ))}
        </nav>
      </header>

      <div className="px-2 pt-10 md:px-6">
        {section === "blog" ? (
          <BlogFeed />
        ) : (
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
        )}
      </div>
    </main>
  );
}
