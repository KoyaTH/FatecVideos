import {makeScene2D} from '@motion-canvas/2d';
import {examePostData} from '../exame';

// Single-frame scene: rendered as one PNG.
export default makeScene2D(function* (view) {
  view.add(examePostData());
  yield;
});
