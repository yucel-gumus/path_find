import { aStar } from './astar';
import { dijkstra } from './dijkstra';
import { bfs } from './bfs';
import { dfs } from './dfs';
import { greedyBestFirst } from './greedy';
import { bidirectionalBFS } from './bidirectional';

const RUNNERS = {
  astar: aStar,
  dijkstra,
  bfs,
  dfs,
  greedy: greedyBestFirst,
  bidirectional: bidirectionalBFS,
};

export {
  aStar,
  dijkstra,
  bfs,
  dfs,
  greedyBestFirst,
  bidirectionalBFS,
};

export const runAlgorithm = (id, grid, startNode, endNode, rows, cols) => {
  const runner = RUNNERS[id] || aStar;
  return runner(grid, startNode, endNode, rows, cols);
};
