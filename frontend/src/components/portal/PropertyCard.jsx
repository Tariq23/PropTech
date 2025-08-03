// frontend/src/components/portal/PropertyCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  HomeIcon, 
  MapPinIcon, 
  CurrencyPoundIcon,
  ChartBarIcon 
} from '@heroicons/react/24/outline';

const PropertyCard = ({ property }) => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  
  const title = property.title[language] || property.title.en;
  const description = property.description[language] || property.description.en;
  
  return (
    <Link
      to={`/portal/properties/${property.id}`}
      className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
    >
      {/* Property Image */}
      <div className="relative h-48 overflow-hidden rounded-t-lg">
        {property.images && property.images.length > 0 ? (
          <img
            src={property.images[0]}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <HomeIcon className="h-12 w-12 text-gray-400" />
          </div>
        )}
        
        {/* Strategy Badge */}
        <div className={`absolute top-2 ${language === 'ar' ? 'left-2' : 'right-2'}`}>
          <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm">
            {t(`strategy.${property.strategy}`)}
          </span>
        </div>
        
        {/* BMV Tier Badge */}
        {property.tier && (
          <div className={`absolute top-2 ${language === 'ar' ? 'right-2' : 'left-2'}`}>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold
              ${property.tier === 'HOT' ? 'bg-red-500 text-white' : ''}
              ${property.tier === 'WARM' ? 'bg-orange-500 text-white' : ''}
              ${property.tier === 'COOL' ? 'bg-blue-500 text-white' : ''}
            `}>
              {property.tier}
            </span>
          </div>
        )}
      </div>
      
      {/* Property Details */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
          {title}
        </h3>
        
        <div className="flex items-center text-gray-600 mb-2">
          <MapPinIcon className="h-4 w-4 mr-1" />
          <span className="text-sm">{property.city}, {property.postcode}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div className="text-sm text-gray-600">
            <span className="block font-medium">{t('property.bedrooms')}</span>
            <span>{property.bedrooms} {t('property.beds')}</span>
          </div>
          <div className="text-sm text-gray-600">
            <span className="block font-medium">{t('property.bathrooms')}</span>
            <span>{property.bathrooms} {t('property.baths')}</span>
          </div>
        </div>
        
        {/* Financial Metrics */}
        <div className="border-t pt-3">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <CurrencyPoundIcon className="h-5 w-5 text-primary-600 mr-1" />
              <span className="text-xl font-bold text-gray-900">
                £{property.asking_price?.toLocaleString()}
              </span>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <ChartBarIcon className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-sm font-medium text-green-900">
                  {t('metrics.projected_net_yield')}
                </span>
              </div>
              <span className="text-lg font-bold text-green-600">
                {property.metrics?.projected_net_yield}%
              </span>
            </div>
          </div>
          
          <p className="text-xs text-gray-500 mt-2 text-center">
            {t('financing.cash_purchase_note')}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;