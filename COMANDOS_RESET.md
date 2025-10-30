# 🔄 COMANDOS PARA RESETEAR TODO

## 🚀 OPCIÓN 1: Script Automatizado (MÁS FÁCIL)

### Un solo comando:
```bash
./RESET_COMPLETO.sh
```

Esto hace:
- ✅ Detiene todo
- ✅ Elimina base de datos antigua
- ✅ Reconstruye imágenes Docker
- ✅ Inicia todos los servicios
- ✅ Espera a que todo esté listo
- ✅ Muestra estado y logs

**Tiempo:** ~3-5 minutos

---

## 📋 OPCIÓN 2: Comandos Manuales (Paso a Paso)

Si prefieres ejecutar cada paso manualmente:

### Paso 1: Ir al directorio del proyecto
```bash
cd "/Users/msalazarh/Documents/utec/Congnitive Computing/ProyectoFinal"
```

### Paso 2: Detener todo
```bash
docker-compose down
```

### Paso 3: Eliminar volumen de BD antigua
```bash
docker volume rm proyectofinal_postgres_data
```

### Paso 4: Limpiar contenedores
```bash
docker-compose rm -f
```

### Paso 5: Reconstruir imágenes (opcional pero recomendado)
```bash
docker-compose build --no-cache
```

### Paso 6: Iniciar todo
```bash
docker-compose up -d
```

### Paso 7: Esperar 1 minuto
```bash
sleep 60
```

### Paso 8: Verificar estado
```bash
docker-compose ps
```

Deberías ver:
```
elevatec_db         Up (healthy)
elevatec_backend    Up
elevatec_frontend   Up
elevatec_simulator  Up
```

### Paso 9: Ver el simulador en acción
```bash
docker-compose logs -f simulator
```

Deberías ver:
```
🟢 ESP32CAM-101    |  23/ 45 personas | BAJO   | Salón A-301
🟡 ESP32CAM-201    |  67/ 80 personas | MEDIO  | Biblioteca Central
🔴 ESP32CAM-301    |  98/120 personas | ALTO   | Cafetería Principal
```

### Paso 10: Abrir la web
```bash
open http://localhost:5173
```

Login:
- Email: `admin@elevatec.com`
- Password: `admin123`

---

## ⚡ OPCIÓN 3: Reset Super Rápido (Sin Reconstruir)

Si solo quieres reiniciar sin reconstruir imágenes:

```bash
docker-compose down && \
docker volume rm proyectofinal_postgres_data && \
docker-compose up -d && \
sleep 60 && \
docker-compose ps
```

**Tiempo:** ~1-2 minutos

---

## 🔍 OPCIÓN 4: Reset Solo Base de Datos

Si solo quieres limpiar la BD pero mantener todo lo demás:

```bash
docker-compose stop db
docker volume rm proyectofinal_postgres_data
docker-compose up -d db
sleep 15
docker-compose restart backend
sleep 5
docker-compose restart simulator
```

---

## 🧹 OPCIÓN 5: Limpieza TOTAL (Elimina TODO)

**⚠️ ADVERTENCIA: Esto elimina TODO, incluyendo imágenes Docker**

```bash
# Detener todo
docker-compose down -v

# Eliminar imágenes
docker-compose down --rmi all

# Eliminar volúmenes huérfanos
docker volume prune -f

# Reconstruir desde cero
docker-compose up -d --build

# Esperar
sleep 90

# Verificar
docker-compose ps
```

---

## 📊 Verificar que Hay Data

### Ver logs en tiempo real del simulador:
```bash
docker-compose logs -f simulator
```

### Ver cantidad de datos en la BD:
```bash
docker exec elevatec_db psql -U elevadmin -d elevadb -c "
SELECT
  'Usuarios' as tabla, COUNT(*) as cantidad FROM users
UNION ALL
SELECT 'Ascensores', COUNT(*) FROM elevators
UNION ALL
SELECT 'Dispositivos', COUNT(*) FROM devices
UNION ALL
SELECT 'Logs', COUNT(*) FROM aforo_logs;
"
```

