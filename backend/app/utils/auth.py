# backend/app/utils/auth.py
from functools import wraps
from flask import jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from app.database import get_db_connection

def jwt_required_custom(admin_only=False):
    """Custom JWT decorator with admin check."""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            verify_jwt_in_request()
            
            if admin_only:
                user_id = get_jwt_identity()
                with get_db_connection() as conn:
                    cursor = conn.cursor()
                    cursor.execute(
                        "SELECT user_type FROM users WHERE id = %s",
                        (user_id,)
                    )
                    user = cursor.fetchone()
                    
                    if not user or user['user_type'] != 'admin':
                        return jsonify({'message': 'Admin access required'}), 403
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator