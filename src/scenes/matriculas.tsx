import {Line, makeScene2D, Node, Rect, Txt} from '@motion-canvas/2d';
import {
  all,
  createRef,
  createRefArray,
  delay,
  easeInCubic,
  easeOutBack,
  easeOutCubic,
  linear,
  loop,
  sequence,
  ThreadGenerator,
  useTime,
  waitFor,
} from '@motion-canvas/core';
import {
  areaCard,
  AREAS,
  background,
  BENEFITS,
  checkIcon,
  CYAN,
  FONT,
  FOTO_OPERADORA,
  FOTO_TECNICO,
  logo as fatecLogo,
  photoBand,
  MUTED,
  NAVY,
  ORANGE,
  SITE,
  WHITE,
} from '../theme';

// Vertical video (Reels / Stories): 1080x1920, origin at the center.
const TOTAL = 20;

/** Fades a node in while sliding it up from below. */
function* enter(node: Node, duration = 0.6, offset = 60): ThreadGenerator {
  const y = node.y();
  node.y(y + offset);
  yield* all(node.opacity(1, duration), node.y(y, duration, easeOutCubic));
}

/** Fades a whole section out while sliding it up. */
function* leave(node: Node, duration = 0.5): ThreadGenerator {
  yield* all(
    node.opacity(0, duration, easeInCubic),
    node.y(node.y() - 80, duration, easeInCubic),
  );
}

function* pop(node: Node, duration = 0.5): ThreadGenerator {
  node.scale(0.6);
  yield* all(node.opacity(1, duration * 0.6), node.scale(1, duration, easeOutBack));
}

