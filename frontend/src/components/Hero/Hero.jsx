import React from 'react'
import { useAuth } from "../../context/AuthContext";
import { Link } from 'react-router-dom';
import styles from "./Hero.module.css";

export default function Hero() {
    const { user } = useAuth();
    return (
        <section className={styles.hero}>
            <div className={styles.heroContent}>
                <span className={styles.badge}>✦ Triply - Travel Planner</span>
                <h1 className={styles.title}>
                    Plan your perfect trip <span className={styles.titleAccent}>in seconds.</span>
                </h1>
                <p className={styles.subtitle}>
                    Describe your dream trip in plain language. A team of AI agents handles the
                    research, budget, and itinerary - you just approve.
                </p>
                <div className={styles.cta}>
                    {user ? (
                        <Link to="/dashboard" className={styles.btnPrimary}>Go to Dashboard</Link>
                    ) : (
                    <>
                        <Link to="/signup" className={styles.btnPrimary}>Start planning for free →</Link>
                        <Link to="/signin" className={styles.btnSecondary}>Sign in</Link>
                    </>
                    )}
                </div>
            </div>
            <div className={styles.heroVisual}>
                <div className={styles.postcard}>
                    <div className={styles.postcardImg} />
                    <div className={styles.postcardMeta}>
                        <span>MARRAKECH · MA</span>
                        <span>31° ☀</span>
                    </div>
                </div>

                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <span className={styles.dot} />
                        <span className={styles.dot} style={{ background: "#fbbf24" }} />
                        <span className={styles.dot} style={{ background: "#34d399" }} />
                        <span className={styles.cardTitle}>agents.live</span>
                    </div>
                    {[
                        { b: "🔍 Researcher", s: "Searching Marrakech…", on: true },
                        { b: "💰 Budget",     s: "Calculating costs…",    on: true },
                        { b: "🗓️ Itinerary",  s: "Building day plan…",    on: true },
                        { b: "✅ Booking",    s: "Awaiting approval…",    on: false },
                    ].map((a, i) => (
                        <div key={i} className={styles.agentLine} style={{ opacity: a.on ? 1 : 0.45 }}>
                            <span className={styles.agentBadge}>{a.b}</span>
                            <span className={styles.agentStatus}>
                                {a.on && <span className={styles.pulse} />} {a.s}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
