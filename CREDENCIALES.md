# 🔐 Credenciales de Acceso - ElevaTec

## 👨‍💼 Cuenta Administrador

**Email:** `admin@elevatec.com`
**Password:** `admin123`
**Rol:** `admin`

### Permisos del Administrador:
- ✅ Ver Dashboard con métricas completas
- ✅ Gestionar dispositivos ESP32-CAM (CRUD)
- ✅ Ver lista de todos los ascensores/espacios
- ✅ Acceder a métricas avanzadas
- ✅ Crear nuevos usuarios (próximamente)
- ✅ Ver vista de cliente

---

## 👤 Cuenta Cliente

**Email:** `cliente@elevatec.com`
**Password:** `cliente123`
**Rol:** `client`

### Permisos del Cliente:
- ✅ Ver lista de espacios disponibles
- ✅ Ver ocupación en tiempo real
- ✅ Recibir recomendaciones automáticas
- ✅ Ver estado de cada espacio (bajo/medio/alto)
- ❌ NO puede acceder al dashboard administrativo
- ❌ NO puede gestionar dispositivos
- ❌ NO puede ver métricas avanzadas

---

## 🎯 Cómo Funciona el Sistema de Roles

### Al hacer login:

#### Si eres ADMIN:
1. Eres redirigido a: `/admin/dashboard`
2. Puedes navegar entre:
   - Dashboard (métricas y gráficas)
   - Dispositivos (gestión de ESP32-CAM)
   - Vista Cliente (ver cómo se ve para usuarios)

#### Si eres CLIENTE:
1. Eres redirigido a: `/user/home`
2. Solo puedes ver:
   - Lista de espacios con ocupación actual
   - Recomendaciones en tiempo real
   - Cards de cada espacio con su estado

---

## 🔒 Protección de Rutas

El sistema tiene protección automática por roles:

### Rutas Públicas:
- `/login` - Página de inicio de sesión

### Rutas Protegidas (requieren autenticación):
- `/user/home` - Accesible por TODOS los usuarios autenticados

### Rutas Solo Administrador:
- `/admin/dashboard` - Solo admin
- `/admin/devices` - Solo admin

**Si un cliente intenta acceder a rutas de admin:**
- Es redirigido automáticamente a `/user/home`

**Si alguien no autenticado intenta acceder:**
- Es redirigido automáticamente a `/login`

---

## 🧪 Pruebas de Roles

### Prueba 1: Login como Admin
```bash
# En el navegador (modo incógnito)
http://localhost:5173

# Login:
Email: admin@elevatec.com
Password: admin123

# Deberías ver:
✅ Navbar con: Dashboard, Dispositivos, Vista Cliente
✅ Redirect a /admin/dashboard
✅ Dashboard completo con métricas
```

### Prueba 2: Login como Cliente
```bash
# En el navegador (modo incógnito)
http://localhost:5173

# Login:
Email: cliente@elevatec.com
Password: cliente123

# Deberías ver:
✅ Navbar solo con: Inicio
✅ Redirect a /user/home
✅ Vista de espacios con ocupación
❌ NO hay botones de Dashboard ni Dispositivos
```

### Prueba 3: Intentar acceder a ruta de admin siendo cliente
```bash
# Login como cliente primero
# Luego en la URL escribe manualmente:
http://localhost:5173/admin/dashboard

# Deberías ver:
❌ Redirect automático a /user/home
✅ No puedes acceder a rutas de admin
```

---

## 📝 Crear Nuevos Usuarios

### Opción 1: Via API (como Admin)
```bash
# Primero login como admin y obtener token
curl -X POST http://localhost:5002/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@elevatec.com","password":"admin123"}'

# Usar el token para crear usuario
curl -X POST http://localhost:5002/api/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN_AQUI>" \
  -d '{
    "name": "Nuevo Usuario",
    "email": "nuevo@elevatec.com",
    "password": "password123",
    "role": "client"
  }'
```

### Opción 2: Via Base de Datos
```bash
# Generar hash de password
docker exec elevatec_backend python -c "
from werkzeug.security import generate_password_hash
print(generate_password_hash('tupassword'))
"

# Insertar en la BD
docker exec elevatec_db psql -U elevadmin -d elevadb -c "
INSERT INTO users (name, email, password_hash, role)
VALUES ('Nombre', 'email@ejemplo.com', 'HASH_GENERADO', 'client');
"
```

---

## ⚠️ Importante

1. **Cambiar passwords en producción**: Las contraseñas actuales son solo para desarrollo
2. **Solo admins pueden crear usuarios**: La ruta `/api/register` requiere token de admin
3. **Roles válidos**: Solo `admin` o `client`
4. **Emails únicos**: No puedes tener dos usuarios con el mismo email

---

## ✅ Verificación Rápida

Para verificar que todo funciona:

```bash
# 1. Verificar usuarios en la BD
docker exec elevatec_db psql -U elevadmin -d elevadb -c "SELECT id, name, email, role FROM users;"

# Deberías ver:
#  id |      name       |        email         |  role
# ----+-----------------+----------------------+--------
#   1 | Administrator   | admin@elevatec.com   | admin
#   2 | Usuario Cliente | cliente@elevatec.com | client

# 2. Test login admin
curl -X POST http://localhost:5002/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@elevatec.com","password":"admin123"}'

# 3. Test login cliente
curl -X POST http://localhost:5002/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"cliente@elevatec.com","password":"cliente123"}'
```

---

## 🎉 ¡Todo Listo!

El sistema de roles está completamente funcional:

- ✅ 2 usuarios creados (admin y cliente)
- ✅ Protección de rutas por rol
- ✅ Navbar diferente según rol
- ✅ Redirección automática según permisos
- ✅ Frontend adapta UI según rol del usuario

**Abre http://localhost:5173 y prueba ambas cuentas!** 🚀
