/**
 * Curated attractions, culture and pastimes for the "cerca de ti" popup.
 *
 * The trip's own `recommendations` are mostly food, beer and shopping, so on
 * their own the nearby list answers "dónde como" and never "qué hago". These
 * fill that gap: museums, viewpoints, parks, and the kind of small pastimes
 * that are worth a detour when you have a spare hour.
 *
 * Coordinates are the venue's real location (not a neighbourhood centroid
 * like the recommendations get), so distances to these are the most accurate
 * ones in the feature.
 *
 * `category` matches the keys in utils/activityMeta so these render with the
 * same icons and colours as everything else.
 */
export const NYC_PLACES = [
  // ── Museos y cultura ──────────────────────────────────────────────
  { id: 'poi-moma', name: 'MoMA', category: 'culture', zone: 'Midtown', lat: 40.7614, lon: -73.9776, note: 'Van Gogh, Warhol, Monet. Incluido en el Go City Pass.' },
  { id: 'poi-met', name: 'The Met', category: 'culture', zone: 'Upper East Side', lat: 40.7794, lon: -73.9632, note: 'Inmenso: elige dos alas y no intentes verlo todo.' },
  { id: 'poi-natural-history', name: 'Museo de Historia Natural', category: 'culture', zone: 'Upper West Side', lat: 40.7813, lon: -73.9740, note: 'La ballena azul y los dinosaurios.' },
  { id: 'poi-whitney', name: 'Whitney Museum', category: 'culture', zone: 'Meatpacking', lat: 40.7396, lon: -74.0089, note: 'Arte americano moderno, al pie del High Line.' },
  { id: 'poi-guggenheim', name: 'Guggenheim', category: 'culture', zone: 'Upper East Side', lat: 40.7830, lon: -73.9590, note: 'El edificio en espiral de Frank Lloyd Wright.' },
  { id: 'poi-frick', name: 'Frick Collection', category: 'culture', zone: 'Upper East Side', lat: 40.7712, lon: -73.9673, note: 'Colección pequeña y perfecta en una mansión.' },
  { id: 'poi-transit-museum', name: 'New York Transit Museum', category: 'culture', zone: 'Brooklyn Heights', lat: 40.6906, lon: -73.9902, note: 'En una estación de metro real de 1936.' },
  { id: 'poi-tenement', name: 'Tenement Museum', category: 'culture', zone: 'Lower East Side', lat: 40.7188, lon: -73.9901, note: 'La vida de los inmigrantes, solo con tour guiado.' },
  { id: 'poi-intrepid', name: 'Intrepid Sea, Air & Space', category: 'culture', zone: "Hell's Kitchen", lat: 40.7645, lon: -74.0000, note: 'Portaaviones, un Concorde y el transbordador Enterprise.' },
  { id: 'poi-911', name: 'Memorial y Museo del 11-S', category: 'culture', zone: 'Financial District', lat: 40.7115, lon: -74.0134, note: 'Las fuentes son gratuitas y están al aire libre.' },

  // ── Vistas y paseos ───────────────────────────────────────────────
  { id: 'poi-top-of-rock', name: 'Top of the Rock', category: 'sights', zone: 'Midtown', lat: 40.7593, lon: -73.9794, note: 'La mejor vista, porque incluye al Empire State.' },
  { id: 'poi-empire', name: 'Empire State Building', category: 'sights', zone: 'Midtown', lat: 40.7484, lon: -73.9857, note: 'Abre hasta las 2 a.m.: casi sin fila de madrugada.' },
  { id: 'poi-edge', name: 'Edge Hudson Yards', category: 'sights', zone: 'Hudson Yards', lat: 40.7536, lon: -74.0011, note: 'Mirador al aire libre con piso de cristal.' },
  { id: 'poi-summit', name: 'SUMMIT One Vanderbilt', category: 'sights', zone: 'Midtown', lat: 40.7527, lon: -73.9787, note: 'Mirador de espejos, el más fotogénico.' },
  { id: 'poi-highline', name: 'The High Line', category: 'sights', zone: 'Chelsea', lat: 40.7480, lon: -74.0048, note: 'Vía de tren elevada convertida en parque. Gratis.' },
  { id: 'poi-brooklyn-bridge', name: 'Puente de Brooklyn', category: 'sights', zone: 'DUMBO', lat: 40.7061, lon: -73.9969, note: 'Camínalo de Brooklyn a Manhattan para tener el skyline de frente.' },
  { id: 'poi-central-park', name: 'Central Park', category: 'sights', zone: 'Central Park', lat: 40.7812, lon: -73.9665, note: 'Bethesda Terrace y The Ramble son lo mejor.' },
  { id: 'poi-washington-sq', name: 'Washington Square Park', category: 'sights', zone: 'Greenwich Village', lat: 40.7308, lon: -73.9973, note: 'Músicos callejeros, ajedrez y el arco.' },
  { id: 'poi-bryant-park', name: 'Bryant Park', category: 'sights', zone: 'Midtown', lat: 40.7536, lon: -73.9832, note: 'Sillas gratis, wifi y mesas de ping-pong.' },
  { id: 'poi-grand-central', name: 'Grand Central Terminal', category: 'sights', zone: 'Midtown', lat: 40.7527, lon: -73.9772, note: 'El techo de constelaciones y la galería de los susurros.' },
  { id: 'poi-nypl', name: 'Biblioteca Pública de NY', category: 'sights', zone: 'Midtown', lat: 40.7532, lon: -73.9822, note: 'La Rose Reading Room es gratuita y espectacular.' },
  { id: 'poi-staten-ferry', name: 'Ferry de Staten Island', category: 'sights', zone: 'Financial District', lat: 40.7013, lon: -74.0134, note: 'Gratis, y pasa junto a la Estatua de la Libertad.' },
  { id: 'poi-roosevelt-tram', name: 'Teleférico a Roosevelt Island', category: 'sights', zone: 'Upper East Side', lat: 40.7614, lon: -73.9638, note: 'Cuesta lo mismo que el metro y vuela sobre el East River.' },
  { id: 'poi-dumbo', name: 'DUMBO · Washington St', category: 'sights', zone: 'DUMBO', lat: 40.7033, lon: -73.9881, note: 'La foto del puente enmarcando al Empire State.' },

  // ── Pasatiempos ───────────────────────────────────────────────────
  { id: 'poi-comedy-cellar', name: 'Comedy Cellar', category: 'music', genre: 'Comedia', zone: 'Greenwich Village', lat: 40.7302, lon: -74.0004, note: 'Stand-up legendario; reserva o llega temprano.' },
  { id: 'poi-barcade', name: 'Barcade', category: 'beer', zone: 'Chelsea', lat: 40.7448, lon: -73.9950, note: 'Arcades de los 80 y cerveza artesanal.' },
  { id: 'poi-bowlero', name: 'Bowlero Chelsea Piers', category: 'sights', zone: 'Chelsea', lat: 40.7466, lon: -74.0089, note: 'Boliche junto al Hudson.' },
  { id: 'poi-chess-forum', name: 'Chess Forum', category: 'sights', zone: 'Greenwich Village', lat: 40.7297, lon: -74.0003, note: 'Juega ajedrez por horas contra locales.' },
  { id: 'poi-nintendo', name: 'Nintendo NY', category: 'shopping', zone: 'Midtown', lat: 40.7587, lon: -73.9787, note: 'Museo y tienda; se puede jugar gratis.' },
  { id: 'poi-strand', name: 'Strand Bookstore', category: 'books', zone: 'Greenwich Village', lat: 40.7332, lon: -73.9907, note: '18 millas de libros; el sótano de saldos es lo mejor.' },
  { id: 'poi-bmcc-vessel', name: 'Little Island', category: 'sights', zone: 'Meatpacking', lat: 40.7420, lon: -74.0110, note: 'Parque flotante sobre el Hudson. Gratis.' },
  { id: 'poi-smorgasburg', name: 'Smorgasburg', category: 'food', zone: 'Williamsburg', lat: 40.7217, lon: -73.9615, note: 'Mercado de comida callejera, solo fines de semana.' },


  // ── Música en vivo (con género, porque no todo es jazz) ───────────
  { id: 'poi-village-vanguard', name: 'Village Vanguard', category: 'music', genre: 'Jazz', zone: 'West Village', lat: 40.7359, lon: -74.0016, note: 'El club de jazz más legendario del mundo. Solo efectivo en la puerta.' },
  { id: 'poi-blue-note', name: 'Blue Note', category: 'music', genre: 'Jazz', zone: 'Greenwich Village', lat: 40.7307, lon: -74.0007, note: 'Nombres grandes; caro pero vale el brunch de jazz.' },
  { id: 'poi-birdland', name: 'Birdland', category: 'music', genre: 'Jazz', zone: "Hell's Kitchen", lat: 40.7583, lon: -73.9899, note: 'Big bands y jazz clásico, a pasos del hotel.' },
  { id: 'poi-smalls', name: 'Smalls Jazz Club', category: 'music', genre: 'Jazz', zone: 'West Village', lat: 40.7345, lon: -74.0027, note: 'Sótano diminuto, jam sessions hasta la madrugada.' },
  { id: 'poi-dizzys', name: "Dizzy's Club", category: 'music', genre: 'Jazz', zone: 'Columbus Circle', lat: 40.7685, lon: -73.9829, note: 'Jazz con vista a Central Park desde el piso 5.' },
  { id: 'poi-mezzrow', name: 'Mezzrow', category: 'music', genre: 'Jazz', zone: 'West Village', lat: 40.7343, lon: -74.0025, note: 'Piano y contrabajo, íntimo y sin amplificar.' },

  { id: 'poi-bowery-ballroom', name: 'Bowery Ballroom', category: 'music', genre: 'Rock / Indie', zone: 'Lower East Side', lat: 40.7203, lon: -73.9934, note: 'La mejor sala mediana de la ciudad para bandas.' },
  { id: 'poi-mercury-lounge', name: 'Mercury Lounge', category: 'music', genre: 'Rock / Indie', zone: 'Lower East Side', lat: 40.7222, lon: -73.9877, note: 'Bandas emergentes; boletos baratos.' },
  { id: 'poi-brooklyn-steel', name: 'Brooklyn Steel', category: 'music', genre: 'Rock / Indie', zone: 'Williamsburg', lat: 40.7160, lon: -73.9350, note: 'Nave industrial con sonido impecable.' },
  { id: 'poi-red-lion', name: 'The Red Lion', category: 'music', genre: 'Rock en vivo', zone: 'Greenwich Village', lat: 40.7288, lon: -74.0016, note: 'Bandas de covers de rock todas las noches, sin cover caro.' },
  { id: 'poi-arlenes', name: "Arlene's Grocery", category: 'music', genre: 'Rock / Punk', zone: 'Lower East Side', lat: 40.7215, lon: -73.9877, note: 'Karaoke con banda en vivo los lunes.' },
  { id: 'poi-rockwood', name: 'Rockwood Music Hall', category: 'music', genre: 'Rock / Singer-songwriter', zone: 'Lower East Side', lat: 40.7221, lon: -73.9884, note: 'Tres escenarios; el Stage 1 suele ser gratis.' },

  { id: 'poi-sob', name: "S.O.B.'s", category: 'music', genre: 'Salsa / Latino', zone: 'SoHo', lat: 40.7276, lon: -74.0060, note: 'Sounds of Brazil: salsa, afrobeat y latin nights desde 1982.' },
  { id: 'poi-gonzalez', name: 'Gonzalez y Gonzalez', category: 'music', genre: 'Salsa', zone: 'NoHo', lat: 40.7268, lon: -73.9938, note: 'Salsa en vivo y pista de baile entre semana.' },
  { id: 'poi-copa', name: 'Copacabana', category: 'music', genre: 'Salsa / Latino', zone: 'Times Square', lat: 40.7576, lon: -73.9905, note: 'El clásico salsero de Nueva York.' },
  { id: 'poi-nublu', name: 'Nublu', category: 'music', genre: 'Latin / Jazz fusión', zone: 'East Village', lat: 40.7248, lon: -73.9787, note: 'Latin jazz experimental hasta muy tarde.' },

  // ── Cafeterías ────────────────────────────────────────────────────
  { id: 'poi-cafe-blueestone-bryant', name: 'Bluestone Lane', category: 'food', zone: 'Midtown', lat: 40.7620, lon: -73.9770, note: 'Flat white australiano y tostada de aguacate.' },
  { id: 'poi-cafe-culture', name: 'Culture Espresso', category: 'food', zone: 'Midtown', lat: 40.7527, lon: -73.9856, note: 'Espresso serio y galleta de chocolate famosa.' },
  { id: 'poi-cafe-gregorys', name: "Gregorys Coffee", category: 'food', zone: 'Midtown', lat: 40.7549, lon: -73.9800, note: 'Cadena local; más rica y barata que Starbucks.' },
  { id: 'poi-cafe-birch', name: 'Birch Coffee', category: 'food', zone: 'Midtown', lat: 40.7476, lon: -73.9832, note: 'Tueste propio, ambiente tranquilo para sentarse.' },
  { id: 'poi-cafe-devocion', name: 'Devoción', category: 'food', zone: 'Williamsburg', lat: 40.7175, lon: -73.9576, note: 'Café colombiano fresco bajo un techo de cristal.' },
  { id: 'poi-cafe-stumptown', name: 'Stumptown Coffee', category: 'food', zone: 'Midtown', lat: 40.7455, lon: -73.9884, note: 'En el lobby del Ace Hotel.' },
  { id: 'poi-cafe-blank-street', name: 'Blank Street Coffee', category: 'food', zone: 'Manhattan', lat: 40.7390, lon: -73.9903, note: 'Sucursales por toda la ciudad; matcha muy bueno.' },
  { id: 'poi-cafe-russ', name: "Russ & Daughters Cafe", category: 'food', zone: 'Lower East Side', lat: 40.7222, lon: -73.9880, note: 'Bagel con salmón y café, institución de 1914.' },

  // ── Supermercados y tiendas ───────────────────────────────────────
  { id: 'poi-shop-whole-foods', name: 'Whole Foods Market', category: 'shopping', zone: 'Midtown', lat: 40.7690, lon: -73.9820, note: 'Barra de comida al peso: la opción sana y rápida.' },
  { id: 'poi-shop-trader', name: "Trader Joe's", category: 'shopping', zone: 'Chelsea', lat: 40.7420, lon: -73.9930, note: 'Snacks y botanas baratas para llevar al estadio.' },
  { id: 'poi-shop-eataly', name: 'Eataly Flatiron', category: 'shopping', zone: 'Flatiron', lat: 40.7420, lon: -73.9896, note: 'Mercado italiano gigante, con bares dentro.' },
  { id: 'poi-shop-chelsea-market', name: 'Chelsea Market', category: 'shopping', zone: 'Chelsea', lat: 40.7424, lon: -74.0061, note: 'Mercado techado: comida, artesanía y tote bags.' },
  { id: 'poi-shop-duane', name: 'Duane Reade / Walgreens', category: 'shopping', zone: 'Manhattan', lat: 40.7570, lon: -73.9860, note: 'Farmacia 24 h: medicinas, snacks y lo que se te olvidó.' },
  { id: 'poi-shop-target', name: 'Target Herald Square', category: 'shopping', zone: 'Midtown', lat: 40.7505, lon: -73.9884, note: 'De todo y barato, a dos cuadras de Penn Station.' },
  { id: 'poi-shop-macys', name: "Macy's Herald Square", category: 'shopping', zone: 'Midtown', lat: 40.7509, lon: -73.9890, note: 'La tienda departamental clásica; pide el descuento para turistas.' },
  { id: 'poi-shop-bh', name: 'B&H Photo Video', category: 'shopping', zone: 'Midtown', lat: 40.7538, lon: -73.9962, note: 'Electrónica y fotografía. Cierra sábados por sabbat.' },
  { id: 'poi-shop-uniqlo', name: 'Uniqlo 5th Ave', category: 'shopping', zone: 'Midtown', lat: 40.7553, lon: -73.9784, note: 'Básicos baratos si te falta ropa de frío.' },
  { id: 'poi-shop-bodega', name: 'Bodega de esquina', category: 'food', zone: 'Manhattan', lat: 40.7600, lon: -73.9880, note: 'Hay una en cada cuadra: café, bacon-egg-and-cheese y agua barata.' }
];
