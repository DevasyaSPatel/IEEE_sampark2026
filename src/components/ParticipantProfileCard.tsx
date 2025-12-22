import React from 'react';
import { useRouter } from 'next/navigation';
import { UserPlus, Clock, Check, Calendar, Star, Hash, BookOpen, GraduationCap } from 'lucide-react';

type ConnectionStatus = 'None' | 'Pending' | 'Accepted';

interface ParticipantProfileCardProps {
    user: {
        id: string;
        name: string;
        selectedEvent: string;
        connections: number;
        bio?: string;
        linkedin?: string;
        instagram?: string;
        github?: string;
        posterTheme?: string;
        isPosterPresenting?: string;
        year?: string;
        department?: string;
        university?: string;
    };
    isLoggedIn: boolean;
    connectionStatus: ConnectionStatus;
    isLoading?: boolean;
    onConnect: () => void;
}

const ParticipantProfileCard: React.FC<ParticipantProfileCardProps> = ({
    user,
    isLoggedIn,
    connectionStatus,
    isLoading = false,
    onConnect,
}) => {
    const router = useRouter();

    const handleMainAction = () => {
        if (!isLoggedIn) {
            router.push('/login');
            return;
        }
        if (connectionStatus === 'None') {
            onConnect();
        }
    };

    const getButtonContent = () => {
        if (!isLoggedIn) return <div className="flex items-center gap-2">Connect <UserPlus size={16} /></div>;
        if (isLoading) return <span className="animate-pulse">Processing...</span>;
        if (connectionStatus === 'Accepted') return <div className="flex items-center gap-2">Connected <Check size={16} /></div>;
        if (connectionStatus === 'Pending') return <div className="flex items-center gap-2">Request Sent <Clock size={16} /></div>;
        return <div className="flex items-center gap-2">Connect <UserPlus size={16} /></div>;
    };

    const isButtonDisabled = isLoggedIn && (
        connectionStatus === 'Accepted' ||
        connectionStatus === 'Pending' ||
        isLoading
    );

    // Strict Academic Button Style (No Radius)
    const getButtonStyle = () => {
        if (connectionStatus === 'Accepted') {
            return "bg-green-600 text-white border-none cursor-default";
        }
        if (connectionStatus === 'Pending') {
            return "bg-gray-100 text-[#002855] border border-gray-300 cursor-default";
        }
        return "bg-[#00629B] hover:bg-[#002855] text-white transition-colors duration-200";
    };

    return (
        <div className="bg-white w-full border border-[#00629B]/30 p-0 shadow-none">
            {/* Header / Identity Section */}
            <div className="p-8 flex flex-col items-center text-center border-b border-gray-100">
                {/* Avatar */}
                <div className="w-28 h-28 mb-5 rounded-full bg-white border-2 border-[#00629B] p-1 flex items-center justify-center text-4xl font-serif text-[#00629B]">
                    {user.name.charAt(0).toUpperCase()}
                </div>

                {/* Name */}
                <h2 className="text-2xl font-bold text-[#002855] mb-2 font-serif tracking-tight">
                    {user.name}
                </h2>

                {/* Connection Badge - Flat Rectangular */}
                <div className="mt-2 bg-gray-100 px-3 py-1 border border-gray-200">
                    <span className="text-xs font-bold text-[#002855] tracking-widest uppercase">
                        {user.connections} Verified Connections
                    </span>
                </div>
            </div>

            {/* Academic Credentials Box */}
            <div className="bg-[#F0F9FF] border-b border-[#00629B]/20 p-6">
                <p className="text-[10px] font-bold text-[#00629B] uppercase tracking-widest mb-3">Academic Credentials</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Program */}
                    <div className="flex items-start gap-3">
                        <Calendar size={16} className="text-[#00629B] mt-0.5 shrink-0" />
                        <div className="flex flex-col">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Program Span</span>
                            <span className="text-sm font-medium text-[#002855]">{user.year || 'N/A'}</span>
                        </div>
                    </div>
                    {/* Department */}
                    <div className="flex items-start gap-3">
                        <BookOpen size={16} className="text-[#00629B] mt-0.5 shrink-0" />
                        <div className="flex flex-col">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Discipline</span>
                            <span className="text-sm font-medium text-[#002855]">{user.department || 'General Engineering'}</span>
                        </div>
                    </div>
                    {/* Institution */}
                    <div className="flex items-start gap-3 md:col-span-2">
                        <GraduationCap size={16} className="text-[#00629B] mt-0.5 shrink-0" />
                        <div className="flex flex-col">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Institution</span>
                            <span className="text-sm font-medium text-[#002855]">{user.university || 'Pandit Deendayal Energy University'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Activities Transcript */}
            <div className="p-6 border-b border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Event Transcript</p>
                <div className="space-y-3">
                    {/* Morning */}
                    {user.theme && (
                        <div className="flex gap-4 items-baseline">
                            <span className="text-xs font-mono font-bold text-[#00629B] shrink-0">09:00 AM</span>
                            <span className="text-sm text-gray-700 leading-relaxed font-medium">
                                {user.theme} <span className="text-gray-400 ml-1 font-normal">(Track)</span>
                            </span>
                        </div>
                    )}

                    {/* Afternoon */}
                    {user.participationType && (
                        <div className="flex gap-4 items-baseline">
                            <span className="text-xs font-mono font-bold text-[#00629B] shrink-0">02:00 PM</span>
                            <span className="text-sm text-gray-700 leading-relaxed font-medium">
                                {user.participationType}
                            </span>
                        </div>
                    )}

                    {!user.theme && !user.participationType && (
                        <p className="text-sm text-gray-400 italic">No registered activities found.</p>
                    )}
                </div>
            </div>

            {/* Professional Directory (Socials) */}
            <div className="flex flex-col bg-white">
                <div className="px-6 py-2 bg-gray-50 border-b border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Directory</p>
                </div>

                {/* Connect Action - No Radius */}
                <button
                    onClick={handleMainAction}
                    disabled={isButtonDisabled}
                    className={`w-full py-4 px-6 font-bold text-sm uppercase tracking-wider flex items-center justify-between group ${getButtonStyle()}`}
                >
                    <span>{getButtonContent()}</span>
                    {!isButtonDisabled && <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>}
                </button>
            </div>
        </div>
    );
};

export default ParticipantProfileCard;
