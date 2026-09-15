import { useCallback, useEffect, useRef, useState } from "react";
import { Minus, Plus, Crosshair, X } from "lucide-react";
import { characters, connections, relationMeta, type Character } from "@/data/relationships";
import { cn } from "@/lib/utils";

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
              <button
                key={ch.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelected((s) => (s?.id === ch.id ? null : ch));
                }}
                className="group absolute flex flex-col items-center"
                style={{ left: ch.x - size / 2, top: ch.y - size / 2, width: size }}
              >
                <span
                  className={cn(
                    "relative block overflow-hidden rounded-full border bg-secondary transition-all duration-500",
                    selected?.id === ch.id
                      ? "border-cream shadow-[0_0_40px_-6px_rgba(240,225,200,0.5)]"
                      : "border-border group-hover:border-cream/60",
                  )}
                  style={{ width: size, height: size }}
                >
                  {ch.image ? (
                    <img
                      src={ch.image}
                      alt={ch.name}
                      className="h-full w-full scale-[1.55] object-contain object-top"
                      draggable={false}
                    />
                  ) : null}
                </span>
                <span className="mt-3 font-[family-name:var(--font-display)] text-base whitespace-nowrap text-cream italic">
                  {ch.name}
                </span>
              </button>
            );
          })}

          {selected ? (
            <div
              className="animate-soft-rise absolute w-[17rem] border border-border bg-card/95 p-5 backdrop-blur-sm"
              style={{ left: selected.x + NODE * 0.8, top: selected.y - 20 }}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-[0.62rem] tracking-editorial text-ash uppercase">
                  {selected.role ?? "Connection"}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelected(null);
                  }}
                  className="text-ash transition-colors hover:text-cream"
                  aria-label="Close card"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <p className="mt-3 text-sm leading-[1.85] text-cream/90 italic">{selected.note}</p>
            </div>
          ) : null}
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-5 left-5 border border-border bg-black/70 px-5 py-4 backdrop-blur-sm">
        <p className="text-[0.6rem] tracking-editorial text-ash uppercase">Legend</p>
        <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2">
          {Object.entries(relationMeta).map(([key, meta]) => (
            <li key={key} className="flex items-center gap-2">
              <span className="h-px w-5" style={{ backgroundColor: meta.color }} />
              <span className="text-[0.68rem] text-cream/80">{meta.label}</span>
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
          <button
            key={label}
            onClick={action}
            aria-label={label}
            className="border border-border bg-black/70 p-2.5 text-cream/70 backdrop-blur-sm transition-colors hover:border-cream/60 hover:text-cream"
          >
            <Icon className="h-4 w-4" strokeWidth={1.2} />
          </button>
        ))}
      </div>
    </div>
  );
}
