'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MapPin, ChevronDown, ChevronUp } from 'lucide-react';

interface ScheduleEntry {
    time: string;
    activity: string;
    description?: string;
    type: 'ceremony' | 'technical' | 'meeting' | 'break' | 'competition' | 'social';
    location?: string;
}

const scheduleData: ScheduleEntry[] = [
    { time: "08:00 AM - 09:00 AM", activity: "Registration and Breakfast", type: "break" },
    { time: "09:15 AM", activity: "Start Inauguration", type: "ceremony" },
    { time: "09:15 AM - 09:45 AM", activity: "Award Distribution", type: "ceremony" },
    { time: "09:45 AM - 10:15 AM", activity: "Keynote Address", type: "ceremony" },
    { time: "10:15 AM - 10:25 AM", activity: "Address: Membership Benefits (Gujarat Section Excom)", type: "ceremony" },
    { time: "10:25 AM - 10:30 AM", activity: "Address: Event Venues & Goals of Sampark", type: "ceremony" },
    { time: "10:30 AM - 12:30 PM", activity: "Chapter-wise Events & Talks - Session 1", type: "technical", description: "Parallel Sessions across venues" },
    { time: "10:30 AM - 12:30 PM", activity: "Excom Meeting with Student Branch (SB)", type: "meeting", description: "Closed Door Session" },
    { time: "12:30 PM - 01:30 PM", activity: "Lunch", type: "break" },
    { time: "01:30 PM - 03:30 PM", activity: "Chapter-wise Events & Talks - Session 2", type: "technical", description: "Parallel Workshops" },
    { time: "01:30 PM - 03:30 PM", activity: "Excom Meeting with Chapters", type: "meeting" },
    { time: "03:00 PM", activity: "Poster & Hackathon Preparation Begin", type: "competition" },
    { time: "03:30 PM", activity: "Hackathon & Poster Evaluation Begin", type: "competition" },
    { time: "03:30 PM - 05:00 PM", activity: "Interactive Group Discussion / Networking", type: "social" },
    { time: "05:00 PM - 05:45 PM", activity: "Jamming Session", type: "social" },
    { time: "05:45 PM Onwards", activity: "Winners Announcement & Closing Ceremony", type: "ceremony" }
];

const getTypeStyles = (type: string) => {
    switch (type) {
        case 'ceremony': return 'bg-purple-100 text-purple-800 border-purple-200';
        case 'technical': return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'meeting': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
        case 'competition': return 'bg-red-100 text-red-800 border-red-200';
        case 'social': return 'bg-green-100 text-green-800 border-green-200';
        case 'break': return 'bg-gray-100 text-gray-700 border-gray-200';
        default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
};

export default function ConferenceItinerary() {
    const [isExpanded, setIsExpanded] = useState(false);

    // Group items by time to handle concurrent events
    const groupedSchedule = scheduleData.reduce((acc, current) => {
        const lastGroup = acc[acc.length - 1];
        if (lastGroup && lastGroup[0].time === current.time) {
            lastGroup.push(current);
        } else {
            acc.push([current]);
        }
        return acc;
    }, [] as ScheduleEntry[][]);

    const visibleGroups = isExpanded ? groupedSchedule : groupedSchedule.slice(0, 5); // Show first 5 blocks initially

    return (
        <section className="py-12 md:py-16 max-w-5xl mx-auto">
            <div className="text-center mb-12">
                <span className="bg-ieee-blue/10 text-ieee-blue font-bold px-4 py-1.5 rounded-full text-sm uppercase tracking-wider mb-4 inline-block">
                    Timeline
                </span>
                <h2 className="text-3xl font-bold text-ieee-navy">Conference Itinerary</h2>
                <p className="text-gray-500 mt-2">January 11th, 2026</p>
            </div>

            <div className="relative">
                {/* Timeline Spine */}
                <div className="absolute left-8 md:left-48 top-4 bottom-4 w-0.5 bg-gray-200"></div>

                <div className="space-y-8 relative">
                    <AnimatePresence>
                        {visibleGroups.map((group, groupIndex) => (
                            <motion.div
                                key={group[0].time + groupIndex}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, height: 0 }}
                                className="relative flex flex-col md:flex-row gap-4 md:gap-12 group"
                            >
                                {/* Time Column */}
                                <div className="md:w-48 flex-shrink-0 md:text-right pl-16 md:pl-0 relative">
                                    {/* Dot Indicator */}
                                    <div className="absolute left-6 md:left-[11.85rem] top-1.5 w-4 h-4 rounded-full bg-white border-4 border-ieee-blue z-10 group-hover:scale-110 transition-transform"></div>

                                    <span className="inline-flex items-center gap-2 font-bold text-ieee-navy text-lg bg-white pr-2">
                                        <Clock size={16} className="text-ieee-blue/80" />
                                        {group[0].time.split('-')[0]} {/* Show start time primarily if range */}
                                    </span>
                                    <div className="text-xs text-gray-400 font-medium mt-1 pr-2 hidden md:block">
                                        {group[0].time}
                                    </div>
                                    <div className="text-xs text-gray-400 font-medium pl-14 md:hidden block -mt-1 mb-2">
                                        {group[0].time}
                                    </div>
                                </div>

                                {/* Content Column */}
                                <div className={`flex-1 ${group.length > 1 ? 'grid md:grid-cols-2 gap-4' : ''}`}>
                                    {group.map((entry, idx) => (
                                        <div
                                            key={idx}
                                            className="bg-white rounded-lg border shadow-sm p-5 hover:shadow-md transition-shadow relative"
                                        >
                                            <span className={`absolute top-4 right-4 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide border ${getTypeStyles(entry.type)}`}>
                                                {entry.type}
                                            </span>

                                            <h3 className="font-bold text-gray-800 pr-16">{entry.activity}</h3>

                                            {entry.description && (
                                                <p className="text-sm text-gray-500 mt-2">{entry.description}</p>
                                            )}

                                            {entry.location && (
                                                <div className="flex items-center gap-1 text-xs text-gray-400 mt-3">
                                                    <MapPin size={12} />
                                                    {entry.location}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Collapsible Toggle */}
                <div className="mt-12 text-center relative z-20">
                    <div className="absolute left-8 md:left-48 top-0 -bottom-12 w-0.5 bg-gradient-to-b from-gray-200 to-transparent"></div>
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="bg-white border text-ieee-blue hover:bg-blue-50 font-semibold px-6 py-2.5 rounded-full shadow-lg transition-all inline-flex items-center gap-2 z-10 relative"
                    >
                        {isExpanded ? (
                            <>Show Less <ChevronUp size={16} /></>
                        ) : (
                            <>View Full Day Itinerary <ChevronDown size={16} /></>
                        )}
                    </button>
                </div>
            </div>
        </section>
    );
}
