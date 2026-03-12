import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

let app: App;
let db: Firestore;

function formatPrivateKey(key: string): string {
  // Supprimer les guillemets au début et à la fin si présents
  let formatted = key.trim();
  if (formatted.startsWith('"') && formatted.endsWith('"')) {
    formatted = formatted.slice(1, -1);
  }
  if (formatted.startsWith("'") && formatted.endsWith("'")) {
    formatted = formatted.slice(1, -1);
  }

  // Remplacer les \n littéraux par de vrais retours à la ligne
  formatted = formatted.replace(/\\n/g, "\n");

  return formatted;
}

function getFirebaseAdmin(): { app: App; db: Firestore } {
  if (!app || getApps().length === 0) {
    const rawKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

    if (
      !process.env.FIREBASE_ADMIN_PROJECT_ID ||
      !process.env.FIREBASE_ADMIN_CLIENT_EMAIL ||
      !rawKey
    ) {
      throw new Error(
        "Variables d'environnement Firebase Admin manquantes. Vérifiez FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL et FIREBASE_ADMIN_PRIVATE_KEY."
      );
    }

    const privateKey = formatPrivateKey(rawKey);

    app = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
    });

    db = getFirestore(app);
  }

  if (!db) {
    db = getFirestore(app);
  }

  return { app, db };
}

export { getFirebaseAdmin };
