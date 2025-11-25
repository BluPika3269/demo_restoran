-- Fix appointments ID sequence
SELECT setval(pg_get_serial_sequence('appointments', 'id'), COALESCE((SELECT MAX(id) FROM appointments), 0) + 1, false);

-- Fix services ID sequence  
SELECT setval(pg_get_serial_sequence('services', 'id'), COALESCE((SELECT MAX(id) FROM services), 0) + 1, false);

-- Fix service_categories ID sequence
SELECT setval(pg_get_serial_sequence('service_categories', 'id'), COALESCE((SELECT MAX(id) FROM service_categories), 0) + 1, false);
