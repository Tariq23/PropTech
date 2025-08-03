# backend/app/api/admin.py
from flask import Blueprint, request, jsonify
from app.database import get_db_connection
from app.utils.auth import jwt_required_custom
from app.services.email_service import send_verification_email
import json

admin_bp = Blueprint('admin', __name__)

# Admin authentication decorator
def admin_required():
    return jwt_required_custom(admin_only=True)

@admin_bp.route('/investors', methods=['GET'])
@admin_required()
def list_investors():
    """List all investors with their profiles."""
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    status = request.args.get('status')  # active, pending, verified
    
    offset = (page - 1) * per_page
    
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        # Build query
        query = """
            SELECT 
                u.id, u.email, u.full_name, u.phone, u.user_type,
                u.language_preference, u.is_active, u.is_verified, u.created_at,
                ip.investor_type, ip.nationality, ip.min_investment, ip.max_investment,
                COUNT(DISTINCT kd.id) as document_count,
                COUNT(DISTINCT kd.id) FILTER (WHERE kd.status = 'verified') as verified_documents
            FROM users u
            LEFT JOIN investor_profiles ip ON u.id = ip.user_id
            LEFT JOIN kyc_documents kd ON u.id = kd.user_id
            WHERE u.user_type = 'investor'
        """
        
        params = []
        
        if status == 'active':
            query += " AND u.is_active = TRUE"
        elif status == 'pending':
            query += " AND u.is_verified = FALSE"
        elif status == 'verified':
            query += " AND u.is_verified = TRUE"
        
        query += """
            GROUP BY u.id, ip.id
            ORDER BY u.created_at DESC
            LIMIT %s OFFSET %s
        """
        params.extend([per_page, offset])
        
        cursor.execute(query, params)
        investors = cursor.fetchall()
        
        # Get total count
        count_query = """
            SELECT COUNT(*) as total
            FROM users
            WHERE user_type = 'investor'
        """
        if status:
            if status == 'active':
                count_query += " AND is_active = TRUE"
            elif status == 'pending':
                count_query += " AND is_verified = FALSE"
            elif status == 'verified':
                count_query += " AND is_verified = TRUE"
        
        cursor.execute(count_query)
        total = cursor.fetchone()['total']
        
        return jsonify({
            'investors': [{
                'id': inv['id'],
                'email': inv['email'],
                'full_name': inv['full_name'],
                'phone': inv['phone'],
                'language_preference': inv['language_preference'],
                'is_active': inv['is_active'],
                'is_verified': inv['is_verified'],
                'created_at': inv['created_at'].isoformat() if inv['created_at'] else None,
                'investor_type': inv['investor_type'],
                'nationality': inv['nationality'],
                'investment_range': {
                    'min': float(inv['min_investment']) if inv['min_investment'] else None,
                    'max': float(inv['max_investment']) if inv['max_investment'] else None
                },
                'kyc_status': {
                    'documents_uploaded': inv['document_count'],
                    'documents_verified': inv['verified_documents']
                }
            } for inv in investors],
            'pagination': {
                'total': total,
                'page': page,
                'per_page': per_page,
                'total_pages': (total + per_page - 1) // per_page
            }
        }), 200

@admin_bp.route('/investors/<int:investor_id>', methods=['GET'])
@admin_required()
def get_investor_details(investor_id):
    """Get detailed information about a specific investor."""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        # Get investor details
        cursor.execute("""
            SELECT 
                u.*, 
                ip.*,
                u.id as user_id
            FROM users u
            LEFT JOIN investor_profiles ip ON u.id = ip.user_id
            WHERE u.id = %s AND u.user_type = 'investor'
        """, (investor_id,))
        
        investor = cursor.fetchone()
        
        if not investor:
            return jsonify({'message': 'Investor not found'}), 404
        
        # Get KYC documents
        cursor.execute("""
            SELECT * FROM kyc_documents
            WHERE user_id = %s
            ORDER BY uploaded_at DESC
        """, (investor_id,))
        
        documents = cursor.fetchall()
        
        # Get recent activities
        cursor.execute("""
            SELECT * FROM activity_logs
            WHERE user_id = %s
            ORDER BY created_at DESC
            LIMIT 20
        """, (investor_id,))
        
        activities = cursor.fetchall()
        
        return jsonify({
            'investor': {
                'id': investor['user_id'],
                'email': investor['email'],
                'full_name': investor['full_name'],
                'phone': investor['phone'],
                'user_type': investor['user_type'],
                'language_preference': investor['language_preference'],
                'is_active': investor['is_active'],
                'is_verified': investor['is_verified'],
                'created_at': investor['created_at'].isoformat() if investor['created_at'] else None,
                'profile': {
                    'investor_type': investor['investor_type'],
                    'nationality': investor['nationality'],
                    'min_investment': float(investor['min_investment']) if investor['min_investment'] else None,
                    'max_investment': float(investor['max_investment']) if investor['max_investment'] else None,
                    'target_yield': float(investor['target_yield']) if investor['target_yield'] else None,
                    'preferred_regions': investor['preferred_regions'] or [],
                    'preferred_property_types': investor['preferred_property_types'] or [],
                    'investment_strategies': investor['investment_strategies'] or [],
                    'sharia_compliant_only': investor['sharia_compliant_only']
                }
            },
            'documents': [{
                'id': doc['id'],
                'document_type': doc['document_type'],
                'file_name': doc['file_name'],
                'status': doc['status'],
                'uploaded_at': doc['uploaded_at'].isoformat() if doc['uploaded_at'] else None,
                'reviewed_at': doc['reviewed_at'].isoformat() if doc['reviewed_at'] else None,
                'notes': doc['notes']
            } for doc in documents],
            'recent_activities': [{
                'id': act['id'],
                'action': act['action'],
                'resource_type': act['resource_type'],
                'resource_id': act['resource_id'],
                'created_at': act['created_at'].isoformat() if act['created_at'] else None
            } for act in activities]
        }), 200

