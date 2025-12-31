'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import ParticipantProfileCard from '@/components/ParticipantProfileCard';

// Define types locally if needed or import from a shared types file
type PublicUser = {
    id: string; // Email/ID
    name: string;
    selectedEvent: string;
    bio: string;
    slug: string;
    role: string;
    connections?: number;
    year?: string;
    department?: string;
    university?: string;
    linkedin?: string;
    posterTheme?: string;
    isPosterPresenting?: string;
};

type ConnectionStatus = 'None' | 'Pending' | 'Accepted';

export default function PublicProfile({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const router = useRouter();
    const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('None');
    const [profile, setProfile] = useState<PublicUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [sending, setSending] = useState(false);

    useEffect(() => {
        // 1. Fetch Profile
        const fetchProfile = async () => {
            try {
                const res = await fetch(`/api/public/profile/${slug}`);
                if (!res.ok) throw new Error('Profile not found');
                const data = await res.json();
                setProfile(data);
            } catch (err) {
                setError('User not found or link is invalid.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();

        // 2. Check Auth & Connection Status
        const checkAuthAndStatus = async () => {
            const userId = localStorage.getItem('user_id');
            const userData = localStorage.getItem('user_data');

            if (userId) {
                if (userData) {
                    setCurrentUser(JSON.parse(userData));
                } else {
                    setCurrentUser({ email: userId });
                }
            }
        };

        checkAuthAndStatus();
    }, [slug]);

    // Separate effect to check status once both currentUser and profile are available
    useEffect(() => {
        const checkStatus = async () => {
            if (currentUser?.email && profile?.id) {
                try {
                    const res = await fetch(`/api/connections/status?sourceEmail=${currentUser.email}&targetEmail=${profile.id}`);
                    if (res.ok) {
                        const data = await res.json();
                        setConnectionStatus(data.status); // 'None', 'Pending', 'Accepted'
                    }
                } catch (e) {
                    console.error("Failed to check status", e);
                }
            }
        };

        checkStatus();
    }, [currentUser, profile]);


    const handleConnect = async () => {
        setSending(true);

        if (!currentUser) {
            // This is primarily handled by the component now, but keep as fallback
            router.push('/login');
            return;
        }

        try {
            const payload = {
                sourceEmail: currentUser?.email || localStorage.getItem('user_id'),
                targetEmail: profile?.id || '',
                note: ''
            };
            console.log("Sending Request Payload:", payload);

            const res = await fetch('/api/connections/request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setConnectionStatus('Pending');
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to send request');
            }
        } catch (e) {
            console.error(e);
            alert('Error sending request: Network or Server Error');
        } finally {
            setSending(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
    if (error || !profile) return <div className="min-h-screen flex items-center justify-center text-red-400">{error}</div>;

    const isLoggedIn = !!currentUser;

    // Adapt profile to component User type
    const cardUser = {
        id: profile.id,
        name: profile.name,
        selectedEvent: profile.selectedEvent,
        posterTheme: profile.posterTheme,
        isPosterPresenting: profile.isPosterPresenting,
        connections: profile.connections || 0,
        bio: profile.bio,
        year: profile.year,
        department: profile.department,
        university: profile.university,
        linkedin: profile.linkedin
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            {/* Academic Header */}
            <header className="w-full bg-[#002855] py-4 px-6 shadow-none">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <div className="flex flex-col">
                        <h1 className="text-white font-bold text-lg leading-tight tracking-wide">SAMPARK 2026</h1>
                        <span className="text-blue-200/80 text-xs uppercase tracking-wider font-medium">Official Participant Profile</span>
                    </div>
                    <button onClick={() => router.push(currentUser ? '/dashboard' : '/login')} className="text-xs font-bold text-white border border-white/30 px-4 py-2 hover:bg-white/10 transition-colors uppercase tracking-wider">
                        {currentUser ? 'Dashboard' : 'Login'}
                    </button>
                </div>
            </header>

            {/* Profile Content Container */}
            <main className="w-full max-w-[500px] mx-auto pt-8 pb-12 px-4 md:px-0">
                <ParticipantProfileCard
                    user={cardUser}
                    isLoggedIn={isLoggedIn}
                    connectionStatus={connectionStatus}
                    isLoading={sending}
                    onConnect={handleConnect}
                />
            </main>
        </div>
    );
}
