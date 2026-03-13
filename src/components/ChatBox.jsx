import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2, Search, BookOpen } from 'lucide-react';
import { chatbotService, mangaSearchService } from '../services/api';
import './ChatBox.css';

const WELCOME_MSG = {
  role: 'bot',
  content: 'Xin chào! 👋 Tôi là trợ lý AI của **Nhom8 Story**.\n\nTôi có thể giúp bạn:\n• 🔍 Tìm kiếm truyện theo tên, thể loại\n• 📚 Đề xuất truyện hay\n• ❓ Trả lời câu hỏi về truyện tranh\n\nHãy nhắn tin cho tôi nhé!',
};

export default function ChatBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MSG]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => { scrollToBottom(); }, [messages, searchResults]);
  useEffect(() => { if (isOpen) inputRef.current?.focus(); }, [isOpen]);

  const formatBotMessage = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>');
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMsg = { role: 'user', content: trimmed };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setSearchResults(null);

    try {
      // Call chatbot API
      const res = await chatbotService.ask(trimmed);
      const botReply = res.data.response || 'Xin lỗi, tôi không hiểu câu hỏi của bạn.';
      setMessages(prev => [...prev, { role: 'bot', content: botReply }]);

      // Also fetch search results if the message looks like a search query
      try {
        const searchRes = await mangaSearchService.search(trimmed, 5);
        if (searchRes.data.results && searchRes.data.results.length > 0) {
          setSearchResults(searchRes.data.results);
        }
      } catch { /* search is optional */ }
    } catch (err) {
      console.error('Chatbot error:', err);
      setMessages(prev => [...prev, {
        role: 'bot',
        content: 'Xin lỗi, hệ thống đang gặp sự cố. Vui lòng thử lại sau! 🙏',
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickAction = (text) => {
    setInput(text);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  return (
    <>
      {/* Floating trigger button */}
      <button
        className={`chatbox-trigger ${isOpen ? 'chatbox-trigger--hidden' : ''}`}
        onClick={() => setIsOpen(true)}
        aria-label="Mở chatbot hỗ trợ"
      >
        <MessageCircle size={26} />
        <span className="chatbox-trigger__badge">AI</span>
      </button>

      {/* Chat window */}
      <div className={`chatbox ${isOpen ? 'chatbox--open' : ''}`}>
        {/* Header */}
        <div className="chatbox__header">
          <div className="chatbox__header-info">
            <Bot size={22} />
            <div>
              <h4>Trợ lý Nhom8 Story</h4>
              <span className="chatbox__status">● Online</span>
            </div>
          </div>
          <button className="chatbox__close" onClick={() => setIsOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="chatbox__messages">
          {messages.map((msg, i) => (
            <div key={i} className={`chatbox__msg chatbox__msg--${msg.role}`}>
              <div className="chatbox__msg-avatar">
                {msg.role === 'bot' ? <Bot size={16} /> : <User size={16} />}
              </div>
              <div
                className="chatbox__msg-bubble"
                dangerouslySetInnerHTML={{ __html: formatBotMessage(msg.content) }}
              />
            </div>
          ))}

          {loading && (
            <div className="chatbox__msg chatbox__msg--bot">
              <div className="chatbox__msg-avatar"><Bot size={16} /></div>
              <div className="chatbox__msg-bubble chatbox__msg-typing">
                <Loader2 size={16} className="spin" />
                <span>Đang suy nghĩ...</span>
              </div>
            </div>
          )}

          {/* Search results cards */}
          {searchResults && (
            <div className="chatbox__search-results">
              <div className="chatbox__search-label">
                <Search size={14} /> Truyện liên quan:
              </div>
              {searchResults.map((r, i) => (
                <div key={i} className="chatbox__story-card">
                  <BookOpen size={14} />
                  <div>
                    <strong>{r.title}</strong>
                    {r.author && <span className="chatbox__story-author"> — {r.author}</span>}
                    {r.genres && <div className="chatbox__story-genres">{r.genres.join(', ')}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick actions */}
        <div className="chatbox__quick-actions">
          <button onClick={() => handleQuickAction('Đề xuất truyện hay')}>📚 Đề xuất</button>
          <button onClick={() => handleQuickAction('Truyện hành động')}>⚔️ Hành động</button>
          <button onClick={() => handleQuickAction('Truyện mới nhất')}>🆕 Mới nhất</button>
        </div>

        {/* Input */}
        <div className="chatbox__input-area">
          <input
            ref={inputRef}
            type="text"
            className="chatbox__input"
            placeholder="Nhập tin nhắn..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <button
            className="chatbox__send"
            onClick={handleSend}
            disabled={!input.trim() || loading}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </>
  );
}
