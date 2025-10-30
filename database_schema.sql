-- ============================================
-- ElevaTec - Base de Datos Multiespacio
-- Sistema de Monitoreo de Aforo General
-- PostgreSQL 15+
-- ============================================

-- Eliminar tablas existentes si existen (solo para desarrollo/testing)
DROP TABLE IF EXISTS alerts CASCADE;
DROP TABLE IF EXISTS space_schedules CASCADE;
DROP TABLE IF EXISTS aforo_logs CASCADE;
DROP TABLE IF EXISTS spaces CASCADE;
DROP TABLE IF EXISTS space_types CASCADE;
DROP TABLE IF EXISTS devices CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================
-- 1. TABLA: users (Usuarios del Sistema)
-- ============================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'student',
    department VARCHAR(50),
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Constraints
    CONSTRAINT chk_role CHECK (role IN ('admin', 'manager', 'monitor', 'student', 'teacher', 'staff'))
);

-- Índices para users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(is_active);

-- Comentarios
COMMENT ON TABLE users IS 'Usuarios del sistema con diferentes roles y permisos';
COMMENT ON COLUMN users.role IS 'Roles: admin, manager, monitor, student, teacher, staff';

-- ============================================
-- 2. TABLA: space_types (Tipos de Espacios)
-- ============================================
CREATE TABLE space_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    code VARCHAR(20) NOT NULL UNIQUE,
    icon VARCHAR(50),
    description TEXT,
    default_capacity INTEGER DEFAULT 10,
    color VARCHAR(7) DEFAULT '#4CAF50',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Constraints
    CONSTRAINT chk_default_capacity CHECK (default_capacity > 0),
    CONSTRAINT chk_color_format CHECK (color ~* '^#[0-9A-F]{6}$')
);

-- Índices para space_types
CREATE INDEX idx_space_types_code ON space_types(code);
CREATE INDEX idx_space_types_active ON space_types(is_active);

-- Comentarios
COMMENT ON TABLE space_types IS 'Catálogo de tipos de espacios disponibles (ascensores, salones, bibliotecas, etc.)';
COMMENT ON COLUMN space_types.code IS 'Código único para identificar el tipo (ej: ELEVATOR, CLASSROOM)';

-- ============================================
-- 3. TABLA: devices (Dispositivos ESP32-CAM)
-- ============================================
CREATE TABLE devices (
    id SERIAL PRIMARY KEY,
    device_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100),
    ip_address VARCHAR(50),
    mac_address VARCHAR(20),
    firmware_version VARCHAR(20),
    last_seen TIMESTAMP,
    status VARCHAR(20) DEFAULT 'offline',
    battery_level INTEGER,
    signal_strength INTEGER,
    is_active BOOLEAN DEFAULT true,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Constraints
    CONSTRAINT chk_device_status CHECK (status IN ('online', 'offline', 'error', 'maintenance')),
    CONSTRAINT chk_battery_level CHECK (battery_level >= 0 AND battery_level <= 100),
    CONSTRAINT chk_signal_strength CHECK (signal_strength >= -100 AND signal_strength <= 0)
);

-- Índices para devices
CREATE INDEX idx_devices_device_id ON devices(device_id);
CREATE INDEX idx_devices_status ON devices(status);
CREATE INDEX idx_devices_last_seen ON devices(last_seen DESC);
CREATE INDEX idx_devices_active ON devices(is_active);

-- Comentarios
COMMENT ON TABLE devices IS 'Dispositivos ESP32-CAM que capturan el aforo en tiempo real';
COMMENT ON COLUMN devices.status IS 'Estados: online, offline, error, maintenance';

