import {makeProject} from '@motion-canvas/core';
import sistemasInternet from './scenes/video-sistemas-internet?scene';
import audio from './audio/roteiro-sistemas-internet.mix.wav';

// Feed video (4:5) built from the single post, with pt-BR narration over an
// original background track. To rebuild the audio:
//   .venv\Scripts\python.exe tools\narracao.py src\audio\roteiro-sistemas-internet.json
//   .venv\Scripts\python.exe tools\musica.py <total from tempos.json + 1.25> src\audio\musica-tech.wav 112
//   .venv\Scripts\python.exe tools\mixar.py src\audio\roteiro-sistemas-internet.wav src\audio\musica-tech.wav src\audio\roteiro-sistemas-internet.mix.wav
export default makeProject({
  scenes: [sistemasInternet],
  audio,
});
