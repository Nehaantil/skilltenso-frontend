 
import React, { useState, useEffect } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

interface Stats {
  totalUsers: number;
  totalSessions: number;
  activeSessions: number;
  totalSkills: number;
}

interface AdminPanelProps {
  onClose: () => void;
}

function AdminPanel({ onClose }: AdminPanelProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'users'>('overview');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const [usersRes, statsRes] = await Promise.all([
        fetch('https://skilltenso.onrender.com/api/admin/users'),
        fetch('https://skilltenso.onrender.com/api/admin/stats')
      ]);
      const usersData = await usersRes.json();
      const statsData = await statsRes.json();
      setUsers(usersData.users || []);
      setStats(statsData.stats || null);
    } catch (error) {
      console.error('Admin error:', error);
    }
    setLoading(false);
  }

  async function handleDelete(id: number) {
    try {
      await fetch(`https://skilltenso.onrender.com/api/admin/users/${id}`, {
        method: 'DELETE'
      });
      setUsers(prev => prev.filter(u => u.id !== id));
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Delete error:', error);
    }
  }

  const adminStats = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: '👥', color: '#7c3aed' },
    { label: 'Total Sessions', value: stats?.totalSessions || 0, icon: '📹', color: '#ec4899' },
    { label: 'Active Sessions', value: stats?.activeSessions || 0, icon: '🟢', color: '#10b981' },
    { label: 'Total Skills', value: stats?.totalSkills || 0, icon: '💡', color: '#f59e0b' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto"
      style={{ background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(10px)' }}>

      <div className="max-w-5xl mx-auto p-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">👑 Admin Panel</h2>
            <p className="text-gray-400 text-sm mt-1">Manage users and platform settings</p>
          </div>
          <button onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}>
            ✕ Close
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {adminStats.map((stat, i) => (
            <div key={i} className="p-4 rounded-xl text-center"
              style={{ background: `${stat.color}15`, border: `1px solid ${stat.color}30` }}>
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-gray-400 text-xs">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(['overview', 'users'] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className="px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all"
              style={{
                background: activeTab === tab ? 'rgba(124,58,237,0.5)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${activeTab === tab ? 'rgba(168,85,247,0.5)' : 'rgba(255,255,255,0.1)'}`,
                color: 'white'
              }}>
              {tab === 'overview' ? '📊 Overview' : '👥 Users'}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <h3 className="text-white font-semibold mb-4">🌟 Platform Overview</h3>
              <div className="space-y-3">
                {[
                  { label: 'Platform Status', value: '🟢 Online', color: '#86efac' },
                  { label: 'Server', value: 'Render.com', color: '#93c5fd' },
                  { label: 'Database', value: 'Neon PostgreSQL', color: '#c4b5fd' },
                  { label: 'Frontend', value: 'Vercel', color: '#fca5a5' },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center p-3 rounded-lg"
                    style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <span className="text-gray-400 text-sm">{item.label}</span>
                    <span className="text-sm font-medium" style={{ color: item.color }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <h3 className="text-white font-semibold mb-4">📈 Quick Stats</h3>
              <div className="space-y-3">
                {[
                  { label: 'New users today', value: '3' },
                  { label: 'Sessions today', value: '12' },
                  { label: 'Average session', value: '45 min' },
                  { label: 'Platform rating', value: '4.8 ⭐' },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center p-3 rounded-lg"
                    style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <span className="text-gray-400 text-sm">{item.label}</span>
                    <span className="text-white text-sm font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="p-4 flex justify-between items-center" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <h3 className="text-white font-semibold">👥 All Users ({users.length})</h3>
              <button onClick={fetchData} className="text-xs text-purple-400 hover:text-purple-300">
                🔄 Refresh
              </button>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-3">⏳</div>
                <p className="text-gray-400">Loading users...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400">No users found!</p>
              </div>
            ) : (
              <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 hover:bg-white/5 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white"
                        style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)' }}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-white font-medium">{user.name}</p>
                        <p className="text-gray-400 text-sm">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-gray-500 text-xs">
                        {new Date(user.created_at).toLocaleDateString()}
                      </p>
                      {deleteConfirm === user.id ? (
                        <div className="flex gap-2">
                          <button onClick={() => handleDelete(user.id)}
                            className="px-3 py-1 rounded-lg text-xs font-medium"
                            style={{ background: 'rgba(239,68,68,0.3)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.5)' }}>
                            Confirm
                          </button>
                          <button onClick={() => setDeleteConfirm(null)}
                            className="px-3 py-1 rounded-lg text-xs font-medium"
                            style={{ background: 'rgba(255,255,255,0.05)', color: '#d1d5db', border: '1px solid rgba(255,255,255,0.1)' }}>
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => setDeleteConfirm(user.id)}
                          className="px-3 py-1 rounded-lg text-xs font-medium transition-all"
                          style={{ background: 'rgba(239,68,68,0.1)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.2)' }}>
                          🗑️ Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;