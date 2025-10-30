# ElevaTec - Guía de Deployment

## Opciones de Deployment

1. [Desarrollo Local](#desarrollo-local)
2. [Docker Compose (Producción Local)](#docker-compose-producción-local)
3. [Cloud Deployment](#cloud-deployment)
4. [Configuración ESP32-CAM](#configuración-esp32-cam)

---

## Desarrollo Local

### Backend (Flask)

```bash
# 1. Crear entorno virtual
cd backend
python -m venv venv

# 2. Activar entorno
# En macOS/Linux:
source venv/bin/activate
# En Windows:
venv\Scripts\activate

# 3. Instalar dependencias
pip install -r requirements.txt

# 4. Configurar PostgreSQL local
# Instalar PostgreSQL y crear base de datos
createdb elevadb
createuser elevadmin -P

# 5. Configurar variables de entorno
cp ../.env.example .env
# Editar .env con tu configuración local

# 6. Ejecutar
python app.py
```

Backend corriendo en: http://localhost:5000

### Frontend (React)

```bash
# 1. Instalar Node.js 18+

# 2. Instalar dependencias
cd frontend
npm install

# 3. Configurar variables de entorno
echo "VITE_API_URL=http://localhost:5000" > .env

# 4. Ejecutar
npm run dev
```

Frontend corriendo en: http://localhost:5173

---

## Docker Compose (Producción Local)

### Inicio Rápido

```bash
# 1. Clonar/descargar proyecto
cd ProyectoFinal

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env y cambiar SECRET_KEY y JWT_SECRET_KEY

# 3. Iniciar servicios
docker-compose up --build

# 4. Verificar
# Frontend: http://localhost:5173
# Backend: http://localhost:5000
# PostgreSQL: localhost:5432
```

### Producción

```bash
# 1. Editar docker-compose.yml
# Cambiar FLASK_ENV a production

# 2. Generar secretos seguros
python -c "import secrets; print(secrets.token_hex(32))"
# Copiar y pegar en .env para SECRET_KEY y JWT_SECRET_KEY

# 3. Configurar dominio
# En frontend/.env:
VITE_API_URL=https://api.tudominio.com

# 4. Iniciar servicios
docker-compose up -d

# 5. Configurar nginx/traefik para HTTPS
```

### Comandos Útiles

```bash
# Ver logs en tiempo real
docker-compose logs -f

# Reiniciar un servicio
docker-compose restart backend

# Detener todo
docker-compose down

# Eliminar volúmenes (¡cuidado, borra la DB!)
docker-compose down -v

# Backup de base de datos
docker exec elevatec_db pg_dump -U elevadmin elevadb > backup_$(date +%Y%m%d).sql

# Restaurar backup
docker exec -i elevatec_db psql -U elevadmin -d elevadb < backup_20251028.sql
```

---

## Cloud Deployment

### AWS (Amazon Web Services)

#### Opción 1: EC2 + Docker Compose

```bash
# 1. Lanzar instancia EC2
# - AMI: Ubuntu 22.04
# - Tipo: t3.medium (2 vCPU, 4 GB RAM)
# - Security Groups: 80, 443, 5000, 5173, 22

# 2. Conectar a EC2
ssh -i tu-key.pem ubuntu@tu-ip-publica

# 3. Instalar Docker
sudo apt update
sudo apt install -y docker.io docker-compose git
sudo usermod -aG docker ubuntu
# Cerrar sesión y reconectar

# 4. Clonar proyecto
git clone tu-repositorio.git
cd ProyectoFinal

# 5. Configurar y ejecutar
cp .env.example .env
nano .env  # Editar secretos
docker-compose up -d

# 6. Configurar nginx como reverse proxy
sudo apt install nginx
# Configurar /etc/nginx/sites-available/elevatec
```

**Configuración nginx:**
```nginx
server {
    listen 80;
    server_name tudominio.com;

    location / {
        proxy_pass http://localhost:5173;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### Opción 2: ECS + RDS

```yaml
# Usar Amazon ECS para containers
# Usar Amazon RDS para PostgreSQL
# Usar CloudFront para frontend
# Usar Application Load Balancer

# Beneficios:
# - Auto-scaling
# - Backups automáticos
# - Alta disponibilidad
# - SSL/TLS gestionado
```

### Google Cloud Platform

```bash
# 1. Usar Cloud Run para containers
gcloud run deploy elevatec-backend \
  --source ./backend \
  --platform managed \
  --region us-central1

gcloud run deploy elevatec-frontend \
  --source ./frontend \
  --platform managed \
  --region us-central1

# 2. Usar Cloud SQL para PostgreSQL
gcloud sql instances create elevatec-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-central1
```

### DigitalOcean

```bash
# 1. Usar App Platform
# - Conectar repositorio GitHub
# - Auto-deploy en cada push
# - SSL automático

# 2. O usar Droplet + Docker Compose
# Similar a AWS EC2
```

### Heroku

```bash
# 1. Instalar Heroku CLI
brew install heroku/brew/heroku

# 2. Login
heroku login

# 3. Crear app
heroku create elevatec-app

# 4. Agregar PostgreSQL
heroku addons:create heroku-postgresql:mini

# 5. Deploy
git push heroku main

# 6. Configurar variables
heroku config:set SECRET_KEY=tu-secret-key
heroku config:set JWT_SECRET_KEY=tu-jwt-key
```

---

## Configuración ESP32-CAM

### Código Arduino

```cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "esp_camera.h"

// WiFi
const char* ssid = "TU_WIFI";
const char* password = "TU_PASSWORD";

// Server
const char* serverUrl = "http://TU_IP:5000/api/data";

// Device config
const char* deviceId = "ESP32CAM-01";
const int floor = 1;
const int capacity = 10;

void setup() {
  Serial.begin(115200);

  // Conectar WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi conectado!");

  // Configurar cámara
  camera_config_t config;
  config.ledc_channel = LEDC_CHANNEL_0;
  config.ledc_timer = LEDC_TIMER_0;
  config.pin_d0 = Y2_GPIO_NUM;
  config.pin_d1 = Y3_GPIO_NUM;
  config.pin_d2 = Y4_GPIO_NUM;
  config.pin_d3 = Y5_GPIO_NUM;
  config.pin_d4 = Y6_GPIO_NUM;
  config.pin_d5 = Y7_GPIO_NUM;
  config.pin_d6 = Y8_GPIO_NUM;
  config.pin_d7 = Y9_GPIO_NUM;
  config.pin_xclk = XCLK_GPIO_NUM;
  config.pin_pclk = PCLK_GPIO_NUM;
  config.pin_vsync = VSYNC_GPIO_NUM;
  config.pin_href = HREF_GPIO_NUM;
  config.pin_sscb_sda = SIOD_GPIO_NUM;
  config.pin_sscb_scl = SIOC_GPIO_NUM;
  config.pin_pwdn = PWDN_GPIO_NUM;
  config.pin_reset = RESET_GPIO_NUM;
  config.xclk_freq_hz = 20000000;
  config.pixel_format = PIXFORMAT_JPEG;

  esp_camera_init(&config);
}

void loop() {
  // 1. Capturar imagen
  camera_fb_t * fb = esp_camera_fb_get();

  // 2. Procesar imagen y contar personas
  int peopleCount = detectPeople(fb);  // Tu algoritmo de detección

  // 3. Liberar buffer
  esp_camera_fb_return(fb);

  // 4. Enviar datos al servidor
  sendData(peopleCount);

  // 5. Esperar 5 segundos
  delay(5000);
}

void sendData(int peopleCount) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");

    StaticJsonDocument<256> doc;
    doc["device_id"] = deviceId;
    doc["floor"] = floor;
    doc["people_count"] = peopleCount;
    doc["capacity"] = capacity;
    doc["timestamp"] = getTimestamp();  // ISO 8601

    String json;
    serializeJson(doc, json);

    int httpCode = http.POST(json);

    if (httpCode > 0) {
      Serial.printf("POST OK: %d\n", httpCode);
      String response = http.getString();
      Serial.println(response);
    } else {
      Serial.printf("POST Error: %s\n", http.errorToString(httpCode).c_str());
    }

    http.end();
  }
}

int detectPeople(camera_fb_t* fb) {
  // Aquí va tu algoritmo de detección de personas
  // Opciones:
  // 1. TensorFlow Lite Micro
  // 2. OpenCV con Haar Cascades
  // 3. YOLO tiny
  // 4. API externa de visión

  // Por ahora, retornar valor de prueba
  return random(0, capacity);
}

String getTimestamp() {
  // Obtener timestamp actual en formato ISO 8601
  // Requiere configurar NTP
  return "2025-10-28T18:00:00Z";
}
```

### Configuración WiFi

```cpp
// Opción 1: Hardcoded (no recomendado)
const char* ssid = "MiWiFi";
const char* password = "MiPassword";

// Opción 2: WiFi Manager (recomendado)
#include <WiFiManager.h>

WiFiManager wm;
wm.autoConnect("ElevaTec-Setup");
```

### Detección de Personas

```cpp
// Opción 1: TensorFlow Lite Micro
#include <TensorFlowLite_ESP32.h>
// Usar modelo pre-entrenado para detección de personas

// Opción 2: Enviar imagen a servidor para procesamiento
void sendImageToProcess(camera_fb_t* fb) {
  HTTPClient http;
  http.begin("http://tu-servidor/api/detect");
  http.addHeader("Content-Type", "image/jpeg");
  int httpCode = http.POST(fb->buf, fb->len);
  // Parsear respuesta con número de personas
}

// Opción 3: API externa (Google Vision, AWS Rekognition)
// Requiere credenciales y conexión a internet
```

---

## SSL/TLS (HTTPS)

### Let's Encrypt (Gratuito)

```bash
# 1. Instalar certbot
sudo apt install certbot python3-certbot-nginx

# 2. Obtener certificado
sudo certbot --nginx -d tudominio.com -d www.tudominio.com

# 3. Renovación automática
sudo certbot renew --dry-run
```

### Cloudflare (Gratis)

1. Crear cuenta en Cloudflare
2. Agregar tu dominio
3. Cambiar nameservers
4. Activar proxy (nube naranja)
5. SSL automático

---

## Monitoreo

### Logs

```bash
# Docker Compose
docker-compose logs -f backend
docker-compose logs -f frontend

# Journalctl (systemd)
sudo journalctl -u elevatec-backend -f

# CloudWatch (AWS)
aws logs tail /aws/ecs/elevatec --follow
```

### Métricas

```python
# Agregar a backend/app/__init__.py
from prometheus_flask_exporter import PrometheusMetrics

app = Flask(__name__)
metrics = PrometheusMetrics(app)
```

### Alertas

```yaml
# docker-compose.yml - agregar servicio
  prometheus:
    image: prom/prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"

  grafana:
    image: grafana/grafana
    ports:
      - "3000:3000"
```

---

## Backups

### Backup Automático

```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"

# Backup PostgreSQL
docker exec elevatec_db pg_dump -U elevadmin elevadb | gzip > $BACKUP_DIR/elevadb_$DATE.sql.gz

# Subir a S3 (opcional)
aws s3 cp $BACKUP_DIR/elevadb_$DATE.sql.gz s3://tu-bucket/backups/

# Eliminar backups antiguos (mantener 7 días)
find $BACKUP_DIR -name "elevadb_*.sql.gz" -mtime +7 -delete
```

**Cron job:**
```bash
# Ejecutar diariamente a las 2 AM
0 2 * * * /path/to/backup.sh
```

---

## Seguridad

### Checklist de Producción

- [ ] Cambiar SECRET_KEY y JWT_SECRET_KEY
- [ ] Usar HTTPS/SSL
- [ ] Configurar CORS correctamente
- [ ] Rate limiting en API
- [ ] Firewall configurado
- [ ] PostgreSQL no expuesto públicamente
- [ ] Backups automáticos
- [ ] Logs centralizados
- [ ] Monitoreo activo
- [ ] Actualizar dependencias regularmente
- [ ] Deshabilitar debug mode
- [ ] Validar todos los inputs
- [ ] Usar secrets manager (AWS Secrets Manager, etc.)

### Rate Limiting

```python
# backend/app/__init__.py
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)

# En routes
@app.route('/api/data', methods=['POST'])
@limiter.limit("100 per minute")
def receive_data():
    pass
```

---

## Troubleshooting

### Backend no conecta a DB

```bash
# Verificar que PostgreSQL esté corriendo
docker-compose ps

# Ver logs de PostgreSQL
docker-compose logs db

# Verificar conexión
docker exec -it elevatec_db psql -U elevadmin -d elevadb
```

### Frontend no carga

```bash
# Verificar que VITE_API_URL sea correcto
cat frontend/.env

# Ver logs
docker-compose logs frontend

# Rebuild
docker-compose up --build frontend
```

### ESP32-CAM no envía datos

1. Verificar WiFi conectado
2. Verificar URL del servidor correcta
3. Verificar firewall permite puerto 5000
4. Ver logs del ESP32 en Serial Monitor
5. Probar endpoint con curl

---

## Escalamiento

### Horizontal Scaling

```yaml
# docker-compose.yml
services:
  backend:
    deploy:
      replicas: 3

  nginx:
    image: nginx
    volumes:
      - ./nginx-lb.conf:/etc/nginx/nginx.conf
    depends_on:
      - backend
```

### Kubernetes

```yaml
# elevatec-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: elevatec-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: elevatec-backend
  template:
    metadata:
      labels:
        app: elevatec-backend
    spec:
      containers:
      - name: backend
        image: turegistry/elevatec-backend:latest
        ports:
        - containerPort: 5000
```

---

Última actualización: 28/10/2025
