// app/api/admin/register/route.ts (Updated with Env Checks and Logging)
import { NextResponse } from 'next/server';
import admin from 'firebase-admin';
import nodemailer from 'nodemailer';

// Log env vars for debugging (remove in production)
console.log('SMTP_HOST:', process.env.SMTP_HOST);
console.log('SMTP_PORT:', process.env.SMTP_PORT);
console.log('SMTP_USER:', process.env.SMTP_USER);
console.log('SMTP_PASS:', process.env.SMTP_PASS ? 'SET' : 'NOT SET'); // Don't log password

// Check if SMTP env vars are set
if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error('Missing SMTP environment variables. Check .env.local and restart the server.');
}

// Initialize Firebase Admin SDK if not already
if (!admin.apps.length) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            }),
        });
    } catch (err) {
        console.error('Firebase Admin Initialization Error:', err);
        throw err; // Fail early
    }
}

const adminDb = admin.firestore();

// Rate limiting (simple in-memory, for production use Redis)
let lastRequestTime = 0;
const RATE_LIMIT_MS = 60000; // 1 minute

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false, // true for port 465, false for 587 (STARTTLS)
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// Verify transporter before use (optional but helpful for debugging)
transporter.verify((error, success) => {
    if (error) {
        console.error('SMTP Transporter Verification Error:', error);
    } else {
        console.log('SMTP Transporter is ready');
    }
});

export async function POST(request: Request) {
    const now = Date.now();
    if (now - lastRequestTime < RATE_LIMIT_MS) {
        return NextResponse.json({ error: 'Zu viele Anfragen. Versuchen Sie es später.' }, { status: 429 });
    }
    lastRequestTime = now;

    try {
        const { email } = await request.json();

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return NextResponse.json({ error: 'Ungültige E-Mail-Adresse.' }, { status: 400 });
        }

        // Check if email already pending
        const pendingQuery = adminDb.collection('pendingAdmins').where('email', '==', email);
        const pendingDocs = await pendingQuery.get();
        if (!pendingDocs.empty) {
            return NextResponse.json({ error: 'Anfrage bereits gestellt.' }, { status: 400 });
        }

        // Save to pendingAdmins using admin SDK
        const docRef = await adminDb.collection('pendingAdmins').add({
            email,
            requestedAt: new Date().toISOString(),
            status: 'pending',
        });

        // Send approval email to owner
        const approvalLink = `${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/approve/${docRef.id}`;
        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: process.env.ADMIN_OWNER_EMAIL,
            subject: 'Neue Admin-Registrierungsanfrage',
            html: `
        <h2>Neue Anfrage</h2>
        <p>E-Mail: ${email}</p>
        <p><a href="${approvalLink}" style="background:#587D85;color:white;padding:15px 30px;text-decoration:none;border-radius:8px;font-weight:bold;">Bestätigen</a></p>
      `,
        });

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error('Register Error:', err);
        return NextResponse.json({ error: 'Serverfehler. Bitte versuchen Sie es später.' }, { status: 500 });
    }
}