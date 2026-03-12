import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

let app: App;
let db: Firestore;

function getFirebaseAdmin(): { app: App; db: Firestore } {
  if (!app || getApps().length === 0) {
    // Méthode 1 : JSON complet en base64 (RECOMMANDÉ pour Vercel)
    const base64Json = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;

    if (base64Json) {
      const json = JSON.parse(
        Buffer.from(base64Json, "base64").toString("utf-8")
      );

      app = initializeApp({
        credential: cert(json),
      });
    } else {
      // Méthode 2 : variables séparées (fallback)
      const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

      if (
        !process.env.FIREBASE_ADMIN_PROJECT_ID ||
        !process.env.FIREBASE_ADMIN_CLIENT_EMAIL ||
        !privateKey
      ) {
        throw new Error(
          "Variables Firebase manquantes. Configurez FIREBASE_SERVICE_ACCOUNT_BASE64 ou les 3 variables FIREBASE_ADMIN_*."
        );
      }

      // Nettoyer la clé privée
      let cleanKey = privateKey.trim();
      if (cleanKey.startsWith('"')) cleanKey = cleanKey.slice(1);
      if (cleanKey.endsWith('"')) cleanKey = cleanKey.slice(0, -1);
      cleanKey = cleanKey.replace(/\\n/g, "\n");

      app = initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
          clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
          privateKey: cleanKey,
        }),
      });
    }

    db = getFirestore(app);
  }

  if (!db) {
    db = getFirestore(app);
  }

  return { app, db };
}

export { getFirebaseAdmin };
