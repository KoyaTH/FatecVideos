import {makeProject} from '@motion-canvas/core';
import reels from './scenes/gerador-reels?scene';
import audio from './gen/reels-audio.wav';

// Generated Reels (1080x1920) from src/gen/fila-reels.json, with the narration +
// music mix written by tools/gerar.py to src/gen/reels-audio.wav.
export default makeProject({
  scenes: [reels],
  audio,
});
