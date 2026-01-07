import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from models import db

# Load environment variables
load_dotenv()

def create_app():
    app = Flask(__name__)
    
    # Configuration
    base_dir = os.path.abspath(os.path.dirname(__file__))
    # Use forward slashes for cross-platform compatibility
    db_path = os.path.join(base_dir, 'dca.db').replace('\\', '/')
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
    
    # Initialize CORS with explicit configuration
    CORS(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173", "http://127.0.0.1:3000"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True
        },
        r"/health": {
            "origins": "*"
        }
    })
    
    db.init_app(app)
    
    # Register Blueprints
    from routes.auth_routes import auth_bp
    from routes.case_routes import cases_bp
    from routes.agency_routes import agencies_bp
    from routes.customer_routes import customers_bp
    from routes.dashboard_routes import dashboard_bp
    from routes.action_routes import actions_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(cases_bp, url_prefix='/api/cases')
    app.register_blueprint(agencies_bp, url_prefix='/api/agencies')
    app.register_blueprint(customers_bp, url_prefix='/api/customers')
    app.register_blueprint(dashboard_bp, url_prefix='/api') # /api/stats, /api/performance etc
    app.register_blueprint(actions_bp, url_prefix='/api/actions')

    @app.route('/health')
    def health_check():
        return {'status': 'healthy'}, 200

    return app

if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        db.create_all()
    # Bind to 0.0.0.0 for cross-platform compatibility
    app.run(debug=True, host='0.0.0.0', port=5000)
