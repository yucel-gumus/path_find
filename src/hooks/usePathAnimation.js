import { useCallback, useRef, useState } from 'react';
import { CELL_TYPES } from '../constants';
import { clearPathAndVisited, cloneGrid } from '../data/gridHelpers';
import { runAlgorithm } from '../algorithms';

/**
 * Runs a pathfinding algorithm and animates visited nodes + path.
 * Uses a single chained timer (abortable) instead of N setTimeouts.
 */
export function usePathAnimation({ grid, setGrid, startNode, endNode, rows, cols, speed }) {
  const [isRunning, setIsRunning] = useState(false);
  const [pathFound, setPathFound] = useState(true);
  const [stats, setStats] = useState(null);
  const abortRef = useRef(false);
  const timerRef = useRef(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current != null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    abortRef.current = true;
    clearTimer();
    setIsRunning(false);
  }, [clearTimer]);

  const sleep = useCallback(
    (ms) =>
      new Promise((resolve) => {
        timerRef.current = setTimeout(() => {
          timerRef.current = null;
          resolve();
        }, ms);
      }),
    []
  );

  const run = useCallback(
    async (algorithmId) => {
      if (isRunning) return;

      abortRef.current = false;
      setIsRunning(true);
      setPathFound(true);
      setStats(null);
      clearTimer();

      const cleaned = clearPathAndVisited(grid);
      setGrid(cleaned);

      const gridCopy = cloneGrid(cleaned);
      const t0 = performance.now();
      const { visitedNodesInOrder, path } = runAlgorithm(
        algorithmId,
        gridCopy,
        startNode,
        endNode,
        rows,
        cols
      );
      const computeMs = performance.now() - t0;

      // Paint visited
      for (let i = 0; i < visitedNodesInOrder.length; i++) {
        if (abortRef.current) {
          setIsRunning(false);
          return;
        }
        const node = visitedNodesInOrder[i];
        setGrid((prev) => {
          const cell = prev[node.row]?.[node.col];
          if (!cell || cell.type === CELL_TYPES.START || cell.type === CELL_TYPES.END) {
            return prev;
          }
          if (cell.type === CELL_TYPES.VISITED || cell.type === CELL_TYPES.PATH) {
            return prev;
          }
          const next = prev.map((row) => row.slice());
          next[node.row] = next[node.row].slice();
          next[node.row][node.col] = { ...cell, type: CELL_TYPES.VISITED };
          return next;
        });
        if (speed > 0) await sleep(speed);
      }

      if (abortRef.current) {
        setIsRunning(false);
        return;
      }

      if (path.length > 0) {
        for (let i = 0; i < path.length; i++) {
          if (abortRef.current) {
            setIsRunning(false);
            return;
          }
          const node = path[i];
          setGrid((prev) => {
            const cell = prev[node.row]?.[node.col];
            if (!cell || cell.type === CELL_TYPES.START || cell.type === CELL_TYPES.END) {
              return prev;
            }
            const next = prev.map((row) => row.slice());
            next[node.row] = next[node.row].slice();
            next[node.row][node.col] = { ...cell, type: CELL_TYPES.PATH };
            return next;
          });
          if (speed > 0) await sleep(Math.max(speed * 1.5, 10));
        }
        setPathFound(true);
      } else {
        setPathFound(false);
      }

      // Path length in steps (edges) = nodes - 1; single cell = 0
      const pathLength = path.length > 0 ? Math.max(path.length - 1, 0) : null;

      setStats({
        visited: visitedNodesInOrder.length,
        pathLength,
        pathNodes: path.length,
        computeMs: Math.round(computeMs * 100) / 100,
        found: path.length > 0,
      });

      setIsRunning(false);
    },
    [isRunning, grid, setGrid, startNode, endNode, rows, cols, speed, clearTimer, sleep]
  );

  return { isRunning, pathFound, setPathFound, stats, setStats, run, stop, clearTimer };
}
