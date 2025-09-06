
import * as admin from 'firebase-admin';

function getAdminApp(): admin.app.App {
    if (admin.apps.length > 0) {
        return admin.apps[0]!;
    }

    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;

    if (!serviceAccount) {
        throw new Error('FIREBASE_SERVICE_ACCOUNT environment variable is not set.');
    }

    try {
        return admin.initializeApp({
            credential: admin.credential.cert(JSON.parse(serviceAccount)),
        });
    } catch(e: any) {
        throw new Error(`Failed to initialize Firebase Admin SDK: ${e.message}`);
    }
}

function getAdminAuth(): admin.auth.Auth {
    return getAdminApp().auth();
}

function getAdminFirestore(): admin.firestore.Firestore {
    return getAdminApp().firestore();
}


export { getAdminApp, getAdminAuth, getAdminFirestore };
