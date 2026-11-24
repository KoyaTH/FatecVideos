// Photo registry for the generator: every photo with its pixel size and the
// point of interest (usually a face) as fractions of width/height. The
// generator frames each photo automatically so that point stays visible, and
// rotates between photos whose topics match the request.
// To add a photo: save it in src/images/ (see docs/BANCOS-DE-IMAGEM.md), import it
// here and add an entry with its size, focus point, topics and credit.
import salaProva from '../images/pexels-6683579-sala-prova.jpg';

export interface Foto {
  src: string;
  w: number;
  h: number;
  /** Point of interest, 0..1 from the left/top. */
  foco: [number, number];
  /** Topics this photo fits; the generator prefers matching ones. */
  temas: string[];
  credito: string;
}

export const FOTOS: Record<string, Foto> = {
  sala: {
    src: salaProva, w: 1600, h: 1067, foco: [0.51, 0.47],
    temas: ['prova', 'vestibular', 'estudantes', 'sala', 'geral'],
    credito: 'Pexels #6683579',
  },
};

/** Image size and center that cover a w x h box with the focus near (ax, ay) of the box (0..1). */
export function enquadrar(f: Foto, w: number, h: number, ax = 0.5, ay = 0.45, zoom = 1.05) {
  const scale = Math.max(w / f.w, h / f.h) * zoom;
  const iw = f.w * scale;
  const ih = f.h * scale;
  // Where the focus would land if the image were centered, then shift it to the anchor.
  let x = (0.5 - f.foco[0]) * iw + (ax - 0.5) * w;
  let y = (0.5 - f.foco[1]) * ih + (ay - 0.5) * h;
  // Keep the image covering the whole box.
  const mx = (iw - w) / 2;
  const my = (ih - h) / 2;
  x = Math.max(-mx, Math.min(mx, x));
  y = Math.max(-my, Math.min(my, y));
  return {x, y, width: iw};
}
