// frontend/src/pages/portal/PropertyDetailPage.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { propertyService } from '../../services/propertyService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import {
  MapPinIcon,
  CurrencyPoundIcon,
  TrendingUpIcon,
  BuildingOfficeIcon,
  CalendarIcon,
} from '@heroicons/react/outline';

const PropertyDetailPage = () => {
  const { id } = useParams();

  const { data: property, isLoading, error } = useQuery(
    ['property', id],
    () => propertyService.getProperty(id),
    {
      staleTime: 5 * 60 * 1000,
    }
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Error loading property details. Please try again.</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Property not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Property Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
        <div className="flex items-center text-gray-500 mb-4">
          <MapPinIcon className="h-5 w-5 mr-2" />
          <span>{property.location}</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
            {property.status}
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
            {property.propertyType}
          </span>
        </div>
      </div>

      {/* Property Images */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
          {property.images?.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${property.title} - Image ${index + 1}`}
              className="w-full h-64 object-cover rounded-lg"
            />
          ))}
        </div>
      </div>

      {/* Property Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Financial Overview */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Financial Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-500">Purchase Price</p>
                <p className="text-2xl font-bold text-gray-900">
                  £{property.price?.toLocaleString()}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Net Yield</p>
                <p className="text-2xl font-bold text-success-600">
                  {property.netYield}%
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">ROI</p>
                <p className="text-2xl font-bold text-primary-600">
                  {property.roi}%
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">BMV Score</p>
                <p className="text-2xl font-bold text-warning-600">
                  {property.bmvScore}/100
                </p>
              </div>
            </div>
          </div>

          {/* Property Description */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Property Description</h2>
            <p className="text-gray-700 leading-relaxed">{property.description}</p>
          </div>

          {/* Property Features */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Property Features</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {property.features?.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Investment Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Investment Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Property Type:</span>
                <span className="font-medium">{property.propertyType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Bedrooms:</span>
                <span className="font-medium">{property.bedrooms}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Bathrooms:</span>
                <span className="font-medium">{property.bathrooms}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Square Footage:</span>
                <span className="font-medium">{property.squareFootage} sq ft</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Year Built:</span>
                <span className="font-medium">{property.yearBuilt}</span>
              </div>
            </div>
          </div>

          {/* Financial Analysis */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Analysis</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly Rent:</span>
                <span className="font-medium">£{property.monthlyRent?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Annual Rent:</span>
                <span className="font-medium">£{property.annualRent?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Gross Yield:</span>
                <span className="font-medium">{property.grossYield}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Net Yield:</span>
                <span className="font-medium text-success-600">{property.netYield}%</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="space-y-3">
              <Button variant="primary" className="w-full">
                Express Interest
              </Button>
              <Button variant="secondary" className="w-full">
                Download Details
              </Button>
              <Button variant="ghost" className="w-full">
                Contact Agent
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailPage;