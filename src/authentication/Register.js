import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('Buyer');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await fetch('https://webproject-authenticationservice.onrender.com/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                    phone,
                    role
                }),
            });

            if (!response.ok) {
                throw new Error('Registration failed');
            }

            navigate('/login');
        } catch (error) {
            setError(error.message || 'Registration failed');
        }
    };

    return (
      <section
  className="min-h-screen flex items-center justify-start py-12 px-6 bg-cover bg-center"
  style={{ backgroundImage: "url('/image.jpeg')" }} // Replace with the correct image path
>
  {/* Left-aligned Form Section */}
  <div className="w-full max-w-lg p-8 mx-24 space-y-8 bg-transparent">
    {/* Logo/Header */}
    <h1 className="text-3xl font-semibold text-black text-left mb-6 mx-20">
      Create your account
    </h1>

    {/* Form Section */}
    <form className="space-y-4" onSubmit={handleSubmit}>
      {/* Email Input */}
      <div>
        <label htmlFor="email" className="block text-lg font-medium text-black">
          Your email
        </label>
        <input
          type="email"
          name="email"
          id="email"
          className="bg-opacity-100 w-full p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500 text-black bg-opacity-100"
          placeholder="name@company.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {/* Password Input */}
      <div>
        <label htmlFor="password" className="block text-lg font-medium text-black">
          Password
        </label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="••••••••"
          className="w-full p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500 text-black bg-opacity-50"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {/* Confirm Password Input */}
      <div>
        <label htmlFor="confirmPassword" className="block text-lg font-medium text-black">
          Confirm Password
        </label>
        <input
          type="password"
          name="confirmPassword"
          id="confirmPassword"
          placeholder="••••••••"
          className="w-full p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500 text-black bg-opacity-50"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      {/* Phone Input */}
      <div>
        <label htmlFor="phone" className="block text-lg font-medium text-black">
          Phone
        </label>
        <input
          type="text"
          name="phone"
          id="phone"
          placeholder="Enter your phone number"
          className="w-full p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500 text-black bg-opacity-50"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      {/* Role Select */}
      <div>
        <label htmlFor="role" className="block text-lg font-medium text-black">
          Role
        </label>
        <select
          name="role"
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500 text-black bg-opacity-50"
        >
          <option value="Buyer">Buyer</option>
          <option value="Seller">Seller</option>
        </select>
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500 text-lg">{error}</p>}

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-black text-white py-2 rounded-full hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 text-lg"
      >
        Create Account
      </button>

      {/* Footer */}
      <p className="text-sm text-center text-black">
        Already have an account?{" "}
        <Link to="/login" className="text-white font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  </div>

  {/* Right Section with Background Image (Optional) */}
  <div className="flex-1 bg-cover bg-left h-full" style={{ backgroundImage: "url('/browny.png')" }}></div>
</section>


      
    );
};

export default Register;
