import React from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  UsersIcon,
  BuildingOfficeIcon,
  CurrencyPoundIcon,
  TrendingUpIcon,
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationIcon,
} from '@heroicons/react/outline';

const AdminDashboard = () => {
  const { user } = useAuth();

  // Fetch admin dashboard data
  const { data: dashboardData, isLoading } = useQuery(
    'adminDashboard',
    () => fetch('/api/admin/dashboard').then(res => res.json()),
    {
      staleTime: 5 * 60 * 1000,
    }
  );

  const stats = [
    {
      name: 'Total Properties',
      value: dashboardData?.totalProperties || 0,
      icon: BuildingOfficeIcon,
      change: '+5%',
      changeType: 'positive',
      href: '/admin/properties',
    },
    {
      name: 'Active Investors',
      value: dashboardData?.activeInvestors || 0,
      icon: UsersIcon,
      change: '+12%',
      changeType: 'positive',
      href: '/admin/investors',
    },
    {
      name: 'Total Deals',
      value: dashboardData?.totalDeals || 0,
      icon: CurrencyPoundIcon,
      change: '+8%',
      changeType: 'positive',
      href: '/admin/deals',
    },
    {
      name: 'Platform Revenue',
      value: `£${(dashboardData?.platformRevenue || 0).toLocaleString()}`,
      icon: TrendingUpIcon,
      change: '+15%',
      changeType: 'positive',
      href: '/admin/analytics',
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'property_added',
      title: 'New property added',
      description: '3-bedroom house in Manchester',
      time: '2 hours ago',
      status: 'success',
    },
    {
      id: 2,
      type: 'investor_registered',
      title: 'New investor registered',
      description: 'Ahmed Al-Rashid from UAE',
      time: '4 hours ago',
      status: 'pending',
    },
    {
      id: 3,
      type: 'deal_completed',
      title: 'Deal completed',
      description: 'Property in Birmingham sold',
      time: '1 day ago',
      status: 'success',
    },
    {
      id: 4,
      type: 'kyc_pending',
      title: 'KYC verification pending',
      description: '5 investors awaiting verification',
      time: '2 days ago',
      status: 'warning',
    },
  ];

  const pendingTasks = [
    {
      id: 1,
      title: 'Review new property submissions',
      count: 12,
      priority: 'high',
    },
    {
      id: 2,
      title: 'Verify investor documents',
      count: 8,
      priority: 'medium',
    },
    {
      id: 3,
      title: 'Update property analytics',
      count: 3,
      priority: 'low',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-gray-600 mt-1">
          Here's what's happening with the platform today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className="bg-white overflow-hidden shadow-sm rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <item.icon className="h-6 w-6 text-gray-400" />
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
                        item.changeType === 'positive' ? 'text-success-600' : 'text-error-600'
                      }`}>
                        {item.change}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white shadow-sm rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Recent Activities</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="p-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    {activity.status === 'success' && (
                      <CheckCircleIcon className="h-5 w-5 text-success-500" />
                    )}
                    {activity.status === 'pending' && (
                      <ClockIcon className="h-5 w-5 text-warning-500" />
                    )}
                    {activity.status === 'warning' && (
                      <ExclamationIcon className="h-5 w-5 text-error-500" />
                    )}
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="bg-white shadow-sm rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Pending Tasks</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {pendingTasks.map((task) => (
              <div key={task.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {task.title}
                      </p>
                      <div className="flex items-center mt-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          task.priority === 'high' ? 'bg-error-100 text-error-800' :
                          task.priority === 'medium' ? 'bg-warning-100 text-warning-800' :
                          'bg-success-100 text-success-800'
                        }`}>
                          {task.priority}
                        </span>
                        <span className="ml-2 text-sm text-gray-500">
                          {task.count} items
                        </span>
                      </div>
                    </div>
                  </div>
                  <Link
                    to="/admin/tasks"
                    className="text-sm font-medium text-primary-600 hover:text-primary-500"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            to="/admin/properties/new"
            className="relative group bg-gray-50 p-6 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <div>
              <span className="rounded-lg inline-flex p-3 bg-primary-50 text-primary-700 ring-4 ring-white">
                <BuildingOfficeIcon className="h-6 w-6" />
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900">
                Add Property
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Create a new property listing
              </p>
            </div>
          </Link>

          <Link
            to="/admin/investors"
            className="relative group bg-gray-50 p-6 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <div>
              <span className="rounded-lg inline-flex p-3 bg-primary-50 text-primary-700 ring-4 ring-white">
                <UsersIcon className="h-6 w-6" />
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900">
                Manage Investors
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                View and verify investor accounts
              </p>
            </div>
          </Link>

          <Link
            to="/admin/deals"
            className="relative group bg-gray-50 p-6 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <div>
              <span className="rounded-lg inline-flex p-3 bg-primary-50 text-primary-700 ring-4 ring-white">
                <CurrencyPoundIcon className="h-6 w-6" />
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900">
                Review Deals
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Monitor and manage property deals
              </p>
            </div>
          </Link>

          <Link
            to="/admin/analytics"
            className="relative group bg-gray-50 p-6 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <div>
              <span className="rounded-lg inline-flex p-3 bg-primary-50 text-primary-700 ring-4 ring-white">
                <TrendingUpIcon className="h-6 w-6" />
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900">
                View Analytics
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Platform performance insights
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 