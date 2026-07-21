
import React, { useState } from 'react';
import { generateSummaryAPI } from '../api/ai';
import Quiz from './Quiz';import Certificate from './Certificate';
import Notifications from './Notifications';


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
  const [aiSummary, setAiSummary] = useState('');
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizData, setQuizData] = useState<any>(null);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);

  const stats = [
    { label: 'Sessions', value: '3', icon: '📹' },
    { label: 'Skills Taught', value: '2', icon: '💡' },
    { label: 'Skills Learned', value: '1', icon: '📚' },
    { label: 'Rating', value: '4.8', icon: '⭐' },
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

  async function handleGenerateSummary() {
    setLoadingSummary(true);
    try {
      const data = await generateSummaryAPI('Priya Sharma', 'Web Development', 45, 12);
      setAiSummary(data.summary);
    } catch (error) {
      setAiSummary('Could not generate summary. Please try again!');
    }
    setLoadingSummary(false);
  }

  async function handleGenerateQuiz() {
    setLoadingQuiz(true);
    try {
      const response = await fetch('https://skilltenso.onrender.com/api/ai/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skill: 'Web Development' })
      });
      const data = await response.json();
      setQuizData(data.quiz);
      setShowQuiz(true);
    } catch (error) {
      console.error('Quiz error:', error);
    }
    setLoadingQuiz(false);
  }

  function submitRating() {
    if (rating === 0) return;
    setRatingSubmitted(true);
    setShowRating(false);
  }

  return (
    <>
      {showQuiz && quizData && (
        <Quiz
          skill={quizData.skill}
          questions={quizData.questions}
          onClose={() => setShowQuiz(false)}
        />
      )}
      {showCertificate && (
  <Certificate
    userName={user.name}
    skill="Web Development"
    partnerName="Priya Sharma"
    duration="45 minutes"
    onClose={() => setShowCertificate(false)}
  />
)}

      <div className="min-h-screen text-white hero-gradient">

        {/* Navbar */}
        <nav className="flex justify-between items-center px-6 py-4 sticky top-0 z-40"
          style={{ background: 'rgba(15,10,40,0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)' }}>📹</div>
            <span className="text-2xl font-bold gradient-text">SkillTenso</span>
          </div>
          <div className="flex gap-3 items-center">
            <span className="text-gray-300 text-sm px-3 py-1 rounded-full"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              Hey, {user.name}! 👋
              <Notifications userId={user.id} />
            </span>
            <button onClick={onStartSession}
              className="px-4 py-2 rounded-xl text-sm font-semibold"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: 'white' }}>
              📹 Start Session
            </button>
            <button onClick={onLogout}
              className="px-4 py-2 rounded-xl text-sm transition-all"
              style={{ border: '1px solid rgba(255,255,255,0.1)', color: '#d1d5db' }}>
              Logout
            </button>
          </div>
        </nav>

        <div className="max-w-6xl mx-auto px-6 py-8">

          {/* Welcome */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}! 🎉</h1>
            <p className="text-gray-400">Here's your learning journey so far.</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, i) => (
              <div key={i} className="glass-card p-5 text-center">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold mb-1 gradient-text">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* AI Summary */}
          <div className="glass-card p-6 mb-6"
            style={{ border: '1px solid rgba(168,85,247,0.3)' }}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">🤖 AI Session Summary</h2>
              <button onClick={handleGenerateSummary} disabled={loadingSummary}
                className="px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)', color: 'white' }}>
                {loadingSummary ? '⏳ Generating...' : '✨ Generate Summary'}
              </button>
            </div>
            {aiSummary ? (
              <div className="p-4 rounded-lg" style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)' }}>
                <p className="text-gray-200 leading-relaxed">{aiSummary}</p>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Click "Generate Summary" to get an AI-powered summary!</p>
            )}
          </div>

          {/* Quiz Section */}
          <div className="glass-card p-6 mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-white">🧠 Skill Quiz</h2>
                <p className="text-gray-400 text-sm mt-1">Test your knowledge with AI generated quiz!</p>
              </div>
              <button onClick={handleGenerateQuiz} disabled={loadingQuiz}
                className="px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)', color: 'white' }}>
                {loadingQuiz ? '⏳ Loading...' : '🧠 Take Quiz'}
              </button>
            </div>
          </div>
          {/* Certificate Section */}
