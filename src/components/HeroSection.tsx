import React from 'react';

interface HeroSectionProps {
  onOpenModal: (mode: 'signin' | 'signup') => void;
}

function HeroSection({ onOpenModal }: HeroSectionProps) {
  return (
    <section className="text-center py-32 px-6 relative overflow-hidden">

      {/* Background blobs */}
      <div className="absolute top-20 left-20 w-72 h-72 rounded-full opacity-20 animate-float"
        style={{ background: 'radial-gradient(circle, #7c3aed, transparent)', filter: 'blur(40px)' }} />
      <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full opacity-15 animate-float"
        style={{ background: 'radial-gradient(circle, #ec4899, transparent)', filter: 'blur(60px)', animationDelay: '3s' }} />

      <div className="relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-sm"
          style={{ background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(168,85,247,0.4)', color: '#c084fc' }}>
          ✨ AI-Powered Skill Exchange Platform
        </div>

        <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
          Exchange Skills,<br/>
          <span className="gradient-text">Transform Lives</span>
        </h1>

        <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
          Connect with learners worldwide through live video sessions. Share what you know, learn what you love.
        </p>

        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={() => onOpenModal('signup')}
            className="glass-btn px-8 py-4 rounded-xl text-lg font-semibold text-white"
          >
            Start Learning Today ✨
          </button>
          <button
            onClick={() => onOpenModal('signin')}
            className="px-8 py-4 rounded-xl text-lg font-semibold transition-all hover:bg-white/5"
            style={{ border: '1px solid rgba(255,255,255,0.2)', color: '#d1d5db' }}
          >
            Already a Member?
          </button>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-12 mt-16 flex-wrap">
          {[
            { num: '10K+', label: 'Learners' },
            { num: '500+', label: 'Skills' },
            { num: '50K+', label: 'Sessions' },
            { num: '4.9★', label: 'Rating' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-bold gradient-text">{stat.num}</div>
              <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HeroSection;