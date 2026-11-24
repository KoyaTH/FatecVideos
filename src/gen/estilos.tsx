// The generator's layout styles. Every style works for any canvas size
// (1080x1350 posts, 1080x1920 Reels) and sizes every text with fit(), so
// nothing overflows or overlaps whatever the content length.
import {Circle, Gradient, Img, Line, Node, Rect, Txt} from '@motion-canvas/2d';
import {fit, FontSpec, GEN_FONT} from './fit';
import {enquadrar, FOTOS} from './fotos';
import {Fundo, Paleta, PostSpec} from './spec';

const SITE = 'vestibular.fatec.sp.gov.br';

// ---------- Palettes ----------
export interface Pal {
  bg: [string, string];
  text: string;
  muted: string;
  accent: string;
  accent2: string;
  card: string;
  line: string;
  /** Text color on top of accent fills. */
  onAccent: string;
  dark: boolean;
}

export const PALETAS: Record<Paleta, Pal> = {
  azul: {
    bg: ['#0b2a63', '#030a1c'], text: '#ffffff', muted: '#a9c1e3', accent: '#22c3ff',
    accent2: '#ff7a1a', card: '#0d2350', line: '#2b5aa8', onAccent: '#06122b', dark: true,
  },
  laranja: {
    bg: ['#1b1f3b', '#07080f'], text: '#ffffff', muted: '#c7c9de', accent: '#ff8a2a',
    accent2: '#22c3ff', card: '#262a4d', line: '#3c4170', onAccent: '#140a02', dark: true,
  },
  vermelho: {
    bg: ['#3a0d1a', '#0f0408'], text: '#ffffff', muted: '#e8b9c2', accent: '#ff4d5a',
    accent2: '#ffd166', card: '#4a1424', line: '#6b2236', onAccent: '#1a0207', dark: true,
  },
  claro: {
    bg: ['#f6f9fd', '#dce7f5'], text: '#06122b', muted: '#4a6388', accent: '#0a6cff',
    accent2: '#ff7a1a', card: '#ffffff', line: '#bfd0e8', onAccent: '#ffffff', dark: false,
  },
};
/** Text on top of a darkened photo is always light. */
const ON_PHOTO: Partial<Pal> = {text: '#ffffff', muted: '#d7e2f2'};

// ---------- Building blocks ----------
function fundo(tipo: Fundo, p: Pal, W: number, H: number) {
  const w = W / 2;
  const h = H / 2;
  const deco = p.dark ? 0.22 : 0.5;
  return (
    <Node>
      <Rect
        size={[W, H]}
        fill={new Gradient({from: [0, -h], to: [0, h], stops: [{offset: 0, color: p.bg[0]}, {offset: 1, color: p.bg[1]}]})}
      />
      {tipo === 'grade' && (
        <Node opacity={deco}>
          {Array.from({length: Math.ceil(W / 90) + 1}, (_, i) => (
            <Line points={[[-w + i * 90, -h], [-w + i * 90, h]]} stroke={p.line} lineWidth={2} />
          ))}
          {Array.from({length: Math.ceil(H / 90) + 1}, (_, i) => (
            <Line points={[[-w, -h + i * 90], [w, -h + i * 90]]} stroke={p.line} lineWidth={2} />
          ))}
        </Node>
      )}
      {tipo === 'diagonal' && (
        <Node opacity={deco * 0.8} rotation={-28}>
          {Array.from({length: 9}, (_, i) => (
            <Rect x={-1100 + i * 280} width={90} height={H * 2.4} fill={p.line} />
          ))}
        </Node>
      )}
      {tipo === 'circulos' && (
        <Node x={w * 0.85} y={-h * 0.75} opacity={deco * 1.6}>
          {Array.from({length: 7}, (_, i) => (
            <Circle size={260 + i * 190} stroke={p.line} lineWidth={3} />
          ))}
        </Node>
      )}
      <Circle size={W * 0.9} x={w * 0.6} y={-h * 0.55} fill={p.accent} opacity={p.dark ? 0.08 : 0.1} />
      <Circle size={W * 1.1} x={-w * 0.7} y={h * 0.7} fill={p.accent2} opacity={p.dark ? 0.06 : 0.08} />
    </Node>
  );
}

