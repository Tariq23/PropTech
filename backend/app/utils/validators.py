# backend/app/utils/validators.py
import re
from typing import Optional

def validate_email(email: str) -> bool:
    """Validate email format."""
    if not email:
        return False
    
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))

def validate_password(password: str) -> bool:
    """Validate password strength."""
    if not password or len(password) < 8:
        return False
    
    # Check for at least one uppercase letter, one lowercase letter, and one number
    has_upper = bool(re.search(r'[A-Z]', password))
    has_lower = bool(re.search(r'[a-z]', password))
    has_digit = bool(re.search(r'\d', password))
    
    return has_upper and has_lower and has_digit

def validate_phone(phone: str) -> bool:
    """Validate phone number format."""
    if not phone:
        return False
    
    # Remove all non-digit characters
    cleaned = re.sub(r'\D', '', phone)
    
    # Check if it's a valid UK or international number
    if len(cleaned) >= 10 and len(cleaned) <= 15:
        return True
    
    return False

def validate_postcode(postcode: str) -> bool:
    """Validate UK postcode format."""
    if not postcode:
        return False
    
    # UK postcode pattern
    pattern = r'^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$'
    return bool(re.match(pattern, postcode.upper()))

def validate_price(price: float) -> bool:
    """Validate property price."""
    return price is not None and price > 0

def validate_yield(yield_value: float) -> bool:
    """Validate yield percentage."""
    return yield_value is not None and 0 <= yield_value <= 100

def validate_bmv_score(score: int) -> bool:
    """Validate BMV score."""
    return score is not None and 0 <= score <= 100

def sanitize_string(value: str) -> str:
    """Sanitize string input."""
    if not value:
        return ""
    
    # Remove potentially dangerous characters
    sanitized = re.sub(r'[<>"\']', '', value)
    return sanitized.strip()

def validate_file_extension(filename: str, allowed_extensions: set) -> bool:
    """Validate file extension."""
    if not filename:
        return False
    
    extension = filename.rsplit('.', 1)[1].lower() if '.' in filename else ''
    return extension in allowed_extensions

def validate_file_size(file_size: int, max_size: int) -> bool:
    """Validate file size."""
    return file_size <= max_size

def validate_investment_amount(amount: float, min_amount: float = 50000, max_amount: float = 10000000) -> bool:
    """Validate investment amount."""
    return amount is not None and min_amount <= amount <= max_amount

def validate_property_type(property_type: str) -> bool:
    """Validate property type."""
    valid_types = {
        'residential', 'commercial', 'mixed-use', 'student_housing',
        'residential', 'commercial', 'mixed_use', 'student_housing'
    }
    return property_type.lower() in valid_types

def validate_investment_strategy(strategy: str) -> bool:
    """Validate investment strategy."""
    valid_strategies = {
        'buy_to_let', 'flip', 'development', 'commercial_let',
        'buy_to_let', 'flip', 'development', 'commercial_let'
    }
    return strategy.lower() in valid_strategies

def validate_language(language: str) -> bool:
    """Validate language code."""
    valid_languages = {'en', 'ar'}
    return language in valid_languages

def validate_user_type(user_type: str) -> bool:
    """Validate user type."""
    valid_types = {'investor', 'admin'}
    return user_type in valid_types

def validate_status(status: str) -> bool:
    """Validate status values."""
    valid_statuses = {
        'pending', 'active', 'inactive', 'verified', 'rejected',
        'draft', 'published', 'archived'
    }
    return status in valid_statuses
