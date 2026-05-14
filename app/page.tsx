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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '14px 16px',
            borderBottom: '1px solid #1e1e2e',
            background: '#0d0d0f',
            gap: '12px',
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            style={{
              background: 'none',
              border: 'none',
              color: '#6060a0',
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
              fontSize: '0.95rem',
              fontWeight: 600,
              color: '#6060a0',
              flex: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {activeChat ? activeChat.title : 'Morgana'}
          </span>
          <button
            onClick={newChat}
            style={{
              background: 'linear-gradient(135deg, #6d28d9, #7c3aed)',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '0.8rem',
              padding: '6px 12px',
              fontWeight: 600,
            }}
          >
            + New
          </button>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 16px 8px' }}>
          <div style={{ maxWidth: '760px', margin: '0 auto' }}>
            {!activeChat || activeChat.messages.length === 0 ? (
              <div style={{ textAlign: 'center', marginTop: '15vh' }}>
                <div
                  style={{
                    fontSize: '2.5rem',
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #7c3aed, #a78bfa, #c4b5fd)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '12px',
                    letterSpacing: '-0.02em',
                  }}
                >
                  Morgana
                </div>
                <p style={{ fontSize: '1rem', color: '#404060' }}>Ask me anything.</p>
              </div>
            ) : (
              activeChat.messages.map((msg, i) => (
                <MessageBubble key={i} message={msg} />
              ))
            )}

            {streaming && activeChat && activeChat.messages[activeChat.messages.length - 1]?.content === '' && (
              <div style={{ display: 'flex', gap: '4px', padding: '8px 0 16px' }}>
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: '#7c5cbf',
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
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
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
