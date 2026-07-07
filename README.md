# 🧭 Pathfinding Algoritma Simülatörü (Interactive Pathfinding Visualizer)

Pathfinding Algoritma Simülatörü; bilgisayar bilimlerindeki en temel 6 yol bulma algoritmasını 20×20 boyutlarında interaktif bir ızgara (grid) üzerinde adım adım animasyonlar eşliğinde görselleştiren, **React 19 & TailwindCSS v3** tabanlı modern bir eğitim ve simülasyon uygulamasıdır.

Kullanıcılar duvarlar çizebilir, başlangıç ve bitiş noktalarını taşıyabilir ve algoritmaların arama uzayını genişletme stratejilerini gerçek zamanlı olarak karşılaştırabilirler.

---

## 🌟 Öne Çıkan Özellikler

### 1. Görselleştirilen 6 Yol Bulma Algoritması
* **A\* (A-Star) Arama:** Manhattan mesafe sezgiselliğini (heuristic) Dijkstra maliyeti ile birleştirerek en kısa yolu en hızlı şekilde bulur (Garantili En Kısa Yol).
* **Dijkstra Algoritması:** Başlangıç noktasından itibaren tüm düğümlere olan mesafeleri hesaplar (Garantili En Kısa Yol).
* **BFS (Breadth-First Search):** Kuyruk (queue) yapısı kullanarak katman katman genişler, ağırlıksız grafiklerde en kısa yolu bulur (Garantili En Kısa Yol).
* **DFS (Depth-First Search):** Yığıt (stack) yapısı kullanarak bir daldan derinlemesine ilerler (En kısa yolu garanti etmez).
* **Greedy Best-First Arama:** Sadece hedef noktaya olan sezgisel mesafeye odaklanarak hızlı ilerler (En kısa yolu garanti etmez).
* **Çift Yönlü BFS (Bidirectional BFS):** Biri başlangıçtan hedefe, diğeri hedeften başlangıca doğru aynı anda çalışan iki BFS aramasının ortada birleşmesiyle yolu bulur.

### 2. İnteraktif Grid Arayüzü & Özellikler
* **Sürükle-Bırak Kontrolleri:** Başlangıç ve hedef işaretçilerini grid üzerinde serbestçe sürükleyerek anında yeni yollar hesaplatabilirsiniz.
* **Dinamik Duvar Çizimi:** Fareyle tıklayıp sürükleyerek veya dokunarak grid üzerinde engeller/duvarlar oluşturabilirsiniz.
* **Labirent Oluşturucu (Random Maze):** Ayarlanabilir yoğunluk sürgüsü (density slider) ile grid üzerinde otomatik ve rastgele engeller üretilebilir.
* **Animasyon Hız Kontrolü:** Algoritmanın çalışma adımlarını (ziyaret edilen hücreler ve hesaplanan en kısa yol) yavaşlatarak veya hızlandırarak izleyebilirsiniz.
* **Framer Motion Animasyonları:** Düğümlerin durum değişiklikleri (ziyaret edildi, en kısa yolun parçası oldu, duvar oldu) akıcı CSS ve Framer Motion animasyonları ile renklendirilir.

---

## 📂 Proje Klasör Yapısı

```
path_find/
├── src/
│   ├── components/
│   │   ├── Grid.tsx            # 20x20 hücrenin render edildiği ve fare olaylarının dinlendiği ana ızgara
│   │   ├── Node.tsx            # Tekil hücre bileşeni (başlangıç, bitiş, duvar, ziyaret edildi animasyonları)
│   │   └── ControlPanel.tsx    # Algoritma seçimi, hız ayarları ve simülasyon tetikleyicileri
│   ├── algorithms/
│   │   ├── astar.ts            # A* algoritma mantığı
│   │   ├── dijkstra.ts         # Dijkstra algoritma mantığı
│   │   ├── bfs.ts              # BFS algoritma mantığı
│   │   ├── dfs.ts              # DFS algoritma mantığı
│   │   ├── greedy.ts           # Greedy Best-First algoritma mantığı
│   │   └── bidirectional.ts    # Bidirectional BFS algoritma mantığı
│   ├── App.tsx                 # Ana React bileşeni ve simülasyon state yönetimi
│   └── main.tsx
├── public/
├── tailwind.config.js          # Arayüz renk paleti ve tema yapılandırması
└── package.json
```

---

## 🚀 Kurulum ve Yerel Çalıştırma

### 1. Bağımlılıkları Yükleyin
```bash
git clone https://github.com/yucel-gumus/path_find.git
cd path_find
npm install
```

### 2. Uygulamayı Başlatın
```bash
npm start
```
Uygulama `http://localhost:3000` adresinde geliştirme modunda açılacaktır.

### 3. Production Derlemesi (Build)
```bash
npm run build
```
Derlenen statik dosyalar `build/` klasörü altına kaydedilir.

---

## 🔗 Canlı Bağlantılar
* **Canlı Demo:** [https://path-find-sigma.vercel.app/](https://path-find-sigma.vercel.app/)
* **Geliştirici GitHub:** [https://github.com/yucel-gumus](https://github.com/yucel-gumus)