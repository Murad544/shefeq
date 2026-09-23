const R2_BASE_URL = process.env.REACT_APP_R2_BASE_URL;

// Keep map identity and level presentation metadata together so every map
// consumer uses the same code, name, image, and level configuration.
export const MAPS = [
  {
    id: 1,
    code: "Ghost_city_level",
    name: "Tərk edilmiş şəhər",
    image: `${R2_BASE_URL}/photos/LostCityPreview.png`,
    description: "Binaların arasında sürətli naviqasiya.",
    difficulty: "Asan",
    duration: 2,
  },
  {
    id: 2,
    code: "Island_Stonehenge_Level",
    name: "Qədimi daşlar",
    image: `${R2_BASE_URL}/photos/StonehengePreview.png`,
    description: "Meşəlik ərazidə daşların arasında manevr edərək uçuş.",
    difficulty: "Orta",
    duration: 2,
  },
  {
    id: 3,
    code: "Ancient_castle_level1",
    name: "Qədim qala",
    image: `${R2_BASE_URL}/photos/AncientLevelPreview.png`,
    description: "Qədim qala və divarların arasında manevr edərək uçuş.",
    difficulty: "Çətin",
    duration: 3,
  },
  {
    id: 4,
    code: "Ghost_city_level_hard",
    name: "Tərk edilmiş şəhər - 2",
    image: `${R2_BASE_URL}/photos/LostCity2Preview.png`,
    description: "Anbar və binaların ətrafında uçuş.",
    difficulty: "Çətin",
    duration: 0,
  },
  {
    id: 5,
    code: "Island_Level_river",
    name: "Meşəlik ərazi",
    image: `${R2_BASE_URL}/photos/ForestPreview.png`,
    description: "Meşə arasında manevrə edərək uç.",
    difficulty: "Çox Çətin",
    duration: 40,
  },
  {
    id: 6,
    code: "Ancient_castle_level2",
    name: "Qədim qala - 2",
    image: `${R2_BASE_URL}/photos/AncientCastleLeve2Prevew.png`,
    description: "Qədim qala və divarların arasında manevr edərək uçuş.",
    difficulty: "Çox Çətin",
    duration: 0,
  },
  {
    id: 7,
    code: "Garage_level",
    name: "Qaraj",
    image: `${R2_BASE_URL}/photos/GaragePreview.png`,
    description: "Qaraj və ətrafında manevr edərək uçuş.",
    difficulty: "Çox Çətin",
    duration: 0,
  },
];

export const INITIAL_LEVELS_DATA = MAPS.map((map) => ({
  ...map,
  title: `Səviyyə ${map.id}: ${map.name}`,
  timesPlayed: 0,
  checkpoints: null,
  completed: false,
  bestTime: null,
}));

export const DISPLAYED_MAPS = MAPS.map(({ code }) => code.toLowerCase());

export const MAP_NAMES = MAPS.reduce((names, { code, name }) => {
  names[code.toLowerCase()] = name;
  return names;
}, {});
