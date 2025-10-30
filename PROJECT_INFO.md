# ElevaTec Web App - Información del Proyecto

## Estadísticas del Proyecto

### Código
- **Líneas de código:** ~2,074 líneas (Python + JavaScript + JSX)
- **Archivos creados:** 55+ archivos
- **Lenguajes:** Python, JavaScript, JSX, SQL, YAML, Markdown
- **Frameworks:** Flask, React, TailwindCSS
- **Tiempo de desarrollo:** Completado en una sesión

### Estructura
```
Backend:
- 12 archivos Python
- 5 modelos de datos
- 5 blueprints de rutas
- 1 archivo de configuración

Frontend:
- 14 archivos JSX/JS
- 4 componentes reutilizables
- 4 páginas principales
- 1 context de autenticación

Documentación:
- 8 archivos Markdown
- Ejemplos de API
- Guías de inicio rápido
- Documentación de deployment

DevOps:
- 3 Dockerfiles
- 1 docker-compose.yml
- Scripts de verificación
- Scripts de simulación
```

## Componentes Desarrollados

### Backend (Flask)

#### Modelos de Base de Datos
1. **User** - Gestión de usuarios con roles
2. **Device** - Registro de ESP32-CAM
3. **Elevator** - Información de ascensores
4. **AforoLog** - Historial de ocupación

#### Rutas API
1. **auth.py** - Autenticación y registro
   - POST /api/login
   - POST /api/register
   - GET /api/me

2. **elevators.py** - Gestión de ascensores
   - GET /api/elevators
   - GET /api/elevators/<id>
   - POST /api/elevators
   - PUT /api/elevators/<id>
   - DELETE /api/elevators/<id>

3. **devices.py** - Gestión de dispositivos
   - GET /api/devices
   - GET /api/devices/<id>
   - POST /api/devices
   - PUT /api/devices/<id>
   - DELETE /api/devices/<id>

4. **data.py** - Ingesta de datos ESP32
   - POST /api/data

5. **metrics.py** - Estadísticas y análisis
   - GET /api/metrics

#### Características
- ✅ Autenticación JWT
- ✅ Validación de roles
- ✅ Auto-registro de dispositivos
- ✅ Cálculo automático de aforo
- ✅ Logging de actividad
- ✅ CORS configurado
- ✅ Hash de contraseñas

### Frontend (React)

#### Páginas
1. **Login.jsx** - Pantalla de inicio de sesión
   - Formulario de login
   - Validación de credenciales
   - Redirección según rol

2. **AdminDashboard.jsx** - Panel administrativo
   - 4 KPIs principales
   - 3 gráficas interactivas
   - Tabla de ascensores en tiempo real
   - Auto-refresh cada 10s

3. **DeviceManager.jsx** - Gestión de dispositivos
   - Tabla de dispositivos
   - CRUD completo
   - Modal de edición
   - Estado online/offline

4. **UserHome.jsx** - Vista de cliente
   - Lista de ascensores
   - Tarjetas color-coded
   - Recomendaciones automáticas
   - Auto-refresh cada 5s

#### Componentes
1. **Navbar.jsx** - Barra de navegación
   - Enlaces por rol
   - Información de usuario
   - Logout

2. **ElevatorCard.jsx** - Tarjeta de ascensor
   - Barra de progreso
   - Color según aforo
   - Recomendaciones

3. **DashboardChart.jsx** - Gráficas
   - Pie chart de distribución
   - Bar chart de horas pico
   - Bar chart de tendencia

4. **PrivateRoute.jsx** - Protección de rutas
   - Validación de autenticación
   - Validación de rol admin

#### Context
1. **AuthContext.jsx** - Estado global de autenticación
   - Login/logout
   - Persistencia en localStorage
   - Verificación de roles

#### API
1. **axios.js** - Cliente HTTP configurado
   - Interceptor de token
   - Manejo de errores 401
   - Base URL configurable

#### Características
- ✅ Routing con React Router
- ✅ Estado global con Context API
- ✅ Diseño responsive (Tailwind)
- ✅ Gráficas interactivas (Recharts)
- ✅ Auto-refresh de datos
- ✅ Protección de rutas
- ✅ Manejo de errores

### Base de Datos (PostgreSQL)

