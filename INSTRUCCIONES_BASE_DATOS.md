# 🗄️ Instrucciones: Base de Datos ElevaTec

## 📋 Estado Actual

Tu proyecto **YA está corriendo** con Docker Compose:
- ✅ PostgreSQL (elevatec_db) - Puerto 5432
- ✅ Backend Flask - Puerto 5002
- ✅ Frontend React - Puerto 5173

**PERO** la base de datos está usando el esquema antiguo (solo para ascensores).

---

## 🎯 Tienes 2 Opciones

### **Opción 1: Mantener BD Antigua (Solo Ascensores)** ⚠️

**Ventaja:** Ya está funcionando, no necesitas hacer nada.

**Desventaja:** Solo soporta ascensores, no salones/bibliotecas/cafeterías.

**Para usar esta opción:**
```bash
# No hacer nada, ya está corriendo
docker-compose ps  # Verifica que todo esté UP
```

Accede a:
- Frontend: http://localhost:5173
- Backend: http://localhost:5002
- Login: admin@elevatec.com / admin123

---

### **Opción 2: Actualizar a BD Nueva (Multiespacio)** ✅ RECOMENDADO

**Ventaja:** Soporta TODO tipo de espacios (ascensores, salones, bibliotecas, cafeterías, labs, etc.)

**Desventaja:** Necesitas ejecutar script de migración (5 minutos).

---

## 🚀 Cómo Actualizar a la Nueva Base de Datos

### Paso 1: Detener el Proyecto

```bash
cd "/Users/msalazarh/Documents/utec/Congnitive Computing/ProyectoFinal"
docker-compose down
```

### Paso 2: Eliminar el Volumen de la BD (para empezar limpio)

```bash
docker volume rm proyectofinal_postgres_data
```

**⚠️ ADVERTENCIA:** Esto eliminará TODOS los datos actuales. Si tienes datos importantes, haz backup primero.

### Paso 3: Iniciar Solo la Base de Datos

```bash
docker-compose up -d db
```

Espera 10 segundos para que PostgreSQL esté listo:
```bash
sleep 10
```

### Paso 4: Ejecutar el Script de Creación

```bash
docker exec -i elevatec_db psql -U elevadmin -d elevadb < database_schema.sql
```

**Esto creará:**
- ✅ 7 Tablas (users, space_types, devices, spaces, aforo_logs, space_schedules, alerts)
- ✅ 3 Vistas útiles
- ✅ 2 Funciones personalizadas
- ✅ Todos los índices optimizados
- ✅ Datos de ejemplo (10 tipos de espacios, 14 espacios, 5 dispositivos, 100+ logs)

### Paso 5: Verificar que Todo Está Bien

```bash
docker exec -i elevatec_db psql -U elevadmin -d elevadb < test_database.sql
```

Deberías ver:
```
✅ Base de datos funcionando correctamente
usuarios: 2
tipos_espacios: 10
espacios: 14
dispositivos: 5
logs: 100+
```

### Paso 6: Iniciar Todo el Sistema

```bash
docker-compose up -d
```

### Paso 7: Verificar que Todo Funciona

```bash
docker-compose ps
```

Deberías ver:
```
elevatec_db       (healthy)   0.0.0.0:5432->5432/tcp
elevatec_backend  Up          0.0.0.0:5002->5000/tcp
elevatec_frontend Up          0.0.0.0:5173->5173/tcp
```

---

## ✅ Comandos Completos (Copia y Pega)

### Para macOS/Linux:

```bash
# Ir al directorio del proyecto
cd "/Users/msalazarh/Documents/utec/Congnitive Computing/ProyectoFinal"

# Detener todo
docker-compose down

# Eliminar volumen antiguo
docker volume rm proyectofinal_postgres_data

# Iniciar solo BD
docker-compose up -d db

# Esperar 10 segundos
sleep 10

# Ejecutar script de creación
docker exec -i elevatec_db psql -U elevadmin -d elevadb < database_schema.sql

# Verificar (opcional pero recomendado)
docker exec -i elevatec_db psql -U elevadmin -d elevadb < test_database.sql

# Iniciar todo
docker-compose up -d

# Ver logs (opcional)
docker-compose logs -f backend
```

### Para Windows (PowerShell):

```powershell
# Ir al directorio del proyecto
cd "C:\Users\...\ProyectoFinal"  # Ajusta la ruta

# Detener todo
docker-compose down

# Eliminar volumen antiguo
docker volume rm proyectofinal_postgres_data

# Iniciar solo BD
docker-compose up -d db

# Esperar 10 segundos
Start-Sleep -Seconds 10

# Ejecutar script de creación
Get-Content database_schema.sql | docker exec -i elevatec_db psql -U elevadmin -d elevadb

# Verificar
Get-Content test_database.sql | docker exec -i elevatec_db psql -U elevadmin -d elevadb

# Iniciar todo
docker-compose up -d
```

---

## 🔍 Verificación Manual

### Conectarse a PostgreSQL:

```bash
docker exec -it elevatec_db psql -U elevadmin -d elevadb
```

### Ver tablas:

```sql
\dt
```

Deberías ver:
```
 public | aforo_logs       | table | elevadmin
 public | alerts           | table | elevadmin
 public | devices          | table | elevadmin
 public | space_schedules  | table | elevadmin
 public | space_types      | table | elevadmin
 public | spaces           | table | elevadmin
 public | users            | table | elevadmin
```

