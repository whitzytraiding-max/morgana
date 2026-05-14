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
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
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

  return (
    <div
      style={{
        padding: '12px 16px',
        borderTop: '1px solid #1e1e2e',
        background: '#0d0d0f',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: '10px',
          background: '#16161f',
          border: '1px solid #2a2a3a',
          borderRadius: '14px',
          padding: '10px 14px',
          maxWidth: '760px',
          margin: '0 auto',
        }}
      >
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onInput={handleInput}
          onKeyDown={handleKey}
          placeholder="Message Morgana..."
          rows={1}
          disabled={disabled}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            resize: 'none',
            color: '#e8e8ea',
            fontSize: '0.95rem',
            lineHeight: '1.5',
            fontFamily: 'inherit',
            overflowY: 'auto',
            maxHeight: '160px',
          }}
        />
        <button
          onClick={handleSend}
          disabled={!text.trim() || disabled}
          style={{
            flexShrink: 0,
            width: '34px',
            height: '34px',
            borderRadius: '8px',
            border: 'none',
            background:
              !text.trim() || disabled
                ? '#2a2a3a'
                : 'linear-gradient(135deg, #6d28d9, #7c3aed)',
            color: !text.trim() || disabled ? '#555' : '#fff',
            cursor: !text.trim() || disabled ? 'default' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.15s',
            fontSize: '1rem',
          }}
        >
          ↑
        </button>
      </div>
      <p
        style={{
          textAlign: 'center',
          fontSize: '0.7rem',
          color: '#3a3a5a',
          marginTop: '8px',
        }}
      >
        Morgana can make mistakes. Use your judgment.
      </p>
    </div>
  );
}
