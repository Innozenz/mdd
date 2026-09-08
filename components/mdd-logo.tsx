import { cn } from "@/lib/utils";

/**
 * Logo MDD : un nuage violet portant le sigle « MDD » (conforme aux maquettes).
 *
 * La couleur du nuage suit `currentColor` (classe `text-primary` par défaut),
 * ce qui permet de le recolorer selon le contexte.
 */
export const MddLogo = ({
  className,
  title = "MDD — Monde de Dév",
}: {
  className?: string;
  title?: string;
}) => {
  return (
    <svg
      viewBox="0 0 120 76"
      role="img"
      aria-label={title}
      className={cn("h-8 w-auto text-primary", className)}
    >
      <g fill="currentColor">
        <circle cx="42" cy="34" r="20" />
        <circle cx="70" cy="30" r="24" />
        <circle cx="92" cy="44" r="17" />
        <rect x="18" y="36" width="84" height="30" rx="15" />
        <ellipse cx="40" cy="52" rx="26" ry="16" />
      </g>
      <text
        x="60"
        y="56"
        textAnchor="middle"
        fill="#ffffff"
        fontSize="26"
        fontWeight="700"
        fontFamily="var(--font-sans, system-ui), sans-serif"
        letterSpacing="1"
      >
        MDD
      </text>
    </svg>
  );
};
