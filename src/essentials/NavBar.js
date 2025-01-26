import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../authentication/AuthContext';
import { 
  HomeIcon, 
  ShoppingCartIcon, 
  PlusSquareIcon, 
  LogOutIcon, 
  MenuIcon,
  XIcon
} from 'lucide-react';

const NavBar = () => {
  const { authState, dispatch } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const NavLinks = () => (
    <>
      <Link 
        to="/all-products" 
        className="flex items-center space-x-2 hover:bg-blue-700/30 px-3 py-2 rounded-md transition-all duration-200 text-black"
      >
        <HomeIcon size={18} />
        <span>Home</span>
      </Link>

      <Link 
        to="/cart" 
        className="flex items-center space-x-2 hover:bg-blue-700/30 px-3 py-2 rounded-md transition-all duration-200 text-black"
      >
        <ShoppingCartIcon size={18} />
        <span>Cart</span>
      </Link>

      <Link 
        to="/add-product" 
        className="flex items-center space-x-2 hover:bg-blue-700/30 px-3 py-2 rounded-md transition-all duration-200 text-black"
      >
        <PlusSquareIcon size={18} />
        <span>Add Product</span>
      </Link>

      <button
        onClick={handleLogout}
        className="flex items-center space-x-2 hover:bg-red-700/30 px-3 py-2 rounded-md transition-all duration-200 text-black"
      >
        <LogOutIcon size={18} />
        <span>Logout</span>
      </button>
    </>
  );

  // Only render NavBar if authenticated
  if (!authState.isAuthenticated) {
    return null;
  }

  return (
    <nav className="bg-red-200 p-4 shadow-md relative  max-w-8xl mx-auto flex justify-between items-center">

 {/* Logo */}
 <div className="text-2xl font-semibold text-white ml-20">
      AE-Mart
    </div>

      <div className="ml-8xl  flex justify-between items-center">
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <NavLinks />
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button 
            onClick={toggleMobileMenu}
            className="text-black focus:outline-none"
          >
            {isMobileMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-blue-600 z-50">
          <div className="flex flex-col space-y-2 p-4">
            <NavLinks />
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
