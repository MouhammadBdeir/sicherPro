'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import NextImage from 'next/image';
import { useWebsiteImages } from '@/hooks/useWebsiteImages';


const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

export default function Services() {
    const { images, loading } = useWebsiteImages();
    const services = [
        {
            title: 'Objektschutz',
            desc: 'Schutz von Gebäuden & Anlagen',
            href: '/dienstleistungen/objektschutz',
            iconKey: 'objektschutz_icon',
        },
        {
            title: 'Veranstaltungsschutz',
            desc: 'Sicherheit für Events',
            href: '/dienstleistungen/veranstaltungsschutz',
            iconKey: 'veranstaltung_icon',
        },
        {
            title: 'Personenschutz',
            desc: 'Schutz von Personen & VIPs',
            href: '/dienstleistungen/personenschutz',
            iconKey: 'personenschutz_icon',
        },
        {
            title: 'Mobiler Wachdienst & Revierkontrollen',
            desc: 'Flexible Kontrollfahrten & Präsenz',
            href: '/dienstleistungen/mobiler-wachdienst-revierkontrollen',
            iconKey: 'mobiler_icon',
        },
        {
            title: 'Brandwache',
            desc: 'Schutz vor Brandgefahren & Feuerkontrolle',
            href: '/dienstleistungen/brandwache',
            iconKey: 'brandwache_icon',
        },
        {
            title: 'Baustellenbewachung',
            desc: 'Schutz von Baustellen & Material',
            href: '/dienstleistungen/baustellenbewachung',
            iconKey: 'baustellen_icon',
        },
        {
            title: 'Bewachung von Unterkünften',
            desc: 'Ordnung & Sicherheit in Unterkünften',
            href: '/dienstleistungen/bewachung-von-unterkuenften',
            iconKey: 'unterkuenfte_icon',
        },
    ];

    return (
        <motion.section
            id="services"
            className="py-16 px-4 sm:py-24 sm:px-6 bg-[#D9DEDF]"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
        >
            <div className="max-w-7xl mx-auto">
                <motion.h2
                    className="text-4xl sm:text-5xl font-bold text-center mb-12 sm:mb-16 text-[#3A3A3A]"
                    variants={itemVariants}
                >
                    Unsere Dienstleistungen
                </motion.h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-12">
                    {services.map((service) => (
                        <motion.div
                            key={service.title}
                            className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-2xl transition-all duration-500 border border-[#B2B2AC]/20"
                            variants={itemVariants}
                            whileHover={{ y: -8 }}
                        >
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mb-6 sm:mb-8 mx-auto overflow-hidden bg-[#587D85]">
                                {images[service.iconKey] ? (
                                    <img
                                        src={images[service.iconKey]}
                                        alt={service.title}
                                        loading="lazy"
                                        className="w-full h-full object-cover rounded-full"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-white/30 animate-pulse rounded-full" />
                                )}
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-center text-[#3A3A3A]">
                                {service.title}
                            </h3>

                            <p className="text-[#6B7280] text-center mb-6 leading-relaxed">
                                {service.desc}
                            </p>

                            <Link href={service.href}>
                                <button className="w-full bg-[#587D85] text-white py-3 rounded-full hover:bg-[#3A3A3A] transition-all font-semibold">
                                    Details
                                </button>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.section>
    );
}
