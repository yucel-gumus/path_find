# Pathfinding Algoritma Simülatörü

İnteraktif grid üzerinde 6 yol bulma algoritmasını adım adım görselleştiren eğitim uygulaması.

**Stack:** React 19 · Tailwind CSS 3 · Framer Motion · Create React App  
**Canlı demo:** [path-find-sigma.vercel.app](https://path-find-sigma.vercel.app/)

---

## Özellikler

- **6 algoritma:** A\*, Dijkstra, BFS, DFS, Greedy Best-First, Bidirectional BFS
- **İnteraktif grid:** duvar çiz/sil (paint mode), start & end sürükle
- **Labirent üretici:** recursive division
- **Rastgele engeller:** ayarlanabilir yoğunluk
- **Grid boyutu:** 10×10 … 30×30
- **Animasyon hızı + durdur**
- **İstatistikler:** ziyaret sayısı, yol uzunluğu, hesap süresi (ms)
- **Optimal / değil** rozeti algoritma açıklamasında

---

## Proje yapısı

```
src/
├── algorithms/          # Saf algoritma implementasyonları + testler
│   ├── astar.js
│   ├── dijkstra.js
│   ├── bfs.js
│   ├── dfs.js
│   ├── greedy.js
│   ├── bidirectional.js
│   ├── common.js
│   └── index.js
├── components/          # UI parçaları
│   ├── Cell.js
│   ├── Grid.js
│   ├── ControlPanel.js
│   ├── TutorialModal.js
│   └── StatsBar.js
├── data/
│   ├── gridHelpers.js
│   └── minPriorityQueue.js
├── hooks/
│   ├── usePathAnimation.js
│   └── useGridInteraction.js
├── constants.js
├── AlgorithmSimulator.js
└── App.js
```

---

## Kurulum

```bash
git clone https://github.com/yucel-gumus/path_find.git
cd path_find
npm install
npm start
```

| Komut | Açıklama |
|--------|----------|
| `npm start` | Geliştirme sunucusu (`localhost:3000`) |
| `npm test` | Unit testler |
| `npm run build` | Production build → `build/` |

---

## Algoritmalar (kısa)

| Algoritma | En kısa yol? | Not |
|-----------|--------------|-----|
| A\* | Evet (ağırlıksız) | Manhattan heuristic |
| Dijkstra | Evet | Uniform cost = BFS ile eşdeğer maliyet |
| BFS | Evet | Klasik katmanlı arama |
| Bidirectional BFS | Evet | İki uçtan genişleme |
| DFS | Hayır | Derinlik öncelikli |
| Greedy Best-First | Hayır | Sadece heuristic |

---

## Geliştirici

[yucel-gumus](https://github.com/yucel-gumus)
