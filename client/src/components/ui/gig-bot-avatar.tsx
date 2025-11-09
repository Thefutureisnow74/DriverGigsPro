import React from 'react';

interface GigBotAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  className?: string;
}

export function GigBotAvatar({ size = 'md', animated = false, className = '' }: GigBotAvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  return (
    <div className={`${sizeClasses[size]} ${className} relative`}>
      <svg
        viewBox="0 0 100 100"
        className={`w-full h-full ${animated ? 'animate-pulse' : ''}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background circle with gradient */}
        <defs>
          <linearGradient id="botGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
          <linearGradient id="eyeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#0891b2" />
          </linearGradient>
        </defs>
        
        {/* Bot head */}
        <circle cx="50" cy="50" r="45" fill="url(#botGradient)" stroke="#4f46e5" strokeWidth="2"/>
        
        {/* Bot face features */}
        {/* Eyes */}
        <circle cx="35" cy="40" r="6" fill="url(#eyeGradient)"/>
        <circle cx="65" cy="40" r="6" fill="url(#eyeGradient)"/>
        
        {/* Eye highlights */}
        <circle cx="37" cy="37" r="2" fill="white"/>
        <circle cx="67" cy="37" r="2" fill="white"/>
        
        {/* Mouth/Speaker */}
        <rect x="40" y="55" width="20" height="8" rx="4" fill="#1e293b" stroke="#64748b" strokeWidth="1"/>
        <rect x="42" y="57" width="4" height="4" rx="1" fill="#06b6d4"/>
        <rect x="48" y="57" width="4" height="4" rx="1" fill="#06b6d4"/>
        <rect x="54" y="57" width="4" height="4" rx="1" fill="#06b6d4"/>
        
        {/* Antenna */}
        <line x1="50" y1="5" x2="50" y2="15" stroke="#4f46e5" strokeWidth="2"/>
        <circle cx="50" cy="5" r="3" fill="#06b6d4"/>
        
        {/* Side panels */}
        <rect x="10" y="35" width="8" height="20" rx="2" fill="#4f46e5" opacity="0.8"/>
        <rect x="82" y="35" width="8" height="20" rx="2" fill="#4f46e5" opacity="0.8"/>
        
        {/* Circuit patterns */}
        <path d="M25 25 L30 25 L30 30" stroke="#06b6d4" strokeWidth="1" fill="none" opacity="0.6"/>
        <path d="M75 25 L70 25 L70 30" stroke="#06b6d4" strokeWidth="1" fill="none" opacity="0.6"/>
        <path d="M25 75 L30 75 L30 70" stroke="#06b6d4" strokeWidth="1" fill="none" opacity="0.6"/>
        <path d="M75 75 L70 75 L70 70" stroke="#06b6d4" strokeWidth="1" fill="none" opacity="0.6"/>
        
        {animated && (
          <>
            {/* Pulsing rings for animation */}
            <circle cx="50" cy="50" r="48" fill="none" stroke="#8b5cf6" strokeWidth="1" opacity="0.3">
              <animate attributeName="r" values="45;50;45" dur="2s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.3;0.1;0.3" dur="2s" repeatCount="indefinite"/>
            </circle>
            <circle cx="50" cy="50" r="52" fill="none" stroke="#a855f7" strokeWidth="1" opacity="0.2">
              <animate attributeName="r" values="50;55;50" dur="3s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.2;0.05;0.2" dur="3s" repeatCount="indefinite"/>
            </circle>
          </>
        )}
      </svg>
    </div>
  );
}