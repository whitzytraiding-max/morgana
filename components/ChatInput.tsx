'use client';

import { useState, useRef, KeyboardEvent } from 'react';

interface Props {
  onSend: (text: string) => void;
  disabled: boolean;
}

export default function ChatInput({ onSend, disabled }: Props) {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 160) + 'px';
  };

  const canSend = !!text.trim() && !disabled;

  return (
    <div
      style={{
        padding: '12px 16px 16px',
        borderTop: '1px solid #150e2a',
        background: 'linear-gradient(180deg, #080810 0%, #07040f 100%)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: '10px',
          background: '#0e0b1e',
          border: `1px solid ${canSend ? '#4c1d7a' : '#1e1535'}`,
          borderRadius: '16px',
          padding: '10px 14px',
          maxWidth: '760px',
          margin: '0 auto',
          boxShadow: canSend ? '0 0 16px rgba(109,40,217,0.12)' : 'none',
          transition: 'border-color 0.2s, box-shadow 0.2s',
        }}
      >
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onInput={handleInput}
          onKeyDown={handleKey}
          placeholder="Ask Morgana anything..."
          rows={1}
          disabled={disabled}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            resize: 'none',
            color: '#e2dff5',
            fontSize: '0.95rem',
            lineHeight: '1.5',
            fontFamily: 'inherit',
            overflowY: 'auto',
            maxHeight: '160px',
          }}
        />
        <button
          onClick={handleSend}
          disabled={!canSend}
          style={{
            flexShrink: 0,
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            border: 'none',
            background: canSend
              ? 'linear-gradient(135deg, #5b21b6, #7c3aed)'
              : '#1a1530',
            color: canSend ? '#e9d5ff' : '#3a3060',
            cursor: canSend ? 'pointer' : 'default',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.15s',
            fontSize: '1rem',
            boxShadow: canSend ? '0 2px 10px rgba(109,40,217,0.4)' : 'none',
          }}
        >
          ↑
        </button>
      </div>
      <p style={{ textAlign: 'center', fontSize: '0.68rem', color: '#2e2545', marginTop: '8px' }}>
        Morgana may be wrong. Trust your own judgment.
      </p>
    </div>
  );
}
