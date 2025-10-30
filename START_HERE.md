# ElevaTec Web App - EMPIEZA AQUÍ

## ¡Bienvenido al proyecto ElevaTec!

Este es tu **punto de partida** para entender y usar el sistema completo de monitoreo de aforo en ascensores.

---

## 🚀 Inicio Rápido (3 Pasos)

Si quieres **ejecutar el proyecto ahora mismo**, sigue estos pasos:

1. Abre tu terminal en esta carpeta
2. Ejecuta:
   ```bash
   docker-compose up --build
   ```
3. Abre tu navegador en: http://localhost:5173
4. Login con: `admin@elevatec.com` / `admin123`

**¿Quieres más detalles?** → Lee `QUICKSTART.md`

---

## 📚 Guía de Documentación

Dependiendo de lo que necesites, lee estos archivos:

### Para empezar a usar el proyecto

| Archivo | Descripción | ¿Cuándo leerlo? |
|---------|-------------|-----------------|
| **QUICKSTART.md** | Inicio rápido en 3 pasos | Quieres ejecutar el proyecto YA |
| **README.md** | Documentación completa | Quieres entender todo el sistema |
| **PROJECT_INFO.md** | Estadísticas y componentes | Quieres ver qué incluye el proyecto |

### Para desarrolladores

| Archivo | Descripción | ¿Cuándo leerlo? |
|---------|-------------|-----------------|
| **API_EXAMPLES.md** | Ejemplos de API con curl | Necesitas integrar con la API |
| **PROYECTO_ESTRUCTURA.md** | Arquitectura detallada | Vas a modificar código |
| **DEPLOYMENT.md** | Guía de deployment | Vas a desplegar en producción |

### Para stakeholders

| Archivo | Descripción | ¿Cuándo leerlo? |
|---------|-------------|-----------------|
| **RESUMEN_EJECUTIVO.md** | Visión general del proyecto | Presentar a clientes/jefes |

---

## 🎯 ¿Qué es ElevaTec?

ElevaTec es una **plataforma web completa** para:
- Monitorear el aforo de ascensores en tiempo real
- Recibir datos desde cámaras ESP32-CAM
- Mostrar métricas y gráficas a administradores
- Dar recomendaciones automáticas a usuarios

**Tecnologías:** Flask + React + PostgreSQL + Docker

---

## 📂 Estructura del Proyecto

```
ProyectoFinal/
│
├── 📖 Documentación (empiezas aquí)
│   ├── START_HERE.md           ⭐ Este archivo
│   ├── QUICKSTART.md            🚀 Inicio rápido
│   ├── README.md                📚 Documentación completa
│   ├── API_EXAMPLES.md          🔌 Ejemplos de API
│   ├── PROYECTO_ESTRUCTURA.md   🏗️ Arquitectura
│   ├── DEPLOYMENT.md            ☁️ Deployment
│   ├── RESUMEN_EJECUTIVO.md     📊 Resumen ejecutivo
│   └── PROJECT_INFO.md          ℹ️ Info del proyecto
│
├── 🔧 Backend (Flask + PostgreSQL)
│   └── backend/
│       ├── app/
│       │   ├── models/          💾 Base de datos
│       │   └── routes/          🛣️ API endpoints
│       └── app.py               🚪 Entry point
│
├── 🎨 Frontend (React + Tailwind)
│   └── frontend/
│       └── src/
│           ├── components/      🧩 Componentes UI
│           ├── pages/           📄 Páginas principales
│           └── context/         🌐 Estado global
│
├── 🐳 DevOps
│   ├── docker-compose.yml       📦 Orquestación
│   ├── .env                     🔐 Variables de entorno
│   └── verify_project.sh        ✅ Verificación
│
└── 🧪 Testing
    └── test_esp32_simulator.py  🤖 Simulador ESP32
```

---

## 🎬 Primeros Pasos Recomendados

### 1️⃣ Ejecuta el proyecto (5 min)

```bash
# Terminal 1: Iniciar servicios
docker-compose up --build

# Terminal 2: Simular datos ESP32
python test_esp32_simulator.py
```

