import {Circle, Gradient, Img, Line, makeScene2D, Node, Rect, Txt} from '@motion-canvas/2d';
import salaProva from '../images/pexels-6683579-sala-prova.jpg';

// Post: courses of Fatec Taquaritinga + exam of the Vestibular 1st semester 2027.
// Self-contained on purpose: src/theme.tsx imports photos that are missing from the working tree.
// Dates from the official calendar (vestibular.fatec.sp.gov.br/calendario, checked on 24/11/2026):
// registration closed 16/11/2026; exam sites 09/12; exam 13/12 (Sunday) 13h, 5 hours; answer key 16/12.
// Courses from vestibular.fatec.sp.gov.br/unidades-cursos/escola.asp?c=163.

// Pexels #6683579 (Pexels License): students taking an exam; young man with glasses in focus
// at about (0.51, 0.47) of 1600x1067. Stock model: never present him as a Fatec student.
const FOTO = salaProva;

const W = 1080;
const H = 1350;
const NAVY = '#06122b';
const CARD = '#0d2350';
const CYAN = '#22c3ff';
const ORANGE = '#ff7a1a';
const RED = '#d71920';
const WHITE = '#ffffff';
const MUTED = '#a9c1e3';
const FONT = 'Segoe UI, Arial, sans-serif';

const DATAS = [
  {data: '09/12', label: 'Locais de prova'},
  {data: '13/12', label: 'Prova', destaque: true},
  {data: '16/12', label: 'Gabarito'},
];

const CURSOS = [
  {nome: 'Agronegócio', turno: 'Tarde  •  Noite'},
  {nome: 'Análise e Desenv.\nde Sistemas', turno: 'Tarde  •  Noite'},
  {nome: 'Engenharia\nde Produção', turno: 'Noite'},
  {nome: 'Gestão da Produção\nIndustrial', turno: 'Manhã  •  Noite'},
  {nome: 'Gestão\nEmpresarial', turno: 'EaD'},
  {nome: 'Sistemas para\nInternet', turno: 'Manhã'},
];

