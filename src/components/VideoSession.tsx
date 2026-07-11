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

const socket = io('http://localhost:5001');

function VideoSession({ user, onExit }: VideoSessionProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [activeTab, setActiveTab] = useState<'chat' | 'notes'>('chat');

  const myVideoRef = useRef<HTMLVideoElement>(null);
  const partnerVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

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

  // Auto scroll chat
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
      setMessages(prev => [...prev, {
        text: newMessage,
        from: 'You',
        time
      }]);
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
      socket.emit('send-note', {
        note: newNote,
        fromName: user.name
      });
      setNewNote('');
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4">

      {/* Header */}
      <div className="bg-slate-800/60 border border-slate-600/30 rounded-xl p-4 mb-4">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h2 className="text-xl font-semibold">📹 Live Session</h2>
            <div className="flex gap-2 mt-2 flex-wrap">
              <span className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 text-xs">
                Teaching: Web Development
              </span>
              <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-400 text-xs">
                Learning: UI/UX Design
              </span>
              {isConnected && (
                <span className="font-mono text-green-400 text-xs bg-green-500/10 px-3 py-1 rounded-full border border-green-500/30">
                  ⏱ {formatTime(sessionTime)}
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            {!isConnected ? (
              <button onClick={startSession} className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-500 transition-all font-semibold text-sm">
                ▶️ Start
              </button>
            ) : (
              <button onClick={onExit} className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-500 transition-all font-semibold text-sm">
                ⏹ End
              </button>
            )}
            <button onClick={onExit} className="px-4 py-2 border border-slate-600 rounded-lg hover:border-red-400 hover:text-red-400 transition-all text-sm">
              ❌ Exit
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Left — Videos */}
        <div className="lg:col-span-2 space-y-4">

          {/* Video Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Partner */}
            <div className="bg-slate-800/60 border border-slate-600/30 rounded-xl overflow-hidden">
              <div className="p-3 border-b border-slate-600/30 flex justify-between items-center">
                <h3 className="font-semibold text-sm">👤 Partner</h3>
                {isConnected && <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>}
              </div>
              <div className="aspect-video bg-slate-700 flex items-center justify-center relative">
                <video ref={partnerVideoRef} autoPlay className="w-full h-full object-cover" />
                {!isConnected && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-2xl mb-3">👤</div>
                    <p className="text-gray-400 text-sm">Waiting...</p>
                  </div>
                )}
              </div>
            </div>

            {/* My Video */}
            <div className="bg-slate-800/60 border border-slate-600/30 rounded-xl overflow-hidden">
              <div className="p-3 border-b border-slate-600/30 flex justify-between items-center">
                <h3 className="font-semibold text-sm">👤 {user.name}</h3>
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              </div>
              <div className="aspect-video bg-slate-700 relative">
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
          <div className="bg-slate-800/60 border border-slate-600/30 rounded-xl p-4">
            <div className="flex justify-center gap-3 flex-wrap">
              <button onClick={toggleMute} className={`px-5 py-2 rounded-lg transition-all font-medium text-sm ${isMuted ? 'bg-red-600 hover:bg-red-500' : 'border border-slate-600 hover:border-purple-400'}`}>
                {isMuted ? '🔇 Unmute' : '🎤 Mute'}
              </button>
              <button onClick={toggleVideo} className={`px-5 py-2 rounded-lg transition-all font-medium text-sm ${isVideoOff ? 'bg-red-600 hover:bg-red-500' : 'border border-slate-600 hover:border-purple-400'}`}>
                {isVideoOff ? '📹 On' : '📹 Off'}
              </button>
              <button onClick={() => { setShowChat(true); setActiveTab('chat'); }} className="px-5 py-2 border border-slate-600 rounded-lg hover:border-purple-400 transition-all font-medium text-sm">
                💬 Chat
              </button>
              <button onClick={() => { setShowChat(true); setActiveTab('notes'); }} className="px-5 py-2 border border-slate-600 rounded-lg hover:border-purple-400 transition-all font-medium text-sm">
                📝 Notes
              </button>
            </div>
          </div>
        </div>

        {/* Right — Chat + Notes */}
        {showChat && (
          <div className="bg-slate-800/60 border border-slate-600/30 rounded-xl flex flex-col h-96 lg:h-auto">

            {/* Tabs */}
            <div className="grid grid-cols-2 p-2 border-b border-slate-600/30">
              <button onClick={() => setActiveTab('chat')} className={`py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'chat' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}>
                💬 Chat
              </button>
              <button onClick={() => setActiveTab('notes')} className={`py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'notes' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}>
                📝 Notes
              </button>
            </div>

            {/* Chat Tab */}
            {activeTab === 'chat' && (
              <>
                <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0">
                  {messages.length === 0 ? (
                    <p className="text-gray-400 text-sm text-center mt-8">No messages yet...</p>
                  ) : (
                    messages.map((msg, i) => (
                      <div key={i} className={`flex ${msg.from === 'You' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`px-3 py-2 rounded-lg text-sm max-w-xs ${msg.from === 'You' ? 'bg-purple-600' : 'bg-slate-700'}`}>
                          <span className="text-xs text-gray-300 block mb-1">{msg.from} · {msg.time}</span>
                          {msg.text}
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={chatEndRef} />
                </div>
                <div className="p-3 border-t border-slate-600/30 flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type message..."
                    className="flex-1 px-3 py-2 bg-slate-900/80 border border-slate-600/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 text-sm"
                  />
                  <button onClick={sendMessage} className="px-3 py-2 bg-purple-600 rounded-lg hover:bg-purple-500 transition-all text-sm">
                    Send
                  </button>
                </div>
              </>
            )}

            {/* Notes Tab */}
            {activeTab === 'notes' && (
              <>
                <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0">
                  {notes.length === 0 ? (
                    <p className="text-gray-400 text-sm text-center mt-8">No notes yet...</p>
                  ) : (
                    notes.map((note) => (
                      <div key={note.id} className="bg-slate-700/50 border border-slate-600/30 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1">📝 {note.createdAt}</p>
                        <p className="text-sm">{note.text}</p>
                      </div>
                    ))
                  )}
                </div>
                <div className="p-3 border-t border-slate-600/30 flex gap-2">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addNote()}
                    placeholder="Add a note..."
                    className="flex-1 px-3 py-2 bg-slate-900/80 border border-slate-600/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 text-sm"
                  />
                  <button onClick={addNote} className="px-3 py-2 bg-purple-600 rounded-lg hover:bg-purple-500 transition-all text-sm">
                    Add
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default VideoSession;