Abre http://localhost:5173 y explora:
- Login como admin
- Ver dashboard con métricas
- Gestionar dispositivos
- Ver ascensores en tiempo real

### 2️⃣ Explora la API (10 min)

Lee `API_EXAMPLES.md` y prueba:

```bash
# Login
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@elevatec.com","password":"admin123"}'

# Ver ascensores
curl http://localhost:5000/api/elevators \
  -H "Authorization: Bearer TU_TOKEN"
```

### 3️⃣ Entiende la arquitectura (15 min)

Lee `PROYECTO_ESTRUCTURA.md` para entender:
- Flujo de datos ESP32 → Backend → Frontend
- Modelos de base de datos
- Componentes React
- Lógica de aforo

### 4️⃣ Modifica y personaliza (30 min)

Edita estos archivos para personalizar:

```javascript
// frontend/tailwind.config.js
// Cambiar colores
colors: {
  primary: '#4CAF50',  // Tu color
  secondary: '#212121',
}
```

```python
# backend/app/models/elevator.py
# Cambiar lógica de aforo
def get_aforo_status(self):
    ratio = self.current_people / self.capacity
    if ratio < 0.5:
        return 'bajo'
    # Personalizar...
```

---

## 🔍 Preguntas Frecuentes

### ¿Cómo funciona el sistema?

```
ESP32-CAM (cámara)
    ↓ Detecta personas
    ↓ POST /api/data
Backend (Flask)
    ↓ Calcula aforo (bajo/medio/alto)
    ↓ Guarda en PostgreSQL
Frontend (React)
    ↓ Muestra con colores (verde/amarillo/rojo)
Usuario final
```

### ¿Qué puedo hacer con el proyecto?

**Como Admin:**
- Ver métricas globales
- Gestionar dispositivos ESP32-CAM
- Ver gráficas de uso
- Exportar datos (próximamente)

**Como Cliente:**
- Ver disponibilidad de ascensores
- Recibir recomendaciones
- Ver nivel de aforo en tiempo real

### ¿Qué necesito para ejecutarlo?

**Opción 1: Docker (Recomendado)**
- Docker Desktop
- 2GB RAM libre
- Puertos 5000, 5173, 5432

**Opción 2: Local**
- Python 3.11+
- Node.js 18+
- PostgreSQL 15+

### ¿Cómo conecto un ESP32-CAM real?

1. Programa tu ESP32 con el código de `API_EXAMPLES.md`
2. Configura la URL del servidor
3. El dispositivo se auto-registra al enviar datos

Ver `DEPLOYMENT.md` sección "Configuración ESP32-CAM" para código completo.

### ¿Cómo despliego en producción?

Lee `DEPLOYMENT.md` para guías detalladas de:
- AWS EC2
- Google Cloud Run
- DigitalOcean
- Heroku

### ¿Dónde están las credenciales?

**Admin por defecto:**
```
Email: admin@elevatec.com
Password: admin123
```

**Base de datos:**
```
User: elevadmin
Password: elevapass
DB: elevadb
```

⚠️ **CAMBIAR EN PRODUCCIÓN**

---

## 🛠️ Comandos Útiles

### Verificar instalación
```bash
./verify_project.sh
```

### Iniciar proyecto
```bash
docker-compose up --build
```

### Ver logs
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Detener proyecto
```bash
docker-compose down
```

### Simular datos
```bash
python test_esp32_simulator.py
```

### Backup de base de datos
```bash
docker exec elevatec_db pg_dump -U elevadmin elevadb > backup.sql
```

---

## 📊 Endpoints Principales

### Públicos
- `POST /api/login` - Login
- `POST /api/data` - Datos desde ESP32

### Autenticados
- `GET /api/elevators` - Lista de ascensores
- `GET /api/metrics` - Métricas (admin)
- `GET /api/devices` - Dispositivos (admin)

Ver `API_EXAMPLES.md` para ejemplos completos.

---

## 🎨 Pantallas del Sistema

### Login
- Email + Password
- Redirección según rol

