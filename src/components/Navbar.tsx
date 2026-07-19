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
    <nav className="flex justify-between items-center px-6 py-4 sticky top-0 z-50"
      style={{
        background: 'rgba(15, 10, 40, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)'
      }}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl animate-glow"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)' }}>
          📹
        </div>
        <span className="text-2xl font-bold gradient-text">
          SkillTenso
        </span>
      </div>
      <div className="flex gap-3 items-center">
        {user ? (
          <>
            <span className="text-gray-300 text-sm px-3 py-1 rounded-full"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              Hey, {user.name}! 👋
            </span>
            <button onClick={onStartSession} className="glass-btn px-5 py-2 rounded-xl text-white text-sm font-semibold">
              📹 Start Session
            </button>
            <button onClick={onLogout}
              className="px-5 py-2 rounded-xl text-sm font-semibold transition-all hover:bg-red-500/20"
              style={{ border: '1px solid rgba(255,255,255,0.1)', color: '#d1d5db' }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <button onClick={() => onOpenModal('signin')}
              className="px-5 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{ border: '1px solid rgba(255,255,255,0.15)', color: '#d1d5db' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#a855f7')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)')}>
              Sign In
            </button>
            <button onClick={() => onOpenModal('signup')} className="glass-btn px-5 py-2 rounded-xl text-white text-sm font-semibold">
              Get Started ✨
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;