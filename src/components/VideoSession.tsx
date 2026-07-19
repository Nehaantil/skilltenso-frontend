/* eslint-disable */
import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import Whiteboard from './Whiteboard';

interface User {
  id: number;
  name: string;
  email: string;
}

interface VideoSessionProps {
  user: User;
  onExit: () => void;
}

interface Message {
  text: string;
  from: string;
  time: string;
}

interface Note {
  id: number;
  text: string;
  createdAt: string;
}

const socket = io('https://skilltenso.onrender.com');

function VideoSession({ user, onExit }: VideoSessionProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [showWhiteboard, setShowWhiteboard] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [activeTab, setActiveTab] = useState<'chat' | 'notes'>('chat');

  const myVideoRef = useRef<HTMLVideoElement>(null);
  const partnerVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        streamRef.current = stream;
        if (myVideoRef.current) {
          myVideoRef.current.srcObject = stream;
        }
      })
      .catch((err) => console.error('Camera error:', err));

    socket.emit('user-online', user.id);

    socket.on('receive-message', (data) => {
      setMessages(prev => [...prev, {
        text: data.message,
        from: data.fromName,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    });

    socket.on('receive-note', (data) => {
      setNotes(prev => [...prev, {
        id: Date.now(),
        text: data.note,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    });

    return () => {
      streamRef.current?.getTracks().forEach(track => track.stop());
      clearInterval(timerRef.current);
      socket.off('receive-message');
      socket.off('receive-note');
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages(prev => [...prev, { text: newMessage, from: 'You', time }]);
      socket.emit('send-message', {
        message: newMessage,
        fromName: user.name,
        from: user.id
      });
      setNewMessage('');
    }
  }

  function addNote() {
    if (newNote.trim()) {
      const note = {
        id: Date.now(),
        text: newNote,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setNotes(prev => [...prev, note]);
      socket.emit('send-note', { note: newNote, fromName: user.name });
      setNewNote('');
    }
  }

  return (
    <>
      {showWhiteboard && (
        <Whiteboard
          onClose={() => setShowWhiteboard(false)}
          user={user}
        />
      )}

      <div className="min-h-screen text-white p-4" style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 30%, #4c1d95 60%, #1e1b4b 100%)' }}>

        {/* Header */}
        <div className="rounded-xl p-4 mb-4" style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h2 className="text-xl font-semibold">📹 Live Session</h2>
              <div className="flex gap-2 mt-2 flex-wrap">
                <span className="px-3 py-1 rounded-full text-xs" style={{ background: 'rgba(34,197,94,0.2)', border: '1px solid rgba(34,197,94,0.3)', color: '#86efac' }}>
                  Teaching: Web Development
                </span>
                <span className="px-3 py-1 rounded-full text-xs" style={{ background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(59,130,246,0.3)', color: '#93c5fd' }}>
                  Learning: UI/UX Design
                </span>
                {isConnected && (
                  <span className="font-mono text-xs px-3 py-1 rounded-full" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#86efac' }}>
                    ⏱ {formatTime(sessionTime)}
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              {!isConnected ? (
                <button onClick={startSession} className="px-4 py-2 rounded-lg font-semibold text-sm" style={{ background: 'rgba(34,197,94,0.3)', border: '1px solid rgba(34,197,94,0.5)', color: '#86efac' }}>
                  ▶️ Start
                </button>
              ) : (
                <button onClick={onExit} className="px-4 py-2 rounded-lg font-semibold text-sm" style={{ background: 'rgba(239,68,68,0.3)', border: '1px solid rgba(239,68,68,0.5)', color: '#fca5a5' }}>
                  ⏹ End
                </button>
              )}
              <button onClick={onExit} className="px-4 py-2 rounded-lg text-sm" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#d1d5db' }}>
                ❌ Exit
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Left — Videos + Controls */}
          <div className="lg:col-span-2 space-y-4">

            {/* Video Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Partner */}
              <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="p-3 flex justify-between items-center" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <h3 className="font-semibold text-sm">👤 Partner</h3>
                  {isConnected && <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>}
                </div>
                <div className="aspect-video bg-slate-900 flex items-center justify-center relative">
                  <video ref={partnerVideoRef} autoPlay className="w-full h-full object-cover" />
                  {!isConnected && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-3"
                        style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)' }}>👤</div>
                      <p className="text-gray-400 text-sm">Waiting...</p>
                    </div>
                  )}
                </div>
              </div>

              {/* My Video */}
              <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="p-3 flex justify-between items-center" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <h3 className="font-semibold text-sm">👤 {user.name}</h3>
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                </div>
                <div className="aspect-video bg-slate-900 relative">
                  <video ref={myVideoRef} autoPlay muted className={`w-full h-full object-cover ${isVideoOff ? 'opacity-0' : ''}`} />
                  {isVideoOff && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-4xl">📹❌</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="flex justify-center gap-3 flex-wrap">
                <button onClick={toggleMute}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  style={{ background: isMuted ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.05)', border: `1px solid ${isMuted ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.1)'}`, color: 'white' }}>
                  {isMuted ? '🔇 Unmute' : '🎤 Mute'}
                </button>
                <button onClick={toggleVideo}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  style={{ background: isVideoOff ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.05)', border: `1px solid ${isVideoOff ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.1)'}`, color: 'white' }}>
                  {isVideoOff ? '📹 On' : '📹 Off'}
                </button>
                <button onClick={() => { setShowChat(true); setActiveTab('chat'); }}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}>
                  💬 Chat
                </button>
                <button onClick={() => { setShowChat(true); setActiveTab('notes'); }}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}>
                  📝 Notes
                </button>
                <button onClick={() => setShowWhiteboard(true)}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  style={{ background: 'rgba(168,85,247,0.2)', border: '1px solid rgba(168,85,247,0.4)', color: '#c084fc' }}>
                  🎨 Whiteboard
                </button>
              </div>
            </div>
          </div>

          {/* Right — Chat + Notes */}
          {showChat && (
            <div className="rounded-xl flex flex-col" style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', height: '500px' }}>

              {/* Tabs */}
              <div className="grid grid-cols-2 p-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <button onClick={() => setActiveTab('chat')}
                  className="py-2 rounded-lg text-sm font-medium transition-all"
                  style={{ background: activeTab === 'chat' ? 'rgba(124,58,237,0.5)' : 'transparent', color: 'white' }}>
                  💬 Chat
                </button>
                <button onClick={() => setActiveTab('notes')}
                  className="py-2 rounded-lg text-sm font-medium transition-all"
                  style={{ background: activeTab === 'notes' ? 'rgba(124,58,237,0.5)' : 'transparent', color: 'white' }}>
                  📝 Notes
                </button>
              </div>

              {/* Chat */}
              {activeTab === 'chat' && (
                <>
                  <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    {messages.length === 0 ? (
                      <p className="text-gray-500 text-sm text-center mt-8">No messages yet...</p>
                    ) : (
                      messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.from === 'You' ? 'justify-end' : 'justify-start'}`}>
                          <div className="px-3 py-2 rounded-lg text-sm max-w-xs"
                            style={{ background: msg.from === 'You' ? 'rgba(124,58,237,0.5)' : 'rgba(255,255,255,0.1)' }}>
                            <span className="text-xs text-gray-400 block mb-1">{msg.from} · {msg.time}</span>
                            {msg.text}
                          </div>
                        </div>
                      ))
                    )}
                    <div ref={chatEndRef} />
                  </div>
                  <div className="p-3 flex gap-2" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <input type="text" value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Type message..."
                      className="flex-1 px-3 py-2 rounded-lg text-white text-sm"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} />
                    <button onClick={sendMessage} className="px-3 py-2 rounded-lg text-sm"
                      style={{ background: 'rgba(124,58,237,0.5)', color: 'white' }}>
                      Send
                    </button>
                  </div>
                </>
              )}

              {/* Notes */}
              {activeTab === 'notes' && (
                <>
                  <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    {notes.length === 0 ? (
                      <p className="text-gray-500 text-sm text-center mt-8">No notes yet...</p>
                    ) : (
                      notes.map((note) => (
                        <div key={note.id} className="p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                          <p className="text-xs text-gray-400 mb-1">📝 {note.createdAt}</p>
                          <p className="text-sm text-white">{note.text}</p>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-3 flex gap-2" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <input type="text" value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addNote()}
                      placeholder="Add a note..."
                      className="flex-1 px-3 py-2 rounded-lg text-white text-sm"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} />
                    <button onClick={addNote} className="px-3 py-2 rounded-lg text-sm"
                      style={{ background: 'rgba(124,58,237,0.5)', color: 'white' }}>
                      Add
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default VideoSession;