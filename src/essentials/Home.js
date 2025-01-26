import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../authentication/AuthContext';
import PrivateRoute from '../routes/PrivateRoute';
import ProductForm from '../forms/ProductForm';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductList from '../lists/ProductList';
import {
  ShoppingCartIcon,
  HeartIcon,
  UserIcon,
  LogOutIcon,
  ArrowRightIcon,
} from 'lucide-react';
import Cart from '../lists/Cart';


const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      delayChildren: 0.3,
      staggerChildren: 0.2 
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      type: "spring",
      damping: 12,
      stiffness: 100 
    }
  }
};

const FeatureCard = ({ icon, title, description, linkTo, linkText }) => (
  <motion.div 
    variants={itemVariants}
    className="transform transition-all duration-300 hover:scale-105 hover:shadow-2xl bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 space-y-4 overflow-hidden"
  >
    <div className="flex items-center justify-between">
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="bg-white/20 p-3 rounded-full"
      >
        {icon}
      </motion.div>
      <Link 
        to={linkTo} 
        className="text-blue-200 hover:text-white transition-colors flex items-center gap-1"
      >
        {linkText}
        <ArrowRightIcon size={16} className="opacity-70" />
      </Link>
    </div>
    <div>
      <h4 className="text-xl font-bold text-white mb-2 tracking-wide">{title}</h4>
      <p className="text-white/75 text-sm whitespace-pre-line leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

const LoggedOutHome = () => {
  return (
    <div 
    className="relative min-h-screen flex flex-col md:flex-row items-center justify-center bg-cover bg-center backdrop-blur-lg bg-black/90" 
    style={{ backgroundImage: "url('/image.jpeg')" }} 
  >
    {/* Background Text */}
    <div className="absolute inset-0 text-gray-200 text-9xl font-bold uppercase flex justify-center items-center pointer-events-none">
    </div>
  
    {/* Left Section */}
    <div className="relative flex-1 flex items-center justify-center p-8 z-10">
      <div className="w-full max-w-lg">
        <h1 className="text-6xl font-bold text-white mb-4">
          Bring Your Vision to Life
        </h1>
        <p className="text-lg text-gray-300 mb-8">
          Start for free and join a thriving community of innovators.
        </p>
        <div className="flex space-x-4">
          <Link
            to="/login"
            className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Log In
          </Link>
          <Link
            to="/register"
            className="bg-white text-black px-6 py-3 rounded-full hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  
    {/* Right Section with Background Image */}
    <div
      className="flex-1 bg-cover bg-left h-full"
      style={{ backgroundImage: "url('/browny.png')" }}
    ></div>
  </div>
  
);
};


const Home = () => {
  const { authState, dispatch } = useAuth();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!authState.isAuthenticated) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch('https://webproject-authenticationservice.onrender.com/profile', {
          headers: {
            'Authorization': `Bearer ${authState.token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            dispatch({ type: 'LOGOUT' });
            throw new Error('Session expired. Please log in again.');
          }
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        setProfile(data);
      } catch (error) {
        setError(error.message || 'Failed to fetch profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [authState.token, authState.isAuthenticated, dispatch]);

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const fetchCart = async () => {
    if (!authState.isAuthenticated) {
      setError('You must be logged in to view your cart.');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('https://webproject-authenticationservice.onrender.com/cart', {
        headers: {
          'Authorization': `Bearer ${authState.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }

      const data = await response.json();
      // Assuming there's a function to set the cart state
      // setCart(data); // This line is commented out as it's not defined in this context
    } catch (error) {
      setError(error.message || 'Failed to fetch cart');
    } finally {
      setIsLoading(false);
    }
  };

  if (!authState.isAuthenticated) {
    return <LoggedOutHome />;
  }

  if (isLoading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 flex items-center justify-center"
      >
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            transition: { 
              repeat: Infinity, 
              duration: 1 
            } 
          }}
          className="text-white text-2xl"
        >
          Loading...
        </motion.div>
      </motion.div>
    );
  }

  return (
    <Routes>
<Route
    path="/add-product"
    element={
        <PrivateRoute>
            <ProductForm />
        </PrivateRoute>
    }
/>
    </Routes>
    
  );
};

export default Home;