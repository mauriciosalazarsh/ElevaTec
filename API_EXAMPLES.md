# ElevaTec API - Ejemplos de Uso

## Índice
1. [Autenticación](#autenticación)
2. [Ascensores](#ascensores)
3. [Dispositivos](#dispositivos)
4. [Datos ESP32-CAM](#datos-esp32-cam)
5. [Métricas](#métricas)
6. [Códigos de Error](#códigos-de-error)

---

## Autenticación

### Login

**Endpoint:** `POST /api/login`

**Request:**
```bash
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@elevatec.com",
    "password": "admin123"
  }'
```

**Response (200 OK):**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "name": "Administrator",
    "email": "admin@elevatec.com",
    "role": "admin",
    "created_at": "2025-10-28T10:00:00"
  }
}
```

**Uso del Token:**
```bash
TOKEN="eyJ0eXAiOiJKV1QiLCJhbGc..."

curl -X GET http://localhost:5000/api/elevators \
  -H "Authorization: Bearer $TOKEN"
```

### Registrar Usuario (Solo Admin)

**Endpoint:** `POST /api/register`

**Request:**
```bash
curl -X POST http://localhost:5000/api/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@test.com",
    "password": "password123",
    "role": "client"
  }'
```

**Response (201 Created):**
```json
{
  "message": "User created successfully",
  "user": {
    "id": 2,
    "name": "Juan Pérez",
    "email": "juan@test.com",
    "role": "client",
    "created_at": "2025-10-28T12:30:00"
  }
}
```

### Obtener Usuario Actual

**Endpoint:** `GET /api/me`

**Request:**
```bash
curl -X GET http://localhost:5000/api/me \
  -H "Authorization: Bearer $TOKEN"
```

**Response (200 OK):**
```json
{
  "user": {
    "id": 1,
    "name": "Administrator",
    "email": "admin@elevatec.com",
    "role": "admin",
    "created_at": "2025-10-28T10:00:00"
  }
}
```

---

## Ascensores

### Listar Ascensores

**Endpoint:** `GET /api/elevators`

**Request:**
```bash
curl -X GET http://localhost:5000/api/elevators \
  -H "Authorization: Bearer $TOKEN"
```

**Response (200 OK):**
```json
{
  "elevators": [
    {
      "id": 1,
      "name": "Ascensor Piso 1",
      "floor": 1,
      "capacity": 10,
      "current_people": 3,
      "device_id": "ESP32CAM-01",
      "aforo_status": "bajo",
      "created_at": "2025-10-28T10:00:00",
      "updated_at": "2025-10-28T15:30:00"
    },
    {
      "id": 2,
      "name": "Ascensor Piso 2",
      "floor": 2,
      "capacity": 8,
      "current_people": 6,
      "device_id": "ESP32CAM-02",
      "aforo_status": "medio",
      "created_at": "2025-10-28T10:00:00",
      "updated_at": "2025-10-28T15:31:00"
    }
  ]
}
```

### Obtener Ascensor por ID

**Endpoint:** `GET /api/elevators/<id>`

**Request:**
```bash
curl -X GET http://localhost:5000/api/elevators/1 \
  -H "Authorization: Bearer $TOKEN"
```

**Response (200 OK):**
```json
{
  "elevator": {
    "id": 1,
    "name": "Ascensor Piso 1",
    "floor": 1,
    "capacity": 10,
    "current_people": 3,
    "device_id": "ESP32CAM-01",
    "aforo_status": "bajo",
    "created_at": "2025-10-28T10:00:00",
    "updated_at": "2025-10-28T15:30:00"
  }
}
```

### Crear Ascensor (Admin)

**Endpoint:** `POST /api/elevators`

**Request:**
```bash
curl -X POST http://localhost:5000/api/elevators \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Ascensor Principal",
    "floor": 5,
    "capacity": 12,
    "device_id": "ESP32CAM-05"
  }'
```

**Response (201 Created):**
```json
{
  "message": "Elevator created successfully",
  "elevator": {
    "id": 5,
    "name": "Ascensor Principal",
    "floor": 5,
    "capacity": 12,
    "current_people": 0,
    "device_id": "ESP32CAM-05",
    "aforo_status": "bajo",
    "created_at": "2025-10-28T16:00:00",
    "updated_at": "2025-10-28T16:00:00"
  }
}
```

### Actualizar Ascensor (Admin)

**Endpoint:** `PUT /api/elevators/<id>`

**Request:**
```bash
curl -X PUT http://localhost:5000/api/elevators/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "capacity": 12,
    "current_people": 5
  }'
```

**Response (200 OK):**
```json
{
  "message": "Elevator updated successfully",
  "elevator": {
    "id": 1,
    "name": "Ascensor Piso 1",
    "floor": 1,
    "capacity": 12,
    "current_people": 5,
    "device_id": "ESP32CAM-01",
    "aforo_status": "bajo",
    "created_at": "2025-10-28T10:00:00",
    "updated_at": "2025-10-28T16:15:00"
  }
}
```

### Eliminar Ascensor (Admin)

**Endpoint:** `DELETE /api/elevators/<id>`

**Request:**
```bash
curl -X DELETE http://localhost:5000/api/elevators/5 \
  -H "Authorization: Bearer $TOKEN"
```

**Response (200 OK):**
```json
{
  "message": "Elevator deleted successfully"
}
```

---

## Dispositivos

### Listar Dispositivos (Admin)

**Endpoint:** `GET /api/devices`

**Request:**
```bash
curl -X GET http://localhost:5000/api/devices \
  -H "Authorization: Bearer $TOKEN"
```

**Response (200 OK):**
```json
{
  "devices": [
    {
      "id": 1,
      "device_id": "ESP32CAM-01",
      "floor": 1,
      "ip_address": "192.168.1.101",
      "last_seen": "2025-10-28T15:30:00",
      "status": "online",
      "created_at": "2025-10-28T10:00:00"
    },
    {
      "id": 2,
      "device_id": "ESP32CAM-02",
      "floor": 2,
      "ip_address": "192.168.1.102",
      "last_seen": "2025-10-28T15:31:00",
      "status": "online",
      "created_at": "2025-10-28T10:00:00"
    }
  ]
}
```

### Crear Dispositivo (Admin)

**Endpoint:** `POST /api/devices`

**Request:**
```bash
curl -X POST http://localhost:5000/api/devices \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "device_id": "ESP32CAM-06",
    "floor": 6,
    "ip_address": "192.168.1.106"
  }'
