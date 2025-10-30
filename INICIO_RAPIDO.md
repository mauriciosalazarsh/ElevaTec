# 🚀 INICIO RÁPIDO - ElevaTec

## ✅ TODO LISTO PARA USAR

Tu proyecto **YA está funcionando** con simulador de cámaras ESP32 incluido.

---

## 📊 Estado Actual

```
✅ PostgreSQL      → elevatec_db        (Puerto 5432)
✅ Backend Flask   → elevatec_backend   (Puerto 5002)
✅ Frontend React  → elevatec_frontend  (Puerto 5173)
✅ Simulador ESP32 → elevatec_simulator (12 cámaras)
```

---

## 🎯 Acceso Rápido

### 1. Ver la Aplicación Web
```bash
open http://localhost:5173
```

**Login:**
- Email: `admin@elevatec.com`
- Password: `admin123`

### 2. Ver el Simulador en Acción
```bash
docker-compose logs -f simulator
```

Verás algo como:
```
🟢 ESP32CAM-101    |  23/ 45 personas | BAJO   | Salón A-301
🟡 ESP32CAM-201    |  67/ 80 personas | MEDIO  | Biblioteca Central
🔴 ESP32CAM-301    |  98/120 personas | ALTO   | Cafetería Principal
```

### 3. Verificar que Todo Funciona
```bash
docker-compose ps
```

Deberías ver 4 contenedores "Up":
```
elevatec_db        Up (healthy)
elevatec_backend   Up
elevatec_frontend  Up
elevatec_simulator Up
```

---

## 🎮 Comandos Básicos

### Iniciar Todo
```bash
docker-compose up -d
```

### Detener Todo
```bash
docker-compose down
```

### Reiniciar Todo
```bash
docker-compose restart
```

### Ver Logs
```bash
# Backend
docker-compose logs -f backend

# Frontend
docker-compose logs -f frontend

# Simulador
docker-compose logs -f simulator

# Base de datos
docker-compose logs -f db
```

### Ver Estado
```bash
docker-compose ps
```

---

## 📱 Simulador de Cámaras ESP32

### ¿Qué hace?

Simula **12 cámaras ESP32-CAM** enviando datos cada 5 segundos:

- 2 Ascensores
- 3 Salones
- 2 Bibliotecas
- 2 Cafeterías
- 2 Laboratorios
- 1 Gimnasio

### Características

✅ **Datos realistas**: Los números cambian gradualmente (como en la realidad)
✅ **Horas pico**: Más gente entre 8-10am, 12-2pm, 5-7pm
✅ **Actualización automática**: Cada 5 segundos
✅ **Indicadores visuales**: 🟢 Bajo, 🟡 Medio, 🔴 Alto

### Cambiar Velocidad de Actualización

Edita `docker-compose.yml`:
```yaml
simulator:
  environment:
    INTERVAL_SECONDS: 10  # ← Cambiar aquí (default: 5)
```

Luego:
```bash
docker-compose restart simulator
```

### Detener el Simulador
```bash
docker-compose stop simulator
```

### Iniciar el Simulador
```bash
docker-compose start simulator
```

---

## 🎓 Funcionalidades del Sistema

### Como Administrador (admin@elevatec.com)

✅ **Dashboard Completo**
- 4 métricas principales
- 3 gráficas interactivas
- Tabla en tiempo real de espacios
- Actualización cada 10 segundos

✅ **Gestión de Dispositivos**
- Ver todas las cámaras ESP32
- Crear/editar/eliminar dispositivos
- Ver estado online/offline

✅ **Gestión de Espacios**
- Crear/editar/eliminar espacios
- Asignar cámaras a espacios
- Ver historial de aforo

✅ **Métricas Avanzadas**
- Análisis por tipo de espacio
- Análisis por edificio
- Horas pico
- Tendencia diaria

### Como Usuario/Cliente (crear cuenta nueva)

✅ **Vista de Espacios**
- Ver todos los espacios disponibles
- Recomendación inteligente global
- Cards con indicadores visuales
- Actualización cada 5 segundos

✅ **Información Detallada**
- Ocupación en tiempo real
- Barra de progreso visual
- Recomendación personalizada por espacio
- Estado con colores (🟢🟡🔴)

---

## 🔧 Solución de Problemas

### Problema 1: No se ve nada en http://localhost:5173

**Solución:**
```bash
# Verificar que frontend esté corriendo
docker-compose ps frontend

# Ver logs
docker-compose logs frontend

# Reiniciar
docker-compose restart frontend

# Esperar 30 segundos
sleep 30

# Intentar de nuevo
open http://localhost:5173
```

### Problema 2: Error "Cannot connect to backend"

**Solución:**
```bash
# Verificar backend
docker-compose ps backend

# Ver logs
docker-compose logs backend

# Reiniciar backend
docker-compose restart backend
```

### Problema 3: Simulador no envía datos

**Solución:**
```bash
# Ver logs del simulador
docker-compose logs simulator

# Si dice "Backend no disponible":
docker-compose restart backend
sleep 10
docker-compose restart simulator
```

### Problema 4: Base de datos no responde

**Solución:**
```bash
# Reiniciar BD
docker-compose restart db

# Esperar que esté healthy
docker-compose ps db

# Reiniciar backend
docker-compose restart backend
```

### Problema 5: Todo está roto

