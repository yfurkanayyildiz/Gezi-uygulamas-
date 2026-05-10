# ✈️ Seyahat Planlayıcı

Yapay zeka destekli kişisel seyahat planlama uygulaması. Destinasyon girin, AI sizin için gün gün plan oluştursun.

## Özellikler

- **AI Gezi Planı** — Destinasyon ve tarih girerek Gemini ile otomatik güzergah oluşturun
- **Güzergah Yönetimi** — Günlere aktivite ekleyin, saati ve kategoriyi belirleyin
- **Harita** — Aktiviteler OpenStreetMap üzerinde pin olarak görünür, güzergah çizgisiyle bağlanır
- **Bütçe Takibi** — Toplam bütçe, harcanan tutar, kategori bazlı dağılım(Şu anlık doğru bütçe tahmini yapamıyor)
- **Fotoğraflar** — Her aktivite ve gün için Wikipedia / Google Places fotoğrafları
- **Veri Kalıcılığı** — Tüm veriler tarayıcının localStorage'ına kaydedilir

## Kurulum

```bash
npm install
npm run dev
```

Tarayıcıda `http://localhost:5173` adresini açın.

## API Keyler

Ayarlar (⚙️) menüsünden girilir. Tüm keyler yalnızca tarayıcınızda saklanır.

### Google Gemini (AI Plan — Ücretsiz)
AI ile otomatik gezi planı oluşturmak için gerekli.

1. [aistudio.google.com/apikey](https://aistudio.google.com/apikey) adresine gidin
2. **Create API Key** → **Create API key in new project**
3. Ayarlar → Gemini API Key alanına yapıştırın

Günlük 1500 istek ücretsiz, kredi kartı gerekmez.

### Google Places (Fotoğraflar — İsteğe Bağlı)
Yüksek kaliteli konum fotoğrafları için. Yoksa Wikipedia fotoğrafları kullanılır.

1. [console.cloud.google.com](https://console.cloud.google.com) → **Places API (New)** etkinleştir
2. **Credentials** → **Create API Key**
3. Ayarlar → Google Places API Key alanına yapıştırın

Ayda $200 ücretsiz kredi (~28.000 fotoğraf). Kredi kartı zorunlu.

## Teknolojiler

| Katman | Teknoloji |
|---|---|
| Frontend | React 19 + Vite |
| Harita | React Leaflet + OpenStreetMap |
| AI | Google Gemini (`gemini-3-flash-preview`) |
| Fotoğraf | Google Places API / Wikipedia API |
| Stil | Vanilla CSS (dark theme) |
| Veri | localStorage |
