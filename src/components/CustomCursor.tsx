import React, { useEffect, useRef } from 'react';

const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  // Don't run on touch-only devices — no mouse cursor exists
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }


  useEffect(() => {
    const cursor = cursorRef.current;
    const ring = ringRef.current;
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (cursor) {
        cursor.style.left = `${mx - 4}px`;
        cursor.style.top = `${my - 4}px`;
      }
    };

    const animRing = () => {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      if (ring) {
        ring.style.left = `${rx - 16}px`;
        ring.style.top = `${ry - 16}px`;
      }
      animationFrameId = requestAnimationFrame(animRing);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animRing();

    // Hover effects for cursor
    const handleMouseEnter = () => {
      if (cursor && ring) {
        cursor.style.transform = 'scale(2.5)';
        ring.style.transform = 'scale(1.5)';
        ring.style.borderColor = 'rgba(230,50,50,0.6)';
      }
    };
    const handleMouseLeave = () => {
      if (cursor && ring) {
        cursor.style.transform = 'scale(1)';
        ring.style.transform = 'scale(1)';
        ring.style.borderColor = 'rgba(230,50,50,0.4)';
      }
    };

    // Use event delegation for hover effects
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, input, select, .step, .feature-card, .param-row')) {
        handleMouseEnter();
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, input, select, .step, .feature-card, .param-row')) {
        handleMouseLeave();
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  return (
    <>
      <div className="cursor" ref={cursorRef} id="cursor" style={{ position: 'fixed', width: '8px', height: '8px', background: '#e63232', borderRadius: '50%', pointerEvents: 'none', zIndex: 9999, transition: 'transform 0.15s ease, opacity 0.15s ease', mixBlendMode: 'screen' }}></div>
      <div className="cursor-ring" ref={ringRef} id="cursorRing" style={{ position: 'fixed', width: '32px', height: '32px', border: '1px solid rgba(230, 50, 50, 0.4)', borderRadius: '50%', pointerEvents: 'none', zIndex: 9998, transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s' }}></div>
    </>
  );
};

export default CustomCursor;
