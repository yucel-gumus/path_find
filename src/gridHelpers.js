
export const createGrid = (rows, cols, wallDensity, startNode, endNode) => {
  const newGrid = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      let type = 'empty';

      if (r === startNode.row && c === startNode.col) {
        type = 'start';
      } else if (r === endNode.row && c === endNode.col) {
        type = 'end';
      } else {
        const isWall = Math.random() < wallDensity / 100;
        if (isWall) {
          type = 'wall';
        }
      }
      row.push({ row: r, col: c, type });
    }
    newGrid.push(row);
  }
  return newGrid;
};


export const clearPathAndVisited = (currentGrid) => {
  return currentGrid.map((row) =>
    row.map((cell) => {
      if (cell.type === 'visited' || cell.type === 'path') {
        return { ...cell, type: 'empty' };
      }
      return cell;
    })
  );
};


export const generateRandomWalls = (currentGrid, wallDensity) => {
  return currentGrid.map((row) =>
    row.map((cell) => {
      if (cell.type === 'start' || cell.type === 'end') {
        return cell;
      }
      return { ...cell, type: Math.random() < wallDensity / 100 ? 'wall' : 'empty' };
    })
  );
};


export const getNeighbors = (cell, grid, rows, cols) => {
  const neighbors = [];
  const { row, col } = cell;

  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < rows - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < cols - 1) neighbors.push(grid[row][col + 1]);
  return neighbors.filter(neighbor => neighbor.type !== 'wall');
};


export const heuristic = (cellA, cellB) => {
  return Math.abs(cellA.row - cellB.row) + Math.abs(cellA.col - cellB.col);
};