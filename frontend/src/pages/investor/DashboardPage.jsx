// frontend/src/pages/investor/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const InvestorDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call for dashboard data
    const fetchDashboardData = async () => {
      try {
        // Mock data - replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setDashboardData({
          totalInvestments: 3,
          totalInvested: 750000,
          currentValue: 785000,
          monthlyIncome: 3250,
          totalReturns: 35000,
          recentProperties: [
            {
              id: 1,
              title: 'Modern Apartment in Manchester',
              location: 'Manchester, M1 4ET',
              investment: 250000,
              monthlyIncome: 1200,
              yield: 5.8,
              image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400'
            },
            {
              id: 2,
              title: 'Victorian House in Birmingham',
              location: 'Birmingham, B1 2AA',
              investment: 300000,
              monthlyIncome: 1350,
              yield: 5.4,
              image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400'
            },
            {
              id: 3,
              title: 'Student Accommodation Liverpool',
              location: 'Liverpool, L1 8JQ',
              investment: 200000,
              monthlyIncome: 700,
              yield: 4.2,
              image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400'
            }
          ],
          recentActivity: [
            {
              id: 1,
              type: 'income',
              description: 'Monthly rental income received',
              amount: 3250,
              date: '2024-01-01',
              property: 'Manchester Apartment'
            },
            {
              id: 2,
              type: 'investment',
              description: 'New investment in Liverpool property',
              amount: 200000,
              date: '2023-12-15',
              property: 'Liverpool Student Accommodation'
            }
          ]
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const stats = [
    {
      name: t('dashboard.totalInvestments'),
      value: dashboardData?.totalInvestments || 0,
      change: '+1',
      changeType: 'positive',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      name: t('dashboard.portfolioValue'),
      value: `£${(dashboardData?.currentValue || 0).toLocaleString()}`,
      change: '+4.7%',
      changeType: 'positive',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      name: t('dashboard.monthlyIncome'),
      value: `£${(dashboardData?.monthlyIncome || 0).toLocaleString()}`,
      change: '+2.1%',
      changeType: 'positive',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      name: t('investment.totalReturns'),
      value: `£${(dashboardData?.totalReturns || 0).toLocaleString()}`,
      change: '+12.3%',
      changeType: 'positive',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {t('welcome')}, {user?.full_name?.split(' ')[0]}!
        </h1>
        <p className="text-gray-600 mt-1">
          Here's an overview of your property investment portfolio.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div key={item.name} className="bg-white overflow-hidden shadow-sm rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="text-green-600">{item.icon}</div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {item.name}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {item.value}
                      </div>
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                        item.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {item.change}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Portfolio Performance */}
        <div className="bg-white shadow-sm rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Portfolio Performance</h2>
            <Link
              to="/portal/portfolio"
              className="text-sm font-medium text-green-600 hover:text-green-500"
            >
              View Details
            </Link>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Invested</span>
                <span className="font-medium">£{(dashboardData?.totalInvested || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Current Value</span>
                <span className="font-medium">£{(dashboardData?.currentValue || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Returns</span>
                <span className="font-medium text-green-600">£{(dashboardData?.totalReturns || 0).toLocaleString()}</span>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900">Overall ROI</span>
                  <span className="text-lg font-bold text-green-600">
                    {((dashboardData?.totalReturns || 0) / (dashboardData?.totalInvested || 1) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white shadow-sm rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">{t('dashboard.recentActivity')}</h2>
            <Link
              to="/portal/investments"
              className="text-sm font-medium text-green-600 hover:text-green-500"
            >
              View All
            </Link>
          </div>
          <div className="divide-y divide-gray-200">
            {dashboardData?.recentActivity?.map((activity) => (
              <div key={activity.id} className="p-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    {activity.type === 'income' ? (
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.description}
                    </p>
                    <p className="text-sm text-gray-500">
                      {activity.property}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-xs text-gray-400">
                        {new Date(activity.date).toLocaleDateString()}
                      </p>
                      <p className={`text-sm font-medium ${
                        activity.type === 'income' ? 'text-green-600' : 'text-blue-600'
                      }`}>
                        {activity.type === 'income' ? '+' : ''}£{activity.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Properties Overview */}
      <div className="bg-white shadow-sm rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Your Properties</h2>
          <Link
            to="/portal/properties"
            className="text-sm font-medium text-green-600 hover:text-green-500"
          >
            Browse More Properties
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {dashboardData?.recentProperties?.map((property) => (
            <div key={property.id} className="bg-gray-50 rounded-lg overflow-hidden">
              <img
                src={property.image}
                alt={property.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-medium text-gray-900 mb-1">{property.title}</h3>
                <p className="text-sm text-gray-500 mb-3">{property.location}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Investment:</span>
                    <span className="font-medium">£{property.investment.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Monthly Income:</span>
                    <span className="font-medium text-green-600">£{property.monthlyIncome.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Yield:</span>
                    <span className="font-medium">{property.yield}%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InvestorDashboard;