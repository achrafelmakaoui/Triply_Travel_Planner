import styles from "./LandingPage.module.css";
import Hero from "../../components/Hero/Hero";
import HowItWorks from "../../components/HowItWorks/HowItWorks";
import Features from "../../components/Features/Features";

export default function LandingPage() {
    return (
        <main className={styles.main}>
            <Hero/>
            <HowItWorks/>
            <Features/>
        </main>
    );
}
