
import MinPriorityQueue from './minPriorityQueue';
import { getNeighbors, heuristic } from './gridHelpers';
export const dijkstra = (grid, startNode, endNode, rows, cols) => {
  const distances = {};
  const previous = {};
  const visitedNodesInOrder = [];
  const minPriorityQueue = new MinPriorityQueue();

  const key = (cell) => `${cell.row}-${cell.col}`;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = grid[r][c];
      distances[key(cell)] = Infinity;
      previous[key(cell)] = null;
    }
  }

  distances[key(startNode)] = 0;
  minPriorityQueue.enqueue(startNode, 0);
  while (!minPriorityQueue.isEmpty()) {
    const { val: currentCell, priority: currentDistance } = minPriorityQueue.dequeue();

    if (currentDistance > distances[key(currentCell)]) {
        continue;
    }

    if (currentCell.row === endNode.row && currentCell.col === endNode.col) {
      const path = [];
      let current = endNode;
      while (current && previous[key(current)] !== null) {
        path.unshift(current);
        current = previous[key(current)];
      }
      path.unshift(startNode);
      return { visitedNodesInOrder, path };
    }

    if (currentCell.type !== 'start' && currentCell.type !== 'end') {
      visitedNodesInOrder.push(currentCell);
    }

    const neighbors = getNeighbors(currentCell, grid, rows, cols);
    for (const neighbor of neighbors) {
      const newDistance = distances[key(currentCell)] + 1;

      if (newDistance < distances[key(neighbor)]) {
        distances[key(neighbor)] = newDistance;
        previous[key(neighbor)] = currentCell;
        minPriorityQueue.enqueue(neighbor, newDistance);
      }
    }
  }

  return { visitedNodesInOrder, path: [] };
};
export const aStar = (grid, startNode, endNode, rows, cols) => {
  const gScore = {};
  const fScore = {};
  const cameFrom = {};
  const visitedNodesInOrder = [];
  const minPriorityQueue = new MinPriorityQueue();

  const key = (cell) => `${cell.row}-${cell.col}`;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = grid[r][c];
      gScore[key(cell)] = Infinity;
      fScore[key(cell)] = Infinity;
    }
  }

  gScore[key(startNode)] = 0;
  fScore[key(startNode)] = heuristic(startNode, endNode);

  minPriorityQueue.enqueue(startNode, fScore[key(startNode)]);

  while (!minPriorityQueue.isEmpty()) {
    const { val: currentCell, priority: currentFScore } = minPriorityQueue.dequeue();

    if (currentFScore > fScore[key(currentCell)]) {
        continue;
    }

    if (currentCell.row === endNode.row && currentCell.col === endNode.col) {
      const path = [];
      let current = endNode;
      while (current && cameFrom[key(current)] !== undefined) {
        path.unshift(current);
        current = cameFrom[key(current)];
      }
      path.unshift(startNode);
      return { visitedNodesInOrder, path };
    }

    if (currentCell.type !== 'start' && currentCell.type !== 'end') {
      visitedNodesInOrder.push(currentCell);
    }

    const neighbors = getNeighbors(currentCell, grid, rows, cols);
    for (const neighbor of neighbors) {
      const tentativeG = gScore[key(currentCell)] + 1;

      if (tentativeG < gScore[key(neighbor)]) {
        cameFrom[key(neighbor)] = currentCell;
        gScore[key(neighbor)] = tentativeG;
        fScore[key(neighbor)] = tentativeG + heuristic(neighbor, endNode);
        minPriorityQueue.enqueue(neighbor, fScore[key(neighbor)]);
      }
    }
  }

  return { visitedNodesInOrder, path: [] };
};