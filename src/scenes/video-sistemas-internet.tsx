import {makeScene2D, Node} from '@motion-canvas/2d';
import {
  all,
  delay,
  easeOutBack,
  easeOutCubic,
  linear,
  loop,
  sequence,
  ThreadGenerator,
  useTime,
  waitFor,
} from '@motion-canvas/core';
import {makePosterRefs, poster, SISTEMAS_INTERNET} from '../poster';
import tempos from '../audio/roteiro-sistemas-internet.tempos.json';

// The poster, assembled piece by piece in sync with the pt-BR narration.
// Timings come from tools/narracao.py (start/duration of each spoken segment).
const HOLD_AT_END = 1.2;

const seg = (id: string) => {
  const s = tempos.segments.find(s => s.id === id);
  if (!s) throw new Error(`segment "${id}" missing from tempos.json`);
  return s;
};

/** Wait until an absolute time (seconds from the start of the video). */
function* until(time: number): ThreadGenerator {
  yield* waitFor(Math.max(0, time - useTime()));
}

function* rise(node: Node, duration = 0.6, offset = 40): ThreadGenerator {
  const y = node.y();
  node.y(y + offset);
  yield* all(node.opacity(1, duration), node.y(y, duration, easeOutCubic));
}

/** Scales a node up from `from` × its own scale (the logo, for example, is 0.42). */
function* pop(node: Node, duration = 0.55, from = 0.6): ThreadGenerator {
  const target = node.scale();
  node.scale(target.mul(from));
  yield* all(node.opacity(1, duration * 0.6), node.scale(target, duration, easeOutBack));
}

export default makeScene2D(function* (view) {
  const r = makePosterRefs();
  view.add(poster(SISTEMAS_INTERNET, r));

  // Start with an empty background: hide every piece of the poster.
  [
    r.hero(), r.logo(), r.floating(), r.headline1(), r.headline2(), r.subtitle(),
    r.banner(), r.side(), r.enroll(), r.pill(), r.cursor(), r.tagline(),
    ...r.areas, ...r.checks,
  ].forEach(node => node.opacity(0));

  const end = tempos.total + HOLD_AT_END;

  // Slow zoom-out on the photo for the whole video.
  r.photo().scale(1.12);
  yield r.photo().scale(1, end, linear);

  // 1. "Quer criar o futuro da internet?"
  yield* all(
    r.hero().opacity(1, 0.8),
    delay(0.2, pop(r.logo())),
    delay(0.5, rise(r.floating(), 0.6)),
    delay(0.5, rise(r.headline1(), 0.6)),
    delay(1.1, pop(r.headline2(), 0.7, 0.7)),
  );

  // 2. "Na Fatec Taquaritinga, o curso superior tecnológico em Sistemas para Internet..."
  yield* until(seg('curso').start + 0.2);
  yield* rise(r.subtitle(), 0.7);

  // 3. "Você aprende desenvolvimento web, aplicativos mobile, ..." – one icon per item.
  const areas = seg('areas');
  yield* until(areas.start + 1.0);
  yield* sequence((areas.duration - 1.6) / r.areas.length, ...r.areas.map(a => pop(a, 0.5)));

  // 4. "É um mercado em expansão: ..."
  const mercado = seg('mercado');
  yield* until(mercado.start);
  yield* pop(r.banner(), 0.6, 0.8);
  yield* until(mercado.start + 2.2);
  yield* rise(r.side(), 0.6);

  // 5. "O ensino superior é gratuito e presencial, com formação voltada ao mercado de tecnologia."
  const beneficios = seg('beneficios');
  yield* until(beneficios.start + 0.4);
  yield* sequence(beneficios.duration / 3.2, ...r.checks.map(c => rise(c, 0.45, 25)));

  // 6. "Fique de olho no próximo vestibular! Acompanhe as datas em: vestibular.fatec.sp.gov.br"
  const inscricoes = seg('inscricoes');
  yield* until(inscricoes.start);
  yield* rise(r.enroll(), 0.6);
  yield* until(inscricoes.start + 1.6);
  yield* pop(r.pill(), 0.55, 0.8);

  // Cursor slides in and "clicks" the link, then the link keeps pulsing.
  const cursor = r.cursor();
  const cursorX = cursor.x();
  cursor.x(cursorX + 120).y(cursor.y() + 60);
  yield* all(
    cursor.opacity(1, 0.3),
    cursor.position([cursorX, 652], 0.6, easeOutCubic),
    delay(0.4, rise(r.tagline(), 0.6)),
  );
  yield* cursor.scale(0.8, 0.12).to(1, 0.12);
  // (The pill's natural scale is 1, so pulsing between 1 and 1.05 is safe.)
  yield loop(() => r.pill().scale(1.05, 0.45).to(1, 0.45));

  yield* until(end);
});
