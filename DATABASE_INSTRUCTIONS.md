# 📚 Instrucciones para Usar la Base de Datos

## 🚀 Inicio Rápido

### Opción 1: Ejecutar con Docker (Recomendado)

```bash
# 1. Iniciar PostgreSQL con Docker Compose
docker-compose up -d db

# 2. Esperar a que PostgreSQL esté listo (10-15 segundos)
docker-compose logs db

# 3. Ejecutar el script de creación
docker exec -i elevatec_db psql -U elevadmin -d elevadb < database_schema.sql

# 4. Verificar con el script de pruebas
docker exec -i elevatec_db psql -U elevadmin -d elevadb < test_database.sql
```

### Opción 2: PostgreSQL Local

```bash
# 1. Crear la base de datos
createdb -U postgres elevadb

# 2. Ejecutar el script de creación
psql -U postgres -d elevadb -f database_schema.sql

# 3. Ejecutar pruebas
psql -U postgres -d elevadb -f test_database.sql
```

---

## 📊 Diagrama de la Base de Datos

```
┌──────────────────────────────────────────────────────────────────┐
│                        SISTEMA ELEVATEC                          │
│                   Base de Datos Multiespacio                     │
└──────────────────────────────────────────────────────────────────┘

┌─────────────────┐
│     users       │  Usuarios del sistema con roles
├─────────────────┤
│ • id (PK)       │
│ • name          │
│ • email         │
│ • password_hash │
│ • role          │  ← admin, manager, monitor, student, teacher
│ • department    │
│ • created_at    │
└────────┬────────┘
         │
         │ created_by (FK)
         │
         ▼
┌─────────────────┐
│     alerts      │  Sistema de alertas
├─────────────────┤
│ • id (PK)       │
│ • space_id (FK) │──┐
│ • alert_type    │  │
│ • severity      │  │
│ • message       │  │
│ • is_resolved   │  │
│ • resolved_by   │  │
└─────────────────┘  │
                     │
                     │
┌─────────────────┐  │
│  space_types    │  │  Catálogo de tipos de espacios
├─────────────────┤  │
│ • id (PK)       │  │
│ • name          │  │  ← "Ascensor", "Salón", "Biblioteca"
│ • code          │  │  ← "ELEVATOR", "CLASSROOM", "LIBRARY"
│ • icon          │  │
│ • description   │  │
│ • default_cap   │  │
│ • color         │  │
└────────┬────────┘  │
         │           │
         │ 1         │
         │           │
         │         N │
         ▼           │
┌─────────────────┐  │
│     spaces      │◄─┘  Espacios físicos monitoreados
├─────────────────┤
│ • id (PK)       │
│ • name          │     ← "Salón A-301", "Biblioteca Central"
│ • space_type_id │ (FK)
│ • device_id     │ (FK)
│ • building      │     ← "Edificio A", "Torre B"
│ • floor         │     ← 1, 2, 3...
│ • room_number   │     ← "301", "B-205"
│ • capacity      │     ← 45, 80, 120...
│ • current_people│     ← 23, 45, 67... (actualizado en tiempo real)
│ • status        │     ← active, inactive, maintenance, closed
│ • latitude      │
│ • longitude     │
│ • created_at    │
└────┬───────┬────┘
     │       │
     │ 1     │ 1
     │       │
     │ N     │ N
     ▼       ▼
┌─────────────────┐     ┌─────────────────┐
│ space_schedules │     │   aforo_logs    │  Historial completo
├─────────────────┤     ├─────────────────┤
│ • id (PK)       │     │ • id (PK)       │
│ • space_id (FK) │     │ • space_id (FK) │
│ • day_of_week   │     │ • device_id (FK)│
│ • open_time     │     │ • people_count  │  ← 23, 45, 67...
│ • close_time    │     │ • people_in     │
│ • is_active     │     │ • people_out    │
└─────────────────┘     │ • confidence    │  ← 0.85, 0.92...
                        │ • temperature   │
                        │ • humidity      │
                        │ • timestamp     │
                        └────────▲────────┘
                                 │
                                 │ N
                                 │
                                 │ 1
                        ┌────────┴────────┐
                        │    devices      │  ESP32-CAM
                        ├─────────────────┤
                        │ • id (PK)       │
                        │ • device_id     │  ← "ESP32CAM-001"
                        │ • name          │  ← "Cámara Salón A-301"
                        │ • ip_address    │  ← "192.168.1.101"
                        │ • mac_address   │
                        │ • last_seen     │
                        │ • status        │  ← online, offline, error
                        │ • battery_level │
                        └─────────────────┘
```

---

## 📋 Estructura de Tablas Detallada

