import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.userId;

    const totalNotes = await db.note.count({ where: { userId } });

    // Recently edited notes (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentlyEdited = await db.note.count({
      where: {
        userId,
        updatedAt: { gte: sevenDaysAgo }
      }
    });

    // AI usage stats (notes with any AI field populated)
    const aiNotesCount = await db.note.count({
      where: {
        userId,
        OR: [
          { summary: { not: null } },
          { actionItems: { not: "[]" } },
          { suggestedTitle: { not: null } },
        ]
      }
    });

    // Most used tags
    const allNotes = await db.note.findMany({
      where: { userId },
      select: { tags: true }
    });

    const tagCounts: Record<string, number> = {};
    allNotes.forEach(n => {
      const tags = JSON.parse(n.tags || "[]");
      tags.forEach((tag: string) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    const mostUsedTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    return NextResponse.json({
      totalNotes,
      recentlyEdited,
      aiNotesCount,
      mostUsedTags
    });

  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