@admin_bp.route('/investors/<int:investor_id>/verify', methods=['PUT'])
@admin_required()
def verify_investor(investor_id):
    """Verify an investor's KYC."""
    data = request.get_json()
    admin_id = get_jwt_identity()
    
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        # Update user verification status
        cursor.execute("""
            UPDATE users 
            SET is_verified = TRUE, updated_at = CURRENT_TIMESTAMP
            WHERE id = %s
        """, (investor_id,))
        
        # Update KYC documents if provided
        if 'document_ids' in data:
            for doc_id in data['document_ids']:
                cursor.execute("""
                    UPDATE kyc_documents
                    SET status = %s, reviewed_by = %s, reviewed_at = CURRENT_TIMESTAMP, notes = %s
                    WHERE id = %s AND user_id = %s
                """, (
                    data.get('status', 'verified'),
                    admin_id,
                    data.get('notes'),
                    doc_id,
                    investor_id
                ))
        
        # Log activity
        cursor.execute("""
            INSERT INTO activity_logs (user_id, action, resource_type, resource_id)
            VALUES (%s, 'verify_investor', 'user', %s)
        """, (admin_id, investor_id))
        
        # Get investor email for notification
        cursor.execute("SELECT email, language_preference FROM users WHERE id = %s", (investor_id,))
        user = cursor.fetchone()
        
        # Send verification email (implement in email service)
        # send_verification_complete_email(user['email'], user['language_preference'])
        
        return jsonify({'message': 'Investor verified successfully'}), 200

@admin_bp.route('/properties', methods=['GET'])
@admin_required()
def list_all_properties():
    """List all properties including unpublished ones."""
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    status = request.args.get('status')  # pending, published, archived
    
    offset = (page - 1) * per_page
    
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        query = """
            SELECT 
                p.*,
                dp.id as deal_package_id,
                dp.title_en, dp.title_ar,
                dp.published as deal_published
            FROM properties p
            LEFT JOIN deal_packages dp ON p.id = dp.property_id
            WHERE 1=1
        """
        
        params = []
        
        if status == 'published':
            query += " AND p.published = TRUE AND dp.published = TRUE"
        elif status == 'pending':
            query += " AND (p.published = FALSE OR dp.published = FALSE OR dp.id IS NULL)"
        
        query += " ORDER BY p.created_at DESC LIMIT %s OFFSET %s"
        params.extend([per_page, offset])
        
        cursor.execute(query, params)
        properties = cursor.fetchall()
        
        # Get total count
        count_query = "SELECT COUNT(*) as total FROM properties"
        if status:
            if status == 'published':
                count_query += " WHERE published = TRUE"
            elif status == 'pending':
                count_query += " WHERE published = FALSE"
        
        cursor.execute(count_query)
        total = cursor.fetchone()['total']
        
        return jsonify({
            'properties': [{
                'id': prop['id'],
                'property_id': prop['property_id'],
                'address': prop['address'],
                'city': prop['city'],
                'postcode': prop['postcode'],
                'property_type': prop['property_type'],
                'bedrooms': prop['bedrooms'],
                'bathrooms': prop['bathrooms'],
                'asking_price': float(prop['asking_price']) if prop['asking_price'] else None,
                'monthly_rent': float(prop['monthly_rent']) if prop['monthly_rent'] else None,
                'bmv_score': prop['bmv_score'],
                'tier': prop['tier'],
                'status': prop['status'],
                'published': prop['published'],
                'has_deal_package': bool(prop['deal_package_id']),
                'deal_published': prop['deal_published'],
                'created_at': prop['created_at'].isoformat() if prop['created_at'] else None
            } for prop in properties],
            'pagination': {
                'total': total,
                'page': page,
                'per_page': per_page,
                'total_pages': (total + per_page - 1) // per_page
            }
        }), 200

