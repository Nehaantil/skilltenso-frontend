import React from 'react';

interface CTASectionProps {
  onOpenModal: (mode: 'signin' | 'signup') => void;
}

function CTASection({ onOpenModal }: CTASectionProps) {
  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="glass-card-strong p-16 relative overflow-hidden">

          {/* Background glow */}
          <div className="absolute inset-0 opacity-30"
            style={{ background: 'radial-gradient(circle at center, #7c3aed, transparent 70%)' }} />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-sm"
              style={{ background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(168,85,247,0.4)', color: '#c084fc' }}>
              🚀 Join 10,000+ learners
            </div>

            <h2 className="text-5xl font-bold mb-6">
              Ready to Start Your
              <span className="gradient-text"> Learning Journey?</span>
            </h2>

            <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
              Join thousands of learners who are already exchanging skills and transforming their lives with SkillTenso.
            </p>

            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={() => onOpenModal('signup')}
                className="glass-btn px-10 py-4 rounded-xl text-lg font-semibold text-white"
              >
                🚀 Join SkillTenso Now
              </button>
              <button
                onClick={() => onOpenModal('signin')}
                className="px-10 py-4 rounded-xl text-lg font-semibold transition-all hover:bg-white/5"
                style={{ border: '1px solid rgba(255,255,255,0.2)', color: '#d1d5db' }}
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTASection;