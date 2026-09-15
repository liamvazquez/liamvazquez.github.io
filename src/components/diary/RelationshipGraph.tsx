import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { Minus, Plus, Crosshair, X } from "lucide-react";
import { characters, connections, relationMeta, type Character } from "@/data/relationships";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const MIN_ZOOM = 0.4;
const MAX_ZOOM = 3;
const NODE = 132;

export function RelationshipGraph() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [selected, setSelected] = useState<Character | null>(null);
  const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);

  const stateRef = useRef({ zoom, offset });
  stateRef.current = { zoom, offset };

  const centerView = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setZoom(1);
    setOffset({ x: rect.width / 2, y: rect.height / 2 });
  }, []);

  useEffect(() => {
    centerView();
  }, [centerView]);

  const zoomAt = useCallback((px: number, py: number, next: number) => {
    const { zoom: z, offset: o } = stateRef.current;
    const clamped = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, next));
    const k = clamped / z;
    setZoom(clamped);
    setOffset({ x: px - (px - o.x) * k, y: py - (py - o.y) * k });
  }, []);

  const zoomAtRef = useRef(zoomAt);
  zoomAtRef.current = zoomAt;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const dy = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 100 : 1);
      const { zoom: z } = stateRef.current;
      zoomAtRef.current(
        e.clientX - rect.left,
        e.clientY - rect.top,
        z * Math.exp(-dy * 0.0015),
      );
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const buttonZoom = (dir: 1 | -1) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    zoomAt(rect.width / 2, rect.height / 2, stateRef.current.zoom * (dir === 1 ? 1.25 : 0.8));
  };

  const accentFor = (character: Character) => {
    if (character.id === "liam") return "var(--cream)";
    const connection = connections.find((item) => item.from === character.id || item.to === character.id);
    return connection ? relationMeta[connection.type].color : "var(--ash)";
  };

  const tagFor = (character: Character) => {
    if (character.id === "liam") return character.role ?? "That's me";
    const connection = connections.find((item) => item.from === character.id || item.to === character.id);
    return connection ? relationMeta[connection.type].label : character.role ?? "Connection";
  };

  return (
    <div className="relative h-[calc(100dvh-15rem)] min-h-[520px] w-full overflow-hidden">
      <div
        ref={containerRef}
        className="h-full w-full cursor-grab touch-none active:cursor-grabbing"
        onPointerDown={(e) => {
          drag.current = {
            x: e.clientX,
            y: e.clientY,
            ox: stateRef.current.offset.x,
            oy: stateRef.current.offset.y,
          };
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (!d) return;
          setOffset({ x: d.ox + (e.clientX - d.x), y: d.oy + (e.clientY - d.y) });
        }}
        onPointerUp={() => {
          drag.current = null;
        }}
        onPointerCancel={() => {
          drag.current = null;
        }}
      >
        <div
          className="absolute top-0 left-0 origin-top-left"
          style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})` }}
        >
          <svg
            className="pointer-events-none absolute overflow-visible"
            width={1}
            height={1}
            style={{ left: 0, top: 0 }}
          >
            {connections.map((c, i) => {
              const a = characters.find((ch) => ch.id === c.from);
              const b = characters.find((ch) => ch.id === c.to);
              if (!a || !b) return null;
              return (
                <g key={`${c.from}-${c.to}-${i}`}>
                  <line
                    x1={a.x}
                    y1={a.y}
                    x2={b.x}
                    y2={b.y}
                    stroke={relationMeta[c.type].color}
                    strokeWidth={1.6}
                    opacity={0.75}
                  />
                </g>
              );
            })}
          </svg>

          {characters.map((ch) => {
            const isLiam = ch.id === "liam";
            const size = isLiam ? NODE : NODE * 0.7;
            return (
              <Button
                type="button"
                variant="ghost"
                key={ch.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelected((s) => (s?.id === ch.id ? null : ch));
                }}
                className={cn(
                  "group absolute h-auto rounded-full p-0 shadow-none hover:bg-transparent",
                  isLiam && "liam-node-shell [&_svg]:size-full",
                )}
                style={{ left: ch.x - size / 2, top: ch.y - size / 2, width: size }}
              >
                <span
                  className={cn(
                    "relative flex items-center justify-center rounded-full border bg-secondary/90 px-4 text-center transition-all duration-500",
                    isLiam && "liam-node-core",
                    selected?.id === ch.id
                      ? "shadow-[0_0_40px_-6px_color-mix(in_oklab,var(--cream)_50%,transparent)]"
                      : "border-border group-hover:border-cream/60",
                  )}
                  style={{ width: size, height: size, borderColor: accentFor(ch) }}
                >
                  {isLiam ? (
                    <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 132 132" aria-hidden="true">
                      <ellipse className="liam-orbit" cx="66" cy="66" rx="55" ry="23" transform="rotate(-24 66 66)" />
                      <ellipse className="liam-orbit liam-orbit-secondary" cx="66" cy="66" rx="52" ry="20" transform="rotate(62 66 66)" />
                      <path className="liam-basketball-seam" d="M18 36 C54 51 77 83 112 101" />
                      <path className="liam-basketball-seam" d="M34 115 C46 80 85 48 102 20" />
                      <path className="liam-molecule" d="M103 48l8-5 8 5v10l-8 5-8-5zM111 43v-8M119 58l7 4" />
                      <path className="liam-court-mark" d="M42 19h18M51 13v12" />
                      <circle className="liam-electron" cx="16" cy="66" r="2.2" />
                      <circle className="liam-electron" cx="105" cy="30" r="1.8" />
                    </svg>
                  ) : null}
                  <span className="font-[family-name:var(--font-display)] text-lg leading-tight text-cream italic">
                    {ch.name}
                  </span>
                  <span className="absolute right-[18%] bottom-[15%] h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accentFor(ch) }} />
                </span>
              </Button>
            );
          })}

          {selected ? (
            <div
              className="relationship-card animate-soft-rise absolute w-[18rem] border border-border bg-card/95 p-5 backdrop-blur-sm"
              style={{
                "--relationship-card-x": `${selected.x + NODE * 0.8}px`,
                "--relationship-card-y": `${selected.y - 20}px`,
              } as CSSProperties}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-[0.62rem] tracking-editorial uppercase" style={{ color: accentFor(selected) }}>
                  {tagFor(selected)}
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelected(null);
                  }}
                  className="h-7 w-7 rounded-full text-ash shadow-none transition-colors hover:bg-accent hover:text-cream"
                  aria-label="Close card"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
              {selected.image ? (
                <div className="mt-4 h-40 overflow-hidden border border-border bg-secondary">
                  <img src={selected.image} alt={selected.name} className="h-full w-full object-contain object-top" draggable={false} />
                </div>
              ) : null}
              <h3 className="mt-4 font-[family-name:var(--font-display)] text-2xl text-cream italic">{selected.name}</h3>
              <p className="mt-3 text-sm leading-[1.85] text-cream/90 italic">{selected.note}</p>
            </div>
          ) : null}
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-5 left-5 w-[calc(100%-6.5rem)] max-w-[44rem] border border-border bg-background/80 px-4 py-4 backdrop-blur-sm md:px-5">
        <p className="text-[0.6rem] tracking-editorial text-ash uppercase">Legend</p>
        <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 md:grid-cols-3 md:gap-x-7">
          {Object.entries(relationMeta).map(([key, meta]) => (
            <li key={key} className="flex min-w-0 items-start gap-2">
              <span className="mt-1.5 h-[2px] w-5 shrink-0 rounded-full" style={{ backgroundColor: meta.color }} />
              <span className="min-w-0">
                <span className="block text-[0.65rem] leading-tight text-cream/85">{meta.label}</span>
                <span className="mt-0.5 block text-[0.55rem] leading-tight text-ash">{meta.description}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Controls */}
      <div className="absolute right-5 bottom-5 flex flex-col gap-2">
        {[
          { icon: Plus, action: () => buttonZoom(1), label: "Zoom in" },
          { icon: Minus, action: () => buttonZoom(-1), label: "Zoom out" },
          { icon: Crosshair, action: centerView, label: "Recenter" },
        ].map(({ icon: Icon, action, label }) => (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            key={label}
            onClick={action}
            aria-label={label}
            className="rounded-none border border-border bg-background/80 text-cream/70 shadow-none backdrop-blur-sm transition-colors hover:border-cream/60 hover:bg-accent hover:text-cream"
          >
            <Icon className="h-4 w-4" strokeWidth={1.2} />
          </Button>
        ))}
      </div>
    </div>
  );
}
