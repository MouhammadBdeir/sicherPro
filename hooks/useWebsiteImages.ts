import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface WebsiteImages {
    home_logo?: string;
    home_hero?: string;
    about_hero?: string;
    about_image?: string;
    process_image?: string;
    contact_hero?: string;

    //Dienstleistungen
    baustellen_hero?: string;
    baustellen_icon?: string;
    brandwache_hero?: string;
    brandwache_icon?: string;
    objektschutz_hero?: string;
    objektschutz_icon?: string;
    veranstaltung_hero?: string;
    veranstaltung_icon?: string;
    personenschutz_hero?: string;
    personenschutz_icon?: string;
    mobiler_hero?: string;
    mobiler_icon?: string;
    unterkuenfte_hero?: string;
    unterkuenfte_icon?: string;

    [key: string]: string | undefined;
}

export function useWebsiteImages() {
    const [images, setImages] = useState<WebsiteImages>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const docRef = doc(db, 'config', 'websiteImages');

        // onSnapshot sorgt dafür, dass sich der State automatisch aktualisiert
        const unsubscribe = onSnapshot(
            docRef,
            (docSnap) => {
                if (docSnap.exists()) {
                    setImages(docSnap.data() as WebsiteImages);
                }
                setLoading(false);
            },
            (error) => {
                console.error('Fehler beim Laden der Website-Bilder:', error);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    return { images, loading };
}