### Dashboard Admin
- 4 KPIs principales
- 3 gráficas interactivas
- Tabla de ascensores en vivo

### Gestión de Dispositivos
- CRUD completo
- Estado online/offline
- Última conexión

### Vista Cliente
- Lista de ascensores
- Tarjetas color-coded
- Recomendaciones automáticas

---

## 🔐 Roles y Permisos

| Funcionalidad | Admin | Cliente |
|---------------|-------|---------|
| Ver ascensores | ✅ | ✅ |
| Dashboard con métricas | ✅ | ❌ |
| Gestionar dispositivos | ✅ | ❌ |
| Gestionar ascensores | ✅ | ❌ |
| Crear usuarios | ✅ | ❌ |
| Recomendaciones | ✅ | ✅ |

---

## 🐛 Troubleshooting

### El backend no inicia
```bash
# Ver logs
docker-compose logs db

# Esperar a que PostgreSQL esté listo
# Healthcheck automático configurado
```

### El frontend no carga
```bash
# Verificar que backend esté corriendo
curl http://localhost:5000/api/elevators

# Rebuild frontend
docker-compose up --build frontend
```

### No llegan datos del ESP32
1. Verificar WiFi del ESP32
2. Verificar URL del servidor
3. Probar con simulador primero:
   ```bash
   python test_esp32_simulator.py --once
   ```

### Base de datos vacía
El sistema auto-crea:
- Usuario admin
- Estructura de tablas

Los ascensores se crean cuando llegan datos de ESP32.

---

## 📞 Soporte

### Archivos de ayuda incluidos

| Problema | Archivo a consultar |
|----------|-------------------|
| No sé cómo empezar | `QUICKSTART.md` |
| Error en API | `API_EXAMPLES.md` |
| Quiero modificar código | `PROYECTO_ESTRUCTURA.md` |
| Voy a desplegar | `DEPLOYMENT.md` |
| Necesito presentar | `RESUMEN_EJECUTIVO.md` |

### Scripts de ayuda

```bash
# Verificar que todo esté bien
./verify_project.sh

# Simular datos de prueba
python test_esp32_simulator.py
```

---

## 🎯 Próximos Pasos

1. ✅ Ejecuta el proyecto: `docker-compose up --build`
2. ✅ Explora la interfaz: http://localhost:5173
3. ✅ Simula datos: `python test_esp32_simulator.py`
4. ✅ Lee la documentación que necesites
5. ✅ Personaliza según tus necesidades
6. ✅ Despliega en producción cuando estés listo

---

## 🌟 Características Destacadas

- 🚀 **Listo en 5 minutos** con Docker
- 🤖 **Auto-registro** de dispositivos ESP32
- 📊 **Gráficas en tiempo real** con Recharts
- 🎨 **Diseño responsive** con Tailwind
- 🔐 **Autenticación JWT** con roles
- 📱 **Recomendaciones automáticas** inteligentes
- 🐳 **Docker Compose** para deployment fácil
- 📚 **Documentación completa** incluida

---

## 💡 Tips

1. **Primero ejecuta, luego lee:** El proyecto funciona out-of-the-box
2. **Usa el simulador:** No necesitas ESP32 real para probar
3. **Lee solo lo que necesitas:** La documentación está organizada por caso de uso
4. **Verifica el proyecto:** Ejecuta `./verify_project.sh` ante dudas

---

## 📄 Licencia

MIT License - Libre para uso académico y comercial

---

## 🎓 Desarrollado para

**Curso:** Cognitive Computing
**Universidad:** UTEC
**Fecha:** Octubre 2025
**Versión:** 1.0.0

---

**¿Listo para empezar?**

```bash
docker-compose up --build
```

Luego abre http://localhost:5173 y explora!

---

*¿Tienes dudas? Consulta los archivos de documentación arriba.*
*¿Encontraste un bug? Revisa `PROYECTO_ESTRUCTURA.md` para entender el código.*
*¿Vas a producción? Lee `DEPLOYMENT.md` primero.*

**¡Éxito con tu proyecto ElevaTec!** 🚀
