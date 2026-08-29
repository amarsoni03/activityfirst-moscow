import type { MetroLine, MetroStation } from './types';

const R = '#E42313';
const G = '#0A6B34';
const B = '#0078BF';
const K = '#8B5A2B';
const P = '#8E479C';
const T = '#4FB8B2';

export const LINES: MetroLine[] = [
  { id: 'sokol', name: 'Sokolnicheskaya', short: 'Line 1', color: R },
  { id: 'zamosk', name: 'Zamoskvoretskaya', short: 'Line 2', color: G },
  { id: 'arbat', name: 'Arbatsko-Pokrovskaya', short: 'Line 3', color: B },
  { id: 'ring', name: 'Koltsevaya', short: 'Line 5', color: K },
  { id: 'tagan', name: 'Tagansko-Krasnopresnenskaya', short: 'Line 7', color: P },
  { id: 'bkl', name: 'Bolshaya Koltsevaya', short: 'BKL', color: T },
];

export const STATIONS: MetroStation[] = [
  { id: 'okhotny', name: 'Okhotny Ryad', nameRu: 'Охотный Ряд', lineId: 'sokol', lineName: 'Sokolnicheskaya', lineColor: R, district: 'Tverskoy', street: 'Manezhnaya ploshchad, 1', venues: ['Manege Studio', 'Metropol Hall', 'Central Telegraph Loft'], x: 50, y: 44 },
  { id: 'park-kultury', name: 'Park Kultury', nameRu: 'Парк культуры', lineId: 'sokol', lineName: 'Sokolnicheskaya', lineColor: R, district: 'Khamovniki', street: 'Krymsky Val, 9', venues: ['Gorky Park Pavilion', 'Chaika Pool, Turchaninov per. 3/1', 'Garage Atrium', 'Neskuchny Garden courts'], x: 42, y: 50 },
  { id: 'chistye', name: 'Chistye Prudy', nameRu: 'Чистые пруды', lineId: 'sokol', lineName: 'Sokolnicheskaya', lineColor: R, district: 'Basmanny', street: 'Chistoprudny Boulevard, 12', venues: ['Chistye Prudy Pavilion', 'Pokrovka 7 Studio', 'Myasnitskaya Workshop'], x: 56, y: 38 },
  { id: 'sokolniki', name: 'Sokolniki', nameRu: 'Сокольники', lineId: 'sokol', lineName: 'Sokolnicheskaya', lineColor: R, district: 'Sokolniki', street: 'Sokolnichesky Val, 1', venues: ['Sokolniki Park Rotunda', 'Putyatinsky Pond studio', 'Park sports hall'], x: 64, y: 30 },
  { id: 'vorobyovy', name: 'Vorobyovy Gory', nameRu: 'Воробьёвы горы', lineId: 'sokol', lineName: 'Sokolnicheskaya', lineColor: R, district: 'Ramenki', street: 'Luzhniki, 24', venues: ['Luzhniki Tennis Park', 'MSU Sports Palace', 'Observation Deck studio', 'Vorobyovy Gory embankment'], x: 34, y: 56 },
  { id: 'mayakov', name: 'Mayakovskaya', nameRu: 'Маяковская', lineId: 'zamosk', lineName: 'Zamoskvoretskaya', lineColor: G, district: 'Tverskoy', street: 'Triumfalnaya ploshchad, 4', venues: ["Patriarch's Ponds studio, Malaya Bronnaya", 'Satire Theatre studios', 'Tverskaya 18 loft'], x: 44, y: 36 },
  { id: 'tverskaya', name: 'Tverskaya', nameRu: 'Тверская', lineId: 'zamosk', lineName: 'Zamoskvoretskaya', lineColor: G, district: 'Tverskoy', street: 'Tverskaya ulitsa, 17', venues: ['Tverskaya 17', 'Stanislavsky Electrotheatre wing', 'Kamergersky Lane studio'], x: 48, y: 40 },
  { id: 'teatral', name: 'Teatralnaya', nameRu: 'Театральная', lineId: 'zamosk', lineName: 'Zamoskvoretskaya', lineColor: G, district: 'Tverskoy', street: 'Teatralnaya ploshchad, 1', venues: ['Kamergersky rehearsal hall', 'MKhAT studio', 'Kuznetsky 4 loft'], x: 51, y: 44 },
  { id: 'novokuz', name: 'Novokuznetskaya', nameRu: 'Новокузнецкая', lineId: 'zamosk', lineName: 'Zamoskvoretskaya', lineColor: G, district: 'Zamoskvorechye', street: 'Pyatnitskaya ulitsa, 18', venues: ['Red October, Bersenevskaya nab. 6', 'Pyatnitskaya 18', 'Bolotnaya workshop'], x: 53, y: 54 },
  { id: 'pavelets', name: 'Paveletskaya', nameRu: 'Павелецкая', lineId: 'zamosk', lineName: 'Zamoskvoretskaya', lineColor: G, district: 'Zamoskvorechye', street: 'Paveletskaya ploshchad, 2', venues: ['Paveletskaya Plaza studio', 'Dubininskaya 80', 'Garden Ring hall'], x: 55, y: 62 },
  { id: 'arbatskaya', name: 'Arbatskaya', nameRu: 'Арбатская', lineId: 'arbat', lineName: 'Arbatsko-Pokrovskaya', lineColor: B, district: 'Arbat', street: 'ulitsa Arbat, 20', venues: ['Arbat 20', 'Vakhtangov studio wing', 'Novy Arbat 15', 'Krivoarbatsky lane loft'], x: 38, y: 44 },
  { id: 'revolyutsii', name: 'Ploshchad Revolyutsii', nameRu: 'Площадь Революции', lineId: 'arbat', lineName: 'Arbatsko-Pokrovskaya', lineColor: B, district: 'Tverskoy', street: 'Nikolskaya ulitsa, 10', venues: ['Nikolskaya 10', 'Ilinka workshop', 'Kitay-gorod loft'], x: 51, y: 46 },
  { id: 'smolensk', name: 'Smolenskaya', nameRu: 'Смоленская', lineId: 'arbat', lineName: 'Arbatsko-Pokrovskaya', lineColor: B, district: 'Arbat', street: 'Smolenskaya-Sennaya ploshchad, 27', venues: ['Smolensky Passage studio', 'Novinsky Boulevard hall', 'Arbat lanes workshop'], x: 32, y: 46 },
  { id: 'kievskaya', name: 'Kievskaya', nameRu: 'Киевская', lineId: 'arbat', lineName: 'Arbatsko-Pokrovskaya', lineColor: B, district: 'Dorogomilovo', street: 'Kiyevskogo Vokzala ploshchad, 2', venues: ['Europe Square studio', 'Kievskaya 2', 'Taras Shevchenko nab. hall'], x: 26, y: 50 },
  { id: 'komsomol', name: 'Komsomolskaya', nameRu: 'Комсомольская', lineId: 'ring', lineName: 'Koltsevaya', lineColor: K, district: 'Krasnoselsky', street: 'Komsomolskaya ploshchad, 3', venues: ['Leningradskaya hall', 'Komsomolskaya 3', 'Garden Ring loft'], x: 60, y: 36 },
  { id: 'mira', name: 'Prospekt Mira', nameRu: 'Проспект Мира', lineId: 'ring', lineName: 'Koltsevaya', lineColor: K, district: 'Meshchansky', street: 'Prospekt Mira, 26', venues: ['Aptekarsky Ogorod studio', 'Olympic sports hall', 'Prospekt Mira 26'], x: 54, y: 30 },
  { id: 'belorus', name: 'Belorusskaya', nameRu: 'Белорусская', lineId: 'ring', lineName: 'Koltsevaya', lineColor: K, district: 'Tverskoy', street: 'Tverskaya Zastava ploshchad, 7', venues: ['Belorussky Market kitchens', 'Gruzinsky Val studio', 'Tverskaya Zastava 7'], x: 40, y: 30 },
  { id: 'krasno', name: 'Krasnopresnenskaya', nameRu: 'Краснопресненская', lineId: 'ring', lineName: 'Koltsevaya', lineColor: K, district: 'Presnensky', street: 'ulitsa Krasnaya Presnya, 6', venues: ['Presnya Park studio', '1905 Goda hall', 'Krasnaya Presnya 6'], x: 34, y: 36 },
  { id: 'dobrynin', name: 'Dobryninskaya', nameRu: 'Добрынинская', lineId: 'ring', lineName: 'Koltsevaya', lineColor: K, district: 'Zamoskvorechye', street: 'Lyusinovskaya ulitsa, 53', venues: ['Danilovsky Market kitchens', 'Serpukhovskaya studio', 'Lyusinovskaya 53'], x: 48, y: 60 },
  { id: 'taganskaya', name: 'Taganskaya', nameRu: 'Таганская', lineId: 'ring', lineName: 'Koltsevaya', lineColor: K, district: 'Tagansky', street: 'Taganskaya ploshchad, 12', venues: ['Taganka Theatre studios', 'Bolshie Kamenschiki hall', 'Taganskaya 12'], x: 60, y: 54 },
  { id: 'kurskaya', name: 'Kurskaya', nameRu: 'Курская', lineId: 'ring', lineName: 'Koltsevaya', lineColor: K, district: 'Basmanny', street: 'Nizhny Susalny pereulok, 5', venues: ['Artplay, Nizhny Susalny 5', 'Winzavod, 4th Syromyatnichesky 1', 'Kursky workshop'], x: 64, y: 46 },
  { id: 'pushkin', name: 'Pushkinskaya', nameRu: 'Пушкинская', lineId: 'tagan', lineName: 'Tagansko-Krasnopresnenskaya', lineColor: P, district: 'Tverskoy', street: 'Pushkinskaya ploshchad, 5', venues: ['Tverskoy Boulevard pavilion', 'Izvestia hall', 'Pushkinskaya 5'], x: 46, y: 40 },
  { id: 'barrikad', name: 'Barrikadnaya', nameRu: 'Баррикадная', lineId: 'tagan', lineName: 'Tagansko-Krasnopresnenskaya', lineColor: P, district: 'Presnensky', street: 'Barrikadnaya ulitsa, 4', venues: ['Moscow Zoo sports hall', 'Barrikadnaya 4', 'Krasnaya Presnya pool'], x: 36, y: 38 },
  { id: 'kuznetsky', name: 'Kuznetsky Most', nameRu: 'Кузнецкий Мост', lineId: 'tagan', lineName: 'Tagansko-Krasnopresnenskaya', lineColor: P, district: 'Meshchansky', street: 'Kuznetsky Most, 12', venues: ['Kuznetsky Most 12', 'TSUM studio floor', 'Sanduny lane hall'], x: 50, y: 40 },
  { id: 'tushino', name: 'Tushinskaya', nameRu: 'Тушинская', lineId: 'tagan', lineName: 'Tagansko-Krasnopresnenskaya', lineColor: P, district: 'Pokrovskoye-Streshnevo', street: 'Volokolamskoye shosse, 86', venues: ['Tushino Park hall', 'Volokolamskoye 86', 'Skhodnenskaya studio'], x: 20, y: 26 },
  { id: 'city', name: 'Delovoy Tsentr', nameRu: 'Деловой центр', lineId: 'bkl', lineName: 'Bolshaya Koltsevaya', lineColor: T, district: 'Presnensky', street: 'Presnenskaya naberezhnaya, 12', venues: ['Federation Tower, 19th floor studio', 'IQ-Quarter hall', 'Afimall sports deck', 'OKO tower studio'], x: 30, y: 52 },
  { id: 'cska', name: 'CSKA', nameRu: 'ЦСКА', lineId: 'bkl', lineName: 'Bolshaya Koltsevaya', lineColor: T, district: 'Khoroshyovsky', street: 'Khodynsky Boulevard, 3', venues: ['CSKA Arena studios', 'Megasport hall', 'Khodynka Field courts'], x: 40, y: 22 },
  { id: 'savyolov', name: 'Savyolovskaya', nameRu: 'Савёловская', lineId: 'bkl', lineName: 'Bolshaya Koltsevaya', lineColor: T, district: 'Butyrsky', street: 'Sushchyovsky Val, 5', venues: ['Flacon, Bolshaya Novodmitrovskaya 36', 'Savyolovsky studio', 'Sushchyovsky Val 5'], x: 48, y: 24 },
];

export const HUBS = [
  'tverskaya',
  'arbatskaya',
  'park-kultury',
  'city',
  'mayakov',
  'kievskaya',
] as const;

export function stationById(id: string): MetroStation | undefined {
  return STATIONS.find((s) => s.id === id);
}

export function lineById(id: string): MetroLine | undefined {
  return LINES.find((l) => l.id === id);
}

export function estimateStops(fromId: string, toId: string): number {
  if (fromId === toId) return 0;
  const a = stationById(fromId);
  const b = stationById(toId);
  if (!a || !b) return 12;
  const dist = Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  if (a.lineId === b.lineId) return Math.max(1, Math.round(dist / 8));
  return Math.max(3, Math.round(dist / 5));
}

export function commuteScore(
  preferredId: string | undefined,
  activityStationId: string | undefined,
  walkMinutes: number | undefined,
): number {
  if (!preferredId || !activityStationId) return 52;
  const minutes = (walkMinutes ?? 0) + estimateStops(preferredId, activityStationId) * 4;
  if (minutes <= 0) return 100;
  if (minutes >= 32) return 0;
  return Math.round(100 - (minutes / 32) * 100);
}