Deberías ver:
```
    tabla     | cantidad
--------------+----------
 Usuarios     |        1
 Ascensores   |        5
 Dispositivos |        5
 Logs         |      100+  (aumenta cada 5 segundos)
```

### Ver últimos 10 logs del simulador:
```bash
docker exec elevatec_db psql -U elevadmin -d elevadb -c "
SELECT
  device_id,
  people_count,
  timestamp
FROM aforo_logs
ORDER BY timestamp DESC
LIMIT 10;
"
```

---

## 🎯 Qué Esperar Después del Reset

### Inmediatamente después (0-30 segundos):
- ✅ Base de datos creada
- ✅ Backend iniciado
- ✅ Frontend iniciado
- ⏳ Simulador esperando que backend esté listo

### Después de 30-60 segundos:
- ✅ Simulador conectado al backend
- ✅ Empiezan a llegar datos
- ✅ Se crean los primeros logs en la BD
- ✅ Frontend muestra los primeros espacios

### Después de 1-2 minutos:
- ✅ Ya hay 10-20+ logs en la BD
- ✅ Los espacios se actualizan automáticamente
- ✅ Puedes ver cambios en tiempo real
- ✅ Todo funciona perfectamente

---

## 🐛 Solución de Problemas

### Problema: "Error: volume is in use"
```bash
# Forzar eliminación
docker-compose down
docker volume rm -f proyectofinal_postgres_data

# O eliminar todos los volúmenes
docker volume prune -f
```

### Problema: "Backend no disponible"
```bash
# Ver logs del backend
docker-compose logs backend

# Si hay error, reiniciar
docker-compose restart backend
sleep 10
docker-compose restart simulator
```

### Problema: "No veo datos en el frontend"
```bash
# Verificar que el simulador esté enviando datos
docker-compose logs --tail=20 simulator

# Verificar que haya logs en la BD
docker exec elevatec_db psql -U elevadmin -d elevadb -c "SELECT COUNT(*) FROM aforo_logs;"

# Si COUNT es 0, reiniciar simulador
docker-compose restart simulator
```

### Problema: "Puerto 5432 ya en uso"
```bash
# Ver qué está usando el puerto
lsof -i :5432

# Detener PostgreSQL local si está corriendo
brew services stop postgresql

# O cambiar el puerto en docker-compose.yml:
# ports:
#   - "5433:5432"  # Usar puerto 5433 en lugar de 5432
```

### Problema: "Puerto 5173 ya en uso"
```bash
# Ver qué está usando el puerto
lsof -i :5173

# Matar el proceso
kill -9 <PID>

# O cambiar puerto en docker-compose.yml
```

---

## ✅ Checklist Post-Reset

Ejecuta estos comandos para verificar que todo está bien:

```bash
# 1. Verificar que 4 contenedores estén UP
docker-compose ps

# 2. Ver logs del simulador (debe mostrar datos enviándose)
docker-compose logs --tail=20 simulator

# 3. Verificar que haya logs en la BD (debe ser > 0)
docker exec elevatec_db psql -U elevadmin -d elevadb -c "SELECT COUNT(*) FROM aforo_logs;"

# 4. Verificar que el backend responda
curl http://localhost:5002/api/elevators

# 5. Abrir el frontend
open http://localhost:5173
```

Si todos pasan ✅, ¡todo está funcionando!

---

## 📝 Resumen Rápido

### Reset completo en 1 línea:
```bash
./RESET_COMPLETO.sh
```

### Reset rápido manual:
```bash
docker-compose down && docker volume rm proyectofinal_postgres_data && docker-compose up -d && sleep 60
```

### Ver que todo funciona:
```bash
docker-compose ps && docker-compose logs --tail=20 simulator
```

### Abrir la app:
```bash
open http://localhost:5173
```

---

## 🎉 ¡Listo!

Después del reset deberías ver:
- ✅ 4 contenedores corriendo
- ✅ Simulador enviando datos cada 5 segundos
- ✅ Base de datos con logs creciendo
- ✅ Frontend mostrando espacios actualizándose
- ✅ Login funcionando (admin@elevatec.com / admin123)

**Tiempo total:** 3-5 minutos desde el reset hasta tener data en la web.
