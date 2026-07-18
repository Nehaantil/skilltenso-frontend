import React from 'react';

interface User {
  id: number;
  name: string;
  email: string;
}

interface NavbarProps {
  user: User | null;
  onOpenModal: (mode: 'signin' | 'signup') => void;
  onLogout: () => void;
  onStartSession: () => void;
}

function Navbar({ user, onOpenModal, onLogout, onStartSession }: NavbarProps) {
  return (
    <nav className="flex justify-between items-center px-6 py-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-xl">
          📹
        </div>
        <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          SkillTenso
        </span>
      </div>
      <div className="flex gap-4 items-center">
        {user ? (
          <>
            <span className="text-gray-300 text-sm">
              Hey, {user.name}! 👋
            </span>
            <button
              onClick={onStartSession}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-500 rounded-lg hover:shadow-lg hover:shadow-purple-500/40 transition-all"
            >
              📹 Start Session
            </button>
            <button
              onClick={onLogout}
              className="px-6 py-2 border border-white/20 rounded-lg hover:border-red-400 hover:text-red-400 transition-all"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => onOpenModal('signin')}
              className="px-6 py-2 border border-white/20 rounded-lg hover:border-purple-400 hover:text-purple-400 transition-all"
            >
              Sign In
            </button>
            <button
              onClick={() => onOpenModal('signup')}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-500 rounded-lg hover:shadow-lg hover:shadow-purple-500/40 transition-all"
            >
              Get Started
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
