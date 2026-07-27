import React, { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Cell from './Cell';
import { CELL_LABELS } from '../constants';

export default function Grid({
  grid,
  rows,
  cols,
  onPointerDown,
  onPointerEnter,
  onPointerUp,
}) {
  const [tooltip, setTooltip] = useState(null);

  const handleHover = useCallback((cell) => setTooltip(cell), []);
  const handleLeave = useCallback(() => setTooltip(null), []);

  if (!grid.length) {
    return (
      <div className="flex-1 flex items-center justify-center panel min-h-0">
        <p className="text-sm text-ink-muted animate-pulse">Grid hazırlanıyor…</p>
      </div>
    );
  }

  return (
    <div
      className="flex-1 panel p-3 sm:p-4 relative min-h-0 flex flex-col"
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      <div className="flex-1 flex items-center justify-center min-h-0">
        <div
          role="grid"
          aria-label={`Yol bulma ızgarası ${rows}x${cols}`}
          aria-rowcount={rows}
          aria-colcount={cols}
          className="rounded-xl p-1 bg-cream-200/40 shadow-inner"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gap: '2px',
            width: 'min(100%, calc(98vh - 160px))',
            height: 'min(100%, calc(98vh - 160px))',
            maxWidth: '100%',
            maxHeight: '100%',
          }}
        >
          {grid.map((row) =>
            row.map((cell) => (
              <Cell
                key={`${cell.row}-${cell.col}`}
                row={cell.row}
                col={cell.col}
                type={cell.type}
                onPointerDown={onPointerDown}
                onPointerEnter={onPointerEnter}
                onHover={handleHover}
                onLeave={handleLeave}
              />
            ))
          )}
        </div>
      </div>

      <AnimatePresence>
        {tooltip && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="absolute left-1/2 -translate-x-1/2 bottom-3 z-10 pointer-events-none"
          >
            <div className="px-3 py-1.5 rounded-full text-xs font-medium text-ink bg-white/95 border border-cream-200 shadow-soft">
              {CELL_LABELS[tooltip.type] || 'Hücre'}
              <span className="text-ink-soft ml-1.5">
                ({tooltip.row}, {tooltip.col})
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
