import { GoogleGenerativeAI } from '@google/generative-ai';

export async function generateTripPlan({ destination, startDate, endDate, budget, currency, apiKey }) {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });

  const days = Math.round((new Date(endDate) - new Date(startDate)) / 86400000) + 1;

  const prompt = `Sen bir seyahat uzmanısın. Kullanıcı için aşağıdaki bilgilere göre detaylı bir seyahat planı oluştur:

Destinasyon: ${destination}
Başlangıç: ${startDate}
Bitiş: ${endDate}
Süre: ${days} gün
${budget > 0 ? `Bütçe: ${budget} ${currency}` : ''}

Kesinlikle aşağıdaki JSON formatında yanıt ver, başka hiçbir metin ekleme:

{
  "days": [
    {
      "date": "YYYY-MM-DD",
      "activities": [
        {
          "time": "HH:MM",
          "title": "Aktivite adı",
          "location": "Konum adı",
          "lat": 41.0086,
          "lng": 28.9802,
          "cost": 0,
          "category": "kultur",
          "notes": "Kısa not",
          "imageQuery": "Hassan II Mosque Casablanca"
        }
      ]
    }
  ],
  "expenses": [
    {
      "title": "Uçak Bileti",
      "amount": 1500,
      "category": "ulasim",
      "date": "${startDate}"
    }
  ],
  "tips": ["İpucu 1", "İpucu 2", "İpucu 3"]
}

Kategori değerleri yalnızca şunlardan biri olabilir: kultur, yemek, eglenme, alisveris, ulasim, doga, diger
Her gün için 3-5 aktivite ekle. Koordinatlar (lat/lng) gerçek ve doğru olsun.
imageQuery: her aktivite için Wikipedia'da bulunabilecek en iyi İngilizce arama terimi (ör. "Hagia Sophia Istanbul", "Eiffel Tower Paris"). Bu alan resim aramak için kullanılacak.
Expenses içinde ulaşım ve konaklama tahminleri ekle.`;

  const result = await model.generateContent(prompt);
  const raw = result.response.text().trim();
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('AI yanıtı geçerli JSON içermiyor.');

  return JSON.parse(jsonMatch[0]);
}
