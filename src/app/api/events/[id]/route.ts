import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function getDb() {
  const { getFirebaseAdmin } = await import("@/lib/firebase-admin");
  return getFirebaseAdmin().db;
}

// PUT /api/events/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = await getDb();
    const { id } = await params;
    const body = await request.json();

    const eventRef = db.collection("events").doc(id);
    const doc = await eventRef.get();

    if (!doc.exists) {
      return NextResponse.json(
        { error: "Événement introuvable." },
        { status: 404 }
      );
    }

    const updateData = {
      ...(body.title !== undefined && { title: body.title }),
      ...(body.type !== undefined && { type: body.type }),
      ...(body.startDate !== undefined && { startDate: body.startDate }),
      ...(body.endDate !== undefined && { endDate: body.endDate }),
      ...(body.allDay !== undefined && { allDay: body.allDay }),
      ...(body.location !== undefined && { location: body.location }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.participants !== undefined && { participants: body.participants }),
      ...(body.rsvp !== undefined && { rsvp: body.rsvp }),
      updatedAt: new Date().toISOString(),
    };

    await eventRef.update(updateData);

    return NextResponse.json({ id, ...doc.data(), ...updateData });
  } catch (error) {
    console.error("Erreur PUT /api/events/[id]:", error);
    return NextResponse.json(
      { error: "Erreur lors de la modification de l'événement." },
      { status: 500 }
    );
  }
}

// DELETE /api/events/[id]
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = await getDb();
    const { id } = await params;

    const eventRef = db.collection("events").doc(id);
    const doc = await eventRef.get();

    if (!doc.exists) {
      return NextResponse.json(
        { error: "Événement introuvable." },
        { status: 404 }
      );
    }

    const commentsSnapshot = await eventRef.collection("comments").get();
    const batch = db.batch();
    commentsSnapshot.docs.forEach((commentDoc) => {
      batch.delete(commentDoc.ref);
    });
    batch.delete(eventRef);
    await batch.commit();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur DELETE /api/events/[id]:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'événement." },
      { status: 500 }
    );
  }
}
