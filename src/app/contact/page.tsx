'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import ContactPage from '@/components/ContactPage';

export default function Page() {
    // Auth handled by Navbar internally

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="pt-20">
                <ContactPage />
            </div>
        </div>
    );
}