-- ============================================
-- 4. TABLA: spaces (Espacios Monitoreados)
-- ============================================
CREATE TABLE spaces (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    space_type_id INTEGER NOT NULL,
    device_id VARCHAR(50),
    building VARCHAR(50),
    floor INTEGER,
    room_number VARCHAR(20),
    capacity INTEGER NOT NULL,
    current_people INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active',
    description TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    image_url VARCHAR(255),
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Foreign Keys
    CONSTRAINT fk_space_type FOREIGN KEY (space_type_id)
        REFERENCES space_types(id) ON DELETE RESTRICT,
    CONSTRAINT fk_device FOREIGN KEY (device_id)
        REFERENCES devices(device_id) ON DELETE SET NULL,

    -- Constraints
    CONSTRAINT chk_capacity CHECK (capacity > 0),
    CONSTRAINT chk_current_people CHECK (current_people >= 0),
    CONSTRAINT chk_space_status CHECK (status IN ('active', 'inactive', 'maintenance', 'closed')),
    CONSTRAINT chk_latitude CHECK (latitude >= -90 AND latitude <= 90),
    CONSTRAINT chk_longitude CHECK (longitude >= -180 AND longitude <= 180)
);

-- Índices para spaces
CREATE INDEX idx_spaces_type ON spaces(space_type_id);
CREATE INDEX idx_spaces_device ON spaces(device_id);
CREATE INDEX idx_spaces_building ON spaces(building);
CREATE INDEX idx_spaces_floor ON spaces(floor);
CREATE INDEX idx_spaces_status ON spaces(status);
CREATE INDEX idx_spaces_public ON spaces(is_public);
CREATE INDEX idx_spaces_location ON spaces(latitude, longitude);

-- Comentarios
COMMENT ON TABLE spaces IS 'Espacios físicos monitoreados (salones, ascensores, bibliotecas, etc.)';
COMMENT ON COLUMN spaces.status IS 'Estados: active, inactive, maintenance, closed';
COMMENT ON COLUMN spaces.current_people IS 'Cantidad actual de personas en el espacio';

-- ============================================
-- 5. TABLA: aforo_logs (Historial de Aforo)
-- ============================================
CREATE TABLE aforo_logs (
    id SERIAL PRIMARY KEY,
    space_id INTEGER NOT NULL,
    device_id INTEGER,
    people_count INTEGER NOT NULL,
    people_in INTEGER DEFAULT 0,
    people_out INTEGER DEFAULT 0,
    confidence DECIMAL(3, 2) DEFAULT 1.0,
    temperature DECIMAL(5, 2),
    humidity DECIMAL(5, 2),
    image_path VARCHAR(255),
    notes TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Foreign Keys
    CONSTRAINT fk_space FOREIGN KEY (space_id)
        REFERENCES spaces(id) ON DELETE CASCADE,
    CONSTRAINT fk_device_log FOREIGN KEY (device_id)
        REFERENCES devices(id) ON DELETE SET NULL,

    -- Constraints
    CONSTRAINT chk_people_count CHECK (people_count >= 0),
    CONSTRAINT chk_people_in CHECK (people_in >= 0),
    CONSTRAINT chk_people_out CHECK (people_out >= 0),
    CONSTRAINT chk_confidence CHECK (confidence >= 0 AND confidence <= 1),
    CONSTRAINT chk_temperature CHECK (temperature >= -50 AND temperature <= 100),
    CONSTRAINT chk_humidity CHECK (humidity >= 0 AND humidity <= 100)
);

-- Índices para aforo_logs (optimizados para consultas temporales)
CREATE INDEX idx_aforo_logs_space ON aforo_logs(space_id);
CREATE INDEX idx_aforo_logs_device ON aforo_logs(device_id);
CREATE INDEX idx_aforo_logs_timestamp ON aforo_logs(timestamp DESC);
CREATE INDEX idx_aforo_logs_space_timestamp ON aforo_logs(space_id, timestamp DESC);

-- Particionamiento por fecha (opcional, para grandes volúmenes)
-- CREATE INDEX idx_aforo_logs_timestamp_brin ON aforo_logs USING BRIN(timestamp);

-- Comentarios
COMMENT ON TABLE aforo_logs IS 'Registro histórico de todas las mediciones de aforo';
COMMENT ON COLUMN aforo_logs.confidence IS 'Nivel de confianza de la detección (0.0 a 1.0)';

