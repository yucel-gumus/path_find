import { CELL_TYPES } from '../constants';
import { cellKey, sameCell } from '../data/gridHelpers';

export { cellKey, sameCell };

export const isStartOrEnd = (cell) =>
  cell.type === CELL_TYPES.START || cell.type === CELL_TYPES.END;

/**
 * Reconstruct path from parent map. `cameFrom[key] = parentCell`.
 * Start has no entry (or null/undefined parent).
 */
export const reconstructPath = (cameFrom, startNode, endNode) => {
  if (sameCell(startNode, endNode)) {
    return [{ row: startNode.row, col: startNode.col }];
  }

  const path = [];
  let current = { row: endNode.row, col: endNode.col };
  const guard = new Set();

  while (current && !sameCell(current, startNode)) {
    const k = cellKey(current.row, current.col);
    if (guard.has(k)) break;
    guard.add(k);
    path.unshift(current);
    const parent = cameFrom[k];
    if (!parent) break;
    current = { row: parent.row, col: parent.col };
  }

  path.unshift({ row: startNode.row, col: startNode.col });
  return path;
};

/**
 * Build full path when two BFS frontiers meet at `meeting`.
 * startPrevious / endPrevious map key -> parent cell toward their origin.
 */
export const reconstructBidirectionalPath = (
  startPrevious,
  endPrevious,
  meeting,
  startNode,
  endNode
) => {
  // start -> meeting
  const path = [];
  let current = { row: meeting.row, col: meeting.col };
  const guard = new Set();

  while (current) {
    const k = cellKey(current.row, current.col);
    if (guard.has(k)) break;
    guard.add(k);
    path.unshift(current);
    if (sameCell(current, startNode)) break;
    const parent = startPrevious[k];
    if (!parent) break;
    current = { row: parent.row, col: parent.col };
  }

  if (path.length === 0 || !sameCell(path[0], startNode)) {
    path.unshift({ row: startNode.row, col: startNode.col });
  }

  // meeting -> end (skip meeting itself)
  current = endPrevious[cellKey(meeting.row, meeting.col)];
  while (current) {
    path.push({ row: current.row, col: current.col });
    if (sameCell(current, endNode)) break;
    const parent = endPrevious[cellKey(current.row, current.col)];
    if (!parent) break;
    current = { row: parent.row, col: parent.col };
  }

  const last = path[path.length - 1];
  if (!last || !sameCell(last, endNode)) {
    if (!sameCell(meeting, endNode)) {
      path.push({ row: endNode.row, col: endNode.col });
    }
  }

  return path;
};

export const emptyResult = (visitedNodesInOrder = []) => ({
  visitedNodesInOrder,
  path: [],
});

export const pos = (cell) => ({ row: cell.row, col: cell.col });
