import {
  createEmptyGrid,
  createGrid,
  heuristic,
  hasPath,
  generateRandomWalls,
  generateMaze,
} from '../data/gridHelpers';
import { bfs } from './bfs';
import { dijkstra } from './dijkstra';
import { aStar } from './astar';
import { dfs } from './dfs';
import { greedyBestFirst } from './greedy';
import { bidirectionalBFS } from './bidirectional';
import { runAlgorithm } from './index';

const size = 10;
const start = { row: 0, col: 0 };
const end = { row: 9, col: 9 };

const emptyGrid = () => createEmptyGrid(size, size, start, end);

describe('heuristic', () => {
  test('manhattan distance', () => {
    expect(heuristic(start, end)).toBe(18);
    expect(heuristic(start, start)).toBe(0);
  });
});

describe('optimal algorithms on empty grid', () => {
  const grid = emptyGrid();
  const expectedLength = heuristic(start, end); // 18 steps

  test.each([
    ['bfs', bfs],
    ['dijkstra', dijkstra],
    ['astar', aStar],
    ['bidirectional', bidirectionalBFS],
  ])('%s finds shortest path length %i', (name, fn) => {
    const { path } = fn(grid, start, end, size, size);
    expect(path.length).toBeGreaterThan(0);
    expect(path.length - 1).toBe(expectedLength);
    expect(path[0]).toEqual(start);
    expect(path[path.length - 1]).toEqual(end);
  });
});

describe('path continuity', () => {
  test('bfs path moves only to 4-neighbors', () => {
    const grid = emptyGrid();
    const { path } = bfs(grid, start, end, size, size);
    for (let i = 1; i < path.length; i++) {
      const dr = Math.abs(path[i].row - path[i - 1].row);
      const dc = Math.abs(path[i].col - path[i - 1].col);
      expect(dr + dc).toBe(1);
    }
  });
});

describe('blocked grid', () => {
  test('returns empty path when walled off', () => {
    const grid = emptyGrid();
    // Vertical wall separating left and right
    for (let r = 0; r < size; r++) {
      grid[r][5] = { row: r, col: 5, type: 'wall' };
    }
    const localStart = { row: 0, col: 0 };
    const localEnd = { row: 0, col: 9 };
    grid[0][0] = { row: 0, col: 0, type: 'start' };
    grid[0][9] = { row: 0, col: 9, type: 'end' };

    const { path } = bfs(grid, localStart, localEnd, size, size);
    expect(path).toEqual([]);
  });
});

describe('start equals end', () => {
  test('all algorithms return single-node path', () => {
    const grid = emptyGrid();
    const s = { row: 3, col: 3 };
    const runners = [bfs, dijkstra, aStar, dfs, greedyBestFirst, bidirectionalBFS];
    for (const fn of runners) {
      const { path } = fn(grid, s, s, size, size);
      expect(path).toEqual([s]);
    }
  });
});

describe('adjacent start-end', () => {
  test('bidirectional and bfs agree', () => {
    const grid = emptyGrid();
    const s = { row: 0, col: 0 };
    const e = { row: 0, col: 1 };
    grid[0][0] = { row: 0, col: 0, type: 'start' };
    grid[0][1] = { row: 0, col: 1, type: 'end' };

    const a = bfs(grid, s, e, size, size);
    const b = bidirectionalBFS(grid, s, e, size, size);
    expect(a.path.length - 1).toBe(1);
    expect(b.path.length - 1).toBe(1);
  });
});

describe('non-optimal still find a path', () => {
  test('dfs and greedy find some path on empty grid', () => {
    const grid = emptyGrid();
    for (const fn of [dfs, greedyBestFirst]) {
      const { path } = fn(grid, start, end, size, size);
      expect(path.length).toBeGreaterThan(0);
      expect(path[0]).toEqual(start);
      expect(path[path.length - 1]).toEqual(end);
    }
  });
});

describe('runAlgorithm registry', () => {
  test('dispatches known ids', () => {
    const grid = emptyGrid();
    const result = runAlgorithm('bfs', grid, start, end, size, size);
    expect(result.path.length - 1).toBe(18);
  });

  test('unknown id falls back to astar', () => {
    const grid = emptyGrid();
    const result = runAlgorithm('nope', grid, start, end, size, size);
    expect(result.path.length - 1).toBe(18);
  });
});

describe('createGrid walls', () => {
  test('never walls start or end', () => {
    const grid = createGrid(8, 8, 100, start, { row: 7, col: 7 }, true);
    expect(grid[0][0].type).toBe('start');
    expect(grid[7][7].type).toBe('end');
  });
});

describe('solvable wall and maze generation', () => {
  test('generateRandomWalls always leaves a path (high density)', () => {
    const g = createEmptyGrid(size, size, start, end);
    for (let i = 0; i < 20; i++) {
      const walled = generateRandomWalls(g, 90, start, end);
      expect(hasPath(walled, start, end)).toBe(true);
    }
  });

  test('generateMaze always leaves a path', () => {
    const g = createEmptyGrid(size, size, start, end);
    for (let i = 0; i < 15; i++) {
      const maze = generateMaze(g, start, end);
      expect(hasPath(maze, start, end)).toBe(true);
    }
  });

  test('bfs finds a path on generated maze', () => {
    const g = createEmptyGrid(size, size, start, end);
    const maze = generateMaze(g, start, end);
    const { path } = bfs(maze, start, end, size, size);
    expect(path.length).toBeGreaterThan(0);
  });
});
