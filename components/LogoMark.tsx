import { useId } from "react";

/**
 * The PredictCentr mark: three ascending bars (purple -> pink -> orange
 * gradient) plus a solid-orange dot sitting on their baseline. Geometry
 * here is the source of truth -- app/icon.png, app/apple-icon.png, and
 * app/favicon.ico are rasterized copies of this same shape (see
 * scripts/generate-icons.ps1), so keep them in sync if this ever changes.
 */
export function LogoMark({ size = 28, className }: { size?: number; className?: string }) {
  const gradientId = useId();

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} gradientUnits="userSpaceOnUse" x1="15" y1="85" x2="85" y2="15">
          <stop offset="0%" stopColor="#7B5CFF" />
          <stop offset="50%" stopColor="#FF4DB8" />
          <stop offset="100%" stopColor="#FF8A3D" />
        </linearGradient>
      </defs>
      <g fill={`url(#${gradientId})`}>
        <rect x="-5.5" y="-28" width="11" height="28" rx="5.5" transform="translate(24,78) rotate(20)" />
        <rect x="-5.5" y="-44" width="11" height="44" rx="5.5" transform="translate(42,78) rotate(20)" />
        <rect x="-5.5" y="-60" width="11" height="60" rx="5.5" transform="translate(60,78) rotate(20)" />
      </g>
      <circle cx="80" cy="78" r="8" fill="#FF8A3D" />
    </svg>
  );
}
