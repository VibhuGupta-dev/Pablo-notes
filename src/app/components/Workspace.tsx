"use client";

import { useState, useEffect, useRef } from "react";
import useSWR from "swr";
import styles from "../dashboard.module.css";
import { Plus, Search, LogOut, Loader2, Sparkles, Share2, Tag, Save, LayoutDashboard, Eye, Edit2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function Workspace() {
  const router = useRouter();
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeNote, setActiveNote] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string>("");
  const [newTag, setNewTag] = useState("");
  const [isFetchingNote, setIsFetchingNote] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { data: notesData, mutate: mutateNotes } = useSWR(`/api/notes${searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ""}`, fetcher);
  const { data: userData } = useSWR("/api/auth/me", fetcher);

  useEffect(() => {
    if (activeNoteId) {
      setIsFetchingNote(true);
      fetch(`/api/notes/${activeNoteId}`)
        .then(res => res.json())
        .then(data => {
          if (data.note) {
            setActiveNote({
              ...data.note,
              tags: JSON.parse(data.note.tags || "[]"),
              actionItems: data.note.actionItems ? JSON.parse(data.note.actionItems) : []
            });
          }
        })
        .finally(() => setIsFetchingNote(false));
    } else {
      setActiveNote(null);
    }
  }, [activeNoteId]);

  const handleCreateNote = async () => {
    const res = await fetch("/api/notes", { method: "POST", body: JSON.stringify({}) });
    const data = await res.json();
    if (data.note) {
      mutateNotes();
      setActiveNoteId(data.note.id);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const saveNote = async (updates: any) => {
    if (!activeNoteId) return;
    setIsSaving(true);
    setSaveStatus("Saving...");
    
    // Optimistic UI
    setActiveNote((prev: any) => ({ ...prev, ...updates }));

    try {
      await fetch(`/api/notes/${activeNoteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates)
      });
      setSaveStatus("Saved");
      mutateNotes();
    } catch {
      setSaveStatus("Failed to save");
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus(""), 2000);
    }
  };

  // Debounced content change
  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeNote && (activeNote.title !== undefined || activeNote.content !== undefined)) {
        saveNote({
          title: activeNote.title,
          content: activeNote.content,
          tags: activeNote.tags,
        });
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [activeNote?.title, activeNote?.content, activeNote?.tags]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + N: New Note
      if ((e.metaKey || e.ctrlKey) && e.key === "n") {
        e.preventDefault();
        handleCreateNote();
      }
      // Cmd/Ctrl + S: Force Save
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        if (activeNoteId && activeNote) {
          saveNote({
            title: activeNote.title,
            content: activeNote.content,
            tags: activeNote.tags,
          });
        }
      }
      // Cmd/Ctrl + F: Focus Search
      if ((e.metaKey || e.ctrlKey) && e.key === "f") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      // Cmd/Ctrl + /: Generate AI
      if ((e.metaKey || e.ctrlKey) && e.key === "/") {
        e.preventDefault();
        if (!isGenerating && activeNote?.content) {
          generateAI();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeNoteId, activeNote, isGenerating]);

  const handleTagAdd = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newTag.trim()) {
      e.preventDefault();
      const tags = activeNote.tags || [];
      if (!tags.includes(newTag.trim())) {
        saveNote({ tags: [...tags, newTag.trim()] });
      }
      setNewTag("");
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    const tags = activeNote.tags.filter((t: string) => t !== tagToRemove);
    saveNote({ tags });
  };

  const generateAI = async () => {
    if (!activeNoteId || !activeNote?.content) return;
    setIsGenerating(true);
    try {
      const res = await fetch(`/api/notes/${activeNoteId}/ai`, { method: "POST" });
      const data = await res.json();
      if (data.note) {
        setActiveNote({
          ...data.note,
          tags: JSON.parse(data.note.tags || "[]"),
          actionItems: data.note.actionItems ? JSON.parse(data.note.actionItems) : []
        });
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async () => {
    if (!activeNoteId) return;
    const isPublic = !activeNote.isPublic;
    const shareId = isPublic ? Math.random().toString(36).substring(2, 10) : null;
    await saveNote({ isPublic, shareId });
  };

  return (
    <div className={`${styles.layout} ${activeNoteId ? styles.mobileNoteActive : styles.mobileListActive}`}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>
              <LayoutDashboard size={18} color="white" />
            </div>
            Peblo Notes
          </div>
          <button className={styles.newNoteBtn} onClick={handleCreateNote}>
            <Plus size={20} />
          </button>
        </div>
        
        <div className={styles.searchContainer}>
          <div className={styles.searchWrapper}>
            <Search size={16} className={styles.searchIcon} />
            <input
              ref={searchInputRef}
              type="text"
              className={styles.searchInput}
              placeholder="Search notes... (⌘F)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.notesList}>
          {!notesData ? (
            // Skeleton Loader for Notes List
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className={styles.noteItemSkeleton}>
                <div className="skeleton" style={{ height: '14px', width: '70%', marginBottom: '8px' }} />
                <div className="skeleton" style={{ height: '10px', width: '90%', marginBottom: '12px' }} />
                <div className="skeleton" style={{ height: '10px', width: '40%' }} />
              </div>
            ))
          ) : notesData.notes.length === 0 ? (
            <div className={styles.emptyList}>No notes found.</div>
          ) : (
            notesData.notes.map((note: any) => (
              <div
                key={note.id}
                className={`${styles.noteItem} ${activeNoteId === note.id ? styles.noteItemActive : ""}`}
                onClick={() => setActiveNoteId(note.id)}
              >
                <div className={styles.noteTitle}>{note.title}</div>
                <div className={styles.notePreview}>{note.content?.substring(0, 50) || "Empty note"}</div>
                <div className={styles.noteMeta}>
                  <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                  {note.isPublic && <Share2 size={12} className={styles.shareIconActive} />}
                </div>
              </div>
            ))
          )}
        </div>

        <div className={styles.sidebarFooter}>
          <div className={styles.userProfile}>
            <div className={styles.userAvatar}>
              {userData?.user?.name?.charAt(0) || "U"}
            </div>
            <div className={styles.userName}>
              {userData?.user?.name || userData?.user?.email}
            </div>
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <LogOut size={14} /> Log out
          </button>
          <Link href="/insights" className={styles.insightsLink}>
            <Sparkles size={14} /> View Insights
          </Link>
        </div>
      </div>

      {/* Editor Area */}
      <div className={styles.editorArea}>
        {!activeNoteId ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateIcon}>
              <LayoutDashboard size={48} />
            </div>
            <h2>Welcome to Peblo</h2>
            <p>Select a note from the sidebar or create a new one to get started.</p>
          </div>
        ) : isFetchingNote ? (
          // Skeleton Loader for Editor
          <div className={styles.editorSkeleton}>
             <div className={styles.editorHeaderSkeleton}>
               <div className="skeleton" style={{ height: '32px', width: '300px' }} />
             </div>
             <div className={styles.contentAreaSkeleton}>
               <div className={styles.mainEditorSkeleton}>
                 <div className="skeleton" style={{ height: '20px', width: '100%', marginBottom: '16px' }} />
                 <div className="skeleton" style={{ height: '20px', width: '90%', marginBottom: '16px' }} />
                 <div className="skeleton" style={{ height: '20px', width: '95%', marginBottom: '16px' }} />
                 <div className="skeleton" style={{ height: '20px', width: '60%', marginBottom: '16px' }} />
               </div>
               <div className={styles.sidePanelSkeleton}>
                 <div className="skeleton" style={{ height: '200px', width: '100%', borderRadius: '12px' }} />
               </div>
             </div>
          </div>
        ) : activeNote ? (
          <>
            <div className={styles.editorHeader}>
              <input
                className={styles.titleInput}
                value={activeNote.title}
                onChange={(e) => setActiveNote({ ...activeNote, title: e.target.value })}
                placeholder="Note title"
              />
              <div className={styles.editorHeaderActions}>
                <button 
                  className={styles.mobileBackBtn} 
                  onClick={() => setActiveNoteId(null)}
                >
                  ← Back
                </button>
                {saveStatus && (
                  <span className={`${styles.saveStatus} ${saveStatus === "Saved" ? styles.savedText : ""}`}>
                    {saveStatus === "Saving..." ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                    {saveStatus}
                  </span>
                )}
                <button 
                  className={`${styles.actionBtn} ${previewMode ? styles.active : ""}`}
                  onClick={() => setPreviewMode(!previewMode)}
                  title="Toggle Preview"
                >
                  {previewMode ? <Edit2 size={16} /> : <Eye size={16} />}
                  <span>{previewMode ? "Edit" : "Preview"}</span>
                </button>
                <button 
                  className={`${styles.actionBtn} ${activeNote.isPublic ? styles.active : ""}`}
                  onClick={handleShare}
                  title="Share to web"
                >
                  <Share2 size={16} />
                  {activeNote.isPublic ? <span>Shared Link Active</span> : <span>Share Note</span>}
                </button>
              </div>
            </div>

            <div className={styles.contentArea}>
              <div className={styles.mainEditor}>
                {activeNote.isPublic && activeNote.shareId && (
                  <div className={styles.publicLinkBanner}>
                    <span className={styles.publicLinkLabel}>Public Link:</span>
                    <a href={`/share/${activeNote.shareId}`} target="_blank" rel="noreferrer" className={styles.publicLink}>
                      {(process.env.NEXT_PUBLIC_APP_URL || window.location.origin)}/share/{activeNote.shareId}
                    </a>
                  </div>
                )}
                
                {previewMode ? (
                  <div className={styles.markdownPreview}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {activeNote.content || "*Empty note*"}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <textarea
                    className={styles.contentInput}
                    value={activeNote.content}
                    onChange={(e) => setActiveNote({ ...activeNote, content: e.target.value })}
                    placeholder="Start typing your note here... (Markdown supported)"
                  />
                )}
              </div>

              <div className={`${styles.sidePanel} glass-panel`}>
                <div className={styles.panelSection}>
                  <div className={styles.panelTitle}>
                    <span>Tags</span>
                    <Tag size={14} />
                  </div>
                  <div className={styles.tagList}>
                    {activeNote.tags?.map((tag: string) => (
                      <span key={tag} className={styles.tag}>
                        {tag}
                        <span className={styles.tagRemove} onClick={() => handleTagRemove(tag)}>×</span>
                      </span>
                    ))}
                    <input
                      className={styles.tagInput}
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={handleTagAdd}
                      placeholder="+ Add tag"
                    />
                  </div>
                </div>

                <div className={styles.panelSection}>
                  <div className={styles.panelTitle}>
                    <span>AI Assistant</span>
                    <Sparkles size={14} className={styles.sparkleIcon} />
                  </div>
                  <button 
                    className={styles.generateBtn} 
                    onClick={generateAI} 
                    disabled={isGenerating || !activeNote.content.trim()}
                    title="Generate AI Insights (⌘/)"
                  >
                    {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                    {isGenerating ? "Analyzing content..." : "Generate Insights"}
                  </button>

                  {(activeNote.summary || activeNote.actionItems?.length > 0 || activeNote.suggestedTitle) && (
                    <div className={styles.aiBlock}>
                      {activeNote.suggestedTitle && (
                        <div className={styles.aiSection}>
                          <span className={styles.aiSectionLabel}>Suggested Title</span>
                          <div className={styles.aiTitleRow}>
                            <span className={styles.aiTitle}>{activeNote.suggestedTitle}</span>
                            <button 
                              className={styles.aiUseBtn}
                              onClick={() => saveNote({ title: activeNote.suggestedTitle })}>
                              Apply
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {activeNote.summary && (
                        <div className={styles.aiSection}>
                          <span className={styles.aiSectionLabel}>Summary</span>
                          <div className={styles.aiSummary}>{activeNote.summary}</div>
                        </div>
                      )}

                      {activeNote.actionItems?.length > 0 && (
                        <div className={styles.aiSection}>
                          <span className={styles.aiSectionLabel}>Action Items</span>
                          <ul className={styles.aiActionItems}>
                            {activeNote.actionItems.map((item: string, idx: number) => (
                              <li key={idx} className={styles.aiActionItem}>
                                <input type="checkbox" className={styles.aiCheckbox} />
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
          </>
        ) : null}
      </div>
    </div>
  );
}
