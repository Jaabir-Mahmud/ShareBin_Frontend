import React, { useState, useEffect } from 'react';
import authService from '../services/authService';
import { FcGoogle } from 'react-icons/fc';

const LoginPage = ({ navigateTo }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: ''
  });
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and register
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Load saved email and remember me preference from localStorage
  useEffect(() => {
    const savedEmail = localStorage.getItem('sharebin_email');
    const savedRememberMe = localStorage.getItem('sharebin_remember_me') === 'true';
    
    if (savedRememberMe && savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    // Clear error when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleRememberMeChange = (e) => {
    const checked = e.target.checked;
    setRememberMe(checked);
    
    if (checked && formData.email) {
      localStorage.setItem('sharebin_email', formData.email);
      localStorage.setItem('sharebin_remember_me', 'true');
    } else {
      localStorage.removeItem('sharebin_email');
      localStorage.removeItem('sharebin_remember_me');
    }
  };

  const validateForm = () => {
    if (!formData.email) {
      setError('Email is required');
      return false;
    }
    
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Email address is invalid');
      return false;
    }
    
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    
    if (!isLogin && formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    
    if (!isLogin && !formData.username) {
      setError('Username is required');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isLogin) {
        // Login
        const result = await authService.login(formData.email, formData.password);
        setSuccess('Login successful! Redirecting...');
        
        // Save email if remember me is checked
        if (rememberMe) {
          localStorage.setItem('sharebin_email', formData.email);
          localStorage.setItem('sharebin_remember_me', 'true');
        }
        
        // Small delay for better UX
        setTimeout(() => {
          navigateTo('home');
        }, 1000);
      } else {
        // Register
        const result = await authService.register(formData.username, formData.email, formData.password);
        setSuccess('Registration successful! Redirecting...');
        
        // Small delay for better UX
        setTimeout(() => {
          navigateTo('home');
        }, 1000);
      }
    } catch (err) {
      setError(err.message || (isLogin ? 'Login failed' : 'Registration failed'));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const result = await authService.googleLogin();
      setSuccess('Google login successful! Redirecting...');
      
      // Small delay for better UX
      setTimeout(() => {
        navigateTo('home');
      }, 1000);
    } catch (err) {
      setError(err.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 glassmorphism rounded-lg animate-fade-in">
      <h1 className="text-2xl font-bold mb-4 text-center">
        {isLogin ? 'Login' : 'Register'}
      </h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-500 text-white rounded animate-shake">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-500 text-white rounded animate-pulse">
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div>
            <label htmlFor="username" className="block mb-1">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded text-gray-200 focus:border-accent-cyan focus:outline-none transition-colors"
              required={!isLogin}
              disabled={loading}
            />
          </div>
        )}
        
        <div>
          <label htmlFor="email" className="block mb-1">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded text-gray-200 focus:border-accent-cyan focus:outline-none transition-colors"
            required
            disabled={loading}
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block mb-1">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded text-gray-200 focus:border-accent-cyan focus:outline-none transition-colors"
            required
            disabled={loading}
          />
        </div>
        
        {isLogin && (
          <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={handleRememberMeChange}
              className="mr-2"
            />
            <label htmlFor="rememberMe" className="text-sm">Remember me</label>
          </div>
        )}
        
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-accent-cyan text-dark-bg rounded font-medium disabled:opacity-50 hover:bg-cyan-400 transition-colors"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="w-4 h-4 border-t-2 border-dark-bg rounded-full animate-spin mr-2"></div>
              Processing...
            </div>
          ) : (
            isLogin ? 'Login' : 'Register'
          )}
        </button>
      </form>
      
      <div className="my-4 flex items-center">
        <div className="flex-grow border-t border-gray-600"></div>
        <span className="mx-4 text-gray-400">or</span>
        <div className="flex-grow border-t border-gray-600"></div>
      </div>
      
      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white text-gray-700 rounded font-medium disabled:opacity-50 hover:bg-gray-100 transition-colors"
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="w-4 h-4 border-t-2 border-gray-700 rounded-full animate-spin mr-2"></div>
            Processing...
          </div>
        ) : (
          <>
            <FcGoogle className="text-xl" />
            Continue with Google
          </>
        )}
      </button>
      
      <div className="mt-4 text-center">
        <button
          onClick={() => {
            setIsLogin(!isLogin);
            setError('');
            setSuccess('');
          }}
          className="text-accent-cyan hover:underline transition-colors"
        >
          {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
        </button>
      </div>
      
      <div className="mt-4 text-center">
        <button 
          onClick={() => navigateTo && navigateTo('home')} 
          className="text-accent-cyan hover:underline transition-colors"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default LoginPage;