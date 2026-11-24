import {Circle, Img, Line, Node, Rect, SVG, Txt} from '@motion-canvas/2d';
import {createRef, createRefArray} from '@motion-canvas/core';
import studentsPhoto from './images/pixabay-students-1807505.jpg';

/** Handles to every part of the poster, so a video scene can animate them. */
export function makePosterRefs() {
  return {
    hero: createRef<Node>(),
    photo: createRef<Img>(),
    logo: createRef<Node>(),
    floating: createRef<Node>(),
    headline1: createRef<Txt>(),
    headline2: createRef<Txt>(),
    subtitle: createRef<Node>(),
    areas: createRefArray<Node>(),
    banner: createRef<Node>(),
    side: createRef<Node>(),
    enroll: createRef<Node>(),
    pill: createRef<Rect>(),
    cursor: createRef<SVG>(),
    checks: createRefArray<Node>(),
    tagline: createRef<Node>(),
  };
}
export type PosterRefs = ReturnType<typeof makePosterRefs>;
import {
  background,
  CYAN,
  FONT,
  FOTO_TECNICO,
  logo,
  MUTED,
  NAVY,
  ORANGE,
  photoBand,
  PhotoSpec,
  SITE,
  WHITE,
} from './theme';

// Single Instagram feed post, 4:5 portrait: 1080x1350, origin at the center.
export const POST_W = 1080;
export const POST_H = 1350;

// ---------- Icons (24x24, white strokes) ----------
// Motion Canvas ignores style attributes on the root <svg>, so they go on a <g>.
const svg = (body: string, size = 46) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24"><g fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${body}</g></svg>`;

export const ICONS = {
  code: '<polyline points="8 6 2 12 8 18"/><polyline points="16 6 22 12 16 18"/>',
  mobile: '<rect x="6" y="2" width="12" height="20" rx="2"/><line x1="11" y1="18" x2="13" y2="18"/>',
  design: '<rect x="3" y="3" width="13" height="13" rx="2"/><path d="M13 21l8-8-2.5-2.5-8 8V21z"/>',
  network:
    '<circle cx="12" cy="5" r="2.5"/><circle cx="5" cy="19" r="2.5"/><circle cx="19" cy="19" r="2.5"/><path d="M12 7.5v4M12 11.5L6.7 17M12 11.5l5.3 5.5"/>',
  social:
    '<rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="8" rx="2"/><rect x="3" y="13" width="8" height="8" rx="2"/><path d="M15 14.5l5 2.5-5 2.5z"/>',
  database:
    '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
  layers: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 12.5l9 5 9-5"/><path d="M3 17l9 5 9-5"/>',
  factory: '<path d="M3 21V10l6 4v-4l6 4V5h6v16z"/><path d="M7 18h2M12 18h2M17 18h2"/>',
  box: '<path d="M12 2l9 5v10l-9 5-9-5V7z"/><path d="M3 7l9 5 9-5M12 12v10"/>',
  truck:
    '<rect x="1" y="6" width="14" height="11" rx="1"/><path d="M15 10h4l3 3v4h-7z"/><circle cx="6" cy="18.5" r="2"/><circle cx="18" cy="18.5" r="2"/>',
  gear:
    '<circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="7"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9L7 7M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/>',
  chip:
    '<rect x="6" y="6" width="12" height="12" rx="2"/><rect x="9.5" y="9.5" width="5" height="5"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>',
  chart: '<path d="M3 21h18"/><rect x="5" y="12" width="3" height="7"/><rect x="10.5" y="7" width="3" height="12"/><rect x="16" y="3" width="3" height="16"/>',
  rocket:
    '<path d="M9 15l-3-3c1.5-5 5-9 14-9 0 9-4 12.5-9 14z"/><circle cx="15" cy="9" r="1.8"/><path d="M6 12H3l2.5-4H10M12 18v3l4-2.5V14"/><path d="M6.5 16.5C5 18 4.5 20 4.5 20s2-.5 3.5-2"/>',
};

