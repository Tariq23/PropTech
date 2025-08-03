// frontend/src/pages/auth/RegisterPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner, { ButtonSpinner } from '../../components/common/LoadingSpinner';

const RegisterPage = () => {
  const { t, i18n } = useTranslation();
  const { register: registerUser, isAuthenticated, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registrationError, setRegistrationError] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setError,
  } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false,
      investorType: 'individual',
    },
  });

  const watchPassword = watch('password');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/portal/dashboard', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Clear errors when component mounts or when form values change
  useEffect(() => {
    clearError();
    setRegistrationError('');
  }, [clearError, watch('email')]);

  const onSubmit = async (data) => {
    try {
      setRegistrationError('');
      setRegistrationSuccess('');

      // Validate password confirmation
      if (data.password !== data.confirmPassword) {
        setError('confirmPassword', {
          type: 'manual',
          message: t('common.passwordsDoNotMatch'),
        });
        return;
      }

      // Prepare registration data
      const registrationData = {
        full_name: data.fullName,
        email: data.email,
        password: data.password,
        investor_type: data.investorType,
        language_preference: i18n.language,
      };

      const result = await registerUser(registrationData);
      
      if (result.success) {
        setRegistrationSuccess(result.message || t('auth.registrationSuccess'));
        
        // If email verification is required, show success message
        if (result.requiresVerification) {
          setTimeout(() => {
            navigate('/auth/login', {
              state: {
                message: t('auth.registrationSuccess'),
                type: 'success'
              }
            });
          }, 3000);
        } else {
          // Auto-login successful, redirect to dashboard
          navigate('/portal/dashboard', { replace: true });
        }
      } else {
        setRegistrationError(result.error || t('auth.registrationError'));
      }
    } catch (error) {
      console.error('Registration error:', error);
      setRegistrationError(t('auth.registrationError'));
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
      {/* Left side - Registration form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
              <span className="text-white font-bold text-xl">PI</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              {t('auth.createAccount')}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {t('auth.alreadyHaveAccount')}{' '}
              <Link
                to="/auth/login"
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
              >
                {t('auth.signIn')}
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

          {/* Success message */}
          {registrationSuccess && (
            <div className="mt-6 p-4 rounded-md bg-green-50 border border-green-200">
              <div className="flex">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-700">
                    {registrationSuccess}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error display */}
          {(error || registrationError) && (
            <div className="mt-6 p-4 rounded-md bg-red-50 border border-red-200">
              <div className="flex">
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-700">
                    {error || registrationError}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Registration form */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              {/* Full Name field */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                  {t('common.fullName')}
                </label>
                <div className="mt-1">
                  <input
                    {...register('fullName', {
                      required: t('common.required'),
                      minLength: {
                        value: 2,
                        message: 'Name must be at least 2 characters',
                      },
                    })}
                    type="text"
                    autoComplete="name"
                    className={`appearance-none block w-full px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.fullName ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder={t('common.fullName')}
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
                  )}
                </div>
              </div>

              {/* Email field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  {t('common.email')}
                </label>
                <div className="mt-1">
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
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>
              </div>

              {/* Investor Type */}
              <div>
                <label htmlFor="investorType" className="block text-sm font-medium text-gray-700">
                  {t('profile.investorType')}
                </label>
                <div className="mt-1">
                  <select
                    {...register('investorType', { required: t('common.required') })}
                    className={`appearance-none block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.investorType ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="individual">{t('profile.individual')}</option>
                    <option value="corporate">{t('profile.corporate')}</option>
                    <option value="institutional">{t('profile.institutional')}</option>
                  </select>
                  {errors.investorType && (
                    <p className="mt-1 text-sm text-red-600">{errors.investorType.message}</p>
                  )}
                </div>
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
                        value: 8,
                        message: t('common.passwordTooShort'),
                      },
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                        message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
                      },
                    })}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
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

              {/* Confirm Password field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  {t('common.confirmPassword')}
                </label>
                <div className="mt-1 relative">
                  <input
                    {...register('confirmPassword', {
                      required: t('common.required'),
                      validate: (value) =>
                        value === watchPassword || t('common.passwordsDoNotMatch'),
                    })}
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    className={`appearance-none block w-full px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder={t('common.confirmPassword')}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
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
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            {/* Terms and conditions */}
            <div className="flex items-start">
              <input
                {...register('agreeToTerms', {
                  required: 'You must agree to the terms and conditions',
                })}
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
              />
              <div className="ml-3">
                <label className="text-sm text-gray-700">
                  I agree to the{' '}
                  <Link to="/terms" className="text-blue-600 hover:text-blue-500 font-medium">
                    Terms and Conditions
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-blue-600 hover:text-blue-500 font-medium">
                    Privacy Policy
                  </Link>
                </label>
                {errors.agreeToTerms && (
                  <p className="mt-1 text-sm text-red-600">{errors.agreeToTerms.message}</p>
                )}
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
                  t('auth.createAccount')
                )}
              </button>
            </div>
          </form>

          {/* Additional info */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-600">
              By creating an account, you'll have access to our Sharia-compliant property investment platform
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Image/Branding */}
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-green-800">
          <div className="absolute inset-0 bg-black bg-opacity-20">
            <div className="flex flex-col justify-center h-full px-12 text-white">
              <div className="max-w-md">
                <h1 className="text-4xl font-bold mb-6">
                  Start Your Investment Journey
                </h1>
                <p className="text-xl text-green-100 mb-8">
                  Join thousands of investors who trust our platform for their property investments
                </p>
                <div className="space-y-4 text-green-100">
                  <div className="flex items-center">
                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Secure & Regulated
                  </div>
                  <div className="flex items-center">
                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Fast & Easy Setup
                  </div>
                  <div className="flex items-center">
                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
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

export default RegisterPage;