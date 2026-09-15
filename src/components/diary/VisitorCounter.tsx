import { Eye } from "lucide-react";

export function visitorComment(count: number): string {
  if (count < 10) return "That's the beginning of my diary, I think no one cares.";
  if (count < 30) return "A couple of weirdos found this, apparently.";
  if (count < 50) return "Jesus Christ, I'm starting to get famous.";
  return "Jeez, people really like stalking my diaries.";
}

export function VisitorCounter({ count }: { count: number }) {
  return (
    <div className="max-w-[16rem]">
      <div className="flex items-center gap-2 text-cream">
        <span className="visitor-eye group relative inline-flex" tabIndex={0} aria-describedby="visitor-explanation">
          <Eye className="h-4 w-4" strokeWidth={1.2} />
          <span id="visitor-explanation" role="tooltip" className="pointer-events-none absolute top-7 left-0 z-30 w-64 border border-border bg-card/95 px-4 py-3 text-[0.68rem] leading-relaxed text-cream opacity-0 shadow-2xl backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus:translate-y-0 group-focus:opacity-100">
            That’s the number of persons that visited my diary. What the fuck could it be? What else could it be?
          </span>
        </span>
        <span className="font-[family-name:var(--font-display)] text-xl tabular-nums">
          {count.toLocaleString()}
        </span>
      </div>
      <p className="mt-2 text-[0.7rem] leading-relaxed text-ash italic">
        {visitorComment(count)}
      </p>
    </div>
  );
}
