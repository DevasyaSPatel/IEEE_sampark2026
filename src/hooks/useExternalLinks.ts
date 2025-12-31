import { useState, useEffect } from 'react';

export const useExternalLinks = () => {
    const [links, setLinks] = useState<{ REGISTRATION_FORM: string; WHATSAPP_GROUP: string } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLinks = async () => {
            try {
                const res = await fetch('/api/config/links');
                if (res.ok) {
                    const data = await res.json();
                    setLinks(data);
                }
            } catch (error) {
                console.error("Failed to fetch config links", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLinks();
    }, []);

    return { links, loading };
};
