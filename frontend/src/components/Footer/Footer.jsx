import React from 'react'
import styles from "./Footer.module.css";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <span>© {new Date().getFullYear()} Triply</span>
            <span>Crafted for curious travelers</span>
        </footer>
    )
}
