import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
    const { user } = useAuth();
    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div>
                        <h1 className={styles.title}>Good day, {user?.name} 👋</h1>
                        <p className={styles.subtitle}>Ready to plan your next adventure?</p>
                    </div>
                    <Link to="/planner" className={styles.btnPrimary}>New trip</Link>
                </div>
                <div className={styles.grid}>
                    <div className={styles.card}>
                        <span className={styles.cardIcon}>✈️</span>
                        <h3 className={styles.cardTitle}>Plan a trip</h3>
                        <p className={styles.cardDesc}>Describe your dream destination and let our AI agents build a complete itinerary for you.</p>
                        <Link to="/planner" className={styles.cardLink}>Start planning</Link>
                    </div>
                    <div className={styles.card}>
                        <span className={styles.cardIcon}>🗂️</span>
                        <h3 className={styles.cardTitle}>My trips</h3>
                        <p className={styles.cardDesc}>View and manage all your saved itineraries. Share them publicly with a link.</p>
                        <Link to="/trips" className={styles.cardLink}>View my trips</Link>
                    </div>
                    <div className={styles.card}>
                        <span className={styles.cardIcon}>👤</span>
                        <h3 className={styles.cardTitle}>Profile</h3>
                        <p className={styles.cardDesc}>Set your travel preferences budget, style, and currency.</p>
                        <Link to="/profile" className={styles.cardLink}>Edit profile</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
