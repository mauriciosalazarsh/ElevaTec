# Diseño de Base de Datos - ElevaTec (Multiespacio)

## 📋 Resumen

Sistema flexible de monitoreo de aforo para **cualquier tipo de espacio**: ascensores, salones, bibliotecas, cafeterías, laboratorios, auditorios, etc.

---

## 🗂️ Estructura de Tablas

### 1. **space_types** (Tipos de Espacios)
Catálogo de tipos de espacios que se pueden monitorear.

| Campo | Tipo | Descripción | Ejemplo |
|-------|------|-------------|---------|
| `id` | INTEGER | Primary Key | 1 |
| `name` | VARCHAR(50) | Nombre del tipo | "Ascensor" |
| `code` | VARCHAR(20) | Código único | "ELEVATOR" |
| `icon` | VARCHAR(50) | Ícono para UI | "elevator" |
| `description` | TEXT | Descripción | "Ascensor vertical" |
| `default_capacity` | INTEGER | Capacidad por defecto | 10 |
| `created_at` | TIMESTAMP | Fecha creación | 2025-01-15 |

**Ejemplos de registros:**
```sql
INSERT INTO space_types (name, code, icon, description, default_capacity) VALUES
('Ascensor', 'ELEVATOR', 'elevator', 'Ascensor para transporte vertical', 10),
('Salón', 'CLASSROOM', 'room', 'Salón de clases o conferencias', 40),
('Biblioteca', 'LIBRARY', 'book', 'Biblioteca o sala de lectura', 50),
('Cafetería', 'CAFETERIA', 'restaurant', 'Área de comedor o cafetería', 80),
('Laboratorio', 'LAB', 'science', 'Laboratorio de investigación', 25),
('Auditorio', 'AUDITORIUM', 'theater', 'Auditorio o sala de eventos', 200),
('Gimnasio', 'GYM', 'fitness', 'Gimnasio o área deportiva', 30),
('Estacionamiento', 'PARKING', 'car', 'Estacionamiento vehicular', 100);
```

---

### 2. **spaces** (Espacios Monitoreados)
Espacios físicos que se están monitoreando.

| Campo | Tipo | Descripción | Ejemplo |
|-------|------|-------------|---------|
| `id` | INTEGER | Primary Key | 1 |
| `name` | VARCHAR(100) | Nombre del espacio | "Salón A-301" |
| `space_type_id` | INTEGER | FK a space_types | 2 |
| `building` | VARCHAR(50) | Edificio | "Edificio A" |
| `floor` | INTEGER | Piso/Nivel | 3 |
| `room_number` | VARCHAR(20) | Número de sala | "301" |
| `capacity` | INTEGER | Capacidad máxima | 45 |
| `current_people` | INTEGER | Personas actuales | 12 |
| `device_id` | VARCHAR(50) | FK a devices | "ESP32CAM-A301" |
| `status` | VARCHAR(20) | Estado | "active" |
| `latitude` | DECIMAL | Coordenadas GPS | -12.0464 |
| `longitude` | DECIMAL | Coordenadas GPS | -77.0428 |
| `created_at` | TIMESTAMP | Fecha creación | 2025-01-15 |
| `updated_at` | TIMESTAMP | Última actualización | 2025-01-15 |

**Status posibles:**
- `active` - Espacio activo y monitoreado
- `inactive` - Espacio desactivado temporalmente
- `maintenance` - En mantenimiento
- `closed` - Cerrado permanentemente

**Ejemplos de registros:**
```sql
-- Ascensor
INSERT INTO spaces (name, space_type_id, building, floor, capacity, device_id)
VALUES ('Ascensor Torre A', 1, 'Torre A', NULL, 10, 'ESP32CAM-ELEV-A');

-- Salón
INSERT INTO spaces (name, space_type_id, building, floor, room_number, capacity, device_id)
VALUES ('Salón A-301', 2, 'Edificio A', 3, '301', 45, 'ESP32CAM-A301');

-- Biblioteca
INSERT INTO spaces (name, space_type_id, building, floor, capacity, device_id)
VALUES ('Biblioteca Central', 3, 'Edificio Central', 1, 80, 'ESP32CAM-LIB-01');

-- Cafetería
INSERT INTO spaces (name, space_type_id, building, floor, capacity, device_id)
VALUES ('Cafetería Principal', 4, 'Edificio B', 1, 120, 'ESP32CAM-CAFE-01');
```

---

### 3. **devices** (Dispositivos ESP32-CAM)
Dispositivos físicos que capturan el aforo.