### 1. `users` - Usuarios del Sistema
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | SERIAL | ID único |
| name | VARCHAR(100) | Nombre completo |
| email | VARCHAR(120) | Email (único) |
| password_hash | VARCHAR(255) | Contraseña hasheada |
| role | VARCHAR(20) | admin, manager, monitor, student, teacher, staff |
| department | VARCHAR(50) | Departamento/Área |
| phone | VARCHAR(20) | Teléfono |
| is_active | BOOLEAN | Usuario activo |

### 2. `space_types` - Tipos de Espacios
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | SERIAL | ID único |
| name | VARCHAR(50) | Nombre (ej: "Ascensor") |
| code | VARCHAR(20) | Código único (ej: "ELEVATOR") |
| icon | VARCHAR(50) | Ícono para UI |
| description | TEXT | Descripción detallada |
| default_capacity | INTEGER | Capacidad por defecto |
| color | VARCHAR(7) | Color hex (ej: "#4CAF50") |

**Tipos Preconfigurados:**
- 🏢 Ascensor (ELEVATOR)
- 🎓 Salón (CLASSROOM)
- 📚 Biblioteca (LIBRARY)
- 🍽️ Cafetería (CAFETERIA)
- 🔬 Laboratorio (LAB)
- 🎭 Auditorio (AUDITORIUM)
- 💪 Gimnasio (GYM)
- 🚗 Estacionamiento (PARKING)
- 💼 Sala de Reuniones (MEETING_ROOM)
- 👥 Área Común (COMMON_AREA)

### 3. `devices` - Dispositivos ESP32-CAM
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | SERIAL | ID único |
| device_id | VARCHAR(50) | ID del dispositivo (único) |
| name | VARCHAR(100) | Nombre descriptivo |
| ip_address | VARCHAR(50) | Dirección IP |
| mac_address | VARCHAR(20) | MAC Address |
| firmware_version | VARCHAR(20) | Versión de firmware |
| last_seen | TIMESTAMP | Última conexión |
| status | VARCHAR(20) | online, offline, error, maintenance |
| battery_level | INTEGER | Nivel de batería (0-100) |

### 4. `spaces` - Espacios Físicos
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | SERIAL | ID único |
| name | VARCHAR(100) | Nombre del espacio |
| space_type_id | INTEGER | FK a space_types |
| device_id | VARCHAR(50) | FK a devices |
| building | VARCHAR(50) | Nombre del edificio |
| floor | INTEGER | Número de piso |
| room_number | VARCHAR(20) | Número de sala |
| capacity | INTEGER | Capacidad máxima |
| current_people | INTEGER | Personas actuales |
| status | VARCHAR(20) | active, inactive, maintenance, closed |
| latitude | DECIMAL | Coordenada GPS |
| longitude | DECIMAL | Coordenada GPS |

### 5. `aforo_logs` - Historial de Mediciones
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | SERIAL | ID único |
| space_id | INTEGER | FK a spaces |
| device_id | INTEGER | FK a devices |
| people_count | INTEGER | Cantidad de personas |
| people_in | INTEGER | Personas que entraron |
| people_out | INTEGER | Personas que salieron |
| confidence | DECIMAL | Confianza (0.0-1.0) |
| temperature | DECIMAL | Temperatura °C |
| humidity | DECIMAL | Humedad % |
| timestamp | TIMESTAMP | Momento de captura |

### 6. `space_schedules` - Horarios
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | SERIAL | ID único |
| space_id | INTEGER | FK a spaces |
| day_of_week | INTEGER | 0=Domingo, 1=Lunes... |
| open_time | TIME | Hora de apertura |
| close_time | TIME | Hora de cierre |
| is_active | BOOLEAN | Horario activo |

### 7. `alerts` - Alertas del Sistema
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | SERIAL | ID único |
| space_id | INTEGER | FK a spaces |
| alert_type | VARCHAR(30) | Tipo de alerta |
| severity | VARCHAR(20) | low, medium, high, critical |
| message | TEXT | Mensaje de la alerta |
| is_resolved | BOOLEAN | ¿Resuelta? |
| resolved_by | INTEGER | FK a users |
| resolved_at | TIMESTAMP | Fecha de resolución |

---

## 🔍 Consultas SQL Útiles

### Ver todos los espacios con su ocupación
```sql
SELECT
    s.name AS espacio,
    st.name AS tipo,
    s.building AS edificio,
    s.floor AS piso,
    s.current_people AS personas,
    s.capacity AS capacidad,
    ROUND((s.current_people::DECIMAL / s.capacity) * 100, 1) AS porcentaje,
    CASE
        WHEN s.current_people::DECIMAL / s.capacity < 0.5 THEN '🟢 Disponible'
        WHEN s.current_people::DECIMAL / s.capacity < 0.8 THEN '🟡 Moderado'
        ELSE '🔴 Lleno'
    END AS estado
FROM spaces s
JOIN space_types st ON s.space_type_id = st.id
WHERE s.status = 'active'
ORDER BY (s.current_people::DECIMAL / s.capacity) DESC;
```

