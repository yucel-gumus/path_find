import MinPriorityQueue from '../data/minPriorityQueue';
import { getNeighbors, heuristic } from '../data/gridHelpers';
import { cellKey, isStartOrEnd, reconstructPath, emptyResult, pos } from './common';

export const aStar = (grid, startNode, endNode, rows, cols) => {
  if (startNode.row === endNode.row && startNode.col === endNode.col) {
    return { visitedNodesInOrder: [], path: [pos(startNode)] };
  }

  const gScore = {};
  const fScore = {};
  const cameFrom = {};
  const visitedNodesInOrder = [];
  const pq = new MinPriorityQueue();

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const k = cellKey(r, c);
      gScore[k] = Infinity;
      fScore[k] = Infinity;
    }
  }

  const startKey = cellKey(startNode.row, startNode.col);
  gScore[startKey] = 0;
  fScore[startKey] = heuristic(startNode, endNode);
  pq.enqueue(grid[startNode.row][startNode.col], fScore[startKey]);

  while (!pq.isEmpty()) {
    const { val: current, priority: currentF } = pq.dequeue();
    const ck = cellKey(current.row, current.col);

    if (currentF > fScore[ck]) continue;

    if (current.row === endNode.row && current.col === endNode.col) {
      return {
        visitedNodesInOrder,
        path: reconstructPath(cameFrom, startNode, endNode),
      };
    }

    if (!isStartOrEnd(current)) {
      visitedNodesInOrder.push(pos(current));
    }

    for (const neighbor of getNeighbors(current, grid, rows, cols)) {
      const nk = cellKey(neighbor.row, neighbor.col);
      const tentativeG = gScore[ck] + 1;
      if (tentativeG < gScore[nk]) {
        cameFrom[nk] = current;
        gScore[nk] = tentativeG;
        fScore[nk] = tentativeG + heuristic(neighbor, endNode);
        pq.enqueue(neighbor, fScore[nk]);
      }
    }
  }

  return emptyResult(visitedNodesInOrder);
};