| Campo | Tipo | Descripción | Ejemplo |
|-------|------|-------------|---------|
| `id` | INTEGER | Primary Key | 1 |
| `device_id` | VARCHAR(50) | ID único del dispositivo | "ESP32CAM-A301" |
| `name` | VARCHAR(100) | Nombre descriptivo | "Cámara Salón A-301" |
| `ip_address` | VARCHAR(50) | IP del dispositivo | "192.168.1.105" |
| `mac_address` | VARCHAR(20) | MAC address | "AA:BB:CC:DD:EE:FF" |
| `firmware_version` | VARCHAR(20) | Versión de firmware | "1.2.3" |
| `last_seen` | TIMESTAMP | Última conexión | 2025-01-15 10:30:00 |
| `status` | VARCHAR(20) | Estado | "online" |
| `battery_level` | INTEGER | Nivel batería (%) | 85 |
| `created_at` | TIMESTAMP | Fecha registro | 2025-01-15 |

**Status posibles:**
- `online` - Dispositivo conectado
- `offline` - Dispositivo desconectado
- `error` - Dispositivo con error
- `maintenance` - En mantenimiento

---

### 4. **aforo_logs** (Historial de Aforo)
Registro histórico de todas las mediciones de aforo.

| Campo | Tipo | Descripción | Ejemplo |
|-------|------|-------------|---------|
| `id` | INTEGER | Primary Key | 1 |
| `space_id` | INTEGER | FK a spaces | 5 |
| `device_id` | INTEGER | FK a devices | 2 |
| `people_count` | INTEGER | Personas contadas | 23 |
| `people_in` | INTEGER | Personas que entraron | 2 |
| `people_out` | INTEGER | Personas que salieron | 1 |
| `confidence` | DECIMAL | Confianza del conteo | 0.95 |
| `temperature` | DECIMAL | Temperatura ambiente | 22.5 |
| `humidity` | DECIMAL | Humedad relativa | 65.0 |
| `timestamp` | TIMESTAMP | Momento de captura | 2025-01-15 10:30:00 |

**Utilidad:**
- Análisis histórico de uso
- Detección de patrones
- Reportes y estadísticas
- Machine Learning

---

### 5. **users** (Usuarios del Sistema)
Usuarios que acceden al sistema.

| Campo | Tipo | Descripción | Ejemplo |
|-------|------|-------------|---------|
| `id` | INTEGER | Primary Key | 1 |
| `name` | VARCHAR(100) | Nombre completo | "Juan Pérez" |
| `email` | VARCHAR(120) | Email único | "admin@utec.edu.pe" |
| `password_hash` | VARCHAR(255) | Contraseña hash | "$2b$12$..." |
| `role` | VARCHAR(20) | Rol del usuario | "admin" |
| `department` | VARCHAR(50) | Departamento | "IT" |
| `phone` | VARCHAR(20) | Teléfono | "+51 999 888 777" |
| `created_at` | TIMESTAMP | Fecha registro | 2025-01-15 |

**Roles:**
- `admin` - Administrador total
- `manager` - Gestor de espacios
- `monitor` - Solo lectura
- `student` - Usuario estudiante
- `teacher` - Usuario docente

---

### 6. **space_schedules** (Horarios de Espacios) - OPCIONAL
Horarios de apertura/cierre de espacios.

| Campo | Tipo | Descripción | Ejemplo |
|-------|------|-------------|---------|
| `id` | INTEGER | Primary Key | 1 |
| `space_id` | INTEGER | FK a spaces | 5 |
| `day_of_week` | INTEGER | Día (0-6) | 1 (Lunes) |
| `open_time` | TIME | Hora apertura | 08:00:00 |
| `close_time` | TIME | Hora cierre | 20:00:00 |
| `is_active` | BOOLEAN | Activo | true |

---

### 7. **alerts** (Alertas del Sistema) - OPCIONAL
Sistema de alertas cuando se exceden límites.

| Campo | Tipo | Descripción | Ejemplo |
|-------|------|-------------|---------|
| `id` | INTEGER | Primary Key | 1 |
| `space_id` | INTEGER | FK a spaces | 5 |
| `alert_type` | VARCHAR(20) | Tipo de alerta | "capacity_exceeded" |
| `severity` | VARCHAR(20) | Severidad | "high" |
| `message` | TEXT | Mensaje | "Aforo al 95%" |
| `is_resolved` | BOOLEAN | Resuelta | false |
| `created_at` | TIMESTAMP | Fecha creación | 2025-01-15 |
| `resolved_at` | TIMESTAMP | Fecha resolución | NULL |

---

## 🔗 Relaciones entre Tablas

```
space_types (1) -----> (*) spaces
devices (1) -----> (*) spaces
spaces (1) -----> (*) aforo_logs
devices (1) -----> (*) aforo_logs
spaces (1) -----> (*) space_schedules
spaces (1) -----> (*) alerts
```

---

## 📊 Diagrama ER (Texto)

```
┌─────────────────┐
│  space_types    │
│─────────────────│
│ id (PK)         │
│ name            │
│ code            │
│ icon            │
└────────┬────────┘
         │
         │ 1:N
         │
┌────────▼────────┐     1:N     ┌─────────────────┐
│    spaces       │◄────────────│  aforo_logs     │
│─────────────────│             │─────────────────│
│ id (PK)         │             │ id (PK)         │
│ space_type_id(FK)│            │ space_id (FK)   │
│ name            │             │ device_id (FK)  │
│ building        │             │ people_count    │
│ floor           │             │ timestamp       │
│ capacity        │             └─────────────────┘
│ current_people  │
│ device_id (FK)  │
└────────┬────────┘
         │
         │ N:1
         │
┌────────▼────────┐
│    devices      │
│─────────────────│
│ id (PK)         │
│ device_id       │
│ ip_address      │
│ status          │
└─────────────────┘
```

