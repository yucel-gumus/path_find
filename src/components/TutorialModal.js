import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function TutorialModal({ open, onClose }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/30 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="tutorial-title"
    >
      <motion.div
        initial={{ scale: 0.96, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        className="bg-cream-50 rounded-3xl p-6 sm:p-8 max-w-lg w-full max-h-[85vh] overflow-y-auto custom-scrollbar shadow-lift border border-cream-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start gap-4 mb-6">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-mint-800 mb-1">
              Hızlı tur
            </p>
            <h2 id="tutorial-title" className="text-xl font-bold text-ink tracking-tight">
              Nasıl kullanılır?
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-ink-muted hover:bg-coral-50 hover:text-coral-800 transition-colors"
            aria-label="Kapat"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-5 text-sm text-ink-muted leading-relaxed">
          <Section title="Grid">
            Boş hücrelere sürükleyerek duvar çiz. Duvarın üzerinde başlarsan silersin. Başlangıç
            (mint) ve hedefi (coral) sürükleyerek taşı.
          </Section>
          <Section title="Algoritmalar">
            A*, Dijkstra, BFS ve Bidirectional BFS en kısa yolu bulur. DFS ve Greedy yol bulur ama
            en kısayı garanti etmez.
          </Section>
          <Section title="Harita">
            Rastgele duvarlar ve labirent her zaman start→end yolu bırakacak şekilde üretilir.
          </Section>
          <div>
            <h3 className="text-sm font-bold text-ink mb-2">Renkler</h3>
            <ul className="space-y-1.5">
              {[
                { c: 'bg-mint-300', t: 'Başlangıç' },
                { c: 'bg-coral-300', t: 'Hedef' },
                { c: 'bg-coral-900', t: 'Engel' },
                { c: 'bg-coral-100', t: 'Ziyaret edilen' },
                { c: 'bg-mint-100', t: 'Bulunan yol' },
              ].map(({ c, t }) => (
                <li key={t} className="flex items-center gap-2.5">
                  <span className={`w-3.5 h-3.5 rounded-[4px] ${c} shrink-0`} />
                  <span className="text-ink">{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-5 border-t border-cream-200">
          <button type="button" onClick={onClose} className="btn-primary">
            Anladım, başla
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Section({ title, children }) {
  return (
    <section>
      <h3 className="text-sm font-bold text-ink mb-1">{title}</h3>
      <p>{children}</p>
    </section>
  );
}
