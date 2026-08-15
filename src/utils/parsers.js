// Parsers for Recommendations & Imports

export function parseSmartText(text) {
  if (!text || typeof text !== 'string') return [];

  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const results = [];

  for (const line of lines) {
    // If user separated with bullets, dashes or pipes: e.g. "Lucali · Pizza · Brooklyn · Ir temprano"
    const parts = line.split(/[·|\-,]/).map(p => p.trim()).filter(Boolean);

    if (parts.length >= 1) {
      const name = parts[0].replace(/^[\d\.\-\*\•\s]+/, '').trim();
      let category = 'food';
      let zone = 'Manhattan';
      let tips = '';
      let price = '$$';

      // Detect category keywords
      const lowerLine = line.toLowerCase();
      if (lowerLine.includes('cerveza') || lowerLine.includes('beer') || lowerLine.includes('bar') || lowerLine.includes('brewery') || lowerLine.includes('taproom') || lowerLine.includes('ipa')) {
        category = 'beer';
      } else if (lowerLine.includes('jazz') || lowerLine.includes('rock') || lowerLine.includes('musica') || lowerLine.includes('música') || lowerLine.includes('concierto') || lowerLine.includes('club')) {
        category = 'music';
      } else if (lowerLine.includes('museo') || lowerLine.includes('mirador') || lowerLine.includes('parque') || lowerLine.includes('puente') || lowerLine.includes('walk') || lowerLine.includes('view')) {
        category = 'sights';
      } else if (lowerLine.includes('tienda') || lowerLine.includes('store') || lowerLine.includes('shop') || lowerLine.includes('souvenir') || lowerLine.includes('b&h') || lowerLine.includes('apple')) {
        category = 'shopping';
      } else if (lowerLine.includes('libro') || lowerLine.includes('book') || lowerLine.includes('strand') || lowerLine.includes('cfa')) {
        category = 'books';
      }

      // Detect zones
      if (lowerLine.includes('brooklyn') || lowerLine.includes('williamsburg') || lowerLine.includes('dumbo')) zone = 'Brooklyn';
      else if (lowerLine.includes('queens') || lowerLine.includes('flushing')) zone = 'Queens';
      else if (lowerLine.includes('village') || lowerLine.includes('greenwich') || lowerLine.includes('bleecker')) zone = 'Greenwich / West Village';
      else if (lowerLine.includes('lower east side') || lowerLine.includes('les') || lowerLine.includes('houston')) zone = 'Lower East Side';
      else if (lowerLine.includes('midtown') || lowerLine.includes('times square') || lowerLine.includes('rockefeller')) zone = 'Midtown';
      else if (lowerLine.includes('hudson valley') || lowerLine.includes('cold spring') || lowerLine.includes('beacon')) zone = 'Hudson Valley';

      // Tips & descriptions from the rest of the text
      if (parts.length > 1) {
        tips = parts.slice(1).join(' — ');
      } else {
        tips = 'Recomendación agregada mediante pegado rápido.';
      }

      // Detect price
      if (lowerLine.includes('$$$$') || lowerLine.includes('caro') || lowerLine.includes('lujo')) price = '$$$$';
      else if (lowerLine.includes('$$$')) price = '$$$';
      else if (lowerLine.includes('barato') || lowerLine.includes('económico') || lowerLine.includes('$5') || lowerLine.includes('rebanada')) price = '$';

      results.push({
        id: `rec-custom-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name,
        category,
        subcategory: 'Personalizada',
        zone,
        address: `${name}, New York, NY`,
        mapsUrl: `https://maps.google.com/?q=${encodeURIComponent(name + ' NYC')}`,
        price,
        paymentMethod: lowerLine.includes('efectivo') ? 'cash_only' : 'both',
        mustOrder: 'Especialidad de la casa',
        tips,
        daySuggested: null,
        visited: false
      });
    }
  }

  return results;
}

