'use client';

import React from 'react';
import { Lightbulb, Globe, Users, Linkedin, Zap, Share2, Cpu, Bot, Radio, Code, Signal, Computer } from 'lucide-react';
import { motion } from 'framer-motion';

// Gallery Data
const eventGallery = [
    { id: 1, imageSrc: '/gallery/New You, New AI workshop by ieee ias/1759774521333.jpg', eventName: 'New You, New AI Workshop' },
    { id: 2, imageSrc: '/gallery/NVIDIA Deep Learning workshop by ieee cis and ieee sb/1753177229171.jpg', eventName: 'NVIDIA Deep Learning Workshop' },
    { id: 3, imageSrc: '/gallery/Public speaking by ieee sb and debsoc club of pdeu/1761884287452.jpg', eventName: 'Public Speaking Session' },
    { id: 4, imageSrc: '/gallery/RF Systems and Antenna Design Workshop by ieee aps and ieee sb pdeu/1754367118783.jpg', eventName: 'RF Systems & Antenna Design' },
    { id: 5, imageSrc: '/gallery/Road Safety ideathon by ieee its , ieee gs and ieee sb pdeu/1759134009881.jpg', eventName: 'Road Safety Ideathon' },
    { id: 6, imageSrc: '/gallery/ROS workshop by ieee ras and ieee sb/1760647632350.jpg', eventName: 'ROS Workshop' },
    { id: 7, imageSrc: '/gallery/STMania by ieee ias pdeu sbc with ieee sb pdeu and ieeegs/1756662363739.jpg', eventName: 'STMania' },
    { id: 8, imageSrc: '/gallery/engineering essentials workshop by ieee cs pdeu and ieee sb pdeu/1755837685392.jpg', eventName: 'Engineering Essentials Workshop' },
    { id: 9, imageSrc: '/gallery/IEEE Onboard 2025/1755181808683.jpg', eventName: 'IEEE Onboard 2025' },
    { id: 10, imageSrc: '/gallery/ieee sps brain computer interfaces with ieee sb/1743186145270.jpg', eventName: 'Brain Computer Interfaces' },
    { id: 11, imageSrc: '/gallery/MATLAB Innovation challenge by ieee gs, ieee sps pdeu, ieee wie pdeu and ieee sb pdeu/1740308103636.jpg', eventName: 'MATLAB Workshop' },
];

