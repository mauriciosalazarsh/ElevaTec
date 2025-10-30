# 📱 Simulador de Cámaras ESP32-CAM

## 🎯 ¿Qué es esto?

Un simulador que **actúa como si fueran 12 cámaras ESP32-CAM reales** enviando datos de aforo al sistema ElevaTec.

## 🚀 Funcionamiento

El simulador:
- ✅ Simula **12 cámaras ESP32** diferentes
- ✅ Envía datos cada **5 segundos** (configurable)
- ✅ Genera conteos **realistas** de personas
- ✅ Simula **variaciones graduales** (personas que entran/salen)
- ✅ Respeta **horas pico** (más gente entre 8-10am, 12-2pm, 5-7pm)
- ✅ Muestra estado en **tiempo real** con colores

## 📱 Cámaras Simuladas

### Ascensores (2 cámaras)
```
ESP32CAM-001 → Ascensor Torre A    (Capacidad: 10)
ESP32CAM-002 → Ascensor Torre B    (Capacidad: 10)
```

### Salones (3 cámaras)
```
ESP32CAM-101 → Salón A-301 (Piso 3, Capacidad: 45)
ESP32CAM-102 → Salón A-302 (Piso 3, Capacidad: 45)
ESP32CAM-103 → Salón B-205 (Piso 2, Capacidad: 40)
```

### Bibliotecas (2 cámaras)
```
ESP32CAM-201 → Biblioteca Central        (Piso 1, Capacidad: 80)
ESP32CAM-202 → Biblioteca Especializada  (Piso 2, Capacidad: 30)
```

### Cafeterías (2 cámaras)
```
ESP32CAM-301 → Cafetería Principal   (Piso 1, Capacidad: 120)
ESP32CAM-302 → Cafetería Secundaria  (Piso 1, Capacidad: 60)
```

### Laboratorios (2 cámaras)
```
ESP32CAM-401 → Lab de Física   (Piso 2, Capacidad: 25)
ESP32CAM-402 → Lab de Química  (Piso 2, Capacidad: 25)
```

### Gimnasio (1 cámara)
```
ESP32CAM-501 → Gimnasio  (Piso 1, Capacidad: 40)
```

**Total: 12 cámaras simuladas**

---

## 🎮 Uso Básico

### Opción 1: Con Docker Compose (Recomendado)

El simulador ya está incluido en el `docker-compose.yml`:

```bash
# Iniciar todo (incluye simulador)
docker-compose up -d

# Ver logs del simulador en tiempo real
docker-compose logs -f simulator
```

Verás algo como:
```
🟢 ESP32CAM-101     |  23/ 45 personas | BAJO   | Cámara Salón A-301
🟡 ESP32CAM-201     |  67/ 80 personas | MEDIO  | Cámara Biblioteca Central
🔴 ESP32CAM-301     |  98/120 personas | ALTO   | Cámara Cafetería Principal
```

### Opción 2: Ejecutar Manualmente (Sin Docker)

```bash
# Instalar dependencias
pip install requests

# Ejecutar simulador
python esp32_camera_simulator.py
```

---

## ⚙️ Configuración

### Variables de Entorno

Puedes cambiar el comportamiento del simulador:

```yaml
# En docker-compose.yml
simulator:
  environment:
    BACKEND_URL: http://backend:5000      # URL del backend
    INTERVAL_SECONDS: 5                   # Segundos entre envíos (default: 5)
```

**Opciones:**
- `INTERVAL_SECONDS: 2` → Envía datos cada 2 segundos (muy rápido)
- `INTERVAL_SECONDS: 10` → Envía datos cada 10 segundos (más lento)
- `INTERVAL_SECONDS: 30` → Envía datos cada 30 segundos (muy lento)

### Modificar en docker-compose.yml:

```bash
# 1. Editar docker-compose.yml
nano docker-compose.yml

# 2. Cambiar INTERVAL_SECONDS
simulator:
  environment:
    INTERVAL_SECONDS: 10  # ← Cambiar aquí

# 3. Reiniciar simulador
docker-compose restart simulator
```

---

## 📊 Características del Simulador

### 1. Variación Realista

El simulador **NO** genera números aleatorios. En su lugar:

- ✅ Los números cambian **gradualmente**
- ✅ Simula personas que **entran y salen**
- ✅ No hay saltos bruscos (ej: de 10 a 45 personas)
- ✅ Respeta la capacidad máxima

**Ejemplo:**
```
10:00 → 23 personas
10:05 → 25 personas (+2)
10:10 → 27 personas (+2)
10:15 → 24 personas (-3)
```

