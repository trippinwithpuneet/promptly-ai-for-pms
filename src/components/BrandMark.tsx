interface BrandMarkProps {
  compact?: boolean;
}

export const BrandMark = ({ compact = false }: BrandMarkProps) => (
  <div className="group flex items-center gap-3" aria-label="Promptly">
    <div className="relative shrink-0">
      <div className="absolute inset-1 bg-primary/25 blur-lg transition-opacity group-hover:opacity-80" />
      <img
        src="/favicon.png"
        alt=""
        className={`${compact ? "h-9 w-9" : "h-12 w-12"} relative rounded-md object-cover`}
      />
    </div>
    <span className={`${compact ? "text-xl" : "text-2xl"} font-display uppercase text-foreground`}>
      Promptly
    </span>
  </div>
);