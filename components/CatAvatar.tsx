'use client';

export default function CatAvatar({ size = 36 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        flexShrink: 0,
        borderRadius: '50%',
        background: 'radial-gradient(circle at 40% 35%, #1a0a2e, #080810)',
        border: '1.5px solid #4c1d7a',
        boxShadow: '0 0 10px rgba(139, 92, 246, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <svg
        viewBox="0 0 40 44"
        width={size - 8}
        height={size - 8}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Left ear */}
        <polygon points="7,17 4,5 15,12" fill="#0d0015" />
        <polygon points="8,16 6,7 14,12" fill="#2d0a4e" />
        {/* Right ear */}
        <polygon points="33,17 36,5 25,12" fill="#0d0015" />
        <polygon points="32,16 34,7 26,12" fill="#2d0a4e" />
        {/* Head */}
        <circle cx="20" cy="24" r="14" fill="#0d0015" />
        {/* Left eye glow */}
        <ellipse cx="14.5" cy="23" rx="4" ry="4" fill="#e8a020" opacity="0.15" />
        {/* Left eye */}
        <ellipse cx="14.5" cy="23" rx="3" ry="3.2" fill="#d4941a" />
        <ellipse cx="14.5" cy="23" rx="1.3" ry="2.4" fill="#050505" />
        <circle cx="13.5" cy="21.8" r="0.7" fill="white" opacity="0.7" />
        {/* Right eye glow */}
        <ellipse cx="25.5" cy="23" rx="4" ry="4" fill="#e8a020" opacity="0.15" />
        {/* Right eye */}
        <ellipse cx="25.5" cy="23" rx="3" ry="3.2" fill="#d4941a" />
        <ellipse cx="25.5" cy="23" rx="1.3" ry="2.4" fill="#050505" />
        <circle cx="24.5" cy="21.8" r="0.7" fill="white" opacity="0.7" />
        {/* Nose */}
        <polygon points="20,27.5 18.5,29.2 21.5,29.2" fill="#7c3a6e" />
        {/* Mouth */}
        <path d="M18.5 29.2 Q20 30.5 21.5 29.2" fill="none" stroke="#5a2850" strokeWidth="0.6" />
        {/* Whiskers */}
        <line x1="5" y1="27" x2="16" y2="28" stroke="#2a2040" strokeWidth="0.7" />
        <line x1="5" y1="29.5" x2="16" y2="29.5" stroke="#2a2040" strokeWidth="0.7" />
        <line x1="35" y1="27" x2="24" y2="28" stroke="#2a2040" strokeWidth="0.7" />
        <line x1="35" y1="29.5" x2="24" y2="29.5" stroke="#2a2040" strokeWidth="0.7" />
      </svg>
    </div>
  );
}
