---
name: motion-canvas
description: Create, edit and render programmatic animations/videos with Motion Canvas (TypeScript + JSX, @motion-canvas/core and @motion-canvas/2d). Use whenever the user mentions Motion Canvas, motion-canvas.io, makeScene2D, or wants code-driven animated videos/explainers (e.g. for YouTube) built with TypeScript.
---

# Motion Canvas

Motion Canvas is a TypeScript library for code-driven animations. Scenes are generator functions; a Vite-based editor previews them in the browser and renders frames or video.

## New project

Requires Node.js 16+ (check with `node -v`).

```bash
npm init @motion-canvas@latest
# if that fails (old npm < 8.15.1): npm exec @motion-canvas/create@latest
cd <project-name>
npm install
npm start          # editor at http://localhost:9000/
```

Scaffold prompts: project name, TypeScript (recommended) or JS, exporters (Image sequence built in; pick **Video (FFmpeg)** to get MP4 export).

Run `npm start` in the background (it is a long-running dev server) and tell the user to open http://localhost:9000/. In the editor, pressing `0` recenters the preview.

## Project structure

- `src/project.ts` – declares scenes. The `?scene` import suffix is **required**:
  ```ts
  import {makeProject} from '@motion-canvas/core';
  import example from './scenes/example?scene';

  export default makeProject({
    scenes: [example],
  });
  ```
- `src/scenes/*.tsx` – one file per scene; add new scenes to the `scenes` array in order.
- `vite.config.ts` – Vite plugins:
  ```ts
  import {defineConfig} from 'vite';
  import motionCanvas from '@motion-canvas/vite-plugin';
  import ffmpeg from '@motion-canvas/ffmpeg';

  export default defineConfig({
    plugins: [motionCanvas(), ffmpeg()],
  });
  ```
- Renders go to `output/`, snapshots to `still/`.

## Minimal scene

```tsx
import {Circle, makeScene2D} from '@motion-canvas/2d';
import {all, createRef} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  view.fill('#242424'); // scene background

  const myCircle = createRef<Circle>();
  view.add(
    <Circle ref={myCircle} x={-300} width={140} height={140} fill="#e13238" />,
  );

  yield* all(
    myCircle().position.x(300, 1).to(-300, 1),
    myCircle().fill('#e6a700', 1).to('#e13238', 1),
  );
});
```

Core rules:
- `createRef<T>()` + `ref={r}`; read the node with `r()`.
- Every node property is a signal: `prop()` gets, `prop(v)` sets instantly, `prop(v, seconds)` returns a tween generator, `.to(v2, s)` chains on the same property.
- Generators do nothing unless yielded: use `yield* tween` to run and wait. A bare `yield;` waits one frame.
- Common nodes (from `@motion-canvas/2d`): `Rect`, `Circle`, `Txt`, `Line`, `Img`, `Video`, `Layout`, `Node`, `Code`, `Latex`. Common props: `x`, `y`, `position`, `width`, `height`, `size`, `fill`, `stroke`, `lineWidth`, `radius`, `opacity`, `scale`, `rotation`, `text`, `fontSize`, `fontFamily`, `layout`, `gap`, `padding`, `end`/`start` (for drawing lines).
- Coordinates: origin (0,0) is the canvas center; default canvas is 1920×1080.

## Flow control (`@motion-canvas/core`)

