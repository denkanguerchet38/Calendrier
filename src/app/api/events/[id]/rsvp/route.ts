import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function getDb() {
  const { getFirebaseAdmin } = await import("@/lib/firebase-admin");
  return getFirebaseAdmin().db;
}

// POST /api/events/[id]/rsvp — Toggle RSVP pour un membre
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = await getDb();
    const { id } = await params;
    const body = await request.json();
    const { member } = body;

    if (!member) {
      return NextResponse.json(
        { error: "member est requis." },
        { status: 400 }
      );
    }

    const eventRef = db.collection("events").doc(id);
    const doc = await eventRef.get();

    if (!doc.exists) {
      return NextResponse.json(
        { error: "Événement introuvable." },
        { status: 404 }
      );
    }

    const data = doc.data()!;
    const currentRsvp: string[] = data.rsvp || [];

    // Toggle : si déjà présent on retire, sinon on ajoute
    const newRsvp = currentRsvp.includes(member)
      ? currentRsvp.filter((m: string) => m !== member)
      : [...currentRsvp, member];

    await eventRef.update({
      rsvp: newRsvp,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      id,
      rsvp: newRsvp,
    });
  } catch (error) {
    console.error("Erreur POST /api/events/[id]/rsvp:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de la présence." },
      { status: 500 }
    );
  }
}
