import { useState } from 'react';

const ContactPage = () => {
    const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

    const contactInfo = {
        general: {
            title: "General Inquiries",
            email: "finance.club@mirandahouse.ac.in",
            description: "For general questions, membership information, and club activities",
            icon: "💬"
        },
        collaborations: {
            title: "Collaborations",
            email: "marketingficmh@gmail.com",
            description: "For partnerships, joint events, and collaborative initiatives",
            icon: "🤝"
        },
        sponsorships: {
            title: "Sponsorships",
            email: "sponsorship.ficmirandahouse@gmail.com",
            description: "For sponsorship opportunities and brand partnerships",
            icon: "💼"
        }
    };

    const handleEmailClick = (email: string) => {
        window.location.href = `mailto:${email}`;
    };

    const handleCopyEmail = async (email: string) => {
        try {
            await navigator.clipboard.writeText(email);
            setCopiedEmail(email);
            setTimeout(() => setCopiedEmail(null), 2000);
        } catch (err) {
            console.error('Failed to copy email: ', err);
        }
    };

    return (
        <section className="min-h-screen bg-black py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section - Consistent with About Page */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-bold italic text-white mb-6 tracking-tight">
                        Contact Us
                    </h1>
                    <div className="w-24 h-1 bg-cyan-400 mx-auto mb-8"></div>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        Get in touch with FICMH. We're here to answer your questions, explore collaborations, 
                        and create impactful financial education initiatives together.
                    </p>
                </div>

                {/* Main Content Grid - Consistent 3-column layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
                    {/* General Inquiries Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-gradient-to-br from-zinc-900 to-black p-8 rounded-2xl border border-cyan-400/20 h-full transform hover:scale-[1.02] transition-all duration-300">
                            <div className="flex items-center mb-6">
                                <div className="w-12 h-12 bg-transparent rounded-lg flex items-center justify-center mr-4">
                                    <span className="text-2xl">💬</span>
                                </div>
                                <h2 className="text-3xl font-bold text-white">General</h2>
                            </div>
                            <p className="text-gray-300 leading-relaxed text-lg mb-6">
                                For general questions, membership information, and club activities. Reach out for 
                                any inquiries about our events, or membership process.
                            </p>
                            <div className="space-y-3">
                                <button
                                    onClick={() => handleEmailClick(contactInfo.general.email)}
                                    className="w-full bg-cyan-400/10 text-cyan-400 py-3 rounded-xl border border-cyan-400/30 hover:bg-cyan-400/20 hover:border-cyan-400/50 transition-all duration-300 font-medium"
                                >
                                    Send Email
                                </button>
                                <button
                                    onClick={() => handleCopyEmail(contactInfo.general.email)}
                                    className="w-full text-gray-400 hover:text-cyan-400 transition-colors duration-300 text-sm font-medium"
                                >
                                    {contactInfo.general.email}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Collaborations Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-gradient-to-br from-zinc-900 to-black p-8 rounded-2xl border border-blue-400/20 h-full transform hover:scale-[1.02] transition-all duration-300">
                            <div className="flex items-center mb-6">
                                <div className="w-12 h-12 bg-transparent rounded-lg flex items-center justify-center mr-4">
                                    <span className="text-2xl">🤝</span>
                                </div>
                                <h2 className="text-3xl font-bold text-white">Collaborations</h2>
                            </div>
                            <p className="text-gray-300 leading-relaxed text-lg mb-6">
                                Interested in partnering with us? We welcome collaborations with other clubs, 
                                organizations, and institutions for joint events and innovative initiatives.
                            </p>
                            <div className="space-y-3">
                                <button
                                    onClick={() => handleEmailClick(contactInfo.collaborations.email)}
                                    className="w-full bg-blue-400/10 text-blue-400 py-3 rounded-xl border border-blue-400/30 hover:bg-blue-400/20 hover:border-blue-400/50 transition-all duration-300 font-medium"
                                >
                                    Send Email
                                </button>
                                <button
                                    onClick={() => handleCopyEmail(contactInfo.collaborations.email)}
                                    className="w-full text-gray-400 hover:text-blue-400 transition-colors duration-300 text-sm font-medium"
                                >
                                    {contactInfo.collaborations.email}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Sponsorships Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-gradient-to-br from-zinc-900 to-black p-8 rounded-2xl border border-purple-400/20 h-full transform hover:scale-[1.02] transition-all duration-300">
                            <div className="flex items-center mb-6">
                                <div className="w-12 h-12 bg-transparent rounded-lg flex items-center justify-center mr-4">
                                    <span className="text-2xl">💼</span>
                                </div>
                                <h2 className="text-3xl font-bold text-white">Sponsorships</h2>
                            </div>
                            <p className="text-gray-300 leading-relaxed text-lg mb-6">
                                Explore sponsorship opportunities with FICMH. Partner with us to reach engaged 
                                students and support financial literacy initiatives across campus.
                            </p>
                            <div className="space-y-3">
                                <button
                                    onClick={() => handleEmailClick(contactInfo.sponsorships.email)}
                                    className="w-full bg-purple-400/10 text-purple-400 py-3 rounded-xl border border-purple-400/30 hover:bg-purple-400/20 hover:border-purple-400/50 transition-all duration-300 font-medium"
                                >
                                    Send Email
                                </button>
                                <button
                                    onClick={() => handleCopyEmail(contactInfo.sponsorships.email)}
                                    className="w-full text-gray-400 hover:text-purple-400 transition-colors duration-300 text-sm font-medium"
                                >
                                    {contactInfo.sponsorships.email}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Methods Section - Consistent with Departments Section */}
                <div className="mb-16">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-white mb-4">Contact Methods</h2>
                        <div className="w-20 h-1 bg-cyan-400 mx-auto"></div>
                        <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
                            Multiple ways to reach out to our dedicated teams
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* General Contact */}
                        <div className="group bg-zinc-900/50 p-6 rounded-xl border border-gray-700 hover:border-cyan-400/30 transition-all duration-300">
                            <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">💬</div>
                            <h3 className="text-xl font-bold text-white mb-3">General Inquiries</h3>
                            <p className="text-gray-300 text-sm leading-relaxed mb-4">
                                For membership, events, and general club information. Your first point of contact for all things FICMH.
                            </p>
                            <button
                                onClick={() => handleEmailClick(contactInfo.general.email)}
                                className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors duration-300"
                            >
                                {contactInfo.general.email}
                            </button>
                        </div>

                        {/* Collaborations Contact */}
                        <div className="group bg-zinc-900/50 p-6 rounded-xl border border-gray-700 hover:border-blue-400/30 transition-all duration-300">
                            <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">🤝</div>
                            <h3 className="text-xl font-bold text-white mb-3">Collaborations</h3>
                            <p className="text-gray-300 text-sm leading-relaxed mb-4">
                                Partner with us for joint events, workshops, and innovative financial education initiatives.
                            </p>
                            <button
                                onClick={() => handleEmailClick(contactInfo.collaborations.email)}
                                className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors duration-300"
                            >
                                {contactInfo.collaborations.email}
                            </button>
                        </div>

                        {/* Sponsorships Contact */}
                        <div className="group bg-zinc-950 p-6 rounded-xl border border-gray-700 hover:border-purple-400/30 transition-all duration-300">
                            <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">💼</div>
                            <h3 className="text-xl font-bold text-white mb-3">Sponsorships</h3>
                            <p className="text-gray-300 text-sm leading-relaxed mb-4">
                                Support our mission and reach engaged students through sponsorship opportunities and brand partnerships.
                            </p>
                            <button
                                onClick={() => handleEmailClick(contactInfo.sponsorships.email)}
                                className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors duration-300"
                            >
                                {contactInfo.sponsorships.email}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Response Stats Section - Consistent with Stats Section */}
                <div className="bg-black rounded-2xl p-8 border border-cyan-400/20">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-3xl font-bold text-white mb-2">24-48h</div>
                            <div className="text-gray-400 text-sm">Response Time</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-white mb-2">100%</div>
                            <div className="text-gray-400 text-sm">Response Rate</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-white mb-2">3</div>
                            <div className="text-gray-400 text-sm">Contact Channels</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-white mb-2">7 Days</div>
                            <div className="text-gray-400 text-sm">Follow-up Guarantee</div>
                        </div>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="text-center mt-12">
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        We typically respond to all inquiries within 24-48 hours. For urgent matters, 
                        please mention "URGENT" in your email subject line.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default ContactPage;