export type IconName = keyof typeof ICONS;

function icon(name: IconName, size = 46, props: {x?: number; y?: number} = {}) {
  return <SVG svg={svg(ICONS[name], size)} {...props} />;
}

// ---------- Content ----------
export interface PosterContent {
  /** Short words floating over the illustration. */
  floating: string[];
  /** Hero illustration shown at the top (used when there is no photo). */
  hero: 'web' | 'industry';
  /**
   * Optional photo for the top of the post, replacing the illustration.
   * x/y/width place the image (center coordinates) so the people sit between
   * the header and the headline.
   */
  photo?: PhotoSpec;
  /** Headline: a smaller first line and a huge second line. */
  headline: [string, string];
  headlineSize?: number;
  course: string;
  areas: {icon: IconName; label: string}[];
  banner: {icon: IconName; title: string; text: string; side: string};
  benefits: string[];
}

// ---------- Hero illustrations ----------
function screenFrame(children: any) {
  return (
    <Node x={-140} y={-330}>
      <Rect width={560} height={320} radius={18} fill="#0a1838" stroke="#3a6fd8" lineWidth={5} clip>
        {children}
      </Rect>
      <Rect y={176} width={640} height={24} radius={12} fill="#2b3a5c" />
      <Rect y={170} width={120} height={10} radius={5} fill="#1a2747" />
    </Node>
  );
}

function webHero() {
  const code: [number, number, string][] = [
    // indent, width, color
    [0, 180, '#a78bfa'],
    [1, 260, CYAN],
    [2, 200, WHITE],
    [2, 140, ORANGE],
    [1, 90, CYAN],
    [1, 300, '#7dd3fc'],
    [2, 220, WHITE],
    [0, 70, '#a78bfa'],
  ];
  return (
    <Node>
      {screenFrame(
        <Node>
          <Rect y={-142} width={560} height={36} fill="#13244d" />
          {[0, 1, 2].map(i => (
            <Circle x={-250 + i * 24} y={-142} size={12} fill={[ORANGE, '#facc15', '#22c55e'][i]} />
          ))}
          {code.map(([indent, width, color], i) => (
            <Rect
              x={-240 + indent * 36}
              y={-95 + i * 30}
              offset={[-1, 0]}
              width={width}
              height={13}
              radius={6.5}
              fill={color}
              opacity={color === WHITE ? 0.55 : 0.9}
            />
          ))}
        </Node>,
      )}
      {/* Phone */}
      <Rect x={320} y={-345} width={200} height={350} radius={32} fill="#0a1838" stroke="#ffffff66" lineWidth={5}>
        <Rect y={-153} width={70} height={12} radius={6} fill="#ffffff44" />
        <Txt
          y={-100}
          textAlign="center"
          text={'Seu app no\nmundo real'}
          lineHeight={28}
          fontFamily={FONT}
          fontWeight={700}
          fontSize={22}
          fill={WHITE}
        />
        {[0, 1, 2, 3].map(i => (
          <Rect
            x={i % 2 === 0 ? -45 : 45}
            y={-12 + Math.floor(i / 2) * 88}
            width={74}
            height={74}
            radius={18}
            fill={[CYAN, '#3b82f6', ORANGE, '#a78bfa'][i]}
          />
        ))}
      </Rect>
    </Node>
  );
}

function gear(x: number, y: number, r: number, color: string) {
  return (
    <Node x={x} y={y}>
      {Array.from({length: 8}, (_, i) => (
        <Rect rotation={i * 45} width={r * 0.42} height={r * 2.5} radius={6} fill={color} />
      ))}
      <Circle size={r * 2} fill={color} />
      <Circle size={r * 0.9} fill={NAVY} />
    </Node>
  );
}

