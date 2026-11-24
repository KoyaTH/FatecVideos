// What the generator renders. tools/gerar.py writes these into src/gen/fila-*.json.

export type Estilo = 'faixa' | 'cheia' | 'dividido' | 'numero' | 'lista' | 'polaroid';
export type Paleta = 'azul' | 'laranja' | 'vermelho' | 'claro';
export type Fundo = 'grade' | 'diagonal' | 'circulos' | 'liso';
export type Alinhamento = 'esquerda' | 'centro';
export type Animacao = 'subir' | 'pop' | 'lado' | 'fade';

export interface PostSpec {
  id: string;
  estilo: Estilo;
  paleta: Paleta;
  fundo: Fundo;
  alinhamento: Alinhamento;
  /** Key in FOTOS (src/gen/fotos.ts). */
  foto: string;
  /** Small tag at the top right. */
  selo?: string;
  /** Small line above the title. */
  chamada?: string;
  titulo: string;
  /** Big highlighted word or number (e.g. "13/12", "GRÁTIS"). */
  destaque?: string;
  texto?: string;
  itens?: string[];
  /** Footer line; defaults to the vestibular site. */
  rodape?: string;
  /** Tilt for the polaroid style, -1 or 1. */
  lado?: number;
}

export interface ReelsSlide extends PostSpec {
  /** Seconds on screen (ignored when narration timings exist). */
  duracao?: number;
}

export interface ReelsSpec {
  animacao: Animacao;
  slides: ReelsSlide[];
  /** Start/duration of each slide in seconds, from the narration (tools/gerar.py). */
  tempos?: {start: number; duration: number}[];
  total: number;
}
