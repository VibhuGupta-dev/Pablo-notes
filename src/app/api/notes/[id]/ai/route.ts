import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.LLM_API_KEY });

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;

    const note = await db.note.findUnique({
      where: {
        id: resolvedParams.id,
        userId: session.userId,
      }
    });

    if (!note || !note.content) {
      return NextResponse.json({ error: "Note not found or empty" }, { status: 404 });
    }

    if (!process.env.LLM_API_KEY) {
      return NextResponse.json({ error: "AI API key not configured" }, { status: 500 });
    }

    const prompt = `
    Analyze the following note content and provide:
    1. A short summary (2-3 sentences).
    2. A list of action items (if any).
    3. A suggested title for the note.
    
    Output strictly as a JSON object with this schema:
    {
      "summary": "string",
      "action_items": ["string", "string"],
      "suggested_title": "string"
    }

    Note content:
    """
    ${note.content}
    """
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const aiResponseText = response.text || "{}";
    let aiData;
    try {
      aiData = JSON.parse(aiResponseText);
    } catch (e) {
      console.error("Failed to parse AI response", e);
      return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
    }

    const updatedNote = await db.note.update({
      where: { id: note.id },
      data: {
        summary: aiData.summary || null,
        actionItems: aiData.action_items ? JSON.stringify(aiData.action_items) : "[]",
        suggestedTitle: aiData.suggested_title || null,
      }
    });

    return NextResponse.json({ note: updatedNote });
  } catch (error) {
    console.error("AI Error", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
