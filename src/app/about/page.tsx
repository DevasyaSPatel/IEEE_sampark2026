'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import AboutPage from '@/components/AboutPage';

export default function Page() {
    // Auth handled by Navbar internally

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            {/* Add padding-top to account for fixed Navbar */}
            <div className="pt-16">
                <AboutPage />
            </div>
        </div>
    );
}
