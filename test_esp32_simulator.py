#!/usr/bin/env python3
"""
Simulador de datos ESP32-CAM para pruebas
Este script simula el envío de datos desde dispositivos ESP32-CAM al backend
"""

import requests
import random
import time
from datetime import datetime

API_URL = "http://localhost:5002/api/data"

# Configuración de dispositivos simulados
DEVICES = [
    {"device_id": "ESP32CAM-01", "floor": 1, "capacity": 10},
    {"device_id": "ESP32CAM-02", "floor": 2, "capacity": 8},
    {"device_id": "ESP32CAM-03", "floor": 3, "capacity": 12},
    {"device_id": "ESP32CAM-04", "floor": 4, "capacity": 10},
    {"device_id": "ESP32CAM-05", "floor": 5, "capacity": 15},
]

def send_data(device):
    """Envía datos simulados desde un dispositivo ESP32-CAM"""
    people_count = random.randint(0, device["capacity"])

    data = {
        "device_id": device["device_id"],
        "floor": device["floor"],
        "people_count": people_count,
        "capacity": device["capacity"],
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }

    try:
        response = requests.post(API_URL, json=data)
        if response.status_code == 200:
            result = response.json()
            print(f"✓ {device['device_id']} | Piso {device['floor']} | "
                  f"Personas: {people_count}/{device['capacity']} | "
                  f"Estado: {result.get('aforo_status', 'N/A')}")
        else:
            print(f"✗ Error {response.status_code}: {response.text}")
    except Exception as e:
        print(f"✗ Error al conectar: {e}")

def simulate_continuous():
    """Simula envío continuo de datos de todos los dispositivos"""
    print("=" * 70)
    print("SIMULADOR DE DATOS ESP32-CAM - ElevaTec")
    print("=" * 70)
    print("Enviando datos simulados cada 5 segundos...")
    print("Presiona Ctrl+C para detener\n")

    try:
        while True:
            print(f"\n[{datetime.now().strftime('%H:%M:%S')}] Enviando datos...")
            print("-" * 70)

            for device in DEVICES:
                send_data(device)
                time.sleep(0.5)  # Pequeño delay entre dispositivos

            time.sleep(5)  # Esperar 5 segundos antes del siguiente ciclo

    except KeyboardInterrupt:
        print("\n\nSimulación detenida por el usuario.")

def simulate_once():
    """Envía datos una sola vez desde todos los dispositivos"""
    print("=" * 70)
    print("SIMULADOR DE DATOS ESP32-CAM - ElevaTec (Una vez)")
    print("=" * 70)

    for device in DEVICES:
        send_data(device)
        time.sleep(0.5)

if __name__ == "__main__":
    import sys

    if len(sys.argv) > 1 and sys.argv[1] == "--once":
        simulate_once()
    else:
        simulate_continuous()
