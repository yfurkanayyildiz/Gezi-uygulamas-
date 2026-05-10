const cache = {};

async function fetchGooglePlacesImage(query, apiKey) {
  // Places API (New) - Text Search
  const searchRes = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': 'places.photos',
    },
    body: JSON.stringify({ textQuery: query }),
  }).then(r => r.json());

  const photoName = searchRes.places?.[0]?.photos?.[0]?.name;
  if (!photoName) return null;

  // Fotoğraf URL'ini al (redirect URL olarak döner)
  const mediaRes = await fetch(
    `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=800&skipHttpRedirect=true&key=${apiKey}`
  ).then(r => r.json());

  return mediaRes.photoUri || null;
}

async function fetchWikipediaImage(query) {
  const search = await fetch(
    `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*&srlimit=1`
  ).then(r => r.json());

  const title = search.query?.search?.[0]?.title;
  if (!title) return null;

  const page = await fetch(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`
  ).then(r => r.json());

  return page.thumbnail?.source || null;
}

export async function fetchImage(query) {
  if (cache[query] !== undefined) return cache[query];

  const placesKey = localStorage.getItem('google_places_api_key');

  try {
    if (placesKey) {
      const url = await fetchGooglePlacesImage(query, placesKey);
      if (url) { cache[query] = url; return url; }
    }
  } catch { /* Wikipedia'ya düş */ }

  try {
    const url = await fetchWikipediaImage(query);
    cache[query] = url;
    return url;
  } catch {
    cache[query] = null;
    return null;
  }
}