-- ============================================
-- 6. TABLA: space_schedules (Horarios)
-- ============================================
CREATE TABLE space_schedules (
    id SERIAL PRIMARY KEY,
    space_id INTEGER NOT NULL,
    day_of_week INTEGER NOT NULL,
    open_time TIME NOT NULL,
    close_time TIME NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Foreign Keys
    CONSTRAINT fk_space_schedule FOREIGN KEY (space_id)
        REFERENCES spaces(id) ON DELETE CASCADE,

    -- Constraints
    CONSTRAINT chk_day_of_week CHECK (day_of_week >= 0 AND day_of_week <= 6),
    CONSTRAINT chk_time_order CHECK (open_time < close_time),
    CONSTRAINT uq_space_day UNIQUE (space_id, day_of_week)
);

-- Índices para space_schedules
CREATE INDEX idx_schedules_space ON space_schedules(space_id);
CREATE INDEX idx_schedules_day ON space_schedules(day_of_week);
CREATE INDEX idx_schedules_active ON space_schedules(is_active);

-- Comentarios
COMMENT ON TABLE space_schedules IS 'Horarios de apertura y cierre de espacios';
COMMENT ON COLUMN space_schedules.day_of_week IS 'Día de la semana (0=Domingo, 1=Lunes, ..., 6=Sábado)';

-- ============================================
-- 7. TABLA: alerts (Alertas del Sistema)
-- ============================================
CREATE TABLE alerts (
    id SERIAL PRIMARY KEY,
    space_id INTEGER NOT NULL,
    alert_type VARCHAR(30) NOT NULL,
    severity VARCHAR(20) DEFAULT 'medium',
    message TEXT NOT NULL,
    is_resolved BOOLEAN DEFAULT false,
    resolved_by INTEGER,
    resolved_note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,

    -- Foreign Keys
    CONSTRAINT fk_alert_space FOREIGN KEY (space_id)
        REFERENCES spaces(id) ON DELETE CASCADE,
    CONSTRAINT fk_resolved_by FOREIGN KEY (resolved_by)
        REFERENCES users(id) ON DELETE SET NULL,

    -- Constraints
    CONSTRAINT chk_alert_type CHECK (alert_type IN (
        'capacity_exceeded', 'device_offline', 'low_battery',
        'sensor_error', 'maintenance_required', 'unauthorized_access', 'other'
    )),
    CONSTRAINT chk_severity CHECK (severity IN ('low', 'medium', 'high', 'critical'))
);

-- Índices para alerts
CREATE INDEX idx_alerts_space ON alerts(space_id);
CREATE INDEX idx_alerts_type ON alerts(alert_type);
CREATE INDEX idx_alerts_severity ON alerts(severity);
CREATE INDEX idx_alerts_resolved ON alerts(is_resolved);
CREATE INDEX idx_alerts_created ON alerts(created_at DESC);

-- Comentarios
COMMENT ON TABLE alerts IS 'Sistema de alertas cuando se detectan anomalías o se exceden límites';
COMMENT ON COLUMN alerts.alert_type IS 'Tipos: capacity_exceeded, device_offline, low_battery, sensor_error, etc.';

-- ============================================
-- TRIGGERS PARA UPDATED_AT
-- ============================================

-- Función para actualizar timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para users
CREATE TRIGGER trigger_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger para devices
CREATE TRIGGER trigger_devices_updated_at
    BEFORE UPDATE ON devices
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger para spaces
CREATE TRIGGER trigger_spaces_updated_at
    BEFORE UPDATE ON spaces
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- VISTAS ÚTILES
-- ============================================

-- Vista: Espacios con información completa
CREATE OR REPLACE VIEW v_spaces_full AS
SELECT
    s.id,
    s.name,
    s.building,
    s.floor,
    s.room_number,
    s.capacity,
    s.current_people,
    ROUND((s.current_people::DECIMAL / NULLIF(s.capacity, 0)) * 100, 1) AS occupancy_percentage,
    CASE
        WHEN s.current_people::DECIMAL / NULLIF(s.capacity, 0) < 0.5 THEN 'bajo'
        WHEN s.current_people::DECIMAL / NULLIF(s.capacity, 0) < 0.8 THEN 'medio'
        ELSE 'alto'
    END AS aforo_status,
    s.status,
    st.name AS space_type_name,
    st.code AS space_type_code,
    st.icon AS space_type_icon,
    st.color AS space_type_color,
    s.device_id,
    d.status AS device_status,
    d.last_seen AS device_last_seen,
    s.latitude,
    s.longitude,
    s.is_public,
    s.created_at,
    s.updated_at
