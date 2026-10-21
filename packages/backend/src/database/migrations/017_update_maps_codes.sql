-- Migration 017: Update map codes, names, and descriptions for levels 1-6 and remove level 7
UPDATE maps
SET code = 'Ghost_1',
    name = 'Tərk edilmiş şəhər',
    description = 'Binaların arasında sürətli naviqasiya.'
WHERE code IN ('Ghost_city_level', 'Ghost_1');

UPDATE maps
SET code = 'Island_Stonehenge',
    name = 'Qədimi daşlar',
    description = 'Meşəlik ərazidə daşların arasında manevr edərək uçuş.'
WHERE code IN ('Island_Stonehenge_Level', 'Island_Stonehenge');

UPDATE maps
SET code = 'Castle_1',
    name = 'Qədim qala',
    description = 'Qədim qala və divarların arasında manevr edərək uçuş.'
WHERE code IN ('Ancient_castle_level1', 'Castle_1');

UPDATE maps
SET code = 'Ghost_2',
    name = 'Tərk edilmiş şəhər - 2',
    description = 'Anbar və binaların ətrafında uçuş.'
WHERE code IN ('Ghost_city_level_hard', 'Ghost_2');

UPDATE maps
SET code = 'Island',
    name = 'Meşəlik ərazi',
    description = 'Meşə arasında manevrə edərək uç.'
WHERE code IN ('Island_Level_river', 'Island');

UPDATE maps
SET code = 'Castle_2',
    name = 'Qədim qala - 2',
    description = 'Qədim qala və divarların arasında manevr edərək uçuş.'
WHERE code IN ('Ancient_castle_level2', 'Castle_2');

DELETE FROM maps
WHERE code = 'Garage_level';

