import { useMemo } from "react";
import { detectGlassCapabilities } from "../../lib/capabilities";

type Renderer = "plain" | "frosted";

export function useGlassRenderer(enhancement: "auto" | "frosted" | "plain"): Renderer {
  return useMemo(() => {
    if (enhancement === "plain") return "plain";

    const caps = detectGlassCapabilities();

    if (caps.reducedTransparency) return "plain";

    if (enhancement === "frosted" && caps.backdropFilter) return "frosted";
    if (enhancement === "auto" && caps.backdropFilter) return "frosted";

    return "plain";
  }, [enhancement]);
}