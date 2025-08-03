import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';

const VerifyEmailPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await authService.verifyEmail(token);
        setIsSuccess(true);
        toast.success('Email verified successfully!');
        setTimeout(() => {
          navigate('/auth/login');
        }, 3000);
      } catch (error) {
        setError(error.message || 'Email verification failed');
        toast.error('Email verification failed');
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      verifyEmail();
    } else {
      setError('Invalid verification link');
      setIsLoading(false);
    }
  }, [token, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="flex justify-center">
              <Link to="/" className="flex items-center">
                <span className="text-3xl font-bold text-primary-600">PropTech</span>
              </Link>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Verifying your email...
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Please wait while we verify your email address.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="flex justify-center">
              <Link to="/" className="flex items-center">
                <span className="text-3xl font-bold text-primary-600">PropTech</span>
              </Link>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Verification Failed
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              {error}
            </p>
          </div>
          
          <div className="text-center">
            <Link to="/auth/login">
              <Button variant="primary" className="w-full">
                Go to Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="flex justify-center">
              <Link to="/" className="flex items-center">
                <span className="text-3xl font-bold text-primary-600">PropTech</span>
              </Link>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Email Verified Successfully!
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Your email address has been verified. You can now log in to your account.
            </p>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-4">
              Redirecting to login page...
            </p>
            <Link to="/auth/login">
              <Button variant="primary" className="w-full">
                Go to Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default VerifyEmailPage; 