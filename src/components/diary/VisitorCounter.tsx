import { Eye } from "lucide-react";

export function visitorComment(count: number): string {
  if (count < 20) return "That's the beginning of my diary, I think no one cares.";
  if (count < 40) return "Twenty of you. Twenty people with nothing better to do.";
  if (count < 80) return "Forty now. My life isn't a show, but keep clapping I guess.";
  if (count < 160) return "Eighty. At this point you're all just admitting I'm interesting.";
  if (count < 320) return "A hundred and sixty. Yeah, I'd read about me too.";
  if (count < 640) return "Three hundred and twenty. None of you were invited, yet here we are.";
  if (count < 1280) return "Six hundred and forty strangers in my head. Comfortable?";
  if (count < 2560) return "Over a thousand. I told you I was worth the detour.";
  if (count < 5120) return "Two thousand five hundred. My diary has more fans than your whole life.";
  return "Whatever the number is now, it's proof I was always the main character.";
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
