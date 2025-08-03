// frontend/src/components/common/PrivateRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const PrivateRoute = ({ children, adminOnly = false, redirectTo = '/auth/login' }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while authentication status is being determined
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" text="Checking authentication..." />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location.pathname }}
        replace 
      />
    );
  }

  // Check admin access if required
  if (adminOnly && user?.user_type !== 'admin') {
    return (
      <Navigate 
        to="/portal/dashboard" 
        replace 
      />
    );
  }

  // User is authenticated and has proper permissions
  return children;
};

// HOC version for wrapping components
export const withAuth = (Component, options = {}) => {
  return (props) => (
    <PrivateRoute {...options}>
      <Component {...props} />
    </PrivateRoute>
  );
};

// Role-based route protection
export const RoleBasedRoute = ({ 
  children, 
  allowedRoles = [], 
  fallbackRoute = '/portal/dashboard' 
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" text="Checking permissions..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate 
        to="/auth/login" 
        state={{ from: location.pathname }}
        replace 
      />
    );
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.user_type)) {
    return <Navigate to={fallbackRoute} replace />;
  }

  return children;
};

// Feature-based route protection
export const FeatureRoute = ({ 
  children, 
  feature, 
  fallbackRoute = '/portal/dashboard' 
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate 
        to="/auth/login" 
        state={{ from: location.pathname }}
        replace 
      />
    );
  }

  // Check if user has access to the feature
  const hasFeatureAccess = user?.features?.includes(feature) || user?.user_type === 'admin';
  
  if (!hasFeatureAccess) {
    return <Navigate to={fallbackRoute} replace />;
  }

  return children;
};

// Subscription-based route protection
export const SubscriptionRoute = ({ 
  children, 
  requiredPlan = 'basic',
  fallbackRoute = '/portal/upgrade' 
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate 
        to="/auth/login" 
        state={{ from: location.pathname }}
        replace 
      />
    );
  }

  const planHierarchy = {
    basic: 1,
    premium: 2,
    professional: 3,
    enterprise: 4
  };

  const userPlanLevel = planHierarchy[user?.subscription_plan] || 0;
  const requiredPlanLevel = planHierarchy[requiredPlan] || 1;

  if (userPlanLevel < requiredPlanLevel) {
    return <Navigate to={fallbackRoute} replace />;
  }

  return children;
};

// Email verification route protection
export const VerifiedRoute = ({ 
  children, 
  redirectTo = '/portal/verify-email' 
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate 
        to="/auth/login" 
        state={{ from: location.pathname }}
        replace 
      />
    );
  }

  if (!user?.is_verified) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

// Combined protection wrapper
export const ProtectedRoute = ({ 
  children,
  requireAuth = true,
  requireVerification = false,
  allowedRoles = [],
  requiredFeatures = [],
  requiredPlan = null,
  adminOnly = false
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  // Check authentication
  if (requireAuth && !isAuthenticated) {
    return (
      <Navigate 
        to="/auth/login" 
        state={{ from: location.pathname }}
        replace 
      />
    );
  }

  // Check email verification
  if (requireVerification && !user?.is_verified) {
    return <Navigate to="/portal/verify-email" replace />;
  }

  // Check admin access
  if (adminOnly && user?.user_type !== 'admin') {
    return <Navigate to="/portal/dashboard" replace />;
  }

  // Check role-based access
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.user_type)) {
    return <Navigate to="/portal/dashboard" replace />;
  }

  // Check feature access
  if (requiredFeatures.length > 0) {
    const hasAllFeatures = requiredFeatures.every(
      feature => user?.features?.includes(feature) || user?.user_type === 'admin'
    );
    if (!hasAllFeatures) {
      return <Navigate to="/portal/dashboard" replace />;
    }
  }

  // Check subscription plan
  if (requiredPlan) {
    const planHierarchy = {
      basic: 1,
      premium: 2,
      professional: 3,
      enterprise: 4
    };

    const userPlanLevel = planHierarchy[user?.subscription_plan] || 0;
    const requiredPlanLevel = planHierarchy[requiredPlan] || 1;

    if (userPlanLevel < requiredPlanLevel) {
      return <Navigate to="/portal/upgrade" replace />;
    }
  }

  return children;
};

export default PrivateRoute;