FROM spaces s
JOIN space_types st ON s.space_type_id = st.id
LEFT JOIN devices d ON s.device_id = d.device_id
WHERE s.status = 'active';

COMMENT ON VIEW v_spaces_full IS 'Vista completa de espacios con información de tipo y dispositivo';

-- Vista: Resumen de aforo por tipo de espacio
CREATE OR REPLACE VIEW v_aforo_by_type AS
SELECT
    st.id AS space_type_id,
    st.name AS space_type_name,
    st.code AS space_type_code,
    COUNT(s.id) AS total_spaces,
    SUM(s.capacity) AS total_capacity,
    SUM(s.current_people) AS total_people,
    ROUND(AVG((s.current_people::DECIMAL / NULLIF(s.capacity, 0)) * 100), 1) AS avg_occupancy_percentage,
    COUNT(CASE WHEN s.current_people::DECIMAL / NULLIF(s.capacity, 0) < 0.5 THEN 1 END) AS spaces_bajo,
    COUNT(CASE WHEN s.current_people::DECIMAL / NULLIF(s.capacity, 0) >= 0.5
               AND s.current_people::DECIMAL / NULLIF(s.capacity, 0) < 0.8 THEN 1 END) AS spaces_medio,
    COUNT(CASE WHEN s.current_people::DECIMAL / NULLIF(s.capacity, 0) >= 0.8 THEN 1 END) AS spaces_alto
FROM space_types st
LEFT JOIN spaces s ON st.id = s.space_type_id AND s.status = 'active'
WHERE st.is_active = true
GROUP BY st.id, st.name, st.code;

COMMENT ON VIEW v_aforo_by_type IS 'Resumen de ocupación agrupado por tipo de espacio';

-- Vista: Resumen de aforo por edificio
CREATE OR REPLACE VIEW v_aforo_by_building AS
SELECT
    s.building,
    COUNT(s.id) AS total_spaces,
    SUM(s.capacity) AS total_capacity,
    SUM(s.current_people) AS total_people,
    ROUND((SUM(s.current_people)::DECIMAL / NULLIF(SUM(s.capacity), 0)) * 100, 1) AS occupancy_percentage,
    COUNT(CASE WHEN s.current_people::DECIMAL / NULLIF(s.capacity, 0) < 0.5 THEN 1 END) AS spaces_bajo,
    COUNT(CASE WHEN s.current_people::DECIMAL / NULLIF(s.capacity, 0) >= 0.5
               AND s.current_people::DECIMAL / NULLIF(s.capacity, 0) < 0.8 THEN 1 END) AS spaces_medio,
    COUNT(CASE WHEN s.current_people::DECIMAL / NULLIF(s.capacity, 0) >= 0.8 THEN 1 END) AS spaces_alto
FROM spaces s
WHERE s.status = 'active' AND s.building IS NOT NULL
GROUP BY s.building;

COMMENT ON VIEW v_aforo_by_building IS 'Resumen de ocupación agrupado por edificio';

-- ============================================
-- FUNCIONES ÚTILES
-- ============================================

-- Función: Calcular estado de aforo
CREATE OR REPLACE FUNCTION get_aforo_status(
    current_people INTEGER,
    capacity INTEGER
) RETURNS VARCHAR(10) AS $$
DECLARE
    ratio DECIMAL;
BEGIN
    IF capacity = 0 THEN
        RETURN 'bajo';
    END IF;

    ratio := current_people::DECIMAL / capacity;

    IF ratio < 0.5 THEN
        RETURN 'bajo';
    ELSIF ratio < 0.8 THEN
        RETURN 'medio';
    ELSE
        RETURN 'alto';
    END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

