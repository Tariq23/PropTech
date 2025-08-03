# backend/app/api/deals.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.database import get_db_connection
from app.services.calculation_service import ShariaCompliantCalculator
import json

deals_bp = Blueprint('deals', __name__)

@deals_bp.route('/deals/<int:property_id>/interest', methods=['POST'])
@jwt_required()
def express_interest(property_id):
    """Express interest in a property."""
    user_id = get_jwt_identity()
    data = request.get_json()
    
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        # Check if property exists and is published
        cursor.execute("""
            SELECT p.id 
            FROM properties p
            JOIN deal_packages dp ON p.id = dp.property_id
            WHERE p.id = %s AND p.published = TRUE AND dp.published = TRUE
        """, (property_id,))
        
        if not cursor.fetchone():
            return jsonify({'message': 'Property not found or not available'}), 404
        
        # Check if already expressed interest
        cursor.execute("""
            SELECT id FROM investor_activities
            WHERE investor_id = %s AND property_id = %s AND activity_type = 'interest_expressed'
        """, (user_id, property_id))
        
        if cursor.fetchone():
            return jsonify({'message': 'Interest already expressed'}), 400
        
        # Record interest
        cursor.execute("""
            INSERT INTO investor_activities (investor_id, property_id, activity_type, activity_data)
            VALUES (%s, %s, 'interest_expressed', %s)
        """, (
            user_id,
            property_id,
            json.dumps({
                'message': data.get('message', ''),
                'preferred_contact_method': data.get('contact_method', 'email')
            })
        ))
        
        # Send notification to admin
        # Implement notification service
        
        return jsonify({'message': 'Interest expressed successfully'}), 200

@deals_bp.route('/deals/<int:property_id>/schedule-viewing', methods=['POST'])
@jwt_required()
def schedule_viewing(property_id):
    """Schedule a viewing for a property."""
    user_id = get_jwt_identity()
    data = request.get_json()
    
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        # Validate property
        cursor.execute("""
            SELECT p.id 
            FROM properties p
            JOIN deal_packages dp ON p.id = dp.property_id
            WHERE p.id = %s AND p.published = TRUE AND dp.published = TRUE
        """, (property_id,))
        
        if not cursor.fetchone():
            return jsonify({'message': 'Property not found or not available'}), 404
        
        # Record viewing request
        cursor.execute("""
            INSERT INTO investor_activities (investor_id, property_id, activity_type, activity_data)
            VALUES (%s, %s, 'viewing_requested', %s)
        """, (
            user_id,
            property_id,
            json.dumps({
                'preferred_dates': data.get('preferred_dates', []),
                'preferred_time': data.get('preferred_time'),
                'notes': data.get('notes', '')
            })
        ))
        
        # Send notification to admin and property manager
        # Implement notification service
        
        return jsonify({'message': 'Viewing request submitted successfully'}), 200

@deals_bp.route('/deals/saved', methods=['GET'])
@jwt_required()
def get_saved_deals():
    """Get user's saved deals."""
    user_id = get_jwt_identity()
    
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT 
                p.id, p.property_id, p.address, p.city, p.postcode,
                p.property_type, p.bedrooms, p.bathrooms, p.asking_price,
                p.monthly_rent, p.bmv_score, p.tier,
                dp.title_en, dp.title_ar, dp.strategy, dp.images,
                ia.created_at as saved_at
            FROM investor_activities ia
            JOIN properties p ON ia.property_id = p.id
            JOIN deal_packages dp ON p.id = dp.property_id
            WHERE ia.investor_id = %s AND ia.activity_type = 'property_saved'
            ORDER BY ia.created_at DESC
        """, (user_id,))
        
        saved_deals = cursor.fetchall()
        
        calculator = ShariaCompliantCalculator()
        results = []
        
        for deal in saved_deals:
            # Calculate basic metrics
            total_costs = 0  # Simplified for saved deals view
            metrics = calculator.calculate_investment_metrics(
                purchase_price=deal['asking_price'],
                monthly_rent=deal['monthly_rent'],
                annual_costs=0,
                total_costs=total_costs
            )
            
            # Parse images
            images = json.loads(deal['images']) if deal['images'] else []
            
            results.append({
                'id': deal['id'],
                'property_id': deal['property_id'],
                'title': {
                    'en': deal['title_en'],
                    'ar': deal['title_ar']
                },
                'address': deal['address'],
                'city': deal['city'],
                'postcode': deal['postcode'],
                'property_type': deal['property_type'],
                'bedrooms': deal['bedrooms'],
                'bathrooms': deal['bathrooms'],
                'asking_price': float(deal['asking_price']) if deal['asking_price'] else 0,
                'monthly_rent': float(deal['monthly_rent']) if deal['monthly_rent'] else 0,
                'strategy': deal['strategy'],
                'bmv_score': deal['bmv_score'],
                'tier': deal['tier'],
                'images': images,
                'metrics': metrics,
                'saved_at': deal['saved_at'].isoformat() if deal['saved_at'] else None
            })
        
        return jsonify(results), 200

@deals_bp.route('/deals/<int:property_id>/save', methods=['POST'])
@jwt_required()
def save_deal(property_id):
    """Save a deal for later."""
    user_id = get_jwt_identity()
    
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        # Check if already saved
        cursor.execute("""
            SELECT id FROM investor_activities
            WHERE investor_id = %s AND property_id = %s AND activity_type = 'property_saved'
        """, (user_id, property_id))
        
        if cursor.fetchone():
            return jsonify({'message': 'Property already saved'}), 400
        
        # Save property
        cursor.execute("""
            INSERT INTO investor_activities (investor_id, property_id, activity_type)
            VALUES (%s, %s, 'property_saved')
        """, (user_id, property_id))
        
        return jsonify({'message': 'Property saved successfully'}), 200

@deals_bp.route('/deals/<int:property_id>/unsave', methods=['DELETE'])
@jwt_required()
def unsave_deal(property_id):
    """Remove a deal from saved list."""
    user_id = get_jwt_identity()
    
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        cursor.execute("""
            DELETE FROM investor_activities
            WHERE investor_id = %s AND property_id = %s AND activity_type = 'property_saved'
        """, (user_id, property_id))
        
        if cursor.rowcount == 0:
            return jsonify({'message': 'Property not in saved list'}), 404
        
        return jsonify({'message': 'Property removed from saved list'}), 200