export default makeScene2D(function* (view) {
  view.fill(NAVY);

  // ---------- Background ----------
  const grid = createRef<Node>();
  view.add(background(1080, 1920, grid));

  // Endless, slow downward drift of the grid.
  yield loop(function* () {
    grid().y(0);
    yield* grid().y(90, 3, linear);
  });

  // ---------- People ----------
  // Technician: full screen in the intro, then a faint backdrop for the middle sections.
  // Operator: takes over for the call to action.
  const tecnico = createRef<Rect>();
  const operadora = createRef<Rect>();
  view.add(
    photoBand({
      ref: tecnico,
      opacity: 0,
      photo: {src: FOTO_TECNICO, x: 731, y: -356, width: 3000},
      width: 1080,
      top: -960,
      bottom: 500,
      fade: 700,
    }),
  );
  view.add(
    photoBand({
      ref: operadora,
      opacity: 0,
      photo: {src: FOTO_OPERADORA, x: -420, y: -165, width: 2400},
      width: 1080,
      top: -960,
      bottom: 100,
      fade: 500,
    }),
  );

  // ---------- Logo (stays on screen the whole video) ----------
  const logo = createRef<Node>();
  const tag = createRef<Txt>();
  view.add(fatecLogo({ref: logo, y: 160, opacity: 0}));
  view.add(
    <Txt
      ref={tag}
      y={490}
      opacity={0}
      text="VESTIBULAR FATEC"
      letterSpacing={10}
      fontFamily={FONT}
      fontWeight={700}
      fontSize={46}
      fill={CYAN}
    />,
  );

  // ---------- 1. Intro (0s – 4.5s) ----------
  const intro = createRef<Node>();
  const introLines = createRefArray<Txt>();
  view.add(
    <Node ref={intro}>
      {['LIDERE A', 'INDÚSTRIA', 'DO FUTURO'].map((text, i) => (
        <Txt
          ref={introLines}
          y={140 + i * 160}
          opacity={0}
          text={text}
          fontFamily={FONT}
          fontWeight={900}
          fontSize={140}
          fill={i === 1 ? CYAN : WHITE}
        />
      ))}
    </Node>,
  );

  yield* all(
    tecnico().opacity(1, 0.8),
    pop(logo(), 0.7),
    delay(0.35, enter(tag(), 0.5)),
  );
  yield* waitFor(0.6);
  yield* all(
    logo().position.y(-790, 0.7),
    logo().scale(0.55, 0.7),
    tag().opacity(0, 0.4),
  );
  yield* sequence(0.15, ...introLines.map(t => enter(t, 0.5)));
  yield* waitFor(0.9);
  yield* all(leave(intro()), tecnico().opacity(0.22, 0.5));

  // ---------- 2. Course + duration (4.5s – 8.8s) ----------
  const course = createRef<Node>();
  const courseTop = createRef<Txt>();
  const courseMain = createRef<Txt>();
  const durationLabel = createRef<Txt>();
  const years = createRef<Txt>();
  const bars = createRefArray<Rect>();
  const barLabels = createRefArray<Txt>();
  const caption = createRef<Txt>();
  view.add(
    <Node ref={course}>
      <Txt
        ref={courseTop}
        y={-450}
        opacity={0}
        text="GESTÃO DA PRODUÇÃO"
        fontFamily={FONT}
        fontWeight={800}
        fontSize={78}
        fill={WHITE}
      />
      <Txt
        ref={courseMain}
        y={-320}
        opacity={0}
        text="INDUSTRIAL"
        fontStyle="italic"
        fontFamily={FONT}
        fontWeight={900}
        fontSize={140}
        fill={CYAN}
      />
      <Txt
        ref={durationLabel}
        y={-110}
        opacity={0}
        text="EM APENAS"
        letterSpacing={8}
        fontFamily={FONT}
        fontWeight={700}
        fontSize={48}
        fill={MUTED}
      />
      <Txt
        ref={years}
        y={20}
        opacity={0}
        text="3 ANOS"
        fontFamily={FONT}
        fontWeight={900}
        fontSize={180}
        fill={ORANGE}
      />
      {[0, 1, 2].map(i => (
        <Node x={-300 + i * 300} y={200}>
          <Rect width={270} height={28} radius={14} fill="#1a2f5c" />
          <Rect
            ref={bars}
            x={-135}
            offset={[-1, 0]}
            width={0}
            height={28}
            radius={14}
            fill={ORANGE}
          />
          <Txt
            ref={barLabels}
            y={60}
            opacity={0}
            text={`${i + 1}º ano`}
            fontFamily={FONT}
            fontWeight={600}
            fontSize={36}
            fill={WHITE}
          />
        </Node>
      ))}
      <Txt
        ref={caption}
        y={420}
        opacity={0}
        textAlign="center"
        text={'e você está pronto para atuar como\ngestor de produção industrial'}
        lineHeight={64}
        fontFamily={FONT}
        fontWeight={600}
        fontSize={46}
        fill={WHITE}
      />
    </Node>,
  );

  yield* all(enter(courseTop(), 0.5), delay(0.2, enter(courseMain(), 0.6)));
  yield* all(enter(durationLabel(), 0.4), delay(0.15, pop(years(), 0.5)));
  yield* sequence(
    0.35,
    ...bars.map((bar, i) =>
      all(bar.width(270, 0.45, easeOutCubic), barLabels[i].opacity(1, 0.3)),
    ),
  );
  yield* enter(caption(), 0.5);
  yield* waitFor(0.9);
  yield* leave(course());

  // ---------- 3. What you learn (8.8s – 12.9s) ----------
  const areas = createRef<Node>();
  const areasTitle = createRef<Txt>();
  const cards = createRefArray<Rect>();
  view.add(
    <Node ref={areas}>
      <Txt
        ref={areasTitle}
        y={-520}
        opacity={0}
        text="VOCÊ VAI DOMINAR"
        fontFamily={FONT}
        fontWeight={900}
        fontSize={86}
        fill={WHITE}
      />
      {AREAS.map((label, i) =>
        areaCard(label, i, {
          ref: cards,
          x: i % 2 === 0 ? -245 : 245,
          y: -290 + Math.floor(i / 2) * 250,
          opacity: 0,
        }),
      )}
    </Node>,
  );

  yield* enter(areasTitle(), 0.5);
  yield* sequence(0.18, ...cards.map(card => pop(card, 0.5)));
  yield* waitFor(1.85);
  yield* leave(areas());

  // ---------- 4. Employability + benefits (12.9s – 16.5s) ----------
  const jobs = createRef<Node>();
  const banner = createRef<Rect>();
  const jobsText = createRef<Txt>();
  const rows = createRefArray<Node>();
  const checks = createRefArray<Line>();
  view.add(
    <Node ref={jobs}>
      <Rect
        ref={banner}
        y={-500}
        width={960}
        height={150}
        radius={26}
        fill={ORANGE}
        opacity={0}
      >
        <Txt
          text="ALTA EMPREGABILIDADE"
          fontFamily={FONT}
          fontWeight={900}
          fontSize={72}
          fill={WHITE}
        />
      </Rect>
      <Txt
        ref={jobsText}
        y={-320}
        opacity={0}
        textAlign="center"
        text={
          'Planeje operações, otimize processos\ne impulsione a competitividade\ndas organizações.'
        }
        lineHeight={58}
        fontFamily={FONT}
        fontWeight={500}
        fontSize={42}
        fill={MUTED}
      />
      {BENEFITS.map((text, i) => (
        <Node ref={rows} x={-400} y={-80 + i * 145} opacity={0}>
          {checkIcon(checks, 0)}
          <Txt
            x={70}
            offset={[-1, 0]}
            text={text}
            fontFamily={FONT}
            fontWeight={700}
            fontSize={46}
            fill={WHITE}
          />
        </Node>
      ))}
    </Node>,
  );

  yield* pop(banner(), 0.55);
  yield* enter(jobsText(), 0.45);
  yield* sequence(
    0.3,
    ...rows.map((row, i) =>
      all(enter(row, 0.4, 30), delay(0.2, checks[i].end(1, 0.3))),
    ),
  );
  yield* waitFor(0.65);
  yield* leave(jobs());

  // ---------- 5. Call to action (16.5s – 20s) ----------
  const cta = createRef<Node>();
  const ctaLines = createRefArray<Txt>();
  const access = createRef<Txt>();
  const pill = createRef<Rect>();
  const footer = createRef<Txt>();
  view.add(
    // Shifted down so the operator's face stays visible above the text.
    <Node ref={cta} y={330}>
      {['INSCRIÇÕES', 'ABERTAS'].map((text, i) => (
        <Txt
          ref={ctaLines}
          y={-340 + i * 150}
          opacity={0}
          text={text}
          fontFamily={FONT}
          fontWeight={900}
          fontSize={140}
          fill={i === 0 ? WHITE : CYAN}
        />
      ))}
      <Txt
        ref={access}
        y={20}
        opacity={0}
        text="Inscreva-se no vestibular:"
        fontFamily={FONT}
        fontWeight={600}
        fontSize={50}
        fill={MUTED}
      />
      <Rect
        ref={pill}
        y={150}
        width={960}
        height={140}
        radius={70}
        fill={ORANGE}
        opacity={0}
      >
        <Txt
          text={SITE}
          fontFamily={FONT}
          fontWeight={800}
          fontSize={60}
          fill={WHITE}
        />
      </Rect>
      <Txt
        ref={footer}
        y={360}
        opacity={0}
        textAlign="center"
        text={'#VestibularFatec  #Fatectq  #GPI'}
        fontFamily={FONT}
        fontWeight={700}
        fontSize={40}
        fill={CYAN}
      />
    </Node>,
  );

  yield* all(
    tecnico().opacity(0, 0.6),
    operadora().opacity(1, 0.7),
    sequence(0.2, ...ctaLines.map(t => pop(t, 0.55))),
  );
  yield* enter(access(), 0.4);
  yield* pop(pill(), 0.55);
  yield* all(
    enter(footer(), 0.4),
    pill().scale(1.06, 0.35).to(1, 0.35).to(1.06, 0.35).to(1, 0.35),
  );

  // Hold the final frame so the video is exactly TOTAL seconds long.
  yield* waitFor(Math.max(0, TOTAL - useTime()));
});
