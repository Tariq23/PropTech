# backend/app/api/properties.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.database import get_db_connection
from app.utils.auth import jwt_required_custom
from app.services.calculation_service import ShariaCompliantCalculator
import json

properties_bp = Blueprint('properties', __name__)

@properties_bp.route('/properties', methods=['GET'])
@jwt_required()
def get_properties():
    """Get filtered properties for investors."""
    # Get filter parameters
    min_price = request.args.get('min_price', type=float)
    max_price = request.args.get('max_price', type=float)
    min_yield = request.args.get('min_yield', type=float)
    city = request.args.get('city')
    property_type = request.args.get('property_type')
    strategy = request.args.get('strategy')
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 12, type=int)
    sort_by = request.args.get('sort_by', 'created_at')
    sort_order = request.args.get('sort_order', 'desc')
    
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        # Build query
        query = """
            SELECT 
                p.id, p.property_id, p.address, p.postcode, p.city,
                p.property_type, p.bedrooms, p.bathrooms, p.square_feet,
                p.asking_price, p.monthly_rent, p.bmv_score, p.tier,
                dp.title_en, dp.title_ar, dp.description_en, dp.description_ar,
                dp.strategy, dp.refurbishment_cost, dp.stamp_duty, dp.legal_fees,
                dp.sourcing_fee, dp.other_costs, dp.annual_costs,
                dp.images, dp.documents
            FROM properties p
            JOIN deal_packages dp ON p.id = dp.property_id
            WHERE p.published = TRUE AND dp.published = TRUE
        """
        
        params = []
        
        if min_price:
            query += " AND p.asking_price >= %s"
            params.append(min_price)
        
        if max_price:
            query += " AND p.asking_price <= %s"
            params.append(max_price)
        
        if city:
            query += " AND p.city ILIKE %s"
            params.append(f'%{city}%')
        
        if property_type:
            query += " AND p.property_type = %s"
            params.append(property_type)
        
        if strategy:
            query += " AND dp.strategy = %s"
            params.append(strategy)
        
        # Add sorting
        valid_sort_fields = ['asking_price', 'monthly_rent', 'created_at', 'bmv_score']
        if sort_by in valid_sort_fields:
            query += f" ORDER BY p.{sort_by} {sort_order.upper()}"
        
        # Add pagination
        query += " LIMIT %s OFFSET %s"
        params.extend([per_page, (page - 1) * per_page])
        
        cursor.execute(query, params)
        properties = cursor.fetchall()
        
        # Get total count
        count_query = """
            SELECT COUNT(*) as total
            FROM properties p
            JOIN deal_packages dp ON p.id = dp.property_id
            WHERE p.published = TRUE AND dp.published = TRUE
        """
        
        if min_price or max_price or city or property_type or strategy:
            count_params = params[:-2]  # Remove pagination params
            cursor.execute(count_query + query.split('WHERE')[1].split('ORDER')[0], count_params)
        else:
            cursor.execute(count_query)
        
        total = cursor.fetchone()['total']
        
        # Calculate Sharia-compliant metrics for each property
        calculator = ShariaCompliantCalculator()
        results = []
        
        for prop in properties:
            # Calculate metrics
            total_costs = (
                (prop['refurbishment_cost'] or 0) +
                (prop['stamp_duty'] or 0) +
                (prop['legal_fees'] or 0) +
                (prop['sourcing_fee'] or 0) +
                (prop['other_costs'] or 0)
            )
            
            metrics = calculator.calculate_investment_metrics(
                purchase_price=prop['asking_price'],
                monthly_rent=prop['monthly_rent'],
                annual_costs=prop['annual_costs'] or 0,
                total_costs=total_costs
            )
            
            # Parse JSON fields
            images = json.loads(prop['images']) if prop['images'] else []
            
            results.append({
                'id': prop['id'],
                'property_id': prop['property_id'],
                'title': {
                    'en': prop['title_en'],
                    'ar': prop['title_ar']
                },
                'description': {
                    'en': prop['description_en'],
                    'ar': prop['description_ar']
                },
                'address': prop['address'],
                'city': prop['city'],
                'postcode': prop['postcode'],
                'property_type': prop['property_type'],
                'bedrooms': prop['bedrooms'],
                'bathrooms': prop['bathrooms'],
                'square_feet': prop['square_feet'],
                'asking_price': float(prop['asking_price']) if prop['asking_price'] else 0,
                'monthly_rent': float(prop['monthly_rent']) if prop['monthly_rent'] else 0,
                'strategy': prop['strategy'],
                'bmv_score': prop['bmv_score'],
                'tier': prop['tier'],
                'images': images,
                'metrics': metrics
            })
        
        return jsonify({
            'properties': results,
            'pagination': {
                'total': total,
                'page': page,
                'per_page': per_page,
                'total_pages': (total + per_page - 1) // per_page
            }
        }), 200

