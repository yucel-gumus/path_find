import React from 'react';
import { motion } from 'framer-motion';
import {
  ALGORITHMS,
  WALL_DENSITIES,
  SPEEDS,
  GRID_SIZES,
} from '../constants';

const LEGEND = [
  { color: 'bg-mint-300', text: 'Başlangıç' },
  { color: 'bg-coral-300', text: 'Hedef' },
  { color: 'bg-coral-900', text: 'Engel' },
  { color: 'bg-coral-100', text: 'Ziyaret' },
  { color: 'bg-mint-100', text: 'Yol' },
];

export default function ControlPanel({
  algorithm,
  setAlgorithm,
  wallDensity,
  setWallDensity,
  speed,
  setSpeed,
  gridSize,
  setGridSize,
  isRunning,
  onRun,
  onStop,
  onClearPath,
  onRandomWalls,
  onMaze,
  onReset,
}) {
  const meta = ALGORITHMS.find((a) => a.id === algorithm);

  return (
    <aside className="w-[min(100%,280px)] shrink-0 flex flex-col gap-3 overflow-y-auto custom-scrollbar pr-0.5">
      {/* Settings card — 30% coral wash */}
      <section className="panel-coral p-4 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-1.5 h-1.5 rounded-full bg-coral-200" />
          <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-coral-800">
            Ayarlar
          </h2>
        </div>

        <Field label="Algoritma">
          <select
            className="field-select"
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
            disabled={isRunning}
          >
            {ALGORITHMS.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
          {meta && (
            <p className="text-[11px] text-ink-muted leading-relaxed mt-2">
              {meta.description}
              <span
                className={`ml-1 font-semibold ${
                  meta.guaranteesShortest ? 'text-mint-800' : 'text-coral-800'
                }`}
              >
                {meta.guaranteesShortest ? '· En kısa yol ✓' : '· Optimal değil'}
              </span>
            </p>
          )}
        </Field>

        <div className="grid grid-cols-1 gap-3">
          <Field label="Grid boyutu">
            <select
              className="field-select"
              value={gridSize}
              onChange={(e) => setGridSize(Number(e.target.value))}
              disabled={isRunning}
            >
              {GRID_SIZES.map((s) => (
                <option key={s} value={s}>
                  {s} × {s}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Engel yoğunluğu">
            <select
              className="field-select"
              value={wallDensity}
              onChange={(e) => setWallDensity(Number(e.target.value))}
              disabled={isRunning}
            >
              {WALL_DENSITIES.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Animasyon hızı">
            <select
              className="field-select"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              disabled={isRunning}
            >
              {SPEEDS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </section>

      {/* Actions — primary = mint 10% */}
      <section className="panel p-4 space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-mint-200" />
          <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-mint-800">
            Kontroller
          </h2>
        </div>

        {!isRunning ? (
          <motion.button
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.985 }}
            className="btn-primary"
            onClick={onRun}
          >
            Algoritmayı Çalıştır
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.985 }}
            className="btn-danger"
            onClick={onStop}
          >
            <span className="inline-flex items-center justify-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Durdur
            </span>
          </motion.button>
        )}

        <button className="btn-secondary" onClick={onClearPath} disabled={isRunning}>
          Yolu Temizle
        </button>
        <button className="btn-secondary" onClick={onRandomWalls} disabled={isRunning}>
          Rastgele Duvarlar
        </button>
        <button className="btn-secondary" onClick={onMaze} disabled={isRunning}>
          Labirent Oluştur
        </button>
        <button className="btn-ghost" onClick={onReset} disabled={isRunning}>
          Grid&apos;i Sıfırla
        </button>
      </section>

      {/* Legend */}
      <section className="panel p-3">
        <p className="field-label mb-2 px-0.5">Gösterge</p>
        <div className="flex flex-wrap gap-1.5">
          {LEGEND.map(({ color, text }) => (
            <span key={text} className="legend-chip">
              <span className={`w-2.5 h-2.5 rounded-[3px] ${color} shrink-0`} />
              {text}
            </span>
          ))}
        </div>
      </section>
    </aside>
  );
}

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="field-label">{label}</label>
      {children}
    </div>
  );
}
