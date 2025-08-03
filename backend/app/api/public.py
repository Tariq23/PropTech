# backend/app/api/public.py
from flask import Blueprint, jsonify
from app.database import get_db_connection, test_db_connection
import logging

logger = logging.getLogger(__name__)
public_bp = Blueprint('public', __name__)

@public_bp.route('/stats', methods=['GET'])
def get_public_stats():
    """Get public platform statistics."""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            
            # Get property count
            cursor.execute("SELECT COUNT(*) as count FROM properties WHERE published = 1" if 
                          conn.__class__.__name__ == 'Connection' else  # SQLite
                          "SELECT COUNT(*) as count FROM properties WHERE published = TRUE")
            
            result = cursor.fetchone()
            property_count = result['count'] if hasattr(result, 'keys') else result[0]
            
            # Get user count
            cursor.execute("SELECT COUNT(*) as count FROM users WHERE user_type = 'investor'")
            result = cursor.fetchone()
            investor_count = result['count'] if hasattr(result, 'keys') else result[0]
            
            return jsonify({
                'properties': {
                    'active_listings': property_count,
                    'average_price': 200000,  # Placeholder
                    'average_yield': 6.5  # Placeholder
                },
                'investors': {
                    'verified_count': investor_count,
                    'countries': 12  # Placeholder
                },
                'status': 'success'
            }), 200
            
    except Exception as e:
        logger.error(f"Error getting stats: {e}")
        return jsonify({
            'properties': {
                'active_listings': 0,
                'average_price': 0,
                'average_yield': 0
            },
            'investors': {
                'verified_count': 0,
                'countries': 0
            },
            'status': 'error',
            'message': str(e)
        }), 200

@public_bp.route('/test', methods=['GET'])
def test_endpoint():
    """Simple test endpoint."""
    db_status = test_db_connection()
    
    return jsonify({
        'message': 'Public API is working!',
        'database_connected': db_status,
        'endpoints': [
            '/api/public/stats',
            '/api/public/test'
        ]
    }), 200

@public_bp.route('/contact', methods=['POST'])
def contact_form():
    """Handle public contact form submissions."""
    # Simplified version for testing
    return jsonify({
        'message': 'Contact form received (test mode)',
        'status': 'success'
    }), 200