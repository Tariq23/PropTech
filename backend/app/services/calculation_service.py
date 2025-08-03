# backend/app/services/calculation_service.py
import json

class ShariaCompliantCalculator:
    """Calculator for Sharia-compliant property investment metrics."""
    
    def calculate_investment_metrics(self, purchase_price, monthly_rent, annual_costs, total_costs):
        """Calculate basic investment metrics."""
        if not purchase_price or not monthly_rent:
            return {
                'net_yield': 0,
                'roi': 0,
                'annual_rent': 0,
                'net_income': 0
            }
        
        annual_rent = monthly_rent * 12
        net_income = annual_rent - annual_costs
        total_investment = purchase_price + total_costs
        
        net_yield = (net_income / purchase_price) * 100 if purchase_price > 0 else 0
        roi = (net_income / total_investment) * 100 if total_investment > 0 else 0
        
        return {
            'net_yield': round(net_yield, 2),
            'roi': round(roi, 2),
            'annual_rent': annual_rent,
            'net_income': net_income
        }
    
    def calculate_detailed_metrics(self, purchase_price, monthly_rent, refurbishment_cost, 
                                 stamp_duty, legal_fees, sourcing_fee, other_costs, 
                                 annual_costs, void_percentage, maintenance_percentage, 
                                 management_percentage):
        """Calculate detailed Sharia-compliant investment metrics."""
        if not purchase_price or not monthly_rent:
            return self._empty_metrics()
        
        # Calculate costs
        total_purchase_costs = purchase_price + stamp_duty + legal_fees + sourcing_fee
        total_investment = total_purchase_costs + refurbishment_cost + other_costs
        
        # Calculate rental income
        annual_rent = monthly_rent * 12
        void_allowance = annual_rent * (void_percentage / 100)
        effective_annual_rent = annual_rent - void_allowance
        
        # Calculate expenses
        maintenance_cost = effective_annual_rent * (maintenance_percentage / 100)
        management_cost = effective_annual_rent * (management_percentage / 100)
        total_annual_expenses = annual_costs + maintenance_cost + management_cost
        
        # Calculate net income
        net_annual_income = effective_annual_rent - total_annual_expenses
        
        # Calculate metrics
        net_yield = (net_annual_income / purchase_price) * 100 if purchase_price > 0 else 0
        roi = (net_annual_income / total_investment) * 100 if total_investment > 0 else 0
        cash_on_cash_return = (net_annual_income / total_investment) * 100 if total_investment > 0 else 0
        
        return {
            'purchase_metrics': {
                'purchase_price': purchase_price,
                'stamp_duty': stamp_duty,
                'legal_fees': legal_fees,
                'sourcing_fee': sourcing_fee,
                'total_purchase_costs': total_purchase_costs
            },
            'investment_metrics': {
                'refurbishment_cost': refurbishment_cost,
                'other_costs': other_costs,
                'total_investment': total_investment
            },
            'rental_metrics': {
                'monthly_rent': monthly_rent,
                'annual_rent': annual_rent,
                'void_allowance': void_allowance,
                'effective_annual_rent': effective_annual_rent
            },
            'expense_metrics': {
                'annual_costs': annual_costs,
                'maintenance_cost': maintenance_cost,
                'management_cost': management_cost,
                'total_annual_expenses': total_annual_expenses
            },
            'return_metrics': {
                'net_annual_income': net_annual_income,
                'net_yield': round(net_yield, 2),
                'roi': round(roi, 2),
                'cash_on_cash_return': round(cash_on_cash_return, 2)
            },
            'assumptions': {
                'void_percentage': void_percentage,
                'maintenance_percentage': maintenance_percentage,
                'management_percentage': management_percentage
            }
        }
    
    def _empty_metrics(self):
        """Return empty metrics structure."""
        return {
            'purchase_metrics': {
                'purchase_price': 0,
                'stamp_duty': 0,
                'legal_fees': 0,
                'sourcing_fee': 0,
                'total_purchase_costs': 0
            },
            'investment_metrics': {
                'refurbishment_cost': 0,
                'other_costs': 0,
                'total_investment': 0
            },
            'rental_metrics': {
                'monthly_rent': 0,
                'annual_rent': 0,
                'void_allowance': 0,
                'effective_annual_rent': 0
            },
            'expense_metrics': {
                'annual_costs': 0,
                'maintenance_cost': 0,
                'management_cost': 0,
                'total_annual_expenses': 0
            },
            'return_metrics': {
                'net_annual_income': 0,
                'net_yield': 0,
                'roi': 0,
                'cash_on_cash_return': 0
            },
            'assumptions': {
                'void_percentage': 10,
                'maintenance_percentage': 5,
                'management_percentage': 10
            }
        }