#### Esquema
```sql
-- Usuarios
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'client',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Dispositivos
CREATE TABLE devices (
    id SERIAL PRIMARY KEY,
    device_id VARCHAR(50) UNIQUE NOT NULL,
    floor INTEGER NOT NULL,
    ip_address VARCHAR(50),
    last_seen TIMESTAMP,
    status VARCHAR(20) DEFAULT 'offline',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ascensores
CREATE TABLE elevators (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    floor INTEGER NOT NULL,
    capacity INTEGER NOT NULL,
    current_people INTEGER DEFAULT 0,
    device_id VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Logs de aforo
CREATE TABLE aforo_logs (
    id SERIAL PRIMARY KEY,
    elevator_id INTEGER REFERENCES elevators(id),
    people_count INTEGER NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Relaciones
- elevators.device_id → devices.device_id
- aforo_logs.elevator_id → elevators.id (CASCADE DELETE)

### DevOps

#### Docker
1. **backend/Dockerfile**
   - Python 3.11 slim
   - Instalación de dependencias
   - Puerto 5000

2. **frontend/Dockerfile**
   - Node 18 alpine
   - Instalación de npm
   - Puerto 5173

3. **docker-compose.yml**
   - 3 servicios (db, backend, frontend)
   - Network bridge
   - Volumen persistente para PostgreSQL
   - Healthcheck para DB

#### Scripts
1. **test_esp32_simulator.py**
   - Simula 5 dispositivos ESP32-CAM
   - Envío continuo o único
   - Datos aleatorios realistas

2. **verify_project.sh**
   - Verifica estructura completa
   - 53 archivos checkeados
   - Reporte con colores

## Documentación Incluida

### 1. README.md (Principal)
- Descripción completa del proyecto
- Características
- Estructura
- Instalación
- API endpoints
- Integración ESP32-CAM
- Roles y permisos
- Desarrollo
- Producción

### 2. QUICKSTART.md
- Guía de 3 pasos
- Comandos esenciales
- Simulador de datos
- Troubleshooting básico
- Ejemplos de uso

### 3. API_EXAMPLES.md
- Ejemplos detallados con curl
- Requests y responses
- Códigos de error
- Integración en Python y JS
- Testing con Postman
- Ejemplo ESP32-CAM en Arduino

### 4. PROYECTO_ESTRUCTURA.md
- Árbol de archivos completo
- Descripción de componentes
- Flujo de datos
- Lógica de aforo
- Métricas disponibles
- Comandos útiles

### 5. RESUMEN_EJECUTIVO.md
- Visión general del proyecto
- Arquitectura del sistema
- Tecnologías usadas
- Modelo de datos
- Casos de uso
- Roadmap

### 6. DEPLOYMENT.md
- Guías de deployment
- Docker Compose
- AWS, GCP, DigitalOcean
- Configuración ESP32-CAM
- SSL/TLS
- Monitoreo y backups
- Seguridad
- Escalamiento

### 7. PROJECT_INFO.md (Este archivo)
- Estadísticas del proyecto
- Componentes desarrollados
- Funcionalidades implementadas

## Funcionalidades Implementadas

### Autenticación y Autorización
- ✅ Login con JWT
- ✅ Registro de usuarios (admin)
- ✅ Roles: admin y client
- ✅ Protección de endpoints
- ✅ Protección de rutas frontend
- ✅ Persistencia de sesión
- ✅ Hash de contraseñas (Werkzeug)

### Gestión de Dispositivos
- ✅ CRUD completo de ESP32-CAM
- ✅ Auto-registro en primer uso
- ✅ Monitoreo online/offline
- ✅ Registro de IP y última conexión
- ✅ Asociación con ascensores

### Gestión de Ascensores
- ✅ CRUD completo
- ✅ Cálculo automático de aforo
- ✅ Clasificación: bajo/medio/alto
- ✅ Actualización en tiempo real
- ✅ Historial de ocupación

### Ingesta de Datos
- ✅ Endpoint sin autenticación para ESP32
- ✅ Validación de datos
- ✅ Auto-creación de registros
- ✅ Logging en base de datos
- ✅ Timestamp customizable

### Dashboard Administrativo
- ✅ 4 KPIs principales
- ✅ Gráfica de distribución de aforo
- ✅ Gráfica de horas pico
- ✅ Gráfica de tendencia semanal
- ✅ Tabla de estado en tiempo real
- ✅ Auto-refresh cada 10s

### Vista Cliente
- ✅ Lista de ascensores
- ✅ Tarjetas color-coded
- ✅ Recomendaciones automáticas
- ✅ Estadísticas rápidas
- ✅ Ordenamiento por disponibilidad
- ✅ Auto-refresh cada 5s

### Métricas y Análisis
- ✅ Total de ascensores
- ✅ Dispositivos online/offline
- ✅ Ocupación promedio
- ✅ Distribución de aforo
- ✅ Registros últimas 24h
- ✅ Análisis de horas pico
- ✅ Tendencia de 7 días

### Interfaz de Usuario
- ✅ Diseño responsive (Tailwind)
- ✅ Paleta de colores coherente
- ✅ Gráficas interactivas (Recharts)
- ✅ Tablas con datos en vivo
- ✅ Modales para edición
- ✅ Feedback visual (colores)
- ✅ Loading states

### DevOps y Deployment
- ✅ Docker Compose configurado
- ✅ Variables de entorno
- ✅ Volúmenes persistentes
- ✅ Healthchecks
- ✅ Networking entre servicios
- ✅ Scripts de verificación
- ✅ Simulador de datos

## Tecnologías y Librerías

### Backend
```
Flask==3.0.0
Flask-SQLAlchemy==3.1.1
Flask-JWT-Extended==4.6.0
Flask-CORS==4.0.0
psycopg2-binary==2.9.9
python-dotenv==1.0.0
Werkzeug==3.0.1
```

### Frontend
```
react@18.2.0
react-dom@18.2.0
react-router-dom@6.20.0
axios@1.6.2
recharts@2.10.3
tailwindcss@3.3.6
vite@5.0.8
```

### Base de Datos
- PostgreSQL 15

### DevOps
- Docker
- Docker Compose

## Características Destacadas

### 1. Auto-registro de Dispositivos
Los ESP32-CAM se registran automáticamente al enviar su primer dato. No requiere configuración manual previa.

### 2. Lógica de Aforo Inteligente
Cálculo automático basado en ratio de ocupación:
- < 50%: Bajo (verde)
- 50-80%: Medio (amarillo)
- > 80%: Alto (rojo)

### 3. Recomendaciones Automáticas
El sistema genera recomendaciones contextuales para usuarios:
- "Puede usar el ascensor del piso 3"
- "Espere un momento"
- "Considere usar las escaleras"

### 4. Tiempo Real
Actualización automática de datos sin recargar página:
- Admin: cada 10 segundos
- Cliente: cada 5 segundos

### 5. Análisis de Datos
Gráficas de:
- Distribución actual
- Patrones de uso por hora
- Tendencias semanales

### 6. Seguridad
- JWT con roles
- Hash de contraseñas
- CORS configurado
- Validación de inputs
- Protección de endpoints

## Usuario por Defecto

**Administrador:**
```
Email: admin@elevatec.com
Password: admin123
```

Creado automáticamente al inicializar el backend.

## Próximos Pasos Sugeridos

### Corto Plazo
1. Conectar ESP32-CAM real
2. Ajustar configuración de pisos
3. Personalizar colores/branding
4. Crear usuarios cliente

### Mediano Plazo
1. Implementar WebSocket para updates instantáneos
2. Agregar exportación a CSV/PDF
3. Sistema de notificaciones
4. Panel de alertas configurables

### Largo Plazo
1. App móvil (React Native)
2. Machine Learning para predicción de aforo
3. Integración con sistemas de elevadores
4. API pública con documentación

## Contacto y Soporte

**Proyecto:** ElevaTec Web App
**Versión:** 1.0.0
**Fecha:** Octubre 2025
**Desarrollado para:** Cognitive Computing - UTEC

**Archivos de Ayuda:**
- Ver `README.md` para documentación completa
- Ver `QUICKSTART.md` para inicio rápido
- Ver `API_EXAMPLES.md` para ejemplos de API
- Ver `DEPLOYMENT.md` para deployment

**Verificación:**
```bash
./verify_project.sh
```

**Simulación:**
```bash
python test_esp32_simulator.py
```

## Licencia

MIT License - Libre para uso académico y comercial

---

*Proyecto completo y listo para deployment*
*Última actualización: 28/10/2025*
