import { CELL_TYPES } from '../constants';

export const cellKey = (row, col) => `${row}-${col}`;

export const sameCell = (a, b) => a && b && a.row === b.row && a.col === b.col;

export const createEmptyGrid = (rows, cols, startNode, endNode) => {
  const grid = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      let type = CELL_TYPES.EMPTY;
      if (r === startNode.row && c === startNode.col) type = CELL_TYPES.START;
      else if (r === endNode.row && c === endNode.col) type = CELL_TYPES.END;
      row.push({ row: r, col: c, type });
    }
    grid.push(row);
  }
  return grid;
};

/**
 * True if start can reach end walking only non-wall cells (4-directional).
 */
export const hasPath = (grid, startNode, endNode) => {
  if (!grid?.length || !startNode || !endNode) return false;
  if (sameCell(startNode, endNode)) return true;

  const rows = grid.length;
  const cols = grid[0].length;
  const visited = new Set([cellKey(startNode.row, startNode.col)]);
  const queue = [{ row: startNode.row, col: startNode.col }];
  let head = 0;

  const dirs = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  while (head < queue.length) {
    const { row, col } = queue[head++];
    if (row === endNode.row && col === endNode.col) return true;

    for (const [dr, dc] of dirs) {
      const nr = row + dr;
      const nc = col + dc;
      if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
      const k = cellKey(nr, nc);
      if (visited.has(k)) continue;
      if (grid[nr][nc].type === CELL_TYPES.WALL) continue;
      visited.add(k);
      queue.push({ row: nr, col: nc });
    }
  }
  return false;
};

/**
 * Clears the fewest walls needed so start↔end is connected.
 * Walks through walls (treating them as costly empty cells) via BFS, then opens that corridor.
 */
export const ensurePathExists = (grid, startNode, endNode) => {
  if (hasPath(grid, startNode, endNode)) return grid;

  const rows = grid.length;
  const cols = grid[0].length;
  const startKey = cellKey(startNode.row, startNode.col);
  const prev = {};
  const visited = new Set([startKey]);
  const queue = [{ row: startNode.row, col: startNode.col }];
  let head = 0;
  let found = false;

  const dirs = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  while (head < queue.length) {
    const cur = queue[head++];
    if (cur.row === endNode.row && cur.col === endNode.col) {
      found = true;
      break;
    }
    for (const [dr, dc] of dirs) {
      const nr = cur.row + dr;
      const nc = cur.col + dc;
      if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
      const k = cellKey(nr, nc);
      if (visited.has(k)) continue;
      visited.add(k);
      prev[k] = cur;
      queue.push({ row: nr, col: nc });
    }
  }

  if (!found) return grid;

  // Reconstruct path end → start and open any walls on it
  const next = cloneGrid(grid);
  let cur = { row: endNode.row, col: endNode.col };
  while (cur && !sameCell(cur, startNode)) {
    const cell = next[cur.row][cur.col];
    if (cell.type === CELL_TYPES.WALL) {
      next[cur.row][cur.col] = { ...cell, type: CELL_TYPES.EMPTY };
    }
    const p = prev[cellKey(cur.row, cur.col)];
    if (!p) break;
    cur = p;
  }

  next[startNode.row][startNode.col] = {
    ...next[startNode.row][startNode.col],
    type: CELL_TYPES.START,
  };
  next[endNode.row][endNode.col] = {
    ...next[endNode.row][endNode.col],
    type: CELL_TYPES.END,
  };

  return next;
};

const resolveStartEnd = (grid, startNode, endNode) => {
  if (startNode && endNode) return { start: startNode, end: endNode };
  let start = startNode || null;
  let end = endNode || null;
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      if (grid[r][c].type === CELL_TYPES.START) start = { row: r, col: c };
      if (grid[r][c].type === CELL_TYPES.END) end = { row: r, col: c };
    }
  }
  return { start, end };
};

export const createGrid = (rows, cols, wallDensity, startNode, endNode, addWalls = true) => {
  let grid = createEmptyGrid(rows, cols, startNode, endNode);
  if (!addWalls || wallDensity <= 0) return grid;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = grid[r][c];
      if (cell.type === CELL_TYPES.START || cell.type === CELL_TYPES.END) continue;
      if (Math.random() < wallDensity / 100) {
        grid[r][c] = { ...cell, type: CELL_TYPES.WALL };
      }
    }
  }
  return ensurePathExists(grid, startNode, endNode);
};

export const clearPathAndVisited = (grid) =>
  grid.map((row) =>
    row.map((cell) => {
      if (cell.type === CELL_TYPES.VISITED || cell.type === CELL_TYPES.PATH) {
        return { ...cell, type: CELL_TYPES.EMPTY };
      }
      return cell;
    })
  );

/**
 * Random walls that always leave at least one start→end path.
 * Retries a few times, then surgically opens a corridor if still blocked.
 */
