import {makeProject} from '@motion-canvas/core';
import matricula from './scenes/video-matricula?scene';
import audio from './audio/roteiro-matricula.mix.wav';

// Vertical Reels video about enrollment (matrícula), narrated in pt-BR over an
// original track. Dates: Vestibular Fatec, 1st semester 2026. To rebuild the audio:
//   .venv\Scripts\python.exe tools\narracao.py src\audio\roteiro-matricula.json
//   .venv\Scripts\python.exe tools\musica.py 52 src\audio\musica-matricula.wav 108
//   .venv\Scripts\python.exe tools\mixar.py src\audio\roteiro-matricula.wav src\audio\musica-matricula.wav src\audio\roteiro-matricula.mix.wav 0.42
export default makeProject({
  scenes: [matricula],
  audio,
});
