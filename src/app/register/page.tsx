'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { User, Mail, Phone, School, Hash, CreditCard, Calendar, Clock, Lock } from 'lucide-react';

interface RegisterFormData {
    name: string;
    email: string;
    phone: string;
    university: string;
    department: string;
    year: string;
    morningEvent: string;   // Column H
    afternoonEvent: string; // Column I
    transactionId: string;  // Column K
    ieeeMembershipNumber?: string; // Column L
}

export default function Register() {
    const router = useRouter();
    const [formData, setFormData] = useState<RegisterFormData>({
        name: '',
        email: '',
        phone: '',
        university: '',
        department: '',
        year: '1st Year',
        morningEvent: '',
        afternoonEvent: '',
        transactionId: '',
        ieeeMembershipNumber: ''
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Morning Session: Expert Talks
    const morningEvents = [
        "Expert Talk: Semiconductors & HW Acceleration (CS)",
        "Expert Talk: Prof. Harish PM (IIT-GN) (RAS)",
        "Expert Talk: Advancements in Antenna Tech (APS)",
        "Expert Talk: Industry 4.0 Applications (IAS)",
        "Panel Discussion: Interactive Experts Panel (WIE)"
    ];

    // Afternoon Session: Workshops & Competitions
    const afternoonEvents = [
        "Workshop: FPGA & Machine Learning Integration (CS)",
        "Workshop: MuJoCo: Advanced Robotics Sim (RAS)",
        "Workshop: Keysight ADS Simulation (APS)",
        "Workshop: MOSFET-based Gate Driver Design (IAS)",
        "Review Paper Hackathon (WIE)",
        "Poster Presentation"
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setErrorMessage(null);

        try {
            // Map data to backend expected format
            // H: morningEvent -> theme
            // I: afternoonEvent -> participationType

            const payload = {
                ...formData,
                theme: formData.morningEvent,           // Maps to Column H
                participationType: formData.afternoonEvent, // Maps to Column I
                github: '',                             // Column S (Empty as field is removed)
            };

            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            setMessage('Registration successful! Redirecting to login...');
            setTimeout(() => router.push('/login'), 2000);
        } catch (error: any) {
            setErrorMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-3xl mx-auto"
                >
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                        <div className="bg-ieee-blue px-8 py-8 text-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-[url('/grid-pattern.png')] opacity-10"></div>
                            <h2 className="text-3xl font-bold text-white relative z-10">Event Registration</h2>
                            <p className="text-blue-100 mt-2 relative z-10">Secure your spot for Sampark 2026</p>
                        </div>

                        <form onSubmit={handleSubmit} className="px-8 py-10 space-y-8">
                            {/* Personal Details */}
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
                                    <User size={20} className="text-ieee-blue" /> Personal Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 text-gray-400" size={18} />
                                            <input
                                                type="text"
                                                name="name"
                                                required
                                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                placeholder="John Doe"
                                                value={formData.name}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                                            <input
                                                type="email"
                                                name="email"
                                                required
                                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                placeholder="john@example.com"
                                                value={formData.email}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Phone Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
                                            <input
                                                type="tel"
                                                name="phone"
                                                required
                                                pattern="[0-9]{10}"
                                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                placeholder="9876543210"
                                                value={formData.phone}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Year of Study</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
                                            <select
                                                name="year"
                                                required
                                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                                                value={formData.year}
                                                onChange={handleChange}
                                            >
                                                <option>1st Year</option>
                                                <option>2nd Year</option>
                                                <option>3rd Year</option>
                                                <option>4th Year</option>
                                                <option>Masters/PhD</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Academic Details */}
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
                                    <School size={20} className="text-ieee-blue" /> Academic Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">University/College</label>
                                        <input
                                            type="text"
                                            name="university"
                                            required
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                            placeholder="PDEU"
                                            value={formData.university}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Department</label>
                                        <input
                                            type="text"
                                            name="department"
                                            required
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                            placeholder="ICT / Computer Science"
                                            value={formData.department}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Session Selection (Dual Session Event) */}
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
                                    <Clock size={20} className="text-ieee-blue" /> Session Selection
                                </h3>

                                {/* Morning Session */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 block">Morning Session (Expert Talks) (9:00 AM - 12:00 PM) <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-3 text-ieee-blue pointer-events-none">
                                            <span className="font-bold text-xs">AM</span>
                                        </div>
                                        <select
                                            name="morningEvent"
                                            required
                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                                            value={formData.morningEvent}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select Morning Event...</option>
                                            {morningEvents.map((event, idx) => (
                                                <option key={idx} value={event}>{event}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Afternoon Session */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 block">Afternoon Session (Workshops) (2:00 PM - 5:00 PM) <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-3 text-ieee-blue pointer-events-none">
                                            <span className="font-bold text-xs">PM</span>
                                        </div>
                                        <select
                                            name="afternoonEvent"
                                            required
                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                                            value={formData.afternoonEvent}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select Afternoon Event...</option>
                                            {afternoonEvents.map((event, idx) => (
                                                <option key={idx} value={event}>{event}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Required Info */}
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
                                    <CreditCard size={20} className="text-ieee-blue" /> Payment & Verification
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Transaction ID / Reference Number <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <CreditCard className="absolute left-3 top-3 text-gray-400" size={18} />
                                            <input
                                                type="text"
                                                name="transactionId"
                                                required
                                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                placeholder="Enter ID from payment receipt"
                                                value={formData.transactionId}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">IEEE Membership Number (Optional)</label>
                                        <div className="relative">
                                            <Hash className="absolute left-3 top-3 text-gray-400" size={18} />
                                            <input
                                                type="text"
                                                name="ieeeMembershipNumber"
                                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                placeholder="Enter your 8-digit IEEE ID"
                                                value={formData.ieeeMembershipNumber}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Status Messages */}
                            {errorMessage && (
                                <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm font-medium animate-pulse border border-red-100">
                                    {errorMessage}
                                </div>
                            )}
                            {message && (
                                <div className="p-4 bg-green-50 text-green-600 rounded-lg text-sm font-medium border border-green-100">
                                    {message}
                                </div>
                            )}

                            {/* Submit Button */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={loading}
                                className={`w-full py-4 rounded-xl font-bold text-white text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 ${loading
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-ieee-blue hover:bg-blue-700'
                                    }`}
                            >
                                {loading ? (
                                    <>Processing...</>
                                ) : (
                                    <>Complete Registration <Lock size={20} /></>
                                )}
                            </motion.button>

                            <p className="text-center text-sm text-gray-500">
                                Already registered? <a href="/login" className="text-ieee-blue font-semibold hover:underline">Log in here</a>
                            </p>
                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
