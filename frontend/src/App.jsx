import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import LoadingSpinner from './components/common/LoadingSpinner';

// Import i18n setup
import './i18n';

// Layout components
import PublicLayout from './components/layouts/PublicLayout';
import PortalLayout from './components/layouts/PortalLayout';

// Public pages
import HomePage from './pages/public/HomePage';

// Auth pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';

// Portal pages (lazy load existing pages)
const DashboardPage = React.lazy(() => 
  import('./pages/portal/DashboardPage').catch(() => ({
    default: () => (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p>Welcome to your investor dashboard!</p>
      </div>
    )
  }))
);

const PropertiesPage = React.lazy(() => 
  import('./pages/portal/PropertiesPage').catch(() => ({
    default: () => (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Properties</h1>
        <p>Property listings will appear here.</p>
      </div>
    )
  }))
);

const ProfilePage = React.lazy(() => 
  import('./pages/portal/ProfilePage').catch(() => ({
    default: () => (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>
        <p>Your profile settings will appear here.</p>
      </div>
    )
  }))
);

const DocumentsPage = React.lazy(() => 
  import('./pages/portal/DocumentsPage').catch(() => ({
    default: () => (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Documents</h1>
        <p>Your documents will appear here.</p>
      </div>
    )
  }))
);

// Test page
const TestPage = React.lazy(() => 
  import('./pages/TestPage').catch(() => ({
    default: () => (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4">Test Page</h1>
          <p>If you can see this, your frontend is working!</p>
          <p className="mt-4 text-sm text-gray-600">Backend URL: {import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}</p>
        </div>
      </div>
    )
  }))
);

// Simple PrivateRoute component
const PrivateRoute = ({ children }) => {
  // For now, just render children - later we'll add proper auth check
  return children;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Test route - accessible without authentication */}
            <Route path="/test" element={<TestPage />} />

            {/* Public routes */}
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<HomePage />} />
            </Route>

            {/* Auth routes (standalone) */}
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/register" element={<RegisterPage />} />
            <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/auth/reset-password/:token" element={<ResetPasswordPage />} />
            <Route path="/auth/verify-email/:token" element={<VerifyEmailPage />} />

            {/* Portal routes */}
            <Route
              path="/portal"
              element={
                <PrivateRoute>
                  <PortalLayout />
                </PrivateRoute>
              }
            >
              <Route index element={<Navigate to="/portal/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="properties" element={<PropertiesPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="documents" element={<DocumentsPage />} />
            </Route>

            {/* Catch all other routes and redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Router>
    </QueryClientProvider>
  );
}

export default App;