function industryHero() {
  const bars = [0.35, 0.55, 0.45, 0.7, 0.62, 0.9];
  return (
    <Node>
      {screenFrame(
        <Node>
          <Rect y={-142} width={560} height={36} fill="#13244d" />
          <Txt x={-255} y={-142} offset={[-1, 0]} text="PRODUÇÃO" fontFamily={FONT} fontWeight={800} fontSize={18} fill={MUTED} letterSpacing={3} />
          {bars.map((h, i) => (
            <Rect
              x={-215 + i * 62}
              y={120}
              offset={[0, 1]}
              width={38}
              height={h * 200}
              radius={6}
              fill={i === bars.length - 1 ? ORANGE : CYAN}
              opacity={i === bars.length - 1 ? 1 : 0.85}
            />
          ))}
          <Line
            points={bars.map((h, i) => [-215 + i * 62, 120 - h * 200 - 26])}
            stroke={WHITE}
            lineWidth={4}
            opacity={0.8}
          />
          <Rect x={190} y={-60} width={130} height={70} radius={10} fill="#13244d">
            <Txt y={-12} text="OEE" fontFamily={FONT} fontWeight={700} fontSize={16} fill={MUTED} />
            <Rect y={14} width={90} height={10} radius={5} fill={ORANGE} />
          </Rect>
          <Rect x={190} y={30} width={130} height={70} radius={10} fill="#13244d">
            <Txt y={-12} text="ESTOQUE" fontFamily={FONT} fontWeight={700} fontSize={16} fill={MUTED} />
            <Rect y={14} width={70} height={10} radius={5} fill={CYAN} />
          </Rect>
        </Node>,
      )}
      {gear(330, -380, 72, CYAN)}
      {gear(420, -235, 48, ORANGE)}
      {gear(290, -190, 34, '#3b82f6')}
    </Node>
  );
}

/** Photo hero: clipped to the top area, tinted blue and faded into the background. */
function photoHero(photo: PhotoSpec, imgRef?: (img: Img) => void) {
  // The photo fully fades out at y = -70, just above the headline.
  return photoBand({photo, imgRef, width: POST_W, top: -POST_H / 2, bottom: -70});
}

