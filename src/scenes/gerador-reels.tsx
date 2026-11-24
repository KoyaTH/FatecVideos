import {Img, makeScene2D, Node} from '@motion-canvas/2d';
import {
  all,
  createRef,
  easeOutBack,
  easeOutCubic,
  linear,
  sequence,
  ThreadGenerator,
  useTime,
  Vector2,
  waitFor,
} from '@motion-canvas/core';
import {montar} from '../gen/estilos';
import {Animacao, ReelsSpec} from '../gen/spec';
import fila from '../gen/fila-reels.json';

// Vertical Reels (1080x1920) built from src/gen/fila-reels.json (written by tools/gerar.py).
// Each slide is one generator layout whose pieces are revealed in reading order;
// slides cross-fade and their photo slowly zooms (Ken Burns).
const W = 1080;
const H = 1920;
const CROSSFADE = 0.45;

function* revelar(node: Node, estilo: Animacao, d = 0.55): ThreadGenerator {
  const pos = node.position();
  const scale = node.scale();
  switch (estilo) {
    case 'subir':
      node.position(pos.add([0, 60]));
      yield* all(node.opacity(1, d), node.position(pos, d, easeOutCubic));
      break;
    case 'lado':
      node.position(pos.add([-90, 0]));
      yield* all(node.opacity(1, d), node.position(pos, d, easeOutCubic));
      break;
    case 'pop':
      node.scale(scale.mul(0.75));
      yield* all(node.opacity(1, d * 0.6), node.scale(scale, d, easeOutBack));
      break;
    default:
      yield* node.opacity(1, d);
  }
}

export default makeScene2D(function* (view) {
  const spec = fila as unknown as ReelsSpec;
  const starts: number[] = [];
  const durs: number[] = [];
  let t = 0;
  spec.slides.forEach((s, i) => {
    const timing = spec.tempos?.[i];
    starts.push(timing ? timing.start : t);
    durs.push(timing ? timing.duration : s.duracao ?? 3.5);
    t = starts[i] + durs[i];
  });

  const slides = spec.slides.map(s => {
    const img = createRef<Img>();
    const built = montar(s, W, H, img);
    const node = built.node as Node;
    node.opacity(0);
    built.partes.forEach(p => p.opacity(0));
    view.add(node);
    return {node, partes: built.partes, img};
  });

  for (let i = 0; i < slides.length; i++) {
    const cur = slides[i];
    const prev = slides[i - 1];
    yield* waitFor(Math.max(0, starts[i] - (i > 0 ? CROSSFADE / 2 : 0) - useTime()));

    const end = i < slides.length - 1 ? starts[i + 1] : spec.total;
    if (cur.img()) {
      const s0 = cur.img().scale();
      cur.img().scale(s0.mul(1.0));
      yield cur.img().scale(new Vector2(s0).mul(1.08), Math.max(1, end - useTime() + CROSSFADE), linear);
    }

    const [bg, ...rest] = cur.partes;
    yield* all(
      cur.node.opacity(1, i > 0 ? CROSSFADE : 0.3),
      prev ? prev.node.opacity(0, CROSSFADE) : waitFor(0),
      bg ? bg.opacity(1, 0.5) : waitFor(0),
      sequence(0.16, ...rest.map(p => revelar(p, spec.animacao))),
    );
  }

  yield* waitFor(Math.max(0, spec.total - useTime()));
});
