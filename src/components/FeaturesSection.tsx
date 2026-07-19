import React from 'react';

const features = [
  {
    icon: '📹',
    title: 'Live Video Sessions',
    desc: 'Connect face-to-face through high-quality video calls. Learn interactively and get instant feedback.',
    color: '#7c3aed'
  },
  {
    icon: '🤝',
    title: 'Smart AI Matching',
    desc: 'Our AI algorithm matches you with the perfect learning partner based on your skills and goals.',
    color: '#ec4899'
  },
  {
    icon: '⚡',
    title: 'Skill Exchange',
    desc: 'Trade your expertise for new knowledge. Teach what you know and learn what you want.',
    color: '#f59e0b'
  },
  {
    icon: '💬',
    title: 'Real-time Chat',
    desc: 'Chat and share notes during sessions. Collaborate seamlessly with your learning partner.',
    color: '#06b6d4'
  },
  {
    icon: '🤖',
    title: 'AI Summaries',
    desc: 'Get AI-generated session summaries and personalized learning recommendations after each session.',
    color: '#10b981'
  },
  {
    icon: '🏆',
    title: 'Achievements',
    desc: 'Earn badges and certificates as you learn and teach. Track your progress on your dashboard.',
    color: '#f97316'
  },
];

function FeaturesSection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4">
            Everything you need to
            <span className="gradient-text"> learn & teach</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            A complete platform for peer-to-peer skill exchange with cutting-edge features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div key={i} className="glass-card p-6 hover:-translate-y-2 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                style={{ background: `${feature.color}20`, border: `1px solid ${feature.color}40` }}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
              <div className="mt-4 h-0.5 w-0 group-hover:w-full transition-all duration-500 rounded-full"
                style={{ background: `linear-gradient(90deg, ${feature.color}, transparent)` }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;