'use client';

import { Chat } from '@/app/page';

interface Props {
  chats: Chat[];
  activeChatId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({
  chats,
  activeChatId,
  onSelect,
  onNew,
  onDelete,
  isOpen,
  onClose,
}: Props) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="mobile-overlay"
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 10,
          }}
        />
      )}

      <aside
        style={{
          width: '260px',
          background: '#0a0a0e',
          borderRight: '1px solid #1e1e2e',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 20,
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.25s ease',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 16px 12px',
            borderBottom: '1px solid #1e1e2e',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px',
            }}
          >
            <span
              style={{
                fontSize: '1.1rem',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #a78bfa, #c4b5fd)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.01em',
              }}
            >
              Morgana
            </span>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: '#555',
                cursor: 'pointer',
                fontSize: '1.1rem',
                padding: '2px',
              }}
            >
              ✕
            </button>
          </div>
          <button
            onClick={onNew}
            style={{
              width: '100%',
              padding: '9px 12px',
              background: '#16161f',
              border: '1px solid #2a2a3a',
              borderRadius: '8px',
              color: '#a78bfa',
              cursor: 'pointer',
              fontSize: '0.875rem',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'border-color 0.15s',
            }}
          >
            <span style={{ fontSize: '1rem' }}>+</span>
            New chat
          </button>
        </div>

        {/* Chat list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
          {chats.length === 0 && (
            <p
              style={{
                color: '#3a3a5a',
                fontSize: '0.8rem',
                textAlign: 'center',
                marginTop: '24px',
              }}
            >
              No conversations yet
            </p>
          )}
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => { onSelect(chat.id); onClose(); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '9px 10px',
                borderRadius: '8px',
                cursor: 'pointer',
                background: activeChatId === chat.id ? '#1e1e2e' : 'transparent',
                marginBottom: '2px',
                transition: 'background 0.1s',
              }}
            >
              <span
                style={{
                  fontSize: '0.84rem',
                  color: activeChatId === chat.id ? '#e0d8f8' : '#8080a0',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  flex: 1,
                }}
              >
                {chat.title}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(chat.id);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#3a3a5a',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  padding: '2px 4px',
                  borderRadius: '4px',
                  flexShrink: 0,
                  marginLeft: '4px',
                  opacity: 0,
                  transition: 'opacity 0.15s',
                }}
                className="delete-btn"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </aside>

      <style>{`
        div:hover > .delete-btn,
        .delete-btn:focus {
          opacity: 1 !important;
        }
      `}</style>
    </>
  );
}
