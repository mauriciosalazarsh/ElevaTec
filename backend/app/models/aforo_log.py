from app import db
from datetime import datetime

class AforoLog(db.Model):
    __tablename__ = 'aforo_logs'

    id = db.Column(db.Integer, primary_key=True)
    elevator_id = db.Column(db.Integer, db.ForeignKey('elevators.id'), nullable=False)
    people_count = db.Column(db.Integer, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'elevator_id': self.elevator_id,
            'people_count': self.people_count,
            'timestamp': self.timestamp.isoformat() if self.timestamp else None
        }
