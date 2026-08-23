export type SampledColor = {
  h: number;
  s: number;
  l: number;
};

export function rgbToHsl(r: number, g: number, b: number): SampledColor {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;

  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    if (max === rn) {
      h = (gn - bn) / d + (gn < bn ? 6 : 0);
    } else if (max === gn) {
      h = (bn - rn) / d + 2;
    } else {
      h = (rn - gn) / d + 4;
    }
    h *= 60;
  }

  return { h, s: s * 100, l: l * 100 };
}

export function extractWallpaperColor(src: string): Promise<SampledColor | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      try {
        const size = 32;
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(null);
          return;
        }

        ctx.drawImage(img, 0, 0, size, size);
        const data = ctx.getImageData(0, 0, size, size).data;

        let r = 0;
        let g = 0;
        let b = 0;
        const count = data.length / 4;

        for (let i = 0; i < data.length; i += 4) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
        }

        resolve(rgbToHsl(r / count, g / count, b / count));
      } catch {
        resolve(null);
      }
    };

    img.onerror = () => resolve(null);
    img.src = src;
  });
}

export function deriveGlassTokens(color: SampledColor, isDark: boolean): Record<string, string> {
  const h = Math.round(color.h);
  const bgS = Math.min(color.s, 28);
  const borderS = Math.min(color.s + 18, 55);

  if (isDark) {
    return {
      "--glass-bg": `hsla(${h}, ${bgS}%, 26%, 0.46)`,
      "--glass-bg-hover": `hsla(${h}, ${bgS}%, 29%, 0.58)`,
      "--glass-bg-active": `hsla(${h}, ${bgS}%, 32%, 0.7)`,
      "--glass-border": `hsla(${h}, ${borderS}%, 55%, 0.32)`,
      "--glass-highlight": `hsla(${h}, ${bgS}%, 34%, 0.55)`,
    };
  }

  return {
    "--glass-bg": `hsla(${h}, ${bgS}%, 90%, 0.52)`,
    "--glass-bg-hover": `hsla(${h}, ${bgS}%, 88%, 0.64)`,
    "--glass-bg-active": `hsla(${h}, ${bgS}%, 86%, 0.76)`,
    "--glass-border": `hsla(${h}, ${borderS}%, 48%, 0.28)`,
    "--glass-highlight": `hsla(${h}, ${bgS}%, 96%, 0.6)`,
  };
}