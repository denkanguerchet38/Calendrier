import { NextRequest, NextResponse } from "next/server";
import { getFirebaseAdmin } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

// GET /api/comments?eventId=xxx — Récupérer les commentaires d'un événement
export async function GET(request: NextRequest) {
  try {
    const { db } = getFirebaseAdmin();
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId");

    if (!eventId) {
      return NextResponse.json(
        { error: "eventId requis." },
        { status: 400 }
      );
    }

    const snapshot = await db
      .collection("events")
      .doc(eventId)
      .collection("comments")
      .orderBy("createdAt", "asc")
      .get();

    const comments = snapshot.docs.map((doc) => ({
      id: doc.id,
      eventId,
      ...doc.data(),
    }));

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Erreur GET /api/comments:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des commentaires." },
      { status: 500 }
    );
  }
}

// POST /api/comments — Ajouter un commentaire
export async function POST(request: NextRequest) {
  try {
    const { db } = getFirebaseAdmin();
    const body = await request.json();

    if (!body.eventId || !body.author || !body.text) {
      return NextResponse.json(
        { error: "eventId, author et text sont requis." },
        { status: 400 }
      );
    }

    const commentData = {
      author: body.author,
      text: body.text,
      createdAt: new Date().toISOString(),
    };

    const docRef = await db
      .collection("events")
      .doc(body.eventId)
      .collection("comments")
      .add(commentData);

    return NextResponse.json(
      { id: docRef.id, eventId: body.eventId, ...commentData },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur POST /api/comments:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'ajout du commentaire." },
      { status: 500 }
    );
  }
}

// DELETE /api/comments?eventId=xxx&commentId=yyy — Supprimer un commentaire
export async function DELETE(request: NextRequest) {
  try {
    const { db } = getFirebaseAdmin();
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId");
    const commentId = searchParams.get("commentId");

    if (!eventId || !commentId) {
      return NextResponse.json(
        { error: "eventId et commentId requis." },
        { status: 400 }
      );
    }

    await db
      .collection("events")
      .doc(eventId)
      .collection("comments")
      .doc(commentId)
      .delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur DELETE /api/comments:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du commentaire." },
      { status: 500 }
    );
  }
}
