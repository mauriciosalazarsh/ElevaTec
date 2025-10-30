from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import func
from datetime import datetime, timedelta
from app import db
from app.models.user import User
from app.models.elevator import Elevator
from app.models.aforo_log import AforoLog
from app.models.device import Device

metrics_bp = Blueprint('metrics', __name__)

@metrics_bp.route('/metrics', methods=['GET'])
@jwt_required()
def get_metrics():
    try:
        current_user_id = get_jwt_identity()
        current_user = User.query.get(int(current_user_id))

        if current_user.role != 'admin':
            return jsonify({'error': 'Unauthorized'}), 403

        # Total elevators
        total_elevators = Elevator.query.count()

        # Total devices
        total_devices = Device.query.count()

        # Online devices
        online_devices = Device.query.filter_by(status='online').count()

        # Average aforo across all elevators
        elevators = Elevator.query.all()
        total_capacity = sum(e.capacity for e in elevators) or 1
        total_people = sum(e.current_people for e in elevators)
        avg_aforo_percentage = (total_people / total_capacity * 100) if total_capacity > 0 else 0

        # Aforo status distribution
        aforo_bajo = sum(1 for e in elevators if e.get_aforo_status() == 'bajo')
        aforo_medio = sum(1 for e in elevators if e.get_aforo_status() == 'medio')
        aforo_alto = sum(1 for e in elevators if e.get_aforo_status() == 'alto')

        # Recent activity (last 24 hours)
        last_24h = datetime.utcnow() - timedelta(hours=24)
        recent_logs = AforoLog.query.filter(AforoLog.timestamp >= last_24h).count()

        # Peak usage hours (last 7 days)
        last_7d = datetime.utcnow() - timedelta(days=7)
        hourly_usage = db.session.query(
            func.extract('hour', AforoLog.timestamp).label('hour'),
            func.avg(AforoLog.people_count).label('avg_people')
        ).filter(
            AforoLog.timestamp >= last_7d
        ).group_by('hour').all()

        peak_hours = [
            {'hour': int(hour), 'avg_people': float(avg_people)}
            for hour, avg_people in hourly_usage
        ]

        # Daily usage trend (last 7 days)
        daily_usage = db.session.query(
            func.date(AforoLog.timestamp).label('date'),
            func.avg(AforoLog.people_count).label('avg_people'),
            func.max(AforoLog.people_count).label('max_people')
        ).filter(
            AforoLog.timestamp >= last_7d
        ).group_by('date').all()

        daily_trend = [
            {
                'date': date.isoformat() if date else None,
                'avg_people': float(avg_people),
                'max_people': int(max_people)
            }
            for date, avg_people, max_people in daily_usage
        ]

        return jsonify({
            'total_elevators': total_elevators,
            'total_devices': total_devices,
            'online_devices': online_devices,
            'avg_aforo_percentage': round(avg_aforo_percentage, 2),
            'aforo_distribution': {
                'bajo': aforo_bajo,
                'medio': aforo_medio,
                'alto': aforo_alto
            },
            'recent_logs_24h': recent_logs,
            'peak_hours': peak_hours,
            'daily_trend': daily_trend
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
