import {makeProject} from '@motion-canvas/core';
import vestibularDezembro from './scenes/post-vestibular-dezembro?scene';

// Single post: courses + exam on 13/12/2026 (Vestibular 1st semester 2027).
// Kept apart from src/post.ts, whose scenes are missing from the working tree.
export default makeProject({
  scenes: [vestibularDezembro],
});
