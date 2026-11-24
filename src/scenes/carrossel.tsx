import {makeScene2D, Node, Rect, Txt} from '@motion-canvas/2d';
import {createRefArray, usePlayback} from '@motion-canvas/core';
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
  logo,
  MUTED,
  ORANGE,
  photoBand,
  SITE,
  WHITE,
} from '../theme';

// Instagram feed carousel, 4:5 portrait: 1080x1350, origin at the center.
// Each slide is held for 1 second; rendering at 1 fps gives one PNG per slide
// (output/carrossel/000000.png = slide 1 ... 000004.png = slide 5).
const W = 1080;
const H = 1350;
const COUNT = 5;

function title(text: string, y: number, color = WHITE, size = 140, italic = false) {
  return (
    <Txt
      y={y}
      text={text}
      fontStyle={italic ? 'italic' : 'normal'}
      fontFamily={FONT}
      fontWeight={900}
      fontSize={size}
      fill={color}
    />
  );
}

/** Logo, page counter and progress dots shared by every slide. */
function chrome(index: number) {
  return (
    <Node>
      {logo({x: -370, y: -600, scale: 0.42})}
      <Rect x={420} y={-600} width={120} height={58} radius={29} fill="#ffffff22">
        <Txt
          text={`${index + 1}/${COUNT}`}
          fontFamily={FONT}
          fontWeight={700}
          fontSize={30}
          fill={WHITE}
        />
      </Rect>
      {Array.from({length: COUNT}, (_, i) => (
        <Rect
          x={(i - (COUNT - 1) / 2) * 34 + (i < index ? -12 : i > index ? 12 : 0)}
          y={620}
          width={i === index ? 46 : 14}
          height={14}
          radius={7}
          fill={i === index ? CYAN : '#ffffff55'}
        />
      ))}
      {index < COUNT - 1 && (
        <Txt
          x={470}
          y={620}
          offset={[1, 0]}
          text="arraste ›"
          fontFamily={FONT}
          fontWeight={600}
          fontSize={30}
          fill={MUTED}
        />
      )}
    </Node>
  );
}

function cover() {
  return (
    <Node>
      {photoBand({
        photo: {src: FOTO_TECNICO, x: 120, y: -330, width: 1400},
        width: W,
        top: -H / 2,
        bottom: -150,
        fade: 280,
      })}
      <Node y={140}>
      <Txt
        y={-400}
        text="VESTIBULAR FATEC"
        letterSpacing={10}
        fontFamily={FONT}
        fontWeight={700}
        fontSize={44}
        fill={CYAN}
      />
      {title('LIDERE A', -240)}
      {title('INDÚSTRIA', -85, CYAN)}
      {title('DO FUTURO', 70)}
      <Rect y={260} width={880} height={120} radius={60} fill={ORANGE}>
        <Txt
          text="Gestão da Produção Industrial"
          fontFamily={FONT}
          fontWeight={800}
          fontSize={52}
          fill={WHITE}
        />
      </Rect>
      <Txt
        y={385}
        text="Inscrições abertas  •  Ensino superior gratuito"
        fontFamily={FONT}
        fontWeight={600}
        fontSize={38}
        fill={MUTED}
      />
      </Node>
    </Node>
  );
}

function course() {
  return (
    <Node>
      {title('GESTÃO DA PRODUÇÃO', -420, WHITE, 78)}
      {title('INDUSTRIAL', -295, CYAN, 140, true)}
      <Txt
        y={-110}
        text="EM APENAS"
        letterSpacing={8}
        fontFamily={FONT}
        fontWeight={700}
        fontSize={48}
        fill={MUTED}
      />
      {title('3 ANOS', 20, ORANGE, 180)}
      {[0, 1, 2].map(i => (
        <Node x={-300 + i * 300} y={190}>
          <Rect width={270} height={28} radius={14} fill={ORANGE} />
          <Txt
            y={60}
            text={`${i + 1}º ano`}
            fontFamily={FONT}
            fontWeight={600}
            fontSize={36}
            fill={WHITE}
          />
        </Node>
      ))}
      <Txt
        y={420}
        textAlign="center"
        text={'e você está pronto para atuar como\ngestor de produção industrial'}
        lineHeight={64}
        fontFamily={FONT}
        fontWeight={600}
        fontSize={46}
        fill={WHITE}
      />
    </Node>
  );
}

function areas() {
  return (
    <Node>
      {title('VOCÊ VAI DOMINAR', -430, WHITE, 86)}
      {AREAS.map((label, i) =>
        areaCard(label, i, {
          x: i % 2 === 0 ? -245 : 245,
          y: -230 + Math.floor(i / 2) * 250,
        }),
      )}
      <Txt
        y={480}
        text="Formação alinhada à Indústria 4.0"
        fontFamily={FONT}
        fontWeight={600}
        fontSize={40}
        fill={MUTED}
      />
    </Node>
  );
}

function employability() {
  return (
    <Node>
      <Rect y={-420} width={960} height={150} radius={26} fill={ORANGE}>
        <Txt
          text="ALTA EMPREGABILIDADE"
          fontFamily={FONT}
          fontWeight={900}
          fontSize={72}
          fill={WHITE}
        />
      </Rect>
      <Txt
        y={-240}
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
        <Node x={-400} y={-10 + i * 135}>
          {checkIcon()}
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
    </Node>
  );
}

function callToAction() {
  return (
    <Node>
      {photoBand({
        photo: {src: FOTO_OPERADORA, x: -200, y: -250, width: 1500},
        width: W,
        top: -H / 2,
        bottom: -150,
        fade: 280,
      })}
      <Node y={150}>
      {title('INSCRIÇÕES', -360)}
      {title('ABERTAS', -210, CYAN)}
      <Txt
        y={-30}
        text="Inscreva-se no vestibular:"
        fontFamily={FONT}
        fontWeight={600}
        fontSize={50}
        fill={MUTED}
      />
      <Rect y={100} width={960} height={140} radius={70} fill={ORANGE}>
        <Txt text={SITE} fontFamily={FONT} fontWeight={800} fontSize={60} fill={WHITE} />
      </Rect>
      <Txt
        y={280}
        text="Gratuito  •  Presencial  •  3 anos"
        fontFamily={FONT}
        fontWeight={700}
        fontSize={46}
        fill={WHITE}
      />
      <Txt
        y={380}
        text="#VestibularFatec  #Fatectq  #GPI"
        fontFamily={FONT}
        fontWeight={700}
        fontSize={38}
        fill={CYAN}
      />
      </Node>
    </Node>
  );
}

export default makeScene2D(function* (view) {
  view.add(background(W, H));

  const slides = createRefArray<Node>();
  [cover, course, areas, employability, callToAction].forEach((build, i) =>
    view.add(
      <Node ref={slides} opacity={i === 0 ? 1 : 0}>
        {build()}
        {chrome(i)}
      </Node>,
    ),
  );

  // Hold each slide for exactly one second worth of frames. (waitFor(1) would
  // produce zero frames at 1 fps, because it stops one frame early.)
  const framesPerSlide = Math.max(1, Math.round(1 / usePlayback().framesToSeconds(1)));
  for (let i = 0; i < COUNT; i++) {
    slides.forEach((slide, j) => slide.opacity(j === i ? 1 : 0));
    for (let f = 0; f < framesPerSlide; f++) yield;
  }
});
