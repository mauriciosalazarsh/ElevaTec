-- ============================================
-- Script de Pruebas para la Base de Datos
-- Ejecutar DESPUÉS de database_schema.sql
-- ============================================

-- ============================================
-- 1. VERIFICAR ESTRUCTURA DE TABLAS
-- ============================================

\echo '============================================'
\echo 'VERIFICANDO ESTRUCTURA DE LA BASE DE DATOS'
\echo '============================================'
\echo ''

-- Listar todas las tablas
\echo '📋 TABLAS CREADAS:'
SELECT table_name,
       (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) AS num_columns
FROM information_schema.tables t
WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
ORDER BY table_name;

\echo ''
\echo '📊 VISTAS CREADAS:'
SELECT table_name
FROM information_schema.views
WHERE table_schema = 'public'
ORDER BY table_name;

-- ============================================
-- 2. CONSULTAS DE VERIFICACIÓN
-- ============================================

\echo ''
\echo '============================================'
\echo 'ESTADÍSTICAS DE DATOS'
\echo '============================================'
\echo ''

-- Resumen de usuarios
\echo '👥 USUARIOS:'
SELECT role, COUNT(*) AS cantidad
FROM users
GROUP BY role
ORDER BY cantidad DESC;

\echo ''
\echo '🏢 TIPOS DE ESPACIOS:'
SELECT name, code, default_capacity, color
FROM space_types
ORDER BY id;

\echo ''
\echo '📍 ESPACIOS POR TIPO:'
SELECT
    st.name AS tipo_espacio,
    COUNT(s.id) AS cantidad_espacios,
    SUM(s.capacity) AS capacidad_total,
    SUM(s.current_people) AS personas_total
FROM space_types st
LEFT JOIN spaces s ON st.id = s.space_type_id
GROUP BY st.name
ORDER BY cantidad_espacios DESC;

\echo ''
\echo '🏢 ESPACIOS POR EDIFICIO:'
SELECT
    building AS edificio,
    COUNT(*) AS cantidad_espacios,
    SUM(capacity) AS capacidad_total,
    SUM(current_people) AS personas_actuales,
    ROUND((SUM(current_people)::DECIMAL / NULLIF(SUM(capacity), 0)) * 100, 1) AS porcentaje_ocupacion
FROM spaces
WHERE status = 'active' AND building IS NOT NULL
GROUP BY building
ORDER BY porcentaje_ocupacion DESC;

\echo ''
\echo '📱 DISPOSITIVOS:'
SELECT status, COUNT(*) AS cantidad
FROM devices
GROUP BY status;

\echo ''
\echo '📊 LOGS DE AFORO (ÚLTIMAS 24H):'
SELECT COUNT(*) AS total_registros,
       MIN(timestamp) AS primer_registro,
       MAX(timestamp) AS ultimo_registro,
       ROUND(AVG(people_count), 1) AS promedio_personas
FROM aforo_logs
WHERE timestamp >= NOW() - INTERVAL '24 hours';

-- ============================================
-- 3. CONSULTAS DE EJEMPLO (CASOS DE USO)
-- ============================================

\echo ''
\echo '============================================'
\echo 'CONSULTAS DE EJEMPLO'
\echo '============================================'
\echo ''

-- Ejemplo 1: Espacios con mayor ocupación
\echo '🔴 TOP 5 ESPACIOS MÁS LLENOS:'
SELECT
    s.name AS espacio,
    st.name AS tipo,
    s.building AS edificio,
    s.current_people AS personas_actuales,
    s.capacity AS capacidad,
    ROUND((s.current_people::DECIMAL / s.capacity) * 100, 1) AS porcentaje,
    get_aforo_status(s.current_people, s.capacity) AS estado
FROM spaces s
JOIN space_types st ON s.space_type_id = st.id
WHERE s.status = 'active' AND s.capacity > 0
ORDER BY (s.current_people::DECIMAL / s.capacity) DESC
LIMIT 5;

\echo ''
\echo '🟢 TOP 5 ESPACIOS MÁS DISPONIBLES:'
SELECT
    s.name AS espacio,
    st.name AS tipo,
    s.building AS edificio,
    s.current_people AS personas_actuales,
    s.capacity AS capacidad,
    ROUND((s.current_people::DECIMAL / s.capacity) * 100, 1) AS porcentaje,
    get_aforo_status(s.current_people, s.capacity) AS estado
FROM spaces s
JOIN space_types st ON s.space_type_id = st.id
WHERE s.status = 'active' AND s.capacity > 0
ORDER BY (s.current_people::DECIMAL / s.capacity) ASC
LIMIT 5;

\echo ''
\echo '📚 SALONES DISPONIBLES (< 50% ocupación):'
SELECT
    s.name AS salon,
    s.building AS edificio,
    s.floor AS piso,
    s.current_people AS personas,
    s.capacity AS capacidad,
    ROUND((s.current_people::DECIMAL / s.capacity) * 100, 1) AS porcentaje
FROM spaces s
JOIN space_types st ON s.space_type_id = st.id
WHERE st.code = 'CLASSROOM'
  AND s.status = 'active'
  AND (s.current_people::DECIMAL / s.capacity) < 0.5
ORDER BY porcentaje ASC;

\echo ''
\echo '⏰ HORAS PICO DE USO (PROMEDIO POR HORA):'
SELECT
    EXTRACT(HOUR FROM timestamp)::INTEGER AS hora,
    ROUND(AVG(people_count), 1) AS promedio_personas,
    COUNT(*) AS num_mediciones
