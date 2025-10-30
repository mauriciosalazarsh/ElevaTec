# Estructura Completa del Proyecto ElevaTec

## Árbol de Archivos Generados

```
ProyectoFinal/
│
├── backend/                          # Backend Flask
│   ├── app/
│   │   ├── __init__.py              # Configuración Flask, DB, JWT, CORS
│   │   ├── models/
│   │   │   ├── __init__.py          # Exporta todos los modelos
│   │   │   ├── user.py              # Modelo Usuario (admin/client)
│   │   │   ├── device.py            # Modelo Dispositivo ESP32-CAM
│   │   │   ├── elevator.py          # Modelo Ascensor con lógica de aforo
│   │   │   └── aforo_log.py         # Modelo Log de ocupación
│   │   └── routes/
│   │       ├── auth.py              # Login, register, JWT
│   │       ├── elevators.py         # CRUD ascensores
│   │       ├── devices.py           # CRUD dispositivos (admin)
│   │       ├── data.py              # Endpoint POST para ESP32-CAM
│   │       └── metrics.py           # Estadísticas y métricas
│   ├── app.py                        # Punto de entrada Flask
│   ├── requirements.txt              # Dependencias Python
│   └── Dockerfile                    # Imagen Docker backend
│
├── frontend/                         # Frontend React
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js             # Configuración Axios + interceptors JWT
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Barra de navegación
│   │   │   ├── ElevatorCard.jsx     # Tarjeta de ascensor con aforo
│   │   │   ├── DashboardChart.jsx   # Gráficas (Recharts)
│   │   │   └── PrivateRoute.jsx     # Protección de rutas
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Context API para autenticación
│   │   ├── pages/
│   │   │   ├── Login.jsx            # Página de login
│   │   │   ├── AdminDashboard.jsx   # Dashboard con métricas
│   │   │   ├── DeviceManager.jsx    # Gestión de dispositivos
│   │   │   └── UserHome.jsx         # Vista cliente con ascensores
│   │   ├── App.jsx                  # Router y rutas principales
│   │   ├── main.jsx                 # Punto de entrada React
│   │   └── index.css                # Estilos base + Tailwind
│   ├── index.html                    # HTML principal
│   ├── package.json                  # Dependencias Node
│   ├── vite.config.js               # Configuración Vite
│   ├── tailwind.config.js           # Configuración Tailwind
│   ├── postcss.config.js            # PostCSS para Tailwind
│   └── Dockerfile                    # Imagen Docker frontend
│
├── docker-compose.yml                # Orquestación de servicios
├── .env                              # Variables de entorno (LOCAL)
├── .env.example                      # Ejemplo de variables
├── .gitignore                        # Archivos ignorados por git
├── README.md                         # Documentación completa
├── QUICKSTART.md                     # Guía de inicio rápido
├── PROYECTO_ESTRUCTURA.md            # Este archivo
└── test_esp32_simulator.py           # Simulador de datos ESP32-CAM
```

## Componentes del Sistema

### 1. Base de Datos (PostgreSQL)

**Tablas:**
- `users` - Usuarios del sistema (admin/client)
- `devices` - Dispositivos ESP32-CAM registrados
- `elevators` - Ascensores con capacidad y aforo actual
- `aforo_logs` - Histórico de ocupación

**Relaciones:**
- `elevators.device_id` → `devices.device_id` (uno a uno)
- `aforo_logs.elevator_id` → `elevators.id` (muchos a uno)

### 2. Backend API (Flask)

**Endpoints Públicos:**
- `POST /api/login` - Autenticación
- `POST /api/data` - Recepción de datos ESP32-CAM

**Endpoints Protegidos (JWT):**
- `GET /api/elevators` - Listar ascensores
- `GET /api/elevators/<id>` - Detalle ascensor
- `GET /api/me` - Usuario actual

**Endpoints Admin:**
- `POST /api/register` - Crear usuarios
- `POST /api/devices` - Crear dispositivos
- `PUT /api/devices/<id>` - Actualizar dispositivos
- `DELETE /api/devices/<id>` - Eliminar dispositivos
- `POST /api/elevators` - Crear ascensores
- `PUT /api/elevators/<id>` - Actualizar ascensores
- `DELETE /api/elevators/<id>` - Eliminar ascensores
- `GET /api/metrics` - Métricas globales

### 3. Frontend (React)

**Rutas:**
- `/login` - Página de login (pública)
- `/admin/dashboard` - Dashboard admin (privada, admin)
- `/admin/devices` - Gestión dispositivos (privada, admin)
- `/user/home` - Vista cliente (privada, cualquier rol)

**Componentes Principales:**
- `AuthContext` - Manejo de autenticación global
- `PrivateRoute` - HOC para proteger rutas
- `Navbar` - Navegación con logout
- `ElevatorCard` - Visualización de aforo con colores
- `DashboardChart` - Gráficas de métricas

### 4. Lógica de Aforo

```python
def get_aforo_status(people, capacity):
    ratio = people / capacity
    if ratio < 0.5:
        return "bajo"      # Verde
    elif ratio < 0.8:
        return "medio"     # Amarillo
    else:
        return "alto"      # Rojo
```