@properties_bp.route('/properties/<int:property_id>', methods=['GET'])
@jwt_required()
def get_property_details(property_id):
    """Get detailed property information."""
    user_id = get_jwt_identity()
    
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        # Get property details
        cursor.execute("""
            SELECT 
                p.*, 
                dp.*,
                p.id as property_id
            FROM properties p
            JOIN deal_packages dp ON p.id = dp.property_id
            WHERE p.id = %s AND p.published = TRUE AND dp.published = TRUE
        """, (property_id,))
        
        property_data = cursor.fetchone()
        
        if not property_data:
            return jsonify({'message': 'Property not found'}), 404
        
        # Log property view
        cursor.execute("""
            INSERT INTO activity_logs (user_id, action, resource_type, resource_id)
            VALUES (%s, %s, %s, %s)
        """, (user_id, 'view_property', 'property', property_id))
        
        # Calculate detailed Sharia-compliant metrics
        calculator = ShariaCompliantCalculator()
        
        total_costs = (
            (property_data['refurbishment_cost'] or 0) +
            (property_data['stamp_duty'] or 0) +
            (property_data['legal_fees'] or 0) +
            (property_data['sourcing_fee'] or 0) +
            (property_data['other_costs'] or 0)
        )
        
        detailed_metrics = calculator.calculate_detailed_metrics(
            purchase_price=property_data['asking_price'],
            monthly_rent=property_data['monthly_rent'],
            refurbishment_cost=property_data['refurbishment_cost'] or 0,
            stamp_duty=property_data['stamp_duty'] or 0,
            legal_fees=property_data['legal_fees'] or 0,
            sourcing_fee=property_data['sourcing_fee'] or 0,
            other_costs=property_data['other_costs'] or 0,
            annual_costs=property_data['annual_costs'] or 0,
            void_percentage=property_data['void_percentage'] or 10,
            maintenance_percentage=property_data['maintenance_percentage'] or 5,
            management_percentage=property_data['management_percentage'] or 10
        )
        
        # Parse JSON fields
        images = json.loads(property_data['images']) if property_data['images'] else []
        documents = json.loads(property_data['documents']) if property_data['documents'] else []
        location_data = json.loads(property_data['location_data']) if property_data['location_data'] else {}
        
        result = {
            'id': property_data['property_id'],
            'title': {
                'en': property_data['title_en'],
                'ar': property_data['title_ar']
            },
            'description': {
                'en': property_data['description_en'],
                'ar': property_data['description_ar']
            },
            'address': property_data['address'],
            'city': property_data['city'],
            'postcode': property_data['postcode'],
            'property_details': {
                'type': property_data['property_type'],
                'bedrooms': property_data['bedrooms'],
                'bathrooms': property_data['bathrooms'],
                'square_feet': property_data['square_feet']
            },
            'financial_details': {
                'asking_price': float(property_data['asking_price']) if property_data['asking_price'] else 0,
                'refurbishment_cost': float(property_data['refurbishment_cost']) if property_data['refurbishment_cost'] else 0,
                'stamp_duty': float(property_data['stamp_duty']) if property_data['stamp_duty'] else 0,
                'legal_fees': float(property_data['legal_fees']) if property_data['legal_fees'] else 0,
                'sourcing_fee': float(property_data['sourcing_fee']) if property_data['sourcing_fee'] else 0,
                'other_costs': float(property_data['other_costs']) if property_data['other_costs'] else 0,
                'monthly_rent': float(property_data['monthly_rent']) if property_data['monthly_rent'] else 0
            },
            'investment_strategy': property_data['strategy'],
            'bmv_analysis': {
                'score': property_data['bmv_score'],
                'tier': property_data['tier']
            },
            'sharia_compliant_metrics': detailed_metrics,
            'images': images,
            'documents': documents,
            'location': location_data
        }
        
        return jsonify(result), 200