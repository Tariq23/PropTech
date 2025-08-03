# backend/app/api/investors.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.database import get_db_connection
from app.utils.auth import jwt_required_custom
from app.services.storage_service import StorageService
from werkzeug.utils import secure_filename
import os

investors_bp = Blueprint('investors', __name__)

@investors_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Get investor profile details."""
    user_id = get_jwt_identity()
    
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        # Get user and investor profile data
        cursor.execute("""
            SELECT 
                u.id, u.email, u.full_name, u.phone, u.language_preference,
                u.is_verified, u.created_at,
                ip.investor_type, ip.nationality, ip.min_investment, ip.max_investment,
                ip.target_yield, ip.preferred_regions, ip.preferred_property_types,
                ip.investment_strategies, ip.sharia_compliant_only
            FROM users u
            LEFT JOIN investor_profiles ip ON u.id = ip.user_id
            WHERE u.id = %s
        """, (user_id,))
        
        user_data = cursor.fetchone()
        
        if not user_data:
            return jsonify({'message': 'User not found'}), 404
        
        return jsonify({
            'id': user_data['id'],
            'email': user_data['email'],
            'full_name': user_data['full_name'],
            'phone': user_data['phone'],
            'language_preference': user_data['language_preference'],
            'is_verified': user_data['is_verified'],
            'created_at': user_data['created_at'].isoformat() if user_data['created_at'] else None,
            'investor_profile': {
                'investor_type': user_data['investor_type'],
                'nationality': user_data['nationality'],
                'min_investment': float(user_data['min_investment']) if user_data['min_investment'] else None,
                'max_investment': float(user_data['max_investment']) if user_data['max_investment'] else None,
                'target_yield': float(user_data['target_yield']) if user_data['target_yield'] else None,
                'preferred_regions': user_data['preferred_regions'] or [],
                'preferred_property_types': user_data['preferred_property_types'] or [],
                'investment_strategies': user_data['investment_strategies'] or [],
                'sharia_compliant_only': user_data['sharia_compliant_only']
            }
        }), 200

@investors_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    """Update investor profile."""
    user_id = get_jwt_identity()
    data = request.get_json()
    section = data.get('section', 'personal')
    
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        if section == 'personal':
            # Update personal information
            cursor.execute("""
                UPDATE users 
                SET full_name = %s, phone = %s, language_preference = %s, updated_at = CURRENT_TIMESTAMP
                WHERE id = %s
            """, (
                data.get('full_name'),
                data.get('phone'),
                data.get('language_preference', 'en'),
                user_id
            ))
            
        elif section == 'investment':
            # Check if investor profile exists
            cursor.execute("SELECT id FROM investor_profiles WHERE user_id = %s", (user_id,))
            profile_exists = cursor.fetchone()
            
            if profile_exists:
                # Update existing profile
                cursor.execute("""
                    UPDATE investor_profiles 
                    SET investor_type = %s, nationality = %s, min_investment = %s,
                        max_investment = %s, target_yield = %s, preferred_regions = %s,
                        preferred_property_types = %s, investment_strategies = %s,
                        sharia_compliant_only = %s, updated_at = CURRENT_TIMESTAMP
                    WHERE user_id = %s
                """, (
                    data.get('investor_type'),
                    data.get('nationality'),
                    data.get('min_investment'),
                    data.get('max_investment'),
                    data.get('target_yield'),
                    data.get('preferred_regions', []),
                    data.get('preferred_property_types', []),
                    data.get('investment_strategies', []),
                    data.get('sharia_compliant_only', True),
                    user_id
                ))
            else:
                # Create new profile
                cursor.execute("""
                    INSERT INTO investor_profiles 
                    (user_id, investor_type, nationality, min_investment, max_investment,
                     target_yield, preferred_regions, preferred_property_types,
                     investment_strategies, sharia_compliant_only)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    user_id,
                    data.get('investor_type'),
                    data.get('nationality'),
                    data.get('min_investment'),
                    data.get('max_investment'),
                    data.get('target_yield'),
                    data.get('preferred_regions', []),
                    data.get('preferred_property_types', []),
                    data.get('investment_strategies', []),
                    data.get('sharia_compliant_only', True)
                ))
        
        return jsonify({'message': 'Profile updated successfully'}), 200

@investors_bp.route('/kyc-upload', methods=['POST'])
@jwt_required()
def upload_kyc_document():
    """Upload KYC documents."""
    user_id = get_jwt_identity()
    
    if 'file' not in request.files:
        return jsonify({'message': 'No file provided'}), 400
    
    file = request.files['file']
    document_type = request.form.get('document_type', 'other')
    
    if file.filename == '':
        return jsonify({'message': 'No file selected'}), 400
    
    # Validate file type
    allowed_extensions = {'pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'}
    file_ext = file.filename.rsplit('.', 1)[1].lower() if '.' in file.filename else ''
    
    if file_ext not in allowed_extensions:
        return jsonify({'message': 'Invalid file type'}), 400
    
    # Save file using storage service
    storage_service = StorageService()
    file_path, file_name = storage_service.save_file(file, user_id, document_type)
    
    # Save document record to database
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        cursor.execute("""
            INSERT INTO kyc_documents 
            (user_id, document_type, file_path, file_name, status)
            VALUES (%s, %s, %s, %s, 'pending')
            RETURNING id
        """, (user_id, document_type, file_path, file_name))
        
        document_id = cursor.fetchone()['id']
        
        # Log activity
        cursor.execute("""
            INSERT INTO activity_logs (user_id, action, resource_type, resource_id)
            VALUES (%s, 'kyc_upload', 'document', %s)
        """, (user_id, document_id))
    
    return jsonify({
        'message': 'Document uploaded successfully',
        'document_id': document_id
    }), 201

@investors_bp.route('/kyc-documents', methods=['GET'])
@jwt_required()
def get_kyc_documents():
    """Get list of uploaded KYC documents."""
    user_id = get_jwt_identity()
    
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT id, document_type, file_name, status, uploaded_at, notes
            FROM kyc_documents
            WHERE user_id = %s
            ORDER BY uploaded_at DESC
        """, (user_id,))
        
        documents = cursor.fetchall()
        
        return jsonify([{
            'id': doc['id'],
            'document_type': doc['document_type'],
            'file_name': doc['file_name'],
            'status': doc['status'],
            'uploaded_at': doc['uploaded_at'].isoformat() if doc['uploaded_at'] else None,
            'notes': doc['notes']
        } for doc in documents]), 200

@investors_bp.route('/documents/<int:document_id>/download', methods=['GET'])
@jwt_required()
def download_document(document_id):
    """Download a KYC document."""
    user_id = get_jwt_identity()
    
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        # Verify document belongs to user
        cursor.execute("""
            SELECT file_path, file_name
            FROM kyc_documents
            WHERE id = %s AND user_id = %s
        """, (document_id, user_id))
        
        document = cursor.fetchone()
        
        if not document:
            return jsonify({'message': 'Document not found'}), 404
        
        storage_service = StorageService()
        return storage_service.serve_file(document['file_path'], document['file_name'])