import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

export interface ChromaItem {
  image: string;
  title: string;
  subtitle: string;
  handle?: string;
  location?: string;
  borderColor?: string;
  gradient?: string;
  url?: string;
}

export interface ChromaGridProps {
  items?: ChromaItem[];
  className?: string;
  radius?: number;
  damping?: number;
  fadeOut?: number;
  ease?: string;
}

type SetterFn = (v: number | string) => void;

const ChromaGrid: React.FC<ChromaGridProps> = ({
  items,
  className = '',
  radius = 300,
  damping = 0.45,
  fadeOut = 0.6,
  ease = 'power3.out'
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);
  const setX = useRef<SetterFn | null>(null);
  const setY = useRef<SetterFn | null>(null);
  const pos = useRef({ x: 0, y: 0 });

  const demo: ChromaItem[] = [
    {
      image: 'https://i.pravatar.cc/300?img=8',
      title: 'Alex Rivera',
      subtitle: 'Full Stack Developer',
      handle: '@alexrivera',
      borderColor: '#4F46E5',
      gradient: 'linear-gradient(145deg, #4F46E5, #7C73FF, #4F46E5)',
      url: 'https://github.com/'
    },
    {
      image: 'https://i.pravatar.cc/300?img=11',
      title: 'Jordan Chen',
      subtitle: 'DevOps Engineer',
      handle: '@jordanchen',
      borderColor: '#10B981',
      gradient: 'linear-gradient(210deg, #10B981, #34D399, #10B981)',
      url: 'https://linkedin.com/in/'
    },
    {
      image: 'https://i.pravatar.cc/300?img=3',
      title: 'Morgan Blake',
      subtitle: 'UI/UX Designer',
      handle: '@morganblake',
      borderColor: '#F59E0B',
      gradient: 'linear-gradient(165deg, #F59E0B, #FBBF24, #F59E0B)',
      url: 'https://dribbble.com/'
    },
    {
      image: 'https://i.pravatar.cc/300?img=16',
      title: 'Casey Park',
      subtitle: 'Data Scientist',
      handle: '@caseypark',
      borderColor: '#EF4444',
      gradient: 'linear-gradient(195deg, #EF4444, #F87171, #EF4444)',
      url: 'https://kaggle.com/'
    },
    {
      image: 'https://i.pravatar.cc/300?img=25',
      title: 'Sam Kim',
      subtitle: 'Mobile Developer',
      handle: '@thesamkim',
      borderColor: '#8B5CF6',
      gradient: 'linear-gradient(225deg, #8B5CF6, #A78BFA, #8B5CF6)',
      url: 'https://github.com/'
    },
    {
      image: 'https://i.pravatar.cc/300?img=60',
      title: 'Tyler Rodriguez',
      subtitle: 'Cloud Architect',
      handle: '@tylerrod',
      borderColor: '#06B6D4',
      gradient: 'linear-gradient(135deg, #06B6D4, #22D3EE, #06B6D4)',
      url: 'https://aws.amazon.com/'
    }
  ];

  const data = items?.length ? items : demo;

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    setX.current = gsap.quickSetter(el, '--x', 'px') as SetterFn;
    setY.current = gsap.quickSetter(el, '--y', 'px') as SetterFn;
    const { width, height } = el.getBoundingClientRect();
    pos.current = { x: width / 2, y: height / 2 };
    setX.current(pos.current.x);
    setY.current(pos.current.y);
  }, []);

  const moveTo = (x: number, y: number) => {
    gsap.to(pos.current, {
      x,
      y,
      duration: damping,
      ease,
      onUpdate: () => {
        setX.current?.(pos.current.x);
        setY.current?.(pos.current.y);
      },
      overwrite: true
    });
  };

  const handleMove = (e: React.PointerEvent) => {
    const r = rootRef.current!.getBoundingClientRect();
    moveTo(e.clientX - r.left, e.clientY - r.top);
    gsap.to(fadeRef.current, { opacity: 0, duration: 0.25, overwrite: true });
  };

  const handleLeave = () => {
    gsap.to(fadeRef.current, {
      opacity: 1,
      duration: fadeOut,
      overwrite: true
    });
  };

  const handleCardClick = (url?: string) => {
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCardMove: React.MouseEventHandler<HTMLElement> = e => {
    const c = e.currentTarget as HTMLElement;
    const rect = c.getBoundingClientRect();
    c.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    c.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={rootRef}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className={`relative w-full h-full flex flex-wrap justify-center items-start gap-6 p-6 ${className}`}
      style={
        {
          '--r': `${radius}px`,
          '--x': '50%',
          '--y': '50%',
        } as React.CSSProperties
      }
    >
      {data.map((c, i) => (
        <article
          key={i}
          onMouseMove={handleCardMove}
          onClick={() => handleCardClick(c.url)}
          className="group relative flex flex-col w-[320px] rounded-3xl overflow-hidden border-3 transition-all duration-500 cursor-pointer shadow-2xl hover:shadow-3xl hover:scale-105 hover:rotate-1 bg-transparent"
          style={
            {
              '--card-border': c.borderColor || 'transparent',
              '--spotlight-color': 'rgba(255,255,255,0.4)',
              borderColor: c.borderColor,
              boxShadow: `0 20px 40px ${c.borderColor}40, 0 0 0 1px ${c.borderColor}20`
            } as React.CSSProperties
          }
        >
          {/* Gradient Border Effect */}
          <div
            className="absolute inset-0 rounded-3xl pointer-events-none z-0"
            style={{
              background: c.gradient,
              opacity: 0.8
            }}
          />
          
          {/* Main Transparent Content */}
          <div className="relative z-10 bg-transparent rounded-3xl">
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-500 z-20 opacity-0 group-hover:opacity-100 rounded-3xl"
              style={{
                background:
                  'radial-gradient(circle at var(--mouse-x) var(--mouse-y), var(--spotlight-color), transparent 70%)'
              }}
            />
            
            <div className="relative z-10 flex-1 p-4 box-border bg-transparent">
              <img 
                src={c.image} 
                alt={c.title} 
                loading="lazy" 
                className="w-full h-48 object-cover rounded-2xl border-3 border-white/30 shadow-lg transition-transform duration-500 group-hover:scale-110 bg-transparent" 
              />
            </div>
            
            <footer className="relative z-10 p-5 text-white font-sans grid grid-cols-[1fr_auto] gap-x-4 gap-y-2 bg-transparent">
              <h3 className="m-0 text-lg font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                {c.title}
              </h3>
              {c.handle && (
                <span className="text-sm opacity-90 text-right bg-gradient-to-l from-white to-white/70 bg-clip-text text-transparent">
                  {c.handle}
                </span>
              )}
              <p className="m-0 text-base opacity-95 col-span-2 font-medium">
                {c.subtitle}
              </p>
              {c.location && (
                <span className="text-sm opacity-85 text-right col-span-2 flex items-center justify-end gap-1">
                  📍 {c.location}
                </span>
              )}
            </footer>
          </div>
        </article>
      ))}
      
      <div
        className="absolute inset-0 pointer-events-none z-30"
        style={{
          backdropFilter: 'grayscale(0.3) brightness(0.85)',
          WebkitBackdropFilter: 'grayscale(0.3) brightness(0.85)',
          background: 'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%)',
          maskImage:
            'radial-gradient(circle var(--r) at var(--x) var(--y), transparent 0%, transparent 15%, rgba(0,0,0,0.10) 30%, rgba(0,0,0,0.22)45%, rgba(0,0,0,0.35)60%, rgba(0,0,0,0.50)75%, rgba(0,0,0,0.68)88%, white 100%)',
          WebkitMaskImage:
            'radial-gradient(circle var(--r) at var(--x) var(--y), transparent 0%, transparent 15%, rgba(0,0,0,0.10) 30%, rgba(0,0,0,0.22)45%, rgba(0,0,0,0.35)60%, rgba(0,0,0,0.50)75%, rgba(0,0,0,0.68)88%, white 100%)'
        }}
      />
      
      <div
        ref={fadeRef}
        className="absolute inset-0 pointer-events-none transition-opacity duration-500 z-40"
        style={{
          backdropFilter: 'grayscale(0.3) brightness(0.85)',
          WebkitBackdropFilter: 'grayscale(0.3) brightness(0.85)',
          background: 'radial-gradient(circle at 30% 70%, rgba(255,255,255,0.2) 0%, transparent 50%)',
          maskImage:
            'radial-gradient(circle var(--r) at var(--x) var(--y), white 0%, white 15%, rgba(255,255,255,0.90)30%, rgba(255,255,255,0.78)45%, rgba(255,255,255,0.65)60%, rgba(255,255,255,0.50)75%, rgba(255,255,255,0.32)88%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(circle var(--r) at var(--x) var(--y), white 0%, white 15%, rgba(255,255,255,0.90)30%, rgba(255,255,255,0.78)45%, rgba(255,255,255,0.65)60%, rgba(255,255,255,0.50)75%, rgba(255,255,255,0.32)88%, transparent 100%)',
          opacity: 1
        }}
      />
    </div>
  );
};

export default ChromaGrid;