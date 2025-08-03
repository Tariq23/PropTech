# backend/app/__init__.py
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from app.config import Config
from app.database import init_db
import logging

def create_app(config_class=Config):
    """Create and configure the Flask application."""
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Configure logging
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger(__name__)
    
    # Initialize extensions
    CORS(app, origins=['http://localhost:3000', 'http://127.0.0.1:3000'])
    jwt = JWTManager(app)
    
    # Add a simple root route for testing
    @app.route('/')
    def health_check():
        return jsonify({
            'message': 'Property Investment Platform API',
            'status': 'running',
            'version': '1.0.0'
        })
    
    # Add API health check
    @app.route('/api/health')
    def api_health():
        return jsonify({'status': 'healthy', 'service': 'property-investment-api'})
    
    # Initialize database with error handling
    try:
        with app.app_context():
            init_db()
            logger.info("Database initialized successfully")
    except Exception as e:
        logger.error(f"Database initialization failed: {str(e)}")
        # Continue running even if DB init fails for development
    
    # Register blueprints
    try:
        from app.api.auth import auth_bp
        from app.api.properties import properties_bp
        from app.api.investors import investors_bp
        from app.api.deals import deals_bp
        from app.api.admin import admin_bp
        from app.api.public import public_bp
        
        app.register_blueprint(auth_bp, url_prefix='/api/auth')
        app.register_blueprint(properties_bp, url_prefix='/api')
        app.register_blueprint(investors_bp, url_prefix='/api')
        app.register_blueprint(deals_bp, url_prefix='/api')
        app.register_blueprint(admin_bp, url_prefix='/api/admin')
        app.register_blueprint(public_bp, url_prefix='/api/public')
        
        logger.info("All blueprints registered successfully")
        
    except ImportError as e:
        logger.error(f"Failed to import blueprints: {str(e)}")
        # Create basic routes for testing
        @app.route('/api/test')
        def test_route():
            return jsonify({'message': 'API is working', 'error': str(e)})
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            'error': 'Not Found',
            'message': 'The requested resource was not found',
            'available_endpoints': [
                '/',
                '/api/health',
                '/api/auth/login',
                '/api/auth/register',
                '/api/properties',
                '/api/public/stats'
            ]
        }), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({
            'error': 'Internal Server Error',
            'message': 'Something went wrong on our end'
        }), 500
    
    return app