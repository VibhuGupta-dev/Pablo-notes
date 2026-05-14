"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../auth.module.css";
import { Loader2, LayoutDashboard, Sparkles, Zap, Shield } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to sign up");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.splitContainer}>
      {/* Left Marketing Section */}
      <div className={styles.marketingSection}>
        <div className={styles.marketingContent}>
          <div className={styles.brand}>
            <div className={styles.brandIcon}>
              <LayoutDashboard size={24} />
            </div>
            Peblo
          </div>
          
          <h1 className={styles.headline}>
            Think clearly.<br />
            <span className="gradient-text">Write brilliantly.</span>
          </h1>
          
          <p className={styles.subheadline}>
            The AI-powered workspace that organizes your thoughts, generates insights, and keeps you focused on what matters most.
          </p>

          <div className={styles.featureList}>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}><Sparkles size={20} /></div>
              <span>AI-generated summaries & action items</span>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}><Zap size={20} /></div>
              <span>Lightning fast, auto-saving editor</span>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}><Shield size={20} /></div>
              <span>Secure, private, and yours</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Section */}
      <div className={styles.formSection}>
        <div className={`${styles.card} glass-panel`}>
          <h2 className={styles.title}>Create an account</h2>
          <p className={styles.subtitle}>Start taking AI-powered notes today</p>

          {error && (
            <div className={styles.error}>
              <Shield size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="name" className={styles.label}>Full Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={styles.input}
                placeholder="Jane Doe"
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="email" className={styles.label}>Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="password" className={styles.label}>Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                placeholder="Create a strong password"
                required
                minLength={6}
              />
            </div>

            <button type="submit" className={styles.button} disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Get Started"}
            </button>
          </form>

          <p className={styles.linkText}>
            Already have an account? <Link href="/login" className={styles.link}>Log in instead</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
