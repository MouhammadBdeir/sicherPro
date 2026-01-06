// app/api/admin/approve/[id]/route.ts (Updated to Use Firebase Admin SDK for Firestore)
import { NextResponse } from 'next/server';
import { auth } from '@/lib/firebase'; // Client auth for createUser and sendReset
import { createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import admin from 'firebase-admin';
// Initialize Firebase Admin SDK if not already
if (!admin.apps.length) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,  // Server-only
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            }),
        });
    } catch (err) {
        console.error('Firebase Admin Initialization Error:', err);
    }
}

const adminDb = admin.firestore();
const adminAuth = admin.auth();
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    try {
        const snap = await adminDb.collection('pendingAdmins').doc(id).get();
        if (!snap.exists) {
            throw new Error('Anfrage nicht gefunden');
        }

        const { email } = snap.data()!;

        // Create user with client auth (since createUserWithEmailAndPassword is client-side, but we can use it server-side)
        const userCredential = await createUserWithEmailAndPassword(auth, email, 'temp_password_ignored'); // PW ignored

        // Set custom claim for role using admin
        await adminAuth.setCustomUserClaims(userCredential.user.uid, { role: 'admin' });

        // Send password reset email
        await sendPasswordResetEmail(auth, email);

        // Delete pending using admin
        await adminDb.collection('pendingAdmins').doc(id).delete();

        return NextResponse.redirect(new URL('/admin/approve-success', request.url));
    } catch (err: any) {
        console.error('Approval Error:', err);
        return NextResponse.redirect(new URL('/admin/approve-error', request.url));
    }
}