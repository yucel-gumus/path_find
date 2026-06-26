# Pathfinding Algoritma Simülatörü (path_find)

20×20 grid üzerinde **6 yol bulma algoritmasını** adım adım animasyonla gösteren React uygulaması.

**GitHub:** [yucel-gumus/path_find](https://github.com/yucel-gumus/path_find)

---

## Algoritmalar

| Algoritma | Özellik |
|-----------|---------|
| A* | Heuristic + en kısa yol |
| Dijkstra | Ağırlıksız grid |
| BFS | Katman katman genişleme |
| DFS | Derinlemesine |
| Greedy Best-First | Heuristic odaklı |
| Bidirectional BFS | İki uçtan arama |

---

## Özellikler

- Sürükle-bırak duvar, başlangıç/bitiş taşıma
- Rastgele duvar + yoğunluk slider
- Animasyon hızı, dark mode, tutorial
- **Framer Motion** geçişleri
- **Tailwind CSS** arayüz

---

## Kurulum

```bash
git clone https://github.com/yucel-gumus/path_find.git
cd path_find
npm install
npm start
```

`http://localhost:3000`

```bash
npm run build
```

---

## Kod organizasyonu

Algoritma mantığı `src` altında grid state ve görselleştirme bileşenlerine ayrılmıştır; her algoritma aynı grid API'sini (komşu hücreler, duvar kontrolü) kullanır.

---

## Eğitim kullanımı

Ders / blog içeriği için algoritma adımlarını yavaşlatıp BFS vs A* farkını canlı göstermek için uygundur.

---

## Lisans

MIT.