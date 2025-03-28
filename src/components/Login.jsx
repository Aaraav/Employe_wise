import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuroraBackground } from './ui/aurora-background';
export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
  
      try {
        const response = await fetch('https://reqres.in/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          localStorage.setItem('token', data.token);
          navigate('/users');
        } else {
          throw new Error(data.error || 'Invalid credentials');
        }
      } catch (error) {
        setError(error.message || 'Something went wrong');
      }
    };

  return (
    <div className="relative flex justify-center items-center h-screen bg-black overflow-hidden">
      {/* Aurora Background Component */}
      <div className="absolute inset-0">
        <AuroraBackground />
      </div>

      {/* Login Form */}
      <div className="relative bg-white p-8 shadow-2xl rounded-lg w-96 backdrop-blur-lg z-10">
        <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800">Login</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

