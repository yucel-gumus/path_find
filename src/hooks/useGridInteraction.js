import { useCallback, useRef, useState } from 'react';
import { CELL_TYPES } from '../constants';

/**
 * Pointer-driven wall painting and start/end dragging.
 * Uses a paint mode (set wall / clear wall) instead of toggle-on-drag.
 */
export function useGridInteraction({
  grid,
  setGrid,
  startNode,
  setStartNode,
  endNode,
  setEndNode,
  isRunning,
}) {
  const [isDrawing, setIsDrawing] = useState(false);
  const dragTypeRef = useRef(null);
  const paintModeRef = useRef(null);
  const startRef = useRef(startNode);
  const endRef = useRef(endNode);

  startRef.current = startNode;
  endRef.current = endNode;

  const applyAt = useCallback(
    (r, c) => {
      const dragType = dragTypeRef.current;
      if (!dragType) return;

      setGrid((prev) => {
        if (!prev[r] || !prev[r][c]) return prev;
        const target = prev[r][c];
        const start = startRef.current;
        const end = endRef.current;

        if (dragType === 'wall') {
          if (target.type === CELL_TYPES.START || target.type === CELL_TYPES.END) {
            return prev;
          }
          const nextType = paintModeRef.current;
          if (target.type === nextType) return prev;

          const next = prev.map((row) => row.slice());
          next[r][c] = { ...target, type: nextType };
          return next;
        }

        if (dragType === 'start') {
          if (
            target.type === CELL_TYPES.WALL ||
            (target.row === end.row && target.col === end.col)
          ) {
            return prev;
          }
          if (target.row === start.row && target.col === start.col) return prev;

          const next = prev.map((row) => row.slice());
          next[start.row][start.col] = {
            ...next[start.row][start.col],
            type: CELL_TYPES.EMPTY,
          };
          next[r][c] = { ...next[r][c], type: CELL_TYPES.START };
          const newStart = { row: r, col: c };
          startRef.current = newStart;
          setStartNode(newStart);
          return next;
        }

        if (dragType === 'end') {
          if (
            target.type === CELL_TYPES.WALL ||
            (target.row === start.row && target.col === start.col)
          ) {
            return prev;
          }
          if (target.row === end.row && target.col === end.col) return prev;

          const next = prev.map((row) => row.slice());
          next[end.row][end.col] = {
            ...next[end.row][end.col],
            type: CELL_TYPES.EMPTY,
          };
          next[r][c] = { ...next[r][c], type: CELL_TYPES.END };
          const newEnd = { row: r, col: c };
          endRef.current = newEnd;
          setEndNode(newEnd);
          return next;
        }

        return prev;
      });
    },
    [setGrid, setStartNode, setEndNode]
  );

  const onPointerDown = useCallback(
    (r, c, e) => {
      if (isRunning) return;
      e?.preventDefault?.();

      const cell = grid[r]?.[c];
      if (!cell) return;

      if (cell.type === CELL_TYPES.START) {
        dragTypeRef.current = 'start';
        paintModeRef.current = null;
      } else if (cell.type === CELL_TYPES.END) {
        dragTypeRef.current = 'end';
        paintModeRef.current = null;
      } else {
        dragTypeRef.current = 'wall';
        paintModeRef.current =
          cell.type === CELL_TYPES.WALL ? CELL_TYPES.EMPTY : CELL_TYPES.WALL;
        applyAt(r, c);
      }

      setIsDrawing(true);
    },
    [isRunning, grid, applyAt]
  );

  const onPointerEnter = useCallback(
    (r, c) => {
      if (!isDrawing || isRunning || !dragTypeRef.current) return;
      applyAt(r, c);
    },
    [isDrawing, isRunning, applyAt]
  );

  const onPointerUp = useCallback(() => {
    setIsDrawing(false);
    dragTypeRef.current = null;
    paintModeRef.current = null;
  }, []);

  return {
    isDrawing,
    onPointerDown,
    onPointerEnter,
    onPointerUp,
  };
}
