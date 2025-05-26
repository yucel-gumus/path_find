'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { createGrid, clearPathAndVisited, generateRandomWalls } from './gridHelpers';
import { dijkstra, aStar } from './pathfindingAlgorithms';

const AlgorithmSimulator = () => {
  const [grid, setGrid] = useState([]);
  const [rows, setRows] = useState(15);
  const [cols, setCols] = useState(15);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [algorithm, setAlgorithm] = useState('astar');
  const [wallDensity, setWallDensity] = useState(20);
  
  const [startNode, setStartNode] = useState({ row: 0, col: 0 });
  const [endNode, setEndNode] = useState({ row: 14, col: 14 });

  const [isDrawing, setIsDrawing] = useState(false);
  const [dragType, setDragType] = useState(null);
  const [pathFound, setPathFound] = useState(true);
  
  const animationTimeoutsRef = useRef([]);

  const initializeGrid = useCallback(() => {
    const newStartNode = { row: 0, col: 0 };
    const newEndNode = { row: Math.max(0, rows - 1), col: Math.max(0, cols - 1) };
    
    setStartNode(newStartNode);
    setEndNode(newEndNode);

    const initialGrid = createGrid(rows, cols, wallDensity, newStartNode, newEndNode);
    setGrid(initialGrid);
    setPathFound(true);
  }, [rows, cols, wallDensity]);

  useEffect(() => {
    initializeGrid();
    
    return () => {
      animationTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    };
  }, [rows, cols, wallDensity, initializeGrid]);

  const handleResetGrid = () => {
    if (isRunning) return;
    animationTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    animationTimeoutsRef.current = [];
    initializeGrid();
  };

  const handleClearPath = () => {
    if (isRunning) return;
    animationTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    animationTimeoutsRef.current = [];
    setGrid(clearPathAndVisited(grid));
    setPathFound(true);
  };

  const handleGenerateWalls = () => {
    if (isRunning) return;
    setGrid(clearPathAndVisited(generateRandomWalls(grid, wallDensity)));
    setPathFound(true);
  };

  const handleMouseDown = (r, c) => {
    if (isRunning) return;

    const cell = grid[r][c];

    if (cell.type === 'start') {
      setDragType('start');
    } else if (cell.type === 'end') {
      setDragType('end');
    } else {
      setDragType('wall');
      setGrid(prevGrid => {
        const newGrid = prevGrid.map(row => [...row]);
        newGrid[r][c] = { ...newGrid[r][c], type: cell.type === 'wall' ? 'empty' : 'wall' };
        return newGrid;
      });
    }
    setIsDrawing(true);
  };

  const handleMouseEnter = (r, c) => {
    if (!isDrawing || isRunning) return;

    setGrid(prevGrid => {
      const newGrid = prevGrid.map(row => [...row]);
      const targetCell = newGrid[r][c];

      if (dragType === 'wall') {
        if (targetCell.type !== 'start' && targetCell.type !== 'end') {
          newGrid[r][c] = { ...targetCell, type: targetCell.type === 'wall' ? 'empty' : 'wall' };
        }
      } else if (dragType === 'start') {
        if (targetCell.type !== 'wall' && targetCell.type !== 'end') {
          newGrid[startNode.row][startNode.col] = { ...newGrid[startNode.row][startNode.col], type: 'empty' };
          newGrid[r][c] = { ...targetCell, type: 'start' };
          setStartNode({ row: r, col: c });
        }
      } else if (dragType === 'end') {
        if (targetCell.type !== 'wall' && targetCell.type !== 'start') {
          newGrid[endNode.row][endNode.col] = { ...newGrid[endNode.row][endNode.col], type: 'empty' };
          newGrid[r][c] = { ...targetCell, type: 'end' };
          setEndNode({ row: r, col: c });
        }
      }
      return newGrid;
    });
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    setDragType(null);
  };

  const animateAlgorithm = async () => {
    if (isRunning) return;

    setIsRunning(true);
    setPathFound(true);

    animationTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    animationTimeoutsRef.current = [];
    setGrid(clearPathAndVisited(grid));

    const gridCopy = grid.map(row => row.map(cell => ({ ...cell })));
    
    let result;
    if (algorithm === 'astar') {
      result = aStar(gridCopy, startNode, endNode, rows, cols);
    } else {
      result = dijkstra(gridCopy, startNode, endNode, rows, cols);
    }
    
    const { visitedNodesInOrder, path } = result;

    for (let i = 0; i < visitedNodesInOrder.length; i++) {
      const node = visitedNodesInOrder[i];
      if (node.row === startNode.row && node.col === startNode.col) continue;
      if (node.row === endNode.row && node.col === endNode.col) continue;

      const timeout = setTimeout(() => {
        setGrid(prevGrid => {
          const newGrid = prevGrid.map(row => [...row]);
          if (newGrid[node.row][node.col].type !== 'start' && newGrid[node.row][node.col].type !== 'end') {
            newGrid[node.row][node.col].type = 'visited';
          }
          return newGrid;
        });
      }, i * speed);
      animationTimeoutsRef.current.push(timeout);
    }
    
    if (path.length > 0) {
      const pathAnimationDelay = visitedNodesInOrder.length * speed;
      for (let i = 0; i < path.length; i++) {
        const node = path[i];
        const timeout = setTimeout(() => {
          setGrid(prevGrid => {
            const newGrid = prevGrid.map(row => [...row]);
            if (newGrid[node.row][node.col].type !== 'start' && newGrid[node.row][node.col].type !== 'end') {
              newGrid[node.row][node.col].type = 'path';
            }
            return newGrid;
          });
          
          if (i === path.length - 1) {
            setIsRunning(false);
          }
        }, pathAnimationDelay + i * speed * 2);
        animationTimeoutsRef.current.push(timeout);
      }
    } else {
      const timeout = setTimeout(() => {
        setPathFound(false);
        setIsRunning(false);
      }, visitedNodesInOrder.length * speed);
      animationTimeoutsRef.current.push(timeout);
    }
  };

  return (
    <motion.div 
      className="w-full max-w-lg mx-auto bg-[#0F172A] rounded-lg overflow-hidden shadow-2xl border border-[#334155]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onMouseLeave={handleMouseUp}
      onMouseUp={handleMouseUp}
    >
      <div className="flex items-center justify-between bg-[#1E293B] p-3">
        <div className="text-[#F8FAFC] font-medium">Pathfinding Algoritması</div>
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="mb-4 flex flex-wrap gap-2 justify-center">
          <select 
            className="bg-[#1E293B] text-[#F8FAFC] px-3 py-1 rounded border border-[#334155] text-sm focus:ring-blue-500 focus:border-blue-500"
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
            disabled={isRunning}
          >
            <option value="dijkstra">Dijkstra</option>
            <option value="astar">A* Algoritması</option>
          </select>
          
          <select 
            className="bg-[#1E293B] text-[#F8FAFC] px-3 py-1 rounded border border-[#334155] text-sm focus:ring-blue-500 focus:border-blue-500"
            value={wallDensity}
            onChange={(e) => setWallDensity(parseInt(e.target.value))}
            disabled={isRunning}
          >
            <option value="0">Engel Yok</option>
            <option value="10">Az Engel (%10)</option>
            <option value="20">Orta Engel (%20)</option>
            <option value="30">Çok Engel (%30)</option>
            <option value="40">Çok Fazla Engel (%40)</option>
          </select>
          
          <select 
            className="bg-[#1E293B] text-[#F8FAFC] px-3 py-1 rounded border border-[#334155] text-sm focus:ring-blue-500 focus:border-blue-500"
            value={speed}
            onChange={(e) => setSpeed(parseInt(e.target.value))}
            disabled={isRunning}
          >
            <option value="10">Çok Hızlı</option>
            <option value="50">Normal</option>
            <option value="100">Yavaş</option>
            <option value="200">Çok Yavaş</option>
          </select>

          <div className="flex items-center gap-2">
            <label htmlFor="rows" className="text-xs text-[#CBD5E1]">Boyut:</label>
            <input
              type="number"
              id="rows"
              value={rows}
              onChange={(e) => setRows(Math.max(5, Math.min(30, parseInt(e.target.value) || 5)))}
              className="w-16 bg-[#1E293B] text-[#F8FAFC] px-2 py-1 rounded border border-[#334155] text-sm text-center"
              disabled={isRunning}
              min="5"
              max="30"
            />
            <span className="text-[#CBD5E1] text-sm">x</span>
            <input
              type="number"
              id="cols"
              value={cols}
              onChange={(e) => setCols(Math.max(5, Math.min(30, parseInt(e.target.value) || 5)))}
              className="w-16 bg-[#1E293B] text-[#F8FAFC] px-2 py-1 rounded border border-[#334155] text-sm text-center"
              disabled={isRunning}
              min="5"
              max="30"
            />
          </div>
        </div>
        
        <div className="mb-4 text-xs text-[#CBD5E1] flex flex-wrap gap-x-4 gap-y-1 justify-center">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-700 rounded-sm mr-1"></div>
            <span>Başlangıç</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-700 rounded-sm mr-1"></div>
            <span>Hedef</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-800 rounded-sm mr-1"></div>
            <span>Engel</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-300 rounded-sm mr-1"></div>
            <span>Ziyaret Edilen</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-sm mr-1"></div>
            <span>En Kısa Yol</span>
          </div>
        </div>
        
        <div className="mb-4 bg-[#1E293B] p-2 rounded border border-[#334155] overflow-hidden" style={{ minWidth: '200px', minHeight: '200px' }}>
          <div 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: `repeat(${cols}, 1fr)`, 
              gap: '2px',
              width: '100%',
              aspectRatio: '1/1'
            }} 
            className="justify-center"
          >
            {grid.flat().map((cell) => {
              let bgColor = 'bg-[#0F172A]';
              if (cell.type === 'start') bgColor = 'bg-blue-700';
              else if (cell.type === 'end') bgColor = 'bg-red-700';
              else if (cell.type === 'wall') bgColor = 'bg-gray-800';
              else if (cell.type === 'visited') bgColor = 'bg-yellow-300';
              else if (cell.type === 'path') bgColor = 'bg-green-500';
              
              const cellKey = `${cell.row}-${cell.col}`;
              return (
                <div 
                  key={cellKey} 
                  className={`${bgColor} rounded-sm transition-colors duration-200 aspect-square`}
                  onMouseDown={() => handleMouseDown(cell.row, cell.col)}
                  onMouseEnter={() => handleMouseEnter(cell.row, cell.col)}
                ></div>
              );
            })}
          </div>
        </div>
        {!pathFound && !isRunning && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 p-2 bg-red-800 text-white text-sm text-center rounded"
          >
            Yol Bulunamadı!
          </motion.div>
        )}

        <div className="flex flex-wrap justify-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-gradient-to-r from-[#0EA5E9] to-[#0369A1] text-white rounded font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={animateAlgorithm}
            disabled={isRunning}
          >
            {isRunning ? 'Çalışıyor...' : 'Algoritmayı Çalıştır'}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-[#334155] text-white rounded font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleClearPath}
            disabled={isRunning}
          >
            Yolu Temizle
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-[#334155] text-white rounded font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleGenerateWalls}
            disabled={isRunning}
          >
            Rastgele Duvarlar
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-[#334155] text-white rounded font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleResetGrid}
            disabled={isRunning}
          >
            Grid'i Sıfırla
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default AlgorithmSimulator;