// ---------- Poster ----------
export function poster(c: PosterContent, r: Partial<PosterRefs> = {}) {
  const w = POST_W / 2;
  const areaStep = 1010 / c.areas.length;

  // Checklist rows: multi-line items push the next ones down.
  let checkY = 525;
  const checklist = c.benefits.map(text => {
    const y = checkY;
    checkY += text.split('\n').length * 27 + 12;
    return {text, y};
  });

  return (
    <Node>
      {background(POST_W, POST_H)}

      {/* Hero */}
      <Node ref={r.hero}>
        {c.photo ? (
          photoHero(c.photo, r.photo)
        ) : (
          <Node>
            <Circle x={-140} y={-330} size={760} fill={CYAN} opacity={0.07} />
            {c.hero === 'web' ? webHero() : industryHero()}
          </Node>
        )}
      </Node>

      {/* Header */}
      {logo({ref: r.logo, x: -370, y: -615, scale: 0.42})}
      <Node ref={r.floating} x={320} y={-598}>
        {c.floating.map((word, i) => (
          <Txt
            y={i * 32 - (c.floating.length - 1) * 16}
            text={word}
            fontStyle="italic"
            fontFamily={FONT}
            fontWeight={800}
            fontSize={26}
            fill={CYAN}
          />
        ))}
      </Node>

      {/* Headline */}
      <Txt
        ref={r.headline1}
        y={-115}
        text={c.headline[0]}
        fontStyle="italic"
        fontFamily={FONT}
        fontWeight={900}
        fontSize={70}
        fill={WHITE}
      />
      <Txt
        ref={r.headline2}
        y={-10}
        text={c.headline[1]}
        fontStyle="italic"
        fontFamily={FONT}
        fontWeight={900}
        fontSize={c.headlineSize ?? 170}
        fill={CYAN}
        shadowColor={CYAN}
        shadowBlur={30}
      />
      <Node ref={r.subtitle}>
      <Line points={[[-w + 60, 95], [-265, 95]]} stroke={CYAN} lineWidth={3} opacity={0.7} />
      <Line points={[[265, 95], [w - 60, 95]]} stroke={CYAN} lineWidth={3} opacity={0.7} />
      <Txt
        y={95}
        text="CURSO SUPERIOR TECNOLÓGICO EM"
        letterSpacing={3}
        fontFamily={FONT}
        fontWeight={700}
        fontSize={22}
        fill={MUTED}
      />
      <Txt y={140} text={c.course} fontFamily={FONT} fontWeight={900} fontSize={50} fill={WHITE} />
      <Txt
        y={183}
        text="FATEC TAQUARITINGA"
        letterSpacing={4}
        fontFamily={FONT}
        fontWeight={700}
        fontSize={22}
        fill={MUTED}
      />
      </Node>

      {/* Areas */}
      {c.areas.map((area, i) => (
        <Node ref={r.areas} x={-505 + areaStep * (i + 0.5)} y={258}>
          <Rect width={84} height={84} radius={18} fill="#0d2350" stroke={CYAN} lineWidth={2.5}>
            {icon(area.icon, 46)}
          </Rect>
          <Txt
            y={78}
            textAlign="center"
            text={area.label}
            lineHeight={24}
            fontFamily={FONT}
            fontWeight={600}
            fontSize={19}
            fill={WHITE}
          />
        </Node>
      ))}

      {/* Orange banner */}
      <Node ref={r.banner} x={-125} y={440}>
      <Rect width={770} height={124} radius={20} fill={ORANGE}>
        <Circle x={-318} size={92} fill="#0b1f45">
          {icon(c.banner.icon, 52)}
        </Circle>
        <Txt
          x={-255}
          y={-26}
          offset={[-1, 0]}
          text={c.banner.title}
          fontFamily={FONT}
          fontWeight={900}
          fontSize={44}
          fill={WHITE}
        />
        <Txt
          x={-255}
          y={26}
          offset={[-1, 0]}
          text={c.banner.text}
          lineHeight={25}
          fontFamily={FONT}
          fontWeight={600}
          fontSize={20}
          fill={WHITE}
        />
      </Rect>
      </Node>
      <Node ref={r.side}>
      <Line points={[[285, 388], [285, 492]]} stroke={WHITE} lineWidth={2} opacity={0.6} />
      <Txt
        x={302}
        y={440}
        offset={[-1, 0]}
        text={c.banner.side}
        lineHeight={25}
        fontFamily={FONT}
        fontWeight={800}
        fontSize={19}
        fill={WHITE}
      />
      </Node>

      {/* Footer: enrollment */}
      <Node ref={r.enroll}>
        <Txt x={-505} y={540} offset={[-1, 0]} text="INSCRIÇÕES ABERTAS" fontFamily={FONT} fontWeight={900} fontSize={44} fill={WHITE} />
        <Txt x={-505} y={582} offset={[-1, 0]} text="Acesse:" fontFamily={FONT} fontWeight={600} fontSize={22} fill={MUTED} />
      </Node>
      <Rect ref={r.pill} x={-275} y={628} width={460} height={60} radius={14} fill={ORANGE}>
        <Txt text={SITE} fontFamily={FONT} fontWeight={800} fontSize={30} fill={WHITE} />
      </Rect>
      <SVG
        ref={r.cursor}
        x={-30}
        y={652}
        svg={`<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"><path d="M5 3l14 7-6 2-2 6z" fill="#ffffff" stroke="${NAVY}" stroke-width="1.5" stroke-linejoin="round"/></svg>`}
      />

      {/* Footer: checklist */}
      {checklist.map(({text, y}) => (
        <Node ref={r.checks} x={30} y={y}>
          <Rect width={28} height={28} radius={7} fill={CYAN}>
            <Line points={[[-7, 0], [-2, 5], [7, -5]]} stroke={NAVY} lineWidth={4} lineCap="round" lineJoin="round" />
          </Rect>
          <Txt
            x={26}
            y={(text.split('\n').length - 1) * 13.5}
            offset={[-1, 0]}
            text={text}
            lineHeight={27}
            fontFamily={FONT}
            fontWeight={600}
            fontSize={22}
            fill={WHITE}
          />
        </Node>
      ))}

      {/* Footer: tagline */}
      <Node ref={r.tagline}>
      <Line points={[[385, 520], [385, 650]]} stroke={WHITE} lineWidth={2} opacity={0.5} />
      <Txt
        x={400}
        y={585}
        offset={[-1, 0]}
        text={'MAIS\nQUE\nENSINO,\nNOVOS\nHORIZONTES'}
        lineHeight={25}
        fontFamily={FONT}
        fontWeight={700}
        fontSize={18}
        fill={MUTED}
      />
      </Node>
    </Node>
  );
}