function logo(p: Pal, x: number, y: number, scale: number) {
  return (
    <Node x={x} y={y} scale={scale}>
      <Rect width={430} height={170} radius={22} fill="#d71920">
        <Txt text="Fatec" fontFamily={GEN_FONT} fontWeight={800} fontSize={124} fill="#ffffff" />
      </Rect>
      <Txt y={135} text="Taquaritinga" fontFamily={GEN_FONT} fontWeight={600} fontSize={52} fill={p.text} />
    </Node>
  );
}

/** Photo cropped to a box (center x, y and size w x h), with optional rounded corners and bottom fade. */
function foto(
  key: string,
  b: {x: number; y: number; w: number; h: number},
  o: {radius?: number; fade?: number; tint?: number; tintColor?: string; ax?: number; ay?: number; imgRef?: (i: Img) => void} = {},
) {
  const f = FOTOS[key] ?? Object.values(FOTOS)[0];
  const e = enquadrar(f, b.w, b.h, o.ax ?? 0.5, o.ay ?? 0.45);
  const fade = o.fade ? Math.min(o.fade, b.h) : 0;
  return (
    <Rect x={b.x} y={b.y} width={b.w} height={b.h} radius={o.radius ?? 0} clip cache>
      <Img ref={o.imgRef} src={f.src} x={e.x} y={e.y} width={e.width} />
      <Rect size={[b.w, b.h]} fill={o.tintColor ?? '#0b2a63'} opacity={o.tint ?? 0.22} />
      {fade > 0 && (
        <Rect
          size={[b.w, b.h]}
          compositeOperation="destination-in"
          fill={
            new Gradient({
              from: [0, -b.h / 2],
              to: [0, b.h / 2],
              stops: [
                {offset: 0, color: 'rgba(0,0,0,1)'},
                {offset: (b.h - fade) / b.h, color: 'rgba(0,0,0,1)'},
                {offset: 1, color: 'rgba(0,0,0,0)'},
              ],
            })
          }
        />
      )}
    </Rect>
  );
}

function checkBox(size: number, fill: string, stroke: string) {
  const k = size / 28;
  return (
    <Rect width={size} height={size} radius={7 * k} fill={fill}>
      <Line points={[[-7 * k, 0], [-2 * k, 5 * k], [7 * k, -5 * k]]} stroke={stroke} lineWidth={4 * k} lineCap="round" lineJoin="round" />
    </Rect>
  );
}

// ---------- Text stack ----------
interface StackOpts {
  x: number; // left edge (esquerda) or center (centro)
  width: number;
  align: 'esquerda' | 'centro';
  maxHeight: number;
  /** Base sizes before shrinking. */
  sizes?: {chamada?: number; titulo?: number; destaque?: number; texto?: number; item?: number};
  cards?: boolean;
  /** Largest scale over the base sizes (bigger on tall canvases). */
  grow?: number;
  u: number;
}

interface Planned {
  height: number;
  build: (top: number) => Node[];
}

