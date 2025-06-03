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
export const bfs = (grid, startNode, endNode, rows, cols) => {
  const visitedNodesInOrder = [];
  const queue = [startNode];
  const previous = {};
  const visited = new Set();
  
  const key = (cell) => `${cell.row}-${cell.col}`;
  visited.add(key(startNode));

  while (queue.length > 0) {
    const currentCell = queue.shift();

    if (currentCell.type !== 'start' && currentCell.type !== 'end') {
      visitedNodesInOrder.push(currentCell);
    }

    if (currentCell.row === endNode.row && currentCell.col === endNode.col) {
      const path = [];
      let current = endNode;
      while (current && previous[key(current)] !== undefined) {
        path.unshift(current);
        current = previous[key(current)];
      }
      path.unshift(startNode);
      return { visitedNodesInOrder, path };
    }

    const neighbors = getNeighbors(currentCell, grid, rows, cols);
    for (const neighbor of neighbors) {
      const neighborKey = key(neighbor);
      if (!visited.has(neighborKey)) {
        visited.add(neighborKey);
        previous[neighborKey] = currentCell;
        queue.push(neighbor);
      }
    }
  }

  return { visitedNodesInOrder, path: [] };
};

export const dfs = (grid, startNode, endNode, rows, cols) => {
  const visitedNodesInOrder = [];
  const stack = [startNode];
  const previous = {};
  const visited = new Set();
  
  const key = (cell) => `${cell.row}-${cell.col}`;
  visited.add(key(startNode));

  while (stack.length > 0) {
    const currentCell = stack.pop();

    if (currentCell.type !== 'start' && currentCell.type !== 'end') {
      visitedNodesInOrder.push(currentCell);
    }

    if (currentCell.row === endNode.row && currentCell.col === endNode.col) {
      const path = [];
      let current = endNode;
      while (current && previous[key(current)] !== undefined) {
        path.unshift(current);
        current = previous[key(current)];
      }
      path.unshift(startNode);
      return { visitedNodesInOrder, path };
    }

    const neighbors = getNeighbors(currentCell, grid, rows, cols);
    for (const neighbor of neighbors.reverse()) {
      const neighborKey = key(neighbor);
      if (!visited.has(neighborKey)) {
        visited.add(neighborKey);
        previous[neighborKey] = currentCell;
        stack.push(neighbor);
      }
    }
  }

  return { visitedNodesInOrder, path: [] };
};

export const greedyBestFirst = (grid, startNode, endNode, rows, cols) => {
  const visitedNodesInOrder = [];
  const minPriorityQueue = new MinPriorityQueue();
  const previous = {};
  const visited = new Set();
  
  const key = (cell) => `${cell.row}-${cell.col}`;
  visited.add(key(startNode));

  minPriorityQueue.enqueue(startNode, heuristic(startNode, endNode));

  while (!minPriorityQueue.isEmpty()) {
    const { val: currentCell } = minPriorityQueue.dequeue();

    if (currentCell.type !== 'start' && currentCell.type !== 'end') {
      visitedNodesInOrder.push(currentCell);
    }

    if (currentCell.row === endNode.row && currentCell.col === endNode.col) {
      const path = [];
      let current = endNode;
      while (current && previous[key(current)] !== undefined) {
        path.unshift(current);
        current = previous[key(current)];
      }
      path.unshift(startNode);
      return { visitedNodesInOrder, path };
    }

    const neighbors = getNeighbors(currentCell, grid, rows, cols);
    for (const neighbor of neighbors) {
      const neighborKey = key(neighbor);
      if (!visited.has(neighborKey)) {
        visited.add(neighborKey);
        previous[neighborKey] = currentCell;
        minPriorityQueue.enqueue(neighbor, heuristic(neighbor, endNode));
      }
    }
  }

  return { visitedNodesInOrder, path: [] };
};

export const bidirectionalBFS = (grid, startNode, endNode, rows, cols) => {
  const visitedNodesInOrder = [];
  const startQueue = [startNode];
  const endQueue = [endNode];
  const startVisited = new Set();
  const endVisited = new Set();
  const startPrevious = {};
  const endPrevious = {};
  
  const key = (cell) => `${cell.row}-${cell.col}`;
  startVisited.add(key(startNode));
  endVisited.add(key(endNode));

  while (startQueue.length > 0 && endQueue.length > 0) {
    // Start tarafından arama
    const currentStartCell = startQueue.shift();
    if (currentStartCell.type !== 'start') {
      visitedNodesInOrder.push(currentStartCell);
    }

    const startNeighbors = getNeighbors(currentStartCell, grid, rows, cols);
    for (const neighbor of startNeighbors) {
      const neighborKey = key(neighbor);
      if (!startVisited.has(neighborKey)) {
        startVisited.add(neighborKey);
        startPrevious[neighborKey] = currentStartCell;
        startQueue.push(neighbor);

        if (endVisited.has(neighborKey)) {
          // Yol bulundu
          const path = [];
          // Start tarafından yolu oluştur
          let current = neighbor;
          while (current && startPrevious[key(current)] !== undefined) {
            path.unshift(current);
            current = startPrevious[key(current)];
          }
          path.unshift(startNode);
          
          // End tarafından yolu oluştur
          current = endPrevious[neighborKey];
          while (current && endPrevious[key(current)] !== undefined) {
            path.push(current);
            current = endPrevious[key(current)];
          }
          path.push(endNode);
          
          return { visitedNodesInOrder, path };
        }
      }
    }

    // End tarafından arama
    const currentEndCell = endQueue.shift();
    if (currentEndCell.type !== 'end') {
      visitedNodesInOrder.push(currentEndCell);
    }

    const endNeighbors = getNeighbors(currentEndCell, grid, rows, cols);
    for (const neighbor of endNeighbors) {
      const neighborKey = key(neighbor);
      if (!endVisited.has(neighborKey)) {
        endVisited.add(neighborKey);
        endPrevious[neighborKey] = currentEndCell;
        endQueue.push(neighbor);

        if (startVisited.has(neighborKey)) {
          // Yol bulundu
          const path = [];
          // Start tarafından yolu oluştur
          let current = startPrevious[neighborKey];
          while (current && startPrevious[key(current)] !== undefined) {
            path.unshift(current);
            current = startPrevious[key(current)];
          }
          path.unshift(startNode);
          
          // End tarafından yolu oluştur
          path.push(neighbor);
          current = endPrevious[neighborKey];
          while (current && endPrevious[key(current)] !== undefined) {
            path.push(current);
            current = endPrevious[key(current)];
          }
          path.push(endNode);
          
          return { visitedNodesInOrder, path };
        }
      }
    }
  }

  return { visitedNodesInOrder, path: [] };
};