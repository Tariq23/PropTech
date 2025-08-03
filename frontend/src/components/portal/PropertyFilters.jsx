// frontend/src/components/portal/PropertyFilters.jsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  FunnelIcon, 
  XMarkIcon,
  CurrencyPoundIcon,
  ChartBarIcon,
  MapPinIcon,
  HomeIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline';

const PropertyFilters = ({ filters, onChange, onReset }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  
  const cities = ['London', 'Manchester', 'Birmingham', 'Liverpool', 'Leeds'];
  const propertyTypes = ['apartment', 'flat', 'house', 'commercial', 'student_accommodation'];
  const strategies = ['btl', 'brrr', 'flip'];
  
  const handleChange = (field, value) => {
    onChange({ ...filters, [field]: value });
  };
  
  const handleReset = () => {
    onReset();
    setIsOpen(false);
  };
  
  return (
    <div className="relative">
      {/* Mobile Filter Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-300 hover:bg-gray-50"
      >
        <FunnelIcon className="h-5 w-5" />
        <span>{t('filters.title')}</span>
      </button>
      
      {/* Filter Panel */}
      <div className={`
        ${isOpen ? 'block' : 'hidden'} md:block
        absolute md:relative top-full mt-2 md:mt-0
        w-full md:w-auto
        bg-white rounded-lg shadow-lg md:shadow-none
        border md:border-0
        p-4 md:p-0
        z-20
      `}>
        <div className="flex items-center justify-between mb-4 md:hidden">
          <h3 className="text-lg font-semibold">{t('filters.title')}</h3>
          <button onClick={() => setIsOpen(false)}>
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Price Range */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <CurrencyPoundIcon className="h-4 w-4" />
              {t('filters.price_range')}
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder={t('filters.min')}
                value={filters.min_price || ''}
                onChange={(e) => handleChange('min_price', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
              />
              <input
                type="number"
                placeholder={t('filters.max')}
                value={filters.max_price || ''}
                onChange={(e) => handleChange('max_price', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
          
          {/* Min Yield */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <ChartBarIcon className="h-4 w-4" />
              {t('filters.min_yield')}
            </label>
            <input
              type="number"
              placeholder="%"
              value={filters.min_yield || ''}
              onChange={(e) => handleChange('min_yield', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          
          {/* City */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <MapPinIcon className="h-4 w-4" />
              {t('filters.city')}
            </label>
            <select
              value={filters.city || ''}
              onChange={(e) => handleChange('city', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">{t('filters.all_cities')}</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
          
          {/* Property Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <HomeIcon className="h-4 w-4" />
              {t('filters.property_type')}
            </label>
            <select
              value={filters.property_type || ''}
              onChange={(e) => handleChange('property_type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">{t('filters.all_types')}</option>
              {propertyTypes.map(type => (
                <option key={type} value={type}>
                  {t(`property_types.${type}`)}
                </option>
              ))}
            </select>
          </div>
          
          {/* Strategy */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <BriefcaseIcon className="h-4 w-4" />
              {t('filters.strategy')}
            </label>
            <select
              value={filters.strategy || ''}
              onChange={(e) => handleChange('strategy', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">{t('filters.all_strategies')}</option>
              {strategies.map(strategy => (
                <option key={strategy} value={strategy}>
                  {t(`strategy.${strategy}`)}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            {t('filters.reset')}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden px-4 py-2 text-sm text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
          >
            {t('filters.apply')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyFilters;