#!/usr/bin/env python3
"""
ESP32-CAM Simulator
Simula múltiples cámaras ESP32 enviando datos de aforo al backend
"""

import requests
import random
import time
import json
from datetime import datetime
import sys
import os

# Configuración
BACKEND_URL = os.getenv('BACKEND_URL', 'http://backend:5000')
API_ENDPOINT = f'{BACKEND_URL}/api/data'
INTERVAL_SECONDS = int(os.getenv('INTERVAL_SECONDS', '5'))

# Definición de cámaras simuladas
CAMERAS = [
    # Ascensores
    {
        'device_id': 'ESP32CAM-001',
        'name': 'Cámara Ascensor Torre A',
        'floor': None,
        'capacity': 10,
        'min_people': 0,
        'max_people': 10,
        'variation': 2  # Variación máxima entre mediciones
    },
    {
        'device_id': 'ESP32CAM-002',
        'name': 'Cámara Ascensor Torre B',
        'floor': None,
        'capacity': 10,
        'min_people': 0,
        'max_people': 10,
        'variation': 2
    },

    # Salones
    {
        'device_id': 'ESP32CAM-101',
        'name': 'Cámara Salón A-301',
        'floor': 3,
        'capacity': 45,
        'min_people': 10,
        'max_people': 45,
        'variation': 5
    },
    {
        'device_id': 'ESP32CAM-102',
        'name': 'Cámara Salón A-302',
        'floor': 3,
        'capacity': 45,
        'min_people': 5,
        'max_people': 45,
        'variation': 5
    },
    {
        'device_id': 'ESP32CAM-103',
        'name': 'Cámara Salón B-205',
        'floor': 2,
        'capacity': 40,
        'min_people': 15,
        'max_people': 40,
        'variation': 5
    },

    # Bibliotecas
    {
        'device_id': 'ESP32CAM-201',
        'name': 'Cámara Biblioteca Central',
        'floor': 1,
        'capacity': 80,
        'min_people': 20,
        'max_people': 75,
        'variation': 10
    },
    {
        'device_id': 'ESP32CAM-202',
        'name': 'Cámara Biblioteca Especializada',
        'floor': 2,
        'capacity': 30,
        'min_people': 5,
        'max_people': 28,
        'variation': 5
    },

    # Cafeterías
    {
        'device_id': 'ESP32CAM-301',
        'name': 'Cámara Cafetería Principal',
        'floor': 1,
        'capacity': 120,
        'min_people': 30,
        'max_people': 110,
        'variation': 15
    },
    {
        'device_id': 'ESP32CAM-302',
        'name': 'Cámara Cafetería Secundaria',
        'floor': 1,
        'capacity': 60,
        'min_people': 10,
        'max_people': 55,
        'variation': 10
    },

    # Laboratorios
    {
        'device_id': 'ESP32CAM-401',
        'name': 'Cámara Lab de Física',
        'floor': 2,
        'capacity': 25,
        'min_people': 5,
        'max_people': 23,
        'variation': 3
    },
    {
        'device_id': 'ESP32CAM-402',
        'name': 'Cámara Lab de Química',
        'floor': 2,
        'capacity': 25,
        'min_people': 5,
        'max_people': 23,
        'variation': 3
    },

    # Gimnasio
    {
        'device_id': 'ESP32CAM-501',
        'name': 'Cámara Gimnasio',
        'floor': 1,
        'capacity': 40,
        'min_people': 10,
        'max_people': 38,
        'variation': 8
    },
]

# Estado actual de cada cámara (personas detectadas)
camera_state = {}

def initialize_cameras():
    """Inicializa el estado de cada cámara con valores aleatorios"""
    for camera in CAMERAS:
        camera_state[camera['device_id']] = random.randint(
            camera['min_people'],
            camera['max_people']
        )

def get_realistic_people_count(camera):
    """
    Genera un conteo realista de personas con variación gradual
    """
    current = camera_state.get(camera['device_id'], camera['min_people'])

    # Hora del día afecta la ocupación
    hour = datetime.now().hour

    # Factores de hora pico
    if 8 <= hour <= 10 or 12 <= hour <= 14 or 17 <= hour <= 19:
        # Horas pico: tendencia a tener más gente
        trend = random.choice([1, 1, 1, 0, -1])  # 60% aumentar, 20% igual, 20% disminuir
    else:
        # Horas normales: tendencia neutral
        trend = random.choice([1, 0, -1])

    # Aplicar variación
    variation = random.randint(0, camera['variation'])
    new_count = current + (trend * variation)

    # Mantener dentro de límites
    new_count = max(camera['min_people'], min(camera['max_people'], new_count))

    # Actualizar estado
    camera_state[camera['device_id']] = new_count

    return new_count

