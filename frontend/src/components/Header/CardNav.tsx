import React, { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

type CardNavLink = {
  label: string;
  href: string;
  ariaLabel: string;
};

export type CardNavItem = {
  label: string;
  bgColor: string;
  textColor: string;
  links: CardNavLink[];
};

export interface CardNavProps {
  logo: string;
  logoAlt?: string;
  items: CardNavItem[];
  className?: string;
  ease?: string;
  baseColor?: string;
  menuColor?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
}

const CardNav: React.FC<CardNavProps> = ({
  logo,
  logoAlt = 'Logo',
  items,
  className = '',
  ease = 'power3.out',
  baseColor = '#fff',
  menuColor,
  buttonBgColor,
  buttonTextColor
}) => {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const navRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const calculateHeight = () => {
    const navEl = navRef.current;
    if (!navEl) return 80;

    const contentEl = navEl.querySelector('.card-nav-content') as HTMLElement;
    
    if (contentEl) {
      const wasVisible = contentEl.style.visibility;
      const wasPointerEvents = contentEl.style.pointerEvents;
      const wasPosition = contentEl.style.position;
      const wasHeight = contentEl.style.height;

      contentEl.style.visibility = 'visible';
      contentEl.style.pointerEvents = 'auto';
      contentEl.style.position = 'static';
      contentEl.style.height = 'auto';

      contentEl.offsetHeight;

      const topBar = 60;
      const padding = 32; // Increased padding for better spacing
      const contentHeight = contentEl.scrollHeight;

      contentEl.style.visibility = wasVisible;
      contentEl.style.pointerEvents = wasPointerEvents;
      contentEl.style.position = wasPosition;
      contentEl.style.height = wasHeight;

      // Add max height for mobile to prevent going off-screen
      const maxMobileHeight = window.innerHeight - 100;
      const calculatedHeight = topBar + contentHeight + padding;
      
      return Math.min(calculatedHeight, maxMobileHeight);
    }
    
    return 80;
  };

  const createTimeline = () => {
    const navEl = navRef.current;
    if (!navEl) return null;

    gsap.set(navEl, { height: 60, overflow: 'hidden' });
    gsap.set(cardsRef.current, { y: 30, opacity: 0, scale: 0.95 });

    const tl = gsap.timeline({ paused: true });

    tl.to(navEl, {
      height: calculateHeight,
      duration: 0.5,
      ease
    });

    tl.to(cardsRef.current, { 
      y: 0, 
      opacity: 1, 
      scale: 1,
      duration: 0.4, 
      ease, 
      stagger: 0.06 
    }, '-=0.2');

    return tl;
  };

  useLayoutEffect(() => {
    const tl = createTimeline();
    tlRef.current = tl;

    return () => {
      tl?.kill();
      tlRef.current = null;
    };
  }, [ease, items]);

  useLayoutEffect(() => {
    let resizeTimeout: number; // Changed from NodeJS.Timeout to number
    
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(() => { // Use window.setTimeout
        if (!tlRef.current || !navRef.current) return;

        if (isExpanded) {
          const newHeight = calculateHeight();
          gsap.set(navRef.current, { height: newHeight });

          tlRef.current.kill();
          const newTl = createTimeline();
          if (newTl) {
            newTl.progress(1);
            tlRef.current = newTl;
          }
        } else {
          tlRef.current.kill();
          const newTl = createTimeline();
          if (newTl) {
            tlRef.current = newTl;
          }
        }
      }, 150);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, [isExpanded]);

  const toggleMenu = () => {
    const tl = tlRef.current;
    if (!tl) return;
    if (!isExpanded) {
      setIsHamburgerOpen(true);
      setIsExpanded(true);
      tl.play(0);
    } else {
      setIsHamburgerOpen(false);
      tl.eventCallback('onReverseComplete', () => setIsExpanded(false));
      tl.reverse();
    }
  };

  const setCardRef = (i: number) => (el: HTMLDivElement | null) => {
    if (el) cardsRef.current[i] = el;
  };

  return (
    <div
      className={`card-nav-container fixed left-1/2 -translate-x-1/2 w-[95%] max-w-[1400px] z-[9999] top-4 sm:top-6 md:top-8 ${className}`}
    >
      <nav
        ref={navRef}
        className={`card-nav ${isExpanded ? 'open' : ''} block h-[60px] p-0 rounded-2xl sm:rounded-3xl shadow-2xl relative overflow-hidden will-change-[height] backdrop-blur-sm bg-opacity-95 border border-white/10`}
        style={{ backgroundColor: baseColor }}
      >
        <div className="card-nav-top absolute inset-x-0 top-0 h-[60px] flex items-center justify-between p-3 sm:p-4 z-[2]">
          {/* Hamburger Menu - Visible on all screens */}
          <div
            className={`hamburger-menu ${isHamburgerOpen ? 'open' : ''} group h-10 w-10 flex flex-col items-center justify-center cursor-pointer gap-1.5 order-2 md:order-none rounded-lg hover:bg-black/5 transition-colors`}
            onClick={toggleMenu}
            role="button"
            aria-label={isExpanded ? 'Close menu' : 'Open menu'}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMenu();
              }
            }}
            style={{ color: menuColor || '#000' }}
          >
            <div
              className={`hamburger-line w-6 h-0.5 bg-current transition-all duration-300 ease-out ${
                isHamburgerOpen ? 'translate-y-[5px] rotate-45' : ''
              } group-hover:opacity-80`}
            />
            <div
              className={`hamburger-line w-6 h-0.5 bg-current transition-all duration-300 ease-out ${
                isHamburgerOpen ? '-translate-y-[5px] -rotate-45' : ''
              } group-hover:opacity-80`}
            />
          </div>

          {/* Logo - Responsive positioning */}
          <div className="logo-container flex items-center md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 order-1 md:order-none">
            <img 
              src={logo} 
              alt={logoAlt} 
              className="logo h-7 sm:h-8 md:h-9 transition-transform duration-300 hover:scale-110" 
            />
          </div>

          {/* CTA Button - Hidden on mobile, visible on tablet+ */}
          <button
            type="button"
            className="card-nav-cta-butto hidden sm:inline-flex items-center justify-center border-0 rounded-xl px-4 sm:px-5 h-10 font-medium cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
            style={{ 
              backgroundColor: buttonBgColor, 
              color: buttonTextColor 
            }}
          >
            <span className="text-sm sm:text-base">Get Started</span>
          </button>
        </div>

        {/* Navigation Content - Fully responsive grid */}
        <div
          className={`card-nav-content absolute left-0 right-0 top-[60px] bottom-0 p-4 sm:p-6 flex flex-col items-stretch gap-3 sm:gap-4 justify-start z-[1] overflow-y-auto ${
            isExpanded ? 'visible pointer-events-auto' : 'invisible pointer-events-none'
          } 
          /* Mobile: 1 column */
          grid grid-cols-1 gap-3
          /* Small tablets: 2 columns */
          sm:grid-cols-2 sm:gap-4
          /* Tablets: 3 columns */
          md:grid-cols-3 md:gap-5
          /* Large screens: 4 columns for more items */
          xl:grid-cols-4 xl:gap-6
          /* Extra large: max 5 columns */
          2xl:grid-cols-5`}
          aria-hidden={!isExpanded}
        >
          {(items || []).map((item, idx) => (
            <div
              key={`${item.label}-${idx}`}
              className="nav-card select-none relative flex flex-col gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl sm:rounded-2xl min-h-[100px] sm:min-h-[120px] transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-95 border border-white/10 group"
              ref={setCardRef(idx)}
              style={{ backgroundColor: item.bgColor, color: item.textColor }}
            >
              <div className="nav-card-label font-bold text-base sm:text-lg md:text-xl lg:text-2xl tracking-tight leading-tight">
                {item.label}
              </div>
              <div className="nav-card-links flex flex-col gap-2 sm:gap-3 mt-auto">
                {item.links?.map((lnk, i) => (
                  <a
                    key={`${lnk.label}-${i}`}
                    className="nav-card-link inline-flex items-center gap-2 sm:gap-3 no-underline cursor-pointer transition-all duration-300 hover:opacity-90 hover:translate-x-1 text-xs sm:text-sm md:text-base group-hover:opacity-100 opacity-90"
                    href={lnk.href}
                    aria-label={lnk.ariaLabel}
                    onClick={() => setIsExpanded(false)}
                  >
                    <span 
                      className="nav-card-link-icon shrink-0 transition-transform duration-300 group-hover:scale-125" 
                      aria-hidden="true"
                    >
                      →
                    </span>
                    <span className="truncate">{lnk.label}</span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default CardNav;