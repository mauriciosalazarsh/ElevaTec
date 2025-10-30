# ElevaTec - Guía de Inicio Rápido

## Iniciar el Proyecto (3 pasos)

### 1. Levantar los servicios con Docker

```bash
docker-compose up --build
```

Espera a que todos los servicios estén listos. Verás mensajes como:
- `elevatec_db | database system is ready to accept connections`
- `elevatec_backend | * Running on http://0.0.0.0:5000`
- `elevatec_frontend | VITE ready in XXX ms`

### 2. Acceder a la aplicación

Abre tu navegador en: **http://localhost:5173**

### 3. Login

Usa estas credenciales por defecto:

**Administrador:**
- Email: `admin@elevatec.com`
- Password: `admin123`

## Simular Datos de ESP32-CAM

En una nueva terminal, ejecuta el simulador:

```bash
python test_esp32_simulator.py
```

Esto enviará datos simulados cada 5 segundos. Verás actualizaciones en tiempo real en el dashboard.

Para enviar datos solo una vez:
```bash
python test_esp32_simulator.py --once
```

## Acceso Rápido

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **PostgreSQL**: localhost:5432

## Probar la API directamente

### Login
```bash
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@elevatec.com","password":"admin123"}'
```

### Enviar datos de ESP32 (sin autenticación)
```bash
curl -X POST http://localhost:5000/api/data \
  -H "Content-Type: application/json" \
  -d '{
    "device_id": "ESP32CAM-TEST",
    "floor": 1,
    "people_count": 5,
    "capacity": 10,
    "timestamp": "2025-10-28T18:00:00Z"
  }'
```

### Ver ascensores (requiere token)
```bash
# Primero obtén el token del login
TOKEN="tu-token-aqui"

curl -X GET http://localhost:5000/api/elevators \
  -H "Authorization: Bearer $TOKEN"
```

## Detener el Proyecto

```bash
docker-compose down
```

Para eliminar también la base de datos:
```bash
docker-compose down -v
```

## Estructura de Roles

### Administrador (`admin@elevatec.com`)
- Dashboard con métricas y gráficas
- Gestión de dispositivos ESP32-CAM
- Ver todos los ascensores
- Acceso a: `/admin/dashboard`, `/admin/devices`

### Cliente (crear con el admin)
- Ver estado de ascensores
- Recomendaciones automáticas
- Acceso a: `/user/home`

## Crear Nuevo Usuario Cliente

1. Login como admin
2. Ve a la consola de Python del backend:
```bash
docker exec -it elevatec_backend python
```

3. Ejecuta:
```python
from app import create_app, db
from app.models.user import User
from werkzeug.security import generate_password_hash

app = create_app()
with app.app_context():
    user = User(
        name='Cliente Test',
        email='cliente@test.com',
        password_hash=generate_password_hash('cliente123'),
        role='client'
    )
    db.session.add(user)
    db.session.commit()
    print("Usuario creado!")
```

O usa el endpoint `/api/register` desde el dashboard (próximamente en UI).

## Troubleshooting

### El backend no conecta con la DB
Espera unos segundos más. PostgreSQL tarda en inicializarse.

### El frontend no carga
Verifica que el backend esté corriendo en http://localhost:5000

### Puerto ocupado
Si el puerto 5173 o 5000 está ocupado, edita `docker-compose.yml`:
```yaml
ports:
  - "NUEVO_PUERTO:5173"  # Para frontend
  - "NUEVO_PUERTO:5000"  # Para backend
```

### Ver logs
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

## Próximos Pasos

1. Conecta tu ESP32-CAM real al endpoint `/api/data`
2. Ajusta los pisos y capacidades según tu edificio
3. Personaliza los colores en `tailwind.config.js`
4. Agrega más gráficas en el dashboard

## Contacto ESP32-CAM

Tu código ESP32 debe hacer POST a:
```
http://<IP_DEL_SERVIDOR>:5000/api/data
```

Ejemplo en Arduino:
```cpp
HTTPClient http;
http.begin("http://192.168.1.100:5000/api/data");
http.addHeader("Content-Type", "application/json");

String json = "{\"device_id\":\"ESP32CAM-01\",\"floor\":1,\"people_count\":5,\"capacity\":10}";
int code = http.POST(json);
```

Listo! Tu sistema ElevaTec está corriendo.
