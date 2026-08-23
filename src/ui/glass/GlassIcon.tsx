import type { ReactNode } from "react";
import { useGlassRenderer } from "./use-glass-renderer";

type GlassIconProps = {
  children: ReactNode;
  size?: number;
  variant?: "interactive" | "static";
  className?: string;
  "aria-label"?: string;
  onClick?: () => void;
};

export function GlassIcon({
  children,
  size = 32,
  variant = "static",
  className = "",
  "aria-label": ariaLabel,
  onClick,
}: GlassIconProps) {
  const renderer = useGlassRenderer("auto");

  const classes = [
    "glass-icon",
    `glass-icon--${renderer}`,
    variant === "interactive" ? "glass-icon--interactive" : "",
    onClick ? "glass-icon--clickable" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const Tag = onClick ? "button" : "span";

  return (
    <Tag
      className={classes}
      style={{ width: size, height: size }}
      aria-label={ariaLabel}
      onClick={onClick}
      type={onClick ? "button" : undefined}
    >
      <span className="glass-icon-shine" aria-hidden="true" />
      <span className="glass-icon-content">{children}</span>
    </Tag>
  );
}