export default function AboutPage() {
    // Gallery Logic
    const midPoint = Math.ceil(eventGallery.length / 2);
    const firstHalf = eventGallery.slice(0, midPoint);
    const secondHalf = eventGallery.slice(midPoint);
    const row1Gallery = [...firstHalf, ...firstHalf];
    const row2Gallery = [...secondHalf, ...secondHalf];

    const chapters = [
        { name: "Computer Society (CS)", logo: "/gallery/IEEE LOGOs/IEEE CS.png", desc: "Focusing on computing technology and information processing." },
        { name: "Robotics & Automation (RAS)", logo: "/gallery/IEEE LOGOs/IEEE RAS.png", desc: "Advancing robotics and automation technologies." },
        { name: "Antennas & Propagation (APS)", logo: "/gallery/IEEE LOGOs/IEEE APS.png", desc: "Exploring RF, microwave, and wireless technologies." },
        { name: "Industry Applications (IAS)", logo: "/gallery/IEEE LOGOs/IEEE IAS.png", desc: "Bridging the gap between theory and industrial practice." },
        { name: "Women in Engineering (WIE)", logo: "/gallery/IEEE LOGOs/IEEE WIE.png", desc: "Empowering women in technology and engineering fields." },
        { name: "Signal Processing (SPS)", logo: "/gallery/IEEE LOGOs/IEEE SPS.png", desc: "Converting Signals to Information." },
        { name: "Computer Intelligence (CIS)", logo: "/gallery/IEEE LOGOs/IEEE CIS.png", desc: "Building Digital Brains" },
    ];

    return (
        <div className="font-sans text-gray-800">

            {/* A. Hero Section */}
            <section className="relative bg-gray-50 py-20 px-4 md:py-32 overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-[#002855] mb-6">
                        About IEEE PDEU Student Branch
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
                        Empowering Future Innovators through Technology and Community.
                    </p>
                </div>
            </section>

            {/* B. Who We Are */}
            <section className="py-16 md:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="border-l-4 border-[#00629B] pl-6 md:pl-10">
                            <h2 className="text-3xl font-bold text-[#002855] mb-6">Who We Are</h2>
                            <p className="text-lg text-gray-600 leading-relaxed mb-6">
                                The IEEE Student Branch at PDEU is a vibrant technical community where students connect, share ideas, and grow together. We serve as a catalyst for professional development and collaborative innovation.
                            </p>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                Our goal is to provide a platform for students to explore their technical interests, gain leadership experience, and network with professionals.
                            </p>
                        </div>
                        <div className="relative h-64 md:h-96 bg-gray-100 rounded-xl overflow-hidden shadow-lg">
                            <img src="/gallery/IEEE LOGOs/ieee.png" alt="IEEE Team" className="object-cover w-full h-full" />
                        </div>
                    </div>
                </div>
            </section>

            {/* C. Mission & Capabilities (Chapters) */}
            <section className="py-16 bg-blue-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-[#002855] mb-4">Our Technical Chapters</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Specialized communities focusing on key areas of technology.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
                        {chapters.map((chapter, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow flex items-start space-x-4">
                                <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center bg-gray-50 rounded-lg p-2">
                                    <img
                                        src={chapter.logo}
                                        alt={`${chapter.name} Logo`}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-ieee-navy mb-2">{chapter.name}</h3>
                                    <p className="text-gray-600 text-sm">{chapter.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* D. Gallery Section (Integrated) */}
            <section className="py-20 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#002855]">
                        Gallery
                    </h2>
                    <p className="mt-4 text-lg text-gray-600">
                        A glimpse into the vibrant events and milestones of our Student Branch.
                    </p>
                </div>

                <div className="space-y-8">
                    {/* Row 1 */}
                    <div className="relative w-full flex overflow-hidden">
                        <motion.div
                            className="flex gap-4 sm:gap-6 whitespace-nowrap"
                            animate={{ x: [0, '-50%'] }}
                            transition={{
                                x: { repeat: Infinity, repeatType: "loop", duration: 40, ease: "linear" },
                            }}
                            style={{ width: "200%" }}
                        >
                            {row1Gallery.map((event, index) => (
                                <EventCard key={`row1-${event.id}-${index}`} event={event} />
                            ))}
                        </motion.div>
                    </div>

                    {/* Row 2 */}
                    <div className="relative w-full flex overflow-hidden">
                        <motion.div
                            className="flex gap-4 sm:gap-6 whitespace-nowrap"
                            animate={{ x: ['-50%', 0] }}
                            transition={{
                                x: { repeat: Infinity, repeatType: "loop", duration: 45, ease: "linear" },
                            }}
                            style={{ width: "200%" }}
                        >
                            {row2Gallery.map((event, index) => (
                                <EventCard key={`row2-${event.id}-${index}`} event={event} />
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* E. CTA */}
            <section className="bg-[#002855] py-16">
                <div className="max-w-5xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-8">
                        Connect with us to start your journey.
                    </h2>
                    <a
                        href="https://www.linkedin.com/company/ieee-pdeu-sb/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center bg-white text-blue-700 hover:bg-gray-100 font-bold py-3 px-8 rounded-full transition-colors shadow-lg"
                    >
                        Connect on LinkedIn <Linkedin className="ml-2 w-5 h-5" />
                    </a>
                </div>
            </section>
        </div>
    );
}

// Sub-component for Gallery Card
function EventCard({ event }: { event: { id: number, imageSrc: string, eventName: string } }) {
    return (
        <div className="relative flex-none w-[20rem] h-40 sm:w-[28rem] sm:h-64 rounded-xl overflow-hidden shadow-md group cursor-pointer bg-gray-200">
            <img
                src={event.imageSrc}
                alt={event.eventName}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
                onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.innerText = event.eventName;
                }}
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <h3 className="text-white font-bold text-xl px-4 text-center">
                    {event.eventName}
                </h3>
            </div>
        </div>
    );
}
