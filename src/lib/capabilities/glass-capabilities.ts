export type GlassCapabilities = {
  backdropFilter: boolean;
  svgFilter: boolean;
  reducedMotion: boolean;
  reducedTransparency: boolean;
};

export function detectGlassCapabilities(): GlassCapabilities {
  return {
    backdropFilter: CSS.supports("backdrop-filter", "blur(1px)"),
    svgFilter: CSS.supports("filter", "url(#blur)"),
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    reducedTransparency: window.matchMedia("(prefers-reduced-transparency: reduce)").matches,
  };
}