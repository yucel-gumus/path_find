import React, { memo } from 'react';
import { CELL_TYPES, CELL_LABELS } from '../constants';

/**
 * Grid cell palette (readable on cream canvas):
 * empty  → warm white
 * wall   → deep coral-brown
 * visited→ soft coral (30%)
 * path   → mint accent (10%)
 * start  → deep mint
 * end    → deep coral
 */
const TYPE_CLASS = {
  [CELL_TYPES.START]:
    'bg-mint-300 shadow-[inset_0_0_0_2px_rgba(61,107,95,0.35)] hover:brightness-110',
  [CELL_TYPES.END]:
    'bg-coral-300 shadow-[inset_0_0_0_2px_rgba(139,74,60,0.35)] hover:brightness-110',
  [CELL_TYPES.WALL]: 'bg-coral-900 hover:bg-coral-800',
  [CELL_TYPES.VISITED]: 'bg-coral-100 animate-visited',
  [CELL_TYPES.PATH]: 'bg-mint-100 animate-path shadow-sm',
  [CELL_TYPES.EMPTY]: 'bg-[#FFFDF9] hover:bg-cream-200/80 border border-cream-200/60',
};

function Cell({ row, col, type, onPointerDown, onPointerEnter, onHover, onLeave }) {
  const bg = TYPE_CLASS[type] || TYPE_CLASS[CELL_TYPES.EMPTY];
  const label = CELL_LABELS[type] || CELL_LABELS.empty;

  return (
    <div
      role="gridcell"
      aria-label={`${label}, satır ${row}, sütun ${col}`}
      tabIndex={-1}
      className={`cell-base ${bg}`}
      onPointerDown={(e) => onPointerDown(row, col, e)}
      onPointerEnter={() => {
        onPointerEnter(row, col);
        onHover?.({ row, col, type });
      }}
      onPointerLeave={() => onLeave?.()}
    />
  );
}

function areEqual(prev, next) {
  return (
    prev.row === next.row &&
    prev.col === next.col &&
    prev.type === next.type &&
    prev.onPointerDown === next.onPointerDown &&
    prev.onPointerEnter === next.onPointerEnter
  );
}

export default memo(Cell, areEqual);
