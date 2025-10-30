#!/bin/bash

# ============================================
# Script de Migración a Nueva Base de Datos
# ElevaTec - Sistema Multiespacio
# ============================================

set -e  # Detener en caso de error

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Banner
echo -e "${BLUE}"
echo "============================================"
echo "  ElevaTec - Migración de Base de Datos"
echo "  De: Sistema Solo Ascensores"
echo "  A:  Sistema Multiespacio"
echo "============================================"
echo -e "${NC}"

# Función para imprimir con color
print_step() {
    echo -e "${BLUE}[PASO $1/8]${NC} $2"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Verificar que estamos en el directorio correcto
if [ ! -f "docker-compose.yml" ]; then
    print_error "No se encuentra docker-compose.yml"
    print_error "Por favor ejecuta este script desde el directorio del proyecto"
    exit 1
fi

if [ ! -f "database_schema.sql" ]; then
    print_error "No se encuentra database_schema.sql"
    print_error "Asegúrate de tener el archivo en el directorio actual"
    exit 1
fi

# Confirmación del usuario
echo ""
print_warning "ADVERTENCIA: Esta operación eliminará todos los datos actuales de la base de datos"
print_warning "Se creará una nueva base de datos con estructura multiespacio"
echo ""
read -p "¿Deseas continuar? (si/no): " confirm

if [ "$confirm" != "si" ] && [ "$confirm" != "SI" ] && [ "$confirm" != "s" ] && [ "$confirm" != "S" ]; then
    print_error "Operación cancelada por el usuario"
    exit 0
fi

echo ""
print_step 1 "Deteniendo contenedores..."
docker-compose down
print_success "Contenedores detenidos"

echo ""
print_step 2 "Eliminando volumen de base de datos antigua..."
docker volume rm proyectofinal_postgres_data 2>/dev/null || print_warning "Volumen no encontrado (puede ser normal)"
print_success "Volumen eliminado"

echo ""
print_step 3 "Iniciando contenedor de PostgreSQL..."
docker-compose up -d db
print_success "PostgreSQL iniciado"

echo ""
print_step 4 "Esperando a que PostgreSQL esté listo..."
echo -n "Esperando"
for i in {1..15}; do
    echo -n "."
    sleep 1
done
echo ""

# Verificar que PostgreSQL esté listo
max_attempts=30
attempt=0
while [ $attempt -lt $max_attempts ]; do
    if docker exec elevatec_db pg_isready -U elevadmin -d elevadb > /dev/null 2>&1; then
        print_success "PostgreSQL está listo"
        break
    fi
    attempt=$((attempt + 1))
    if [ $attempt -eq $max_attempts ]; then
        print_error "PostgreSQL no está respondiendo después de esperar"
        print_error "Logs:"
        docker-compose logs db | tail -20
        exit 1
    fi
    sleep 1
done

echo ""
print_step 5 "Ejecutando script de creación de base de datos..."
if docker exec -i elevatec_db psql -U elevadmin -d elevadb < database_schema.sql > /tmp/migration_output.log 2>&1; then
    print_success "Base de datos creada exitosamente"
else
    print_error "Error al crear la base de datos"
    print_error "Ver detalles en: /tmp/migration_output.log"
    cat /tmp/migration_output.log
    exit 1
fi

echo ""
print_step 6 "Verificando estructura de base de datos..."
echo -n "Contando tablas: "
table_count=$(docker exec elevatec_db psql -U elevadmin -d elevadb -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE';" | xargs)
echo "$table_count"

if [ "$table_count" -eq "7" ]; then
    print_success "Todas las tablas creadas correctamente"
    echo "  - users"
    echo "  - space_types"
    echo "  - devices"
    echo "  - spaces"
    echo "  - aforo_logs"
    echo "  - space_schedules"
    echo "  - alerts"
else
    print_warning "Se esperaban 7 tablas pero se encontraron $table_count"
fi

echo ""
print_step 7 "Iniciando todos los servicios..."
docker-compose up -d
print_success "Todos los servicios iniciados"

echo ""
print_step 8 "Verificando estado de contenedores..."
sleep 3
echo ""
docker-compose ps

echo ""
echo -e "${GREEN}"
echo "============================================"
echo "  ✓ MIGRACIÓN COMPLETADA EXITOSAMENTE"
echo "============================================"
echo -e "${NC}"

echo ""
echo "📊 Resumen de la nueva base de datos:"
echo ""
docker exec elevatec_db psql -U elevadmin -d elevadb -c "
SELECT
    'Usuarios' as tabla, COUNT(*)::text as cantidad FROM users
UNION ALL
SELECT 'Tipos de Espacios', COUNT(*)::text FROM space_types
UNION ALL
SELECT 'Dispositivos', COUNT(*)::text FROM devices
UNION ALL
SELECT 'Espacios', COUNT(*)::text FROM spaces
UNION ALL
SELECT 'Logs de Aforo', COUNT(*)::text FROM aforo_logs
UNION ALL
SELECT 'Horarios', COUNT(*)::text FROM space_schedules
UNION ALL
SELECT 'Alertas', COUNT(*)::text FROM alerts;
" 2>/dev/null || print_warning "No se pudo obtener resumen"

echo ""
echo -e "${BLUE}Tipos de espacios disponibles:${NC}"
docker exec elevatec_db psql -U elevadmin -d elevadb -t -c "SELECT '  • ' || name || ' (' || code || ')' FROM space_types ORDER BY id;" 2>/dev/null || print_warning "No se pudo listar tipos"

echo ""
echo -e "${GREEN}Acceso a la aplicación:${NC}"
echo "  Frontend: http://localhost:5173"
echo "  Backend:  http://localhost:5002"
echo "  Login:    admin@elevatec.com / admin123"

echo ""
echo -e "${YELLOW}⚠️  IMPORTANTE:${NC}"
echo "  El código del backend actual usa la estructura antigua (tabla 'elevators')"
echo "  La nueva BD usa 'spaces' y 'space_types'"
echo ""
echo "  Para que funcione completamente, necesitas actualizar:"
echo "  1. Los modelos en backend/app/models/"
echo "  2. Las rutas en backend/app/routes/"
echo ""
echo "  ¿Quieres que actualice el código automáticamente? (Pregúntame)"

echo ""
echo -e "${GREEN}¡Migración completada!${NC}"
echo ""
