import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import api from '../lib/axios';
import { useAuthStore } from '../store/useAuthStore';
import { Send, ArrowLeft, Paperclip, MoreVertical } from 'lucide-react';
import { format } from 'date-fns';

const ChatDetail = () => {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch group details
    api.get('/groups').then(res => {
      const g = res.data.find(x => x._id === groupId);
      if (g) setGroup(g);
    });

    // Fetch initial messages for default channel
    api.get(`/messages/${groupId}/general`).then(res => {
      setMessages(res.data);
    });

    const newSocket = io(`http://${window.location.hostname}:5000`);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      newSocket.emit('join_group', groupId);
    });

    newSocket.on('receive_message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => newSocket.disconnect();
  }, [groupId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const res = await api.post('/messages', {
        groupId,
        channel: 'general',
        content: newMessage
      });
      
      // Also emit to socket specifically if the server doesn't emit it back
      socket.emit('send_message', { groupId, message: res.data });
      // Depending on if the emitting user receives it, manually update:
      // Actually real socket server should broadcast. Let's just update locally just in case if duplicate isn't handled.
      // We will let the socket push to all including sender right now per our backend, wait, `io.to(groupId).emit` sends to all.
      
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#09090b] relative">
      {/* Chat Header */}
      <div className="bg-[#18181b]/95 backdrop-blur border-b border-[#27272a] p-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => navigate('/chats')}
            className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 transition"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg hidden sm:flex">
            #
          </div>
          <div>
            <h2 className="text-lg font-bold text-zinc-100 leading-tight">{group?.name || 'Loading...'}</h2>
            <p className="text-xs text-zinc-500">{group?.members?.length || 0} members • #general</p>
          </div>
        </div>
        <button className="p-2 text-zinc-400 hover:text-zinc-100 transition">
          <MoreVertical size={20} />
        </button>
      </div>

      {/* Messages Window */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-zinc-500">
            <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl">👋</span>
            </div>
            <p>Say hello to the group!</p>
          </div>
        )}
        
        {messages.map((msg, index) => {
          const isMe = msg.sender?._id === user?._id;
          const showAvatar = index === 0 || messages[index - 1].sender?._id !== msg.sender?._id;

          return (
            <div key={msg._id || index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex max-w-[85%] md:max-w-[70%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                
                {/* Avatar */}
                {!isMe && showAvatar ? (
                  <img src={msg.sender?.avatar} alt={msg.sender?.name} className="w-8 h-8 rounded-full bg-zinc-800 mr-2 mt-1 object-cover" />
                ) : !isMe ? (
                  <div className="w-8 mr-2"></div>
                ) : null}

                <div className="flex flex-col">
                  {/* Name and Time */}
                  {!isMe && showAvatar && (
                    <div className="flex items-baseline space-x-2 mb-1 ml-1">
                      <span className="text-sm font-medium text-zinc-300">{msg.sender?.name}</span>
                      <span className="text-[10px] text-zinc-500">{msg.createdAt ? format(new Date(msg.createdAt), 'h:mm a') : ''}</span>
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div 
                    className={`px-4 py-2.5 rounded-2xl text-[15px] leading-relaxed ${
                      isMe 
                        ? 'bg-blue-600 text-white rounded-tr-sm' 
                        : 'bg-[#27272a] border border-[#3f3f46]/50 text-zinc-100 rounded-tl-sm'
                    }`}
                  >
                    {msg.content}
                  </div>
                  
                  {isMe && (
                    <span className="text-[10px] text-zinc-500 ml-auto mt-1 mr-1">
                      {msg.createdAt ? format(new Date(msg.createdAt), 'h:mm a') : ''}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-[#18181b]/95 backdrop-blur border-t border-[#27272a] sm:pb-4 pb-20 md:pb-4">
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto relative flex items-center">
          <button type="button" className="absolute left-3 text-zinc-400 hover:text-zinc-200 transition">
            <Paperclip size={20} />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Message #general..."
            className="w-full bg-[#27272a] border border-[#3f3f46]/50 text-zinc-100 rounded-full py-3 pl-12 pr-14 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
          <button 
            type="submit" 
            disabled={!newMessage.trim()}
            className="absolute right-2 w-9 h-9 flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white rounded-full transition disabled:opacity-50 disabled:bg-zinc-700"
          >
            <Send size={18} className="translate-x-[2px]" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatDetail;
