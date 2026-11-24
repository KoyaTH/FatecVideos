import {makeScene2D, Node} from '@motion-canvas/2d';
import {usePlayback} from '@motion-canvas/core';
import {montar} from '../gen/estilos';
import {PostSpec} from '../gen/spec';
import fila from '../gen/fila-posts.json';

// One post per frame: rendering at 1 fps gives output/gerador-posts/000000.png, 000001.png, …
// in the order of src/gen/fila-posts.json (written by tools/gerar.py).
const W = 1080;
const H = 1350;

export default makeScene2D(function* (view) {
  const posts = (fila as {posts: PostSpec[]}).posts;
  const nodes = posts.map((spec, i) => {
    const node = montar(spec, W, H).node as Node;
    node.opacity(i === 0 ? 1 : 0);
    view.add(node);
    return node;
  });

  const framesPerPost = Math.max(1, Math.round(1 / usePlayback().framesToSeconds(1)));
  for (let i = 0; i < nodes.length; i++) {
    nodes.forEach((n, j) => n.opacity(j === i ? 1 : 0));
    for (let f = 0; f < framesPerPost; f++) yield;
  }
});