export const generateRandomWalls = (grid, wallDensity, startNode, endNode) => {
  const { start, end } = resolveStartEnd(grid, startNode, endNode);
  if (!start || !end) {
    return grid.map((row) =>
      row.map((cell) => {
        if (cell.type === CELL_TYPES.START || cell.type === CELL_TYPES.END) return cell;
        return {
          ...cell,
          type: Math.random() < wallDensity / 100 ? CELL_TYPES.WALL : CELL_TYPES.EMPTY,
        };
      })
    );
  }

  const MAX_ATTEMPTS = 40;
  let best = null;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const candidate = grid.map((row) =>
      row.map((cell) => {
        if (cell.row === start.row && cell.col === start.col) {
          return { ...cell, type: CELL_TYPES.START };
        }
        if (cell.row === end.row && cell.col === end.col) {
          return { ...cell, type: CELL_TYPES.END };
        }
        return {
          ...cell,
          type: Math.random() < wallDensity / 100 ? CELL_TYPES.WALL : CELL_TYPES.EMPTY,
        };
      })
    );

    if (hasPath(candidate, start, end)) {
      return candidate;
    }
    best = candidate;
  }

  // High density can still fail — open a guaranteed corridor
  return ensurePathExists(best || grid, start, end);
};

/**
 * Recursive-division maze. Always solvable: post-pass ensures start↔end path.
 */
export const generateMaze = (grid, startNode, endNode) => {
  const rows = grid.length;
  const cols = grid[0].length;
  const { start, end } = resolveStartEnd(grid, startNode, endNode);
  const s = start || { row: 0, col: 0 };
  const e = end || { row: rows - 1, col: cols - 1 };

  let next = createEmptyGrid(rows, cols, s, e);

  const isProtected = (r, c) =>
    (r === s.row && c === s.col) || (r === e.row && c === e.col);

  const setWall = (r, c) => {
    if (r < 0 || c < 0 || r >= rows || c >= cols || isProtected(r, c)) return;
    next[r][c] = { ...next[r][c], type: CELL_TYPES.WALL };
  };

  const divide = (r0, c0, r1, c1, orientation) => {
    const height = r1 - r0;
    const width = c1 - c0;
    if (height < 2 || width < 2) return;

    const horizontal =
      orientation === 'H' ||
      (orientation === 'auto' && (height > width || (height === width && Math.random() < 0.5)));

    if (horizontal) {
      const candidates = [];
      for (let r = r0 + 1; r < r1; r++) candidates.push(r);
      if (candidates.length === 0) return;
      const wallRow = candidates[Math.floor(Math.random() * candidates.length)];
      const passageCol = c0 + Math.floor(Math.random() * width);

      for (let c = c0; c < c1; c++) {
        if (c !== passageCol) setWall(wallRow, c);
      }

      divide(r0, c0, wallRow, c1, 'auto');
      divide(wallRow + 1, c0, r1, c1, 'auto');
    } else {
      const candidates = [];
      for (let c = c0 + 1; c < c1; c++) candidates.push(c);
      if (candidates.length === 0) return;
      const wallCol = candidates[Math.floor(Math.random() * candidates.length)];
      const passageRow = r0 + Math.floor(Math.random() * height);

      for (let r = r0; r < r1; r++) {
        if (r !== passageRow) setWall(r, wallCol);
      }

      divide(r0, c0, r1, wallCol, 'auto');
      divide(r0, wallCol + 1, r1, c1, 'auto');
    }
  };

  divide(0, 0, rows, cols, 'auto');

  next[s.row][s.col] = { row: s.row, col: s.col, type: CELL_TYPES.START };
  next[e.row][e.col] = { row: e.row, col: e.col, type: CELL_TYPES.END };

  return ensurePathExists(next, s, e);
};

export const getNeighbors = (cell, grid, rows, cols) => {
  const neighbors = [];
  const { row, col } = cell;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < rows - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < cols - 1) neighbors.push(grid[row][col + 1]);
  return neighbors.filter((n) => n.type !== CELL_TYPES.WALL);
};

/** Manhattan distance — admissible heuristic for 4-directional grids. */
export const heuristic = (a, b) => Math.abs(a.row - b.row) + Math.abs(a.col - b.col);

export const cloneGrid = (grid) => grid.map((row) => row.map((cell) => ({ ...cell })));

export const updateCell = (grid, row, col, patch) => {
  const next = grid.map((r) => r.slice());
  next[row] = next[row].slice();
  next[row][col] = { ...next[row][col], ...patch };
  return next;
};

export const setCellType = (grid, row, col, type) => updateCell(grid, row, col, { type });

export const findCellOfType = (grid, type) => {
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      if (grid[r][c].type === type) return { row: r, col: c };
    }
  }
  return null;
};