COMMENT ON FUNCTION get_aforo_status IS 'Calcula el estado de aforo: bajo (<50%), medio (50-80%), alto (>80%)';

-- Función: Verificar si un espacio está abierto ahora
CREATE OR REPLACE FUNCTION is_space_open_now(
    p_space_id INTEGER
) RETURNS BOOLEAN AS $$
DECLARE
    v_day_of_week INTEGER;
    v_current_time TIME;
    v_is_open BOOLEAN;
BEGIN
    -- Obtener día de la semana (0=Domingo, 1=Lunes, etc.)
    v_day_of_week := EXTRACT(DOW FROM CURRENT_TIMESTAMP);
    v_current_time := CURRENT_TIME;

    -- Verificar si existe un horario y si estamos dentro del horario
    SELECT EXISTS(
        SELECT 1
        FROM space_schedules
        WHERE space_id = p_space_id
          AND day_of_week = v_day_of_week
          AND is_active = true
          AND v_current_time BETWEEN open_time AND close_time
    ) INTO v_is_open;

    RETURN v_is_open;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION is_space_open_now IS 'Verifica si un espacio está abierto en este momento según su horario';

-- ============================================
-- DATOS INICIALES
-- ============================================

-- Insertar usuario administrador por defecto
INSERT INTO users (name, email, password_hash, role, department) VALUES
('Administrator', 'admin@elevatec.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5pILFfZXd9K4W', 'admin', 'IT'),
('Usuario Demo', 'user@elevatec.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5pILFfZXd9K4W', 'student', 'Estudiantes');
-- Password para ambos: admin123

-- Insertar tipos de espacios
INSERT INTO space_types (name, code, icon, description, default_capacity, color) VALUES
('Ascensor', 'ELEVATOR', 'elevator', 'Ascensor para transporte vertical de personas', 10, '#607D8B'),
('Salón', 'CLASSROOM', 'school', 'Salón de clases o aula educativa', 40, '#2196F3'),
('Biblioteca', 'LIBRARY', 'local_library', 'Biblioteca o sala de lectura', 50, '#9C27B0'),
('Cafetería', 'CAFETERIA', 'restaurant', 'Cafetería, comedor o área de alimentos', 80, '#FF9800'),
('Laboratorio', 'LAB', 'science', 'Laboratorio de investigación o prácticas', 25, '#00BCD4'),
('Auditorio', 'AUDITORIUM', 'theater_comedy', 'Auditorio, sala de conferencias o eventos', 200, '#E91E63'),
('Gimnasio', 'GYM', 'fitness_center', 'Gimnasio o área deportiva', 30, '#4CAF50'),
('Estacionamiento', 'PARKING', 'local_parking', 'Estacionamiento vehicular', 100, '#795548'),
('Sala de Reuniones', 'MEETING_ROOM', 'meeting_room', 'Sala de reuniones corporativa', 15, '#3F51B5'),
('Área Común', 'COMMON_AREA', 'group', 'Área común o espacio recreativo', 50, '#009688');

-- Insertar dispositivos de ejemplo
INSERT INTO devices (device_id, name, ip_address, status, firmware_version) VALUES
('ESP32CAM-001', 'Cámara Ascensor Torre A', '192.168.1.101', 'online', '1.0.0'),
('ESP32CAM-002', 'Cámara Salón A-301', '192.168.1.102', 'online', '1.0.0'),
('ESP32CAM-003', 'Cámara Biblioteca Central', '192.168.1.103', 'online', '1.0.0'),
('ESP32CAM-004', 'Cámara Cafetería Principal', '192.168.1.104', 'online', '1.0.0'),
('ESP32CAM-005', 'Cámara Lab Física 1', '192.168.1.105', 'offline', '1.0.0');

-- Insertar espacios de ejemplo
INSERT INTO spaces (name, space_type_id, device_id, building, floor, room_number, capacity, current_people, status) VALUES
-- Ascensores
('Ascensor Torre A', 1, 'ESP32CAM-001', 'Torre A', NULL, NULL, 10, 3, 'active'),
('Ascensor Torre B', 1, NULL, 'Torre B', NULL, NULL, 10, 7, 'active'),

