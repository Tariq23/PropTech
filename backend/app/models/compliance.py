# backend/app/models/compliance.py
from dataclasses import dataclass
from typing import List, Optional, Dict
from datetime import datetime
from enum import Enum

class ComplianceStatus(Enum):
    PENDING = "pending"
    IN_REVIEW = "in_review"
    APPROVED = "approved"
    REJECTED = "rejected"
    EXPIRED = "expired"
    REQUIRES_UPDATE = "requires_update"

class DocumentType(Enum):
    PASSPORT = "passport"
    DRIVING_LICENCE = "driving_licence"
    NATIONAL_ID = "national_id"
    PROOF_OF_ADDRESS = "proof_of_address"
    BANK_STATEMENT = "bank_statement"
    UTILITY_BILL = "utility_bill"
    SOURCE_OF_FUNDS = "source_of_funds"
    EMPLOYMENT_LETTER = "employment_letter"
    TAX_RETURN = "tax_return"
    COMPANY_REGISTRATION = "company_registration"
    MEMORANDUM_OF_ASSOCIATION = "memorandum_of_association"
    BENEFICIAL_OWNERSHIP = "beneficial_ownership"

class RiskRating(Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    PROHIBITED = "prohibited"

@dataclass
class KYCDocument:
    id: Optional[int] = None
    user_id: Optional[int] = None
    document_type: Optional[DocumentType] = None
    document_name: Optional[str] = None
    file_path: Optional[str] = None
    original_filename: Optional[str] = None
    status: Optional[ComplianceStatus] = ComplianceStatus.PENDING
    
    # Review Details
    reviewed_by: Optional[int] = None
    reviewed_at: Optional[datetime] = None
    review_notes: Optional[str] = None
    rejection_reason: Optional[str] = None
    
    # Document Details
    document_number: Optional[str] = None
    issue_date: Optional[datetime] = None
    expiry_date: Optional[datetime] = None
    issuing_authority: Optional[str] = None
    issuing_country: Optional[str] = None
    
    # Timestamps
    uploaded_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    def is_expired(self) -> bool:
        """Check if document has expired."""
        if not self.expiry_date:
            return False
        return datetime.utcnow() > self.expiry_date
    
    def days_until_expiry(self) -> Optional[int]:
        """Calculate days until document expires."""
        if not self.expiry_date:
            return None
        delta = self.expiry_date - datetime.utcnow()
        return delta.days if delta.days > 0 else 0

@dataclass
class AMLCheck:
    id: Optional[int] = None
    user_id: Optional[int] = None
    check_type: Optional[str] = None  # 'sanctions', 'pep', 'adverse_media'
    status: Optional[ComplianceStatus] = ComplianceStatus.PENDING
    
    # Check Results
    risk_rating: Optional[RiskRating] = None
    matches_found: bool = False
    match_details: Optional[str] = None
    confidence_score: Optional[float] = None
    
    # External Service Details
    provider: Optional[str] = None  # 'WorldCheck', 'Dow Jones', etc.
    external_reference: Optional[str] = None
    
    # Review
    reviewed_by: Optional[int] = None
    reviewed_at: Optional[datetime] = None
    review_decision: Optional[str] = None
    review_notes: Optional[str] = None
    
    # Timestamps
    performed_at: Optional[datetime] = None
    created_at: Optional[datetime] = None

@dataclass
class CustomerDueDiligence:
    id: Optional[int] = None
    user_id: Optional[int] = None
    cdd_type: Optional[str] = None  # 'simplified', 'standard', 'enhanced'
    status: Optional[ComplianceStatus] = ComplianceStatus.PENDING
    
    # Customer Information
    customer_type: Optional[str] = None  # 'individual', 'corporate'
    is_pep: bool = False
    pep_details: Optional[str] = None
    
    # Risk Assessment
    risk_rating: Optional[RiskRating] = RiskRating.MEDIUM
    risk_factors: List[str] = None
    risk_assessment_notes: Optional[str] = None
    
    # Source of Wealth/Funds
    source_of_wealth: Optional[str] = None
    source_of_funds: Optional[str] = None
    wealth_verification_documents: List[str] = None
    
    # Ongoing Monitoring
    last_review_date: Optional[datetime] = None
    next_review_date: Optional[datetime] = None
    monitoring_frequency: Optional[str] = None  # 'annual', 'biannual', 'quarterly'
    
    # Approval
    approved_by: Optional[int] = None
    approved_at: Optional[datetime] = None
    approval_notes: Optional[str] = None
    
    # Timestamps
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    def __post_init__(self):
        if self.risk_factors is None:
            self.risk_factors = []
        if self.wealth_verification_documents is None:
            self.wealth_verification_documents = []

@dataclass
class SanctionsCheck:
    id: Optional[int] = None
    user_id: Optional[int] = None
    check_name: Optional[str] = None
    date_of_birth: Optional[datetime] = None
    nationality: Optional[str] = None
    
    # Results
    sanctions_match: bool = False
    pep_match: bool = False
    adverse_media_match: bool = False
    
    # Match Details
    matched_sanctions_lists: List[str] = None
    match_confidence: Optional[float] = None
    match_details: Optional[str] = None
    
    # Decision
    cleared: bool = False
    cleared_by: Optional[int] = None
    cleared_at: Optional[datetime] = None
    clearance_notes: Optional[str] = None
    
    # External Reference
    provider_reference: Optional[str] = None
    
    # Timestamps
    performed_at: Optional[datetime] = None
    created_at: Optional[datetime] = None
    
    def __post_init__(self):
        if self.matched_sanctions_lists is None:
            self.matched_sanctions_lists = []

@dataclass
class ComplianceAlert:
    id: Optional[int] = None
    user_id: Optional[int] = None
    alert_type: Optional[str] = None
    severity: Optional[str] = None  # 'low', 'medium', 'high', 'critical'
    
    # Alert Details
    title: Optional[str] = None
    description: Optional[str] = None
    triggered_by: Optional[str] = None
    
    # Status
    status: Optional[str] = None  # 'open', 'investigating', 'resolved', 'false_positive'
    assigned_to: Optional[int] = None
    
    # Resolution
    resolved_by: Optional[int] = None
    resolved_at: Optional[datetime] = None
    resolution_notes: Optional[str] = None
    
    # Timestamps
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

@dataclass
class ComplianceReport:
    id: Optional[int] = None
    report_type: Optional[str] = None
    report_period_start: Optional[datetime] = None
    report_period_end: Optional[datetime] = None
    
    # Statistics
    total_customers: Optional[int] = None
    kyc_completed: Optional[int] = None
    kyc_pending: Optional[int] = None
    sanctions_checks_performed: Optional[int] = None
    pep_matches: Optional[int] = None
    alerts_generated: Optional[int] = None
    alerts_resolved: Optional[int] = None
    
    # Report Data
    report_data: Optional[Dict] = None
    
    # Generation
    generated_by: Optional[int] = None
    generated_at: Optional[datetime] = None
    
    def __post_init__(self):
        if self.report_data is None:
            self.report_data = {}

# Compliance Configuration
@dataclass
class ComplianceConfig:
    # KYC Requirements
    kyc_required_documents: List[DocumentType] = None
    kyc_expiry_warning_days: int = 30
    
    # AML Settings
    aml_check_frequency: str = "annual"  # 'monthly', 'quarterly', 'annual'
    enhanced_dd_threshold: float = 10000.0  # Amount triggering enhanced DD
    
    # Risk Settings
    high_risk_countries: List[str] = None
    prohibited_countries: List[str] = None
    
    # Monitoring
    ongoing_monitoring_enabled: bool = True
    sanctions_check_frequency: str = "monthly"
    
    def __post_init__(self):
        if self.kyc_required_documents is None:
            self.kyc_required_documents = [
                DocumentType.PASSPORT,
                DocumentType.PROOF_OF_ADDRESS,
                DocumentType.SOURCE_OF_FUNDS
            ]
        if self.high_risk_countries is None:
            self.high_risk_countries = []
        if self.prohibited_countries is None:
            self.prohibited_countries = []