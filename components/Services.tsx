'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

export default function Services() {
    const services = [
        { title: 'Objektschutz', desc: 'Schutz von Gebäuden & Anlagen', href: '/dienstleistungen/objektschutz' },
        { title: 'Veranstaltungsschutz', desc: 'Sicherheit für Events', href: '/dienstleistungen/veranstaltungsschutz' },
        { title: 'Personenschutz', desc: 'Schutz von Personen & VIPs', href: '/dienstleistungen/personenschutz' },
        { title: 'Mobiler Wachdienst & Revierkontrollen', desc: 'Flexible Kontrollfahrten & Präsenz', href: '/dienstleistungen/mobiler-wachdienst-revierkontrollen' },
        { title: 'Brandwache', desc: 'Schutz vor Brandgefahren & Feuerkontrolle', href: '/dienstleistungen/brandwache' },
        { title: 'Baustellenbewachung', desc: 'Schutz von Baustellen & Material', href: '/dienstleistungen/baustellenbewachung' },
        { title: 'Bewachung von Unterkünften', desc: 'Ordnung & Sicherheit in Unterkünften', href: '/dienstleistungen/bewachung-von-unterkuenften' },
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
                            className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-2xl hover:shadow-3xl transition-all duration-500 border border-[#B2B2AC]/20"
                            variants={itemVariants}
                            whileHover={{ y: -8 }}
                        >
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#587D85] rounded-full flex items-center justify-center mb-6 sm:mb-8 mx-auto">
                                <svg
                                    className="w-8 h-8 sm:w-10 sm:h-10 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-[#3A3A3A] text-center">{service.title}</h3>
                            <p className="text-[#6B7280] text-center mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base">{service.desc}</p>
                            <Link href={service.href}>
                                <button className="w-full bg-[#587D85] text-white py-3 sm:py-4 rounded-full hover:bg-[#3A3A3A] transition-all duration-300 font-semibold shadow-md sm:shadow-lg text-sm sm:text-base">
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