### 2. Horas Pico

El simulador detecta la hora actual y ajusta el comportamiento:

**Horas Pico** (8-10am, 12-2pm, 5-7pm):
- 60% probabilidad de **aumentar** personas
- 20% probabilidad de mantener igual
- 20% probabilidad de disminuir

**Horas Normales**:
- 33% probabilidad de aumentar
- 33% probabilidad de mantener
- 33% probabilidad de disminuir

### 3. Indicadores Visuales

El simulador muestra el estado con colores:

```
🟢 BAJO   → < 50% ocupación (verde)
🟡 MEDIO  → 50-80% ocupación (amarillo)
🔴 ALTO   → > 80% ocupación (rojo)
```

---

## 🎯 Ejemplo de Output

```bash
docker-compose logs -f simulator
```

**Output:**
```
================================================================================
  ESP32-CAM SIMULATOR - ElevaTec
================================================================================
  Backend: http://backend:5000
  Cámaras: 12
  Intervalo: 5 segundos
================================================================================

✅ Backend disponible!

[2025-10-29 22:30:15] Iteración #1
--------------------------------------------------------------------------------
🟢 ESP32CAM-001     |   3/ 10 personas | BAJO   | Cámara Ascensor Torre A
🟢 ESP32CAM-002     |   5/ 10 personas | BAJO   | Cámara Ascensor Torre B
🟢 ESP32CAM-101     |  23/ 45 personas | BAJO   | Cámara Salón A-301
🟢 ESP32CAM-102     |  18/ 45 personas | BAJO   | Cámara Salón A-302
🟡 ESP32CAM-103     |  32/ 40 personas | MEDIO  | Cámara Salón B-205
🟡 ESP32CAM-201     |  67/ 80 personas | MEDIO  | Cámara Biblioteca Central
🟢 ESP32CAM-202     |  12/ 30 personas | BAJO   | Cámara Biblioteca Especializada
🔴 ESP32CAM-301     |  98/120 personas | ALTO   | Cámara Cafetería Principal
🟡 ESP32CAM-302     |  45/ 60 personas | MEDIO  | Cámara Cafetería Secundaria
🟢 ESP32CAM-401     |  15/ 25 personas | BAJO   | Cámara Lab de Física
🟡 ESP32CAM-402     |  18/ 25 personas | MEDIO  | Cámara Lab de Química
🟡 ESP32CAM-501     |  28/ 40 personas | MEDIO  | Cámara Gimnasio

--------------------------------------------------------------------------------
  📊 RESUMEN: 364/500 personas (72.8% ocupación global)
--------------------------------------------------------------------------------

✅ 12/12 cámaras enviaron datos correctamente
⏳ Próxima actualización en 5 segundos...
```

---

## 🔧 Comandos Útiles

### Ver logs del simulador
```bash
docker-compose logs -f simulator
```

### Detener el simulador
```bash
docker-compose stop simulator
```

### Iniciar solo el simulador
```bash
docker-compose start simulator
```

### Reiniciar el simulador
```bash
docker-compose restart simulator
```

### Ver estado del simulador
```bash
docker-compose ps simulator
```

### Eliminar y recrear el simulador
```bash
docker-compose stop simulator
docker-compose rm -f simulator
docker-compose up -d --build simulator
```

---

## 🎨 Personalizar Cámaras

Puedes editar el archivo `esp32_camera_simulator.py` para:

### Agregar más cámaras:

```python
CAMERAS = [
    # ... cámaras existentes ...

    # Nueva cámara
    {
        'device_id': 'ESP32CAM-999',
        'name': 'Cámara Mi Nuevo Espacio',
        'floor': 5,
        'capacity': 50,
        'min_people': 10,
        'max_people': 48,
        'variation': 5
    },
]
```

### Cambiar comportamiento de una cámara:

```python
{
    'device_id': 'ESP32CAM-301',
    'name': 'Cámara Cafetería Principal',
    'floor': 1,
    'capacity': 120,
    'min_people': 50,      # ← Siempre tiene mínimo 50 personas
    'max_people': 118,     # ← Máximo 118 (casi siempre llena)
    'variation': 20        # ← Cambios más drásticos
},
```

**Después de editar:**
```bash
docker-compose restart simulator
```

---

## 🐛 Troubleshooting

### Problema 1: Simulador no envía datos

**Síntomas:**
```
⚠️  ESP32CAM-001     | Backend no disponible (esperando...)
```

