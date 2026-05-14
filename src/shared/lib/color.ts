export function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 255, g: 255, b: 255 };
}

export function rgbToHex(r: number, g: number, b: number) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

export function parseColor(color: string) {
  if (!color) return { r: 255, g: 255, b: 255, a: 1 };
  
  if (color.startsWith('rgba') || color.startsWith('rgb')) {
    const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (match) {
      return {
        r: parseInt(match[1]),
        g: parseInt(match[2]),
        b: parseInt(match[3]),
        a: match[4] !== undefined ? parseFloat(match[4]) : 1
      };
    }
  }
  
  if (color.startsWith('#')) {
    const rgb = hexToRgb(color);
    return { ...rgb, a: 1 };
  }
  
  return { r: 255, g: 255, b: 255, a: 1 };
}

export function toRgbaString(r: number, g: number, b: number, a: number) {
  if (a >= 1) return rgbToHex(r, g, b);
  return `rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})`;
}
