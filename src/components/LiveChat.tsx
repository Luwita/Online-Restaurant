import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, User, Bot, Phone, Mail, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface ChatMessage {
  id: string;
  sender: 'user' | 'support' | 'bot';
  message: string;
  timestamp: Date;
  type: 'text' | 'order' | 'image';
  orderId?: string;
}

interface LiveChatProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockMessages: ChatMessage[] = [
  {
    id: '1',
    sender: 'bot',
    message: 'Hello! I\'m here to help you with your order. How can I assist you today?',
    timestamp: new Date(Date.now() - 300000),
    type: 'text',
  },
];

export default function LiveChat({ isOpen, onClose }: LiveChatProps) {
  const { state } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [supportAgent, setSupportAgent] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      message: newMessage,
      timestamp: new Date(),
      type: 'text',
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Simulate support response
    setTimeout(() => {
      const responses = [
        "Thank you for your message. Let me check that for you.",
        "I understand your concern. Let me connect you with our kitchen staff.",
        "Your order is being prepared. Expected time is 15-20 minutes.",
        "I've noted your special request. Is there anything else I can help with?",
      ];

      const supportMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: Math.random() > 0.5 ? 'support' : 'bot',
        message: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
        type: 'text',
      };

      setMessages(prev => [...prev, supportMessage]);
      setIsTyping(false);

      // Set support agent info
      if (supportMessage.sender === 'support' && !supportAgent) {
        setSupportAgent({
          name: 'Sarah Johnson',
          role: 'Customer Support',
          avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
          status: 'online',
        });
      }
    }, 2000);
  };

  const quickReplies = [
    'Where is my order?',
    'Change my order',
    'Cancel order',
    'Special dietary requirements',
    'Delivery time',
    'Payment issue',
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="absolute bottom-4 right-4 w-full max-w-md h-[600px] bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MessageCircle className="w-6 h-6" />
              <div>
                <h3 className="font-bold">Live Support</h3>
                <div className="flex items-center space-x-1 text-xs text-blue-100">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Online</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {supportAgent && (
            <div className="mt-3 pt-3 border-t border-white/20">
              <div className="flex items-center space-x-2">
                <img
                  src={supportAgent.avatar}
                  alt={supportAgent.name}
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <div className="text-sm font-medium">{supportAgent.name}</div>
                  <div className="text-xs text-blue-100">{supportAgent.role}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                message.sender === 'user'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : message.sender === 'support'
                  ? 'bg-white/20 text-white border border-white/30'
                  : 'bg-white/10 text-gray-300 border border-white/20'
              }`}>
                {message.sender !== 'user' && (
                  <div className="flex items-center space-x-2 mb-1">
                    {message.sender === 'support' ? (
                      <User className="w-3 h-3" />
                    ) : (
                      <Bot className="w-3 h-3" />
                    )}
                    <span className="text-xs font-medium">
                      {message.sender === 'support' ? 'Support Agent' : 'AI Assistant'}
                    </span>
                  </div>
                )}
                <p className="text-sm">{message.message}</p>
                <p className="text-xs opacity-75 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white/10 text-gray-300 px-4 py-2 rounded-2xl border border-white/20">
                <div className="flex items-center space-x-1">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-xs ml-2">Typing...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies */}
        <div className="px-4 py-2 border-t border-white/20">
          <div className="flex flex-wrap gap-2">
            {quickReplies.slice(0, 3).map((reply) => (
              <button
                key={reply}
                onClick={() => setNewMessage(reply)}
                className="text-xs px-3 py-1 bg-white/10 text-gray-300 rounded-full hover:bg-white/20 transition-colors border border-white/20"
              >
                {reply}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/20">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Contact Options */}
        <div className="p-4 bg-white/5 rounded-b-2xl border-t border-white/20">
          <div className="flex justify-center space-x-4 text-xs">
            <button className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors">
              <Phone className="w-3 h-3" />
              <span>Call</span>
            </button>
            <button className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors">
              <Mail className="w-3 h-3" />
              <span>Email</span>
            </button>
            <div className="flex items-center space-x-1 text-gray-400">
              <Clock className="w-3 h-3" />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}