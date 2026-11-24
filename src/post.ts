import {makeProject} from '@motion-canvas/core';
import sistemasInternet from './scenes/post-sistemas-internet?scene';
import gestaoProducao from './scenes/post-gestao-producao?scene';

// Single feed posts (one PNG per scene, grouped by scene name in output/post/).
export default makeProject({
  scenes: [sistemasInternet, gestaoProducao],
});
