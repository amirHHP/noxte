"use client";

import Link from "next/link";
import { ALL_TRAITS, TRAIT_LABELS } from "@/lib/traits";
import type { PersonalityTrait } from "@/lib/types";
import { useLanguage } from "@/lib/i18n/language-context";

interface PersonalityNavProps {
  activeTrait?: PersonalityTrait | null;
  compact?: boolean;
}

export function PersonalityNav({ activeTrait, compact }: PersonalityNavProps) {
  const { language } = useLanguage();

  return (
    <div className={compact ? "flex flex-wrap gap-2" : "grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"}>
      {ALL_TRAITS.map((trait) => {
        const info = TRAIT_LABELS[trait];
        const isActive = activeTrait === trait;
        const traitLabel = info[language] || info.fa;

        if (compact) {
          return (
            <Link
              key={trait}
              href={`/shop?trait=${trait}`}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                isActive
                  ? "text-white shadow-md"
                  : "border border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
              }`}
              style={
                isActive
                  ? { backgroundColor: info.color }
                  : undefined
              }
            >
              {info.emoji} {traitLabel}
            </Link>
          );
        }

        return (
          <Link
            key={trait}
            href={`/shop?trait=${trait}`}
            className={`group relative flex flex-col items-center rounded-2xl border p-4 text-center transition hover:-translate-y-0.5 hover:shadow-lg ${
              isActive
                ? "border-transparent shadow-lg"
                : "border-gray-100 bg-white hover:border-gray-200"
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
            {/* Colored dot indicator */}
            <div
              className="mx-auto mb-2 h-4 w-4 rounded-full transition group-hover:scale-125"
              style={{ backgroundColor: info.color }}
            />
            <span className="text-3xl transition group-hover:scale-110">
              {info.emoji}
            </span>
            <span className="mt-2 text-sm font-bold text-gray-900">
              {traitLabel}
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
