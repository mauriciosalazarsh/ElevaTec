from app import db
from datetime import datetime

class Device(db.Model):
    __tablename__ = 'devices'

    id = db.Column(db.Integer, primary_key=True)
    device_id = db.Column(db.String(50), unique=True, nullable=False)
    floor = db.Column(db.Integer, nullable=False)
    ip_address = db.Column(db.String(50))
    last_seen = db.Column(db.DateTime)
    status = db.Column(db.String(20), default='offline')  # 'online' or 'offline'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'device_id': self.device_id,
            'floor': self.floor,
            'ip_address': self.ip_address,
            'last_seen': self.last_seen.isoformat() if self.last_seen else None,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
