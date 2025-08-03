// frontend/src/pages/portal/PropertiesPage.jsx
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { propertyService } from '../../services/propertyService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import {
  SearchIcon,
  FilterIcon,
  MapPinIcon,
  CurrencyPoundIcon,
  TrendingUpIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/outline';

const PropertiesPage = () => {
  const [filters, setFilters] = useState({
    search: '',
    minPrice: '',
    maxPrice: '',
    propertyType: '',
    location: '',
    minYield: '',
  });

  const [showFilters, setShowFilters] = useState(false);

  const { data: properties, isLoading, error } = useQuery(
    ['properties', filters],
    () => propertyService.getProperties(filters),
    {
      staleTime: 5 * 60 * 1000,
    }
  );

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      minPrice: '',
      maxPrice: '',
      propertyType: '',
      location: '',
      minYield: '',
    });
  };

  const propertyTypes = [
    'Residential',
    'Commercial',
    'Mixed-use',
    'Student Housing',
    'HMO',
  ];

  const locations = [
    'London',
    'Manchester',
    'Birmingham',
    'Liverpool',
    'Leeds',
    'Bristol',
    'Newcastle',
  ];

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
        <p className="text-gray-500">Error loading properties. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
            <p className="text-gray-600 mt-1">
              Discover exclusive investment opportunities
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="secondary"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FilterIcon className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search properties by title, location, or description..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Property Type
                </label>
                <select
                  value={filters.propertyType}
                  onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                  className="input"
                >
                  <option value="">All Types</option>
                  {propertyTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <select
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="input"
                >
                  <option value="">All Locations</option>
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Price
                </label>
                <Input
                  type="number"
                  placeholder="£0"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Price
                </label>
                <Input
                  type="number"
                  placeholder="£1,000,000"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Yield
                </label>
                <Input
                  type="number"
                  placeholder="5%"
                  value={filters.minYield}
                  onChange={(e) => handleFilterChange('minYield', e.target.value)}
                />
              </div>

              <div className="flex items-end">
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties?.data?.map((property) => (
          <div key={property.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Property Image */}
            <div className="relative h-48 bg-gray-200">
              <img
                src={property.images?.[0] || '/placeholder-property.jpg'}
                alt={property.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                  {property.status}
                </span>
              </div>
            </div>

            {/* Property Details */}
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {property.title}
              </h3>
              
              <div className="flex items-center text-gray-500 mb-3">
                <MapPinIcon className="h-4 w-4 mr-1" />
                <span className="text-sm">{property.location}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="text-lg font-semibold text-gray-900">
                    £{property.price?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Net Yield</p>
                  <p className="text-lg font-semibold text-success-600">
                    {property.netYield}%
                  </p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">BMV Score:</span>
                  <span className="font-medium">{property.bmvScore}/100</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">ROI:</span>
                  <span className="font-medium">{property.roi}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Property Type:</span>
                  <span className="font-medium">{property.propertyType}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <Link
                  to={`/portal/properties/${property.id}`}
                  className="flex-1"
                >
                  <Button variant="primary" className="w-full">
                    View Details
                  </Button>
                </Link>
                <Button variant="secondary">
                  <TrendingUpIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {properties?.data?.length === 0 && (
        <div className="text-center py-12">
          <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No properties found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search criteria or filters.
          </p>
        </div>
      )}

      {/* Pagination */}
      {properties?.data?.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {properties.data.length} of {properties.total} properties
            </div>
            <div className="flex space-x-2">
              <Button variant="secondary" disabled>
                Previous
              </Button>
              <Button variant="secondary" disabled>
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertiesPage;