from flask import Blueprint, request, jsonify
from datetime import datetime
from app import db
from app.models.device import Device
from app.models.elevator import Elevator
from app.models.aforo_log import AforoLog

data_bp = Blueprint('data', __name__)

@data_bp.route('/data', methods=['POST'])
def receive_data():
    """
    Endpoint to receive data from ESP32-CAM devices
    Expected JSON format:
    {
        "device_id": "ESP32CAM-05",
        "floor": 3,
        "people_count": 6,
        "capacity": 10,
        "timestamp": "2025-10-28T18:00:00Z"
    }
    """
    try:
        data = request.get_json()

        device_id = data.get('device_id')
        floor = data.get('floor')
        people_count = data.get('people_count')
        capacity = data.get('capacity')
        timestamp_str = data.get('timestamp')

        if not device_id or floor is None or people_count is None:
            return jsonify({'error': 'device_id, floor and people_count required'}), 400

        # Parse timestamp
        timestamp = datetime.fromisoformat(timestamp_str.replace('Z', '+00:00')) if timestamp_str else datetime.utcnow()

        # Update or create device
        device = Device.query.filter_by(device_id=device_id).first()

        if not device:
            # Auto-register new device
            device = Device(
                device_id=device_id,
                floor=floor,
                ip_address=request.remote_addr,
                status='online',
                last_seen=timestamp
            )
            db.session.add(device)
        else:
            device.last_seen = timestamp
            device.status = 'online'
            device.ip_address = request.remote_addr

        # Find or create elevator for this device
        elevator = Elevator.query.filter_by(device_id=device_id).first()

        if not elevator:
            # Auto-create elevator
            elevator = Elevator(
                name=f"Ascensor Piso {floor}",
                floor=floor,
                capacity=capacity if capacity else 10,
                current_people=people_count,
                device_id=device_id
            )
            db.session.add(elevator)
            db.session.flush()  # Get the elevator.id before creating log
        else:
            # Update elevator data
            elevator.current_people = people_count
            if capacity:
                elevator.capacity = capacity
            elevator.floor = floor

        # Create aforo log (now elevator.id is available)
        aforo_log = AforoLog(
            elevator_id=elevator.id,
            people_count=people_count,
            timestamp=timestamp
        )

        db.session.add(aforo_log)
        db.session.commit()

        return jsonify({
            'message': 'Data received successfully',
            'device_id': device_id,
            'elevator': elevator.to_dict(),
            'aforo_status': elevator.get_aforo_status()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
