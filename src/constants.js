export const GRID_SIZES = [10, 15, 20, 25, 30];
export const DEFAULT_ROWS = 20;
export const DEFAULT_COLS = 20;

export const WALL_DENSITIES = [
  { value: 0, label: 'Engel Yok' },
  { value: 10, label: 'Az Engel (%10)' },
  { value: 20, label: 'Orta Engel (%20)' },
  { value: 30, label: 'Çok Engel (%30)' },
  { value: 40, label: 'Çok Fazla Engel (%40)' },
];

export const SPEEDS = [
  { value: 5, label: 'Çok Hızlı' },
  { value: 25, label: 'Hızlı' },
  { value: 50, label: 'Normal' },
  { value: 100, label: 'Yavaş' },
  { value: 200, label: 'Çok Yavaş' },
];

export const ALGORITHMS = [
  {
    id: 'astar',
    name: 'A*',
    description: 'Heuristic + maliyet. Ağırlıksız gridde en kısa yolu bulur.',
    guaranteesShortest: true,
  },
  {
    id: 'dijkstra',
    name: 'Dijkstra',
    description: 'Maliyet odaklı arama. Uniform maliyette en kısa yolu bulur.',
    guaranteesShortest: true,
  },
  {
    id: 'bfs',
    name: 'BFS',
    description: 'Katman katman genişler. Ağırlıksız en kısa yolu garantiler.',
    guaranteesShortest: true,
  },
  {
    id: 'dfs',
    name: 'DFS',
    description: 'Derinlemesine arar. En kısa yolu garanti etmez.',
    guaranteesShortest: false,
  },
  {
    id: 'greedy',
    name: 'Greedy Best-First',
    description: 'Sadece hedefe olan sezgisel mesafeyi kullanır. Hızlı, optimal değil.',
    guaranteesShortest: false,
  },
  {
    id: 'bidirectional',
    name: 'Bidirectional BFS',
    description: 'İki uçtan BFS. Ağırlıksız en kısa yolu bulur, genelde daha az düğüm açar.',
    guaranteesShortest: true,
  },
];

export const CELL_TYPES = {
  EMPTY: 'empty',
  START: 'start',
  END: 'end',
  WALL: 'wall',
  VISITED: 'visited',
  PATH: 'path',
};

export const CELL_LABELS = {
  empty: 'Boş Hücre',
  start: 'Başlangıç',
  end: 'Hedef',
  wall: 'Engel',
  visited: 'Ziyaret Edildi',
  path: 'Yol',
};