function fundo() {
  const w = W / 2;
  const h = H / 2;
  return (
    <Node>
      <Rect
        size={[W, H]}
        fill={
          new Gradient({
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
      <Node opacity={0.22}>
        {Array.from({length: 14}, (_, i) => (
          <Line points={[[-w + i * 90, -h], [-w + i * 90, h]]} stroke="#2b5aa8" lineWidth={2} />
        ))}
        {Array.from({length: 17}, (_, i) => (
          <Line points={[[-w, -h + i * 90], [w, -h + i * 90]]} stroke="#2b5aa8" lineWidth={2} />
        ))}
      </Node>
      <Circle size={900} x={-w + 60} y={h - 200} fill={ORANGE} opacity={0.06} />
    </Node>
  );
}

/** Photo clipped to [top, bottom], tinted, dark at the top (logo) and faded out at the bottom. */
function faixaFoto(top: number, bottom: number, fade: number) {
  const height = bottom - top;
  const cy = top + height / 2;
  const fotoW = 1300;
  return (
    <Rect y={cy} size={[W, height]} clip cache>
      <Img src={FOTO} x={0} y={-375 - cy} width={fotoW} />
      <Rect size={[W, height]} fill="#0b2a63" opacity={0.25} />
      <Rect
        y={-height / 2 + 150}
        size={[W, 300]}
        fill={
          new Gradient({
            from: [0, -150],
            to: [0, 150],
            stops: [
              {offset: 0, color: 'rgba(6,18,43,0.85)'},
              {offset: 1, color: 'rgba(6,18,43,0)'},
            ],
          })
        }
      />
      <Rect
        size={[W, height]}
        compositeOperation="destination-in"
        fill={
          new Gradient({
            from: [0, -height / 2],
            to: [0, height / 2],
            stops: [
              {offset: 0, color: 'rgba(0,0,0,1)'},
              {offset: (height - fade) / height, color: 'rgba(0,0,0,1)'},
              {offset: 1, color: 'rgba(0,0,0,0)'},
            ],
          })
        }
      />
    </Rect>
  );
}

function logo(x: number, y: number, scale: number) {
  return (
    <Node x={x} y={y} scale={scale}>
      <Rect width={430} height={170} radius={22} fill={RED}>
        <Txt text="Fatec" fontFamily={FONT} fontWeight={800} fontSize={124} fill={WHITE} />
      </Rect>
      <Txt y={135} text="Taquaritinga" fontFamily={FONT} fontWeight={600} fontSize={52} fill={WHITE} />
    </Node>
  );
}

export default makeScene2D(function* (view) {
  view.add(fundo());
  view.add(faixaFoto(-H / 2, -150, 230));
  view.add(logo(-W / 2 + 175, -H / 2 + 95, 0.5));

  // Tag
  view.add(
    <Rect y={-200} height={58} paddingLeft={30} paddingRight={30} radius={29} fill={CYAN} layout alignItems="center">
      <Txt text="VESTIBULAR FATEC  •  1º SEMESTRE 2027" fontFamily={FONT} fontWeight={800} fontSize={28} fill={NAVY} />
    </Rect>,
  );

  // Headline
  view.add(
    <Txt y={-120} text="PROVA EM" fontFamily={FONT} fontWeight={700} fontSize={56} fill={WHITE} />,
  );
  view.add(
    <Txt y={-35} text="13 DE DEZEMBRO" fontFamily={FONT} fontWeight={800} fontSize={108} fill={ORANGE} />,
  );
  view.add(
    <Txt
      y={42}
      text="Domingo, às 13h  •  5 horas de prova"
      fontFamily={FONT}
      fontWeight={600}
      fontSize={34}
      fill={MUTED}
    />,
  );

  // Timeline
  DATAS.forEach((d, i) => {
    const x = (i - 1) * 320;
    view.add(
      <Rect
        x={x}
        y={140}
        size={[300, 110]}
        radius={22}
        fill={d.destaque ? ORANGE : CARD}
        stroke={d.destaque ? ORANGE : CYAN}
        lineWidth={3}
      >
        <Txt y={-18} text={d.data} fontFamily={FONT} fontWeight={800} fontSize={44} fill={d.destaque ? NAVY : CYAN} />
        <Txt y={28} text={d.label} fontFamily={FONT} fontWeight={600} fontSize={26} fill={d.destaque ? NAVY : WHITE} />
      </Rect>,
    );
  });

  // Courses
  view.add(
    <Txt
      y={245}
      text="CURSOS SUPERIORES GRATUITOS"
      fontFamily={FONT}
      fontWeight={800}
      fontSize={34}
      letterSpacing={2}
      fill={CYAN}
    />,
  );
  CURSOS.forEach((c, i) => {
    const x = ((i % 3) - 1) * 330;
    const y = 335 + Math.floor(i / 3) * 140;
    view.add(
      <Rect x={x} y={y} size={[315, 126]} radius={20} fill={CARD} stroke="#2b5aa8" lineWidth={2}>
        <Txt
          y={-14}
          text={c.nome}
          textAlign="center"
          lineHeight={32}
          fontFamily={FONT}
          fontWeight={700}
          fontSize={c.nome.includes('\n') ? 27 : 30}
          fill={WHITE}
        />
        <Txt y={42} text={c.turno} fontFamily={FONT} fontWeight={600} fontSize={21} fill={ORANGE} />
      </Rect>,
    );
  });

  // Footer: registration is closed, so the call is "Próximo vestibular" (see CTA in src/theme.tsx).
  view.add(
    <Rect y={H / 2 - 50} size={[W, 100]} fill={RED} layout alignItems="center" justifyContent="center" gap={22}>
      <Txt text="PRÓXIMO VESTIBULAR" fontFamily={FONT} fontWeight={800} fontSize={32} fill={WHITE} />
      <Txt text="•" fontFamily={FONT} fontWeight={800} fontSize={32} fill={WHITE} />
      <Txt text="vestibular.fatec.sp.gov.br" fontFamily={FONT} fontWeight={600} fontSize={32} fill={WHITE} />
    </Rect>,
  );

  yield;
});
