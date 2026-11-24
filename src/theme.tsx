import {Circle, Gradient, Img, Line, Node, Rect, Txt} from '@motion-canvas/2d';
import tecnicoEstoque from './images/unsplash-N_nAAwnBDy8-tecnico-estoque.jpg';
import operadoraFabrica from './images/unsplash-5jugXEl5YHM-operadora-fabrica.jpg';

// ---------- Photos of people (see docs/BANCOS-DE-IMAGEM.md) ----------
// Unsplash N_nAAwnBDy8 (Unsplash License): technician with blue helmet in a stockroom, 1600x900.
export const FOTO_TECNICO = tecnicoEstoque;
// Unsplash 5jugXEl5YHM (Unsplash License): operator at a machine on the factory floor, 1600x1067.
export const FOTO_OPERADORA = operadoraFabrica;

/** Where to place a photo: center (x, y) and width, in scene coordinates. */
export interface PhotoSpec {
  src: string;
  x: number;
  y: number;
  width: number;
}

/**
 * A photo clipped to the band [top, bottom] (scene y coordinates), tinted blue,
 * darkened at the top (for the logo) and faded to transparent over the last
 * `fade` pixels, so the background grid shows through without a seam.
 * The photo must cover the whole band width: check that x ± width/2 reaches ±width/2 of the scene.
 */
export function photoBand(o: {
  photo: PhotoSpec;
  width: number;
  top: number;
  bottom: number;
  fade?: number;
  tint?: number;
  ref?: (n: Rect) => void;
  imgRef?: (i: Img) => void;
  opacity?: number;
}) {
  const height = o.bottom - o.top;
  const cy = o.top + height / 2;
  const fade = Math.min(o.fade ?? 300, height);
  const solidUntil = (height - fade) / height;
  return (
    // `cache` isolates the band so the destination-in mask only affects the photo.
    <Rect ref={o.ref} y={cy} width={o.width} height={height} clip cache opacity={o.opacity ?? 1}>
      <Img ref={o.imgRef} src={o.photo.src} x={o.photo.x} y={o.photo.y - cy} width={o.photo.width} />
      <Rect size={[o.width, height]} fill="#0b2a63" opacity={o.tint ?? 0.28} />
      <Rect
        y={-height / 2 + 140}
        size={[o.width, 280]}
        fill={
          new Gradient({
            from: [0, -140],
            to: [0, 140],
            stops: [
              {offset: 0, color: 'rgba(6,18,43,0.9)'},
              {offset: 1, color: 'rgba(6,18,43,0)'},
            ],
          })
        }
      />
      {/* Alpha mask: opaque down to the fade, then transparent at the bottom edge. */}
      <Rect
        size={[o.width, height]}
        compositeOperation="destination-in"
        fill={
          new Gradient({
            from: [0, -height / 2],
            to: [0, height / 2],
            stops: [
              {offset: 0, color: 'rgba(0,0,0,1)'},
              {offset: solidUntil, color: 'rgba(0,0,0,1)'},
              {offset: 1, color: 'rgba(0,0,0,0)'},
            ],
          })
        }
      />
    </Rect>
  );
}

// Fatec Taquaritinga visual identity (taken from the vestibular campaign art).
export const NAVY = '#06122b';
export const CARD = '#0d2350';
export const CYAN = '#22c3ff';
export const ORANGE = '#ff7a1a';
export const RED = '#d71920';
export const WHITE = '#ffffff';
export const MUTED = '#a9c1e3';
export const FONT = 'Segoe UI, Arial, sans-serif';

export const AREAS = [
  'Gestão da\nProdução',
  'Logística\nIntegrada',
  'Supply\nChain',
  'Automação\nIndustrial',
  'Indústria\n4.0',
  'Business\nIntelligence',
];

export const BENEFITS = [
  'Ensino superior gratuito',
  'Curso presencial',
  'Formação alinhada à Indústria 4.0',
  'Mercado em constante expansão',
];

export const SITE = 'vestibular.fatec.sp.gov.br';

/** Gradient backdrop with a tech grid and two soft glows. */
export function background(width: number, height: number, grid?: (n: Node) => void) {
  const w = width / 2;
  const h = height / 2;
  const cols = Math.ceil(width / 90) + 1;
  const rows = Math.ceil(height / 90) + 3;
  return (
    <Node>
      <Rect
        size={[width, height]}
        fill={
          new Gradient({
            type: 'linear',
            from: [0, -h],
            to: [0, h],
            stops: [
              {offset: 0, color: '#0b2a63'},
              {offset: 0.55, color: '#06122b'},
              {offset: 1, color: '#02060f'},
            ],
          })
        }
      />
      <Node ref={grid} opacity={0.25}>
        {Array.from({length: cols}, (_, i) => (
          <Line
            points={[
              [-w + i * 90, -h - 140],
              [-w + i * 90, h + 140],
            ]}
            stroke="#2b5aa8"
            lineWidth={2}
          />
        ))}
        {Array.from({length: rows}, (_, i) => (
          <Line
            points={[
              [-w - 20, -h - 120 + i * 90],
              [w + 20, -h - 120 + i * 90],
            ]}
            stroke="#2b5aa8"
            lineWidth={2}
          />
        ))}
      </Node>
      <Circle size={700} x={w - 120} y={-h + 260} fill={CYAN} opacity={0.08} />
      <Circle size={900} x={-w + 60} y={h - 200} fill={ORANGE} opacity={0.06} />
    </Node>
  );
}

/** "Fatec / Taquaritinga" logo block, centered on its red badge. */
export function logo(props: {ref?: (n: Node) => void; x?: number; y?: number; scale?: number; opacity?: number} = {}) {
  return (
    <Node {...props}>
      <Rect width={430} height={170} radius={22} fill={RED}>
        <Txt text="Fatec" fontFamily={FONT} fontWeight={800} fontSize={124} fill={WHITE} />
      </Rect>
      <Txt
        y={135}
        text="Taquaritinga"
        fontFamily={FONT}
        fontWeight={600}
        fontSize={52}
        fill={WHITE}
      />
    </Node>
  );
}

/** Cyan circle with a drawn check mark. */
export function checkIcon(checkRef?: (l: Line) => void, end = 1) {
  return (
    <Node>
      <Circle size={76} fill={CYAN} />
      <Line
        ref={checkRef}
        points={[
          [-17, 1],
          [-5, 14],
          [18, -12],
        ]}
        stroke={NAVY}
        lineWidth={9}
        lineCap="round"
        lineJoin="round"
        end={end}
      />
    </Node>
  );
}

/** Area card used in the "Você vai dominar" grid. */
export function areaCard(
  label: string,
  index: number,
  props: {ref?: (r: Rect) => void; x?: number; y?: number; opacity?: number; width?: number; height?: number} = {},
) {
  return (
    <Rect
      width={460}
      height={220}
      radius={26}
      fill={CARD}
      stroke={CYAN}
      lineWidth={3}
      {...props}
    >
      <Txt
        y={-62}
        text={`0${index + 1}`}
        fontFamily={FONT}
        fontWeight={800}
        fontSize={34}
        fill={CYAN}
      />
      <Txt
        y={20}
        textAlign="center"
        text={label}
        lineHeight={54}
        fontFamily={FONT}
        fontWeight={700}
        fontSize={46}
        fill={WHITE}
      />
    </Rect>
  );
}
