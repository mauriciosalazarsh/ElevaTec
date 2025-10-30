# ElevaTec Web App

Sistema de monitoreo de aforo y uso de ascensores con dispositivos ESP32-CAM, desarrollado con Flask (backend) y React (frontend).

## Características

- Monitoreo en tiempo real del aforo de ascensores
- Dashboard administrativo con métricas y gráficas
- Interfaz para clientes con recomendaciones automáticas
- Gestión de dispositivos ESP32-CAM
- Autenticación JWT con roles (admin/cliente)
- Visualización de datos con gráficas interactivas
- API REST para recibir datos de cámaras ESP32

## Tecnologías

### Backend
- Flask 3.0
- PostgreSQL 15
- Flask-JWT-Extended
- Flask-SQLAlchemy
- Flask-CORS

### Frontend
- React 18
- Vite
- TailwindCSS
- Recharts
- Axios
- React Router DOM

### DevOps
- Docker
- Docker Compose

## Estructura del Proyecto

```
ProyectoFinal/
├── backend/
│   ├── app/
│   │   ├── models/          # Modelos de base de datos
│   │   ├── routes/          # Endpoints de la API
│   │   └── __init__.py      # Configuración de Flask
│   ├── app.py               # Punto de entrada
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── api/             # Configuración de Axios
│   │   ├── components/      # Componentes React
│   │   ├── context/         # Context API (Auth)
│   │   ├── pages/           # Páginas principales
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## Instalación y Uso

### Requisitos Previos
- Docker Desktop instalado
- Docker Compose instalado

### Opción 1: Con Docker (Recomendado)

1. Clonar el repositorio:
```bash
cd ProyectoFinal
```

2. Iniciar todos los servicios:
```bash
docker-compose up --build
```

3. Acceder a la aplicación:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- PostgreSQL: localhost:5432

4. Credenciales de acceso por defecto:
```
Email: admin@elevatec.com
Password: admin123
```

### Opción 2: Desarrollo Local

#### Backend

1. Crear entorno virtual:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
```

2. Instalar dependencias:
```bash
pip install -r requirements.txt
```

3. Configurar variables de entorno:
```bash
cp ../.env.example .env
# Editar .env con tu configuración de PostgreSQL
```

4. Ejecutar:
```bash
python app.py
```

#### Frontend

1. Instalar dependencias:
```bash
cd frontend
npm install
```

2. Ejecutar:
```bash
npm run dev
```

## API Endpoints

### Autenticación
- `POST /api/login` - Iniciar sesión
- `POST /api/register` - Registrar usuario (solo admin)
- `GET /api/me` - Obtener usuario actual

### Ascensores
- `GET /api/elevators` - Listar ascensores
- `GET /api/elevators/<id>` - Detalle de ascensor
- `POST /api/elevators` - Crear ascensor (admin)
- `PUT /api/elevators/<id>` - Actualizar ascensor (admin)
- `DELETE /api/elevators/<id>` - Eliminar ascensor (admin)

### Dispositivos
- `GET /api/devices` - Listar dispositivos (admin)
- `GET /api/devices/<id>` - Detalle de dispositivo (admin)
- `POST /api/devices` - Crear dispositivo (admin)
- `PUT /api/devices/<id>` - Actualizar dispositivo (admin)
- `DELETE /api/devices/<id>` - Eliminar dispositivo (admin)

### Datos de ESP32-CAM
- `POST /api/data` - Recibir datos de cámaras (sin autenticación)

Ejemplo de JSON desde ESP32-CAM:
```json
{
  "device_id": "ESP32CAM-05",
  "floor": 3,
  "people_count": 6,
  "capacity": 10,
  "timestamp": "2025-10-28T18:00:00Z"
}
```

### Métricas
- `GET /api/metrics` - Obtener estadísticas globales (admin)

## Integración con ESP32-CAM

Tu código ESP32-CAM debe enviar datos POST a:
```
http://<servidor>:5000/api/data
```

Ejemplo en Arduino/ESP32:
```cpp
#include <HTTPClient.h>
#include <ArduinoJson.h>

void sendData(int peopleCount) {
  HTTPClient http;
  http.begin("http://192.168.1.100:5000/api/data");
  http.addHeader("Content-Type", "application/json");

  StaticJsonDocument<200> doc;
  doc["device_id"] = "ESP32CAM-01";
  doc["floor"] = 3;
  doc["people_count"] = peopleCount;
  doc["capacity"] = 10;
  doc["timestamp"] = "2025-10-28T18:00:00Z";

  String json;
  serializeJson(doc, json);

  int httpCode = http.POST(json);
  http.end();
}
```

## Roles y Permisos

### Administrador
- Ver dashboard con métricas y gráficas
- Gestionar dispositivos ESP32-CAM (CRUD)
- Ver todos los ascensores y su estado
- Exportar datos (próximamente)
- Registrar nuevos usuarios

### Cliente
- Ver lista de ascensores
- Ver nivel de aforo en tiempo real
- Recibir recomendaciones automáticas
- Visualización color-coded (verde/amarillo/rojo)

## Lógica de Aforo

El sistema clasifica el estado de cada ascensor:

- **Bajo (Verde)**: < 50% de capacidad
- **Medio (Amarillo)**: 50% - 80% de capacidad
- **Alto (Rojo)**: > 80% de capacidad

## Base de Datos

### Modelos

#### users
- id, name, email, password_hash, role, created_at

#### devices
- id, device_id, floor, ip_address, last_seen, status, created_at

#### elevators
- id, name, floor, capacity, current_people, device_id, created_at, updated_at

#### aforo_logs
- id, elevator_id, people_count, timestamp

## Desarrollo

### Agregar nuevas funcionalidades

1. Backend: Agregar rutas en `backend/app/routes/`
2. Frontend: Agregar componentes en `frontend/src/components/`
3. Actualizar modelos en `backend/app/models/` si es necesario

### Debugging

Ver logs de Docker:
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### Detener servicios

```bash
docker-compose down
```

### Reiniciar base de datos

```bash
docker-compose down -v
docker-compose up --build
```

## Producción

Para desplegar en producción:

1. Cambiar `FLASK_ENV=production` en docker-compose.yml
2. Generar claves secretas seguras para `SECRET_KEY` y `JWT_SECRET_KEY`
3. Configurar HTTPS con nginx o similar
4. Usar variables de entorno seguras
5. Configurar backups de PostgreSQL

## Contribución

Este proyecto fue desarrollado para el curso de Cognitive Computing en UTEC.

## Licencia

MIT License

## Contacto

Para reportar problemas o sugerencias, contactar al equipo de desarrollo.

---

Desarrollado con Flask + React + PostgreSQL + Docker
