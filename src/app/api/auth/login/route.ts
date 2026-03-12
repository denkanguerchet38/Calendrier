import { NextRequest, NextResponse } from "next/server";
import { createSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Vérification côté serveur
    if (username !== "Famille" || password !== process.env.SITE_PASSWORD) {
      return NextResponse.json(
        { error: "Identifiant ou mot de passe incorrect." },
        { status: 401 }
      );
    }

    // Créer la session
    await createSession();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur de connexion:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la connexion." },
      { status: 500 }
    );
  }
}
