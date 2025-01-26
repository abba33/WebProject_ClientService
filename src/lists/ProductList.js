import React, { useEffect, useState } from 'react';
import { useAuth } from '../authentication/AuthContext';
import { Link } from 'react-router-dom';
import { fetchProducts, updateLocalStorageWishlist, updateLocalStorageCart, addToWishlist, removeFromWishlist, addToCart, removeFromCart } from '../services/ProductServices';
import { 
  HeartIcon, 
  ShoppingCartIcon, 
  PlusIcon, 
  MinusIcon, 
  InfoIcon 
} from 'lucide-react';

const ProductCard = ({ 
  product, 
  isInWishlist, 
  isInCart, 
  onAddToWishlist, 
  onRemoveFromWishlist, 
  onAddToCart, 
  onRemoveFromCart,
  loadingWishlist,
  loadingCart 
}) => {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (change) => {
    setQuantity(Math.max(1, quantity + change));
    
  };

  return (
    <div className="border-2 border-ash-500 bg-gradient-to-r from-pink-400 to-gray rounded-full p-4 shadow-xl group overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl relative">
   {/* Product Image */}
<div className=" w-full overflow-hidden mb-4">
  <img 
    src={product.img} 
    alt={product.name} 
    className="w-full h-40 object-cover transform transition-all duration-500 group-hover:scale-110"
  />
  <Link 
    to={`/product/${product._id}`} 
    className="absolute top-4 right-4 bg-black/50 text-white p-3 rounded-full shadow-md hover:bg-black/70 transition-all duration-300"
  >
    <InfoIcon className="w-6 h-6" />
  </Link>
</div>

  
    {/* Product Details */}
    <div className="space-y-2 text-center">
      <h3 className="text-2xl font-bold text-white">{product.name}</h3>
      <p className="text-white text-sm line-clamp-2">{product.desc}</p>
      <div className="flex justify-center items-center">
        <span className="text-2xl font-semibold text-yellow-300">${product.price}</span>
        <span className={`text-md font-semibold ${product.available ? 'text-green-400' : 'text-red-400'}`}>
          {product.available ? 'Available' : 'Out of Stock'}
        </span>
      </div>
    </div>
  
    {/* Action Buttons */}
    <div className="grid grid-cols-1 gap-4 mt-4">
      {isInCart ? (
        <button
          onClick={onRemoveFromCart}
          disabled={loadingCart}
          className="w-full py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-all duration-300 disabled:opacity-50"
        >
          <ShoppingCartIcon className="w-5 h-5 inline-block mr-2" />
          <span>{loadingCart ? 'Processing...' : 'Remove from Cart'}</span>
        </button>
      ) : (
        <>
          {/* Quantity Selector */}
          <div className="flex justify-center items-center space-x-2 bg-black/60 rounded-full py-2">
            <button 
              onClick={() => handleQuantityChange(-1)}
              className="w-10 h-10 text-white bg-gray-800 rounded-full hover:bg-gray-700 transition"
            >
              <MinusIcon className="w-4 h-4" />
            </button>
            <span className="text-lg text-white">{quantity}</span>
            <button 
              onClick={() => handleQuantityChange(1)}
              className="w-10 h-10 text-white bg-gray-800 rounded-full hover:bg-gray-700 transition"
            >
              <PlusIcon className="w-4 h-4" />
            </button>
          </div>
  
          {/* Add to Cart Button */}
          <button
            onClick={() => onAddToCart(quantity)}
            disabled={loadingCart}
            className="w-full py-3 bg-gradient-to-r from-pink-600 to-white text-white rounded-full hover:opacity-80 transition-all duration-300 disabled:opacity-50"
          >
            <ShoppingCartIcon className="w-5 h-5 inline-block mr-2" />
            <span>{loadingCart ? 'Adding...' : 'Add to Cart'}</span>
          </button>
        </>
      )}
    </div>
  </div>
  

  );
};

