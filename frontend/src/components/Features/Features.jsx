import React from 'react'
import styles from "./Features.module.css";

const features = [
  { icon: "🔍", title: "AI Research Agent", desciption: "Scouts attractions, culture, and hidden local gems for your destination." },
  { icon: "💰", title: "Budget Planner",    desciption: "Smart cost breakdowns tailored to your budget with real local prices." },
  { icon: "🗓️", title: "Day-by-Day Itinerary", desciption: "Detailed daily plans built around your interests and pace." },
  { icon: "✅", title: "Human Approval",    desciption: "You stay in control review and approve before anything is booked." },
];

export default function Features() {
    return (
        <section id="features" className={styles.features}>
            <p className={styles.eyebrow}>What's inside</p>
            <h2 className={styles.sectionTitle}>A crew of agents, working for you.</h2>
            <div className={styles.featureGrid}>
                {features.map((feature) => (
                    <div key={feature.title} className={styles.featureCard}>
                        <span className={styles.featureIcon}>{feature.icon}</span>
                        <h3 className={styles.featureTitle}>{feature.title}</h3>
                        <p className={styles.featureDesc}>{feature.desciption}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}