<div className="glass-card p-6 mb-8">
  <div className="flex justify-between items-center">
    <div>
      <h2 className="text-xl font-semibold text-white">🏆 Certificate</h2>
      <p className="text-gray-400 text-sm mt-1">Download your session completion certificate!</p>
    </div>
    <button
      onClick={() => setShowCertificate(true)}
      className="px-4 py-2 rounded-lg text-sm font-semibold"
      style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)', color: 'white' }}
    >
      🏆 Get Certificate
    </button>
  </div>
</div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Recent Sessions */}
            <div className="lg:col-span-2">
              <div className="glass-card p-6">
                <h2 className="text-xl font-semibold mb-4">📋 Recent Sessions</h2>
                <div className="space-y-3">
                  {recentSessions.map((session, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-lg"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white"
                          style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)' }}>
                          {session.partner.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-white">{session.partner}</p>
                          <p className="text-gray-400 text-sm">{session.skill} · {session.duration}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-500 text-xs mb-1">{session.date}</p>
                        <p className="text-yellow-400 text-sm">{'⭐'.repeat(session.rating)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {!ratingSubmitted ? (
                  <button onClick={() => setShowRating(true)}
                    className="mt-4 w-full py-3 rounded-lg font-medium transition-all"
                    style={{ border: '1px solid rgba(168,85,247,0.5)', color: '#c084fc' }}>
                    ⭐ Rate Your Last Session
                  </button>
                ) : (
                  <div className="mt-4 p-3 rounded-lg text-center text-sm"
                    style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#86efac' }}>
                    ✅ Rating submitted! Thank you!
                  </div>
                )}
              </div>
            </div>

            {/* Right Side */}
            <div className="space-y-6">

              {/* Profile */}
              <div className="glass-card p-6 text-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)' }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <h3 className="text-xl font-semibold text-white">{user.name}</h3>
                <p className="text-gray-400 text-sm mb-3">{user.email}</p>
                <p className="text-yellow-400 mb-4">⭐⭐⭐⭐⭐</p>
                <button onClick={onStartSession}
                  className="w-full py-2 rounded-lg text-sm font-semibold"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: 'white' }}>
                  📹 Start New Session
                </button>
              </div>

              {/* Achievements */}
              <div className="glass-card p-6">
                <h2 className="text-lg font-semibold mb-4">🏆 Achievements</h2>
                <div className="space-y-3">
                  {achievements.map((ach, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg"
                      style={{
                        background: ach.unlocked ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${ach.unlocked ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.08)'}`,
                        opacity: ach.unlocked ? 1 : 0.5
                      }}>
                      <span className="text-2xl">{ach.icon}</span>
                      <div>
                        <p className="font-medium text-sm" style={{ color: ach.unlocked ? '#86efac' : '#9ca3af' }}>
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
      </div>

      {/* Rating Modal */}
      {showRating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)' }}>
          <div className="w-full max-w-md rounded-2xl p-8"
            style={{ background: 'linear-gradient(135deg, #1e1b4b, #312e81)', border: '1px solid rgba(255,255,255,0.15)' }}>
            <h2 className="text-2xl font-bold text-center text-white mb-2">Rate Your Session</h2>
            <p className="text-gray-400 text-center text-sm mb-6">How was your session with Priya Sharma?</p>
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="text-4xl transition-transform hover:scale-110">
                  {star <= (hoverRating || rating) ? '⭐' : '☆'}
                </button>
              ))}
            </div>
            <textarea value={review} onChange={(e) => setReview(e.target.value)}
              placeholder="Write a review (optional)..." rows={3}
              className="w-full px-4 py-3 rounded-lg text-white text-sm mb-4 resize-none"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} />
            <div className="flex gap-3">
              <button onClick={() => setShowRating(false)}
                className="flex-1 py-3 rounded-lg transition-all"
                style={{ border: '1px solid rgba(255,255,255,0.1)', color: '#d1d5db' }}>
                Cancel
              </button>
              <button onClick={submitRating}
                className="flex-1 py-3 rounded-lg font-semibold"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)', color: 'white' }}>
                Submit ⭐
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Dashboard;