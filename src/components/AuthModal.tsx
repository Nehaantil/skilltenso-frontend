import React, { useState } from 'react';
import { signupAPI, signinAPI } from '../api/auth';

interface AuthModalProps {
  isOpen: boolean;
  mode: 'signin' | 'signup';
  onClose: () => void;
  onSuccess: (user: any, token: string) => void;
}

function AuthModal({ isOpen, mode, onClose, onSuccess }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState(mode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (activeTab === 'signup') {
        if (!name || !email || !password || !confirm) {
          setError('Please fill all fields!');
          setLoading(false);
          return;
        }
        if (password !== confirm) {
          setError('Passwords do not match!');
          setLoading(false);
          return;
        }
        const data = await signupAPI(name, email, password);
        onSuccess(data.user, data.token);
        onClose();
      } else {
        if (!email || !password) {
          setError('Please fill all fields!');
          setLoading(false);
          return;
        }
        const data = await signinAPI(email, password);
        onSuccess(data.user, data.token);
        onClose();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong!');
    }

    setLoading(false);
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-gradient-to-br from-slate-800 to-slate-700 border border-slate-600/30 rounded-2xl w-full max-w-md mx-4 shadow-2xl">
        
        {/* Header */}
        <div className="p-8 pb-4 border-b border-slate-600/30 relative">
          <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Welcome to SkillTenso
          </h2>
          <p className="text-center text-gray-400 text-sm mt-2">
            Connect, Learn, and Grow Together
          </p>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-600/50 text-gray-400 hover:text-white hover:bg-red-500/50 transition-all"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="p-8">
          <div className="grid grid-cols-2 bg-slate-900/50 rounded-lg p-1 mb-6">
            <button
              onClick={() => setActiveTab('signup')}
              className={`py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'signup'
                  ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Sign Up
            </button>
            <button
              onClick={() => setActiveTab('signin')}
              className={`py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'signin'
                  ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {activeTab === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 bg-slate-900/80 border border-slate-600/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-slate-900/80 border border-slate-600/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 bg-slate-900/80 border border-slate-600/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all"
              />
            </div>

            {activeTab === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Confirm Password</label>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Confirm your password"
                  className="w-full px-4 py-3 bg-slate-900/80 border border-slate-600/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-500 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/40 transition-all mt-2 disabled:opacity-50"
            >
              {loading ? 'Please wait...' : activeTab === 'signup' ? 'Create Account' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;