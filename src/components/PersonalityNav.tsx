import Link from "next/link";
import { ALL_TRAITS, TRAIT_LABELS } from "@/lib/traits";
import type { PersonalityTrait } from "@/lib/types";

interface PersonalityNavProps {
  activeTrait?: PersonalityTrait | null;
  compact?: boolean;
}

export function PersonalityNav({ activeTrait, compact }: PersonalityNavProps) {
  return (
    <div className={compact ? "flex flex-wrap gap-2" : "grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"}>
      {ALL_TRAITS.map((trait) => {
        const info = TRAIT_LABELS[trait];
        const isActive = activeTrait === trait;

        if (compact) {
          return (
            <Link
              key={trait}
              href={`/shop?trait=${trait}`}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                isActive
                  ? "text-white shadow-md"
                  : "border border-gray-200 bg-white text-gray-600 hover:border-violet-200 hover:bg-violet-50"
              }`}
              style={
                isActive
                  ? { backgroundColor: info.color }
                  : undefined
              }
            >
              {info.emoji} {info.fa}
            </Link>
          );
        }

        return (
          <Link
            key={trait}
            href={`/shop?trait=${trait}`}
            className={`group flex flex-col items-center rounded-2xl border p-4 text-center transition hover:-translate-y-0.5 hover:shadow-lg ${
              isActive
                ? "border-transparent shadow-lg"
                : "border-gray-100 bg-white hover:border-violet-200"
            }`}
            style={
              isActive
                ? {
                    backgroundColor: info.color + "18",
                    borderColor: info.color,
                  }
                : undefined
            }
          >
            <span className="text-3xl transition group-hover:scale-110">
              {info.emoji}
            </span>
            <span className="mt-2 text-sm font-bold text-gray-900">
              {info.fa}
            </span>
            <span className="mt-1 line-clamp-2 text-[10px] leading-relaxed text-gray-500">
              {info.description}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
