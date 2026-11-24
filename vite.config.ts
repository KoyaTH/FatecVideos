import {defineConfig} from 'vite';
import motionCanvas from '@motion-canvas/vite-plugin';
import ffmpeg from '@motion-canvas/ffmpeg';

export default defineConfig({
  plugins: [
    motionCanvas({
      // Editor projects: http://localhost:9000/src/<name>
      project: [
        './src/post-dezembro.ts',
        // Automatic generator (tools/gerar.py fills the queues in src/gen/).
        './src/gerador-posts.ts',
        './src/gerador-reels.ts',
        // './src/matricula-video.ts': its scene (src/scenes/video-matricula.tsx) was lost;
        // re-add this line after rebuilding it with the 2027 enrollment dates.
      ],
    }),
    ffmpeg(),
  ],
});