// ---------- The two courses ----------
export const SISTEMAS_INTERNET: PosterContent = {
  floating: ['IDEIAS • CÓDIGO', 'PESSOAS', 'GRANDES CONQUISTAS'],
  hero: 'web',
  // Pixabay #1807505 (Pixabay Content License, free for commercial use).
  photo: {src: studentsPhoto, x: -60, y: -330, width: 1240},
  headline: ['CRIE O FUTURO DA', 'INTERNET'],
  course: 'SISTEMAS PARA INTERNET',
  areas: [
    {icon: 'code', label: 'Desenvolvimento\nWeb'},
    {icon: 'mobile', label: 'Aplicativos\nMobile'},
    {icon: 'design', label: 'Design de\nInterfaces\n(UX/UI)'},
    {icon: 'network', label: 'Redes e\nInfraestrutura'},
    {icon: 'social', label: 'Mídias Sociais\ne Marketing\nDigital'},
    {icon: 'database', label: 'Banco de\nDados'},
    {icon: 'layers', label: 'Programação\nFull Stack'},
  ],
  banner: {
    icon: 'rocket',
    title: 'MERCADO EM EXPANSÃO',
    text: 'Transforme ideias em aplicativos, sites e plataformas\ndigitais usadas por milhares de pessoas.',
    side: 'TECNOLOGIA\nINOVAÇÃO\nOPORTUNIDADES\nPARA O SEU AMANHÃ',
  },
  benefits: ['Ensino Superior Gratuito', 'Curso Presencial', 'Formação voltada ao\nmercado de tecnologia'],
};

export const GESTAO_PRODUCAO: PosterContent = {
  floating: ['TECNOLOGIA + GESTÃO', '+ PRODUÇÃO', 'MAIS EFICIÊNCIA'],
  hero: 'industry',
  // Unsplash N_nAAwnBDy8 (Unsplash License): the technician's face sits left of center.
  photo: {src: FOTO_TECNICO, x: 120, y: -300, width: 1340},
  headline: ['LIDERE A INDÚSTRIA DO', 'FUTURO'],
  course: 'GESTÃO DA PRODUÇÃO INDUSTRIAL',
  areas: [
    {icon: 'factory', label: 'Gestão da\nProdução'},
    {icon: 'box', label: 'Logística\nIntegrada'},
    {icon: 'truck', label: 'Supply\nChain'},
    {icon: 'gear', label: 'Automação\nIndustrial'},
    {icon: 'chip', label: 'Indústria\n4.0'},
    {icon: 'chart', label: 'Business\nIntelligence'},
  ],
  banner: {
    icon: 'chart',
    title: 'ALTA EMPREGABILIDADE',
    text: 'Planeje operações, otimize processos e impulsione\na competitividade das organizações.',
    side: 'DO SEU\nTALENTO\nPARA UM FUTURO\nSEM LIMITES',
  },
  benefits: ['Ensino Superior Gratuito', 'Curso Presencial', 'Formação alinhada à\nIndústria 4.0'],
};
