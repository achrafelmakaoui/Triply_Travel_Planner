import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./SignIn.module.css";

export default function SignIn() {
    const [form, setForm] = useState({ email: "", password: "" });
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
      setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await login(form.email, form.password);
        navigate("/dashboard");
      } catch (err) {
        console.log(err.response?.data?.message || "Something went wrong");
      }
    };

    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Welcome back</h1>
                    <p className={styles.subtitle}>Sign in to your account</p>
                </div>
                <form onSubmit={handleSubmit} className={styles.form}>
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
                        placeholder="••••••••"
                        className={styles.input}
                        required
                      />
                  </div>
                  <button type="submit" className={styles.btnSubmit}>Sign in</button>
                </form>
                <p className={styles.footer}>Don't have an account?{" "} <Link to="/signup" className={styles.footerLink}>Sign up</Link></p>
            </div>
        </div>
    );
}