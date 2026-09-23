const R2_BASE_URL = process.env.REACT_APP_R2_BASE_URL;

// Keep map identity and presentation metadata together so every map consumer
// uses the same code, name, and preview image.
export const MAP_DEFINITIONS = [
  {
    id: 1,
    code: "Ghost_city_level",
    name: "Tərk edilmiş şəhər",
    image: `${R2_BASE_URL}/photos/LostCityPreview.png`,
  },
  {
    id: 2,
    code: "Island_Stonehenge_Level",
    name: "Qədimi daşlar",
    image: `${R2_BASE_URL}/photos/StonehengePreview.png`,
  },
  {
    id: 3,
    code: "Ancient_castle_level1",
    name: "Qədim qala",
    image: `${R2_BASE_URL}/photos/AncientLevelPreview.png`,
  },
  {
    id: 4,
    code: "Ghost_city_level_hard",
    name: "Tərk edilmiş şəhər - 2",
    image: `${R2_BASE_URL}/photos/LostCity2Preview.png`,
  },
  {
    id: 5,
    code: "Island_Level_river",
    name: "Meşəlik ərazi",
    image: `${R2_BASE_URL}/photos/ForestPreview.png`,
  },
  {
    id: 6,
    code: "Ancient_castle_level2",
    name: "Qədim qala - 2",
    image: `${R2_BASE_URL}/photos/AncientCastleLeve2Prevew.png`,
  },
  {
    id: 7,
    code: "Garage_level",
    name: "Qaraj",
    image: `${R2_BASE_URL}/photos/GaragePreview.png`,
  },
];

export const DISPLAYED_MAPS = MAP_DEFINITIONS.map(({ code }) => code.toLowerCase());

export const MAP_NAMES = MAP_DEFINITIONS.reduce((names, { code, name }) => {
  names[code.toLowerCase()] = name;
  return names;
}, {});
