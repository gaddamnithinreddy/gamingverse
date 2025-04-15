import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Users, Hash, AtSign, Bell, Settings, Plus, Send, Volume2, Moon, Sun, LogOut, User, Loader } from 'lucide-react';
import AuthModal from './auth/AuthModal';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UsersModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomCode: string;
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationsModal: React.FC<NotificationsModalProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New Message",
      message: "You have a new message in Room XYZ",
      time: "2 minutes ago",
      read: false
    },
    {
      id: 2,
      title: "Room Invitation",
      message: "You've been invited to join Room ABC",
      time: "1 hour ago",
      read: true
    }
  ]);

  if (!isOpen) return null;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Notifications</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <Bell size={24} />
          </button>
        </div>
        <div className="space-y-4">
          {notifications.length > 0 ? (
            <>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-400">
                  {notifications.filter(n => !n.read).length} unread notifications
                </span>
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-purple-400 hover:text-purple-300"
                >
                  Mark all as read
                </button>
              </div>
              {notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg transition-all duration-300 ${
                    notification.read ? 'bg-gray-700/50' : 'bg-gray-700'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className={`font-semibold ${notification.read ? 'text-gray-300' : 'text-white'}`}>
                      {notification.title}
                    </h3>
                    <span className="text-xs text-gray-400">{notification.time}</span>
                  </div>
                  <p className="text-sm text-gray-400">{notification.message}</p>
                </div>
              ))}
            </>
          ) : (
            <div className="text-center py-8">
              <Bell size={48} className="mx-auto mb-4 text-gray-500" />
              <p className="text-gray-400">No new notifications</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const UsersModal: React.FC<UsersModalProps> = ({ isOpen, onClose, roomCode }) => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && roomCode) {
      loadUsers();
      const subscription = subscribeToUserChanges();
      return () => {
        subscription?.unsubscribe();
      };
    }
  }, [isOpen, roomCode]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const { data } = await supabase
        .from('messages')
        .select('user_id, username')
        .eq('room_code', roomCode)
        .order('created_at', { ascending: true });

      if (data) {
        const uniqueUsers = Array.from(new Map(
          data.map(item => [item.user_id, item])
        ).values());
        setUsers(uniqueUsers);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToUserChanges = () => {
    return supabase
      .channel('room_users')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'messages',
        filter: `room_code=eq.${roomCode}`,
      }, () => {
        loadUsers();
      })
      .subscribe();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Room Users</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <Users size={24} />
          </button>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader className="animate-spin text-purple-500" size={32} />
          </div>
        ) : (
          <div className="space-y-2">
            {users.map((user) => (
              <div
                key={user.user_id}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition-all duration-300"
              >
                <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <span className="font-medium">{user.username}</span>
                  <span className="text-xs text-gray-400 block">Online</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [fontSize, setFontSize] = useState('medium');
  const [language, setLanguage] = useState('english');
  const [status, setStatus] = useState('online');

  const handleSettingChange = (setting: string, value: any) => {
    const animations: { [key: string]: string } = {
      notifications: 'animate-bounce',
      sound: 'animate-pulse',
      darkMode: 'animate-spin',
    };

    const element = document.getElementById(`setting-${setting}`);
    if (element) {
      element.classList.add(animations[setting]);
      setTimeout(() => {
        element.classList.remove(animations[setting]);
      }, 500);
    }

    switch (setting) {
      case 'notifications':
        setNotifications(value);
        break;
      case 'sound':
        setSoundEnabled(value);
        break;
      case 'darkMode':
        setDarkMode(value);
        break;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Chat Settings</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <Settings size={24} />
          </button>
        </div>
        <div className="space-y-6">
          <div id="setting-notifications" className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <Bell size={20} className="text-purple-400" />
              <div>
                <span className="block">Notifications</span>
                <span className="text-sm text-gray-400">Get notified about new messages</span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={notifications}
                onChange={() => handleSettingChange('notifications', !notifications)}
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          <div id="setting-sound" className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <Volume2 size={20} className="text-purple-400" />
              <div>
                <span className="block">Sound Effects</span>
                <span className="text-sm text-gray-400">Play sounds for notifications</span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={soundEnabled}
                onChange={() => handleSettingChange('sound', !soundEnabled)}
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          <div id="setting-darkMode" className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              {darkMode ? <Moon size={20} className="text-purple-400" /> : <Sun size={20} className="text-purple-400" />}
              <div>
                <span className="block">Dark Mode</span>
                <span className="text-sm text-gray-400">Toggle dark/light theme</span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={darkMode}
                onChange={() => handleSettingChange('darkMode', !darkMode)}
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          <div className="p-4 bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3 mb-4">
              <User size={20} className="text-purple-400" />
              <span>Status</span>
            </div>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-gray-600 text-white rounded-lg px-4 py-2"
            >
              <option value="online">Online</option>
              <option value="away">Away</option>
              <option value="busy">Busy</option>
              <option value="offline">Offline</option>
            </select>
          </div>

          <div className="p-4 bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3 mb-4">
              <Settings size={20} className="text-purple-400" />
              <span>Font Size</span>
            </div>
            <select
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
              className="w-full bg-gray-600 text-white rounded-lg px-4 py-2"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>

          <div className="p-4 bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3 mb-4">
              <MessageSquare size={20} className="text-purple-400" />
              <span>Language</span>
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full bg-gray-600 text-white rounded-lg px-4 py-2"
            >
              <option value="english">English</option>
              <option value="spanish">Spanish</option>
              <option value="french">French</option>
              <option value="german">German</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

const AnimatedBackground: React.FC = () => (
  <div className="fixed inset-0 -z-10">
    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-black/20" />
    {Array.from({ length: 50 }).map((_, i) => (
      <div
        key={i}
        className="star"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 5}s`,
        }}
      />
    ))}
  </div>
);

const ComingSoon: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [userName, setUserName] = useState('');
  const [showNameInput, setShowNameInput] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (roomCode) {
      loadMessages();
      const subscription = subscribeToMessages();
      return () => {
        subscription?.unsubscribe();
      };
    }
  }, [roomCode]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async () => {
    if (!roomCode) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('room_code', roomCode)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading messages:', error);
        alert('Failed to load messages. Please try again.');
        return;
      }

      if (data) {
        setMessages(data);
        scrollToBottom();
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      alert('Failed to load messages. Please try again.');
    }
  };

  const subscribeToMessages = () => {
    if (!roomCode) return;

    const channel = supabase.channel(`room:${roomCode}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `room_code=eq.${roomCode}`,
        },
        (payload) => {
          if (payload.new.username !== userName) {
            setMessages(current => [...current, payload.new]);
            playMessageSound();
          }
        }
      )
      .subscribe();

    return channel;
  };

  const playMessageSound = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3');
    audio.play().catch(console.error);
  };

  const createRoom = () => {
    if (!userName) {
      alert('Please enter your name first!');
      return;
    }
    const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomCode(newCode);
    setMessages([]);
    setShowNameInput(false);
    alert(`Your room code is: ${newCode}\nShare this code with others to chat!`);
  };

  const joinRoom = () => {
    if (!userName) {
      alert('Please enter your name first!');
      return;
    }
    if (joinCode) {
      setRoomCode(joinCode.toUpperCase());
      setJoinCode('');
      setMessages([]);
      setShowNameInput(false);
    }
  };

  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
      }, 2000);
    }
  };

  const sendMessage = async () => {
    if (!userName || !newMessage.trim() || !roomCode) return;

    try {
      setIsSending(true);
      const messageData = {
        content: newMessage.trim(),
        username: userName,
        room_code: roomCode,
        created_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('messages')
        .insert([messageData]);

      if (error) {
        console.error('Error sending message:', error);
        alert('Failed to send message. Please try again.');
        return;
      }

      setMessages(prev => [...prev, messageData]);
      setNewMessage('');
      scrollToBottom();
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
      setIsTyping(false);
    }
  };

  const formatMessageTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen pt-24">
      <AnimatedBackground />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-[calc(100vh-6rem)]">
          {/* Sidebar */}
          <div className="w-64 bg-gray-800 rounded-l-xl">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Chat Rooms</h2>
                <button 
                  onClick={createRoom}
                  className="text-gray-400 hover:text-white transition-colors animate-pulse hover:animate-none"
                >
                  <Plus size={20} />
                </button>
              </div>
              <div className="space-y-2">
                {showNameInput && (
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                    required
                  />
                )}
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  placeholder="Enter room code"
                  className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                />
                <button
                  onClick={joinRoom}
                  className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20"
                >
                  Join Room
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-gray-900 rounded-r-xl">
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="p-4 border-b border-gray-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Hash size={24} className="text-gray-400" />
                    <h2 className="text-lg font-semibold">
                      {roomCode ? `Room: ${roomCode}` : 'Welcome to Chat'}
                    </h2>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setShowNotifications(true)}
                      className="text-gray-400 hover:text-white transition-colors relative animate-bounce"
                    >
                      <Bell size={20} />
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>
                    <button
                      onClick={() => setShowUsers(true)}
                      className="text-gray-400 hover:text-white transition-colors transform hover:scale-110"
                    >
                      <Users size={20} />
                    </button>
                    <button
                      onClick={() => setShowSettings(true)}
                      className="text-gray-400 hover:text-white transition-colors animate-spin-slow"
                    >
                      <Settings size={20} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              {roomCode ? (
                <div className="flex-1 p-4 overflow-y-auto">
                  {messages.map((message, index) => (
                    <div
                      key={message.id || index}
                      className={`mb-4 ${
                        message.username === userName
                          ? 'text-right'
                          : 'text-left'
                      }`}
                    >
                      <div
                        className={`inline-block max-w-md px-4 py-2 rounded-lg transform transition-all duration-300 hover:scale-105 ${
                          message.username === userName
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-700 text-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-semibold">{message.username}</span>
                          <span className="text-xs text-gray-300">
                            {formatMessageTime(message.created_at)}
                          </span>
                        </div>
                        <p>{message.content}</p>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="text-gray-400 text-sm">
                      Someone is typing...
                      <span className="inline-block animate-bounce">.</span>
                      <span className="inline-block animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
                      <span className="inline-block animate-bounce" style={{ animationDelay: '0.4s' }}>.</span>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              ) : (
                <div className="flex-1 p-4">
                  <div className="flex flex-col items-center justify-center h-full space-y-4">
                    <MessageSquare size={48} className="text-purple-500 animate-bounce" />
                    <h3 className="text-2xl font-bold animate-pulse">Welcome to Chat!</h3>
                    <p className="text-gray-400 text-center max-w-md">
                      Enter your name and create a new room or join an existing one to start chatting!
                    </p>
                  </div>
                </div>
              )}

              {/* Message Input */}
              {roomCode && (
                <div className="p-4 border-t border-gray-800">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => {
                        setNewMessage(e.target.value);
                        handleTyping();
                      }}
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-2 bg-gray-800 rounded-lg focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                    />
                    <button
                      onClick={sendMessage}
                      disabled={isSending}
                      className={`px-4 py-2 bg-purple-600 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                        isSending ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-500 hover:shadow-lg hover:shadow-purple-500/20'
                      }`}
                    >
                      {isSending ? (
                        <Loader className="animate-spin" size={20} />
                      ) : (
                        <Send size={20} className="transform hover:rotate-12 transition-transform" />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <NotificationsModal
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />

      <UsersModal
        isOpen={showUsers}
        onClose={() => setShowUsers(false)}
        roomCode={roomCode}
      />

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  );
};

export default ComingSoon;