/** Lays out chamada / titulo / destaque / texto / itens, shrinking everything until it fits maxHeight. */
function stack(s: PostSpec, p: Pal, o: StackOpts): Planned {
  const u = o.u;
  const base = {chamada: 30, titulo: 96, destaque: 190, texto: 34, item: 31, ...o.sizes};
  const center = o.align === 'centro';
  const anchorX = o.x;

  // Start bigger than the base sizes so short content fills the space, then shrink until it fits.
  for (let k = o.grow ?? 1.35; k >= 0.5; k -= 0.05) {
    type Part = {h: number; gap: number; make: (y: number) => Node};
    const parts: Part[] = [];
    const txt = (text: string, f: FontSpec & {max: number; maxLines?: number; color: string; gap: number; glow?: boolean; lh?: number}) => {
      const r = fit(text, {...f, maxWidth: o.width, max: f.max, min: Math.round(f.max * 0.6), maxLines: f.maxLines, lh: f.lh});
      parts.push({
        h: r.height,
        gap: f.gap,
        make: y => (
          <Txt
            x={anchorX}
            y={y}
            offset={[center ? 0 : -1, -1]}
            textAlign={center ? 'center' : 'left'}
            text={r.text}
            fontSize={r.size}
            lineHeight={r.lineHeight}
            fontFamily={GEN_FONT}
            fontWeight={f.weight ?? 400}
            fontStyle={f.italic ? 'italic' : 'normal'}
            letterSpacing={f.letterSpacing ?? 0}
            fill={f.color}
            shadowColor={f.glow ? f.color : undefined}
            shadowBlur={f.glow ? 28 : 0}
          />
        ),
      });
    };

    if (s.chamada) txt(s.chamada.toUpperCase(), {max: base.chamada * u * k, weight: 800, letterSpacing: 4 * u, color: p.accent, gap: 14 * u * k, maxLines: 2});
    txt(s.titulo, {max: base.titulo * u * k, weight: 900, italic: true, color: p.text, gap: 10 * u * k, maxLines: 4, lh: 1.05});
    if (s.destaque) txt(s.destaque, {max: base.destaque * u * k, weight: 900, italic: true, color: p.accent, gap: 16 * u * k, maxLines: 1, glow: p.dark, lh: 1.0});
    if (s.texto) txt(s.texto, {max: base.texto * u * k, weight: 500, color: p.muted, gap: 22 * u * k, maxLines: 5, lh: 1.3});

    for (const item of s.itens ?? []) {
      const box = 34 * u * k;
      const pad = o.cards ? 22 * u : 0;
      const r = fit(item, {maxWidth: o.width - box - 18 * u - pad * 2, max: base.item * u * k, min: Math.round(base.item * u * k * 0.7), weight: 700, maxLines: 2, lh: 1.2});
      const h = Math.max(r.height, box) + (o.cards ? 26 * u * k : 0);
      parts.push({
        h,
        gap: 12 * u * k,
        make: y => {
          const left = center ? anchorX - o.width / 2 : anchorX;
          // Center the row block when aligned center: measure row width.
          const rowW = box + 18 * u + r.width;
          const rowLeft = center && !o.cards ? anchorX - rowW / 2 : left + pad;
          return (
            <Node>
              {o.cards && <Rect x={left + o.width / 2} y={y + h / 2} width={o.width} height={h} radius={18 * u} fill={p.card} stroke={p.line} lineWidth={1.5} />}
              <Node x={rowLeft + box / 2} y={y + h / 2}>{checkBox(box, p.accent, p.onAccent)}</Node>
              <Txt
                x={rowLeft + box + 18 * u}
                y={y + h / 2}
                offset={[-1, 0]}
                text={r.text}
                fontSize={r.size}
                lineHeight={r.lineHeight}
                fontFamily={GEN_FONT}
                fontWeight={700}
                fill={p.text}
              />
            </Node>
          );
        },
      });
    }

    const height = parts.reduce((sum, part, i) => sum + part.h + (i < parts.length - 1 ? part.gap : 0), 0);
    if (height <= o.maxHeight || k <= 0.5) {
      return {
        height,
        build: top => {
          let y = top;
          return parts.map(part => {
            const node = part.make(y);
            y += part.h + part.gap;
            return node;
          });
        },
      };
    }
  }
  throw new Error('unreachable');
}

function rodape(s: PostSpec, p: Pal, W: number, H: number, u: number, align: 'esquerda' | 'centro') {
  const M = 64 * u;
  const text = s.rodape ?? SITE;
  const r = fit(text, {maxWidth: W - 2 * M, max: 30 * u, weight: 800, maxLines: 1});
  return (
    <Txt
      x={align === 'centro' ? 0 : -W / 2 + M}
      y={H / 2 - 62 * u}
      offset={[align === 'centro' ? 0 : -1, 0]}
      text={r.text}
      fontSize={r.size}
      fontFamily={GEN_FONT}
      fontWeight={800}
      fill={p.accent}
    />
  );
}

function cabecalho(s: PostSpec, p: Pal, W: number, H: number, u: number) {
  const M = 64 * u;
  const selo = (s.selo ?? 'VESTIBULAR FATEC').toUpperCase();
  const r = fit(selo, {maxWidth: W * 0.48, max: 24 * u, weight: 800, letterSpacing: 3 * u, maxLines: 2, lh: 1.3});
  const padX = 22 * u;
  const padY = 12 * u;
  // The tag sits on a pill so it stays readable over photos and patterns.
  return (
    <Node>
      {logo(p, -W / 2 + M + 82 * u, -H / 2 + 64 * u, 0.38 * u)}
      <Rect
        x={W / 2 - M - (r.width + 2 * padX) / 2}
        y={-H / 2 + 64 * u}
        width={r.width + 2 * padX}
        height={r.height + 2 * padY}
        radius={(r.height + 2 * padY) / 2}
        fill={p.dark ? 'rgba(3,8,22,0.72)' : 'rgba(255,255,255,0.88)'}
        stroke={p.accent}
        lineWidth={1.5}
      >
        <Txt
          textAlign="center"
          text={r.text}
          fontSize={r.size}
          lineHeight={r.lineHeight}
          letterSpacing={3 * u}
          fontFamily={GEN_FONT}
          fontWeight={800}
          fill={p.accent}
        />
      </Rect>
    </Node>
  );
}