const ProductList = () => {
  const { authState } = useAuth();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [wishlist, setWishlist] = useState(new Set());
  const [cart, setCart] = useState(new Set());
  const [loadingWishlist, setLoadingWishlist] = useState(new Map());
  const [loadingCart, setLoadingCart] = useState(new Map());

  // Previous useEffect and helper functions remain the same as in the original component
  // ... (keep the existing localStorage, fetch, and action methods)
  // Initialize wishlist and cart from localStorage
  useEffect(() => {
    const storedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    setWishlist(new Set(Array.isArray(storedWishlist) ? storedWishlist : []));
  
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(new Set(Array.isArray(storedCart) ? storedCart : []));
  }, []);

  // Fetch products from backend
  useEffect(() => {
    const fetchProductsFromService = async () => {
      try {
        const data = await fetchProducts(authState.token);
        console.log('Fetched Products:', data);
        setProducts(data);
      } catch (error) {
        setError(error.message || 'Failed to fetch products');
      }
    };

    fetchProductsFromService();
  }, [authState.token]); // Dependency on token

  // Save wishlist to localStorage
  const updateLocalStorageWishlistFromService = (updatedWishlist) => {
    updateLocalStorageWishlist(updatedWishlist);
  };

  // Save cart to localStorage
  const updateLocalStorageCartFromService = (updatedCart) => {
    updateLocalStorageCart(updatedCart);
  };

  // Add product to wishlist
  const addToWishlistFromService = async (productId) => {
    setLoadingWishlist((prev) => new Map(prev).set(productId, true)); // Set loading state for the product
    try {
      const response = await addToWishlist(productId, authState.token);
      console.log('Product added to wishlist:', response.data);
      setWishlist((prev) => {
        const updatedWishlist = new Set(prev).add(productId); // Update wishlist state
        updateLocalStorageWishlistFromService(updatedWishlist); // Update localStorage
        return updatedWishlist;
      });
    } catch (error) {
      console.error('Error adding product to wishlist:', error);
    } finally {
      setLoadingWishlist((prev) => {
        const updatedLoading = new Map(prev);
        updatedLoading.delete(productId); // Clear loading state
        return updatedLoading;
      });
    }
  };

  // Remove product from wishlist
  const removeFromWishlistFromService = async (productId) => {
    setLoadingWishlist((prev) => new Map(prev).set(productId, true)); // Set loading state for the product
    try {
      const response = await removeFromWishlist(productId, authState.token);
      console.log('Product removed from wishlist:', response.data);
      setWishlist((prev) => {
        const updatedWishlist = new Set(prev);
        updatedWishlist.delete(productId); // Update wishlist state
        updateLocalStorageWishlistFromService(updatedWishlist); // Update localStorage
        return updatedWishlist;
      });
    } catch (error) {
      console.error('Error removing product from wishlist:', error);
    } finally {
      setLoadingWishlist((prev) => {
        const updatedLoading = new Map(prev);
        updatedLoading.delete(productId); // Clear loading state
        return updatedLoading;
      });
    }
  };

  // Add product to cart with quantity
  const addToCartFromService = async (productId, quantity) => {
    setLoadingCart((prev) => new Map(prev).set(productId, true)); // Set loading state for the product
    try {
      console.log('QUANTITYYYY',quantity)
      const response = await addToCart(productId, quantity, authState.token);
     
      console.log('Product added to cart:', response.data);
      console.log('QUANTITYYYYY')
      console.log(quantity)
      setCart((prev) => {
        const updatedCart = new Set(prev).add(productId); // Update cart state
        updateLocalStorageCartFromService(updatedCart); // Update localStorage
        return updatedCart;
      });
    } catch (error) {
      console.error('Error adding product to cart:', error);
    } finally {
      setLoadingCart((prev) => {
        const updatedLoading = new Map(prev);
        updatedLoading.delete(productId); // Clear loading state
        return updatedLoading;
      });
    }
  };

  // Remove product from cart
  const removeFromCartFromService = async (productId) => {
    setLoadingCart((prev) => new Map(prev).set(productId, true)); // Set loading state for the product
    try {
      const response = await removeFromCart(productId, authState.token);
      console.log('Product removed from cart:', response.data);
      setCart((prev) => {
        const updatedCart = new Set(prev);
        updatedCart.delete(productId); // Update cart state
        updateLocalStorageCartFromService(updatedCart); // Update localStorage
        return updatedCart;
      });
    } catch (error) {
      console.error('Error removing product from cart:', error);
    } finally {
      setLoadingCart((prev) => {
        const updatedLoading = new Map(prev);
        updatedLoading.delete(productId); // Clear loading state
        return updatedLoading;
      });
    }
  };
  
  return (<div 
    className="min-h-screen bg-gray-400 bg-center py-12 px-6 relative overflow-hidden" 
  > 
    <div className="container mx-auto">
      {error && (
        <div className="bg-red-600/30 text-white p-4 rounded-lg text-center mb-4">
          {error}
        </div>
      )}
  
      {products.length === 0 ? (
        <div className="text-center text-white/75">
          No products available at the moment.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              isInWishlist={wishlist.has(product._id)}
              isInCart={cart.has(product._id)}
              onAddToWishlist={() => addToWishlistFromService(product._id)}
              onRemoveFromWishlist={() => removeFromWishlistFromService(product._id)}
              onAddToCart={(quantity) => addToCartFromService(product._id, quantity)}
              onRemoveFromCart={() => removeFromCartFromService(product._id)}
              loadingWishlist={loadingWishlist.get(product._id)}
              loadingCart={loadingCart.get(product._id)}
            />
          ))}
        </div>
      )}
    </div>
  </div>
  

  );
};

export default ProductList;