-- Migration 018: Add frontend presentation and ordering metadata to maps table
ALTER TABLE maps
  ADD COLUMN IF NOT EXISTS order_index INTEGER,
  ADD COLUMN IF NOT EXISTS image_url TEXT,
  ADD COLUMN IF NOT EXISTS difficulty VARCHAR(50),
  ADD COLUMN IF NOT EXISTS duration_minutes INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE NOT NULL;

CREATE INDEX IF NOT EXISTS idx_maps_active_order ON maps(is_active, order_index);

-- Configure Level 1
UPDATE maps
SET order_index = 1,
    difficulty = 'Asan',
    duration_minutes = 2,
    image_url = 'https://pub-05d3c9c914034a949c2227d5db6227cd.r2.dev/photos/LostCityPreview.png',
    is_active = true
WHERE code = 'Ghost_1';

-- Configure Level 2
UPDATE maps
SET order_index = 2,
    difficulty = 'Orta',
    duration_minutes = 2,
    image_url = 'https://pub-05d3c9c914034a949c2227d5db6227cd.r2.dev/photos/StonehengePreview.png',
    is_active = true
WHERE code = 'Island_Stonehenge';

-- Configure Level 3
UPDATE maps
SET order_index = 3,
    difficulty = 'Çətin',
    duration_minutes = 3,
    image_url = 'https://pub-05d3c9c914034a949c2227d5db6227cd.r2.dev/photos/AncientLevelPreview.png',
    is_active = true
WHERE code = 'Castle_1';

-- Configure Level 4
UPDATE maps
SET order_index = 4,
    difficulty = 'Çətin',
    duration_minutes = 0,
    image_url = 'https://pub-05d3c9c914034a949c2227d5db6227cd.r2.dev/photos/LostCity2Preview.png',
    is_active = true
WHERE code = 'Ghost_2';

-- Configure Level 5
UPDATE maps
SET order_index = 5,
    difficulty = 'Çox Çətin',
    duration_minutes = 40,
    image_url = 'https://pub-05d3c9c914034a949c2227d5db6227cd.r2.dev/photos/ForestPreview.png',
    is_active = true
WHERE code = 'Island';

-- Configure Level 6
UPDATE maps
SET order_index = 6,
    difficulty = 'Çox Çətin',
    duration_minutes = 0,
    image_url = 'https://pub-05d3c9c914034a949c2227d5db6227cd.r2.dev/photos/AncientCastleLeve2Prevew.png',
    is_active = true
WHERE code = 'Castle_2';

-- Mark all other maps as inactive and clear order_index
UPDATE maps
SET is_active = false,
    order_index = NULL
WHERE code NOT IN ('Ghost_1', 'Island_Stonehenge', 'Castle_1', 'Ghost_2', 'Island', 'Castle_2');
