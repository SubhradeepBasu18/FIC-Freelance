import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { NAV_ITEMS } from "@/constants/constants";
import logo from "@/assets/logo0.png";

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
                <div className="flex-shrink-0 flex items-center">
                    <Link
                    to="/"
                    className="flex items-center space-x-3 transition-opacity duration-200 hover:opacity-80"
                    onClick={handleLinkClick}
                    >
                    {/* Logo Image */}
                    <img 
                        src={logo} 
                        alt="FICMH Logo" 
                        className="h-8 w-auto md:h-10" // Adjust height as needed
                    />
                    {/* Logo Text */}
                    <span className={`text-2xl font-bold transition-colors duration-200 ${
                        location.pathname === "/" 
                        ? "accent-text" 
                        : "text-white"
                    }`}>
                        FICMH
                    </span>
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
                            ? "accent-text bg-white/10"
                            : "text-white hover:accent-text hover:bg-white/5"
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
                            className="absolute top-full left-0 mt-2 w-48 bg-transparent backdrop-blur-sm rounded-lg shadow-lg border border-white/20 py-2 z-50"
                            onMouseLeave={handleDropdownMouseLeave}
                            >
                            {item.links.map((link) => (
                                <Link
                                key={link.href}
                                to={link.href}
                                className={`block px-4 py-2 text-sm transition-colors duration-200 ${
                                    isLinkActive(link.href)
                                    ? "accent-text font-semibold bg-white/10"
                                    : "text-white hover:accent-text hover:bg-white/5"
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
                    className="p-2 rounded-md text-white hover:bg-white/5 hover:accent-text transition-colors duration-200"
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
                    <div className="absolute top-full left-0 right-0 bg-black/30 backdrop-blur-md border-b border-white/20 py-4 z-50">
                        <div className="container mx-auto px-4 space-y-2">
                        {NAV_ITEMS.map((item) => {
                            const isActive = isNavItemActive(item);
                            return (
                            <div
                                key={item.label}
                                className="border-b border-white/20 last:border-b-0"
                            >
                                <div className={`py-2 font-medium ${
                                isActive ? "accent-text" : "text-white"
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
                                        ? "accent-text bg-white/10"
                                        : "text-white hover:accent-text hover:bg-white/5"
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