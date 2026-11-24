import {Circle, Line, Node, Rect, SVG, Txt} from '@motion-canvas/2d';
import {createRef, createRefArray} from '@motion-canvas/core';
import {
  background,
  CARD,
  CYAN,
  FONT,
  FOTO_ESTUDANTES,
  logo,
  MUTED,
  NAVY,
  ORANGE,
  photoBand,
  PhotoSpec,
  SITE,
  WHITE,
} from './theme';

/** Light red for warnings (the brand RED is too dark on navy). */
export const ALERT = '#ff6b6b';

// ---------- Matrícula content ----------
// Data from the Fatec Vestibular, 1st semester 2026 (published 19/01/2026):
// Tribuna de Jundiaí and ABC do ABC. Update the dates for each new edition.
export const EDICAO = 'VESTIBULAR FATEC · 1º SEMESTRE 2026';

export const CHAMADAS = [
  {title: '1ª CHAMADA', lista: 'Lista: 19/01 às 15h', matricula: '20 a 22/01'},
  {title: '2ª CHAMADA', lista: 'Lista: 26/01 às 15h', matricula: '27 a 29/01'},
];

export const DOCUMENTOS = [
  'Histórico e certificado\ndo Ensino Médio',
  'RG ou CIN\n(CNH não é aceita)',
  'CPF',
  'Foto 3x4 recente',
  'Quitação militar\n(homens de 18 a 45 anos)',
  'Comprovante de escola\npública (se usou o bônus)',
];

export const SIGA = 'siga.cps.sp.gov.br';

// ---------- Icons ----------
const svg = (body: string, size: number, color = '#ffffff') =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24"><g fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${body}</g></svg>`;

export const MC_ICONS = {
  laptop: '<rect x="4" y="4" width="16" height="11" rx="1.5"/><path d="M2 19h20l-2-4H4z"/>',
  calendar:
    '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/><path d="M8 14h2M14 14h2M8 17h2"/>',
  alert: '<path d="M12 3l10 18H2z"/><path d="M12 10v5"/><circle cx="12" cy="18" r="0.6"/>',
  file: '<path d="M6 2h9l5 5v15H6z"/><path d="M15 2v5h5M9 13h7M9 17h5"/>',
};

export function mcIcon(name: keyof typeof MC_ICONS, size: number, color = '#ffffff') {
  return <SVG svg={svg(MC_ICONS[name], size, color)} />;
}

/** Small cyan check box used in the document list. */
export function smallCheck(size = 30, end = 1, lineRef?: (l: Line) => void) {
  const k = size / 28;
  return (
    <Rect width={size} height={size} radius={7 * k} fill={CYAN}>
      <Line
        ref={lineRef}
        points={[
          [-7 * k, 0],
          [-2 * k, 5 * k],
          [7 * k, -5 * k],
        ]}
        stroke={NAVY}
        lineWidth={4 * k}
        lineCap="round"
        lineJoin="round"
        end={end}
      />
    </Rect>
  );
}

// ---------- Post (1080x1350) ----------
const W = 1080;
const H = 1350;

// The three students sit between the header and the headline.
const POST_PHOTO: PhotoSpec = {src: FOTO_ESTUDANTES, x: -75, y: -300, width: 1600};

export function makeMatriculaPostRefs() {
  return {
    hero: createRef<Node>(),
    logo: createRef<Node>(),
    edition: createRef<Node>(),
    headline1: createRef<Txt>(),
    headline2: createRef<Txt>(),
    subtitle: createRef<Node>(),
    calls: createRefArray<Node>(),
    docsTitle: createRef<Node>(),
    docs: createRefArray<Node>(),
    online: createRef<Node>(),
    footer: createRef<Node>(),
  };
}
export type MatriculaPostRefs = ReturnType<typeof makeMatriculaPostRefs>;

