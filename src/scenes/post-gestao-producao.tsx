import {makeScene2D} from '@motion-canvas/2d';
import {GESTAO_PRODUCAO, poster} from '../poster';

// Single-frame scene: rendered as one PNG.
export default makeScene2D(function* (view) {
  view.add(poster(GESTAO_PRODUCAO));
  yield;
});
