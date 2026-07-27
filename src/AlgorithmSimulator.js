import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  createEmptyGrid,
  clearPathAndVisited,
  generateRandomWalls,
  generateMaze,
} from './data/gridHelpers';
import { DEFAULT_ROWS, DEFAULT_COLS } from './constants';
import { usePathAnimation } from './hooks/usePathAnimation';
import { useGridInteraction } from './hooks/useGridInteraction';
import ControlPanel from './components/ControlPanel';
import Grid from './components/Grid';
import TutorialModal from './components/TutorialModal';
import StatsBar from './components/StatsBar';

const defaultCorners = (size) => ({
  start: { row: 0, col: 0 },
  end: { row: size - 1, col: size - 1 },
});

export default function AlgorithmSimulator() {
  const [gridSize, setGridSize] = useState(DEFAULT_ROWS);
  const [rows, setRows] = useState(DEFAULT_ROWS);
  const [cols, setCols] = useState(DEFAULT_COLS);
  const [grid, setGrid] = useState([]);
  const [startNode, setStartNode] = useState({ row: 0, col: 0 });
  const [endNode, setEndNode] = useState({ row: DEFAULT_ROWS - 1, col: DEFAULT_COLS - 1 });

  const [algorithm, setAlgorithm] = useState('astar');
  const [wallDensity, setWallDensity] = useState(20);
  const [speed, setSpeed] = useState(50);
  const [showTutorial, setShowTutorial] = useState(true);

  const { isRunning, pathFound, setPathFound, stats, setStats, run, stop, clearTimer } =
    usePathAnimation({
      grid,
      setGrid,
      startNode,
      endNode,
      rows,
      cols,
      speed,
    });

  const { onPointerDown, onPointerEnter, onPointerUp } = useGridInteraction({
    grid,
    setGrid,
    startNode,
    setStartNode,
    endNode,
    setEndNode,
    isRunning,
  });

  const rebuildGrid = useCallback(
    (size, { withRandomWalls = false, density = wallDensity } = {}) => {
      const { start, end } = defaultCorners(size);
      setStartNode(start);
      setEndNode(end);
      setRows(size);
      setCols(size);

      let next = createEmptyGrid(size, size, start, end);
      if (withRandomWalls && density > 0) {
        next = generateRandomWalls(next, density, start, end);
      }
      setGrid(next);
      setPathFound(true);
      setStats(null);
    },
    [wallDensity, setPathFound, setStats]
  );

  useEffect(() => {
    rebuildGrid(DEFAULT_ROWS, { withRandomWalls: true });
    return () => {
      clearTimer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGridSizeChange = (size) => {
    if (isRunning) return;
    stop();
    setGridSize(size);
    rebuildGrid(size, { withRandomWalls: false });
  };

  const handleReset = () => {
    if (isRunning) return;
    clearTimer();
    rebuildGrid(gridSize, { withRandomWalls: false });
  };

  const handleClearPath = () => {
    if (isRunning) return;
    clearTimer();
    setGrid((g) => clearPathAndVisited(g));
    setPathFound(true);
    setStats(null);
  };

  const handleRandomWalls = () => {
    if (isRunning) return;
    setGrid((g) => {
      const cleaned = clearPathAndVisited(g);
      return generateRandomWalls(cleaned, wallDensity, startNode, endNode);
    });
    setPathFound(true);
    setStats(null);
  };

  const handleMaze = () => {
    if (isRunning) return;
    setGrid((g) => {
      const cleaned = clearPathAndVisited(g);
      return generateMaze(cleaned, startNode, endNode);
    });
    setPathFound(true);
    setStats(null);
  };

  return (
    <motion.div
      className="app-shell"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Header — cream dominant with mint accent mark */}
      <header className="shrink-0 flex items-center justify-between gap-3 px-4 sm:px-5 py-3.5 border-b border-cream-200/90 bg-white/40">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-9 h-9 rounded-xl bg-mint-100 border border-mint-200 flex items-center justify-center shadow-soft shrink-0"
            aria-hidden
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-mint-800">
              <path
                d="M4 20V10l8-6 8 6v10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path
                d="M9 20v-6h6v6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="min-w-0">
            <h1 className="text-ink font-bold text-sm sm:text-base tracking-tight truncate">
              Pathfinding Algoritması Simülatörü
            </h1>
            <p className="text-[11px] text-ink-muted hidden sm:block mt-0.5">
              Duvar çiz · start / end sürükle · algoritmayı izle
            </p>
          </div>
        </div>

        <button
          type="button"
          className="shrink-0 text-sm font-semibold text-coral-800 px-3 py-1.5 rounded-full bg-coral-50 border border-coral-100 hover:bg-coral-100 transition-colors"
          onClick={() => setShowTutorial(true)}
        >
          Nasıl kullanılır?
        </button>
      </header>

      <AnimatePresence>
        {showTutorial && (
          <TutorialModal open={showTutorial} onClose={() => setShowTutorial(false)} />
        )}
      </AnimatePresence>

      <div className="flex-1 p-3 sm:p-4 flex flex-col sm:flex-row gap-3 min-h-0 overflow-hidden">
        <ControlPanel
          algorithm={algorithm}
          setAlgorithm={setAlgorithm}
          wallDensity={wallDensity}
          setWallDensity={setWallDensity}
          speed={speed}
          setSpeed={setSpeed}
          gridSize={gridSize}
          setGridSize={handleGridSizeChange}
          isRunning={isRunning}
          onRun={() => run(algorithm)}
          onStop={stop}
          onClearPath={handleClearPath}
          onRandomWalls={handleRandomWalls}
          onMaze={handleMaze}
          onReset={handleReset}
        />

        <div className="flex-1 flex flex-col min-w-0 min-h-0">
          <Grid
            grid={grid}
            rows={rows}
            cols={cols}
            onPointerDown={onPointerDown}
            onPointerEnter={onPointerEnter}
            onPointerUp={onPointerUp}
          />
          <StatsBar stats={stats} pathFound={pathFound} isRunning={isRunning} />
        </div>
      </div>
    </motion.div>
  );
}