---

## 🎯 Ventajas del Nuevo Diseño

### ✅ Flexibilidad
- Un solo sistema para **todos los tipos** de espacios
- Fácil agregar nuevos tipos de espacios
- No necesitas cambiar código para nuevos espacios

### ✅ Escalabilidad
- Soporta desde 1 hasta 1000+ espacios
- Puede manejar múltiples edificios/campus
- Base de datos normalizada

### ✅ Analítica Avanzada
- Comparar uso entre diferentes tipos de espacios
- Identificar patrones por tipo de espacio
- Reportes consolidados

### ✅ Funcionalidades Extra
- Horarios de apertura/cierre
- Sistema de alertas
- Geolocalización de espacios
- Datos ambientales (temperatura, humedad)

---

## 🚀 Ejemplos de Uso

### Consulta 1: Espacios disponibles por tipo
```sql
SELECT
    st.name as tipo_espacio,
    s.name as espacio,
    s.current_people,
    s.capacity,
    ROUND((s.current_people::decimal / s.capacity) * 100, 1) as porcentaje_ocupacion
FROM spaces s
JOIN space_types st ON s.space_type_id = st.id
WHERE s.status = 'active'
ORDER BY st.name, porcentaje_ocupacion;
```

### Consulta 2: Espacios con aforo crítico
```sql
SELECT
    s.name,
    st.name as tipo,
    s.current_people,
    s.capacity,
    CASE
        WHEN s.current_people::decimal / s.capacity > 0.8 THEN 'CRÍTICO'
        WHEN s.current_people::decimal / s.capacity > 0.5 THEN 'MODERADO'
        ELSE 'DISPONIBLE'
    END as estado_aforo
FROM spaces s
JOIN space_types st ON s.space_type_id = st.id
WHERE s.current_people::decimal / s.capacity > 0.8;
```

### Consulta 3: Histórico de uso por edificio
```sql
SELECT
    s.building,
    DATE(al.timestamp) as fecha,
    AVG(al.people_count) as promedio_personas,
    MAX(al.people_count) as pico_personas
FROM aforo_logs al
JOIN spaces s ON al.space_id = s.id
WHERE al.timestamp >= NOW() - INTERVAL '7 days'
GROUP BY s.building, DATE(al.timestamp)
ORDER BY fecha DESC, promedio_personas DESC;
```

---

## 📱 Casos de Uso Reales

### Universidad (UTEC):
- **Salones**: Monitorear ocupación de clases
- **Biblioteca**: Controlar aforo en sala de lectura
- **Cafetería**: Gestionar filas y espacios disponibles
- **Laboratorios**: Controlar acceso limitado
- **Auditorios**: Verificar capacidad en eventos
- **Ascensores**: Optimizar flujo de personas

### Centro Comercial:
- **Tiendas**: Aforo por local
- **Restaurantes**: Control de mesas
- **Cines**: Verificación de ocupación
- **Estacionamientos**: Espacios disponibles
- **Ascensores**: Flujo de personas

### Oficinas:
- **Salas de reuniones**: Disponibilidad
- **Comedores**: Control de aforo
- **Áreas comunes**: Uso de espacios
- **Ascensores**: Optimización

---

## 🔄 Migración desde el Sistema Actual

Si ya tienes datos en `elevators`, se pueden migrar fácilmente:

```sql
-- 1. Crear tipo "Ascensor"
INSERT INTO space_types (name, code, icon, default_capacity)
VALUES ('Ascensor', 'ELEVATOR', 'elevator', 10);

-- 2. Migrar elevators a spaces
INSERT INTO spaces (name, space_type_id, floor, capacity, current_people, device_id, created_at, updated_at)
SELECT
    name,
    (SELECT id FROM space_types WHERE code = 'ELEVATOR'),
    floor,
    capacity,
    current_people,
    device_id,
    created_at,
    updated_at
FROM elevators;

-- 3. Actualizar aforo_logs
UPDATE aforo_logs
SET space_id = (SELECT id FROM spaces WHERE device_id =
    (SELECT device_id FROM elevators WHERE elevators.id = aforo_logs.elevator_id));
```

---

## 🎨 Impacto en la UI

### Dashboard Admin:
- Filtrar por tipo de espacio
- Vista por edificio
- Vista por piso
- Mapa de calor

### Vista Cliente:
- Ver solo espacios relevantes (ej: solo salones si eres estudiante)
- Recomendaciones personalizadas
- Buscar por tipo de espacio

---

¿Quieres que implemente este nuevo diseño en el código?