- `all(...tasks)` – run in parallel, wait for all.
- `any(...tasks)` – run in parallel, wait for the first.
- `chain(...tasks)` – run one after another.
- `delay(seconds, task)` – start a task after a delay.
- `sequence(stagger, ...tasks)` – start each `stagger` seconds after the previous one (doesn't wait for it to finish).
- `loop(n, i => gen)` / `loop(() => gen)` – repeat; an infinite loop must be `spawn`ed / `yield`ed, not `yield*`ed.
- `waitFor(seconds)` – pause.
- `waitUntil('event-name')` – pause until a time event the user can drag in the editor timeline (good for syncing with voiceover).
- `spawn(task)` – run in the background.

Staggered pattern:
```tsx
yield* sequence(0.1, ...rects.map(r => r.position.y(100, 1).to(0, 1)));
```

Reusable helpers are typed `ThreadGenerator`:
```tsx
function* pop(node: Circle): ThreadGenerator {
  yield* node.scale(1.2, 0.15).to(1, 0.15);
}
```

## Signals

```tsx
import {createSignal, DEFAULT, Vector2} from '@motion-canvas/core';

const radius = createSignal(1);
const area = createSignal(() => Math.PI * radius() * radius()); // derived, lazy, cached
yield* radius(4, 2).to(3, 2);
const v = Vector2.createSignal(Vector2.up);
signal(DEFAULT); // reset to initial value
```

Reactive props: `<Circle width={() => radius() * 100} />`.

## Tweening & easing

- Property tweens use `easeInOutCubic` by default. Pass an easing as the 3rd argument and an interpolation as the 4th:
  `node().position(new Vector2(300, -200), 2, easeOutQuad, Vector2.arcLerp)`.
- Manual: `yield* tween(2, t => node().x(map(-300, 300, easeInOutCubic(t))));`
- Easings follow the easings.net names: `linear`, `easeIn/Out/InOutSine|Quad|Cubic|Quart|Quint|Expo|Circ|Back|Elastic|Bounce`.
- Colors: `Color.lerp(a, b, t)`; every complex type has a static `lerp`.
- Springs: `yield* spring(PlopSpring, -400, 400, 1, v => node().x(v));` (`PlopSpring`, `SmoothSpring`, or a custom `{mass, stiffness, damping, initialVelocity}`).
- `node().save()` then `yield* node().restore(1)` to animate back to a saved state.

## Rendering / export

In the editor's **Video Settings** panel: set background (empty = transparent), range, resolution, frame rate (24/30/60), scale, color space, and exporter. Then click **RENDER**; output lands in `output/`.

- **Image sequence** (built in): PNG / JPEG / WebP, quality 0–100, optional per-scene folders.
- **Video (FFmpeg)**: produces MP4. To add it to an existing project:
  ```bash
  npm install --save @motion-canvas/ffmpeg
  ```
  then add `import ffmpeg from '@motion-canvas/ffmpeg'` and `ffmpeg()` to `plugins` in `vite.config.ts`. FFmpeg is bundled with the exporter. Options: include audio, fast start (web-friendly MP4).

Audio for syncing: `makeProject({scenes: [...], audio: audioFile})` with `import audioFile from '../audio/voice.mp3';`.

## User preference: always a human

Every post, carousel, video and Motion Canvas animation made for this user must feature at least one person prominently (photo or video footage). Illustrations and icons complement, never replace, the human. Sources, in order: the user's own real photos (with image-use consent) → free stock whose license allows commercial use (Pexels, Unsplash non-plus, Pixabay; no implied endorsement, never present stock models as real students/customers). No paid banks (Magnific/Freepik, Unsplash+). If the project has an image-bank guide (e.g. `docs/BANCOS-DE-IMAGEM.md`), follow it.

## Gotchas (learned in practice)

- Setting up by hand instead of `npm init`: do **not** put `"type": "module"` in package.json — `@motion-canvas/vite-plugin` is CJS and `motionCanvas()` then fails with "is not a function". Deps: `@motion-canvas/core`, `@motion-canvas/2d` (deps); `@motion-canvas/ui`, `@motion-canvas/vite-plugin`, `@motion-canvas/ffmpeg`, `typescript`, `vite@5` (dev). `tsconfig.json`: `{"extends": "@motion-canvas/2d/tsconfig.project.json", "include": ["src"]}`; `src/motion-canvas.d.ts`: `/// <reference types="@motion-canvas/core/project" />`.
- Resolution/fps/exporter live in `src/<project>.meta` next to the project file (`shared.size`, `rendering.fps`, `rendering.exporter.name` = `@motion-canvas/ffmpeg` or `@motion-canvas/core/image-sequence` with options `{fileType: "image/png", quality: 100, groupByScene: false}`). Writing it before the first run works.
- Several projects (e.g. a vertical video + a feed post): `motionCanvas({project: ['./src/project.ts', './src/post.ts']})`. Editor URLs become `http://localhost:9000/src/project`, `/src/post`. Changing the project list needs a full dev-server restart.
- Still images / Instagram carousels: one scene, one slide per segment, render with the image-sequence exporter at 1 fps. `waitFor(1)` yields **zero** frames at 1 fps (it stops one frame early), so hold slides with explicit frames: `const n = Math.round(1 / usePlayback().framesToSeconds(1)); for (let f = 0; f < n; f++) yield;`. The render also writes one extra trailing frame (duplicate of the last slide).
- To make a video last exactly N seconds: end with `yield* waitFor(Math.max(0, N - useTime()));`.
- Single still image: a scene that adds the nodes then does one bare `yield;`, rendered with the image-sequence exporter (`groupByScene: true` gives `output/<project>/<scene>/000000.png`).
- `<SVG svg="...">` icons: the component ignores style attributes on the root `<svg>` (fill, stroke, stroke-width…), so wrap the shapes in `<g fill="none" stroke="#fff" stroke-width="2" ...>`. Supported elements: path, rect, circle, ellipse, line, polyline, polygon, image, g, use.
- Narration (pt-BR or any language): Windows SAPI voices sound robotic; use `edge-tts` (pip, Microsoft neural voices, e.g. `pt-BR-FranciscaNeural`, `pt-BR-AntonioNeural`; needs internet) in a project `.venv`. Generate one clip per script segment, convert to WAV with the bundled ffmpeg, concatenate with short gaps, and write a `tempos.json` (start/duration per segment). The scene imports that JSON and waits until each segment's start (`yield* waitFor(t - useTime())`) to reveal the matching element. Attach the WAV with `makeProject({scenes, audio})`; the FFmpeg exporter's "include audio" muxes it.
- Background music: stock-site tracks (Pixabay etc.) are often Content ID–registered (claims/muting on YouTube/Instagram) and their CDN blocks scripted downloads. A safe default is composing an original bed with numpy (additive pad + plucked bass + arpeggio + synthesized kick/clap/hat). Mix with ffmpeg: pad the voice (`apad,atrim=end=<music len>`), force both inputs to `aformat=sample_fmts=fltp:sample_rates=44100:channel_layouts=stereo`, duck with `sidechaincompress` keyed on the voice, then `amix`. The ffmpeg bundled with `@motion-canvas/ffmpeg` is old: `amix` has no `normalize`, so add `volume=2` after it.
- Animating an existing layout: give the layout function an optional refs object (`createRef`/`createRefArray` per part), hide everything at the start of the scene, then reveal. When "popping" a node, tween back to its **own** scale (`const s = node.scale(); node.scale(s.mul(0.6)); yield* node.scale(s, ...)`), not to 1, or pre-scaled nodes (logos) blow up.
- Images: put files in `src/images/` and `import photo from './images/x.jpg'` → `<Img src={photo} width={...} />`. Wrap in a `<Rect clip>` to crop. To fade a photo into a patterned background without a seam, don't fade to a solid color: give the wrapper `cache` and add a last child Rect with a black→transparent `Gradient` fill and `compositeOperation="destination-in"` (alpha mask). Make sure the image covers the full width (`x ± width/2` beyond the scene edges) or a strip of background shows at the side.
- Fonts: system fonts (e.g. `Segoe UI` on Windows) work directly in `fontFamily`.
- Verify the duration of an exported MP4 with the bundled ffmpeg: `node_modules/@ffmpeg-installer/*/ffmpeg.exe -i output/project.mp4`.

## Workflow when helping the user

1. If there's no project, scaffold one (pick TypeScript and Video (FFmpeg)).
2. Write scenes in `src/scenes/`, register them in `src/project.ts` with `?scene`.
3. Start `npm start` in the background and have the user preview at http://localhost:9000/ (or open it in the built-in browser to check visually).
4. For final export, tell the user to pick the exporter and click RENDER in the editor.
5. When unsure of an API detail, check https://motion-canvas.io/docs/ and https://motion-canvas.io/api/ rather than guessing.
