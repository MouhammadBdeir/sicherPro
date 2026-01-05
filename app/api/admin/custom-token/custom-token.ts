// pages/api/custom-token.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import admin from 'firebase-admin';

// Admin SDK nur einmal initialisieren
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
    });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { uid } = req.body;

    try {
        const customToken = await admin.auth().createCustomToken(uid, { role: 'admin' });
        res.status(200).json({ token: customToken });
    } catch (error) {
        res.status(500).json({ error: 'Token konnte nicht erstellt werden' });
    }
}
