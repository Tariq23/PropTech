# backend/app/models/deal.py
from dataclasses import dataclass
from typing import List, Optional, Dict
from datetime import datetime
from enum import Enum

class DealStatus(Enum):
    PENDING = "pending"
    ACTIVE = "active"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    ON_HOLD = "on_hold"

class DealStrategy(Enum):
    BTL = "btl"  # Buy to Let
    BRRR = "brrr"  # Buy, Refurbish, Rent, Refinance
    FLIP = "flip"  # Fix and Flip
    HMO = "hmo"  # House in Multiple Occupation
    COMMERCIAL = "commercial"
    DEVELOPMENT = "development"

@dataclass
class Deal:
    id: Optional[int] = None
    property_id: Optional[int] = None
    investor_id: Optional[int] = None
    deal_title: Optional[str] = None
    deal_description: Optional[str] = None
    strategy: Optional[DealStrategy] = None
    status: Optional[DealStatus] = DealStatus.PENDING
    
    # Financial Details
    purchase_price: Optional[float] = None
    asking_price: Optional[float] = None
    negotiated_price: Optional[float] = None
    deposit_required: Optional[float] = None
    mortgage_amount: Optional[float] = None
    
    # Costs
    legal_fees: Optional[float] = None
    survey_costs: Optional[float] = None
    stamp_duty: Optional[float] = None
    sourcing_fee: Optional[float] = None
    refurbishment_budget: Optional[float] = None
    other_costs: Optional[float] = None
    
    # Returns
    monthly_rent: Optional[float] = None
    annual_rent: Optional[float] = None
    projected_yield: Optional[float] = None
    estimated_completion_date: Optional[datetime] = None
    
    # Sharia Compliance
    is_sharia_compliant: bool = True
    sharia_notes: Optional[str] = None
    
    # Dates
    deal_created_date: Optional[datetime] = None
    exchange_date: Optional[datetime] = None
    completion_date: Optional[datetime] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    # Additional Data
    documents: List[str] = None
    notes: Optional[str] = None
    
    def __post_init__(self):
        if self.documents is None:
            self.documents = []
    
    def calculate_total_investment(self) -> float:
        """Calculate total investment required including all costs."""
        total = 0
        if self.purchase_price:
            total += self.purchase_price
        if self.legal_fees:
            total += self.legal_fees
        if self.survey_costs:
            total += self.survey_costs
        if self.stamp_duty:
            total += self.stamp_duty
        if self.sourcing_fee:
            total += self.sourcing_fee
        if self.refurbishment_budget:
            total += self.refurbishment_budget
        if self.other_costs:
            total += self.other_costs
        return total
    
    def calculate_net_yield(self) -> float:
        """Calculate net rental yield."""
        if not self.annual_rent or not self.purchase_price:
            return 0
        return (self.annual_rent / self.purchase_price) * 100
    
    def calculate_return_on_investment(self) -> float:
        """Calculate ROI based on total investment."""
        if not self.annual_rent:
            return 0
        total_investment = self.calculate_total_investment()
        if total_investment == 0:
            return 0
        return (self.annual_rent / total_investment) * 100
    
    def is_bmv_deal(self, market_value: float) -> bool:
        """Check if this is a below market value deal."""
        if not self.purchase_price or not market_value:
            return False
        discount = ((market_value - self.purchase_price) / market_value) * 100
        return discount >= 10  # 10% or more discount considered BMV

@dataclass
class DealActivity:
    id: Optional[int] = None
    deal_id: Optional[int] = None
    user_id: Optional[int] = None
    activity_type: Optional[str] = None
    description: Optional[str] = None
    created_at: Optional[datetime] = None
    
@dataclass
class DealDocument:
    id: Optional[int] = None
    deal_id: Optional[int] = None
    document_name: Optional[str] = None
    document_type: Optional[str] = None
    file_path: Optional[str] = None
    uploaded_by: Optional[int] = None
    uploaded_at: Optional[datetime] = None