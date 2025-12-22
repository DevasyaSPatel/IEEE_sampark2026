'use client';

import Link from 'next/link';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
// Custom WhatsApp Icon since Lucide doesn't always have brand icons
const WhatsAppIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.991.603 1.956.896 3.037.896h.001c3.181-.001 5.767-2.587 5.768-5.767.001-3.182-2.586-5.769-5.766-5.769a9.55 9.55 0 011.756-.164zm0 13.904c-1.503 0-2.844-.39-4.148-1.076l-4.57 1.198 1.22-4.463c-.76-1.393-1.164-2.981-1.163-4.596C3.372 5.093 8.356.12 14.482.12c2.97 0 5.76 1.156 7.859 3.256 2.099 2.099 3.254 4.887 3.253 7.855-.002 6.128-4.989 11.111-11.113 11.111z" />
    </svg>
);

export default function ApprovalPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <Navbar /> {/* Optional: Keep navbar if you want consistecy, or allow them to focus just on this message */}

            <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 text-center p-10 animate-fade-in-up">
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center shadow-inner">
                        <CheckCircle className="w-10 h-10 text-green-600" strokeWidth={3} />
                    </div>
                </div>

                <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
                    Registration Successful!
                </h1>

                <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                    Thank you for registering. Your account is currently <span className="font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">Pending Admin Approval</span>.
                    <br />
                    Please join our official WhatsApp group for updates.
                </p>

                <div className="space-y-4">
                    <a
                        href="https://chat.whatsapp.com/EuL3JAqzpILDxofDbVWAER"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1da851] text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95"
                    >
                        Join WhatsApp Group
                    </a>

                    <Link
                        href="/"
                        className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-4 rounded-xl transition-colors"
                    >
                        <ArrowLeft size={20} />
                        Back to Home
                    </Link>
                </div>
            </div>

            <div className="mt-8 text-sm text-gray-400">
                Need help? <a href="mailto:ieee@sot.pdpu.ac.in" className="underline hover:text-gray-600">Contact Support</a>
            </div>
        </div>
    );
}
