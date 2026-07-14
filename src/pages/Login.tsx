import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const navigate = useNavigate();

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (isRegisterMode) {
        const { error: signUpError } = await supabase.auth.signUp({
          email: 'owner@madhumithatex.com',
          password: password,
        });
        if (signUpError) throw signUpError;
        alert('Owner account registration initiated! You can now log in.');
        setIsRegisterMode(false);
        setEmail('owner@madhumithatex.com');
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });
        if (signInError) throw signInError;
        navigate('/admin');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-sm border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-brand-black text-brand-white flex items-center justify-center rounded-sm font-semibold text-xl mx-auto mb-4">M</div>
          <h1 className="text-2xl font-semibold text-brand-black">
            {isRegisterMode ? 'Register Owner Account' : 'Admin Login'}
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            {isRegisterMode 
              ? 'Choose a secure password for owner@madhumithatex.com' 
              : 'Sign in to manage your catalogue'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-sm text-sm mb-6 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleAction} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-brand-black mb-1">Email</label>
            <input 
              type="email" 
              required
              disabled={isRegisterMode}
              value={isRegisterMode ? 'owner@madhumithatex.com' : email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black bg-brand-offwhite disabled:opacity-75"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-black mb-1">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black bg-brand-offwhite"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 bg-brand-black text-white rounded-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {loading 
              ? (isRegisterMode ? 'Creating Account...' : 'Signing in...') 
              : (isRegisterMode ? 'Create Owner Account' : 'Sign In')}
          </button>
        </form>

        <div className="text-center mt-6">
          <button 
            onClick={() => {
              setIsRegisterMode(!isRegisterMode);
              setError('');
              setPassword('');
            }}
            className="text-sm text-brand-gold hover:underline cursor-pointer"
          >
            {isRegisterMode 
              ? 'Back to Sign In' 
              : 'New Setup? Create the Owner account here'}
          </button>
        </div>
      </div>
    </div>
  );
}
