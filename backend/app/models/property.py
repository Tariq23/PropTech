# backend/app/models/property.py
from dataclasses import dataclass
from typing import List, Optional, Dict
from datetime import datetime

@dataclass
class Property:
    id: Optional[int] = None
    property_id: Optional[str] = None
    address: Optional[str] = None
    postcode: Optional[str] = None
    city: Optional[str] = None
    property_type: Optional[str] = None
    bedrooms: Optional[int] = None
    bathrooms: Optional[int] = None
    square_feet: Optional[int] = None
    asking_price: Optional[float] = None
    estimated_value: Optional[float] = None
    monthly_rent: Optional[float] = None
    bmv_score: Optional[int] = None
    tier: Optional[str] = None
    status: Optional[str] = 'pending'
    published: bool = False
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    def calculate_net_yield(self, annual_costs: float) -> float:
        """Calculate Sharia-compliant net yield."""
        if not self.monthly_rent or not self.asking_price:
            return 0
        
        annual_rent = self.monthly_rent * 12
        net_income = annual_rent - annual_costs
        return (net_income / self.asking_price) * 100
    
    def calculate_roi(self, total_costs: float, annual_costs: float) -> float:
        """Calculate Return on Equity (Sharia-compliant)."""
        if not self.monthly_rent:
            return 0
        
        annual_rent = self.monthly_rent * 12
        net_income = annual_rent - annual_costs
        total_equity = self.asking_price + total_costs
        
        return (net_income / total_equity) * 100