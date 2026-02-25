import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Lock } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

    const [error, setError] = useState('');
  const navigate = useNavigate(); // To redirect after login

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('All fields are required.');
      return;
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      // On successful login, redirect based on role
      if (data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }

    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <div className="bg-gray-50 h-full p-6 font-sans">
      <div className="flex items-center mb-10">
        <button className="text-blue-500 font-semibold flex items-center">
          <ArrowLeft size={20} className="mr-1" />
          Back
        </button>
      </div>

      <h1 className="text-4xl font-bold mb-4">Welcome Back</h1>
      <p className="text-gray-500 mb-12">Sign in to continue your application.</p>

            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative mb-4" role="alert">{error}</div>}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="email" 
            placeholder="Email Address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="text-right">
          <a href="#" className="text-sm text-blue-500 font-semibold">Forgot Password?</a>
        </div>

        <button 
          type="submit" 
          className="w-full bg-blue-500 text-white font-bold py-4 rounded-xl hover:bg-blue-600 transition-colors duration-300 shadow-lg shadow-blue-500/30"
        >
          Sign In
        </button>
      </form>

      <p className="text-center text-gray-500 mt-8">
        Don't have an account? <a href="/register" className="text-blue-500 font-semibold">Sign Up</a>
      </p>
    </div>
  );
}
