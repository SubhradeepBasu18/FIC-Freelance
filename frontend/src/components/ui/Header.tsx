import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { NAV_ITEMS } from "@/constants/constants";
import logo from '/assets/logo0.png';

const Header = () => {
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);
    const location = useLocation();
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            setIsScrolled(scrollTop > 50);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setActiveDropdown(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const isNavItemActive = (item: typeof NAV_ITEMS[0]) => {
        return item.links.some(link => link.href === location.pathname);
    };

    const isLinkActive = (href: string) => {
        return location.pathname === href;
    };

    const handleMouseEnter = (label: string) => {
        setActiveDropdown(label);
    };

    const handleMouseLeave = (event: React.MouseEvent) => {
        const relatedTarget = event.relatedTarget as HTMLElement;
        if (!dropdownRef.current?.contains(relatedTarget)) {
            setActiveDropdown(null);
        }
    };

    const handleDropdownMouseLeave = (event: React.MouseEvent) => {
        const relatedTarget = event.relatedTarget as HTMLElement;
        if (!event.currentTarget.contains(relatedTarget)) {
            setActiveDropdown(null);
        }
    };

    const handleLinkClick = () => {
        setActiveDropdown(null);
        setMobileAccordion(null);
    };

    const handleMobileMenuToggle = () => {
        setActiveDropdown(activeDropdown === "mobile" ? null : "mobile");
        setMobileAccordion(null);
    };

    const toggleMobileAccordion = (label: string) => {
        setMobileAccordion(mobileAccordion === label ? null : label);
    };

    return (
        <header
            className={`fixed top-0 left-0 right-0 text-white z-50 transition-all duration-500 ${isScrolled
                    ? "bg-black/40 backdrop-blur-md shadow-2xl "
                    : "bg-gradient-to-b from-black/20 to-transparent backdrop-blur-sm"
                }`}
            ref={dropdownRef}
        >
            <nav className="container mx-auto px-4 lg:px-6 py-3 md:py-4">
                <div className="flex items-center justify-between">
                    {/* Logo with glow effect */}
                    <div className="flex-shrink-0 flex items-center group">
                        <Link
                            to="/"
                            className="flex items-center space-x-3 transition-all duration-300 hover:scale-105"
                            onClick={handleLinkClick}
                        >
                            <div className="relative">
                                <img
                                    src={logo}
                                    alt="FICMH Logo"
                                    className="h-9 w-auto md:h-12 relative z-10 drop-shadow-lg"
                                />
                                <div className="absolute inset-0 bg-cyan-400/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                            <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent group-hover:from-cyan-300 group-hover:via-white group-hover:to-cyan-300 transition-all duration-300">
                                FICMH
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
                        {NAV_ITEMS.map((item) => {
                            const isActive = isNavItemActive(item);
                            const hasMultipleLinks = item.links.length > 1;
                            return (
                                <div
                                    key={item.label}
                                    className="relative"
                                    onMouseEnter={() => hasMultipleLinks && handleMouseEnter(item.label)}
                                    onMouseLeave={hasMultipleLinks ? handleMouseLeave : undefined}
                                >
                                    {hasMultipleLinks ? (
                                        <button
                                            className={`relative flex items-center space-x-1 px-4 py-2.5 text-sm font-medium transition-all duration-300 rounded-xl overflow-hidden group ${isActive
                                                    ? "text-cyan-300"
                                                    : "text-white/90 hover:text-white"
                                                }`}
                                        >
                                            <span className="relative z-10">{item.label}</span>
                                            <svg
                                                className={`w-4 h-4 transition-transform duration-300 relative z-10 ${activeDropdown === item.label ? "rotate-180" : ""
                                                    }`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M19 9l-7 7-7-7"
                                                />
                                            </svg>
                                            <div className={`absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/20 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isActive ? "opacity-100" : ""
                                                }`}></div>
                                            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                                        </button>
                                    ) : (
                                        <Link
                                            to={item.links[0].href}
                                            className={`relative flex items-center px-4 py-2.5 text-sm font-medium transition-all duration-300 rounded-xl overflow-hidden group ${isLinkActive(item.links[0].href)
                                                    ? "text-cyan-300"
                                                    : "text-white/90 hover:text-white"
                                                }`}
                                            onClick={handleLinkClick}
                                        >
                                            <span className="relative z-10">{item.label}</span>
                                            <div className={`absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/20 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isActive ? "opacity-100" : ""
                                                }`}></div>
                                            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                                        </Link>
                                    )}

                                    {/* Dropdown Menu with animation - only show if has multiple links */}
                                    {hasMultipleLinks && activeDropdown === item.label && (
                                        <div
                                            className="absolute top-full left-0 mt-2 w-56 bg-black/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-300"
                                            onMouseLeave={handleDropdownMouseLeave}
                                        >
                                            {item.links.map((link, index) => (
                                                <Link
                                                    key={link.href}
                                                    to={link.href}
                                                    className={`relative block px-5 py-3 text-sm transition-all duration-200 group overflow-hidden ${isLinkActive(link.href)
                                                            ? "text-cyan-300 font-semibold"
                                                            : "text-white/80 hover:text-white"
                                                        }`}
                                                    onClick={handleLinkClick}
                                                    style={{ animationDelay: `${index * 50}ms` }}
                                                >
                                                    <span className="relative z-10 flex items-center">
                                                        {isLinkActive(link.href) && (
                                                            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-2 animate-pulse"></span>
                                                        )}
                                                        {link.label}
                                                    </span>
                                                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/20 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Mobile Hamburger Menu */}
                    <div className="md:hidden">
                        <button
                            className="relative p-2 rounded-xl text-white hover:bg-white/10 transition-all duration-300 group"
                            onClick={handleMobileMenuToggle}
                        >
                            <svg
                                className={`w-6 h-6 transition-transform duration-300 ${activeDropdown === "mobile" ? "rotate-90" : ""
                                    }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                {activeDropdown === "mobile" ? (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                ) : (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                )}
                            </svg>
                            <div className="absolute inset-0 bg-cyan-400/20 blur-lg rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </button>

                        {/* Mobile Dropdown Menu with Accordion */}
                        {activeDropdown === "mobile" && (
                            <div className="absolute top-full left-0 right-0 bg-black/70 backdrop-blur-xl border-b border-white/20 py-4 z-50 animate-in fade-in slide-in-from-top-4 duration-300 max-h-[calc(100vh-80px)] overflow-y-auto">
                                <div className="container mx-auto px-4 space-y-1">
                                    {NAV_ITEMS.map((item, itemIndex) => {
                                        const isActive = isNavItemActive(item);
                                        const hasMultipleLinks = item.links.length > 1;
                                        const isOpen = mobileAccordion === item.label;
                                        return (
                                            <div
                                                key={item.label}
                                                className="border-b border-white/10 last:border-b-0 py-2"
                                                style={{ animationDelay: `${itemIndex * 50}ms` }}
                                            >
                                                {hasMultipleLinks ? (
                                                    <>
                                                        <button
                                                            onClick={() => toggleMobileAccordion(item.label)}
                                                            className={`w-full flex items-center justify-between py-2 font-semibold text-sm tracking-wide transition-colors duration-200 ${isActive ? "text-cyan-300" : "text-white/90 hover:text-white"
                                                                }`}
                                                        >
                                                            <span>{item.label}</span>
                                                            <svg
                                                                className={`w-5 h-5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                                                                    }`}
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M19 9l-7 7-7-7"
                                                                />
                                                            </svg>
                                                        </button>

                                                        {/* Accordion Content */}
                                                        <div
                                                            className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96 opacity-100 mt-1" : "max-h-0 opacity-0"
                                                                }`}
                                                        >
                                                            <div className="space-y-1">
                                                                {item.links.map((link) => (
                                                                    <Link
                                                                        key={link.href}
                                                                        to={link.href}
                                                                        className={`relative block py-2.5 px-4 text-sm rounded-xl transition-all duration-200 overflow-hidden group ${isLinkActive(link.href)
                                                                                ? "text-cyan-300 font-medium"
                                                                                : "text-white/80 hover:text-white"
                                                                            }`}
                                                                        onClick={handleLinkClick}
                                                                    >
                                                                        <span className="relative z-10 flex items-center">
                                                                            {isLinkActive(link.href) && (
                                                                                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-2 animate-pulse"></span>
                                                                            )}
                                                                            {link.label}
                                                                        </span>
                                                                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/20 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                                                                    </Link>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <Link
                                                        to={item.links[0].href}
                                                        className={`w-full flex items-center py-2 font-semibold text-sm tracking-wide transition-colors duration-200 ${isLinkActive(item.links[0].href)
                                                                ? "text-cyan-300"
                                                                : "text-white/90 hover:text-white"
                                                            }`}
                                                        onClick={handleLinkClick}
                                                    >
                                                        <span>{item.label}</span>
                                                    </Link>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;