### Ver datos de ejemplo:

```sql
-- Ver tipos de espacios
SELECT id, name, code FROM space_types;

-- Ver espacios
SELECT id, name, building, floor, capacity FROM spaces;

-- Salir
\q
```

---

## 🛠️ Troubleshooting

### Problema 1: "docker volume rm" dice que está en uso

**Solución:**
```bash
docker-compose down -v  # Detiene y elimina volúmenes
docker volume prune     # Limpia volúmenes huérfanos
```

### Problema 2: El script SQL da error

**Posible causa:** PostgreSQL no está listo

**Solución:**
```bash
# Esperar más tiempo
docker-compose up -d db
sleep 20  # Esperar 20 segundos en lugar de 10

# Ver logs para confirmar que está listo
docker-compose logs db | grep "ready to accept connections"

# Reintentar script
docker exec -i elevatec_db psql -U elevadmin -d elevadb < database_schema.sql
```

### Problema 3: Backend no conecta a la BD

**Verificar que .env tenga la configuración correcta:**

```bash
cat .env | grep DATABASE_URL
```

Debe mostrar:
```
DATABASE_URL=postgresql://elevadmin:elevapass@db:5432/elevadb
```

Si no coincide, edita el `.env`:
```bash
nano .env
# o
code .env
```

Luego reinicia:
```bash
docker-compose restart backend
```

### Problema 4: "relation 'elevators' does not exist"

**Causa:** El backend busca tabla `elevators` pero la nueva BD usa `spaces`

**Solución:** Necesitas actualizar el código del backend (siguiente sección)

---

## 🔄 ¿Necesito Actualizar el Código del Backend?

**Respuesta:** SÍ, si usas la nueva base de datos.

La nueva BD usa:
- `spaces` en lugar de `elevators`
- `space_types` para categorizar espacios
- Estructura más completa

**El código actual del backend busca tabla `elevators`** que ya no existe en la nueva BD.

### Opciones:

**A) Mantener código actual + BD antigua**
- ✅ Funciona sin cambios
- ❌ Solo ascensores

**B) Actualizar código + BD nueva**
- ✅ Soporta todos los tipos de espacios
- ❌ Requiere modificar modelos y rutas

---

## 📊 Comparación: BD Antigua vs Nueva

| Característica | BD Antigua | BD Nueva |
|----------------|-----------|----------|
| **Tablas** | 4 | 7 |
| **Tipos de espacios** | Solo ascensores | 10 tipos |
| **Escalabilidad** | Limitada | Alta |
| **Horarios** | ❌ | ✅ |
| **Alertas** | ❌ | ✅ |
| **Geolocalización** | ❌ | ✅ |
| **Análisis por tipo** | ❌ | ✅ |
| **Vistas SQL** | ❌ | ✅ (3 vistas) |
| **Funciones SQL** | ❌ | ✅ (2 funciones) |

---

## ✅ Mi Recomendación

Para **AHORA** (demo/presentación):
1. **Mantén la BD antigua** (ya funciona)
2. No cambies nada
3. El proyecto funciona perfectamente

Para **DESPUÉS** (mejora futura):
1. Actualiza a la nueva BD
2. Modifica el código del backend
3. Tendrás sistema completo multiespacio

---

## 🚀 Acceso Rápido

**Con la BD actual (antigua):**
```bash
# Ver si está corriendo
docker-compose ps

# Si no está corriendo
docker-compose up -d

# Acceder
open http://localhost:5173
# Login: admin@elevatec.com / admin123
```

**Backend API:**
```bash
# Probar endpoint
curl http://localhost:5002/api/elevators
```

---

## 📝 Resumen

### ¿Está corriendo la BD? ✅ **SÍ**
```
elevatec_db - postgres:15 - (healthy) - Puerto 5432
```

### ¿Tiene datos? ✅ **SÍ** (estructura antigua)
```
- users (2 usuarios)
- devices (0-5 dispositivos)
- elevators (0-10 ascensores)
- aforo_logs (registros históricos)
```

### ¿Funciona el sistema? ✅ **SÍ**
```
✅ Frontend en http://localhost:5173
✅ Backend en http://localhost:5002
✅ Base de datos PostgreSQL lista
```

### ¿Necesito hacer algo? ⚠️ **DEPENDE**
- **Para usar ahora:** ❌ No, ya funciona
- **Para mejorarlo después:** ✅ Sí, ejecuta migración

---

## 🎯 Próximos Pasos Sugeridos

1. **AHORA:** Usa el sistema como está
   ```bash
   docker-compose up -d
   open http://localhost:5173
   ```

2. **DESPUÉS DE LA DEMO:** Actualiza a nueva BD
   ```bash
   ./migrate_to_new_database.sh  # Script que puedo crear
   ```

3. **MUCHO DESPUÉS:** Actualiza código backend para soportar multiespacio

---

¿Quieres que te ayude a:
1. ✅ Mantener como está y solo usar (FÁCIL)
2. 🔄 Migrar a nueva BD ahora (5 minutos)
3. 🚀 Migrar BD + actualizar código (1 hora)

Dime qué prefieres y te ayudo paso a paso! 🎯
