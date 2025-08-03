// frontend/src/pages/auth/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner, { ButtonSpinner } from '../../components/common/LoadingSpinner';

const LoginPage = () => {
  const { t, i18n } = useTranslation();
  const { login, isAuthenticated, isLoading, error, clearError, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      const from = location.state?.from || (isAdmin ? '/admin/dashboard' : '/portal/dashboard');
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, location.state, isAdmin]);

  // Clear errors when component mounts or when form values change
  useEffect(() => {
    clearError();
    setLoginError('');
  }, [clearError, watch('email'), watch('password')]);

  const onSubmit = async (data) => {
    try {
      setLoginError('');
      const result = await login(data);
      
      if (result.success) {
        // Success feedback
        const redirectPath = location.state?.from || (result.user?.role === 'admin' ? '/admin/dashboard' : '/portal/dashboard');
        navigate(redirectPath, { replace: true });
      } else {
        setLoginError(result.error || t('auth.loginError'));
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError(t('auth.loginError'));
    }
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
  };

  // Show loading spinner while checking authentication status
  if (isLoading) {
    return <LoadingSpinner fullScreen={true} />;
  }

  return (
    <div className="min-h-screen flex" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Left side - Login form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
              <span className="text-white font-bold text-xl">PI</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              {t('auth.signIn')}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {t('auth.dontHaveAccount')}{' '}
              <Link
                to="/auth/register"
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
              >
                {t('auth.createAccount')}
              </Link>
            </p>
          </div>

          {/* Language switcher */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={toggleLanguage}
              className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              {i18n.language === 'en' ? 'العربية' : 'English'}
            </button>
          </div>

          {/* Success/Error messages */}
          {location.state?.message && (
            <div className={`mt-6 p-4 rounded-md ${
              location.state.type === 'error' 
                ? 'bg-red-50 text-red-700 border border-red-200' 
                : 'bg-green-50 text-green-700 border border-green-200'
            }`}>
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm font-medium">{location.state.message}</p>
                </div>
              </div>
            </div>
          )}

          {/* Error display */}
          {(error || loginError) && (
            <div className="mt-6 p-4 rounded-md bg-red-50 border border-red-200">
              <div className="flex">
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-700">
                    {error || loginError}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Login form */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              {/* Email field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  {t('common.email')}
                </label>
                <div className="mt-1 relative">
                  <input
                    {...register('email', {
                      required: t('common.required'),
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: t('common.invalidEmail'),
                      },
                    })}
                    type="email"
                    autoComplete="email"
                    className={`appearance-none block w-full px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder={t('common.email')}
                  />
                  {errors.email && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  )}
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              {/* Password field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  {t('common.password')}
                </label>
                <div className="mt-1 relative">
                  <input
                    {...register('password', {
                      required: t('common.required'),
                      minLength: {
                        value: 6,
                        message: t('common.passwordTooShort'),
                      },
                    })}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    className={`appearance-none block w-full px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.password ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder={t('common.password')}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>
            </div>

            {/* Remember me and forgot password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  {...register('rememberMe')}
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                  {t('auth.rememberMe')}
                </label>
              </div>

              <div className="text-sm">
                <Link
                  to="/auth/forgot-password"
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >
                  {t('auth.forgotPassword')}
                </Link>
              </div>
            </div>

            {/* Submit button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <ButtonSpinner className="mr-2" />
                    {t('common.loading')}
                  </div>
                ) : (
                  t('auth.signIn')
                )}
              </button>
            </div>
          </form>

          {/* Demo credentials */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Demo Credentials:</h4>
              <div className="text-xs text-gray-600 space-y-1">
                <p><strong>Admin:</strong> admin@example.com / admin123</p>
                <p><strong>Investor:</strong> investor@example.com / investor123</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right side - Image/Branding */}
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800">
          <div className="absolute inset-0 bg-black bg-opacity-20">
            <div className="flex flex-col justify-center h-full px-12 text-white">
              <div className="max-w-md">
                <h1 className="text-4xl font-bold mb-6">
                  {t('welcome')} to PropertyInvest
                </h1>
                <p className="text-xl text-blue-100 mb-8">
                  Your gateway to Sharia-compliant property investments in the UK
                </p>
                <div className="space-y-4 text-blue-100">
                  <div className="flex items-center">
                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Vetted Properties
                  </div>
                  <div className="flex items-center">
                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Sharia Compliance
                  </div>
                  <div className="flex items-center">
                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Expert Support
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;