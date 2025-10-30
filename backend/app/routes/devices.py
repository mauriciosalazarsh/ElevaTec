from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.device import Device
from app.models.user import User

devices_bp = Blueprint('devices', __name__)

@devices_bp.route('/devices', methods=['GET'])
@jwt_required()
def get_devices():
    try:
        current_user_id = get_jwt_identity()
        current_user = User.query.get(int(current_user_id))

        if current_user.role != 'admin':
            return jsonify({'error': 'Unauthorized'}), 403

        devices = Device.query.all()
        return jsonify({
            'devices': [device.to_dict() for device in devices]
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@devices_bp.route('/devices/<int:id>', methods=['GET'])
@jwt_required()
def get_device(id):
    try:
        current_user_id = get_jwt_identity()
        current_user = User.query.get(int(current_user_id))

        if current_user.role != 'admin':
            return jsonify({'error': 'Unauthorized'}), 403

        device = Device.query.get(id)

        if not device:
            return jsonify({'error': 'Device not found'}), 404

        return jsonify({'device': device.to_dict()}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@devices_bp.route('/devices', methods=['POST'])
@jwt_required()
def create_device():
    try:
        current_user_id = get_jwt_identity()
        current_user = User.query.get(int(current_user_id))

        if current_user.role != 'admin':
            return jsonify({'error': 'Unauthorized'}), 403

        data = request.get_json()
        device_id = data.get('device_id')
        floor = data.get('floor')
        ip_address = data.get('ip_address')

        if not device_id or floor is None:
            return jsonify({'error': 'Device ID and floor required'}), 400

        if Device.query.filter_by(device_id=device_id).first():
            return jsonify({'error': 'Device ID already exists'}), 400

        new_device = Device(
            device_id=device_id,
            floor=floor,
            ip_address=ip_address,
            status='offline'
        )

        db.session.add(new_device)
        db.session.commit()

        return jsonify({
            'message': 'Device created successfully',
            'device': new_device.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@devices_bp.route('/devices/<int:id>', methods=['PUT'])
@jwt_required()
def update_device(id):
    try:
        current_user_id = get_jwt_identity()
        current_user = User.query.get(int(current_user_id))

        if current_user.role != 'admin':
            return jsonify({'error': 'Unauthorized'}), 403

        device = Device.query.get(id)

        if not device:
            return jsonify({'error': 'Device not found'}), 404

        data = request.get_json()

        if 'device_id' in data:
            # Check if new device_id already exists
            existing = Device.query.filter_by(device_id=data['device_id']).first()
            if existing and existing.id != id:
                return jsonify({'error': 'Device ID already exists'}), 400
            device.device_id = data['device_id']

        if 'floor' in data:
            device.floor = data['floor']
        if 'ip_address' in data:
            device.ip_address = data['ip_address']
        if 'status' in data:
            device.status = data['status']

        db.session.commit()

        return jsonify({
            'message': 'Device updated successfully',
            'device': device.to_dict()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@devices_bp.route('/devices/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_device(id):
    try:
        current_user_id = get_jwt_identity()
        current_user = User.query.get(int(current_user_id))

        if current_user.role != 'admin':
            return jsonify({'error': 'Unauthorized'}), 403

        device = Device.query.get(id)

        if not device:
            return jsonify({'error': 'Device not found'}), 404

        db.session.delete(device)
        db.session.commit()

        return jsonify({'message': 'Device deleted successfully'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