@admin_bp.route('/deals', methods=['POST'])
@admin_required()
def create_deal_package():
    """Create a new deal package for a property."""
    data = request.get_json()
    admin_id = get_jwt_identity()
    
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        # Check if property exists
        cursor.execute("SELECT id FROM properties WHERE id = %s", (data['property_id'],))
        if not cursor.fetchone():
            return jsonify({'message': 'Property not found'}), 404
        
        # Create deal package
        cursor.execute("""
            INSERT INTO deal_packages 
            (property_id, title_en, title_ar, description_en, description_ar,
             strategy, refurbishment_cost, stamp_duty, legal_fees, sourcing_fee,
             other_costs, annual_costs, void_percentage, maintenance_percentage,
             management_percentage, images, documents, location_data)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id
        """, (
            data['property_id'],
            data['title_en'],
            data.get('title_ar'),
            data['description_en'],
            data.get('description_ar'),
            data['strategy'],
            data.get('refurbishment_cost', 0),
            data['stamp_duty'],
            data['legal_fees'],
            data['sourcing_fee'],
            data.get('other_costs', 0),
            data['annual_costs'],
            data.get('void_percentage', 10),
            data.get('maintenance_percentage', 5),
            data.get('management_percentage', 10),
            json.dumps(data.get('images', [])),
            json.dumps(data.get('documents', [])),
            json.dumps(data.get('location_data', {}))
        ))
        
        deal_id = cursor.fetchone()['id']
        
        # Log activity
        cursor.execute("""
            INSERT INTO activity_logs (user_id, action, resource_type, resource_id)
            VALUES (%s, 'create_deal_package', 'deal', %s)
        """, (admin_id, deal_id))
        
        return jsonify({
            'message': 'Deal package created successfully',
            'deal_id': deal_id
        }), 201

@admin_bp.route('/deals/<int:deal_id>', methods=['PUT'])
@admin_required()
def update_deal_package(deal_id):
    """Update an existing deal package."""
    data = request.get_json()
    admin_id = get_jwt_identity()
    
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        # Build update query dynamically
        update_fields = []
        params = []
        
        updatable_fields = [
            'title_en', 'title_ar', 'description_en', 'description_ar',
            'strategy', 'refurbishment_cost', 'stamp_duty', 'legal_fees',
            'sourcing_fee', 'other_costs', 'annual_costs', 'void_percentage',
            'maintenance_percentage', 'management_percentage'
        ]
        
        for field in updatable_fields:
            if field in data:
                update_fields.append(f"{field} = %s")
                params.append(data[field])
        
        # Handle JSON fields
        if 'images' in data:
            update_fields.append("images = %s")
            params.append(json.dumps(data['images']))
        
        if 'documents' in data:
            update_fields.append("documents = %s")
            params.append(json.dumps(data['documents']))
        
        if 'location_data' in data:
            update_fields.append("location_data = %s")
            params.append(json.dumps(data['location_data']))
        
        if not update_fields:
            return jsonify({'message': 'No fields to update'}), 400
        
        update_fields.append("updated_at = CURRENT_TIMESTAMP")
        params.append(deal_id)
        
        query = f"""
            UPDATE deal_packages 
            SET {', '.join(update_fields)}
            WHERE id = %s
        """
        
        cursor.execute(query, params)
        
        if cursor.rowcount == 0:
            return jsonify({'message': 'Deal package not found'}), 404
        
        # Log activity
        cursor.execute("""
            INSERT INTO activity_logs (user_id, action, resource_type, resource_id)
            VALUES (%s, 'update_deal_package', 'deal', %s)
        """, (admin_id, deal_id))
        
        return jsonify({'message': 'Deal package updated successfully'}), 200

@admin_bp.route('/deals/<int:deal_id>/publish', methods=['POST'])
@admin_required()
def publish_deal(deal_id):
    """Publish or unpublish a deal."""
    data = request.get_json()
    publish = data.get('publish', True)
    admin_id = get_jwt_identity()
    
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        # Update deal package
        cursor.execute("""
            UPDATE deal_packages 
            SET published = %s, updated_at = CURRENT_TIMESTAMP
            WHERE id = %s
            RETURNING property_id
        """, (publish, deal_id))
        
        result = cursor.fetchone()
        if not result:
            return jsonify({'message': 'Deal package not found'}), 404
        
        property_id = result['property_id']
        
        # Also update property published status
        cursor.execute("""
            UPDATE properties 
            SET published = %s, updated_at = CURRENT_TIMESTAMP
            WHERE id = %s
        """, (publish, property_id))
        
        # Log activity
        cursor.execute("""
            INSERT INTO activity_logs (user_id, action, resource_type, resource_id)
            VALUES (%s, %s, 'deal', %s)
        """, (
            admin_id,
            'publish_deal' if publish else 'unpublish_deal',
            deal_id
        ))
        
        # If publishing, trigger matching service
        if publish:
            from app.services.matching_service import MatchingService
            matching_service = MatchingService()
            matching_service.match_property_to_investors(property_id)
        
        return jsonify({
            'message': f'Deal {"published" if publish else "unpublished"} successfully'
        }), 200