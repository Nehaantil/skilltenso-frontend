 
import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

interface User {
  id: number;
  name: string;
  email: string;
}

interface VideoSessionProps {
  user: User;
  onExit: () => void;
}

const socket = io('http://localhost:5001');

function VideoSession({ user, onExit }: VideoSessionProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [messages, setMessages] = useState<{text: string, from: string}[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showChat, setShowChat] = useState(false);

  const myVideoRef = useRef<HTMLVideoElement>(null);
  const partnerVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    // Camera start karo
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        streamRef.current = stream;
        if (myVideoRef.current) {
          myVideoRef.current.srcObject = stream;
        }
      })
      .catch((err) => console.error('Camera error:', err));

    // Socket events
    socket.emit('user-online', user.id);

    socket.on('receive-message', (data) => {
      setMessages(prev => [...prev, { text: data.message, from: data.fromName }]);
    });

    return () => {
      streamRef.current?.getTracks().forEach(track => track.stop());
      clearInterval(timerRef.current);
      socket.off('receive-message');
    };
  }, []);

  function startSession() {
    setIsConnected(true);
    timerRef.current = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);
  }

  function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  function toggleMute() {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  }

  function toggleVideo() {
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  }

  function sendMessage() {
    if (newMessage.trim()) {
      setMessages(prev => [...prev, { text: newMessage, from: 'You' }]);
      setNewMessage('');
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6">
      
      {/* Header */}
      <div className="bg-slate-800/60 border border-slate-600/30 rounded-xl p-4 mb-6">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h2 className="text-xl font-semibold">📹 Live Session</h2>
            <div className="flex gap-3 mt-2 flex-wrap">
              <span className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 text-xs">
                Teaching: Web Development
              </span>
              <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-400 text-xs">
                Learning: UI/UX Design
              </span>
              {isConnected && (
                <span className="font-mono text-green-400 text-sm bg-green-500/10 px-3 py-1 rounded-full border border-green-500/30">
                  ⏱ {formatTime(sessionTime)}
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-3">
            {!isConnected ? (
              <button
                onClick={startSession}
                className="px-6 py-2 bg-green-600 rounded-lg hover:bg-green-500 transition-all font-semibold"
              >
                ▶️ Start Session
              </button>
            ) : (
              <button
                onClick={onExit}
                className="px-6 py-2 bg-red-600 rounded-lg hover:bg-red-500 transition-all font-semibold"
              >
                ⏹ End Session
              </button>
            )}
            <button
              onClick={onExit}
              className="px-4 py-2 border border-slate-600 rounded-lg hover:border-red-400 hover:text-red-400 transition-all"
            >
              ❌ Exit
            </button>
          </div>
        </div>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Partner Video */}
        <div className="bg-slate-800/60 border border-slate-600/30 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-600/30 flex justify-between items-center">
            <h3 className="font-semibold">👤 Partner</h3>
            {isConnected && <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>}
          </div>
          <div className="aspect-video bg-slate-700 flex items-center justify-center relative">
            <video
              ref={partnerVideoRef}
              autoPlay
              className="w-full h-full object-cover"
            />
            {!isConnected && (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-3xl mb-4">
                  👤
                </div>
                <p className="text-gray-400">Waiting to connect...</p>
              </div>
            )}
          </div>
        </div>

        {/* My Video */}
        <div className="bg-slate-800/60 border border-slate-600/30 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-600/30 flex justify-between items-center">
            <h3 className="font-semibold">👤 You ({user.name})</h3>
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          </div>
          <div className="aspect-video bg-slate-700 relative">
            <video
              ref={myVideoRef}
              autoPlay
              muted
              className={`w-full h-full object-cover ${isVideoOff ? 'opacity-0' : ''}`}
            />
            {isVideoOff && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-4xl">📹❌</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-slate-800/60 border border-slate-600/30 rounded-xl p-4 mb-6">
        <div className="flex justify-center gap-4 flex-wrap">
          <button
            onClick={toggleMute}
            className={`px-6 py-2 rounded-lg transition-all font-medium ${
              isMuted
                ? 'bg-red-600 hover:bg-red-500'
                : 'border border-slate-600 hover:border-purple-400'
            }`}
          >
            {isMuted ? '🔇 Unmute' : '🎤 Mute'}
          </button>
          <button
            onClick={toggleVideo}
            className={`px-6 py-2 rounded-lg transition-all font-medium ${
              isVideoOff
                ? 'bg-red-600 hover:bg-red-500'
                : 'border border-slate-600 hover:border-purple-400'
            }`}
          >
            {isVideoOff ? '📹 Turn On' : '📹 Turn Off'}
          </button>
          <button
            onClick={() => setShowChat(!showChat)}
            className="px-6 py-2 border border-slate-600 rounded-lg hover:border-purple-400 transition-all font-medium"
          >
            💬 {showChat ? 'Hide Chat' : 'Show Chat'}
          </button>
        </div>
      </div>

      {/* Chat */}
      {showChat && (
        <div className="bg-slate-800/60 border border-slate-600/30 rounded-xl p-4">
          <h3 className="font-semibold mb-4">💬 Chat</h3>
          <div className="h-48 overflow-y-auto mb-4 space-y-2">
            {messages.length === 0 ? (
              <p className="text-gray-400 text-sm">No messages yet...</p>
            ) : (
              messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.from === 'You' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`px-3 py-2 rounded-lg text-sm max-w-xs ${
                    msg.from === 'You'
                      ? 'bg-purple-600'
                      : 'bg-slate-700'
                  }`}>
                    <span className="text-xs text-gray-400 block">{msg.from}</span>
                    {msg.text}
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 bg-slate-900/80 border border-slate-600/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
            />
            <button
              onClick={sendMessage}
              className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-500 transition-all"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoSession;