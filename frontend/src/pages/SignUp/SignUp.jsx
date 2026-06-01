import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./SignUp.module.css";

export default function SignUp() {
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(form.name, form.email, form.password);
            navigate("/dashboard");
        } catch (err) {
            console.log(err.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Create your account</h1>
                    <p className={styles.subtitle}>Start planning smarter trips today</p>
                </div>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.field}>
                        <label className={styles.label}>Full name</label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Full Name"
                            className={styles.input}
                            required
                        />
                    </div>
                    <div className={styles.field}>
                        <label className={styles.label}>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            className={styles.input}
                            required
                        />
                    </div>
                    <div className={styles.field}>
                        <label className={styles.label}>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Min 6 characters"
                            className={styles.input}
                            required
                        />
                    </div>
                    <button type="submit" className={styles.btnSubmit}>Create account</button>
                </form>
                <p className={styles.footer}>Already have an account?{" "} <Link to="/signin" className={styles.footerLink}>Sign in</Link></p>
            </div>
        </div>
    );
}