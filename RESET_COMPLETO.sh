#!/bin/bash

# ============================================
# RESET COMPLETO - ElevaTec
# Reinicia todo el proyecto con data fresca
# ============================================

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}"
echo "============================================"
echo "  RESET COMPLETO - ElevaTec"
echo "  Reiniciando sistema con data fresca"
echo "============================================"
echo -e "${NC}"
echo ""

# Paso 1: Detener todo
echo -e "${BLUE}[1/7]${NC} Deteniendo todos los contenedores..."
docker-compose down
echo -e "${GREEN}✓${NC} Contenedores detenidos"
echo ""

# Paso 2: Eliminar volúmenes
echo -e "${BLUE}[2/7]${NC} Eliminando volumen de base de datos antigua..."
docker volume rm proyectofinal_postgres_data 2>/dev/null || echo -e "${YELLOW}⚠${NC} Volumen no encontrado (normal)"
echo -e "${GREEN}✓${NC} Volumen eliminado"
echo ""

# Paso 3: Limpiar contenedores
echo -e "${BLUE}[3/7]${NC} Limpiando contenedores antiguos..."
docker-compose rm -f
echo -e "${GREEN}✓${NC} Contenedores limpiados"
echo ""

# Paso 4: Reconstruir imágenes
echo -e "${BLUE}[4/7]${NC} Reconstruyendo imágenes Docker..."
docker-compose build --no-cache
echo -e "${GREEN}✓${NC} Imágenes reconstruidas"
echo ""

# Paso 5: Iniciar base de datos
echo -e "${BLUE}[5/7]${NC} Iniciando PostgreSQL..."
docker-compose up -d db
echo ""
echo -e "${YELLOW}Esperando que PostgreSQL esté listo...${NC}"
sleep 5

# Esperar a que PostgreSQL esté listo
max_attempts=30
attempt=0
while [ $attempt -lt $max_attempts ]; do
    if docker exec elevatec_db pg_isready -U elevadmin -d elevadb > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC} PostgreSQL está listo"
        break
    fi
    attempt=$((attempt + 1))
    if [ $attempt -eq $max_attempts ]; then
        echo -e "${RED}✗${NC} PostgreSQL no responde"
        exit 1
    fi
    echo -n "."
    sleep 1
done
echo ""

# Paso 6: Iniciar backend
echo -e "${BLUE}[6/7]${NC} Iniciando Backend..."
docker-compose up -d backend
echo -e "${YELLOW}Esperando que el backend esté listo...${NC}"
sleep 10
echo -e "${GREEN}✓${NC} Backend iniciado"
echo ""

# Paso 7: Iniciar frontend y simulador
echo -e "${BLUE}[7/7]${NC} Iniciando Frontend y Simulador..."
docker-compose up -d
echo -e "${GREEN}✓${NC} Todos los servicios iniciados"
echo ""

# Esperar un poco más
echo -e "${YELLOW}Esperando que todos los servicios estén listos...${NC}"
sleep 15
echo ""

# Verificar estado
echo -e "${BLUE}"
echo "============================================"
echo "  ESTADO DE LOS SERVICIOS"
echo "============================================"
echo -e "${NC}"
docker-compose ps
echo ""

# Verificar datos en la base de datos
echo -e "${BLUE}"
echo "============================================"
echo "  VERIFICANDO DATOS EN LA BASE DE DATOS"
echo "============================================"
echo -e "${NC}"

sleep 5

echo -e "${YELLOW}Contando registros...${NC}"
docker exec elevatec_db psql -U elevadmin -d elevadb -c "
SELECT
    'Usuarios' as tabla,
    COUNT(*)::text as cantidad
FROM users
UNION ALL
SELECT 'Ascensores', COUNT(*)::text FROM elevators
UNION ALL
SELECT 'Dispositivos', COUNT(*)::text FROM devices
UNION ALL
SELECT 'Logs de Aforo', COUNT(*)::text FROM aforo_logs;
" 2>/dev/null || echo -e "${YELLOW}⚠${NC} Aún creando tablas..."

echo ""

# Mostrar logs del simulador
echo -e "${BLUE}"
echo "============================================"
echo "  SIMULADOR EN ACCIÓN (últimas 20 líneas)"
echo "============================================"
echo -e "${NC}"
sleep 3
docker-compose logs --tail=20 simulator

echo ""
echo -e "${GREEN}"
echo "============================================"
echo "  ✓ RESET COMPLETO EXITOSO"
echo "============================================"
echo -e "${NC}"
echo ""
echo -e "${GREEN}Acceso a la aplicación:${NC}"
echo "  🌐 Frontend: http://localhost:5173"
echo "  🔧 Backend:  http://localhost:5002"
echo "  🔐 Login:    admin@elevatec.com / admin123"
echo ""
echo -e "${BLUE}Ver logs en tiempo real:${NC}"
echo "  docker-compose logs -f simulator    # Ver cámaras enviando datos"
echo "  docker-compose logs -f backend      # Ver logs del backend"
echo "  docker-compose logs -f frontend     # Ver logs del frontend"
echo ""
echo -e "${YELLOW}Espera 30-60 segundos para que el simulador empiece a enviar datos.${NC}"
echo -e "${YELLOW}Luego abre http://localhost:5173 y verás los espacios actualizándose.${NC}"
echo ""
echo -e "${GREEN}¡Listo! 🎉${NC}"
echo ""
