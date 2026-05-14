import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const tag = searchParams.get("tag");

    let whereClause: any = { userId: session.userId };

    if (search) {
      whereClause = {
        ...whereClause,
        OR: [
          { title: { contains: search } },
          { content: { contains: search } }
        ]
      };
    }

    if (tag) {
      whereClause = {
        ...whereClause,
        tags: { contains: `"${tag}"` } // Simple contains search since tags is JSON string
      };
    }

    const notes = await db.note.findMany({
      where: whereClause,
      orderBy: { updatedAt: "desc" }
    });

    return NextResponse.json({ notes });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, content, tags } = await req.json();

    const note = await db.note.create({
      data: {
        title: title || "Untitled Note",
        content: content || "",
        tags: tags ? JSON.stringify(tags) : "[]",
        userId: session.userId,
      }
    });

    return NextResponse.json({ note });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
