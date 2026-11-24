import {Line, Node, Rect, Txt} from '@motion-canvas/2d';
import {
  background,
  CARD,
  CYAN,
  FONT,
  FOTO_TURMA,
  logo,
  MUTED,
  NAVY,
  ORANGE,
  photoBand,
  SITE,
  WHITE,
} from './theme';
import {ALERT, mcIcon, smallCheck} from './matricula';

// ---------- Exam content ----------
// Source: vestibular.fatec.sp.gov.br (Calendário and Dúvidas Frequentes › Exame), checked 24/11/2026.
// Vestibular Fatec, 1st semester 2027. Update for each new edition.
export const EDICAO_EXAME = ['VESTIBULAR FATEC', '1º SEMESTRE 2027'];
export const DATA_PROVA = '13/12';

export const LINHA_DO_TEMPO = [
  {data: '09/12', hora: '15h', texto: 'Local de prova na Área do Candidato', destaque: false},
  {data: '13/12', hora: '13h', texto: 'Prova: redação + 60 questões', destaque: true},
  {data: '16/12', hora: '15h', texto: 'Gabarito oficial', destaque: false},
  {data: '18/01', hora: '15h', texto: 'Resultado e lista da 1ª chamada', destaque: false},
];

export const LEVAR = ['Caneta preta ou azul', 'Lápis nº 2 e borracha', 'Documento original\ncom foto'];
export const PROIBIDO = ['Celular (desligado,\nsem alarme)', 'Smartwatch e\ncalculadora', 'Boné, chapéu e\nóculos escuros'];
export const LEMBRETES = [
  'Redação e respostas\nsó a caneta',
  'Saída só a partir\ndas 15h30',
  'Documento digital só\nno app oficial',
];

const W = 1080;
const H = 1350;

function header() {
  return (
    <Node>
      {logo({x: -370, y: -615, scale: 0.42})}
      <Node x={505} y={-612}>
        {EDICAO_EXAME.map((line, i) => (
          <Txt
            offset={[1, 0]}
            y={i === 0 ? -16 : 16}
            text={line}
            letterSpacing={3}
            fontFamily={FONT}
            fontWeight={i === 0 ? 800 : 700}
            fontSize={24}
            fill={i === 0 ? CYAN : WHITE}
          />
        ))}
      </Node>
    </Node>
  );
}

/** Red-ish box with an X, mirror of smallCheck for the "not allowed" list. */
function smallCross(size = 30) {
  const k = size / 28;
  return (
    <Rect width={size} height={size} radius={7 * k} fill={ALERT}>
      <Line points={[[-6 * k, -6 * k], [6 * k, 6 * k]]} stroke={NAVY} lineWidth={4 * k} lineCap="round" />
      <Line points={[[6 * k, -6 * k], [-6 * k, 6 * k]]} stroke={NAVY} lineWidth={4 * k} lineCap="round" />
    </Rect>
  );
}

function siteFooter(y: number, label: string) {
  return (
    <Node y={y}>
      <Txt x={-505} offset={[-1, 0]} text={label} fontFamily={FONT} fontWeight={600} fontSize={24} fill={MUTED} />
      <Txt x={505} offset={[1, 0]} text={SITE} fontFamily={FONT} fontWeight={800} fontSize={28} fill={CYAN} />
    </Node>
  );
}

// ---------- Post 1: exam date and timeline ----------
export function examePostData() {
  return (
    <Node>
      {background(W, H)}
      {photoBand({
        photo: {src: FOTO_TURMA, x: -12, y: -349, width: 1500},
        width: W,
        top: -H / 2,
        bottom: -170,
        fade: 300,
      })}
      {header()}

      <Txt
        y={-150}
        text="DIA DA PROVA"
        fontStyle="italic"
        fontFamily={FONT}
        fontWeight={900}
        fontSize={74}
        fill={WHITE}
      />
      <Txt
        y={-25}
        text={DATA_PROVA}
        fontStyle="italic"
        fontFamily={FONT}
        fontWeight={900}
        fontSize={190}
        fill={CYAN}
        shadowColor={CYAN}
        shadowBlur={30}
      />
      <Line points={[[-480, 90], [-290, 90]]} stroke={CYAN} lineWidth={3} opacity={0.7} />
      <Line points={[[290, 90], [480, 90]]} stroke={CYAN} lineWidth={3} opacity={0.7} />
      <Txt
        y={90}
        text="DOMINGO  •  13H  •  5 HORAS"
        letterSpacing={4}
        fontFamily={FONT}
        fontWeight={800}
        fontSize={30}
        fill={WHITE}
      />

      {LINHA_DO_TEMPO.map((item, i) => (
        <Node y={170 + i * 80}>
          <Rect
            width={1010}
            height={68}
            radius={16}
            fill={item.destaque ? '#3a2410' : CARD}
            stroke={item.destaque ? ORANGE : CYAN}
            lineWidth={item.destaque ? 3 : 1.5}
          />
          <Txt
            x={-480}
            offset={[-1, 0]}
            text={item.data}
            fontFamily={FONT}
            fontWeight={900}
            fontSize={36}
            fill={item.destaque ? ORANGE : CYAN}
          />
          <Txt
            x={-370}
            offset={[-1, 0]}
            text={item.hora}
            fontFamily={FONT}
            fontWeight={700}
            fontSize={24}
            fill={MUTED}
          />
          <Txt
            x={-290}
            offset={[-1, 0]}
            text={item.texto}
            fontFamily={FONT}
            fontWeight={item.destaque ? 800 : 600}
            fontSize={30}
            fill={WHITE}
          />
        </Node>
      ))}

      <Rect y={530} width={1010} height={110} radius={22} fill={ORANGE}>
        <Rect x={-438} width={84} height={84} radius={42} fill="#0b1f45">
          {mcIcon('alert', 46)}
        </Rect>
        <Txt
          x={-380}
          y={-22}
          offset={[-1, 0]}
          text="PORTÕES FECHAM ÀS 13H"
          fontFamily={FONT}
          fontWeight={900}
          fontSize={40}
          fill={WHITE}
        />
        <Txt
          x={-380}
          y={24}
          offset={[-1, 0]}
          text="Abrem às 12h. Chegue 1 hora antes: depois das 13h, ninguém entra."
          fontFamily={FONT}
          fontWeight={600}
          fontSize={21}
          fill={WHITE}
        />
      </Rect>

      {siteFooter(635, 'Consulte seu local de prova em:')}
    </Node>
  );
}

