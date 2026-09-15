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
        <Eye className="h-4 w-4" strokeWidth={1.2} />
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
