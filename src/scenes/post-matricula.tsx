import {makeScene2D} from '@motion-canvas/2d';
import {matriculaPost} from '../matricula';

// Single-frame scene: rendered as one PNG.
export default makeScene2D(function* (view) {
  view.add(matriculaPost());
  yield;
});
