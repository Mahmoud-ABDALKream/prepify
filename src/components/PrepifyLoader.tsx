'use client';

import { useEffect, useState, useCallback } from 'react';

const loadingMessages = [
  'Initializing your experience...',
  'Loading quiz engine...',
  'Preparing questions...',
  'Setting up analytics...',
  'Almost ready...',
];

// Floating particle component
function FloatingParticle({ delay, x, y, symbol, size }: {
  delay: number; x: number; y: number; symbol: string; size: number;
}) {
  return (
    <div
      className="absolute pointer-events-none select-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        animationDelay: `${delay}s`,
        fontSize: `${size}px`,
        opacity: 0,
        animation: `floatParticle 4s ease-in-out ${delay}s infinite`,
        color: ['#7c3aed', '#00d4ff', '#6366f1', '#a78bfa', '#38bdf8'][Math.floor(delay * 7) % 5],
      }}
    >
      {symbol}
    </div>
  );
}

// Orbiting ring around logo
function OrbitRing({ radius, duration, delay, dotCount }: {
  radius: number; duration: number; delay: number; dotCount: number;
}) {
  return (
    <div
      className="absolute"
      style={{
        width: radius * 2,
        height: radius * 2,
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        animation: `spin ${duration}s linear ${delay}s infinite`,
      }}
    >
      {Array.from({ length: dotCount }).map((_, i) => {
        const angle = (360 / dotCount) * i;
        const rad = (angle * Math.PI) / 180;
        const dotX = radius + Math.cos(rad) * radius - 3;
        const dotY = radius + Math.sin(rad) * radius - 3;
        return (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 6,
              height: 6,
              left: dotX,
              top: dotY,
              background: i % 2 === 0 ? '#7c3aed' : '#00d4ff',
              boxShadow: `0 0 8px ${i % 2 === 0 ? '#7c3aed' : '#00d4ff'}`,
              opacity: 0.6 + (i / dotCount) * 0.4,
            }}
          />
        );
      })}
    </div>
  );
}

