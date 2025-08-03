# backend/app/models/investor.py
from dataclasses import dataclass
from typing import List, Optional
from datetime import datetime

@dataclass
class InvestorProfile:
    id: Optional[int] = None
    user_id: Optional[int] = None
    investor_type: Optional[str] = None
    nationality: Optional[str] = None
    min_investment: Optional[float] = None
    max_investment: Optional[float] = None
    target_yield: Optional[float] = None
    preferred_regions: List[str] = None
    preferred_property_types: List[str] = None
    investment_strategies: List[str] = None
    sharia_compliant_only: bool = True
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    def __post_init__(self):
        if self.preferred_regions is None:
            self.preferred_regions = []
        if self.preferred_property_types is None:
            self.preferred_property_types = []
        if self.investment_strategies is None:
            self.investment_strategies = []