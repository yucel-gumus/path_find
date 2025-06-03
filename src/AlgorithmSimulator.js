'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createGrid, clearPathAndVisited, generateRandomWalls } from './gridHelpers';
import { dijkstra, aStar, bfs, dfs, greedyBestFirst, bidirectionalBFS } from './pathfindingAlgorithms';

const AlgorithmSimulator = () => {
  const [grid, setGrid] = useState([]);
  const rows = 20;
  const cols = 20;
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [algorithm, setAlgorithm] = useState('astar');
  const [wallDensity, setWallDensity] = useState(20);
  
  const [startNode, setStartNode] = useState({ row: 0, col: 0 });
  const [endNode, setEndNode] = useState({ row: 19, col: 19 });

  const [isDrawing, setIsDrawing] = useState(false);
  const [dragType, setDragType] = useState(null);
  const [pathFound, setPathFound] = useState(true);
  
  const [selectedCell, setSelectedCell] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);

  const animationTimeoutsRef = useRef([]);

  const initializeGrid = useCallback((addWalls = true) => {
    const newStartNode = { row: 0, col: 0 };
    const newEndNode = { row: 19, col: 19 };
    
    setStartNode(newStartNode);
    setEndNode(newEndNode);

    const initialGrid = createGrid(20, 20, wallDensity, newStartNode, newEndNode, addWalls);
    setGrid(initialGrid);
    setPathFound(true);
  }, [wallDensity]);

  useEffect(() => {
    initializeGrid();
    
    return () => {
      animationTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    };
  }, [wallDensity, initializeGrid]);

  const handleResetGrid = () => {
    if (isRunning) return;
    animationTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    animationTimeoutsRef.current = [];
    initializeGrid(false);
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
    switch (algorithm) {
      case 'astar':
        result = aStar(gridCopy, startNode, endNode, rows, cols);
        break;
      case 'dijkstra':
        result = dijkstra(gridCopy, startNode, endNode, rows, cols);
        break;
      case 'bfs':
        result = bfs(gridCopy, startNode, endNode, rows, cols);
        break;
      case 'dfs':
        result = dfs(gridCopy, startNode, endNode, rows, cols);
        break;
      case 'greedy':
        result = greedyBestFirst(gridCopy, startNode, endNode, rows, cols);
        break;
      case 'bidirectional':
        result = bidirectionalBFS(gridCopy, startNode, endNode, rows, cols);
        break;
      default:
        result = aStar(gridCopy, startNode, endNode, rows, cols);
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

  const handleCellHover = (cell) => {
    setSelectedCell(cell);
    setShowTooltip(true);
  };

  const handleCellLeave = () => {
    setShowTooltip(false);
  };

  const getNodeType = (type) => {
    switch(type) {
      case 'start': return 'Başlangıç Noktası';
      case 'end': return 'Hedef Noktası';
      case 'wall': return 'Engel';
      case 'visited': return 'Ziyaret Edildi';
      case 'path': return 'En Kısa Yol';
      default: return 'Boş Hücre';
    }
  };

  return (
    <motion.div 
      className="w-[98vw] h-[98vh] mx-auto bg-[#0F172A] rounded-lg overflow-hidden shadow-2xl border border-[#334155] flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onMouseLeave={handleMouseUp}
      onMouseUp={handleMouseUp}
    >
      <div className="flex items-center justify-between bg-[#1E293B] p-2">
        <div className="text-[#F8FAFC] font-medium">Pathfinding Algoritması Simülatörü</div>
        <div className="flex items-center gap-4">
          <button
            className="text-[#CBD5E1] text-sm hover:text-white transition-colors"
            onClick={() => setShowTutorial(true)}
          >
            Nasıl Kullanılır?
          </button>
          <div className="flex space-x-2">
            <motion.div whileHover={{ scale: 1.2 }} className="w-2 h-2 rounded-full bg-red-500"></motion.div>
            <motion.div whileHover={{ scale: 1.2 }} className="w-2 h-2 rounded-full bg-yellow-500"></motion.div>
            <motion.div whileHover={{ scale: 1.2 }} className="w-2 h-2 rounded-full bg-green-500"></motion.div>
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        {showTutorial && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowTutorial(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#1E293B] rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto custom-scrollbar"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-[#F8FAFC]">Nasıl Kullanılır?</h2>
                <button
                  onClick={() => setShowTutorial(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-6 text-[#CBD5E1]">
                <div>
                  <h3 className="text-lg font-medium text-[#F8FAFC] mb-2">🎯 Temel Bilgiler</h3>
                  <p className="text-sm leading-relaxed">
                    Bu uygulama, farklı yol bulma algoritmalarının çalışma şeklini görsel olarak göstermenizi sağlar.
                    Grid üzerinde başlangıç noktası (mavi), hedef noktası (kırmızı) ve engeller (siyah) bulunur.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-[#F8FAFC] mb-2">🔄 Grid Kontrolü</h3>
                  <ul className="list-disc list-inside text-sm space-y-2">
                    <li>Grid üzerinde <span className="text-blue-400">tıklayıp sürükleyerek</span> engeller oluşturabilirsiniz</li>
                    <li><span className="text-blue-400">Başlangıç</span> ve <span className="text-red-400">hedef</span> noktalarını sürükleyerek yerlerini değiştirebilirsiniz</li>
                    <li>"Rastgele Duvarlar" butonu ile rastgele engeller oluşturabilirsiniz</li>
                    <li>"Grid'i Sıfırla" butonu ile tüm engelleri kaldırabilirsiniz</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-[#F8FAFC] mb-2">🔍 Algoritmalar</h3>
                  <div className="space-y-3 text-sm">
                    <p><span className="font-medium text-[#F8FAFC]">A* Algoritması:</span> En iyi ilk arama algoritmasıdır. Hedef odaklı çalışır ve genellikle en kısa yolu bulur.</p>
                    <p><span className="font-medium text-[#F8FAFC]">Dijkstra Algoritması:</span> En kısa yolu garantileyen, ancak hedef odaklı olmayan bir algoritma.</p>
                    <p><span className="font-medium text-[#F8FAFC]">BFS (Breadth-First Search):</span> Grafiği katman katman dolaşır ve en kısa yolu garanti eder.</p>
                    <p><span className="font-medium text-[#F8FAFC]">DFS (Depth-First Search):</span> Grafiği derinlemesine dolaşır, en kısa yolu garanti etmez.</p>
                    <p><span className="font-medium text-[#F8FAFC]">Greedy Best-First:</span> Sadece hedefe olan mesafeyi dikkate alır, hızlıdır ama en kısa yolu garanti etmez.</p>
                    <p><span className="font-medium text-[#F8FAFC]">Bidirectional BFS:</span> İki noktadan eşzamanlı BFS çalıştırır, genellikle daha hızlıdır.</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-[#F8FAFC] mb-2">⚙️ Ayarlar</h3>
                  <ul className="list-disc list-inside text-sm space-y-2">
                    <li>Engel yoğunluğunu %0 ile %40 arasında ayarlayabilirsiniz</li>
                    <li>Animasyon hızını çok hızlıdan çok yavaşa kadar ayarlayabilirsiniz</li>
                    <li>Grid boyutu 20x20 olarak sabittir</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-[#F8FAFC] mb-2">🎨 Renk Kodları</h3>
                  <ul className="list-none text-sm space-y-2">
                    <li className="flex items-center"><div className="w-4 h-4 bg-blue-600 rounded-sm mr-2"></div>Başlangıç noktası</li>
                    <li className="flex items-center"><div className="w-4 h-4 bg-red-600 rounded-sm mr-2"></div>Hedef noktası</li>
                    <li className="flex items-center"><div className="w-4 h-4 bg-black rounded-sm mr-2"></div>Engeller</li>
                    <li className="flex items-center"><div className="w-4 h-4 bg-yellow-400 rounded-sm mr-2"></div>Ziyaret edilen hücreler</li>
                    <li className="flex items-center"><div className="w-4 h-4 bg-green-500 rounded-sm mr-2"></div>Bulunan en kısa yol</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-[#334155]">
                <button
                  onClick={() => setShowTutorial(false)}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                >
                  Anladım
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="flex-1 p-2 flex gap-2 h-full overflow-hidden">
        {/* Sol Panel - Kontroller */}
        <div className="w-64 flex flex-col gap-2 bg-[#1E293B] p-3 rounded-lg">
          <div className="space-y-3">
            <div className="flex flex-col space-y-2">
              <label className="text-[#CBD5E1] text-sm">Algoritma Seçimi</label>
              <select 
                className="w-full bg-[#0F172A] text-[#F8FAFC] px-2 py-1.5 rounded border border-[#334155] focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm"
                value={algorithm}
                onChange={(e) => setAlgorithm(e.target.value)}
                disabled={isRunning}
              >
                <option value="astar">A* Algoritması</option>
                <option value="dijkstra">Dijkstra Algoritması</option>
                <option value="bfs">Breadth-First Search (BFS)</option>
                <option value="dfs">Depth-First Search (DFS)</option>
                <option value="greedy">Greedy Best-First Search</option>
                <option value="bidirectional">Bidirectional BFS</option>
              </select>
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-[#CBD5E1] text-sm">Engel Yoğunluğu</label>
              <select 
                className="w-full bg-[#0F172A] text-[#F8FAFC] px-2 py-1.5 rounded border border-[#334155] focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm"
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
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-[#CBD5E1] text-sm">Animasyon Hızı</label>
              <select 
                className="w-full bg-[#0F172A] text-[#F8FAFC] px-2 py-1.5 rounded border border-[#334155] focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm"
                value={speed}
                onChange={(e) => setSpeed(parseInt(e.target.value))}
                disabled={isRunning}
              >
                <option value="10">Çok Hızlı</option>
                <option value="50">Normal</option>
                <option value="100">Yavaş</option>
                <option value="200">Çok Yavaş</option>
              </select>
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-[#CBD5E1] text-sm">Grid Boyutu</label>
              <div className="bg-[#0F172A] text-[#F8FAFC] px-3 py-2 rounded border border-[#334155] text-center text-sm">
                20 × 20
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              onClick={animateAlgorithm}
              disabled={isRunning}
            >
              {isRunning ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Çalışıyor...</span>
                </div>
              ) : (
                'Algoritmayı Çalıştır'
              )}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-4 py-2.5 bg-[#334155] text-white rounded font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleClearPath}
              disabled={isRunning}
            >
              Yolu Temizle
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-4 py-2.5 bg-[#334155] text-white rounded font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleGenerateWalls}
              disabled={isRunning}
            >
              Rastgele Duvarlar
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-4 py-2.5 bg-[#334155] text-white rounded font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleResetGrid}
              disabled={isRunning}
            >
              Grid'i Sıfırla
            </motion.button>
          </div>

          <div className="mt-4">
            <div className="flex flex-wrap gap-1.5 justify-center bg-[#0F172A] p-2 rounded">
              {[
                { color: 'bg-blue-600', text: 'Başlangıç' },
                { color: 'bg-red-600', text: 'Hedef' },
                { color: 'bg-black', text: 'Engel' },
                { color: 'bg-yellow-400', text: 'Ziyaret' },
                { color: 'bg-green-500', text: 'En Kısa Yol' }
              ].map(({ color, text }) => (
                <div key={text} className="flex items-center px-1.5 py-0.5 rounded text-[10px]">
                  <div className={`w-2 h-2 ${color} rounded-sm mr-1.5`}></div>
                  <span className="text-[#CBD5E1]">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sağ Panel - Grid */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 bg-[#1E293B] p-3 rounded-lg relative">
            <div className="h-full flex items-center justify-center">
              <div 
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(20, 1fr)', 
                  gap: '1px',
                  width: 'min(100%, calc(98vh - 80px))',
                  height: 'min(100%, calc(98vh - 80px))'
                }}
              >
                {grid.flat().map((cell) => {
                  let bgColor = 'bg-white';
                  if (cell.type === 'start') bgColor = 'bg-blue-600 hover:bg-blue-500';
                  else if (cell.type === 'end') bgColor = 'bg-red-600 hover:bg-red-500';
                  else if (cell.type === 'wall') bgColor = 'bg-black hover:bg-gray-900';
                  else if (cell.type === 'visited') bgColor = 'bg-yellow-400';
                  else if (cell.type === 'path') bgColor = 'bg-green-500';
                  else bgColor = 'bg-white hover:bg-gray-100';
                  
                  return (
                    <motion.div 
                      key={`${cell.row}-${cell.col}`}
                      className={`${bgColor} rounded-sm transition-all duration-200 aspect-square cursor-pointer`}
                      whileHover={{ scale: 1.05 }}
                      onMouseDown={() => handleMouseDown(cell.row, cell.col)}
                      onMouseEnter={() => {
                        handleMouseEnter(cell.row, cell.col);
                        handleCellHover(cell);
                      }}
                      onMouseLeave={handleCellLeave}
                    />
                  );
                })}
              </div>
            </div>

            <AnimatePresence>
              {showTooltip && selectedCell && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute bg-[#0F172A] text-[#F8FAFC] px-3 py-1 rounded text-sm shadow-lg"
                  style={{
                    left: '50%',
                    transform: 'translateX(-50%)',
                    bottom: -30,
                    zIndex: 10
                  }}
                >
                  {getNodeType(selectedCell.type)} ({selectedCell.row}, {selectedCell.col})
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {!pathFound && !isRunning && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-red-900/50 text-red-100 text-sm text-center rounded-lg border border-red-800"
            >
              Hedef noktasına ulaşılacak bir yol bulunamadı!
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AlgorithmSimulator;