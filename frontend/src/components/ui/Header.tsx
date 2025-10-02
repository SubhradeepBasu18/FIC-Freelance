import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { NAV_ITEMS } from "@/constants/constants";

const Header = () => {
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
        const scrollTop = window.scrollY;
        setIsScrolled(scrollTop > 50);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close dropdown when clicking outside
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

    // Check if a nav item is active based on current location
    const isNavItemActive = (item: typeof NAV_ITEMS[0]) => {
        return item.links.some(link => link.href === location.pathname);
    };

    // Check if a specific link is active
    const isLinkActive = (href: string) => {
        return location.pathname === href;
    };

    const handleMouseEnter = (label: string) => {
        setActiveDropdown(label);
    };

    const handleMouseLeave = (event: React.MouseEvent) => {
        // Only close if not moving to dropdown menu
        const relatedTarget = event.relatedTarget as HTMLElement;
        if (!dropdownRef.current?.contains(relatedTarget)) {
        setActiveDropdown(null);
        }
    };

    const handleDropdownMouseLeave = (event: React.MouseEvent) => {
        // Close dropdown when leaving the dropdown area
        const relatedTarget = event.relatedTarget as HTMLElement;
        if (!event.currentTarget.contains(relatedTarget)) {
        setActiveDropdown(null);
        }
    };

    const handleLinkClick = () => {
        setActiveDropdown(null);
    };

    const handleMobileMenuToggle = () => {
        setActiveDropdown(activeDropdown === "mobile" ? null : "mobile");
    };

    return (
        <header
        className={`fixed top-0 left-0 right-0 text-white z-50 transition-all duration-300 ${
            isScrolled
            ? "bg-transparent backdrop-blur-sm shadow-lg"
            : "bg-transparent backdrop-blur-0"
        }`}
        ref={dropdownRef}
        >
            <nav className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                {/* Logo */}
                <div className="flex-shrink-0">
                    <Link
                    to="/"
                    className={`text-2xl font-bold transition-colors duration-200 ${
                        location.pathname === "/" 
                        ? "text-blue-400" 
                        : "text-white hover:text-blue-400"
                    }`}
                    onClick={handleLinkClick}
                    >
                    FICMH
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-8">
                    {NAV_ITEMS.map((item) => {
                    const isActive = isNavItemActive(item);
                    return (
                        <div
                        key={item.label}
                        className="relative"
                        onMouseEnter={() => handleMouseEnter(item.label)}
                        onMouseLeave={handleMouseLeave}
                        >
                        <button className={`flex items-center space-x-1 px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-lg ${
                            isActive
                            ? "text-blue-400 bg-white/10"
                            : "text-white hover:text-blue-400 hover:bg-white/5"
                        }`}>
                            <span>{item.label}</span>
                            <svg
                            className={`w-4 h-4 transition-transform duration-200 ${
                                activeDropdown === item.label ? "rotate-180" : ""
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

                        {/* Dropdown Menu */}
                        {activeDropdown === item.label && (
                            <div
                            className="absolute top-full left-0 mt-2 w-48 bg-zinc-900/95 backdrop-blur-sm rounded-lg shadow-lg border border-zinc-700 py-2 z-50"
                            onMouseLeave={handleDropdownMouseLeave}
                            >
                            {item.links.map((link) => (
                                <Link
                                key={link.href}
                                to={link.href}
                                className={`block px-4 py-2 text-sm transition-colors duration-200 ${
                                    isLinkActive(link.href)
                                    ? "text-blue-400"
                                    : "text-white hover:text-blue-400 hover:bg-zinc-800"
                                }`}
                                onClick={handleLinkClick}
                                >
                                {link.label}
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
                    className="p-2 rounded-md text-white hover:bg-white/10 transition-colors duration-200"
                    onClick={handleMobileMenuToggle}
                    >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                    </button>

                    {/* Mobile Dropdown Menu */}
                    {activeDropdown === "mobile" && (
                    <div className="absolute top-full left-0 right-0 bg-zinc-900/95 backdrop-blur-sm border-b border-zinc-700 py-4 z-50">
                        <div className="container mx-auto px-4 space-y-2">
                        {NAV_ITEMS.map((item) => {
                            const isActive = isNavItemActive(item);
                            return (
                            <div
                                key={item.label}
                                className="border-b border-zinc-700 last:border-b-0"
                            >
                                <div className={`py-2 font-medium ${
                                isActive ? "text-blue-400" : "text-white"
                                }`}>
                                {item.label}
                                </div>
                                <div className="pb-2 space-y-1">
                                {item.links.map((link) => (
                                    <Link
                                    key={link.href}
                                    to={link.href}
                                    className={`block py-1 px-4 text-sm rounded transition-colors duration-200 ${
                                        isLinkActive(link.href)
                                        ? "text-blue-400 bg-white/10"
                                        : "text-zinc-300 hover:text-white hover:bg-zinc-800"
                                    }`}
                                    onClick={handleLinkClick}
                                    >
                                    {link.label}
                                    </Link>
                                ))}
                                </div>
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