import {makeProject} from '@motion-canvas/core';
import sistemasInternet from './scenes/post-sistemas-internet?scene';
import gestaoProducao from './scenes/post-gestao-producao?scene';
import matricula from './scenes/post-matricula?scene';
import exameData from './scenes/post-exame-data?scene';
import exameChecklist from './scenes/post-exame-checklist?scene';

// Single feed posts (one PNG per scene, grouped by scene name in output/post/).
export default makeProject({
  scenes: [sistemasInternet, gestaoProducao, matricula, exameData, exameChecklist],
});
