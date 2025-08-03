import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

const TestPage = () => {
  const [connectionStatus, setConnectionStatus] = useState('testing...');
  const [apiData, setApiData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Test basic connection
      const healthCheck = await apiService.healthCheck();
      console.log('Health check:', healthCheck);
      
      // Test public API
      const testResult = await apiService.testConnection();
      console.log('Test result:', testResult);
      
      // Get stats
      const stats = await apiService.getStats();
      console.log('Stats:', stats);
      
      setConnectionStatus('✅ Connected successfully!');
      setApiData({
        health: healthCheck,
        test: testResult,
        stats: stats
      });
      
    } catch (err) {
      console.error('Connection test failed:', err);
      setConnectionStatus('❌ Connection failed');
      setError(err.message || 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const retryConnection = () => {
    testConnection();
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            API Connection Test
          </h1>
          
          {/* Connection Status */}
          <div className="mb-8 text-center">
            <div className="text-2xl mb-4">
              Status: <span className="font-mono">{connectionStatus}</span>
            </div>
            
            {loading && (
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            )}
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <h3 className="text-lg font-semibold text-red-800 mb-2">Error Details:</h3>
                <p className="text-red-700 font-mono text-sm">{error}</p>
              </div>
            )}
            
            <button
              onClick={retryConnection}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Testing...' : 'Retry Connection'}
            </button>
          </div>

          {/* API Response Data */}
          {apiData && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">API Response Data:</h2>
              
              {/* Health Check */}
              {apiData.health && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Health Check:</h3>
                  <pre className="text-sm text-green-700 overflow-x-auto">
                    {JSON.stringify(apiData.health, null, 2)}
                  </pre>
                </div>
              )}
              
              {/* Test Endpoint */}
              {apiData.test && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">Test Endpoint:</h3>
                  <pre className="text-sm text-blue-700 overflow-x-auto">
                    {JSON.stringify(apiData.test, null, 2)}
                  </pre>
                </div>
              )}
              
              {/* Stats */}
              {apiData.stats && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-purple-800 mb-2">Platform Stats:</h3>
                  <pre className="text-sm text-purple-700 overflow-x-auto">
                    {JSON.stringify(apiData.stats, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* Debug Information */}
          <div className="mt-8 bg-gray-50 border rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Debug Information:</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Frontend URL:</strong> {window.location.origin}</p>
              <p><strong>API Base URL:</strong> {import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}</p>
              <p><strong>Environment:</strong> {import.meta.env.MODE}</p>
            </div>
          </div>

          {/* Available Endpoints */}
          <div className="mt-6 bg-gray-50 border rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Available API Endpoints:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• GET / - Root health check</li>
              <li>• GET /api/health - API health check</li>
              <li>• GET /api/public/test - Public test endpoint</li>
              <li>• GET /api/public/stats - Platform statistics</li>
              <li>• POST /api/auth/login - User login</li>
              <li>• POST /api/auth/register - User registration</li>
            </ul>
          </div>

          {/* Back to Home */}
          <div className="mt-8 text-center">
            <a 
              href="/" 
              className="inline-block bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
            >
              ← Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;