import React, { useState } from 'react';
import authService from '../services/authService';

const LoginPage = ({ navigateTo }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and register
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        // Login
        await authService.login(formData.email, formData.password);
      } else {
        // Register
        await authService.register(formData.username, formData.email, formData.password);
      }
      
      // Navigate to home page after successful login/registration
      navigateTo('home');
    } catch (err) {
      setError(err.message || (isLogin ? 'Login failed' : 'Registration failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 glassmorphism rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">
        {isLogin ? 'Login' : 'Register'}
      </h1>
      
      {error && (
        <div className="mb-4 p-2 bg-red-500 text-white rounded">
          {error}
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
              className="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded text-gray-200"
              required={!isLogin}
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
            className="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded text-gray-200"
            required
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
            className="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded text-gray-200"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-accent-cyan text-dark-bg rounded font-medium disabled:opacity-50"
        >
          {loading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
        </button>
      </form>
      
      <div className="mt-4 text-center">
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-accent-cyan hover:underline"
        >
          {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
        </button>
      </div>
      
      <div className="mt-4 text-center">
        <button 
          onClick={() => navigateTo && navigateTo('home')} 
          className="text-gray-400 hover:underline"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default LoginPage;