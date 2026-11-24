// Text measuring and auto-fit for the generator.
// Uses a 2D canvas to measure with the same font the Txt nodes use, so the
// generator can pick a font size and line breaks that never overflow a box.

export const GEN_FONT = 'Segoe UI, Arial, sans-serif';

let ctx: CanvasRenderingContext2D | null = null;
function context(): CanvasRenderingContext2D {
  if (!ctx) ctx = document.createElement('canvas').getContext('2d');
  return ctx;
}

export interface FontSpec {
  weight?: number;
  italic?: boolean;
  letterSpacing?: number;
  family?: string;
}

export function measure(text: string, size: number, f: FontSpec = {}): number {
  const c = context();
  c.font = `${f.italic ? 'italic ' : ''}${f.weight ?? 400} ${size}px ${f.family ?? GEN_FONT}`;
  // Italic glyphs lean past their advance width; add a little slack.
  const slack = f.italic ? size * 0.12 : 0;
  return c.measureText(text).width + (f.letterSpacing ?? 0) * Math.max(0, text.length - 1) + slack;
}

/** Greedy word wrap at a given size. Respects explicit "\n". */
export function wrap(text: string, size: number, maxWidth: number, f: FontSpec = {}): string[] {
  const lines: string[] = [];
  for (const paragraph of text.split('\n')) {
    let line = '';
    for (const word of paragraph.split(/\s+/).filter(Boolean)) {
      const candidate = line ? `${line} ${word}` : word;
      if (!line || measure(candidate, size, f) <= maxWidth) line = candidate;
      else {
        lines.push(line);
        line = word;
      }
    }
    lines.push(line);
  }
  return lines;
}

export interface Fitted {
  text: string;
  size: number;
  lines: number;
  lineHeight: number;
  height: number;
  width: number;
}

/**
 * Largest font size (between min and max) at which `text` wraps into at most
 * `maxLines` lines that fit `maxWidth` x `maxHeight`.
 */
export function fit(
  text: string,
  o: FontSpec & {maxWidth: number; maxHeight?: number; max: number; min?: number; maxLines?: number; lh?: number},
): Fitted {
  const lh = o.lh ?? 1.12;
  const min = o.min ?? Math.max(12, Math.round(o.max * 0.35));
  for (let size = o.max; size >= min; size -= 2) {
    const lines = wrap(text, size, o.maxWidth, o);
    const width = Math.max(...lines.map(l => measure(l, size, o)));
    const height = lines.length * size * lh;
    if (width <= o.maxWidth && (!o.maxLines || lines.length <= o.maxLines) && (!o.maxHeight || height <= o.maxHeight)) {
      return {text: lines.join('\n'), size, lines: lines.length, lineHeight: size * lh, height, width};
    }
  }
  const lines = wrap(text, min, o.maxWidth, o);
  return {
    text: lines.join('\n'),
    size: min,
    lines: lines.length,
    lineHeight: min * lh,
    height: lines.length * min * lh,
    width: Math.max(...lines.map(l => measure(l, min, o))),
  };
}