```

**Response (201 Created):**
```json
{
  "message": "Device created successfully",
  "device": {
    "id": 6,
    "device_id": "ESP32CAM-06",
    "floor": 6,
    "ip_address": "192.168.1.106",
    "last_seen": null,
    "status": "offline",
    "created_at": "2025-10-28T16:30:00"
  }
}
```

### Actualizar Dispositivo (Admin)

**Endpoint:** `PUT /api/devices/<id>`

**Request:**
```bash
curl -X PUT http://localhost:5000/api/devices/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "ip_address": "192.168.1.150",
    "status": "online"
  }'
```

**Response (200 OK):**
```json
{
  "message": "Device updated successfully",
  "device": {
    "id": 1,
    "device_id": "ESP32CAM-01",
    "floor": 1,
    "ip_address": "192.168.1.150",
    "last_seen": "2025-10-28T15:30:00",
    "status": "online",
    "created_at": "2025-10-28T10:00:00"
  }
}
```

### Eliminar Dispositivo (Admin)

**Endpoint:** `DELETE /api/devices/<id>`

**Request:**
```bash
curl -X DELETE http://localhost:5000/api/devices/6 \
  -H "Authorization: Bearer $TOKEN"
```

**Response (200 OK):**
```json
{
  "message": "Device deleted successfully"
}
```

---

## Datos ESP32-CAM

### Enviar Datos (Sin autenticación)

**Endpoint:** `POST /api/data`

**Request:**
```bash
curl -X POST http://localhost:5000/api/data \
  -H "Content-Type: application/json" \
  -d '{
    "device_id": "ESP32CAM-01",
    "floor": 1,
    "people_count": 7,
    "capacity": 10,
    "timestamp": "2025-10-28T18:00:00Z"
  }'
```

**Response (200 OK):**
```json
{
  "message": "Data received successfully",
  "device_id": "ESP32CAM-01",
  "elevator": {
    "id": 1,
    "name": "Ascensor Piso 1",
    "floor": 1,
    "capacity": 10,
    "current_people": 7,
    "device_id": "ESP32CAM-01",
    "aforo_status": "medio",
    "created_at": "2025-10-28T10:00:00",
    "updated_at": "2025-10-28T18:00:00"
  },
  "aforo_status": "medio"
}
```

**Comportamiento:**
- Si el dispositivo no existe, se crea automáticamente
- Si el ascensor no existe, se crea automáticamente
- Se actualiza el `current_people` del ascensor
- Se guarda un log en `aforo_logs`
- Se actualiza `last_seen` y `status` del dispositivo

### Ejemplo en Arduino/ESP32

```cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

