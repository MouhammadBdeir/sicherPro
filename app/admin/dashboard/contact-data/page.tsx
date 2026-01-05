'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase'; // Angenommen, db ist in lib/firebase exportiert (firestore)
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import Link from "next/link";


interface ContactData {
    // Kontakt
    email: string;
    phone: string;
    mobile: string;

    // Person
    firstName: string;
    lastName: string;

    // Adresse
    street: string;
    zip: string;
    city: string;

    // Firma / Impressum
    managingDirector: string;
    registerCourt: string;
    commercialRegisterNumber: string;
}

export default function ContactDataManagement() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const sessionTimeout = Number(process.env.NEXT_PUBLIC_SESSION_TIMEOUT) || 3600000;
    const [contactData, setContactData] = useState<ContactData>({
        email: '',
        phone: '',
        mobile: '',

        firstName: '',
        lastName: '',

        street: '',
        zip: '',
        city: '',

        managingDirector: '',
        registerCourt: '',
        commercialRegisterNumber: '',
    });
    const router = useRouter();
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                // Lade Kontaktdaten aus Firestore
                const docRef = doc(db, 'contactData', 'main'); // 'main' als Dokument-ID (kannst du anpassen)
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    // Type-Assertion: Wir nehmen an, dass die Daten dem Interface entsprechen
                    setContactData(docSnap.data() as ContactData);
                } else {
                    console.log('Kein Dokument gefunden – erstelle ein neues bei Speichern.');
                }
            } else {
                router.push('/admin/login');
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [router]);
    useEffect(() => {
        if (user) {
            const timer = setTimeout(() => {
                signOut(auth);
                router.push('/admin/login');
            }, sessionTimeout );

            return () => clearTimeout(timer);
        }
    }, [user, router]);
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setContactData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setStatus('loading');
        try {
            const docRef = doc(db, 'contactData', 'main');
            await setDoc(docRef, contactData, { merge: true });
            setStatus('success');
            setTimeout(() => setStatus('idle'), 5000); // Success verschwindet nach 5s
        } catch (error) {
            console.error('Fehler beim Speichern:', error);
            setStatus('error');
            setTimeout(() => setStatus('idle'), 5000); // Error verschwindet nach 5s
        }
    };

    const handleLogout = async () => {
        await signOut(auth);
        router.push('/admin/login');
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-2xl">Lade...</div>;

    return (
        <main className="min-h-screen bg-[#D9DEDF] text-[#3A3A3A]">
            {/* Header */}
            <header className="bg-[#587D85] text-white py-8 px-6 shadow-2xl">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
                        <p className="text-[#D9DEDF] mt-2">Angemeldet als: {user?.email}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="bg-white text-[#587D85] px-8 py-3 rounded-full font-bold hover:bg-[#3A3A3A] hover:text-white transition-all shadow-lg"
                    >
                        Abmelden
                    </button>
                </div>
            </header>

            {/* Willkommen & Navigation */}
            <section className="max-w-7xl mx-auto py-16 px-6">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl p-12 shadow-2xl text-center"
                >
                    <h2 className="text-4xl font-bold mb-8 text-[#3A3A3A]">Willkommen im Admin-Bereich</h2>
                    <p className="text-xl text-[#B2B2AC] max-w-3xl mx-auto leading-relaxed mb-12">
                        Verwalten Sie Bilder, Kontaktdaten und alle eingehenden Anfragen übersichtlich und professionell.
                    </p>
                    <div className="flex flex-col md:flex-row gap-6 justify-center">
                        <Link
                            href="/admin/dashboard"
                            className="bg-[#587D85] text-white py-4 px-8 rounded-2xl text-xl font-bold hover:bg-[#3A3A3A] transition-all shadow-lg text-center"
                        >
                            Zurück zum Dashboard
                        </Link>
                        <Link
                            href="/admin/dashboard/image-management"
                            className="bg-[#587D85] text-white py-4 px-8 rounded-2xl text-xl font-bold hover:bg-[#3A3A3A] transition-all shadow-lg text-center"
                        >
                            Bilder verwalten
                        </Link>
                        <Link
                            href="/admin/dashboard/contact-management"
                            className="bg-[#587D85] text-white py-4 px-8 rounded-2xl text-xl font-bold hover:bg-[#3A3A3A] transition-all shadow-lg text-center"
                        >
                            Anfragen verwalten
                        </Link>
                    </div>
                </motion.div>
            </section>

            <div className="max-w-7xl mx-auto py-16 px-6">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl p-12 shadow-2xl"
                >
                    <h2 className="text-3xl font-bold mb-8 text-[#3A3A3A]">Bearbeiten Sie die Kontaktdaten</h2>
                    <p className="text-xl text-[#B2B2AC] mb-8">Diese Daten werden auf der Webseite angezeigt (z.B. im Footer oder Kontaktbereich).</p>

                    <form className="space-y-10 max-w-3xl mx-auto">

                        {/* ================= Ansprechpartner ================= */}
                        <section className="bg-[#F7F9FA] rounded-2xl p-6 border border-[#E1E5E7]">
                            <h3 className="text-xl font-semibold mb-4 text-[#3A3A3A]">
                                Ansprechpartner
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Vorname
                                    </label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={contactData.firstName ?? ''}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#587D85]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Nachname
                                    </label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={contactData.lastName ?? ''}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#587D85]"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* ================= Kontaktdaten ================= */}
                        <section className="bg-[#F7F9FA] rounded-2xl p-6 border border-[#E1E5E7]">
                            <h3 className="text-xl font-semibold mb-4 text-[#3A3A3A]">
                                Kontaktdaten
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">E-Mail</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={contactData.email ?? ''}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#587D85]"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Telefon</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={contactData.phone ?? ''}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#587D85]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Mobil</label>
                                        <input
                                            type="tel"
                                            name="mobile"
                                            value={contactData.mobile ?? ''}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#587D85]"
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* ================= Adresse ================= */}
                        <section className="bg-[#F7F9FA] rounded-2xl p-6 border border-[#E1E5E7]">
                            <h3 className="text-xl font-semibold mb-4 text-[#3A3A3A]">
                                Adresse
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Straße & Hausnummer
                                    </label>
                                    <input
                                        type="text"
                                        name="street"
                                        value={contactData.street ?? ''}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#587D85]"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">PLZ</label>
                                        <input
                                            type="text"
                                            name="zip"
                                            value={contactData.zip ?? ''}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#587D85]"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium mb-1">Stadt</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={contactData.city ?? ''}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#587D85]"
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* ================= Firmendaten / Impressum ================= */}
                        <section className="bg-[#F2F4F5] rounded-2xl p-6 border border-[#D1D7DA]">
                            <h3 className="text-xl font-semibold mb-4 text-[#3A3A3A]">
                                Firmendaten (Impressum)
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Geschäftsführer
                                    </label>
                                    <input
                                        type="text"
                                        name="managingDirector"
                                        value={contactData.managingDirector ?? ''}
                                        onChange={handleInputChange}
                                        placeholder="z. B. Ratib Al Salih"
                                        className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#587D85]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Registergericht
                                    </label>
                                    <input
                                        type="text"
                                        name="registerCourt"
                                        value={contactData.registerCourt ?? ''}
                                        onChange={handleInputChange}
                                        placeholder="Amtsgericht Düsseldorf"
                                        className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#587D85]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Handelsregisternummer
                                    </label>
                                    <input
                                        type="text"
                                        name="commercialRegisterNumber"
                                        value={contactData.commercialRegisterNumber ?? ''}
                                        onChange={handleInputChange}
                                        placeholder="HRB 123456"
                                        className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#587D85]"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* ================= Speichern ================= */}
                        <div className="mt-4 text-center min-h-[24px]">
                            {status === 'loading' && (
                                <p className="text-blue-600 font-medium animate-pulse">Speichert…</p>
                            )}
                            {status === 'success' && (
                                <p className="text-green-600 font-medium">Erfolgreich gespeichert!</p>
                            )}
                            {status === 'error' && (
                                <p className="text-red-600 font-medium">Fehler beim Speichern.</p>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={status === 'loading'}
                            className="w-full bg-[#587D85] text-white py-4 rounded-2xl text-lg font-semibold hover:bg-[#3A3A3A] transition-all shadow-xl disabled:opacity-50"
                        >
                            {status === 'loading' ? 'Speichert…' : 'Änderungen speichern'}
                        </button>

                    </form>

                </motion.div>
            </div>

            {/* Footer */}
            <footer className="bg-[#3A3A3A] text-white py-12 px-6 mt-16">
                <div className="max-w-7xl mx-auto text-center">
                    <p className="text-[#B2B2AC]">Admin Dashboard – SicherPro Wachschutz GmbH</p>
                </div>
            </footer>
        </main>
    );
}