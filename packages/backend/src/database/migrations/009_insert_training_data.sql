-- Migration 009: Seed training modules and lessons

INSERT INTO training_modules (id, title, description, sort_order)
SELECT 1, 'FPV Dərslik', NULL, 1
WHERE NOT EXISTS (SELECT 1 FROM training_modules WHERE id = 1);

INSERT INTO training_modules (id, title, description, sort_order)
SELECT 2, 'Video Təlimlər', NULL, 2
WHERE NOT EXISTS (SELECT 1 FROM training_modules WHERE id = 2);

INSERT INTO training_lessons (id, module_id, title, type, link, sort_order)
SELECT 1, 1, 'Pilotsuz uçuş aparatlarının idarə edilməsi kursu', 'pdf', 'https://drive.google.com/file/d/1IMN1yUwn_XKy3uGhXKWFeBJRh17qIzis/view?usp=sharing', 1
WHERE NOT EXISTS (SELECT 1 FROM training_lessons WHERE id = 1);

INSERT INTO training_lessons (id, module_id, title, type, link, sort_order)
SELECT 2, 1, 'Kamikadze FPV dronları', 'pdf', 'https://drive.google.com/file/d/1Mtlf5QTcnGjVWIfvakR1tIxt26I6swIL/view?usp=sharing', 2
WHERE NOT EXISTS (SELECT 1 FROM training_lessons WHERE id = 2);

INSERT INTO training_lessons (id, module_id, title, type, link, sort_order)
SELECT 3, 1, 'FPV sisteminin komponentləri', 'pdf', 'https://drive.google.com/file/d/10wwTCVsBbBWD_wUH-HLo2ELxBI05wDzp/view?usp=sharing', 3
WHERE NOT EXISTS (SELECT 1 FROM training_lessons WHERE id = 3);

INSERT INTO training_lessons (id, module_id, title, type, link, sort_order)
SELECT 4, 1, 'Simulyasiya təlimləri və Master-Slave idarəetmə sistemi', 'pdf', 'https://drive.google.com/file/d/1kdpUGurz2bYz0o3yz5QDQkmSe0Xb8dNl/view?usp=sharing', 4
WHERE NOT EXISTS (SELECT 1 FROM training_lessons WHERE id = 4);

INSERT INTO training_lessons (id, module_id, title, type, link, sort_order)
SELECT 5, 1, 'Təhlükəsizlik qaydaları və texniki qulluq', 'pdf', 'https://drive.google.com/file/d/1XXKRr7k1EeO7fn6Ke9vBYiX7hdj_pVKa/view?usp=sharing', 5
WHERE NOT EXISTS (SELECT 1 FROM training_lessons WHERE id = 5);

INSERT INTO training_lessons (id, module_id, title, type, link, sort_order)
SELECT 6, 1, 'Uçuş prinsipləri, kvadrokopter uçuşunun fiziki prinsipləri', 'pdf', 'https://drive.google.com/file/d/1trJrAius9OCZFckZEQyrhgBqsRDc-QYH/view?usp=sharing', 6
WHERE NOT EXISTS (SELECT 1 FROM training_lessons WHERE id = 6);

INSERT INTO training_lessons (id, module_id, title, type, link, sort_order)
SELECT 7, 1, 'Uçuş dinamikası', 'pdf', 'https://drive.google.com/file/d/1HpMRQ2oprUDADGhyzHsqEPYGEHVJU8th/view?usp=sharing', 7
WHERE NOT EXISTS (SELECT 1 FROM training_lessons WHERE id = 7);

INSERT INTO training_lessons (id, module_id, title, type, link, sort_order)
SELECT 8, 1, 'Batareyalar və sensorlar', 'pdf', 'https://drive.google.com/file/d/1Ci7Ix-NnlCUEyHlDk_b3p6z54RRz2SQX/view?usp=sharing', 8
WHERE NOT EXISTS (SELECT 1 FROM training_lessons WHERE id = 8);

INSERT INTO training_lessons (id, module_id, title, type, link, sort_order)
SELECT 9, 1, 'Proqram təminatı', 'pdf', 'https://drive.google.com/file/d/1MZ1WOMnsUrGsfNj68C2bt1YB7Au8S4Gk/view?usp=sharing', 9
WHERE NOT EXISTS (SELECT 1 FROM training_lessons WHERE id = 9);

INSERT INTO training_lessons (id, module_id, title, type, link, sort_order)
SELECT 10, 1, 'Uçuşa hazırlıq', 'pdf', 'https://drive.google.com/file/d/1DoJpteLGTCj72q8ZQUPOkaPHIuxSbUSp/view?usp=sharing', 10
WHERE NOT EXISTS (SELECT 1 FROM training_lessons WHERE id = 10);

INSERT INTO training_lessons (id, module_id, title, type, link, sort_order)
SELECT 11, 2, 'Manual Uçuş', 'video', NULL, 1
WHERE NOT EXISTS (SELECT 1 FROM training_lessons WHERE id = 11);

INSERT INTO training_lessons (id, module_id, title, type, link, sort_order)
SELECT 12, 2, 'Hover Praktikası', 'video', NULL, 2
WHERE NOT EXISTS (SELECT 1 FROM training_lessons WHERE id = 12);

INSERT INTO training_lessons (id, module_id, title, type, link, sort_order)
SELECT 13, 2, 'Waypoint Planlaması', 'video', NULL, 3
WHERE NOT EXISTS (SELECT 1 FROM training_lessons WHERE id = 13);

SELECT setval(pg_get_serial_sequence('training_modules', 'id'), COALESCE((SELECT MAX(id) FROM training_modules), 1), true);
SELECT setval(pg_get_serial_sequence('training_lessons', 'id'), COALESCE((SELECT MAX(id) FROM training_lessons), 1), true);
