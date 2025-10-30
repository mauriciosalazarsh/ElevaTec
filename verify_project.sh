#!/bin/bash

echo "========================================="
echo "  ElevaTec - Verificación del Proyecto"
echo "========================================="
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
        return 0
    else
        echo -e "${RED}✗${NC} $1 (FALTA)"
        return 1
    fi
}

check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $1/"
        return 0
    else
        echo -e "${RED}✗${NC} $1/ (FALTA)"
        return 1
    fi
}

total=0
passed=0

echo "1. Verificando estructura de directorios..."
echo "-------------------------------------------"

dirs=(
    "backend"
    "backend/app"
    "backend/app/models"
    "backend/app/routes"
    "frontend"
    "frontend/src"
    "frontend/src/api"
    "frontend/src/components"
    "frontend/src/context"
    "frontend/src/pages"
)

for dir in "${dirs[@]}"; do
    total=$((total + 1))
    if check_dir "$dir"; then
        passed=$((passed + 1))
    fi
done

echo ""
echo "2. Verificando archivos de configuración..."
echo "-------------------------------------------"

config_files=(
    "docker-compose.yml"
    ".env"
    ".env.example"
    ".gitignore"
    "backend/Dockerfile"
    "backend/requirements.txt"
    "frontend/Dockerfile"
    "frontend/package.json"
    "frontend/vite.config.js"
    "frontend/tailwind.config.js"
    "frontend/postcss.config.js"
)

for file in "${config_files[@]}"; do
    total=$((total + 1))
    if check_file "$file"; then
        passed=$((passed + 1))
    fi
done

echo ""
echo "3. Verificando archivos del backend..."
echo "-------------------------------------------"

backend_files=(
    "backend/app.py"
    "backend/app/__init__.py"
    "backend/app/models/__init__.py"
    "backend/app/models/user.py"
    "backend/app/models/device.py"
    "backend/app/models/elevator.py"
    "backend/app/models/aforo_log.py"
    "backend/app/routes/auth.py"
    "backend/app/routes/elevators.py"
    "backend/app/routes/devices.py"
    "backend/app/routes/data.py"
    "backend/app/routes/metrics.py"
)

for file in "${backend_files[@]}"; do
    total=$((total + 1))
    if check_file "$file"; then
        passed=$((passed + 1))
    fi
done

echo ""
echo "4. Verificando archivos del frontend..."
echo "-------------------------------------------"

frontend_files=(
    "frontend/index.html"
    "frontend/src/main.jsx"
    "frontend/src/App.jsx"
    "frontend/src/index.css"
    "frontend/src/api/axios.js"
    "frontend/src/context/AuthContext.jsx"
    "frontend/src/components/Navbar.jsx"
    "frontend/src/components/ElevatorCard.jsx"
    "frontend/src/components/DashboardChart.jsx"
    "frontend/src/components/PrivateRoute.jsx"
    "frontend/src/pages/Login.jsx"
    "frontend/src/pages/AdminDashboard.jsx"
    "frontend/src/pages/DeviceManager.jsx"
    "frontend/src/pages/UserHome.jsx"
)

for file in "${frontend_files[@]}"; do
    total=$((total + 1))
    if check_file "$file"; then
        passed=$((passed + 1))
    fi
done

echo ""
echo "5. Verificando documentación..."
echo "-------------------------------------------"

doc_files=(
    "README.md"
    "QUICKSTART.md"
    "API_EXAMPLES.md"
    "PROYECTO_ESTRUCTURA.md"
    "RESUMEN_EJECUTIVO.md"
)

for file in "${doc_files[@]}"; do
    total=$((total + 1))
    if check_file "$file"; then
        passed=$((passed + 1))
    fi
done

echo ""
echo "6. Verificando herramientas de testing..."
echo "-------------------------------------------"

test_files=(
    "test_esp32_simulator.py"
)

for file in "${test_files[@]}"; do
    total=$((total + 1))
    if check_file "$file"; then
        passed=$((passed + 1))
    fi
done

echo ""
echo "========================================="
echo "  Resultado Final"
echo "========================================="
echo ""

percentage=$((passed * 100 / total))

if [ $passed -eq $total ]; then
    echo -e "${GREEN}✓ Todos los archivos están presentes${NC}"
    echo ""
    echo -e "Archivos verificados: ${GREEN}$passed/$total${NC} (${GREEN}100%${NC})"
    echo ""
    echo -e "${GREEN}El proyecto está completo y listo para usar!${NC}"
    echo ""
    echo "Próximos pasos:"
    echo "1. docker-compose up --build"
    echo "2. Abrir http://localhost:5173"
    echo "3. Login: admin@elevatec.com / admin123"
    exit_code=0
elif [ $percentage -ge 80 ]; then
    echo -e "${YELLOW}⚠ Algunos archivos faltan${NC}"
    echo ""
    echo -e "Archivos verificados: ${YELLOW}$passed/$total${NC} (${YELLOW}$percentage%${NC})"
    echo ""
    echo -e "${YELLOW}El proyecto está casi completo. Revisa los archivos faltantes arriba.${NC}"
    exit_code=1
else
    echo -e "${RED}✗ Muchos archivos faltan${NC}"
    echo ""
    echo -e "Archivos verificados: ${RED}$passed/$total${NC} (${RED}$percentage%${NC})"
    echo ""
    echo -e "${RED}El proyecto necesita más archivos. Revisa la estructura.${NC}"
    exit_code=2
fi

echo ""
echo "========================================="

exit $exit_code
