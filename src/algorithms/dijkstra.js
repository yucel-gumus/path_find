import MinPriorityQueue from '../data/minPriorityQueue';
import { getNeighbors } from '../data/gridHelpers';
import { cellKey, isStartOrEnd, reconstructPath, emptyResult, pos } from './common';

export const dijkstra = (grid, startNode, endNode, rows, cols) => {
  if (startNode.row === endNode.row && startNode.col === endNode.col) {
    return { visitedNodesInOrder: [], path: [pos(startNode)] };
  }

  const distances = {};
  const previous = {};
  const visitedNodesInOrder = [];
  const pq = new MinPriorityQueue();

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      distances[cellKey(r, c)] = Infinity;
    }
  }

  const startKey = cellKey(startNode.row, startNode.col);
  distances[startKey] = 0;
  pq.enqueue(grid[startNode.row][startNode.col], 0);

  while (!pq.isEmpty()) {
    const { val: current, priority: dist } = pq.dequeue();
    const ck = cellKey(current.row, current.col);

    if (dist > distances[ck]) continue;

    if (current.row === endNode.row && current.col === endNode.col) {
      return {
        visitedNodesInOrder,
        path: reconstructPath(previous, startNode, endNode),
      };
    }

    if (!isStartOrEnd(current)) {
      visitedNodesInOrder.push(pos(current));
    }

    for (const neighbor of getNeighbors(current, grid, rows, cols)) {
      const nk = cellKey(neighbor.row, neighbor.col);
      const newDist = distances[ck] + 1;
      if (newDist < distances[nk]) {
        distances[nk] = newDist;
        previous[nk] = current;
        pq.enqueue(neighbor, newDist);
      }
    }
  }

  return emptyResult(visitedNodesInOrder);
};
