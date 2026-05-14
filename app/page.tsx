'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Sidebar from '@/components/Sidebar';
import MessageBubble from '@/components/MessageBubble';
import ChatInput from '@/components/ChatInput';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
}

const STORAGE_KEY = 'morgana_chats';

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function loadChats(): Chat[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveChats(chats: Chat[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
}

export default function Home() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [streaming, setStreaming] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = loadChats();
    setChats(stored);
  }, []);

  const activeChat = chats.find((c) => c.id === activeChatId) ?? null;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages.length, streaming]);

  const updateChats = (updated: Chat[]) => {
    setChats(updated);
    saveChats(updated);
  };

  const newChat = useCallback(() => {
    const chat: Chat = {
      id: generateId(),
      title: 'New chat',
      messages: [],
      createdAt: Date.now(),
    };
    setChats((prev) => {
      const updated = [chat, ...prev];
      saveChats(updated);
      return updated;
    });
    setActiveChatId(chat.id);
  }, []);

  const deleteChat = (id: string) => {
    setChats((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      saveChats(updated);
      if (activeChatId === id) {
        setActiveChatId(updated[0]?.id ?? null);
      }
      return updated;
    });
  };

  const sendMessage = async (text: string, chatId: string) => {
    const userMsg: Message = { role: 'user', content: text };

    let messagesForApi: Message[] = [];

    setChats((prev) => {
      const updated = prev.map((c) => {
        if (c.id !== chatId) return c;
        const newMessages = [...c.messages, userMsg];
        messagesForApi = newMessages;
        return {
          ...c,
          messages: [...newMessages, { role: 'assistant' as const, content: '' }],
          title: c.messages.length === 0 ? text.slice(0, 45) : c.title,
        };
      });
      saveChats(updated);
      return updated;
    });

    setStreaming(true);

    let assistantContent = '';

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: messagesForApi }),
      });

      if (!res.ok || !res.body) throw new Error('Request failed');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantContent += decoder.decode(value, { stream: true });

        setChats((prev) => {
          const updated = prev.map((c) => {
            if (c.id !== chatId) return c;
            const msgs = [...c.messages];
            msgs[msgs.length - 1] = { role: 'assistant', content: assistantContent };
            return { ...c, messages: msgs };
          });
          saveChats(updated);
          return updated;
        });
      }
    } catch {
      setChats((prev) => {
        const updated = prev.map((c) => {
          if (c.id !== chatId) return c;
          const msgs = [...c.messages];
          msgs[msgs.length - 1] = {
            role: 'assistant',
            content: 'Something went wrong. Please try again.',
          };
          return { ...c, messages: msgs };
        });
        saveChats(updated);
        return updated;
      });
    } finally {
      setStreaming(false);
    }
  };

  const handleSend = (text: string) => {
    if (activeChatId) {
      sendMessage(text, activeChatId);
      return;
    }
    const chatId = generateId();
    const chat: Chat = {
      id: chatId,
      title: text.slice(0, 45),
      messages: [],
      createdAt: Date.now(),
    };
    setChats((prev) => {
      const updated = [chat, ...prev];
      saveChats(updated);
      return updated;
    });
    setActiveChatId(chatId);
    setTimeout(() => sendMessage(text, chatId), 50);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        onSelect={setActiveChatId}
        onNew={newChat}
        onDelete={deleteChat}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#08080f' }}>
        {/* Top bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '12px 16px',
            borderBottom: '1px solid #150e2a',
            background: 'linear-gradient(180deg, #07040f 0%, #08080f 100%)',
            gap: '12px',
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            style={{
              background: 'none',
              border: 'none',
              color: '#4a3870',
              cursor: 'pointer',
              fontSize: '1.2rem',
              padding: '2px 6px',
              lineHeight: 1,
            }}
          >
            ☰
          </button>
          <span
            style={{
              fontSize: '0.9rem',
              fontWeight: 600,
              color: '#5a4880',
              flex: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {activeChat ? activeChat.title : ''}
          </span>
          <button
            onClick={newChat}
            style={{
              background: 'linear-gradient(135deg, #4c1d95, #6d28d9)',
              border: 'none',
              borderRadius: '8px',
              color: '#ddd6fe',
              cursor: 'pointer',
              fontSize: '0.78rem',
              padding: '6px 12px',
              fontWeight: 600,
              letterSpacing: '0.02em',
            }}
          >
            ✦ New
          </button>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 16px 8px' }}>
          <div style={{ maxWidth: '720px', margin: '0 auto' }}>
            {!activeChat || activeChat.messages.length === 0 ? (
              <div style={{ textAlign: 'center', paddingTop: '8vh', userSelect: 'none' }}>
                {/* Moon + cat hero */}
                <div style={{ position: 'relative', display: 'inline-block', marginBottom: '28px' }}>
                  {/* Stars */}
                  {[
                    { top: '-20px', left: '10px', size: 3, opacity: 0.6 },
                    { top: '-10px', right: '20px', size: 2, opacity: 0.4 },
                    { top: '20px', left: '-25px', size: 2, opacity: 0.5 },
                    { top: '50px', right: '-20px', size: 3, opacity: 0.35 },
                    { top: '-30px', left: '60px', size: 2, opacity: 0.5 },
                    { bottom: '10px', left: '-30px', size: 2, opacity: 0.4 },
                  ].map((s, i) => (
                    <div
                      key={i}
                      style={{
                        position: 'absolute',
                        width: s.size,
                        height: s.size,
                        borderRadius: '50%',
                        background: '#d4a843',
                        opacity: s.opacity,
                        top: (s as any).top,
                        left: (s as any).left,
                        right: (s as any).right,
                        bottom: (s as any).bottom,
                        animation: `twinkle ${2 + i * 0.4}s ease-in-out infinite`,
                      }}
                    />
                  ))}

                  {/* Moon */}
                  <svg width="140" height="140" viewBox="0 0 140 140">
                    <defs>
                      <radialGradient id="moonGlow" cx="40%" cy="35%">
                        <stop offset="0%" stopColor="#3b1f7a" />
                        <stop offset="60%" stopColor="#1a0a3a" />
                        <stop offset="100%" stopColor="#080810" />
                      </radialGradient>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="6" result="blur" />
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                      </filter>
                    </defs>
                    {/* Outer glow */}
                    <circle cx="70" cy="70" r="62" fill="#4c1d95" opacity="0.08" />
                    <circle cx="70" cy="70" r="54" fill="#5b21b6" opacity="0.1" />
                    {/* Moon body */}
                    <circle cx="70" cy="70" r="48" fill="url(#moonGlow)" />
                    <circle cx="70" cy="70" r="48" fill="none" stroke="#4c1d7a" strokeWidth="1.5" opacity="0.6" />
                    {/* Moon craters */}
                    <circle cx="52" cy="58" r="6" fill="none" stroke="#2d1060" strokeWidth="1" opacity="0.5" />
                    <circle cx="85" cy="80" r="4" fill="none" stroke="#2d1060" strokeWidth="1" opacity="0.4" />
                    <circle cx="60" cy="88" r="3" fill="none" stroke="#2d1060" strokeWidth="1" opacity="0.3" />

                    {/* Black cat sitting on bottom of moon */}
                    {/* Body */}
                    <ellipse cx="70" cy="104" rx="16" ry="12" fill="#050508" />
                    {/* Tail curling right */}
                    <path d="M86 108 Q100 95 92 82 Q88 76 82 80" fill="none" stroke="#050508" strokeWidth="5" strokeLinecap="round" />
                    {/* Head */}
                    <circle cx="70" cy="84" r="11" fill="#050508" />
                    {/* Left ear */}
                    <polygon points="61,76 58,66 67,73" fill="#050508" />
                    <polygon points="62,75 60,68 66,73" fill="#0d0020" />
                    {/* Right ear */}
                    <polygon points="79,76 82,66 73,73" fill="#050508" />
                    <polygon points="78,75 80,68 74,73" fill="#0d0020" />
                    {/* Eyes */}
                    <ellipse cx="65" cy="83" rx="2.5" ry="2.8" fill="#d4941a" />
                    <ellipse cx="65" cy="83" rx="1" ry="2" fill="#020202" />
                    <circle cx="64.2" cy="82" r="0.6" fill="white" opacity="0.8" />
                    <ellipse cx="75" cy="83" rx="2.5" ry="2.8" fill="#d4941a" />
                    <ellipse cx="75" cy="83" rx="1" ry="2" fill="#020202" />
                    <circle cx="74.2" cy="82" r="0.6" fill="white" opacity="0.8" />
                  </svg>
                </div>

                <div
                  style={{
                    fontSize: '2.2rem',
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 50%, #e9d5ff 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '10px',
                    letterSpacing: '-0.02em',
                  }}
                >
                  Morgana
                </div>
                <p style={{ fontSize: '0.95rem', color: '#3d3060', marginBottom: '28px' }}>
                  What do you seek?
                </p>

                {/* Suggestion chips */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '480px', margin: '0 auto' }}>
                  {[
                    '✦ Help me write something',
                    '✦ Explain a concept',
                    '✦ Debug my code',
                    '✦ Give me advice',
                  ].map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        const text = s.replace('✦ ', '');
                        handleSend(text);
                      }}
                      style={{
                        background: 'rgba(91,33,182,0.1)',
                        border: '1px solid #2d1660',
                        borderRadius: '20px',
                        color: '#6d4aaa',
                        fontSize: '0.8rem',
                        padding: '7px 14px',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              activeChat.messages.map((msg, i) => (
                <MessageBubble key={i} message={msg} />
              ))
            )}

            {streaming && activeChat && activeChat.messages[activeChat.messages.length - 1]?.content === '' && (
              <div style={{ display: 'flex', gap: '5px', padding: '4px 0 16px', paddingLeft: '48px' }}>
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: '#6d28d9',
                      animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                    }}
                  />
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </div>

        <ChatInput onSend={handleSend} disabled={streaming} />
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.25; transform: scale(0.75); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 0.9; transform: scale(1.3); }
        }
        @media (min-width: 768px) {
          aside {
            position: static !important;
            transform: none !important;
            z-index: auto !important;
            transition: none !important;
          }
          .mobile-overlay { display: none !important; }
        }
      `}</style>
    </div>
  );
}
