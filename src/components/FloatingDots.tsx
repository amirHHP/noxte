"use client";

const DOT_COLORS = [
  "bg-noxte-red",
  "bg-noxte-blue",
  "bg-noxte-green",
  "bg-noxte-yellow",
  "bg-noxte-pink",
];

interface Dot {
  color: string;
  size: string;
  top: string;
  left: string;
  animation: string;
  delay: string;
}

const DOTS: Dot[] = [
  { color: DOT_COLORS[0], size: "w-3 h-3", top: "12%", left: "8%", animation: "animate-float-slow", delay: "delay-0" },
  { color: DOT_COLORS[1], size: "w-2.5 h-2.5", top: "18%", left: "35%", animation: "animate-float-medium", delay: "delay-1" },
  { color: DOT_COLORS[3], size: "w-2 h-2", top: "8%", left: "65%", animation: "animate-float-fast", delay: "delay-2" },
  { color: DOT_COLORS[2], size: "w-3.5 h-3.5", top: "45%", left: "85%", animation: "animate-float-slow", delay: "delay-3" },
  { color: DOT_COLORS[4], size: "w-2 h-2", top: "75%", left: "70%", animation: "animate-float-medium", delay: "delay-4" },
  { color: DOT_COLORS[1], size: "w-2.5 h-2.5", top: "80%", left: "5%", animation: "animate-float-fast", delay: "delay-5" },
  { color: DOT_COLORS[2], size: "w-2 h-2", top: "50%", left: "42%", animation: "animate-pulse-dot", delay: "delay-1" },
  { color: DOT_COLORS[0], size: "w-2 h-2", top: "35%", left: "55%", animation: "animate-float-medium", delay: "delay-6" },
  { color: DOT_COLORS[3], size: "w-3 h-3", top: "65%", left: "20%", animation: "animate-float-slow", delay: "delay-2" },
];

interface FloatingDotsProps {
  count?: "few" | "normal" | "many";
  className?: string;
}

export function FloatingDots({ count = "normal", className = "" }: FloatingDotsProps) {
  const dotCount = count === "few" ? 4 : count === "many" ? 9 : 6;
  const visibleDots = DOTS.slice(0, dotCount);

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {visibleDots.map((dot, i) => (
        <div
          key={i}
          className={`absolute rounded-full ${dot.color} ${dot.size} ${dot.animation} ${dot.delay}`}
          style={{ top: dot.top, left: dot.left }}
        />
      ))}
    </div>
  );
}
