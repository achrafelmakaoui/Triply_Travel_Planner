import React from 'react'
import styles from "./HowItWorks.module.css";

const steps = [
    { key: "01", title: "Describe your trip", desciption: "Tell us where, when, with whom, and your budget in plain language." },
    { key: "02", title: "Agents go to work",  desciption: "Research, budget, and itinerary agents collaborate in real time." },
    { key: "03", title: "Review & approve",   desciption: "You see every detail. Tweak anything. Approve when it feels right." },
];

export default function HowItWorks() {
    return (
        <section id="how" className={styles.steps}>
            <p className={styles.eyebrow}>How it works</p>
            <h2 className={styles.sectionTitle}>Three steps to your next adventure.</h2>
            <div className={styles.stepGrid}>
                {steps.map((step) => (
                    <div key={step.key} className={styles.step}>
                        <span className={styles.stepK}>{step.key}</span>
                        <h3 className={styles.stepT}>{step.title}</h3>
                        <p className={styles.stepD}>{step.desciption}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}