import React from 'react';
import { quickLinks, socialLinks, contactInfo } from '@/constants/constants';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="relative bg-black border-t border-zinc-800 overflow-hidden">
            {/* Subtle background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/50 to-black"></div>
            
            {/* Minimal floating elements */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-0.5 h-0.5 bg-zinc-600 rounded-full animate-float"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${10 + Math.random() * 5}s`
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
                {/* Main footer content */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Brand section */}
                    <div className="md:col-span-2">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-transparent rounded-xl flex items-center justify-center">
                                <img 
                                    src="/assets/logo0.png" 
                                    alt="FICMH Logo" 
                                    className="w-10 h-10 object-contain"
                                />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold italic text-white">
                                    FICMH
                                </h3>
                                <p className="text-sm text-white">Finance & Investment Club</p>
                            </div>
                        </div>
                        <p className="text-white mb-6 max-w-md text-sm leading-relaxed">
                            Cultivating financial literacy and empowering young minds through knowledge, innovation, 
                            and real-world financial insights.
                        </p>
                        <div className="flex space-x-3">
                            {socialLinks.map((social) => {
                                const IconComponent = social.icon;
                                return (
                                    <a
                                        key={social.name}
                                        href={social.href}
                                        className="w-10 h-10 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:border-zinc-500 group"
                                        aria-label={social.name}
                                    >
                                        <IconComponent className="text-white group-hover:text-white text-sm transition-colors duration-300" />
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                            <span className="w-1.5 h-1.5 bg-white rounded-full mr-2"></span>
                            Quick Links
                        </h4>
                        <ul className="space-y-3">
                            {quickLinks.slice(0, 4).map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        className="text-white hover:text-white transition-all duration-300 hover:translate-x-2 flex items-center group text-sm"
                                    >
                                        <span className="w-1 h-1 bg-white rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                            <span className="w-1.5 h-1.5 bg-white rounded-full mr-2"></span>
                            Contact
                        </h4>
                        <ul className="space-y-3">
                            {contactInfo.map((contact) => {
                                const IconComponent = contact.icon;
                                return (
                                    <li key={contact.type} className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center border border-zinc-700">
                                            <IconComponent className="text-white text-sm" />
                                        </div>
                                        <span className="text-white text-sm">{contact.value}</span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>

                {/* Bottom section */}
                <div className="border-t border-zinc-800 pt-6">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <div className="text-white text-sm">
                            © {currentYear} <span className="text-white font-semibold">Finance & Investment Club, Miranda House</span>. 
                            All rights reserved.
                        </div>
                        
                        <div className="flex items-center space-x-6 text-sm text-white">
                            <a href="#" className="hover:text-white transition-colors duration-300 hover:scale-105">
                                Privacy Policy
                            </a>
                            <a href="#" className="hover:text-white transition-colors duration-300 hover:scale-105">
                                Terms of Service
                            </a>
                            <a href="#" className="hover:text-white transition-colors duration-300 hover:scale-105">
                                Code of Conduct
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Subtle accent line */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-600 to-transparent"></div>
        </footer>
    );
};

export default Footer;