export function matriculaPost(r: Partial<MatriculaPostRefs> = {}) {
  return (
    <Node>
      {background(W, H)}

      {/* Photo with people */}
      <Node ref={r.hero}>
        {photoBand({photo: POST_PHOTO, width: W, top: -H / 2, bottom: -70, fade: 320})}
      </Node>

      {/* Header */}
      {logo({ref: r.logo, x: -370, y: -615, scale: 0.42})}
      <Node ref={r.edition} x={505} y={-612}>
        <Txt
          offset={[1, 0]}
          y={-16}
          text="VESTIBULAR FATEC"
          letterSpacing={3}
          fontFamily={FONT}
          fontWeight={800}
          fontSize={24}
          fill={CYAN}
        />
        <Txt
          offset={[1, 0]}
          y={16}
          text="1º SEMESTRE 2026"
          letterSpacing={3}
          fontFamily={FONT}
          fontWeight={700}
          fontSize={24}
          fill={WHITE}
        />
      </Node>

      {/* Headline */}
      <Txt
        ref={r.headline1}
        y={-148}
        text="PASSOU NO VESTIBULAR?"
        fontStyle="italic"
        fontFamily={FONT}
        fontWeight={900}
        fontSize={62}
        fill={WHITE}
      />
      <Txt
        ref={r.headline2}
        y={-45}
        text="MATRÍCULA"
        fontStyle="italic"
        fontFamily={FONT}
        fontWeight={900}
        fontSize={150}
        fill={CYAN}
        shadowColor={CYAN}
        shadowBlur={30}
      />
      <Node ref={r.subtitle}>
        <Line points={[[-480, 52], [-310, 52]]} stroke={CYAN} lineWidth={3} opacity={0.7} />
        <Line points={[[310, 52], [480, 52]]} stroke={CYAN} lineWidth={3} opacity={0.7} />
        <Txt
          y={52}
          text="GARANTA SUA VAGA"
          letterSpacing={6}
          fontFamily={FONT}
          fontWeight={800}
          fontSize={34}
          fill={WHITE}
        />
      </Node>

      {/* Calendar: the two calls */}
      {CHAMADAS.map((c, i) => (
        <Node ref={r.calls} x={i === 0 ? -255 : 255} y={168}>
          <Rect width={490} height={150} radius={22} fill={CARD} stroke={CYAN} lineWidth={2.5} />
          <Rect x={-140} y={-46} width={180} height={44} radius={12} fill={ORANGE}>
            <Txt text={c.title} fontFamily={FONT} fontWeight={900} fontSize={24} fill={WHITE} />
          </Rect>
          <Txt
            x={-40}
            y={-46}
            offset={[-1, 0]}
            text={c.lista}
            fontFamily={FONT}
            fontWeight={600}
            fontSize={22}
            fill={MUTED}
          />
          <Txt
            x={-215}
            y={12}
            offset={[-1, 0]}
            text="MATRÍCULA"
            letterSpacing={2}
            fontFamily={FONT}
            fontWeight={700}
            fontSize={20}
            fill={MUTED}
          />
          <Txt
            x={-215}
            y={44}
            offset={[-1, 0]}
            text={c.matricula}
            fontFamily={FONT}
            fontWeight={900}
            fontSize={44}
            fill={WHITE}
          />
          <Node x={185} y={28}>
            {mcIcon('calendar', 60, CYAN)}
          </Node>
        </Node>
      ))}

      {/* Documents */}
      <Node ref={r.docsTitle} x={-505} y={272}>
        <Txt
          offset={[-1, 0]}
          text="DOCUMENTOS"
          fontFamily={FONT}
          fontWeight={900}
          fontSize={36}
          fill={WHITE}
        />
        <Txt
          x={278}
          offset={[-1, 0]}
          text="digitalizados em PDF, JPG ou PNG"
          fontFamily={FONT}
          fontWeight={600}
          fontSize={22}
          fill={MUTED}
        />
      </Node>
      {DOCUMENTOS.map((text, i) => {
        const lines = text.split('\n').length;
        return (
          <Node ref={r.docs} x={i % 2 === 0 ? -490 : 30} y={322 + Math.floor(i / 2) * 58}>
            {smallCheck(30)}
            <Txt
              x={28}
              y={(lines - 1) * 12}
              offset={[-1, 0]}
              text={text}
              lineHeight={25}
              fontFamily={FONT}
              fontWeight={600}
              fontSize={22}
              fill={WHITE}
            />
          </Node>
        );
      })}

      {/* Online enrollment */}
      <Node ref={r.online} y={560}>
        <Rect width={1010} height={118} radius={22} fill={ORANGE}>
          <Circle x={-438} size={88} fill="#0b1f45">
            {mcIcon('laptop', 50)}
          </Circle>
          <Txt
            x={-378}
            y={-24}
            offset={[-1, 0]}
            text="MATRÍCULA 100% ON-LINE"
            fontFamily={FONT}
            fontWeight={900}
            fontSize={40}
            fill={WHITE}
          />
          <Txt
            x={-378}
            y={24}
            offset={[-1, 0]}
            text={`pelo SIGA (${SIGA}) · login com CPF e data de nascimento`}
            fontFamily={FONT}
            fontWeight={600}
            fontSize={21}
            fill={WHITE}
          />
        </Rect>
      </Node>

      {/* Footer */}
      <Node ref={r.footer} y={648}>
        <Node x={-505}>
          <Node x={14}>{mcIcon('alert', 30, ALERT)}</Node>
          <Txt
            x={40}
            offset={[-1, 0]}
            text="Sem os documentos no prazo, a vaga vai para o próximo."
            fontFamily={FONT}
            fontWeight={700}
            fontSize={20}
            fill={WHITE}
          />
        </Node>
        <Txt
          x={505}
          offset={[1, 0]}
          text={SITE}
          fontFamily={FONT}
          fontWeight={800}
          fontSize={22}
          fill={CYAN}
        />
      </Node>
    </Node>
  );
}
