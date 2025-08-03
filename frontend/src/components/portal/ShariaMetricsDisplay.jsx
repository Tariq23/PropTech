// frontend/src/components/portal/ShariaMetricsDisplay.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  CurrencyPoundIcon, 
  ChartBarIcon,
  CalculatorIcon,
  BanknotesIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const ShariaMetricsDisplay = ({ metrics }) => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  
  if (!metrics) return null;
  
  const {
    purchase_breakdown,
    income_analysis,
    expense_analysis,
    returns,
    financing_note
  } = metrics;
  
  return (
    <div className="space-y-6">
      {/* Financing Note */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex">
          <InformationCircleIcon className="h-5 w-5 text-green-600 mt-0.5" />
          <div className={`${language === 'ar' ? 'mr-3' : 'ml-3'} flex-1`}>
            <h4 className="text-sm font-medium text-green-900 mb-1">
              {t('sharia.compliant_investment')}
            </h4>
            <p className="text-sm text-green-700">
              {financing_note[language] || financing_note.en}
            </p>
          </div>
        </div>
      </div>
      
      {/* Key Returns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <ChartBarIcon className="h-8 w-8 text-primary-600" />
            <span className="text-2xl font-bold text-primary-600">
              {returns.projected_net_yield}%
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-700">
            {t('metrics.projected_net_yield')}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            {t('metrics.annual_return')}
          </p>
        </div>
        
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <CalculatorIcon className="h-8 w-8 text-secondary-600" />
            <span className="text-2xl font-bold text-secondary-600">
              {returns.return_on_equity}%
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-700">
            {t('metrics.return_on_equity')}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            {t('metrics.total_investment_return')}
          </p>
        </div>
        
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <BanknotesIcon className="h-8 w-8 text-green-600" />
            <span className="text-xl font-bold text-green-600">
              £{purchase_breakdown.total_equity_required.toLocaleString()}
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-700">
            {t('metrics.total_equity_required')}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            {t('metrics.cash_investment')}
          </p>
        </div>
      </div>
      
      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Purchase Costs */}
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <CurrencyPoundIcon className="h-5 w-5 mr-2" />
            {t('financial.purchase_breakdown')}
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">{t('financial.purchase_price')}</span>
              <span className="font-medium">
                £{purchase_breakdown.purchase_price.toLocaleString()}
              </span>
            </div>
            {purchase_breakdown.refurbishment_cost > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">{t('financial.refurbishment_cost')}</span>
                <span className="font-medium">
                  £{purchase_breakdown.refurbishment_cost.toLocaleString()}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">{t('financial.stamp_duty')}</span>
              <span className="font-medium">
                £{purchase_breakdown.stamp_duty.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t('financial.legal_fees')}</span>
              <span className="font-medium">
                £{purchase_breakdown.legal_fees.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t('financial.sourcing_fee')}</span>
              <span className="font-medium">
                £{purchase_breakdown.sourcing_fee.toLocaleString()}
              </span>
            </div>
            {purchase_breakdown.other_costs > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">{t('financial.other_costs')}</span>
                <span className="font-medium">
                  £{purchase_breakdown.other_costs.toLocaleString()}
                </span>
              </div>
            )}
            <div className="border-t pt-3 flex justify-between font-semibold">
              <span>{t('financial.total_investment')}</span>
              <span className="text-primary-600">
                £{purchase_breakdown.total_equity_required.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
        
        {/* Income & Expenses */}
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ChartBarIcon className="h-5 w-5 mr-2" />
            {t('financial.income_expenses')}
          </h3>
          <div className="space-y-3">
            <div className="pb-3 border-b">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">{t('financial.monthly_rent')}</span>
                <span className="font-medium">
                  £{income_analysis.monthly_rent.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t('financial.annual_gross_rent')}</span>
                <span className="font-medium text-green-600">
                  £{income_analysis.annual_gross_rent.toLocaleString()}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {t('financial.void_allowance')} ({expense_analysis.void_percentage}%)
                </span>
                <span>-£{expense_analysis.void_allowance.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {t('financial.maintenance')} ({expense_analysis.maintenance_percentage}%)
                </span>
                <span>-£{expense_analysis.maintenance_costs.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {t('financial.management')} ({expense_analysis.management_percentage}%)
                </span>
                <span>-£{expense_analysis.management_costs.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{t('financial.other_annual_costs')}</span>
                <span>-£{expense_analysis.other_annual_costs.toLocaleString()}</span>
              </div>
            </div>
            
            <div className="border-t pt-3">
              <div className="flex justify-between font-semibold">
                <span>{t('financial.net_annual_income')}</span>
                <span className="text-green-600">
                  £{returns.net_operating_income.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mt-1">
                <span>{t('financial.gross_yield')}</span>
                <span>{returns.gross_yield}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 5-Year Projection */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {t('financial.five_year_projection')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">{t('financial.total_income_5_years')}</p>
            <p className="text-2xl font-bold text-blue-600">
              £{returns.five_year_net_income.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">{t('financial.five_year_roi')}</p>
            <p className="text-2xl font-bold text-blue-600">{returns.five_year_roi}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShariaMetricsDisplay;