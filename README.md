# 🎯 Pathfinding Algoritması Simülatörü

Bu proje, farklı yol bulma algoritmalarının nasıl çalıştığını interaktif bir şekilde görselleştirmenizi sağlayan bir web uygulamasıdır. Algoritmalar arasındaki farkları gözlemleyebilir ve performanslarını karşılaştırabilirsiniz.

## 🚀 Özellikler

- **6 Farklı Algoritma**:
  - A* (A-Star) Algoritması
  - Dijkstra Algoritması
  - Breadth-First Search (BFS)
  - Depth-First Search (DFS)
  - Greedy Best-First Search
  - Bidirectional BFS

- **İnteraktif Grid**:
  - 20x20 grid sistemi
  - Sürükle-bırak ile duvar oluşturma
  - Başlangıç ve bitiş noktalarını taşıma
  - Rastgele duvar oluşturma
  - Engel yoğunluğunu ayarlama

- **Animasyonlar**:
  - Algoritmaların çalışmasını adım adım görselleştirme
  - Ayarlanabilir animasyon hızı
  - Smooth geçiş efektleri
  - Hücre hover efektleri

- **Kullanıcı Dostu Arayüz**:
  - Modern ve temiz tasarım
  - Dark mode
  - Detaylı tutorial
  - Responsive layout

## 🛠️ Teknolojiler

- React.js
- Tailwind CSS
- Framer Motion
- JavaScript ES6+

## 📥 Kurulum

1. Repo'yu klonlayın:
   ```bash
   git clone https://github.com/yucelgmus/pathfinding-simulator.git
   ```

2. Proje dizinine gidin:
   ```bash
   cd pathfinding-simulator
   ```

3. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```

4. Uygulamayı başlatın:
   ```bash
   npm start
   ```

## 🎮 Nasıl Kullanılır?

1. **Grid Kontrolü**:
   - Boş hücrelere tıklayıp sürükleyerek duvarlar oluşturabilirsiniz
   - Mavi başlangıç noktasını sürükleyerek taşıyabilirsiniz
   - Kırmızı hedef noktasını sürükleyerek taşıyabilirsiniz
   - "Rastgele Duvarlar" butonu ile rastgele engeller oluşturabilirsiniz

2. **Algoritma Seçimi**:
   - Dropdown menüden istediğiniz algoritmayı seçin
   - Her algoritmanın kendine özgü avantajları vardır

3. **Ayarlar**:
   - Engel yoğunluğunu %0 ile %40 arasında ayarlayabilirsiniz
   - Animasyon hızını değiştirebilirsiniz
   - "Grid'i Sıfırla" ile temiz bir başlangıç yapabilirsiniz

## 🎨 Renk Kodları

- 🔵 Mavi: Başlangıç noktası
- 🔴 Kırmızı: Hedef noktası
- ⚫ Siyah: Engeller
- 💛 Sarı: Ziyaret edilen hücreler
- 💚 Yeşil: Bulunan en kısa yol

## 📚 Algoritma Detayları

1. **A* Algoritması**:
   - En iyi ilk arama algoritması
   - Hedef odaklı çalışır
   - Genellikle en kısa yolu bulur
   - Heuristic fonksiyon kullanır

2. **Dijkstra Algoritması**:
   - En kısa yolu garantiler
   - Her yöne eşit maliyetle ilerler
   - Hedef odaklı değildir

3. **BFS (Breadth-First Search)**:
   - Grafiği katman katman dolaşır
   - En kısa yolu garanti eder
   - Eşit maliyetli yollarda optimal

4. **DFS (Depth-First Search)**:
   - Grafiği derinlemesine dolaşır
   - En kısa yolu garanti etmez
   - Labirent çözümünde etkili

5. **Greedy Best-First Search**:
   - Sadece hedefe olan mesafeyi dikkate alır
   - Hızlı çalışır
   - En kısa yolu garanti etmez

6. **Bidirectional BFS**:
   - İki noktadan eşzamanlı BFS
   - Normal BFS'den daha hızlı
   - Karmaşık yollarda etkili

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 👥 Katkıda Bulunma

1. Bu repo'yu fork edin
2. Yeni bir feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Bir Pull Request oluşturun