from app import db
from datetime import datetime

class Elevator(db.Model):
    __tablename__ = 'elevators'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    floor = db.Column(db.Integer, nullable=False)
    capacity = db.Column(db.Integer, nullable=False)
    current_people = db.Column(db.Integer, default=0)
    device_id = db.Column(db.String(50))
    space_type = db.Column(db.String(50), default='ascensor')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationship with logs
    logs = db.relationship('AforoLog', backref='elevator', lazy=True, cascade='all, delete-orphan')

    def get_aforo_status(self):
        if self.capacity == 0:
            return 'bajo'
        ratio = self.current_people / self.capacity
        if ratio < 0.5:
            return 'bajo'
        elif ratio < 0.8:
            return 'medio'
        else:
            return 'alto'

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'floor': self.floor,
            'capacity': self.capacity,
            'current_people': self.current_people,
            'device_id': self.device_id,
            'space_type': self.space_type,
            'aforo_status': self.get_aforo_status(),
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
