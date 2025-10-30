from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.elevator import Elevator
from app.models.user import User

elevators_bp = Blueprint('elevators', __name__)

@elevators_bp.route('/elevators', methods=['GET'])
@jwt_required()
def get_elevators():
    try:
        elevators = Elevator.query.all()
        return jsonify({
            'elevators': [elevator.to_dict() for elevator in elevators]
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@elevators_bp.route('/elevators/<int:id>', methods=['GET'])
@jwt_required()
def get_elevator(id):
    try:
        elevator = Elevator.query.get(id)

        if not elevator:
            return jsonify({'error': 'Elevator not found'}), 404

        return jsonify({'elevator': elevator.to_dict()}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@elevators_bp.route('/elevators', methods=['POST'])
@jwt_required()
def create_elevator():
    try:
        current_user_id = get_jwt_identity()
        current_user = User.query.get(int(current_user_id))

        if current_user.role != 'admin':
            return jsonify({'error': 'Unauthorized'}), 403

        data = request.get_json()
        name = data.get('name')
        floor = data.get('floor')
        capacity = data.get('capacity')
        device_id = data.get('device_id')

        if not name or floor is None or not capacity:
            return jsonify({'error': 'Name, floor and capacity required'}), 400

        new_elevator = Elevator(
            name=name,
            floor=floor,
            capacity=capacity,
            device_id=device_id
        )

        db.session.add(new_elevator)
        db.session.commit()

        return jsonify({
            'message': 'Elevator created successfully',
            'elevator': new_elevator.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@elevators_bp.route('/elevators/<int:id>', methods=['PUT'])
@jwt_required()
def update_elevator(id):
    try:
        current_user_id = get_jwt_identity()
        current_user = User.query.get(int(current_user_id))

        if current_user.role != 'admin':
            return jsonify({'error': 'Unauthorized'}), 403

        elevator = Elevator.query.get(id)

        if not elevator:
            return jsonify({'error': 'Elevator not found'}), 404

        data = request.get_json()

        if 'name' in data:
            elevator.name = data['name']
        if 'floor' in data:
            elevator.floor = data['floor']
        if 'capacity' in data:
            elevator.capacity = data['capacity']
        if 'device_id' in data:
            elevator.device_id = data['device_id']
        if 'current_people' in data:
            elevator.current_people = data['current_people']

        db.session.commit()

        return jsonify({
            'message': 'Elevator updated successfully',
            'elevator': elevator.to_dict()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@elevators_bp.route('/elevators/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_elevator(id):
    try:
        current_user_id = get_jwt_identity()
        current_user = User.query.get(int(current_user_id))

        if current_user.role != 'admin':
            return jsonify({'error': 'Unauthorized'}), 403

        elevator = Elevator.query.get(id)

        if not elevator:
            return jsonify({'error': 'Elevator not found'}), 404

        db.session.delete(elevator)
        db.session.commit()

        return jsonify({'message': 'Elevator deleted successfully'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