**Visualización:**
- 🟢 Bajo (< 50%): Disponible
- 🟡 Medio (50-80%): Moderado
- 🔴 Alto (> 80%): Lleno

### 5. Flujo de Datos ESP32-CAM

```
ESP32-CAM → POST /api/data
    ↓
Backend Flask
    ↓
1. Registra/Actualiza dispositivo
2. Crea/Actualiza ascensor
3. Guarda log de aforo
4. Calcula estado (bajo/medio/alto)
    ↓
Base de Datos PostgreSQL
    ↓
Frontend (polling cada 5-10s)
    ↓
Actualización en tiempo real
```

### 6. Autenticación JWT

**Flujo:**
1. Usuario envía email/password a `/api/login`
2. Backend valida y genera JWT con payload: `{id, role}`
3. Frontend guarda token en localStorage
4. Axios interceptor agrega token a todas las peticiones
5. Backend valida token en rutas protegidas

### 7. Métricas y Análisis

**Métricas Disponibles:**
- Total de ascensores
- Dispositivos online/offline
- Ocupación promedio (%)
- Distribución de aforo (bajo/medio/alto)
- Registros últimas 24h
- Horas pico (últimos 7 días)
- Tendencia diaria (últimos 7 días)

**Gráficas:**
- Pie Chart: Distribución de aforo
- Bar Chart: Horas pico
- Bar Chart: Tendencia diaria

### 8. Docker Compose

**Servicios:**
1. **db** (postgres:15)
   - Puerto: 5432
   - Volumen persistente: postgres_data
   - Healthcheck para sincronización

2. **backend** (Flask)
   - Puerto: 5000
   - Depende de: db
   - Variables: DATABASE_URL, SECRET_KEY, JWT_SECRET_KEY

3. **frontend** (React + Vite)
   - Puerto: 5173
   - Depende de: backend
   - Variables: VITE_API_URL

**Red:** `elevatec_network` (bridge)

## Características Implementadas

✅ Autenticación JWT con roles (admin/client)
✅ CRUD completo de dispositivos y ascensores
✅ Endpoint de ingesta de datos ESP32-CAM
✅ Auto-registro de dispositivos nuevos
✅ Dashboard administrativo con métricas
✅ Gráficas interactivas (Recharts)
✅ Vista cliente con recomendaciones
✅ Actualización en tiempo real (polling)
✅ Lógica de aforo con colores
✅ Docker Compose para despliegue
✅ Base de datos PostgreSQL
✅ CORS habilitado
✅ Validación de permisos por rol
✅ Simulador de datos ESP32
✅ Responsive design (Tailwind)
✅ Protección de rutas (PrivateRoute)

## Características Futuras

🔄 WebSocket para updates en tiempo real
🔄 Exportar métricas a CSV/PDF
🔄 Notificaciones push
🔄 Panel de control para crear usuarios desde UI
🔄 Filtros y búsqueda en tablas
🔄 Historial de logs por ascensor
🔄 Alertas cuando aforo > 90%
🔄 Modo oscuro
🔄 Soporte multi-idioma
🔄 API de predicción de aforo

## Tecnologías y Versiones

**Backend:**
- Python 3.11
- Flask 3.0.0
- Flask-SQLAlchemy 3.1.1
- Flask-JWT-Extended 4.6.0
- PostgreSQL 15

**Frontend:**
- Node.js 18
- React 18.2.0
- Vite 5.0.8
- TailwindCSS 3.3.6
- Recharts 2.10.3
- Axios 1.6.2

**DevOps:**
- Docker
- Docker Compose

## Usuario por Defecto

```
Email: admin@elevatec.com
Password: admin123
Role: admin
```

Creado automáticamente al iniciar el backend por primera vez.

## Comandos Útiles

### Desarrollo
```bash
# Iniciar todo
docker-compose up --build

# Ver logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Reiniciar un servicio
docker-compose restart backend

# Detener todo
docker-compose down

# Eliminar volúmenes
docker-compose down -v
```

### Testing
```bash
# Simular ESP32-CAM
python test_esp32_simulator.py

# Envío único
python test_esp32_simulator.py --once
```

### Base de Datos
```bash
# Acceder a PostgreSQL
docker exec -it elevatec_db psql -U elevadmin -d elevadb

# Backup
docker exec elevatec_db pg_dump -U elevadmin elevadb > backup.sql

# Restore
docker exec -i elevatec_db psql -U elevadmin -d elevadb < backup.sql
```

## Seguridad

⚠️ **IMPORTANTE PARA PRODUCCIÓN:**
1. Cambiar SECRET_KEY y JWT_SECRET_KEY
2. Usar HTTPS
3. Implementar rate limiting
4. Validar inputs en backend
5. Hash de passwords (ya implementado con Werkzeug)
6. No exponer puerto de PostgreSQL
7. Usar secrets de Docker/Kubernetes
8. Implementar CSRF tokens

## Contacto y Soporte

Este proyecto fue desarrollado para el curso de Cognitive Computing en UTEC.

Para dudas o problemas, revisar:
- README.md - Documentación completa
- QUICKSTART.md - Guía de inicio rápido
- Logs de Docker para debugging
