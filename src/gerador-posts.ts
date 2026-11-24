import {makeProject} from '@motion-canvas/core';
import posts from './scenes/gerador-posts?scene';

// Generated feed posts (1080x1350): one PNG per item of src/gen/fila-posts.json.
// Fill the queue with tools/gerar.py, then RENDER (image sequence, 1 fps).
export default makeProject({
  scenes: [posts],
});
