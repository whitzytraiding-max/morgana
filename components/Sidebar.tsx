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

export default function Sidebar({ chats, activeChatId, onSelect, onNew, onDelete, isOpen, onClose }: Props) {
  return (
    <>
      {isOpen && (
        <div
          className="mobile-overlay"
          onClick={onClose}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 10 }}
        />
      )}

      <aside
        style={{
          width: '260px',
          background: 'linear-gradient(180deg, #07040f 0%, #080810 100%)',
          borderRight: '1px solid #1a1030',
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
        <div style={{ padding: '20px 16px 14px', borderBottom: '1px solid #150e2a' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* Moon icon */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"
                  fill="#7c3aed"
                  opacity="0.9"
                />
                <circle cx="16" cy="6" r="1" fill="#d4a843" opacity="0.7" />
                <circle cx="19" cy="10" r="0.6" fill="#d4a843" opacity="0.5" />
              </svg>
              <span
                style={{
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #a78bfa, #e9d5ff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '0.02em',
                }}
              >
                Morgana
              </span>
            </div>
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', color: '#4a4060', cursor: 'pointer', fontSize: '1rem', padding: '2px' }}
            >
              ✕
            </button>
          </div>

          <button
            onClick={onNew}
            style={{
              width: '100%',
              padding: '10px 12px',
              background: 'linear-gradient(135deg, rgba(109,40,217,0.15), rgba(124,58,237,0.1))',
              border: '1px solid #3b1f6a',
              borderRadius: '10px',
              color: '#b09ef8',
              cursor: 'pointer',
              fontSize: '0.875rem',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span style={{ fontSize: '1.1rem', color: '#7c3aed' }}>✦</span>
            New conversation
          </button>
        </div>

        {/* Chat list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
          {chats.length === 0 && (
            <p style={{ color: '#2e2545', fontSize: '0.8rem', textAlign: 'center', marginTop: '32px' }}>
              No spells cast yet
            </p>
          )}
          {chats.map((chat) => {
            const active = activeChatId === chat.id;
            return (
              <div
                key={chat.id}
                onClick={() => { onSelect(chat.id); onClose(); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 10px',
                  borderRadius: '9px',
                  cursor: 'pointer',
                  background: active
                    ? 'linear-gradient(135deg, rgba(109,40,217,0.2), rgba(91,21,182,0.15))'
                    : 'transparent',
                  border: active ? '1px solid #3b1f6a' : '1px solid transparent',
                  marginBottom: '3px',
                  transition: 'all 0.1s',
                }}
              >
                <span
                  style={{
                    fontSize: '0.84rem',
                    color: active ? '#d8cfff' : '#5a5075',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    flex: 1,
                  }}
                >
                  {chat.title}
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(chat.id); }}
                  className="delete-btn"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#3a2d5a',
                    cursor: 'pointer',
                    fontSize: '0.7rem',
                    padding: '2px 4px',
                    borderRadius: '4px',
                    flexShrink: 0,
                    marginLeft: '4px',
                    opacity: 0,
                    transition: 'opacity 0.15s',
                  }}
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid #150e2a' }}>
          <p style={{ fontSize: '0.7rem', color: '#2e2545', textAlign: 'center' }}>
            ✦ Powered by Groq ✦
          </p>
        </div>
      </aside>

      <style>{`
        div:hover > .delete-btn, .delete-btn:focus { opacity: 1 !important; }
      `}</style>
    </>
  );
}