### Ver ocupación por tipo de espacio
```sql
SELECT * FROM v_aforo_by_type;
```

### Ver ocupación por edificio
```sql
SELECT * FROM v_aforo_by_building;
```

### Encontrar salones disponibles
```sql
SELECT
    s.name,
    s.building,
    s.floor,
    s.capacity - s.current_people AS espacios_disponibles
FROM spaces s
JOIN space_types st ON s.space_type_id = st.id
WHERE st.code = 'CLASSROOM'
  AND s.status = 'active'
  AND s.current_people < s.capacity * 0.5
ORDER BY espacios_disponibles DESC;
```

### Historial de un espacio específico
```sql
SELECT
    timestamp,
    people_count,
    confidence,
    temperature
FROM aforo_logs
WHERE space_id = 3
  AND timestamp >= NOW() - INTERVAL '24 hours'
ORDER BY timestamp DESC;
```

### Alertas activas
```sql
SELECT
    s.name AS espacio,
    a.alert_type,
    a.severity,
    a.message,
    a.created_at
FROM alerts a
JOIN spaces s ON a.space_id = s.id
WHERE a.is_resolved = false
ORDER BY
    CASE a.severity
        WHEN 'critical' THEN 1
        WHEN 'high' THEN 2
        WHEN 'medium' THEN 3
        WHEN 'low' THEN 4
    END,
    a.created_at DESC;
```

---

## 🎯 Casos de Uso

### Caso 1: Estudiante busca un salón disponible
```sql
-- Buscar salones con menos del 50% de ocupación
SELECT
    name,
    building,
    floor,
    current_people,
    capacity,
    capacity - current_people AS espacios_libres
FROM spaces
WHERE space_type_id = (SELECT id FROM space_types WHERE code = 'CLASSROOM')
  AND status = 'active'
  AND (current_people::DECIMAL / capacity) < 0.5
ORDER BY (current_people::DECIMAL / capacity) ASC
LIMIT 5;
```

### Caso 2: Ver si la biblioteca está disponible
```sql
SELECT
    s.name,
    s.current_people,
    s.capacity,
    ROUND((s.current_people::DECIMAL / s.capacity) * 100, 1) AS porcentaje,
    get_aforo_status(s.current_people, s.capacity) AS estado,
    is_space_open_now(s.id) AS esta_abierto
FROM spaces s
WHERE space_type_id = (SELECT id FROM space_types WHERE code = 'LIBRARY')
  AND status = 'active';
```

### Caso 3: Admin necesita reporte semanal
```sql
-- Promedio de ocupación por día de la semana
SELECT
    TO_CHAR(timestamp, 'Day') AS dia,
    ROUND(AVG(people_count), 1) AS promedio_personas,
    COUNT(*) AS num_mediciones
FROM aforo_logs
WHERE timestamp >= NOW() - INTERVAL '7 days'
GROUP BY TO_CHAR(timestamp, 'Day'), EXTRACT(DOW FROM timestamp)
ORDER BY EXTRACT(DOW FROM timestamp);
```

---

## 🛠️ Mantenimiento

### Limpiar logs antiguos (más de 30 días)
```sql
DELETE FROM aforo_logs
WHERE timestamp < NOW() - INTERVAL '30 days';
```

### Actualizar dispositivos offline
```sql
UPDATE devices
SET status = 'offline'
WHERE last_seen < NOW() - INTERVAL '5 minutes'
  AND status = 'online';
```

### Resolver alertas antiguas
```sql
UPDATE alerts
SET is_resolved = true,
    resolved_note = 'Auto-resuelto por sistema'
WHERE created_at < NOW() - INTERVAL '7 days'
  AND is_resolved = false;
```

---

## 📊 Backup y Restore

### Hacer backup
```bash
# Backup completo
pg_dump -U elevadmin elevadb > backup_$(date +%Y%m%d).sql

# Backup solo estructura
pg_dump -U elevadmin -s elevadb > backup_schema.sql

# Backup solo datos
pg_dump -U elevadmin -a elevadb > backup_data.sql
```

### Restaurar backup
```bash
psql -U elevadmin elevadb < backup_20250115.sql
```

---

## ✅ Verificación

Ejecuta el script de pruebas:
```bash
psql -U elevadmin -d elevadb -f test_database.sql
```

Esto verificará:
- ✅ Todas las tablas creadas
- ✅ Índices correctos
- ✅ Integridad referencial
- ✅ Vistas funcionando
- ✅ Funciones operativas
- ✅ Datos de ejemplo cargados

---

¡Base de datos lista para usar! 🚀