def send_camera_data(camera):
    """
    Envía datos de una cámara al backend
    """
    people_count = get_realistic_people_count(camera)

    payload = {
        'device_id': camera['device_id'],
        'floor': camera['floor'],
        'people_count': people_count,
        'capacity': camera['capacity'],
        'timestamp': datetime.utcnow().isoformat() + 'Z'
    }

    try:
        response = requests.post(API_ENDPOINT, json=payload, timeout=5)

        if response.status_code == 200:
            result = response.json()
            aforo_status = result.get('aforo_status', 'unknown')

            # Código de color para el estado
            status_color = {
                'bajo': '\033[92m',    # Verde
                'medio': '\033[93m',   # Amarillo
                'alto': '\033[91m'     # Rojo
            }.get(aforo_status, '\033[0m')

            status_icon = {
                'bajo': '🟢',
                'medio': '🟡',
                'alto': '🔴'
            }.get(aforo_status, '⚪')

            print(f"{status_icon} {camera['device_id']:15} | {people_count:3}/{camera['capacity']:3} personas | "
                  f"{status_color}{aforo_status.upper():6}\033[0m | {camera['name']}")

            return True
        else:
            print(f"❌ {camera['device_id']:15} | Error HTTP {response.status_code}")
            return False

    except requests.exceptions.ConnectionError:
        print(f"⚠️  {camera['device_id']:15} | Backend no disponible (esperando...)")
        return False
    except requests.exceptions.Timeout:
        print(f"⏱️  {camera['device_id']:15} | Timeout")
        return False
    except Exception as e:
        print(f"❌ {camera['device_id']:15} | Error: {str(e)}")
        return False

def print_header():
    """Imprime el encabezado del simulador"""
    print("\n" + "="*80)
    print("  ESP32-CAM SIMULATOR - ElevaTec")
    print("="*80)
    print(f"  Backend: {BACKEND_URL}")
    print(f"  Cámaras: {len(CAMERAS)}")
    print(f"  Intervalo: {INTERVAL_SECONDS} segundos")
    print("="*80 + "\n")

def print_summary():
    """Imprime un resumen de las cámaras"""
    print("\n" + "-"*80)
    total_people = sum(camera_state.values())
    total_capacity = sum(camera['capacity'] for camera in CAMERAS)
    avg_occupancy = (total_people / total_capacity * 100) if total_capacity > 0 else 0

    print(f"  📊 RESUMEN: {total_people}/{total_capacity} personas ({avg_occupancy:.1f}% ocupación global)")
    print("-"*80 + "\n")

def main():
    """Función principal del simulador"""
    print_header()

    # Inicializar estado de cámaras
    initialize_cameras()

    print("Esperando que el backend esté disponible...")

    # Esperar a que el backend esté listo
    max_retries = 30
    for attempt in range(max_retries):
        try:
            response = requests.get(f"{BACKEND_URL}/api/elevators", timeout=2)
            print(f"✅ Backend disponible!\n")
            break
        except:
            if attempt < max_retries - 1:
                print(f"Reintentando... ({attempt + 1}/{max_retries})", end='\r')
                time.sleep(2)
            else:
                print("\n❌ No se pudo conectar al backend después de varios intentos")
                print("   Continuando de todas formas...")
                break

    iteration = 0

    try:
        while True:
            iteration += 1
            timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

            print(f"\n[{timestamp}] Iteración #{iteration}")
            print("-"*80)

            success_count = 0

            # Enviar datos de cada cámara
            for camera in CAMERAS:
                if send_camera_data(camera):
                    success_count += 1
                time.sleep(0.2)  # Pequeña pausa entre cámaras

            # Mostrar resumen
            print_summary()

            print(f"✅ {success_count}/{len(CAMERAS)} cámaras enviaron datos correctamente")
            print(f"⏳ Próxima actualización en {INTERVAL_SECONDS} segundos...")

            # Esperar antes de la siguiente iteración
            time.sleep(INTERVAL_SECONDS)

    except KeyboardInterrupt:
        print("\n\n⚠️  Simulador detenido por el usuario")
        print("Hasta luego! 👋\n")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ Error inesperado: {str(e)}")
        sys.exit(1)

if __name__ == '__main__':
    main()
