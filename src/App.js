import React from 'react';
import AlgorithmSimulator from './AlgorithmSimulator';
import './index.css';

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-2 sm:p-4 bg-slate-900 text-slate-100">
      <div className="w-full flex-1 flex items-center justify-center">
        <AlgorithmSimulator />
      </div>
      <footer className="w-full py-3 text-center text-xs text-slate-400 border-t border-slate-800 mt-4">
        <p>Geliştirici: <a href="https://www.yucelgumus.dev/" target="_blank" rel="noopener noreferrer" className="font-semibold underline hover:text-slate-200 transition-colors">Yücel Gümüş</a></p>
      </footer>
    </div>
  );
}

export default App;