**Solución:**
```bash
# Verificar que backend esté corriendo
docker-compose ps backend

# Ver logs del backend
docker-compose logs backend

# Reiniciar backend
docker-compose restart backend

# Esperar 10 segundos
sleep 10

# Reiniciar simulador
docker-compose restart simulator
```

### Problema 2: Error "Connection refused"

**Causa:** Backend no está listo o no está en la misma red

**Solución:**
```bash
# Verificar que estén en la misma red
docker network inspect proyectofinal_elevatec_network

# Reiniciar todo
docker-compose down
docker-compose up -d
```

### Problema 3: Simulador se detiene solo

**Síntomas:**
```
docker-compose ps simulator
# Estado: Exited
```

**Solución:**
```bash
# Ver logs para identificar el error
docker-compose logs simulator

# Reconstruir imagen
docker-compose up -d --build simulator
```

### Problema 4: Quiero cambiar el intervalo sin editar archivo

**Solución:**
```bash
# Detener simulador
docker-compose stop simulator

# Ejecutar con nuevo intervalo
docker-compose run -e INTERVAL_SECONDS=10 simulator
```

---

## 📈 Verificar que Funciona

### 1. Ver logs del simulador
```bash
docker-compose logs -f simulator
```

Deberías ver datos enviándose cada 5 segundos.

### 2. Verificar en el frontend
```bash
open http://localhost:5173
```

Deberías ver los espacios actualizándose automáticamente.

### 3. Verificar con curl
```bash
curl http://localhost:5002/api/elevators
```

Deberías ver JSON con los ascensores y su ocupación actual.

### 4. Ver en la base de datos
```bash
docker exec -it elevatec_db psql -U elevadmin -d elevadb -c "SELECT COUNT(*) FROM aforo_logs;"
```

El número debería aumentar cada 5 segundos × 12 cámaras = +12 logs cada 5 segundos.

---

## 🎯 Casos de Uso

### Caso 1: Demo rápida
```bash
# Intervalo de 2 segundos para ver cambios rápidos
docker-compose stop simulator
docker-compose run -e INTERVAL_SECONDS=2 simulator
```

### Caso 2: Simulación realista
```bash
# Intervalo de 30 segundos (más realista)
docker-compose stop simulator
docker-compose run -e INTERVAL_SECONDS=30 simulator
```

### Caso 3: Testing de carga
```bash
# Intervalo de 1 segundo (máxima carga)
docker-compose stop simulator
docker-compose run -e INTERVAL_SECONDS=1 simulator
```

---

## 🎓 Cómo Funciona Internamente

### 1. Inicialización
```python
# Al arrancar, cada cámara obtiene un valor inicial aleatorio
camera_state = {
    'ESP32CAM-001': 5,   # Ascensor con 5 personas
    'ESP32CAM-101': 23,  # Salón con 23 personas
    # ...
}
```

### 2. Generación de Datos
```python
# En cada iteración:
# 1. Lee el valor anterior
current = 23

# 2. Decide tendencia según hora
if hora_pico:
    trend = +1  # Más probable aumentar

# 3. Aplica variación pequeña
variation = random(0, 5)
new_count = current + (trend * variation)  # 23 + 5 = 28

# 4. Respeta límites
new_count = min(max_people, new_count)  # No > 45
```

### 3. Envío al Backend
```python
# Envía POST /api/data
{
    "device_id": "ESP32CAM-101",
    "floor": 3,
    "people_count": 28,
    "capacity": 45,
    "timestamp": "2025-10-29T22:30:15Z"
}
```

### 4. Respuesta del Backend
```python
# Backend responde:
{
    "message": "Data received successfully",
    "aforo_status": "bajo"  # porque 28/45 = 62% → medio
}
```

---

## 🚀 Próximos Pasos

Después de tener el simulador corriendo:

1. ✅ Abre el frontend: http://localhost:5173
2. ✅ Login: admin@elevatec.com / admin123
3. ✅ Verás los espacios actualizándose automáticamente cada 5 segundos
4. ✅ Los números cambian gradualmente (como en la realidad)

---

## 📝 Resumen

**¿Qué hace?**
- Simula 12 cámaras ESP32-CAM enviando datos reales

**¿Cada cuánto envía?**
- Cada 5 segundos (configurable)

**¿Cómo iniciar?**
```bash
docker-compose up -d
```

**¿Cómo ver logs?**
```bash
docker-compose logs -f simulator
```

**¿Cómo detener?**
```bash
docker-compose stop simulator
```

---

¡Listo! 🎉 Ahora tienes un sistema completo con datos simulados en tiempo real.