const char* serverUrl = "http://192.168.1.100:5000/api/data";

void sendData(int peopleCount) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");

    StaticJsonDocument<256> doc;
    doc["device_id"] = "ESP32CAM-01";
    doc["floor"] = 1;
    doc["people_count"] = peopleCount;
    doc["capacity"] = 10;
    doc["timestamp"] = "2025-10-28T18:00:00Z";

    String jsonString;
    serializeJson(doc, jsonString);

    int httpCode = http.POST(jsonString);

    if (httpCode > 0) {
      String response = http.getString();
      Serial.println("Response: " + response);
    } else {
      Serial.println("Error en POST");
    }

    http.end();
  }
}
```

---

## Métricas

### Obtener Métricas Globales (Admin)

**Endpoint:** `GET /api/metrics`

**Request:**
```bash
curl -X GET http://localhost:5000/api/metrics \
  -H "Authorization: Bearer $TOKEN"
```

**Response (200 OK):**
```json
{
  "total_elevators": 5,
  "total_devices": 5,
  "online_devices": 4,
  "avg_aforo_percentage": 42.5,
  "aforo_distribution": {
    "bajo": 3,
    "medio": 1,
    "alto": 1
  },
  "recent_logs_24h": 487,
  "peak_hours": [
    {"hour": 8, "avg_people": 7.2},
    {"hour": 9, "avg_people": 8.5},
    {"hour": 12, "avg_people": 6.8},
    {"hour": 18, "avg_people": 7.9}
  ],
  "daily_trend": [
    {
      "date": "2025-10-22",
      "avg_people": 5.3,
      "max_people": 9
    },
    {
      "date": "2025-10-23",
      "avg_people": 6.1,
      "max_people": 10
    },
    {
      "date": "2025-10-24",
      "avg_people": 4.8,
      "max_people": 8
    }
  ]
}
```

---

## Códigos de Error

### 400 Bad Request
**Causa:** Datos faltantes o inválidos

```json
{
  "error": "Email and password required"
}
```

### 401 Unauthorized
**Causa:** Credenciales inválidas o token expirado

```json
{
  "error": "Invalid credentials"
}
```

### 403 Forbidden
**Causa:** Usuario sin permisos suficientes

```json
{
  "error": "Unauthorized"
}
```

### 404 Not Found
**Causa:** Recurso no encontrado

```json
{
  "error": "Elevator not found"
}
```

### 500 Internal Server Error
**Causa:** Error del servidor

```json
{
  "error": "Database connection failed"
}
```

---

## Headers Requeridos

### Todas las peticiones (excepto /api/data)
```
Content-Type: application/json
```

### Peticiones autenticadas
```
Content-Type: application/json
Authorization: Bearer <token>
```

---

## Ejemplos de Integración

### Python (Requests)

```python
import requests

# Login
response = requests.post('http://localhost:5000/api/login', json={
    'email': 'admin@elevatec.com',
    'password': 'admin123'
})
token = response.json()['access_token']

# Obtener ascensores
headers = {'Authorization': f'Bearer {token}'}
elevators = requests.get('http://localhost:5000/api/elevators', headers=headers)
print(elevators.json())

# Enviar datos (ESP32)
data = {
    'device_id': 'ESP32CAM-01',
    'floor': 1,
    'people_count': 5,
    'capacity': 10
}
requests.post('http://localhost:5000/api/data', json=data)
```

### JavaScript (Fetch)

```javascript
// Login
const login = async () => {
  const response = await fetch('http://localhost:5000/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@elevatec.com',
      password: 'admin123'
    })
  });
  const data = await response.json();
  return data.access_token;
};

// Obtener ascensores
const getElevators = async (token) => {
  const response = await fetch('http://localhost:5000/api/elevators', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return await response.json();
};

// Uso
const token = await login();
const elevators = await getElevators(token);
console.log(elevators);
```

---

## Testing con Postman

1. Importar colección:
   - Crear nueva colección "ElevaTec API"
   - Agregar variable `baseUrl` = `http://localhost:5000/api`
   - Agregar variable `token` (se actualizará después del login)

2. Request de Login:
   - POST `{{baseUrl}}/login`
   - Body (JSON):
     ```json
     {
       "email": "admin@elevatec.com",
       "password": "admin123"
     }
     ```
   - Tests (JavaScript):
     ```javascript
     pm.environment.set("token", pm.response.json().access_token);
     ```

3. Request autenticado:
   - GET `{{baseUrl}}/elevators`
   - Headers: `Authorization: Bearer {{token}}`

---

Documentación actualizada: 28/10/2025