-- Salones
('Salón A-301', 2, 'ESP32CAM-002', 'Edificio A', 3, '301', 45, 23, 'active'),
('Salón A-302', 2, NULL, 'Edificio A', 3, '302', 45, 12, 'active'),
('Salón B-205', 2, NULL, 'Edificio B', 2, '205', 40, 35, 'active'),
('Salón C-102', 2, NULL, 'Edificio C', 1, '102', 50, 48, 'active'),

-- Bibliotecas
('Biblioteca Central', 3, 'ESP32CAM-003', 'Edificio Central', 1, NULL, 80, 45, 'active'),
('Biblioteca Especializada', 3, NULL, 'Edificio D', 2, NULL, 30, 12, 'active'),

-- Cafeterías
('Cafetería Principal', 4, 'ESP32CAM-004', 'Edificio B', 1, NULL, 120, 87, 'active'),
('Cafetería Secundaria', 4, NULL, 'Edificio C', 1, NULL, 60, 34, 'active'),

-- Laboratorios
('Laboratorio de Física 1', 5, 'ESP32CAM-005', 'Edificio C', 2, 'L201', 25, 18, 'active'),
('Laboratorio de Química', 5, NULL, 'Edificio C', 2, 'L202', 25, 15, 'active'),

-- Auditorio
('Auditorio Principal', 6, NULL, 'Edificio Central', 1, NULL, 250, 0, 'active'),

-- Gimnasio
('Gimnasio Multifuncional', 7, NULL, 'Edificio Deportivo', 1, NULL, 40, 28, 'active');

-- Insertar horarios de ejemplo (Lunes a Viernes 8:00-20:00)
DO $$
DECLARE
    space_record RECORD;
    day INTEGER;
BEGIN
    FOR space_record IN SELECT id FROM spaces WHERE space_type_id IN (2, 3, 4, 5, 6) LOOP
        FOR day IN 1..5 LOOP -- Lunes a Viernes
            INSERT INTO space_schedules (space_id, day_of_week, open_time, close_time)
            VALUES (space_record.id, day, '08:00:00', '20:00:00');
        END LOOP;
    END LOOP;
END $$;

-- Insertar logs de ejemplo (últimas 24 horas)
INSERT INTO aforo_logs (space_id, people_count, confidence, timestamp)
SELECT
    s.id,
    FLOOR(RANDOM() * s.capacity)::INTEGER,
    0.85 + (RANDOM() * 0.15),
    CURRENT_TIMESTAMP - (INTERVAL '1 hour' * generate_series(0, 23))
FROM spaces s
WHERE s.status = 'active'
LIMIT 100;

-- Insertar alertas de ejemplo
INSERT INTO alerts (space_id, alert_type, severity, message)
SELECT id, 'capacity_exceeded', 'high', 'Aforo al ' || ROUND((current_people::DECIMAL / capacity) * 100, 0) || '%'
FROM spaces
WHERE (current_people::DECIMAL / capacity) > 0.8 AND status = 'active'
LIMIT 5;

-- ============================================
-- PERMISOS (Ajustar según tu configuración)
-- ============================================

-- Dar permisos al usuario de la aplicación
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO elevadmin;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO elevadmin;

-- ============================================
-- INFORMACIÓN FINAL
-- ============================================

-- Mostrar resumen de la base de datos
SELECT 'Base de datos creada exitosamente!' AS status;
SELECT COUNT(*) AS total_users FROM users;
SELECT COUNT(*) AS total_space_types FROM space_types;
SELECT COUNT(*) AS total_devices FROM devices;
SELECT COUNT(*) AS total_spaces FROM spaces;
SELECT COUNT(*) AS total_logs FROM aforo_logs;
SELECT COUNT(*) AS total_schedules FROM space_schedules;
SELECT COUNT(*) AS total_alerts FROM alerts;

-- Fin del script
