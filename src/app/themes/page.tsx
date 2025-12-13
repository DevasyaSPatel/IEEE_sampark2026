'use client';

import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { Bot, Link as LinkIcon, Wifi, Shield, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ThemesPage() {
    const themes = [
        {
            title: "AI Agents & Automation",
            icon: <Bot size={48} className="text-ieee-blue" />,
            description: "Building intelligent autonomous systems that can perceive, reason, and act.",
            color: "bg-blue-50"
        },
        {
            title: "Blockchain & Web3",
            icon: <LinkIcon size={48} className="text-ieee-blue" />,
            description: "Decentralized trust, smart contracts, and the future of the ownership economy.",
            color: "bg-indigo-50"
        },
        {
            title: "IoT & Smart Systems",
            icon: <Wifi size={48} className="text-ieee-blue" />,
            description: "Connecting the physical and digital worlds through sensors and smart networks.",
            color: "bg-cyan-50"
        },
        {
            title: "Cybersecurity",
            icon: <Shield size={48} className="text-ieee-blue" />,
            description: "Defending the digital frontier and ensuring privacy in an interconnected world.",
            color: "bg-slate-50"
        }
    ];

    return (
        <div className="min-h-screen bg-white font-sans">
            <Navbar />

            <main className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold text-ieee-navy mb-6"
                    >
                        Innovation Tracks <span className="text-ieee-blue">2026</span>
                    </motion.h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Choose your area of expertise and compete in our specialized domains to solve real-world challenges.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    {themes.map((theme, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className={`${theme.color} rounded-2xl p-8 md:p-10 border border-gray-100 hover:shadow-xl transition-all group`}
                        >
                            <div className="bg-white w-20 h-20 rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform duration-300">
                                {theme.icon}
                            </div>
                            <h3 className="text-2xl font-bold text-ieee-navy mb-4">{theme.title}</h3>
                            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                                {theme.description}
                            </p>
                            <Link
                                href="/register"
                                className="inline-flex items-center gap-2 text-ieee-blue font-bold hover:gap-3 transition-all"
                            >
                                Register for this Track <ArrowRight size={20} />
                            </Link>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-20 text-center bg-ieee-navy rounded-3xl p-10 md:p-16 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold mb-6">Ready to Showcase Your Skills?</h2>
                        <p className="text-blue-100 mb-8 max-w-2xl mx-auto text-lg">
                            Join hundreds of other innovators and make your mark at Sampark 2026.
                        </p>
                        <Link
                            href="/register"
                            className="bg-white text-ieee-navy px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors inline-block shadow-lg"
                        >
                            Register Now
                        </Link>
                    </div>
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-ieee-blue opacity-20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600 opacity-20 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
                </div>
            </main>
        </div>
    );
}
