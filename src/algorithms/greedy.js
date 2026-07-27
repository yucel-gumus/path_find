import MinPriorityQueue from '../data/minPriorityQueue';
import { getNeighbors, heuristic } from '../data/gridHelpers';
import { cellKey, isStartOrEnd, reconstructPath, emptyResult, pos } from './common';

export const greedyBestFirst = (grid, startNode, endNode, rows, cols) => {
  if (startNode.row === endNode.row && startNode.col === endNode.col) {
    return { visitedNodesInOrder: [], path: [pos(startNode)] };
  }

  const visitedNodesInOrder = [];
  const pq = new MinPriorityQueue();
  const previous = {};
  const visited = new Set([cellKey(startNode.row, startNode.col)]);

  pq.enqueue(grid[startNode.row][startNode.col], heuristic(startNode, endNode));

  while (!pq.isEmpty()) {
    const { val: current } = pq.dequeue();

    if (!isStartOrEnd(current)) {
      visitedNodesInOrder.push(pos(current));
    }

    if (current.row === endNode.row && current.col === endNode.col) {
      return {
        visitedNodesInOrder,
        path: reconstructPath(previous, startNode, endNode),
      };
    }

    for (const neighbor of getNeighbors(current, grid, rows, cols)) {
      const nk = cellKey(neighbor.row, neighbor.col);
      if (!visited.has(nk)) {
        visited.add(nk);
        previous[nk] = current;
        pq.enqueue(neighbor, heuristic(neighbor, endNode));
      }
    }
  }

  return emptyResult(visitedNodesInOrder);
};
