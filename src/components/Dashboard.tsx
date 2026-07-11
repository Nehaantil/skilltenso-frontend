 
import React, { useState } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
}

interface DashboardProps {
  user: User;
  onStartSession: () => void;
  onLogout: () => void;
}

function Dashboard({ user, onStartSession, onLogout }: DashboardProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [showRating, setShowRating] = useState(false);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  const stats = [
    { label: 'Sessions', value: '3', icon: '📹' },
    { label: 'Skills Taught', value: '2', icon: '💡' },
    { label: 'Skills Learned', value: '1', icon: '📚' },
    { label: 'Rating', value: '⭐ 4.8', icon: '🏆' },
  ];

  const recentSessions = [
    { partner: 'Priya Sharma', skill: 'Web Development', date: 'Today', duration: '45 min', rating: 5 },
    { partner: 'Rahul Kumar', skill: 'UI/UX Design', date: 'Yesterday', duration: '30 min', rating: 4 },
    { partner: 'Anjali Singh', skill: 'Data Science', date: '3 days ago', duration: '60 min', rating: 5 },
  ];

  const achievements = [
    { icon: '🎉', title: 'First Session', desc: 'Completed your first session', unlocked: true },
    { icon: '🎓', title: 'Knowledge Sharer', desc: 'Teach 5 different skills', unlocked: false },
    { icon: '⭐', title: 'Top Rated', desc: 'Get 5 star rating', unlocked: true },
    { icon: '🔥', title: 'On Fire', desc: 'Complete 10 sessions', unlocked: false },
  ];

  function submitRating() {
    if (rating === 0) return;
    setRatingSubmitted(true);
    setShowRating(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-purple-700 to-slate-800 text-white">
      
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-xl">
            📹
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            SkillTenso
          </span>
        </div>
        <div className="flex gap-3 items-center">
          <span className="text-gray-300 text-sm">Hey, {user.name}! 👋</span>
          <button
            onClick={onStartSession}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-500 rounded-lg hover:shadow-lg transition-all text-sm font-semibold"
          >
            📹 Start Session
          </button>
          <button
            onClick={onLogout}
            className="px-4 py-2 border border-white/20 rounded-lg hover:border-red-400 hover:text-red-400 transition-all text-sm"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}! 🎉</h1>
          <p className="text-gray-300">Here's your learning journey so far.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-slate-800/60 border border-slate-600/30 rounded-xl p-5 text-center">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-purple-400 mb-1">{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Recent Sessions */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/60 border border-slate-600/30 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">📋 Recent Sessions</h2>
              <div className="space-y-3">
                {recentSessions.map((session, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center font-semibold">
                        {session.partner.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{session.partner}</p>
                        <p className="text-gray-400 text-sm">{session.skill} · {session.duration}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 text-xs mb-1">{session.date}</p>
                      <p className="text-yellow-400 text-sm">{'⭐'.repeat(session.rating)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Rate Session Button */}
              {!ratingSubmitted && (
                <button
                  onClick={() => setShowRating(true)}
                  className="mt-4 w-full py-3 border border-purple-500 rounded-lg text-purple-400 hover:bg-purple-500 hover:text-white transition-all font-medium"
                >
                  ⭐ Rate Your Last Session
                </button>
              )}

              {ratingSubmitted && (
                <div className="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 text-center text-sm">
                  ✅ Rating submitted! Thank you!
                </div>
              )}
            </div>
          </div>

          {/* Right Side */}
          <div className="space-y-6">

            {/* Profile Card */}
            <div className="bg-slate-800/60 border border-slate-600/30 rounded-xl p-6 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <h3 className="text-xl font-semibold">{user.name}</h3>
              <p className="text-gray-400 text-sm mb-3">{user.email}</p>
              <div className="flex justify-center gap-1 mb-4">
                {'⭐⭐⭐⭐⭐'.split('').map((star, i) => (
                  <span key={i} className="text-yellow-400">{star}</span>
                ))}
              </div>
              <button
                onClick={onStartSession}
                className="w-full py-2 bg-gradient-to-r from-purple-600 to-purple-500 rounded-lg hover:shadow-lg transition-all text-sm font-semibold"
              >
                📹 Start New Session
              </button>
            </div>

            {/* Achievements */}
            <div className="bg-slate-800/60 border border-slate-600/30 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">🏆 Achievements</h2>
              <div className="space-y-3">
                {achievements.map((ach, i) => (
                  <div key={i} className={`flex items-center gap-3 p-3 rounded-lg border ${ach.unlocked ? 'bg-green-500/10 border-green-500/30' : 'bg-slate-700/30 border-slate-600/20 opacity-50'}`}>
                    <span className="text-2xl">{ach.icon}</span>
                    <div>
                      <p className={`font-medium text-sm ${ach.unlocked ? 'text-green-400' : 'text-gray-400'}`}>
                        {ach.title}
                      </p>
                      <p className="text-gray-500 text-xs">{ach.desc}</p>
                    </div>
                    {ach.unlocked && <span className="ml-auto text-green-400 text-xs">✅</span>}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Rating Modal */}
      {showRating && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-gradient-to-br from-slate-800 to-slate-700 border border-slate-600/30 rounded-2xl w-full max-w-md mx-4 p-8">
            <h2 className="text-2xl font-bold text-center mb-2">Rate Your Session</h2>
            <p className="text-gray-400 text-center text-sm mb-6">How was your session with Priya Sharma?</p>

            {/* Stars */}
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="text-4xl transition-transform hover:scale-110"
                >
                  {star <= (hoverRating || rating) ? '⭐' : '☆'}
                </button>
              ))}
            </div>

            {/* Review */}
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Write a review (optional)..."
              rows={3}
              className="w-full px-4 py-3 bg-slate-900/80 border border-slate-600/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 text-sm mb-4 resize-none"
            />

            <div className="flex gap-3">
              <button
                onClick={() => setShowRating(false)}
                className="flex-1 py-3 border border-slate-600 rounded-lg hover:border-red-400 hover:text-red-400 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={submitRating}
                className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-purple-500 rounded-lg hover:shadow-lg transition-all font-semibold"
              >
                Submit Rating ⭐
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;