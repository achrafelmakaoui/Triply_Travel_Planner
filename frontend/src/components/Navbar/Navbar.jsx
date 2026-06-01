import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./Navbar.module.css";

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                <Link to="/" className={styles.logo}>
                    <span className={styles.logoMark}>✦</span>
                    <span className={styles.logoText}>Triply</span>
                </Link>
                <div className={styles.links}>
                    {user ? (
                        <>
                            <span className={styles.welcome}>Hi, {user.name}</span>
                            <Link to="/dashboard" className={styles.link}>Dashboard</Link>
                            <Link to="/trips" className={styles.link}>My trips</Link>
                            <Link to="/profile" className={styles.link}>Profile</Link>
                            <button onClick={handleLogout} className={styles.btnOutline}>Sign out</button>
                        </>
                    ) : (
                        <>
                            <Link to="/signin" className={styles.link}>Sign in</Link>
                            <Link to="/signup" className={styles.btnPrimary}>Get started</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
