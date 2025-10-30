from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

db = SQLAlchemy()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)

    # Configuration
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'dev-jwt-secret-key')

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Register blueprints
    from app.routes.auth import auth_bp
    from app.routes.elevators import elevators_bp
    from app.routes.devices import devices_bp
    from app.routes.data import data_bp
    from app.routes.metrics import metrics_bp

    app.register_blueprint(auth_bp, url_prefix='/api')
    app.register_blueprint(elevators_bp, url_prefix='/api')
    app.register_blueprint(devices_bp, url_prefix='/api')
    app.register_blueprint(data_bp, url_prefix='/api')
    app.register_blueprint(metrics_bp, url_prefix='/api')

    # Create tables
    with app.app_context():
        db.create_all()
        # Create default admin user
        from app.models.user import User
        from werkzeug.security import generate_password_hash

        admin = User.query.filter_by(email='admin@elevatec.com').first()
        if not admin:
            admin = User(
                name='Administrator',
                email='admin@elevatec.com',
                password_hash=generate_password_hash('admin123'),
                role='admin'
            )
            db.session.add(admin)
            db.session.commit()
            print("Default admin user created: admin@elevatec.com / admin123")

    return app
