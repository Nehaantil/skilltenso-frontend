 
import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('https://skilltenso.onrender.com');

interface Notification {
  id: number;
  type: 'match' | 'session' | 'rating' | 'achievement';
  message: string;
  time: string;
  read: boolean;
}

interface NotificationsProps {
  userId: number;
}

function Notifications({ userId }: NotificationsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'match',
      message: '🎯 New match found! Priya Sharma wants to learn Web Development',
      time: '2 min ago',
      read: false
    },
    {
      id: 2,
      type: 'rating',
      message: '⭐ Rahul Kumar gave you 5 stars!',
      time: '1 hour ago',
      read: false
    },
    {
      id: 3,
      type: 'achievement',
      message: '🏆 Achievement unlocked: First Session Complete!',
      time: '2 hours ago',
      read: true
    },
    {
      id: 4,
      type: 'session',
      message: '📹 Your session with Anjali Singh has been scheduled',
      time: 'Yesterday',
      read: true
    },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    socket.on('new-notification', (data: any) => {
      const newNotif: Notification = {
        id: Date.now(),
        type: data.type,
        message: data.message,
        time: 'Just now',
        read: false
      };
      setNotifications(prev => [newNotif, ...prev]);
    });

    return () => {
      socket.off('new-notification');
    };
  }, []);

  function markAllRead() {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }

  function markRead(id: number) {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }

  function getIcon(type: string) {
    switch(type) {
      case 'match': return '🎯';
      case 'session': return '📹';
      case 'rating': return '⭐';
      case 'achievement': return '🏆';
      default: return '🔔';
    }
  }

  function getColor(type: string) {
    switch(type) {
      case 'match': return 'rgba(124,58,237,0.3)';
      case 'session': return 'rgba(59,130,246,0.3)';
      case 'rating': return 'rgba(245,158,11,0.3)';
      case 'achievement': return 'rgba(16,185,129,0.3)';
      default: return 'rgba(255,255,255,0.1)';
    }
  }

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl transition-all"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
      >
        <span className="text-xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #ec4899, #ef4444)' }}>
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-80 rounded-xl overflow-hidden z-50"
          style={{ background: 'linear-gradient(135deg, #1e1b4b, #312e81)', border: '1px solid rgba(168,85,247,0.3)', backdropFilter: 'blur(20px)' }}>

          {/* Header */}
          <div className="flex justify-between items-center p-4"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <h3 className="font-semibold text-white">🔔 Notifications</h3>
            <button onClick={markAllRead}
              className="text-xs text-purple-400 hover:text-purple-300 transition-colors">
              Mark all read
            </button>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-center text-gray-500 py-8 text-sm">No notifications yet!</p>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => markRead(notif.id)}
                  className="p-4 cursor-pointer transition-all hover:bg-white/5"
                  style={{
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    background: notif.read ? 'transparent' : 'rgba(124,58,237,0.1)'
                  }}
                >
                  <div className="flex gap-3 items-start">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-lg"
                      style={{ background: getColor(notif.type) }}>
                      {getIcon(notif.type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-200 leading-relaxed">{notif.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                    </div>
                    {!notif.read && (
                      <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                        style={{ background: '#a855f7' }} />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-3 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <button className="text-xs text-purple-400 hover:text-purple-300 transition-colors">
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Notifications;