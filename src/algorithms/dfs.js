import { getNeighbors } from '../data/gridHelpers';
import { cellKey, isStartOrEnd, reconstructPath, emptyResult, pos } from './common';

export const dfs = (grid, startNode, endNode, rows, cols) => {
  if (startNode.row === endNode.row && startNode.col === endNode.col) {
    return { visitedNodesInOrder: [], path: [pos(startNode)] };
  }

  const visitedNodesInOrder = [];
  const stack = [grid[startNode.row][startNode.col]];
  const previous = {};
  const visited = new Set([cellKey(startNode.row, startNode.col)]);

  while (stack.length > 0) {
    const current = stack.pop();

    if (!isStartOrEnd(current)) {
      visitedNodesInOrder.push(pos(current));
    }

    if (current.row === endNode.row && current.col === endNode.col) {
      return {
        visitedNodesInOrder,
        path: reconstructPath(previous, startNode, endNode),
      };
    }

    // Reverse neighbor order so first direction is explored first (stable visualization)
    const neighbors = getNeighbors(current, grid, rows, cols);
    for (let i = neighbors.length - 1; i >= 0; i--) {
      const neighbor = neighbors[i];
      const nk = cellKey(neighbor.row, neighbor.col);
      if (!visited.has(nk)) {
        visited.add(nk);
        previous[nk] = current;
        stack.push(neighbor);
      }
    }
  }

  return emptyResult(visitedNodesInOrder);
};