// ---------- Post 2: what to bring / what is not allowed ----------
function listCard(x: number, title: string, color: string, items: string[], mark: () => Node) {
  return (
    <Node x={x} y={185}>
      <Rect width={495} height={360} radius={24} fill={CARD} stroke={color} lineWidth={2.5} />
      <Rect y={-150} width={495} height={60} radius={[24, 24, 0, 0]} fill={color}>
        <Txt text={title} fontFamily={FONT} fontWeight={900} fontSize={32} fill={NAVY} />
      </Rect>
      {items.map((text, i) => {
        const lines = text.split('\n').length;
        return (
          <Node x={-210} y={-62 + i * 92}>
            <Node>{mark()}</Node>
            <Txt
              x={30}
              y={(lines - 1) * 14}
              offset={[-1, 0]}
              text={text}
              lineHeight={30}
              fontFamily={FONT}
              fontWeight={700}
              fontSize={27}
              fill={WHITE}
            />
          </Node>
        );
      })}
    </Node>
  );
}

export function examePostChecklist() {
  return (
    <Node>
      {background(W, H)}
      {photoBand({
        photo: {src: FOTO_TURMA, x: -185, y: -345, width: 2200},
        width: W,
        top: -H / 2,
        bottom: -200,
        fade: 280,
      })}
      {header()}

      <Txt
        y={-215}
        text={`PROVA ${DATA_PROVA}  •  13H`}
        fontStyle="italic"
        fontFamily={FONT}
        fontWeight={900}
        fontSize={52}
        fill={WHITE}
      />
      <Txt
        y={-100}
        text="CHECKLIST"
        fontStyle="italic"
        fontFamily={FONT}
        fontWeight={900}
        fontSize={150}
        fill={CYAN}
        shadowColor={CYAN}
        shadowBlur={30}
      />

      {listCard(-257, 'LEVE', CYAN, LEVAR, () => smallCheck(32))}
      {listCard(257, 'NÃO PODE', ALERT, PROIBIDO, () => smallCross(32))}

      {LEMBRETES.map((text, i) => (
        <Node x={-340 + i * 340} y={423}>
          <Rect width={330} height={84} radius={18} fill="#0d2350" stroke={CYAN} lineWidth={1.5} opacity={0.95} />
          <Txt
            textAlign="center"
            text={text}
            lineHeight={27}
            fontFamily={FONT}
            fontWeight={700}
            fontSize={22}
            fill={WHITE}
          />
        </Node>
      ))}

      <Rect y={540} width={1010} height={100} radius={22} fill={ORANGE}>
        <Rect x={-438} width={76} height={76} radius={38} fill="#0b1f45">
          {mcIcon('calendar', 42)}
        </Rect>
        <Txt
          x={-385}
          y={-20}
          offset={[-1, 0]}
          text="PORTÕES: 12H ÀS 13H"
          fontFamily={FONT}
          fontWeight={900}
          fontSize={38}
          fill={WHITE}
        />
        <Txt
          x={-385}
          y={22}
          offset={[-1, 0]}
          text="Local de prova na Área do Candidato a partir de 09/12, às 15h"
          fontFamily={FONT}
          fontWeight={600}
          fontSize={21}
          fill={WHITE}
        />
      </Rect>

      {siteFooter(635, 'Tudo sobre a prova em:')}
    </Node>
  );
}
