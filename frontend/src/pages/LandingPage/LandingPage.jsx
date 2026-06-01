import styles from "./LandingPage.module.css";
import Hero from "../../components/Hero/Hero";

export default function LandingPage() {
    return (
        <main className={styles.main}>
            <Hero/>
        </main>
    );
}
