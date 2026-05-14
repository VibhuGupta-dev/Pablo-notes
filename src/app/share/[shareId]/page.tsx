import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import styles from "../../dashboard.module.css";
import { LayoutDashboard, Sparkles, Tag } from "lucide-react";

export default async function SharedNotePage({ params }: { params: Promise<{ shareId: string }> }) {
  const resolvedParams = await params;
  
  const note = await db.note.findUnique({
    where: { shareId: resolvedParams.shareId }
  });

  if (!note || !note.isPublic) {
    notFound();
  }

  const tags = JSON.parse(note.tags || "[]");
  const actionItems = note.actionItems ? JSON.parse(note.actionItems) : [];

  return (
    <div className={styles.layout}>
      <div className={styles.editorArea} style={{ alignItems: 'center', backgroundColor: 'var(--bg-surface)' }}>
        
        <div style={{ padding: '2rem', width: '100%', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'center' }}>
          <div className={styles.logo}>
            <div style={{ backgroundColor: "var(--accent-color)", padding: "4px", borderRadius: "4px", marginRight: '8px' }}>
              <LayoutDashboard size={20} color="white" />
            </div>
            Peblo Notes (Shared)
          </div>
        </div>

        <div className={styles.contentArea} style={{ maxWidth: '800px', width: '100%', flexDirection: 'column' }}>
          <h1 className={styles.titleInput} style={{ fontSize: '2rem', marginBottom: '1rem', borderBottom: 'none' }}>
            {note.title}
          </h1>

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            {tags.map((tag: string) => (
              <span key={tag} className={styles.tag}>
                <Tag size={12} /> {tag}
              </span>
            ))}
          </div>

          <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, color: 'var(--text-primary)' }}>
            {note.content}
          </div>

          {(note.summary || actionItems.length > 0) && (
            <div className={styles.aiBlock} style={{ marginTop: '3rem' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--accent-color)' }}>
                <Sparkles size={16} /> AI Insights
              </h3>
              
              {note.summary && (
                <div style={{ marginBottom: "1.5rem" }}>
                  <span style={{ fontSize: "0.875rem", color: "var(--text-muted)", display: "block", marginBottom: "0.5rem" }}>Summary</span>
                  <div className={styles.aiSummary}>{note.summary}</div>
                </div>
              )}

              {actionItems.length > 0 && (
                <div>
                  <span style={{ fontSize: "0.875rem", color: "var(--text-muted)", display: "block", marginBottom: "0.5rem" }}>Action Items</span>
                  <ul className={styles.aiActionItems}>
                    {actionItems.map((item: string, idx: number) => (
                      <li key={idx} className={styles.aiActionItem}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent-color)', marginTop: '8px' }} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