export function parseCSVRecommendations(csvContent) {
  if (!csvContent || typeof csvContent !== 'string') return [];

  const lines = csvContent.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/['"]/g, ''));
  const list = [];

  for (let i = 1; i < lines.length; i++) {
    // Regex for CSV with quotes
    const row = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || lines[i].split(',');
    if (!row || row.length === 0) continue;

    const cleanRow = row.map(cell => cell.replace(/^"|"$/g, '').trim());
    const obj = {};

    headers.forEach((header, index) => {
      obj[header] = cleanRow[index] || '';
    });

    const name = obj.nombre || obj.name || obj.lugar || cleanRow[0] || 'Lugar recomendado';
    if (!name) continue;

    const cat = (obj.categoria || obj.category || 'food').toLowerCase();
    const validCat = ['food', 'beer', 'music', 'sights', 'shopping', 'books'].includes(cat) ? cat : 'food';

    list.push({
      id: `rec-csv-${Date.now()}-${i}`,
      name,
      category: validCat,
      subcategory: obj.subcategoria || obj.tipo || 'Personalizado',
      zone: obj.zona || obj.barrio || 'Nueva York',
      address: obj.direccion || obj.address || `${name}, NY`,
      mapsUrl: obj.mapsurl || `https://maps.google.com/?q=${encodeURIComponent(name + ' NYC')}`,
      price: obj.precio || obj.price || '$$',
      paymentMethod: obj.metodopago || 'both',
      mustOrder: obj.imperdible || obj.mustorder || obj.especialidad || 'Recomendación especial',
      tips: obj.tips || obj.notas || obj.comentarios || '',
      daySuggested: obj.diasugerido ? parseInt(obj.diasugerido) : null,
      visited: false
    });
  }

  return list;
}

export function exportRecommendationsToCSV(recommendations) {
  const headers = ['nombre', 'categoria', 'subcategoria', 'zona', 'direccion', 'precio', 'metodoPago', 'imperdibles', 'tips', 'diaSugerido', 'mapsUrl'];
  const rows = recommendations.map(r => [
    `"${(r.name || '').replace(/"/g, '""')}"`,
    `"${(r.category || '').replace(/"/g, '""')}"`,
    `"${(r.subcategory || '').replace(/"/g, '""')}"`,
    `"${(r.zone || '').replace(/"/g, '""')}"`,
    `"${(r.address || '').replace(/"/g, '""')}"`,
    `"${(r.price || '').replace(/"/g, '""')}"`,
    `"${(r.paymentMethod || '').replace(/"/g, '""')}"`,
    `"${(r.mustOrder || '').replace(/"/g, '""')}"`,
    `"${(r.tips || '').replace(/"/g, '""')}"`,
    `"${r.daySuggested || ''}"`,
    `"${(r.mapsUrl || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `NYC_Recomendaciones_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export const sampleJSONRecommendationsTemplate = [
  {
    "name": "Lucali Pizza",
    "category": "food",
    "subcategory": "Pizza a la leña",
    "zone": "Brooklyn (Carroll Gardens)",
    "address": "575 Henry St, Brooklyn, NY 11231",
    "mapsUrl": "https://maps.google.com/?q=Lucali+Brooklyn",
    "price": "$$$",
    "paymentMethod": "cash_only",
    "mustOrder": "Calzone relleno de 4 quesos y pizza grande con pepperoni y albahaca",
    "tips": "Llegar a hacer fila a las 4:00pm para que te anoten en la lista de la noche. Solo efectivo (ATM dentro).",
    "daySuggested": 2,
    "visited": false
  },
  {
    "name": "Attaboy",
    "category": "beer",
    "subcategory": "Speakeasy Cocktail Bar",
    "zone": "Lower East Side",
    "address": "134 Eldridge St, New York, NY 10002",
    "mapsUrl": "https://maps.google.com/?q=Attaboy+NYC",
    "price": "$$$",
    "paymentMethod": "card_only",
    "mustOrder": "Penicillin cocktail original o pedir trago según tus notas de sabor favoritas",
    "tips": "Sin menú impreso. Tocar la puerta de acero con la letra 'A'. No aceptan reservaciones.",
    "daySuggested": 5,
    "visited": false
  }
];

export const sampleCSVTemplate = `nombre,categoria,subcategoria,zona,direccion,precio,metodoPago,imperdibles,tips,diaSugerido,mapsUrl
"Lucali Pizza","food","Pizza de autor","Brooklyn","575 Henry St, Brooklyn, NY","$$$","cash_only","Calzone y pizza pepperoni","Llegar a formarse a las 4pm. Solo efectivo.",2,"https://maps.google.com/?q=Lucali+Brooklyn"
"Attaboy Speakeasy","music","Coctelería de autor","Lower East Side","134 Eldridge St, NY","$$$","both","Penicillin Cocktail","Sin menú, cóctel personalizado al momento.",5,"https://maps.google.com/?q=Attaboy+NYC"
"Finback Brewery Taproom","beer","Hazy IPAs","Queens / Brooklyn","545 Grandview Ave","$$","both","Rolling in Clouds IPA","Excelente ambiente para fans de IPAs",3,"https://maps.google.com/?q=Finback+Brewery"
`;
