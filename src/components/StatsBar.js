import React from 'react';
import { motion } from 'framer-motion';

export default function StatsBar({ stats, pathFound, isRunning }) {
  if (!pathFound && !isRunning) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-2 shrink-0 rounded-2xl px-4 py-3 text-center text-sm font-medium text-coral-900 bg-coral-50 border border-coral-100 shadow-soft"
      >
        Hedefe ulaşan bir yol bulunamadı. Duvarları azaltmayı veya grid&apos;i sıfırlamayı dene.
      </motion.div>
    );
  }

  if (!stats) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-2 shrink-0 grid grid-cols-2 sm:grid-cols-4 gap-2"
    >
      <Stat label="Ziyaret" value={stats.visited} accent="coral" />
      <Stat
        label="Yol uzunluğu"
        value={stats.pathLength != null ? `${stats.pathLength} adım` : '—'}
        accent="mint"
      />
      <Stat label="Yol düğümü" value={stats.pathNodes ?? '—'} accent="mint" />
      <Stat label="Hesap süresi" value={`${stats.computeMs} ms`} accent="coral" />
    </motion.div>
  );
}

function Stat({ label, value, accent = 'mint' }) {
  const bar = accent === 'mint' ? 'bg-mint-100' : 'bg-coral-100';
  return (
    <div className="stat-card relative overflow-hidden">
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${bar}`} />
      <div className="text-[10px] uppercase tracking-[0.1em] text-ink-muted font-semibold">
        {label}
      </div>
      <div className="text-base font-bold text-ink mt-0.5 tabular-nums">{value}</div>
    </div>
  );
}
