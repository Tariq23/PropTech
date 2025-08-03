# backend/app/api/auth.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token, create_refresh_token,
    jwt_required, get_jwt_identity
)
from werkzeug.security import generate_password_hash, check_password_hash
from app.database import get_db_connection
from app.services.email_service import send_verification_email, send_password_reset_email
from app.utils.validators import validate_email, validate_password
import secrets
from datetime import datetime, timedelta

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user."""
    data = request.get_json()
    
    # Validate input
    email = data.get('email', '').lower().strip()
    password = data.get('password', '')
    full_name = data.get('full_name', '').strip()
    phone = data.get('phone', '').strip()
    language_preference = data.get('language_preference', 'en')
    
    # Validation
    if not validate_email(email):
        return jsonify({'message': 'Invalid email format'}), 400
    
    if not validate_password(password):
        return jsonify({
            'message': 'Password must be at least 8 characters with uppercase, lowercase, and numbers'
        }), 400
    
    if not full_name:
        return jsonify({'message': 'Full name is required'}), 400
    
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        # Check if user exists
        cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
        if cursor.fetchone():
            return jsonify({'message': 'Email already registered'}), 409
        
        # Create user
        password_hash = generate_password_hash(password)
        verification_token = secrets.token_urlsafe(32)
        
        cursor.execute("""
            INSERT INTO users (email, password_hash, full_name, phone, 
                             language_preference, verification_token)
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING id
        """, (email, password_hash, full_name, phone, language_preference, verification_token))
        
        user_id = cursor.fetchone()['id']
        
        # Create investor profile
        cursor.execute("""
            INSERT INTO investor_profiles (user_id)
            VALUES (%s)
        """, (user_id,))
        
        # Send verification email
        send_verification_email(email, verification_token, language_preference)
        
        return jsonify({
            'message': 'Registration successful. Please check your email to verify your account.',
            'user_id': user_id
        }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    """Login user."""
    data = request.get_json()
    email = data.get('email', '').lower().strip()
    password = data.get('password', '')
    
    if not email or not password:
        return jsonify({'message': 'Email and password required'}), 400
    
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT id, password_hash, is_active, is_verified, user_type, 
                   full_name, language_preference
            FROM users 
            WHERE email = %s
        """, (email,))
        
        user = cursor.fetchone()
        
        if not user or not check_password_hash(user['password_hash'], password):
            return jsonify({'message': 'Invalid credentials'}), 401
        
        if not user['is_active']:
            return jsonify({'message': 'Account is disabled'}), 403
        
        if not user['is_verified']:
            return jsonify({'message': 'Please verify your email first'}), 403
        
        # Create tokens
        access_token = create_access_token(identity=user['id'])
        refresh_token = create_refresh_token(identity=user['id'])
        
        # Log activity
        cursor.execute("""
            INSERT INTO activity_logs (user_id, action, ip_address, user_agent)
            VALUES (%s, %s, %s, %s)
        """, (user['id'], 'login', request.remote_addr, request.user_agent.string))
        
        return jsonify({
            'access_token': access_token,
            'refresh_token': refresh_token,
            'user': {
                'id': user['id'],
                'full_name': user['full_name'],
                'user_type': user['user_type'],
                'language_preference': user['language_preference']
            }
        }), 200

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """Refresh access token."""
    identity = get_jwt_identity()
    access_token = create_access_token(identity=identity)
    return jsonify({'access_token': access_token}), 200

@auth_bp.route('/verify-email/<token>', methods=['GET'])
def verify_email(token):
    """Verify email with token."""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        cursor.execute("""
            UPDATE users 
            SET is_verified = TRUE, verification_token = NULL
            WHERE verification_token = %s AND is_verified = FALSE
            RETURNING id
        """, (token,))
        
        result = cursor.fetchone()
        
        if result:
            return jsonify({'message': 'Email verified successfully'}), 200
        else:
            return jsonify({'message': 'Invalid or expired verification token'}), 400

@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    """Request password reset."""
    data = request.get_json()
    email = data.get('email', '').lower().strip()
    
    if not email:
        return jsonify({'message': 'Email required'}), 400
    
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT id, language_preference 
            FROM users 
            WHERE email = %s AND is_active = TRUE
        """, (email,))
        
        user = cursor.fetchone()
        
        if user:
            reset_token = secrets.token_urlsafe(32)
            expires = datetime.utcnow() + timedelta(hours=1)
            
            cursor.execute("""
                UPDATE users 
                SET reset_token = %s, reset_token_expires = %s
                WHERE id = %s
            """, (reset_token, expires, user['id']))
            
            send_password_reset_email(email, reset_token, user['language_preference'])
    
    # Always return success to prevent email enumeration
    return jsonify({'message': 'If the email exists, a reset link has been sent'}), 200

@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    """Reset password with token."""
    data = request.get_json()
    token = data.get('token', '')
    new_password = data.get('password', '')
    
    if not token or not new_password:
        return jsonify({'message': 'Token and password required'}), 400
    
    if not validate_password(new_password):
        return jsonify({
            'message': 'Password must be at least 8 characters with uppercase, lowercase, and numbers'
        }), 400
    
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        cursor.execute("""
            UPDATE users 
            SET password_hash = %s, reset_token = NULL, reset_token_expires = NULL
            WHERE reset_token = %s AND reset_token_expires > %s
            RETURNING id
        """, (generate_password_hash(new_password), token, datetime.utcnow()))
        
        result = cursor.fetchone()
        
        if result:
            return jsonify({'message': 'Password reset successfully'}), 200
        else:
            return jsonify({'message': 'Invalid or expired reset token'}), 400