FROM aforo_logs
WHERE timestamp >= NOW() - INTERVAL '7 days'
GROUP BY EXTRACT(HOUR FROM timestamp)
ORDER BY promedio_personas DESC
LIMIT 10;

\echo ''
\echo '🏆 ESPACIOS MÁS POPULARES (MÁS LOGS):'
SELECT
    s.name AS espacio,
    st.name AS tipo,
    COUNT(al.id) AS num_mediciones,
    ROUND(AVG(al.people_count), 1) AS promedio_personas
FROM spaces s
JOIN space_types st ON s.space_type_id = st.id
LEFT JOIN aforo_logs al ON s.id = al.space_id
GROUP BY s.name, st.name
ORDER BY num_mediciones DESC
LIMIT 5;

-- ============================================
-- 4. PROBAR VISTAS
-- ============================================

\echo ''
\echo '============================================'
\echo 'PROBANDO VISTAS'
\echo '============================================'
\echo ''

\echo '📊 VISTA: v_spaces_full (primeros 5 registros):'
SELECT
    name,
    space_type_name,
    building,
    floor,
    current_people,
    capacity,
    occupancy_percentage,
    aforo_status,
    device_status
FROM v_spaces_full
ORDER BY occupancy_percentage DESC
LIMIT 5;

\echo ''
\echo '📊 VISTA: v_aforo_by_type:'
SELECT
    space_type_name AS tipo,
    total_spaces AS espacios,
    total_capacity AS capacidad_total,
    total_people AS personas_totales,
    avg_occupancy_percentage AS porcentaje_promedio,
    spaces_bajo AS disponibles,
    spaces_medio AS moderados,
    spaces_alto AS llenos
FROM v_aforo_by_type
ORDER BY avg_occupancy_percentage DESC;

\echo ''
\echo '📊 VISTA: v_aforo_by_building:'
SELECT
    building AS edificio,
    total_spaces AS espacios,
    total_capacity AS capacidad,
    total_people AS personas,
    occupancy_percentage AS porcentaje,
    spaces_bajo AS disponibles,
    spaces_medio AS moderados,
    spaces_alto AS llenos
FROM v_aforo_by_building
ORDER BY occupancy_percentage DESC;

-- ============================================
-- 5. PROBAR FUNCIONES
-- ============================================

\echo ''
\echo '============================================'
\echo 'PROBANDO FUNCIONES'
\echo '============================================'
\echo ''

\echo '🧪 FUNCIÓN: get_aforo_status()'
SELECT
    current_people AS personas,
    capacity AS capacidad,
    get_aforo_status(current_people, capacity) AS estado_calculado,
    CASE
        WHEN current_people::DECIMAL / capacity < 0.5 THEN 'bajo'
        WHEN current_people::DECIMAL / capacity < 0.8 THEN 'medio'
        ELSE 'alto'
    END AS estado_esperado
FROM spaces
WHERE capacity > 0
LIMIT 10;

\echo ''
\echo '🕐 FUNCIÓN: is_space_open_now()'
SELECT
    s.id,
    s.name AS espacio,
    is_space_open_now(s.id) AS esta_abierto,
    EXTRACT(DOW FROM CURRENT_TIMESTAMP)::INTEGER AS dia_semana_actual,
    CURRENT_TIME AS hora_actual
FROM spaces s
LIMIT 5;

-- ============================================
-- 6. VERIFICAR INTEGRIDAD REFERENCIAL
-- ============================================

\echo ''
\echo '============================================'
\echo 'VERIFICANDO INTEGRIDAD REFERENCIAL'
\echo '============================================'
\echo ''

\echo '✅ Espacios sin tipo válido (debería ser 0):'
SELECT COUNT(*) FROM spaces WHERE space_type_id NOT IN (SELECT id FROM space_types);

\echo ''
\echo '✅ Espacios con dispositivo inválido (debería ser 0):'
SELECT COUNT(*) FROM spaces WHERE device_id IS NOT NULL AND device_id NOT IN (SELECT device_id FROM devices);

\echo ''
\echo '✅ Logs de aforo sin espacio válido (debería ser 0):'
SELECT COUNT(*) FROM aforo_logs WHERE space_id NOT IN (SELECT id FROM spaces);

\echo ''
\echo '✅ Alertas sin espacio válido (debería ser 0):'
SELECT COUNT(*) FROM alerts WHERE space_id NOT IN (SELECT id FROM spaces);

-- ============================================
-- 7. VERIFICAR ÍNDICES
-- ============================================

\echo ''
\echo '============================================'
\echo 'ÍNDICES CREADOS'
\echo '============================================'
\echo ''

SELECT
    schemaname AS esquema,
    tablename AS tabla,
    indexname AS indice,
    indexdef AS definicion
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- ============================================
-- 8. RESUMEN FINAL
-- ============================================

\echo ''
\echo '============================================'
\echo 'RESUMEN FINAL'
\echo '============================================'
\echo ''

SELECT
    '✅ Base de datos funcionando correctamente' AS status,
    (SELECT COUNT(*) FROM users) AS usuarios,
    (SELECT COUNT(*) FROM space_types) AS tipos_espacios,
    (SELECT COUNT(*) FROM spaces) AS espacios,
    (SELECT COUNT(*) FROM devices) AS dispositivos,
    (SELECT COUNT(*) FROM aforo_logs) AS logs,
    (SELECT COUNT(*) FROM space_schedules) AS horarios,
    (SELECT COUNT(*) FROM alerts) AS alertas;

\echo ''
\echo '🎉 ¡TODAS LAS PRUEBAS COMPLETADAS!'
\echo ''
