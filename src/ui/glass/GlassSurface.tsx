import type { ReactNode, ElementType, ComponentPropsWithoutRef } from "react";
import { useGlassRenderer } from "./use-glass-renderer";

type GlassSurfaceProps<T extends ElementType> = {
  variant?: "content" | "interactive" | "overlay";
  enhancement?: "auto" | "frosted" | "plain";
  as?: T;
  children: ReactNode;
  className?: string;
} & ComponentPropsWithoutRef<T>;

export function GlassSurface<T extends ElementType = "div">({
  variant = "content",
  enhancement = "auto",
  as: Tag,
  children,
  className = "",
  ...rest
}: GlassSurfaceProps<T>) {
  const renderer = useGlassRenderer(enhancement);
  const Component = Tag ?? "div";

  const classes = [
    "glass-surface",
    `glass-surface--${renderer}`,
    variant === "interactive" ? "glass-surface--interactive" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <Component className={classes} {...rest}>{children}</Component>;
}