 
import React, { useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

interface AnalyticsProps {
  onClose: () => void;
}

function Analytics({ onClose }: AnalyticsProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'sessions'>('overview');

  const sessionData = [
    { week: 'Week 1', sessions: 2, hours: 3 },
    { week: 'Week 2', sessions: 4, hours: 6 },
    { week: 'Week 3', sessions: 3, hours: 4.5 },
    { week: 'Week 4', sessions: 6, hours: 9 },
    { week: 'Week 5', sessions: 5, hours: 7.5 },
    { week: 'Week 6', sessions: 8, hours: 12 },
  ];

  const skillsData = [
    { skill: 'Web Dev', learners: 245, color: '#7c3aed' },
    { skill: 'Design', learners: 189, color: '#ec4899' },
    { skill: 'Marketing', learners: 156, color: '#f59e0b' },
    { skill: 'Photography', learners: 132, color: '#06b6d4' },
    { skill: 'Music', learners: 98, color: '#10b981' },
  ];

  const ratingData = [
    { name: '5 Stars', value: 65, color: '#10b981' },
    { name: '4 Stars', value: 25, color: '#7c3aed' },
    { name: '3 Stars', value: 8, color: '#f59e0b' },
    { name: '1-2 Stars', value: 2, color: '#ef4444' },
  ];

  const stats = [
    { label: 'Total Sessions', value: '28', change: '+12%', up: true },
    { label: 'Hours Learned', value: '42h', change: '+8%', up: true },
    { label: 'Skills Taught', value: '6', change: '+2', up: true },
    { label: 'Avg Rating', value: '4.8⭐', change: '+0.2', up: true },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 rounded-lg" style={{ background: 'rgba(30,27,75,0.95)', border: '1px solid rgba(168,85,247,0.3)' }}>
          <p className="text-purple-300 text-xs mb-1">{label}</p>
          {payload.map((entry: any, i: number) => (
            <p key={i} className="text-white text-sm font-semibold">{entry.name}: {entry.value}</p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto"
      style={{ background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(10px)' }}>

      <div className="max-w-5xl mx-auto p-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">📊 Analytics Dashboard</h2>
            <p className="text-gray-400 text-sm mt-1">Your learning journey insights</p>
          </div>
          <button onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}>
            ✕ Close
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, i) => (
            <div key={i} className="p-4 rounded-xl text-center"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-gray-400 text-xs mb-2">{stat.label}</div>
              <div className="text-xs font-semibold" style={{ color: stat.up ? '#86efac' : '#fca5a5' }}>
                {stat.up ? '↑' : '↓'} {stat.change}
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(['overview', 'skills', 'sessions'] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className="px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all"
              style={{
                background: activeTab === tab ? 'rgba(124,58,237,0.5)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${activeTab === tab ? 'rgba(168,85,247,0.5)' : 'rgba(255,255,255,0.1)'}`,
                color: 'white'
              }}>
              {tab}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Sessions Line Chart */}
            <div className="p-6 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <h3 className="text-white font-semibold mb-4">📈 Sessions Over Time</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={sessionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="week" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="sessions" stroke="#a855f7" strokeWidth={2} dot={{ fill: '#a855f7' }} name="Sessions" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Rating Pie Chart */}
            <div className="p-6 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <h3 className="text-white font-semibold mb-4">⭐ Rating Distribution</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={ratingData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                    {ratingData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend formatter={(value) => <span style={{ color: '#9ca3af', fontSize: 12 }}>{value}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Skills Tab */}
        {activeTab === 'skills' && (
          <div className="p-6 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h3 className="text-white font-semibold mb-4">💡 Top Skills by Learners</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={skillsData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                <YAxis dataKey="skill" type="category" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="learners" name="Learners" radius={[0, 4, 4, 0]}>
                  {skillsData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Sessions Tab */}
        {activeTab === 'sessions' && (
          <div className="p-6 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h3 className="text-white font-semibold mb-4">⏱ Hours Spent Learning</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sessionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="week" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="hours" name="Hours" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                <Bar dataKey="sessions" name="Sessions" fill="#ec4899" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}

export default Analytics;