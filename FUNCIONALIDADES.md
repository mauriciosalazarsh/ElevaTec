# 🎯 Funcionalidades del Sistema ElevaTec

## 📋 Tabla de Contenidos
1. [Resumen General](#resumen-general)
2. [Perfil Administrador](#perfil-administrador)
3. [Perfil Cliente/Usuario](#perfil-clienteusuario)
4. [Comparación de Permisos](#comparación-de-permisos)
5. [Flujos de Trabajo](#flujos-de-trabajo)

---

## 🎯 Resumen General

ElevaTec es un **sistema de monitoreo de aforo en tiempo real** que permite gestionar y visualizar la ocupación de diferentes espacios (ascensores, salones, bibliotecas, cafeterías, etc.) utilizando dispositivos ESP32-CAM.

### Tipos de Usuarios:
- 👨‍💼 **Administrador**: Control total del sistema
- 👤 **Cliente/Usuario**: Visualización y consulta de espacios

---

## 👨‍💼 PERFIL ADMINISTRADOR

### 🏠 Dashboard Administrativo

#### **Vista General del Sistema**

##### 📊 Métricas en Tiempo Real
El administrador puede ver:

**Tarjetas de Estadísticas:**
```
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│ Total Espacios   │  │ Dispositivos     │  │ Ocupación        │  │ Registros        │
│      24          │  │   18/20          │  │   Promedio       │  │   (24h)          │
│                  │  │   Online         │  │     67%          │  │     156          │
└──────────────────┘  └──────────────────┘  └──────────────────┘  └──────────────────┘
```

- **Total de Espacios**: Cantidad total de espacios monitoreados
- **Dispositivos Online**: Cuántas cámaras ESP32 están funcionando
- **Ocupación Promedio**: Porcentaje promedio de ocupación global
- **Registros 24h**: Cantidad de mediciones en las últimas 24 horas

##### 📈 Gráficas y Visualizaciones

**1. Distribución de Aforo (Gráfica de Pastel)**
```
         🟢 Disponibles (bajo): 45%
         🟡 Moderados (medio): 35%
         🔴 Llenos (alto): 20%
```
- Muestra qué porcentaje de espacios están en cada estado
- Actualización en tiempo real cada 10 segundos

**2. Horas Pico (Gráfica de Barras)**
```
Promedio de personas por hora en los últimos 7 días
100 │                    ██
 90 │          ██        ██
 80 │    ██    ██        ██    ██
 70 │    ██    ██    ██  ██    ██
    └────────────────────────────────
      8am  10am 12pm  2pm  4pm  6pm
```
- Identifica cuándo hay más afluencia
- Ayuda a planificar horarios
- Datos de los últimos 7 días

**3. Tendencia Diaria (Gráfica de Líneas)**
```
Uso promedio y máximo por día
    Promedio ──── Máximo ────
```
- Compara uso promedio vs máximo diario
- Identifica días con mayor demanda
- Últimos 7 días de histórico

##### 📋 Tabla de Espacios en Tiempo Real

```
┌──────────────────┬──────┬───────────┬────────────┬──────────────┐
│ Nombre           │ Piso │ Ocupación │ Estado     │ Dispositivo  │
├──────────────────┼──────┼───────────┼────────────┼──────────────┤
│ Salón A-301      │  3   │ 23/45     │ 🟢 bajo    │ ESP32CAM-002 │
│ Biblioteca       │  1   │ 67/80     │ 🟡 medio   │ ESP32CAM-003 │
│ Cafetería        │  1   │ 98/120    │ 🔴 alto    │ ESP32CAM-004 │
│ Ascensor Torre A │  -   │ 8/10      │ 🔴 alto    │ ESP32CAM-001 │
└──────────────────┴──────┴───────────┴────────────┴──────────────┘
```

**Funcionalidades en la tabla:**
- ✅ Ver nombre del espacio
- ✅ Ver piso/ubicación
- ✅ Ver ocupación actual (personas/capacidad)
- ✅ Estado visual con colores (🟢🟡🔴)
- ✅ Dispositivo asociado
- ✅ Actualización automática cada 10 segundos

---

### 📱 Gestión de Dispositivos ESP32-CAM

#### **Página: /admin/devices**

##### 🎛️ Funcionalidades Principales

**1. Ver Todos los Dispositivos**

Tabla completa con información de cada cámara:
```
┌──────────────┬──────┬──────────────┬────────┬────────────────┬──────────┐
│ ID Disp.     │ Piso │ IP Address   │ Estado │ Última Conexión│ Acciones │
├──────────────┼──────┼──────────────┼────────┼────────────────┼──────────┤
│ ESP32CAM-001 │  -   │ 192.168.1.101│ 🟢 ON  │ Hace 2 min     │ ✏️ 🗑️   │
│ ESP32CAM-002 │  3   │ 192.168.1.102│ 🟢 ON  │ Hace 1 min     │ ✏️ 🗑️   │
│ ESP32CAM-003 │  1   │ 192.168.1.103│ 🟢 ON  │ Hace 3 min     │ ✏️ 🗑️   │
│ ESP32CAM-004 │  1   │ 192.168.1.104│ 🟢 ON  │ Hace 30 seg    │ ✏️ 🗑️   │
│ ESP32CAM-005 │  2   │ 192.168.1.105│ 🔴 OFF │ Hace 2 horas   │ ✏️ 🗑️   │
└──────────────┴──────┴──────────────┴────────┴────────────────┴──────────┘
```

**Información visible:**
- ✅ ID único del dispositivo
- ✅ Piso donde está instalado
- ✅ Dirección IP en la red
- ✅ Estado (online/offline) con indicador visual
- ✅ Última vez que se conectó
- ✅ Botones de acción (editar/eliminar)

**2. Crear Nuevo Dispositivo**

```
┌─────────────────────────────────────┐
│    Nuevo Dispositivo ESP32-CAM      │
├─────────────────────────────────────┤
│                                     │
│ ID del Dispositivo:                 │
│ [ESP32CAM-006____________]          │
│                                     │
│ Piso:                               │
│ [4___]                              │
│                                     │
│ Dirección IP (opcional):            │
│ [192.168.1.106___________]          │
│                                     │
│  [Crear]  [Cancelar]                │
└─────────────────────────────────────┘
```

**Campos:**
- **ID Dispositivo**: Identificador único (ej: ESP32CAM-006)
- **Piso**: Número de piso donde está instalado
- **IP**: Dirección IP (se detecta automáticamente si no se provee)

**3. Editar Dispositivo Existente**

Misma interfaz que crear, pero con datos pre-cargados:
- ✅ Cambiar ID del dispositivo
- ✅ Cambiar piso asignado
- ✅ Actualizar IP manualmente
- ✅ Cambiar estado (online/offline/error/mantenimiento)

**4. Eliminar Dispositivo**

```
┌─────────────────────────────────────┐
│          ⚠️ CONFIRMACIÓN            │
├─────────────────────────────────────┤
│                                     │
│ ¿Está seguro de eliminar este       │
│ dispositivo?                        │
│                                     │
│ ESP32CAM-005                        │
│                                     │
│ Esta acción NO se puede deshacer.   │
│                                     │
│  [Eliminar]  [Cancelar]             │
└─────────────────────────────────────┘
```

**5. Resumen de Espacios Asociados**

En la misma página se muestra qué espacios están vinculados a cada dispositivo:

```
┌─────────────────────────────────────────────┐
│      Espacios Registrados                   │
├─────────────────────────────────────────────┤
│ Salón A-301                                 │
│ Piso: 3 | Capacidad: 45                     │
│ Dispositivo: ESP32CAM-002                   │
├─────────────────────────────────────────────┤
│ Biblioteca Central                          │
│ Piso: 1 | Capacidad: 80                     │
│ Dispositivo: ESP32CAM-003                   │
└─────────────────────────────────────────────┘
```

---

### 🏢 Gestión de Espacios

#### **Funcionalidades CRUD Completas**

**1. Crear Nuevo Espacio**

```
POST /api/elevators
{
  "name": "Salón D-405",
  "space_type": "CLASSROOM",
  "building": "Edificio D",
  "floor": 4,
  "room_number": "405",
  "capacity": 50,
  "device_id": "ESP32CAM-007"
}
```

El admin puede crear espacios de cualquier tipo:
- 🏢 Ascensores
- 🎓 Salones
- 📚 Bibliotecas
- 🍽️ Cafeterías
- 🔬 Laboratorios
- 🎭 Auditorios
- 💪 Gimnasios
- 🚗 Estacionamientos

**2. Editar Espacio Existente**

```
PUT /api/elevators/5
{
  "name": "Salón A-301 Renovado",
  "capacity": 50,
  "current_people": 25
}
```

Puede modificar:
- ✅ Nombre del espacio
- ✅ Capacidad máxima
- ✅ Personas actuales (ajuste manual)
- ✅ Dispositivo asociado
- ✅ Piso/ubicación

**3. Eliminar Espacio**

```
DELETE /api/elevators/5
```

- ⚠️ Requiere confirmación
- Se eliminan también los logs históricos asociados
- No se puede recuperar después

**4. Ver Detalle de Espacio**

```
GET /api/elevators/5
```

Información detallada:
- Estado actual completo
- Historial de los últimos 7 días
- Gráficas de uso
- Dispositivo asociado
- Horarios configurados

---

### 📊 Métricas y Reportes

#### **Endpoint: GET /api/metrics**

El administrador obtiene estadísticas detalladas:

**1. Estadísticas Globales**
```json
{
  "total_elevators": 24,
  "total_devices": 20,
  "online_devices": 18,
  "avg_aforo_percentage": 67.5,
  "recent_logs_24h": 1456
}
```

**2. Distribución de Aforo**
```json
{
  "aforo_distribution": {
    "bajo": 12,    // 12 espacios disponibles
    "medio": 8,    // 8 espacios moderados
    "alto": 4      // 4 espacios llenos
  }
}
```

**3. Análisis por Tipo de Espacio**
```json
{
  "by_type": [
    {
      "type": "CLASSROOM",
      "name": "Salones",
      "total": 12,
      "avg_occupancy": 45.5,
      "available": 7,
      "moderate": 3,
      "full": 2
    },
    {
      "type": "LIBRARY",
      "name": "Bibliotecas",
      "total": 2,
      "avg_occupancy": 67.8,
      "available": 0,
      "moderate": 2,
      "full": 0
    }
  ]
}
```

**4. Análisis por Edificio**
```json
{
  "by_building": [
    {
      "building": "Edificio A",
      "total_capacity": 320,
      "current_people": 145,
      "occupancy_percentage": 45.3
    },
    {
      "building": "Edificio B",
      "total_capacity": 280,
      "current_people": 234,
      "occupancy_percentage": 83.6
    }
  ]
}
```

**5. Horas Pico (últimos 7 días)**
```json
{
  "peak_hours": [
    {"hour": 9, "avg_people": 234.5},
    {"hour": 10, "avg_people": 289.3},
    {"hour": 11, "avg_people": 312.7},
    {"hour": 12, "avg_people": 345.2},  // Hora más concurrida
    {"hour": 13, "avg_people": 298.4}
  ]
}
```

**6. Tendencia Diaria (últimos 7 días)**
```json
{
  "daily_trend": [
    {
      "date": "2025-01-15",
      "avg_people": 187.5,
      "max_people": 345
    },
    {
      "date": "2025-01-16",
      "avg_people": 203.2,
      "max_people": 378
    }
  ]
}
```

---

### 👥 Gestión de Usuarios

#### **Registrar Nuevos Usuarios**

```
POST /api/register
{
  "name": "Juan Pérez",
  "email": "juan.perez@utec.edu.pe",
  "password": "password123",
  "role": "student"
}
```

**Roles disponibles:**
- `admin` - Administrador total
- `manager` - Gestor de espacios
- `monitor` - Solo lectura avanzada
- `student` - Estudiante
- `teacher` - Docente
- `staff` - Personal

**Solo el admin puede:**
- ✅ Crear nuevos usuarios
- ✅ Asignar roles
- ✅ Ver lista de usuarios (futuro)
- ✅ Desactivar usuarios (futuro)

---

### 🔄 Monitoreo en Tiempo Real

**Actualización Automática:**
- ⏱️ Dashboard: Actualiza cada **10 segundos**
- ⏱️ Tabla de dispositivos: Actualiza cada **10 segundos**
- ⏱️ No necesita recargar la página

**Funcionalidades en Vivo:**
- ✅ Ver cambios de ocupación en tiempo real
- ✅ Ver cuando dispositivos se conectan/desconectan
- ✅ Ver alertas de aforo excedido
- ✅ Indicadores visuales de estado (🟢🟡🔴)

---

### 🚨 Sistema de Alertas (Futuro)

El sistema puede generar alertas automáticas:

**Tipos de Alertas:**
- 🔴 **Capacidad Excedida**: Espacio con >80% ocupación
- 📱 **Dispositivo Offline**: Cámara desconectada
- 🔋 **Batería Baja**: Nivel <20%
- ⚠️ **Error de Sensor**: Problema en detección
- 🔧 **Mantenimiento Requerido**: Revisión necesaria

---

### 📱 Vista Cliente Adicional

El admin también puede:
- ✅ Ver la interfaz de cliente
- ✅ Probar la experiencia del usuario
- ✅ Botón "Vista Cliente" en el navbar

---

## 👤 PERFIL CLIENTE/USUARIO

### 🏠 Página Principal - Vista de Espacios

#### **Ruta: /user/home**

##### 🎯 Recomendación Global

En la parte superior, el usuario ve una recomendación inteligente:

**Ejemplo 1: Espacios Disponibles**
```
┌─────────────────────────────────────────────────────────┐
│ ℹ️  RECOMENDACIÓN                                       │
├─────────────────────────────────────────────────────────┤
│ 🟢 Hay 12 espacio(s) disponible(s).                    │
│    Puede usarlos con confianza.                         │
└─────────────────────────────────────────────────────────┘
```

**Ejemplo 2: Ocupación Moderada**
```
┌─────────────────────────────────────────────────────────┐
│ ⚠️  RECOMENDACIÓN                                       │
├─────────────────────────────────────────────────────────┤
│ 🟡 Todos los espacios tienen ocupación moderada.       │
│    Espere un momento antes de abordar.                  │
└─────────────────────────────────────────────────────────┘
```

**Ejemplo 3: Todo Lleno**
```
┌─────────────────────────────────────────────────────────┐
│ 🚨 RECOMENDACIÓN                                        │
├─────────────────────────────────────────────────────────┤
│ 🔴 Todos los espacios están llenos.                    │
│    Considere usar las escaleras o esperar unos minutos.│
└─────────────────────────────────────────────────────────┘
```

---

##### 📊 Resumen de Estadísticas

Tres tarjetas informativas:

```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  Disponibles    │  │  Ocupación      │  │     Llenos      │
│      🟢         │  │  Moderada 🟡    │  │      🔴         │
│                 │  │                 │  │                 │
│      12         │  │       8         │  │       4         │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

**Información:**
- **Disponibles**: Espacios con <50% ocupación (verde)
- **Moderados**: Espacios con 50-80% ocupación (amarillo)
- **Llenos**: Espacios con >80% ocupación (rojo)

---

##### 🗂️ Lista de Espacios con Cards

Los espacios se muestran en tarjetas ordenadas por disponibilidad (primero los más disponibles):

**Card de Espacio Disponible (🟢 Verde)**
```
┌───────────────────────────────────────────┐
│ Salón A-301                    🟢 DISPONIBLE
│ Piso 3                                    │
├───────────────────────────────────────────┤
│ Ocupación: 23 / 45                        │
│ ████████░░░░░░░░░░░░  51% lleno          │
├───────────────────────────────────────────┤
│ 💡 Recomendación:                         │
│ Puede usar el espacio del piso 3          │
├───────────────────────────────────────────┤
│ 📱 Dispositivo: ESP32CAM-002              │
└───────────────────────────────────────────┘
```

**Card de Espacio Moderado (🟡 Amarillo)**
```
┌───────────────────────────────────────────┐
│ Biblioteca Central             🟡 MODERADO │
│ Piso 1                                    │
├───────────────────────────────────────────┤
│ Ocupación: 67 / 80                        │
│ ████████████████░░░░  84% lleno          │
├───────────────────────────────────────────┤
│ ⚠️ Recomendación:                         │
│ Espere un momento en el piso 1            │
├───────────────────────────────────────────┤
│ 📱 Dispositivo: ESP32CAM-003              │
└───────────────────────────────────────────┘
```

**Card de Espacio Lleno (🔴 Rojo)**
```
┌───────────────────────────────────────────┐
│ Cafetería Principal                🔴 LLENO│
│ Piso 1                                    │
├───────────────────────────────────────────┤
│ Ocupación: 98 / 120                       │
│ ████████████████████  82% lleno          │
├───────────────────────────────────────────┤
│ 🚫 Recomendación:                         │
│ Considere usar las escaleras o esperar    │
├───────────────────────────────────────────┤
│ 📱 Dispositivo: ESP32CAM-004              │
└───────────────────────────────────────────┘
```

---

##### 🎨 Elementos Visuales en las Cards

**1. Barra de Progreso Visual**
```
Disponible (23/45):  ████████░░░░░░░░░░░░  51%
Moderado   (67/80):  ████████████████░░░░  84%
Lleno      (98/120): ████████████████████  82%
```

**2. Indicador de Estado con Color**
- 🟢 **Verde**: < 50% ocupación
- 🟡 **Amarillo**: 50-80% ocupación
- 🔴 **Rojo**: > 80% ocupación

**3. Recomendación Personalizada**
Cada card muestra una recomendación específica según su estado

**4. Información del Dispositivo**
ID de la cámara ESP32 que está monitoreando

---

##### ⏱️ Actualización Automática

```
┌─────────────────────────────────────────┐
│ Actualización automática cada 5 segundos│
└─────────────────────────────────────────┘
```

**Características:**
- ✅ Los datos se actualizan automáticamente cada **5 segundos**
- ✅ No necesita recargar la página manualmente
- ✅ Siempre ve información en tiempo real
- ✅ Las cards se reordenan automáticamente por disponibilidad

---

### 🔍 Filtros y Búsqueda (Futuro)

El usuario podrá filtrar por:
- 🏢 Tipo de espacio (salones, bibliotecas, cafeterías)
- 🏗️ Edificio
- 📍 Piso
- 🎯 Estado (disponible, moderado, lleno)

---

### 📱 Funcionalidades Móviles

La interfaz es **responsive** y se adapta a:
- 📱 Celulares (diseño vertical)
- 💻 Tablets (diseño de 2 columnas)
- 🖥️ Escritorio (diseño de 3 columnas)

---

### 🚫 Restricciones del Cliente

El usuario **NO puede**:
- ❌ Ver el dashboard administrativo
- ❌ Gestionar dispositivos
- ❌ Crear/editar/eliminar espacios
- ❌ Ver métricas avanzadas
- ❌ Registrar nuevos usuarios
- ❌ Acceder a rutas de admin

Si intenta acceder a rutas admin, es redirigido automáticamente a `/user/home`

---

## ⚖️ COMPARACIÓN DE PERMISOS

### Tabla Comparativa Completa

| Funcionalidad | 👨‍💼 Admin | 👤 Cliente |
|---------------|-----------|-----------|
| **VISUALIZACIÓN** | | |
| Ver espacios disponibles | ✅ | ✅ |
| Ver ocupación en tiempo real | ✅ | ✅ |
| Ver recomendaciones | ✅ | ✅ |
| Ver estadísticas básicas | ✅ | ✅ |
| Ver dashboard completo | ✅ | ❌ |
| Ver métricas avanzadas | ✅ | ❌ |
| Ver gráficas históricas | ✅ | ❌ |
| Ver análisis por edificio | ✅ | ❌ |
| Ver horas pico | ✅ | ❌ |
| **GESTIÓN DE ESPACIOS** | | |
| Crear espacios | ✅ | ❌ |
| Editar espacios | ✅ | ❌ |
| Eliminar espacios | ✅ | ❌ |
| Ver detalle de espacio | ✅ | ✅ (limitado) |
| **GESTIÓN DE DISPOSITIVOS** | | |
| Ver lista de dispositivos | ✅ | ❌ |
| Crear dispositivos | ✅ | ❌ |
| Editar dispositivos | ✅ | ❌ |
| Eliminar dispositivos | ✅ | ❌ |
| Ver estado de dispositivos | ✅ | ❌ |
| **GESTIÓN DE USUARIOS** | | |
| Registrar usuarios | ✅ | ❌ |
| Ver lista de usuarios | ✅ | ❌ |
| Asignar roles | ✅ | ❌ |
| **REPORTES Y DATOS** | | |
| Exportar datos (futuro) | ✅ | ❌ |
| Ver logs históricos | ✅ | ❌ |
| Generar reportes | ✅ | ❌ |
| **ALERTAS** | | |
| Ver alertas del sistema | ✅ | ❌ |
| Resolver alertas | ✅ | ❌ |
| Configurar alertas | ✅ | ❌ |
| **ACTUALIZACIÓN** | | |
| Frecuencia actualización | 10 seg | 5 seg |

---

## 🔄 FLUJOS DE TRABAJO

### Flujo 1: Admin Configura Nuevo Espacio

```
1. Admin hace login
   ↓
2. Navega a Dashboard
   ↓
3. Ve que falta un espacio (ej: Laboratorio nuevo)
   ↓
4. Va a "Dispositivos"
   ↓
5. Crea nuevo dispositivo ESP32CAM-008
   ↓
6. Vuelve a Dashboard
   ↓
7. Crea nuevo espacio "Lab de Química 2"
   - Tipo: Laboratorio
   - Capacidad: 25
   - Dispositivo: ESP32CAM-008
   - Piso: 3
   ↓
8. El espacio aparece en el dashboard
   ↓
9. Los clientes ya pueden verlo en su interfaz
```

---

### Flujo 2: Usuario Busca Salón Disponible

```
1. Usuario hace login
   ↓
2. Ve la página principal (/user/home)
   ↓
3. Lee la recomendación global
   "🟢 Hay 7 espacios disponibles"
   ↓
4. Ve el resumen:
   - Disponibles: 7
   - Moderados: 3
   - Llenos: 2
   ↓
5. Revisa las cards ordenadas por disponibilidad
   ↓
6. Ve "Salón A-301" en verde
   - 23/45 personas (51%)
   - Piso 3
   ↓
7. Lee recomendación: "Puede usar el espacio del piso 3"
   ↓
8. Decide ir al Salón A-301
   ↓
9. La página se actualiza sola cada 5 segundos
   (no necesita recargar)
```

---

### Flujo 3: ESP32-CAM Envía Datos

```
1. ESP32CAM-002 detecta 25 personas en Salón A-301
   ↓
2. Envía POST a /api/data:
   {
     "device_id": "ESP32CAM-002",
     "floor": 3,
     "people_count": 25,
     "capacity": 45,
     "timestamp": "2025-01-15T10:30:00Z"
   }
   ↓
3. Backend actualiza:
   - spaces.current_people = 25
   - devices.last_seen = now()
   - devices.status = 'online'
   ↓
4. Backend crea registro en aforo_logs
   ↓
5. Backend calcula aforo_status:
   25/45 = 55% → "medio" (🟡)
   ↓
6. Responde al ESP32:
   {
     "message": "Data received successfully",
     "aforo_status": "medio"
   }
   ↓
7. En los siguientes 5-10 segundos:
   - Clientes ven actualización en sus cards
   - Admin ve actualización en dashboard
```

---

### Flujo 4: Sistema Detecta Dispositivo Offline

```
1. ESP32CAM-005 deja de enviar datos
   ↓
2. Pasan más de 5 minutos sin señal
   ↓
3. Sistema automático (futuro) detecta:
   - last_seen > 5 minutos
   - status = 'online'
   ↓
4. Actualiza: devices.status = 'offline'
   ↓
5. Genera alerta:
   - Tipo: device_offline
   - Severidad: high
   - Mensaje: "ESP32CAM-005 desconectado"
   ↓
6. Admin ve en dashboard:
   - Dispositivos Online: 17/20 (antes 18/20)
   - Alerta en rojo
   ↓
7. Admin revisa dispositivo
   ↓
8. Admin marca dispositivo en "maintenance"
```

---

### Flujo 5: Usuario ve Cafetería Llena

```
1. Usuario en /user/home
   ↓
2. Ve recomendación global:
   "🔴 Todos los espacios están llenos"
   ↓
3. Ve card de Cafetería Principal:
   - 98/120 personas (82%)
   - Estado: 🔴 LLENO
   - Barra casi completa
   ↓
4. Lee recomendación:
   "Considere esperar unos minutos"
   ↓
5. Usuario decide esperar 5 minutos
   ↓
6. Página se actualiza automáticamente
   ↓
7. Ahora ve:
   - 87/120 personas (73%)
   - Estado: 🟡 MODERADO
   ↓
8. Usuario decide ir a la cafetería
```

---

## 🎯 CASOS DE USO ESPECÍFICOS

### Caso 1: Estudiante busca dónde estudiar

**Perfil: Cliente/Estudiante**

**Situación:**
"Son las 3pm y necesito un lugar tranquilo para estudiar"

**Acciones:**
1. ✅ Abre la app en el celular
2. ✅ Ve la recomendación: "7 espacios disponibles"
3. ✅ Filtra por tipo: "Biblioteca" (futuro)
4. ✅ Ve dos opciones:
   - Biblioteca Central: 45/80 (56%) 🟡
   - Biblioteca Especializada: 12/30 (40%) 🟢
5. ✅ Elige Biblioteca Especializada (más disponible)
6. ✅ Llega y confirma que hay espacio

---

### Caso 2: Admin detecta patrón de uso

**Perfil: Administrador**

**Situación:**
"Quiero saber cuándo hay más gente en las cafeterías"

**Acciones:**
1. ✅ Login como admin
2. ✅ Va al Dashboard
3. ✅ Revisa gráfica "Horas Pico"
4. ✅ Identifica que 12pm-2pm son las horas más concurridas
5. ✅ Ve que la Cafetería Principal llega al 95% de ocupación
6. ✅ Decide recomendar que:
   - Se abra una cafetería adicional
   - Se amplíe el horario de almuerzo

---

### Caso 3: Técnico instala nueva cámara

**Perfil: Administrador**

**Situación:**
"Se instaló un ESP32-CAM nuevo en el Gimnasio"

**Acciones:**
1. ✅ Admin va a /admin/devices
2. ✅ Click en "Nuevo Dispositivo"
3. ✅ Completa formulario:
   - ID: ESP32CAM-GYM-01
   - Piso: 1
   - IP: 192.168.1.110
4. ✅ Guarda
5. ✅ Crea nuevo espacio asociado:
   - Nombre: Gimnasio Multifuncional
   - Tipo: Gimnasio
   - Capacidad: 40
   - Dispositivo: ESP32CAM-GYM-01
6. ✅ Configura el ESP32 físico con ese ID
7. ✅ ESP32 empieza a enviar datos
8. ✅ Aparece automáticamente para todos los usuarios

---

### Caso 4: Usuario recibe recomendación personalizada

**Perfil: Cliente**

**Situación:**
"Quiero usar un ascensor"

**Interfaz muestra:**
```
┌──────────────────────────────────────────┐
│ Ascensor Torre A           🟢 DISPONIBLE │
│ Ocupación: 3 / 10 (30%)                  │
│ 💡 Puede usar el ascensor                │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│ Ascensor Torre B              🔴 LLENO   │
│ Ocupación: 9 / 10 (90%)                  │
│ 🚫 Considere usar las escaleras          │
└──────────────────────────────────────────┘
```

**Usuario:**
- ✅ Ve claramente cuál usar
- ✅ Toma decisión informada
- ✅ Evita esperas innecesarias

---

## 🔐 SEGURIDAD Y AUTENTICACIÓN

### Sistema de Roles

**Middleware de Protección:**
- ✅ Todas las rutas requieren autenticación JWT
- ✅ Rutas admin verifican rol = 'admin'
- ✅ Tokens expiran después de 24 horas
- ✅ Passwords hasheados con bcrypt

**Protección de Rutas:**
```
/api/login         → Sin autenticación
/api/register      → Solo admin
/api/elevators     → Usuario autenticado
/api/devices       → Solo admin
/api/metrics       → Solo admin
/api/data          → Sin autenticación (para ESP32)
```

---

## 📊 RESUMEN DE ENDPOINTS API

### Públicos (Sin autenticación)
```
POST /api/login         - Iniciar sesión
POST /api/data          - Recibir datos de ESP32
```

### Usuario Autenticado
```
GET  /api/elevators     - Listar todos los espacios
GET  /api/elevators/:id - Ver detalle de un espacio
GET  /api/me            - Obtener info del usuario actual
```

### Solo Admin
```
POST   /api/register       - Registrar usuario
GET    /api/devices        - Listar dispositivos
POST   /api/devices        - Crear dispositivo
PUT    /api/devices/:id    - Actualizar dispositivo
DELETE /api/devices/:id    - Eliminar dispositivo
POST   /api/elevators      - Crear espacio
PUT    /api/elevators/:id  - Actualizar espacio
DELETE /api/elevators/:id  - Eliminar espacio
GET    /api/metrics        - Obtener métricas completas
```

---

## 🎨 INTERFAZ RESUMIDA

### Admin ve:
```
┌────────────────────────────────────────────┐
│  ElevaTec    [Dashboard] [Dispositivos]    │
│              [Vista Cliente]  [Salir]      │
├────────────────────────────────────────────┤
│  📊 Panel de Administración                │
│                                            │
│  [24]  [18/20]  [67%]  [156]              │
│                                            │
│  📈 Gráficas de distribución               │
│  📈 Horas pico                             │
│  📈 Tendencia diaria                       │
│                                            │
│  📋 Tabla completa de espacios             │
└────────────────────────────────────────────┘
```

### Cliente ve:
```
┌────────────────────────────────────────────┐
│  ElevaTec              Usuario  [Salir]    │
├────────────────────────────────────────────┤
│  🟢 Hay 7 espacios disponibles             │
│                                            │
│  [12]      [8]       [4]                   │
│  Disponibles Moderados  Llenos            │
│                                            │
│  🗂️ Cards de espacios (ordenadas)         │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐     │
│  │ Salón   │ │ Biblio  │ │ Café    │     │
│  │ 🟢      │ │ 🟡      │ │ 🔴      │     │
│  └─────────┘ └─────────┘ └─────────┘     │
└────────────────────────────────────────────┘
```

---

## 📱 CARACTERÍSTICAS ADICIONALES

### Responsive Design
- ✅ Móvil (diseño vertical, cards 1 columna)
- ✅ Tablet (diseño 2 columnas)
- ✅ Desktop (diseño 3 columnas)

### Actualización en Tiempo Real
- ✅ No requiere recargar página
- ✅ Admin: cada 10 segundos
- ✅ Cliente: cada 5 segundos

### Indicadores Visuales
- ✅ Colores intuitivos (🟢🟡🔴)
- ✅ Barras de progreso
- ✅ Iconos descriptivos
- ✅ Badges de estado

---

¿Necesitas que agregue más funcionalidades o quieres que detalle alguna en particular? 🚀
