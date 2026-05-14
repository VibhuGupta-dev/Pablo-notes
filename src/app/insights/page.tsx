"use client";

import useSWR from "swr";
import Link from "next/link";
import styles from "../dashboard.module.css";
import { LayoutDashboard, ArrowLeft, BarChart2, FileText, Sparkles, Activity, Tag } from "lucide-react";

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function InsightsPage() {
  const { data, error } = useSWR("/api/insights", fetcher);

  return (
    <div className={styles.layout}>
      <div className={styles.editorArea} style={{ backgroundColor: 'var(--bg-color)', width: '100%' }}>
        <div className={styles.editorHeader} style={{ padding: '1rem 2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link href="/dashboard" style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}>
              <ArrowLeft size={20} />
            </Link>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BarChart2 size={20} color="var(--accent-color)" />
              Productivity Insights
            </h1>
          </div>
        </div>

        <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
          {!data && !error ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
              <div className="animate-spin text-gray-500"><LayoutDashboard /></div>
            </div>
          ) : error ? (
            <div style={{ color: 'var(--danger-color)', padding: '2rem', textAlign: 'center' }}>
              Failed to load insights.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
              
              <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                  <FileText size={20} />
                  <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Total Notes</span>
                </div>
                <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {data.totalNotes}
                </div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                  <Activity size={20} />
                  <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Recently Edited (7d)</span>
                </div>
                <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--success-color)' }}>
                  {data.recentlyEdited}
                </div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                  <Sparkles size={20} />
                  <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>AI Enhanced Notes</span>
                </div>
                <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--accent-color)' }}>
                  {data.aiNotesCount}
                </div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', gridColumn: '1 / -1' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                  <Tag size={20} />
                  <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Most Used Tags</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                  {data.mostUsedTags?.length === 0 ? (
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No tags used yet.</span>
                  ) : (
                    data.mostUsedTags?.map((tag: any) => (
                      <div key={tag.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--bg-color)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-color)' }}>
                        <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{tag.name}</span>
                        <span style={{ backgroundColor: 'var(--accent-glow)', color: 'var(--accent-color)', padding: '0.125rem 0.375rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 600 }}>
                          {tag.count}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
