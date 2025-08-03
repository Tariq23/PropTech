# backend/app/services/matching_service.py
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.models.investor import Investor
from app.models.property import Property
from app.models.deal import Deal
from datetime import datetime

class MatchingService:
    """Handle property-investor matching logic."""
    
    def __init__(self, db_session: Session):
        self.db = db_session
    
    def calculate_bmv_score(self, property: Property) -> float:
        """
        Calculate Below Market Value (BMV) score for a property.
        Higher score indicates better value.
        """
        score = 0.0
        
        # Base score from property analysis
        if property.market_value and property.asking_price:
            discount_percentage = ((property.market_value - property.asking_price) / property.market_value) * 100
            score += min(discount_percentage * 2, 40)  # Max 40 points for discount
        
        # Location score (0-20 points)
        if property.location_score:
            score += property.location_score
        
        # Property condition score (0-15 points)
        if property.condition_score:
            score += property.condition_score
        
        # Rental yield score (0-15 points)
        if property.net_yield:
            if property.net_yield >= 8:
                score += 15
            elif property.net_yield >= 6:
                score += 10
            elif property.net_yield >= 4:
                score += 5
        
        # ROI potential score (0-10 points)
        if property.roi_potential:
            score += min(property.roi_potential, 10)
        
        return min(score, 100)  # Cap at 100
    
    def match_investor_to_properties(self, investor: Investor, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Match an investor to suitable properties based on their criteria.
        Returns list of properties with match scores.
        """
        # Get investor preferences
        investor_preferences = investor.investment_preferences
        
        # Base query for published properties
        query = self.db.query(Property).filter(Property.status == 'published')
        
        # Apply filters based on investor preferences
        if investor_preferences.get('min_investment'):
            query = query.filter(Property.asking_price >= investor_preferences['min_investment'])
        
        if investor_preferences.get('max_investment'):
            query = query.filter(Property.asking_price <= investor_preferences['max_investment'])
        
        if investor_preferences.get('target_regions'):
            regions = investor_preferences['target_regions']
            query = query.filter(Property.region.in_(regions))
        
        if investor_preferences.get('property_types'):
            property_types = investor_preferences['property_types']
            query = query.filter(Property.property_type.in_(property_types))
        
        if investor_preferences.get('min_yield'):
            query = query.filter(Property.net_yield >= investor_preferences['min_yield'])
        
        # Get properties
        properties = query.limit(limit).all()
        
        # Calculate match scores
        matches = []
        for property in properties:
            match_score = self._calculate_match_score(investor, property)
            bmv_score = self.calculate_bmv_score(property)
            
            matches.append({
                'property': property,
                'match_score': match_score,
                'bmv_score': bmv_score,
                'total_score': (match_score + bmv_score) / 2
            })
        
        # Sort by total score (descending)
        matches.sort(key=lambda x: x['total_score'], reverse=True)
        
        return matches
    
    def _calculate_match_score(self, investor: Investor, property: Property) -> float:
        """
        Calculate how well a property matches investor preferences.
        Returns score from 0-100.
        """
        score = 0.0
        preferences = investor.investment_preferences
        
        # Budget match (0-30 points)
        if preferences.get('min_investment') and preferences.get('max_investment'):
            budget_range = preferences['max_investment'] - preferences['min_investment']
            budget_center = preferences['min_investment'] + (budget_range / 2)
            
            if property.asking_price:
                price_diff = abs(property.asking_price - budget_center)
                price_score = max(0, 30 - (price_diff / budget_range) * 30)
                score += price_score
        
        # Location match (0-25 points)
        if preferences.get('target_regions') and property.region:
            if property.region in preferences['target_regions']:
                score += 25
        
        # Property type match (0-20 points)
        if preferences.get('property_types') and property.property_type:
            if property.property_type in preferences['property_types']:
                score += 20
        
        # Yield match (0-15 points)
        if preferences.get('min_yield') and property.net_yield:
            if property.net_yield >= preferences['min_yield']:
                score += 15
        
        # Investment strategy match (0-10 points)
        if preferences.get('investment_strategy') and property.investment_strategy:
            if preferences['investment_strategy'] == property.investment_strategy:
                score += 10
        
        return min(score, 100)
    
    def get_investor_recommendations(self, investor_id: int, limit: int = 5) -> List[Dict[str, Any]]:
        """
        Get personalized property recommendations for an investor.
        """
        investor = self.db.query(Investor).filter(Investor.id == investor_id).first()
        if not investor:
            return []
        
        matches = self.match_investor_to_properties(investor, limit * 2)
        
        # Filter out properties the investor has already viewed or expressed interest in
        viewed_properties = {deal.property_id for deal in investor.deals}
        
        recommendations = []
        for match in matches:
            if match['property'].id not in viewed_properties:
                recommendations.append({
                    'property_id': match['property'].id,
                    'title': match['property'].title,
                    'location': match['property'].location,
                    'asking_price': match['property'].asking_price,
                    'net_yield': match['property'].net_yield,
                    'bmv_score': match['bmv_score'],
                    'match_score': match['match_score'],
                    'total_score': match['total_score'],
                    'image_url': match['property'].images[0] if match['property'].images else None
                })
                
                if len(recommendations) >= limit:
                    break
        
        return recommendations
    
    def create_deal_interest(self, investor_id: int, property_id: int, 
                           interest_level: str = 'interested') -> Deal:
        """
        Create a deal interest record when investor expresses interest in a property.
        """
        # Check if deal already exists
        existing_deal = self.db.query(Deal).filter(
            Deal.investor_id == investor_id,
            Deal.property_id == property_id
        ).first()
        
        if existing_deal:
            # Update existing deal
            existing_deal.interest_level = interest_level
            existing_deal.updated_at = datetime.utcnow()
            self.db.commit()
            return existing_deal
        
        # Create new deal
        deal = Deal(
            investor_id=investor_id,
            property_id=property_id,
            interest_level=interest_level,
            status='pending'
        )
        
        self.db.add(deal)
        self.db.commit()
        self.db.refresh(deal)
        
        return deal
    
    def get_property_analytics(self, property_id: int) -> Dict[str, Any]:
        """
        Get analytics for a specific property.
        """
        property = self.db.query(Property).filter(Property.id == property_id).first()
        if not property:
            return {}
        
        # Get deal statistics
        deals = self.db.query(Deal).filter(Deal.property_id == property_id).all()
        
        total_views = len(deals)
        interested_count = len([d for d in deals if d.interest_level == 'interested'])
        very_interested_count = len([d for d in deals if d.interest_level == 'very_interested'])
        
        # Calculate conversion rates
        interest_rate = (interested_count / total_views * 100) if total_views > 0 else 0
        very_interest_rate = (very_interested_count / total_views * 100) if total_views > 0 else 0
        
        return {
            'property_id': property_id,
            'total_views': total_views,
            'interested_count': interested_count,
            'very_interested_count': very_interested_count,
            'interest_rate': interest_rate,
            'very_interest_rate': very_interest_rate,
            'bmv_score': self.calculate_bmv_score(property),
            'avg_match_score': self._calculate_avg_match_score(property, deals)
        }
    
    def _calculate_avg_match_score(self, property: Property, deals: List[Deal]) -> float:
        """
        Calculate average match score for all investors who viewed this property.
        """
        if not deals:
            return 0.0
        
        total_score = 0.0
        count = 0
        
        for deal in deals:
            investor = deal.investor
            if investor:
                match_score = self._calculate_match_score(investor, property)
                total_score += match_score
                count += 1
        
        return total_score / count if count > 0 else 0.0
