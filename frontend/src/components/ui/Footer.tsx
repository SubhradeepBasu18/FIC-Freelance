import React from 'react';
import { quickLinks, socialLinks, contactInfo } from '@/constants/constants';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="relative opacity-80 z-50 bg-zinc-950 border-t border-cyan-500/20 overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-pink-500/5 animate-pulse-slow"></div>
        
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
            {[...Array(8)].map((_, i) => (
            <div
                key={i}
                className="absolute w-1 h-1 bg-cyan-400/20 rounded-full animate-float"
                style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${15 + Math.random() * 10}s`
                }}
            />
            ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
            {/* Main footer content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Brand section */}
            <div className="md:col-span-2">
                <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">TF</span>
                </div>
                <div>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    TECHFEST 2.25
                    </h3>
                    <p className="text-xs text-gray-400">11th Edition</p>
                </div>
                </div>
                <p className="text-gray-300 mb-3 max-w-md text-sm leading-relaxed">
                Celebrating a decade of innovation and technological excellence at B.P. Poddar Institute.
                </p>
                <div className="flex space-x-2">
                {socialLinks.map((social) => {
                    const IconComponent = social.icon;
                    return (
                    <a
                        key={social.name}
                        href={social.href}
                        className="w-8 h-8 bg-zinc-800 hover:bg-cyan-500/20 border border-cyan-500/20 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-cyan-500/20 group"
                        aria-label={social.name}
                    >
                        <IconComponent className="text-cyan-400 group-hover:text-white text-sm transition-colors duration-300" />
                    </a>
                    );
                })}
                </div>
            </div>

            {/* Quick Links in 2 columns */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                <h4 className="text-sm font-semibold text-cyan-400 mb-3 flex items-center">
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-2 animate-pulse"></span>
                    Quick Links
                </h4>
                <ul className="space-y-2">
                    {quickLinks.slice(0, 3).map((link) => (
                    <li key={link.name}>
                        <a
                        href={link.href}
                        className="text-gray-300 hover:text-cyan-400 transition-all duration-300 hover:translate-x-1 flex items-center group text-sm"
                        >
                        <span className="w-1 h-1 bg-cyan-400 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                        {link.name}
                        </a>
                    </li>
                    ))}
                </ul>
                </div>
                <div className="mt-7">
                <ul className="space-y-2">
                    {quickLinks.slice(3).map((link) => (
                    <li key={link.name}>
                        <a
                        href={link.href}
                        className="text-gray-300 hover:text-cyan-400 transition-all duration-300 hover:translate-x-1 flex items-center group text-sm"
                        >
                        <span className="w-1 h-1 bg-cyan-400 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                        {link.name}
                        </a>
                    </li>
                    ))}
                </ul>
                </div>
            </div>
            </div>

            {/* Contact Info - Compact */}
            <div className="border-t border-cyan-500/20 pt-4 mb-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
                {contactInfo.map((contact, index) => {
                    const IconComponent = contact.icon;
                    return (
                    <div key={contact.type} className="flex items-center space-x-2">
                        <IconComponent className="text-cyan-400 text-sm" />
                        <span className="text-xs">{contact.value}</span>
                        {index < contactInfo.length - 1 && (
                        <span className="text-gray-600 hidden sm:inline">•</span>
                        )}
                    </div>
                    );
                })}
                </div>
            </div>
            </div>

            {/* Bottom section */}
            <div className="border-t border-cyan-500/20 pt-4">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
                <div className="text-gray-400 text-xs">
                © {currentYear} <span className="text-cyan-400 font-semibold">TECHFEST 2.25</span>. 
                All rights reserved.
                </div>
                
                <div className="flex items-center space-x-4 text-xs text-gray-400">
                <a href="#" className="hover:text-cyan-400 transition-colors duration-300">
                    Privacy
                </a>
                <a href="#" className="hover:text-cyan-400 transition-colors duration-300">
                    Terms
                </a>
                <a href="#" className="hover:text-cyan-400 transition-colors duration-300">
                    Conduct
                </a>
                </div>
            </div>
            </div>
        </div>

        {/* Glow effects */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
        </footer>
    );
};

export default Footer;