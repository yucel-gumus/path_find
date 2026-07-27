import { getNeighbors } from '../data/gridHelpers';
import {
  cellKey,
  isStartOrEnd,
  reconstructBidirectionalPath,
  emptyResult,
  pos,
} from './common';

export const bidirectionalBFS = (grid, startNode, endNode, rows, cols) => {
  if (startNode.row === endNode.row && startNode.col === endNode.col) {
    return { visitedNodesInOrder: [], path: [pos(startNode)] };
  }

  const visitedNodesInOrder = [];
  const startQueue = [grid[startNode.row][startNode.col]];
  const endQueue = [grid[endNode.row][endNode.col]];
  let startHead = 0;
  let endHead = 0;

  const startVisited = new Set([cellKey(startNode.row, startNode.col)]);
  const endVisited = new Set([cellKey(endNode.row, endNode.col)]);
  const startPrevious = {};
  const endPrevious = {};

  const tryMeet = (neighbor, fromStart) => {
    const nk = cellKey(neighbor.row, neighbor.col);
    if (fromStart) {
      if (!endVisited.has(nk)) return null;
      return reconstructBidirectionalPath(
        startPrevious,
        endPrevious,
        neighbor,
        startNode,
        endNode
      );
    }
    if (!startVisited.has(nk)) return null;
    return reconstructBidirectionalPath(
      startPrevious,
      endPrevious,
      neighbor,
      startNode,
      endNode
    );
  };

  while (startHead < startQueue.length && endHead < endQueue.length) {
    // Expand start side
    const currentStart = startQueue[startHead++];
    if (!isStartOrEnd(currentStart)) {
      visitedNodesInOrder.push(pos(currentStart));
    }

    for (const neighbor of getNeighbors(currentStart, grid, rows, cols)) {
      const nk = cellKey(neighbor.row, neighbor.col);
      if (!startVisited.has(nk)) {
        startVisited.add(nk);
        startPrevious[nk] = currentStart;
        startQueue.push(neighbor);

        const path = tryMeet(neighbor, true);
        if (path) return { visitedNodesInOrder, path };
      }
    }

    // Expand end side
    const currentEnd = endQueue[endHead++];
    if (!isStartOrEnd(currentEnd)) {
      visitedNodesInOrder.push(pos(currentEnd));
    }

    for (const neighbor of getNeighbors(currentEnd, grid, rows, cols)) {
      const nk = cellKey(neighbor.row, neighbor.col);
      if (!endVisited.has(nk)) {
        endVisited.add(nk);
        endPrevious[nk] = currentEnd;
        endQueue.push(neighbor);

        const path = tryMeet(neighbor, false);
        if (path) return { visitedNodesInOrder, path };
      }
    }
  }

  return emptyResult(visitedNodesInOrder);
};
