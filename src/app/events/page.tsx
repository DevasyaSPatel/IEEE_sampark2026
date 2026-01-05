'use client';

import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { Calendar, Cpu, Radio, Zap, Activity, Users, Lightbulb, Bot } from 'lucide-react';
import Link from 'next/link';
import ConferenceItinerary from '@/components/ConferenceItinerary';
import { useExternalLinks } from '@/hooks/useExternalLinks';

export default function EventsPage() {
    const { links } = useExternalLinks();
    const chapters = [
        {
            title: "SB & Computer Society",
            icon: <Cpu size={32} className="text-white" />,
            color: "bg-blue-600",
            lightColor: "bg-blue-50",
            events: [
                { type: "Expert Talk", title: "Semiconductors & Hardware Acceleration" },
                { type: "Workshop", title: "FPGA & ML Integration" }
            ]
        },
        {
            title: "RAS (Robotics & Automation)",
            icon: <Bot size={32} className="text-white" />,
            color: "bg-orange-500",
            lightColor: "bg-orange-50",
            events: [
                { type: "Expert Talk", title: "Prof. Harish PM (IIT-GN)" },
                { type: "Workshop", title: "MuJoCo & Inverse Kinematics" }
            ]
        },
        {
            title: "APS (Antennas & Propagation)",
            icon: <Radio size={32} className="text-white" />,
            color: "bg-emerald-600",
            lightColor: "bg-emerald-50",
            events: [
                { type: "Expert Talk", title: "Advancements in Antenna Tech" },
                { type: "Workshop", title: "Keysight ADS Simulation" } // Inferred title based on Keysight ADS
            ]
        },
        {
            title: "IAS (Industry Applications)",
            icon: <Zap size={32} className="text-white" />,
            color: "bg-amber-500",
            lightColor: "bg-amber-50",
            events: [
                { type: "Expert Talk", title: "Industry 4.0 Applications" },
                { type: "Workshop", title: "MOSFET-based Gate Driver Design" }
            ]
        },
        {
            title: "WIE (Women in Engineering)",
            icon: <Users size={32} className="text-white" />,
            color: "bg-purple-600",
            lightColor: "bg-purple-50",
            events: [
                { type: "Competition", title: "Two-stage Hackathon" },

            ]
        },
        {
            title: "SCET Student Branch",
            icon: <Lightbulb size={32} className="text-white" />,
            color: "bg-red-600",
            lightColor: "bg-emerald-50",
            events: [
                { type: "DSC 3.0", title: "DSC 3.0 by SCET Student Branch" },
            ]
        }
    ];

    const posterThemes = [
        "On-Device Intelligence",
        "RF/Microwave/Wireless",
        "Energy Management",
        "Applied AI",
        "Robotics for Social Good"
    ];

    const nonTechThemes = [
        "SB best practices overview",
        "SB future planned events",
        "SB past well-executed events"
    ];

    return (
        <div className="min-h-screen bg-white font-sans text-ieee-navy">
            <Navbar />

            <main className="pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold mb-4"
                    >
                        SAMPARK <span className="text-ieee-blue">2026</span> Schedule
                    </motion.h1>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                        Explore the cutting-edge workshops, expert talks, and competitions organized by our specialized chapters.
                    </p>
                </div>

                {/* Conference Itinerary */}
                <ConferenceItinerary />

                {/* Poster Presentation Highlight Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="mb-20 bg-gradient-to-br from-ieee-blue to-blue-900 rounded-2xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden"
                >
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full md:-mr-16 md:-mt-16 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500 opacity-20 rounded-full blur-2xl"></div>

                    <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 bg-blue-500/30 px-3 py-1 rounded-full text-sm font-semibold mb-4 border border-blue-400/30">
                                <Lightbulb size={16} /> Featured Competition
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                                Poster Presentation
                            </h2>
                            <p className="text-blue-100 text-lg mb-8 leading-relaxed">
                                Showcase your research and innovative ideas on a big platform.
                                Join us to present your work across five diverse themes impacting the future of technology.
                            </p>
                            <button
                                onClick={() => window.open(links?.REGISTRATION_FORM || '#', '_blank')}
                                className="inline-block bg-white text-ieee-blue font-bold px-8 py-3 rounded-full hover:bg-blue-50 transition-colors shadow-md"
                            >
                                Register to Present
                            </button>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                            <h3 className="text-xl font-bold mb-4 border-b border-white/20 pb-3">Technical Themes</h3>
                            <ul className="space-y-3">
                                {posterThemes.map((theme, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-300 shrink-0"></div>
                                        <span className="text-blue-50 font-medium">{theme}</span>
                                    </li>
                                ))}
                            </ul>
                            <h3 className="text-xl font-bold mb-4 border-b border-white/20 py-5 pb-3">Non-Technical Themes</h3>
                            <ul className="space-y-3">
                                {nonTechThemes.map((theme, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-300 shrink-0"></div>
                                        <span className="text-blue-50 font-medium">{theme}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </motion.div>

                {/* Chapter Events Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {chapters.map((chapter, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + (idx * 0.1) }}
                            className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden group"
                        >
                            {/* Card Header */}
                            <div className={`${chapter.color} p-6 flex items-center gap-4`}>
                                <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                                    {chapter.icon}
                                </div>
                                <h3 className="text-white font-bold text-lg leading-tight">
                                    {chapter.title}
                                </h3>
                            </div>

                            {/* Card Content */}
                            <div className="p-6 flex-1 flex flex-col justify-between bg-white">
                                <div className="space-y-6">
                                    {chapter.events.map((event, eIdx) => (
                                        <div key={eIdx} className="relative pl-4 border-l-2 border-gray-100">
                                            <span className="text-xs font-bold uppercase text-gray-400 tracking-wider block mb-1">
                                                {event.type}
                                            </span>
                                            <p className="font-semibold text-gray-800 text-lg leading-snug">
                                                {event.title}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-8 pt-4 border-t border-gray-50">
                                    <button
                                        onClick={() => window.open(links?.REGISTRATION_FORM || '#', '_blank')}
                                        className="text-sm font-bold text-ieee-blue hover:text-blue-800 flex items-center gap-1 group-hover:gap-2 transition-all"
                                    >
                                        View Details & Register <span aria-hidden="true">&rarr;</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </main>
        </div>
    );
}
