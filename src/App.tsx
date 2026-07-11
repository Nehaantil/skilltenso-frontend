import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import SkillsSection from './components/SkillsSection';
import CTASection from './components/CTASection';
import AuthModal from './components/AuthModal';
import VideoSession from './components/VideoSession';
import Dashboard from './components/Dashboard';

interface User {
  id: number;
  name: string;
  email: string;
}

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'signin' | 'signup'>('signup');
  const [user, setUser] = useState<User | null>(null);
  const [showVideo, setShowVideo] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  function openModal(mode: 'signin' | 'signup') {
    setModalMode(mode);
    setIsModalOpen(true);
  }

  function handleSuccess(userData: User, userToken: string) {
    setUser(userData);
    setShowDashboard(true);
    localStorage.setItem('token', userToken);
    localStorage.setItem('user', JSON.stringify(userData));
  }

  function handleLogout() {
    setUser(null);
    setShowVideo(false);
    setShowDashboard(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  if (showVideo && user) {
    return <VideoSession user={user} onExit={() => setShowVideo(false)} />;
  }

  if (showDashboard && user) {
    return (
      <Dashboard
        user={user}
        onStartSession={() => setShowVideo(true)}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-purple-700 to-slate-800 text-white">
      <Navbar
        user={user}
        onOpenModal={openModal}
        onLogout={handleLogout}
        onStartSession={() => setShowVideo(true)}
      />
      <HeroSection onOpenModal={openModal} />
      <FeaturesSection />
      <SkillsSection />
      <CTASection onOpenModal={openModal} />
      <AuthModal
        isOpen={isModalOpen}
        mode={modalMode}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
}

export default App;