**Solución NUCLEAR:**
```bash
# Detener todo
docker-compose down

# Eliminar contenedores
docker-compose rm -f

# Reconstruir e iniciar
docker-compose up -d --build

# Esperar 1 minuto
sleep 60

# Verificar
docker-compose ps
```

---

## 📊 Verificar Datos en la Base de Datos

### Ver cantidad de datos
```bash
docker exec elevatec_db psql -U elevadmin -d elevadb -c "
SELECT
  'Usuarios' as tabla, COUNT(*)::text as cantidad FROM users
UNION ALL
SELECT 'Ascensores', COUNT(*)::text FROM elevators
UNION ALL
SELECT 'Dispositivos', COUNT(*)::text FROM devices
UNION ALL
SELECT 'Logs', COUNT(*)::text FROM aforo_logs;
"
```

### Ver últimos logs del simulador
```bash
docker exec elevatec_db psql -U elevadmin -d elevadb -c "
SELECT device_id, people_count, timestamp
FROM aforo_logs
ORDER BY timestamp DESC
LIMIT 10;
"
```

---

## 🎯 Casos de Uso

### Demo Rápida (Velocidad 2x)
```bash
# Editar docker-compose.yml
# Cambiar INTERVAL_SECONDS: 2

docker-compose restart simulator
```

### Demo Realista (Velocidad Normal)
```bash
# INTERVAL_SECONDS: 5 (default)
```

### Demo Lenta (Para Explicar)
```bash
# Editar docker-compose.yml
# Cambiar INTERVAL_SECONDS: 10

docker-compose restart simulator
```

---

## 📝 Endpoints API Útiles

### Ver todos los ascensores
```bash
curl http://localhost:5002/api/elevators
```

### Ver métricas (como admin)
```bash
# Primero login
curl -X POST http://localhost:5002/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@elevatec.com","password":"admin123"}'

# Copiar el access_token de la respuesta

# Luego ver métricas
curl http://localhost:5002/api/metrics \
  -H "Authorization: Bearer <TOKEN_AQUI>"
```

### Enviar datos manualmente (simular ESP32)
```bash
curl -X POST http://localhost:5002/api/data \
  -H "Content-Type: application/json" \
  -d '{
    "device_id": "ESP32CAM-TEST",
    "floor": 5,
    "people_count": 15,
    "capacity": 45,
    "timestamp": "2025-10-30T00:00:00Z"
  }'
```

---

## 🎨 Personalización

### Cambiar Puerto del Frontend
Editar `docker-compose.yml`:
```yaml
frontend:
  ports:
    - "3000:5173"  # Ahora accedes en http://localhost:3000
```

### Cambiar Puerto del Backend
Editar `docker-compose.yml`:
```yaml
backend:
  ports:
    - "8000:5000"  # Ahora el backend está en http://localhost:8000
```

No olvides actualizar también:
```yaml
frontend:
  environment:
    VITE_API_URL: http://localhost:8000  # ← Cambiar aquí también
```

### Agregar Más Cámaras al Simulador

Editar `esp32_camera_simulator.py`:
```python
CAMERAS = [
    # ... cámaras existentes ...

    # Nueva cámara
    {
        'device_id': 'ESP32CAM-999',
        'name': 'Mi Nueva Cámara',
        'floor': 5,
        'capacity': 50,
        'min_people': 10,
        'max_people': 48,
        'variation': 5
    },
]
```

Luego:
```bash
docker-compose restart simulator
```

---

## 📚 Documentación Completa

- `README.md` - Información general del proyecto
- `FUNCIONALIDADES.md` - Todas las funcionalidades detalladas
- `DATABASE_DESIGN.md` - Diseño de la base de datos
- `SIMULADOR_ESP32.md` - Guía completa del simulador
- `INSTRUCCIONES_BASE_DATOS.md` - Cómo migrar la BD

---

## ✅ Checklist de Inicio

- [ ] Ejecutar `docker-compose ps` y ver 4 contenedores "Up"
- [ ] Abrir http://localhost:5173 y ver la pantalla de login
- [ ] Login con admin@elevatec.com / admin123
- [ ] Ver el dashboard con datos actualizándose
- [ ] Ejecutar `docker-compose logs -f simulator` y ver datos enviándose
- [ ] Ver que los números en el frontend cambian cada 5-10 segundos

Si todos los checkboxes están ✅, ¡todo está funcionando perfecto! 🎉

---

## 🆘 Ayuda Rápida

**¿No funciona algo?**

1. Ver logs: `docker-compose logs <servicio>`
2. Reiniciar: `docker-compose restart <servicio>`
3. Reconstruir: `docker-compose up -d --build <servicio>`
4. Reinicio completo: `docker-compose down && docker-compose up -d`

**Servicios disponibles:**
- `db` - Base de datos PostgreSQL
- `backend` - API Flask
- `frontend` - Interfaz React
- `simulator` - Simulador ESP32

---

## 🎉 ¡Disfruta!

Tu sistema ElevaTec está **100% funcional** con:
- ✅ Base de datos PostgreSQL
- ✅ Backend Flask con API REST
- ✅ Frontend React responsive
- ✅ 12 cámaras ESP32 simuladas
- ✅ Datos en tiempo real
- ✅ Actualización automática

**Acceso:** http://localhost:5173
**Login:** admin@elevatec.com / admin123

---

Para más información, revisa los otros archivos de documentación en el proyecto.
