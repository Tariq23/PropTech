// frontend/src/pages/portal/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner, { LoadingCard, LoadingSkeleton } from '../../components/common/LoadingSpinner';

const DashboardPage = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [timeframe, setTimeframe] = useState('30d');

  // Mock data - replace with actual API calls
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setDashboardData({
          portfolio: {
            totalValue: 138750,
            totalInvested: 125000,
            totalReturns: 13750,
            returnPercentage: 11.0,
            activeInvestments: 5,
            monthlyIncome: 1250
          },
          recentTransactions: [
            {
              id: 1,
              type: 'dividend',
              amount: 425,
              date: '2024-01-15',
              property: 'Manchester Apartment Complex',
              status: 'completed'
            },
            {
              id: 2,
              type: 'investment',
              amount: 25000,
              date: '2024-01-10',
              property: 'Birmingham Office Building',
              status: 'completed'
            },
            {
              id: 3,
              type: 'dividend',
              amount: 380,
              date: '2024-01-01',
              property: 'London Retail Space',
              status: 'completed'
            }
          ],
          featuredProperties: [
            {
              id: 1,
              title: 'Leeds City Center Apartments',
              location: 'Leeds, UK',
              expectedReturn: 8.5,
              minInvestment: 10000,
              fundingProgress: 65,
              image: '/images/properties/leeds-apartments.jpg'
            },
            {
              id: 2,
              title: 'Birmingham Commercial Complex',
              location: 'Birmingham, UK',
              expectedReturn: 7.2,
              minInvestment: 15000,
              fundingProgress: 42,
              image: '/images/properties/birmingham-complex.jpg'
            }
          ],
          marketTrends: {
            ukPropertyIndex: 2.4,
            rentalYields: 5.8,
            capitalGrowth: 3.2
          }
        });
        setLoading(false);
      }, 1000);
    };

    fetchDashboardData();
  }, [timeframe]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat(i18n.language === 'ar' ? 'ar-AE' : 'en-GB', {
      style: 'currency',
      currency: i18n.language === 'ar' ? 'AED' : 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <LoadingSkeleton variant="title" className="w-48" />
          <LoadingSkeleton variant="button" className="w-32" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <LoadingCard key={i} />
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LoadingCard />
          <LoadingCard />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t('dashboard.welcome')}, {user?.full_name?.split(' ')[0] || 'Investor'}
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Here's what's happening with your investments today.
          </p>
        </div>
        
        {/* Timeframe selector */}
        <div className="mt-4 sm:mt-0">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="block w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 3 months</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {/* Portfolio Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Portfolio Value */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Portfolio Value
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {formatCurrency(dashboardData.portfolio.totalValue)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <span className="text-green-600 font-medium">
                +{dashboardData.portfolio.returnPercentage.toFixed(1)}%
              </span>
              <span className="text-gray-600"> from investments</span>
            </div>
          </div>
        </div>

        {/* Total Invested */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {t('investments.totalInvested')}
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {formatCurrency(dashboardData.portfolio.totalInvested)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Active Investments */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {t('dashboard.activeInvestments')}
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {dashboardData.portfolio.activeInvestments}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Income */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Monthly Income
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {formatCurrency(dashboardData.portfolio.monthlyIncome)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {t('dashboard.recentTransactions')}
              </h3>
              <Link
                to="/portal/transactions"
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                {t('dashboard.viewAll')}
              </Link>
            </div>
            
            <div className="flow-root">
              <ul className="-my-5 divide-y divide-gray-200">
                {dashboardData.recentTransactions.map((transaction) => (
                  <li key={transaction.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {transaction.type === 'dividend' ? (
                          <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center">
                            <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </div>
                        ) : (
                          <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                            <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {transaction.type === 'dividend' ? 'Dividend Payment' : 'Investment'}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {transaction.property}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-medium ${
                          transaction.type === 'dividend' ? 'text-green-600' : 'text-blue-600'
                        }`}>
                          {transaction.type === 'dividend' ? '+' : ''}{formatCurrency(transaction.amount)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(transaction.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Market Trends */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              {t('dashboard.marketTrends')}
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">UK Property Index</span>
                <span className="text-sm font-medium text-green-600">
                  +{dashboardData.marketTrends.ukPropertyIndex}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Average Rental Yield</span>
                <span className="text-sm font-medium text-gray-900">
                  {dashboardData.marketTrends.rentalYields}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Capital Growth</span>
                <span className="text-sm font-medium text-green-600">
                  +{dashboardData.marketTrends.capitalGrowth}%
                </span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <Link
                to="/portal/reports"
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                View detailed market analysis →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Properties */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Featured Investment Opportunities
            </h3>
            <Link
              to="/portal/properties"
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              {t('dashboard.viewAll')}
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dashboardData.featuredProperties.map((property) => (
              <div key={property.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                  <div className="flex items-center justify-center text-gray-400">
                    <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-medium text-gray-900 mb-1">{property.title}</h4>
                  <p className="text-sm text-gray-600 mb-3">{property.location}</p>
                  
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <span className="text-sm text-gray-600">Expected Return</span>
                      <p className="text-lg font-medium text-green-600">{property.expectedReturn}%</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-gray-600">Min Investment</span>
                      <p className="text-lg font-medium text-gray-900">
                        {formatCurrency(property.minInvestment)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Funding Progress</span>
                      <span>{property.fundingProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${property.fundingProgress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <Link
                    to={`/portal/properties/${property.id}`}
                    className="w-full bg-blue-600 text-white text-center py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium block"
                  >
                    {t('investments.investNow')}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            {t('dashboard.quickActions')}
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/portal/properties"
              className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="h-6 w-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="text-sm font-medium text-gray-900">Browse Properties</span>
            </Link>
            
            <Link
              to="/portal/portfolio"
              className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="h-6 w-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2V7a2 2 0 012-2h2a2 2 0 002 2v2a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2-2V3a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 002 2h2a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
              <span className="text-sm font-medium text-gray-900">View Portfolio</span>
            </Link>
            
            <Link
              to="/portal/transactions"
              className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="h-6 w-6 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="text-sm font-medium text-gray-900">Transaction History</span>
            </Link>
            
            <Link
              to="/portal/reports"
              className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="h-6 w-6 text-yellow-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-sm font-medium text-gray-900">View Reports</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;