/** Dark gradient at the top of a photo so the logo and tag stay readable. */
function sombraTopo(W: number, H: number, u: number) {
  const h = 300 * u;
  return (
    <Rect
      y={-H / 2 + h / 2}
      size={[W, h]}
      fill={
        new Gradient({
          from: [0, -h / 2],
          to: [0, h / 2],
          stops: [
            {offset: 0, color: 'rgba(3,8,22,0.8)'},
            {offset: 1, color: 'rgba(3,8,22,0)'},
          ],
        })
      }
    />
  );
}

// ---------- Styles ----------
export interface Montado {
  node: Node;
  /** Pieces in reading order, for animated reveals. */
  partes: Node[];
}

export function montar(s: PostSpec, W: number, H: number, imgRef?: (i: Img) => void): Montado {
  const u = W / 1080;
  const M = 64 * u;
  const top = -H / 2;
  const bottom = H / 2;
  const tall = H / W > 1.5;
  let p = PALETAS[s.paleta] ?? PALETAS.azul;
  const align = s.alinhamento;
  const contentBottom = bottom - 120 * u;
  const headerBottom = top + 160 * u;

  const partes: Node[] = [];
  const back: Node[] = [];
  let headerPal = p;

  const grow = tall ? 1.8 : 1.35;
  const mk = (spec: PostSpec, pal: Pal, opts: StackOpts) => stack(spec, pal, {grow, ...opts});
  const placeStack = (st: Planned, topY: number) => st.build(topY).forEach(n => partes.push(n));
  /** Place a stack in [startY, contentBottom], slightly above the middle of any leftover space. */
  const placeIn = (st: Planned, startY: number) =>
    placeStack(st, startY + Math.max(0, contentBottom - startY - st.height) * 0.35);
  const xFor = (left: number, width: number) => (align === 'centro' ? left + width / 2 : left);

  switch (s.estilo) {
    case 'faixa': {
      const bandH = H * (tall ? 0.48 : 0.44);
      back.push(foto(s.foto, {x: 0, y: top + bandH / 2, w: W, h: bandH}, {fade: bandH * 0.38, imgRef}));
      back.push(sombraTopo(W, H, u));
      headerPal = {...p, ...ON_PHOTO};
      const startY = top + bandH * 0.86;
      const st = mk(s, p, {x: xFor(-W / 2 + M, W - 2 * M), width: W - 2 * M, align, maxHeight: contentBottom - startY, u});
      placeIn(st, startY);
      break;
    }
    case 'cheia': {
      p = {...p, ...ON_PHOTO};
      headerPal = p;
      back.push(foto(s.foto, {x: 0, y: 0, w: W, h: H}, {tint: 0.15, ay: 0.32, imgRef}));
      back.push(
        <Rect
          size={[W, H]}
          fill={
            new Gradient({
              from: [0, -H / 2],
              to: [0, H / 2],
              stops: [
                {offset: 0, color: 'rgba(3,8,22,0.55)'},
                {offset: 0.22, color: 'rgba(3,8,22,0.05)'},
                {offset: 0.5, color: 'rgba(3,8,22,0.45)'},
                {offset: 1, color: 'rgba(3,8,22,0.95)'},
              ],
            })
          }
        />,
      );
      const st = mk(s, p, {x: xFor(-W / 2 + M, W - 2 * M), width: W - 2 * M, align, maxHeight: H * 0.48, u});
      placeStack(st, contentBottom - st.height);
      break;
    }
    case 'dividido': {
      if (tall) {
        const ph = H * 0.42;
        back.push(foto(s.foto, {x: 0, y: headerBottom + ph / 2 + 10 * u, w: W - 2 * M, h: ph}, {radius: 36 * u, imgRef}));
        back.push(<Rect x={0} y={headerBottom + ph + 10 * u + 28 * u} width={160 * u} height={10 * u} radius={5 * u} fill={p.accent} />);
        const startY = headerBottom + ph + 80 * u;
        const st = mk(s, p, {x: xFor(-W / 2 + M, W - 2 * M), width: W - 2 * M, align, maxHeight: contentBottom - startY, u});
        placeIn(st, startY);
      } else {
        const pw = W * 0.42;
        const ph = contentBottom - headerBottom - 20 * u;
        const px = -W / 2 + M + pw / 2;
        back.push(foto(s.foto, {x: px, y: headerBottom + 10 * u + ph / 2, w: pw, h: ph}, {radius: 32 * u, imgRef}));
        back.push(<Rect x={px + pw / 2 + 22 * u} y={headerBottom + 10 * u + ph / 2} width={8 * u} height={ph * 0.6} radius={4 * u} fill={p.accent} />);
        const colLeft = px + pw / 2 + 56 * u;
        const colW = W / 2 - M - colLeft;
        const st = mk(s, p, {
          x: colLeft, width: colW, align: 'esquerda', maxHeight: ph, u,
          sizes: {titulo: 76, destaque: 130, texto: 30, item: 27, chamada: 26},
        });
        placeStack(st, headerBottom + 10 * u + (ph - st.height) / 2);
      }
      break;
    }
    case 'numero': {
      const d = Math.min(W * 0.46, H * 0.3);
      const cy = headerBottom + d / 2 + 30 * u;
      back.push(<Circle y={cy} size={d + 34 * u} stroke={p.accent} lineWidth={6 * u} />);
      back.push(<Circle y={cy} size={d + 80 * u} stroke={p.accent2} lineWidth={2 * u} opacity={0.6} />);
      back.push(
        <Circle y={cy} size={d} clip cache>
          {foto(s.foto, {x: 0, y: 0, w: d, h: d}, {imgRef})}
        </Circle>,
      );
      const startY = cy + d / 2 + 60 * u;
      const st = mk({...s, itens: s.itens?.slice(0, 3)}, p, {
        x: 0, width: W - 2 * M, align: 'centro', maxHeight: contentBottom - startY, u,
        sizes: {titulo: 64, destaque: 230},
      });
      placeIn(st, startY);
      break;
    }
    case 'lista': {
      const bandH = H * (tall ? 0.34 : 0.3);
      back.push(foto(s.foto, {x: 0, y: top + bandH / 2, w: W, h: bandH}, {fade: bandH * 0.5, imgRef}));
      back.push(sombraTopo(W, H, u));
      headerPal = {...p, ...ON_PHOTO};
      const startY = top + bandH * 0.78;
      const st = mk(s, p, {
        x: xFor(-W / 2 + M, W - 2 * M), width: W - 2 * M, align, maxHeight: contentBottom - startY, u, cards: true,
        sizes: {titulo: 84, destaque: 150, item: 32},
      });
      placeIn(st, startY);
      break;
    }
    case 'polaroid': {
      const side = s.lado ?? 1;
      const cw = W * 0.62;
      const ch = Math.min(H * 0.4, cw * 0.9);
      const cx = side * W * 0.12;
      const cy = headerBottom + ch / 2 + 50 * u;
      back.push(
        <Node x={cx} y={cy} rotation={side * 4}>
          <Rect width={cw + 36 * u} height={ch + 110 * u} y={30 * u} radius={10 * u} fill="#ffffff" shadowColor="rgba(0,0,0,0.45)" shadowBlur={40 * u} shadowOffsetY={16 * u} />
          {foto(s.foto, {x: 0, y: 0, w: cw, h: ch}, {tint: 0.08, imgRef})}
          <Rect y={ch / 2 + 50 * u} width={cw * 0.4} height={10 * u} radius={5 * u} fill={p.accent} />
        </Node>,
      );
      const startY = cy + ch / 2 + 140 * u;
      const st = mk(s, p, {x: xFor(-W / 2 + M, W - 2 * M), width: W - 2 * M, align, maxHeight: contentBottom - startY, u});
      placeIn(st, startY);
      break;
    }
  }

  const header = cabecalho(s, headerPal, W, H, u);
  const footer = rodape(s, p, W, H, u, align);
  const node = (
    <Node>
      {fundo(s.fundo, PALETAS[s.paleta] ?? PALETAS.azul, W, H)}
      {back}
      {header}
      {partes}
      {footer}
    </Node>
  ) as Node;
  return {node, partes: [...back, header, ...partes, footer]};
}
