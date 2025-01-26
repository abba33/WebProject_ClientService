import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from './AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('https://webproject-authenticationservice.onrender.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();

        if (data.token) {
          login(data.token);
          navigate('/all-products', { replace: true });  // Ensures login page is not in the history
        } else {
          setError('Login failed: Invalid credentials');
        }
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section 
  className="min-h-screen flex items-center justify-start bg-cover bg-center backdrop-blur-lg bg-black/90"
  style={{ backgroundImage: "url('/image.jpeg')" }} 
>
  <div className="w-full max-w-lg p-6 ml-28"> {/* Added left margin to shift left */}
    <h1 className="text-4xl font-bold text-center text-black mb-6">Welcome Back!</h1>

    {error && (
      <div 
        className="bg-red-600/30 text-white text-center p-4 rounded-lg mb-6"
      >
        {error}
      </div>
    )}

    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email Input */}
      <div>
        <label 
          htmlFor="email" 
          className="block text-lg font-bold text-center text-black mb-2"
        >
          Your Email
        </label>
        <input
          type="email"
          id="email"
          placeholder="Email address"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-4 text-gray-800 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
      </div>

      {/* Password Input */}
      <div>
        <label 
          htmlFor="password" 
          className="block text-lg font-bold text-center text-black mb-2"
        >
          Your Password
        </label>
        <input
          type="password"
          id="password"
          placeholder="••••••••"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-4 text-gray-800 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
      </div>

      {/* Submit Button */}
      <button 
        type="submit"
        className="w-full py-3 text-white bg-brown rounded-full hover:bg-black-800 focus:outline-none focus:ring-2 focus:ring-gray-500 text-lg"
        disabled={isLoading}
      >
        {isLoading ? 'Logging in...' : 'Sign In'}
      </button>

      <p className="text-center text-brown-300 text-sm">
        Don’t have an account?{' '}
        <Link to="/register" className="text-white font-medium hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  </div>
</section>

  );
};

export default Login;
