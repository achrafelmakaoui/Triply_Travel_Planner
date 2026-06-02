import React from 'react'
import { Link } from 'react-router-dom'
import styles from "./Cta.module.css";

export default function Cta() {
    return (
        <section className={styles.ctaSection}>
            <div className={styles.ctaInner}>
                <h2 className={styles.ctaTitle}>Ready to travel smarter?</h2>
                <p className={styles.ctaSubtitle}>Join travelers planning trips in minutes, not days.</p>
                <Link to="/signup" className={styles.btnPrimaryLg}>Create your free account</Link>
            </div>
        </section>
    )
}
