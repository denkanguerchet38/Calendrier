import { NextRequest, NextResponse } from "next/server";
import { getFirebaseAdmin } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

// GET /api/events — Récupérer les événements
export async function GET(request: NextRequest) {
  try {
    const { db } = getFirebaseAdmin();
    const { searchParams } = new URL(request.url);

    const startDate = searchParams.get("start");
    const endDate = searchParams.get("end");

    let query = db.collection("events").orderBy("startDate", "asc");

    if (startDate) {
      query = query.where("startDate", ">=", startDate);
    }
    if (endDate) {
      query = query.where("startDate", "<=", endDate);
    }

    const snapshot = await query.get();

    const events = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(events);
  } catch (error) {
    console.error("Erreur GET /api/events:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des événements." },
      { status: 500 }
    );
  }
}

// POST /api/events — Créer un événement
export async function POST(request: NextRequest) {
  try {
    const { db } = getFirebaseAdmin();
    const body = await request.json();

    const now = new Date().toISOString();
    const eventData = {
      title: body.title,
      type: body.type,
      startDate: body.startDate,
      endDate: body.endDate,
      allDay: body.allDay || false,
      location: body.location || "",
      description: body.description || "",
      participants: body.participants || [],
      createdBy: body.createdBy,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await db.collection("events").add(eventData);

    return NextResponse.json(
      { id: docRef.id, ...eventData },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur POST /api/events:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de l'événement." },
      { status: 500 }
    );
  }
}
