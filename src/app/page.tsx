"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LayoutDashboard, Sparkles, Zap, Shield, ArrowRight } from "lucide-react";
import styles from "./landing.module.css";

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <div className={styles.brand}>
          <div className={styles.brandIcon}>
            <LayoutDashboard size={20} />
          </div>
          Peblo
        </div>
        <div className={styles.navLinks}>
          <Link href="/login" className={styles.loginBtn}>Log In</Link>
          <Link href="/signup" className={styles.signupBtn}>Get Started</Link>
        </div>
      </nav>

      <main className={styles.main}>
        <motion.div 
          className={styles.hero}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className={styles.heroBadge} variants={itemVariants}>
            <Sparkles size={14} className={styles.sparkleIcon} />
            <span>AI-Powered Workspace</span>
          </motion.div>

          <motion.h1 className={styles.headline} variants={itemVariants}>
            Think clearly. <br />
            <span className={styles.gradientText}>Write brilliantly.</span>
          </motion.h1>

          <motion.p className={styles.subheadline} variants={itemVariants}>
            The ultimate minimalist workspace that automatically organizes your thoughts, 
            generates insights, and keeps you focused on what truly matters.
          </motion.p>

          <motion.div className={styles.ctaContainer} variants={itemVariants}>
            <Link href="/signup" className={styles.primaryCta}>
              Start writing for free <ArrowRight size={18} />
            </Link>
            <Link href="/login" className={styles.secondaryCta}>
              View evaluator demo
            </Link>
          </motion.div>
        </motion.div>

        {/* 3D Floating Element Area */}
        <motion.div 
          className={styles.visualContainer}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
        >
          <motion.div 
            className={styles.glassCard}
            animate={{ 
              y: [0, -15, 0],
              rotateX: [0, 2, 0],
              rotateY: [0, -2, 0]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 6,
              ease: "easeInOut" 
            }}
          >
            <div className={styles.mockHeader}>
              <div className={styles.mockDots}>
                <span className={styles.dot} style={{ backgroundColor: '#ef4444' }}></span>
                <span className={styles.dot} style={{ backgroundColor: '#f59e0b' }}></span>
                <span className={styles.dot} style={{ backgroundColor: '#10b981' }}></span>
              </div>
            </div>
            <div className={styles.mockBody}>
              <div className={styles.mockTitle}>Q3 Product Strategy</div>
              <div className={styles.mockLine} style={{ width: '80%' }}></div>
              <div className={styles.mockLine} style={{ width: '90%' }}></div>
              <div className={styles.mockLine} style={{ width: '60%' }}></div>
              
              <div className={styles.mockAiBlock}>
                <div className={styles.mockAiHeader}><Sparkles size={12} /> AI Summary</div>
                <div className={styles.mockLine} style={{ width: '100%', height: '4px' }}></div>
                <div className={styles.mockLine} style={{ width: '70%', height: '4px' }}></div>
              </div>
            </div>
          </motion.div>

          {/* Decorative Glowing Orbs */}
          <div className={styles.glowOrb1}></div>
          <div className={styles.glowOrb2}></div>
        </motion.div>

        <motion.div 
          className={styles.features}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.div className={styles.featureCard} variants={itemVariants}>
            <div className={styles.featureIcon}><Zap size={24} /></div>
            <h3>Lightning Fast</h3>
            <p>Debounced auto-saving ensures you never lose a single keystroke. Built for speed and focus.</p>
          </motion.div>

          <motion.div className={styles.featureCard} variants={itemVariants}>
            <div className={styles.featureIcon}><Sparkles size={24} /></div>
            <h3>Google Gemini AI</h3>
            <p>Automatically extract action items, generate summaries, and suggest smart titles from your raw notes.</p>
          </motion.div>

          <motion.div className={styles.featureCard} variants={itemVariants}>
            <div className={styles.featureIcon}><Shield size={24} /></div>
            <h3>Secure & Private</h3>
            <p>Your data belongs to you. Fully authenticated sessions with instant public sharing when you need it.</p>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