export default function PrepifyLoader({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [showLoader, setShowLoader] = useState(true);

  const finishLoading = useCallback(() => {
    if (isFading) return;
    setProgress(100);
    setIsFading(true);
    setTimeout(() => {
      setIsLoading(false);
      sessionStorage.setItem('prepify-loaded', 'true');
    }, 800);
  }, [isFading]);

  // Progress simulation and real load detection
  useEffect(() => {
    // Check if already loaded this session
    if (sessionStorage.getItem('prepify-loaded') === 'true') {
      setIsLoading(false);
      setShowLoader(false);
      return;
    }

    let simulated = 0;
    const maxSimulated = 85; // Don't simulate past 85% - wait for real load

    const progressInterval = setInterval(() => {
      simulated += Math.random() * 8 + 2;
      if (simulated > maxSimulated) simulated = maxSimulated;
      setProgress(Math.min(Math.round(simulated), maxSimulated));
    }, 300);

    // Cycle through messages
    const messageInterval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % loadingMessages.length);
    }, 2000);

    // Check if document is already loaded
    const checkLoaded = () => {
      if (document.readyState === 'complete') {
        clearInterval(progressInterval);
        clearInterval(messageInterval);
        finishLoading();
        return true;
      }
      return false;
    };

    // Check immediately
    if (checkLoaded()) return;

    // Listen for load event
    const handleLoad = () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
      finishLoading();
    };

    window.addEventListener('load', handleLoad);

    // Fallback timeout - if something fails to load, still finish after 10s
    const fallbackTimer = setTimeout(() => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
      finishLoading();
    }, 10000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
      window.removeEventListener('load', handleLoad);
      clearTimeout(fallbackTimer);
    };
  }, [finishLoading]);

  // Particles data
  const particles = [
    { delay: 0, x: 10, y: 20, symbol: '?', size: 24 },
    { delay: 0.5, x: 85, y: 15, symbol: '✓', size: 20 },
    { delay: 1.0, x: 15, y: 75, symbol: '💡', size: 22 },
    { delay: 1.5, x: 80, y: 70, symbol: '?', size: 26 },
    { delay: 2.0, x: 5, y: 50, symbol: '✎', size: 20 },
    { delay: 2.5, x: 90, y: 45, symbol: '✓', size: 22 },
    { delay: 0.3, x: 25, y: 10, symbol: '◆', size: 16 },
    { delay: 1.8, x: 70, y: 85, symbol: '◇', size: 18 },
    { delay: 0.8, x: 50, y: 8, symbol: '✦', size: 14 },
    { delay: 1.3, x: 40, y: 90, symbol: '★', size: 16 },
    { delay: 2.2, x: 92, y: 30, symbol: '?', size: 20 },
    { delay: 0.6, x: 8, y: 85, symbol: '✓', size: 18 },
  ];

  if (!showLoader && !isLoading) {
    return <>{children}</>;
  }

  return (
    <>
      {/* Loading Overlay */}
      <div
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
        style={{
          backgroundColor: '#080c18',
          opacity: isFading ? 0 : 1,
          transition: 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          pointerEvents: isFading ? 'none' : 'auto',
        }}
      >
        {/* Background gradient effects */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Central glow */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: 600,
              height: 600,
              background: 'radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, rgba(99, 102, 241, 0.08) 40%, transparent 70%)',
              animation: 'pulseGlow 3s ease-in-out infinite',
            }}
          />
          {/* Secondary glow */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: 400,
              height: 400,
              background: 'radial-gradient(circle, rgba(0, 212, 255, 0.1) 0%, transparent 60%)',
              animation: 'pulseGlow 4s ease-in-out 1.5s infinite',
            }}
          />
          {/* Grid pattern */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(124, 58, 237, 0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(124, 58, 237, 0.03) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        {/* Floating particles */}
        {particles.map((p, i) => (
          <FloatingParticle key={i} {...p} />
        ))}

        {/* Logo area with orbit rings */}
        <div className="relative mb-10" style={{ width: 180, height: 180 }}>
          {/* Orbit rings */}
          <OrbitRing radius={100} duration={8} delay={0} dotCount={8} />
          <OrbitRing radius={130} duration={12} delay={2} dotCount={12} />
          <OrbitRing radius={160} duration={16} delay={4} dotCount={6} />

          {/* Logo container */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              animation: 'logoFloat 3s ease-in-out infinite',
            }}
          >
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                width: 110,
                height: 110,
                boxShadow: '0 0 40px rgba(124, 58, 237, 0.4), 0 0 80px rgba(124, 58, 237, 0.2)',
                animation: 'logoGlow 2s ease-in-out infinite alternate',
              }}
            >
              <img
                src="/logo.png"
                alt="Prepify"
                className="w-full h-full object-cover"
                style={{ borderRadius: 16 }}
              />
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="flex items-center gap-3 mb-6">
          <h1
            className="text-4xl font-bold tracking-tight"
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #00d4ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'titleShimmer 3s ease-in-out infinite',
              backgroundSize: '200% 200%',
            }}
          >
            Prepify
          </h1>
        </div>

        {/* Loading message */}
        <p
          className="text-sm mb-8 h-5 transition-all duration-500"
          style={{
            color: '#64748b',
            opacity: isFading ? 0 : 1,
          }}
        >
          {loadingMessages[messageIndex]}
        </p>

        {/* Progress bar */}
        <div
          className="relative overflow-hidden rounded-full"
          style={{
            width: 280,
            height: 4,
            backgroundColor: 'rgba(124, 58, 237, 0.15)',
          }}
        >
          <div
            className="absolute left-0 top-0 h-full rounded-full transition-all duration-300 ease-out"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #7c3aed, #00d4ff)',
              boxShadow: '0 0 12px rgba(124, 58, 237, 0.5)',
            }}
          />
          {/* Shimmer effect on progress */}
          <div
            className="absolute top-0 h-full rounded-full"
            style={{
              width: 60,
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
              animation: 'progressShimmer 1.5s ease-in-out infinite',
              left: `${Math.max(0, progress - 10)}%`,
            }}
          />
        </div>

        {/* Progress percentage */}
        <p
          className="text-xs mt-3 transition-opacity duration-300"
          style={{
            color: '#475569',
            opacity: isFading ? 0 : 0.7,
          }}
        >
          {progress}%
        </p>

        {/* Bottom decorative line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(124, 58, 237, 0.3), rgba(0, 212, 255, 0.3), transparent)',
          }}
        />
      </div>

      {/* Page content */}
      <div
        style={{
          opacity: isLoading && !isFading ? 0 : 1,
          transition: 'opacity 0.5s ease-in',
        }}
      >
        {children}
      </div>
    </>
  );
}
