import {makeScene2D} from '@motion-canvas/2d';
import {poster, SISTEMAS_INTERNET} from '../poster';

// Single-frame scene: rendered as one PNG.
export default makeScene2D(function* (view) {
  view.add(poster(SISTEMAS_INTERNET));
  yield;
});
