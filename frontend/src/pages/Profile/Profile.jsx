import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import styles from "./Profile.module.css";

export default function Profile() {
    const { user } = useAuth();
    const [form, setForm] = useState({ name: user?.name || "" });
    const [success, setSuccess] = useState(false);

    const handleChange = (field, value) => {
      if (field === "name") {
        setForm((prev) => ({ ...prev, name: value }));
      }
      setSuccess(false);
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setSuccess(false);
      try {
        const { data } = await api.patch("/api/profile", {
          name: form.name,
        });
        const updatedUser = { ...user, name: data.name };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setSuccess(true);
      } catch (err) {
        console.log(err.response?.data?.message || "Failed to update profile.");
      }
    };

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Profile</h1>
                    <p className={styles.subtitle}>Manage your account</p>
                </div>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Account</h2>
                        <div className={styles.field}>
                            <label className={styles.label}>Full name</label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => handleChange("name", e.target.value)}
                                className={styles.input}
                                placeholder="Your name"
                                required
                            />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Email</label>
                            <input
                                type="email"
                                value={user?.email || ""}
                                className={`${styles.input} ${styles.inputDisabled}`}
                                disabled
                            />
                            <span className={styles.fieldHint}>Email cannot be changed</span>
                        </div>
                    </div>
                    {success && (
                        <div className={styles.successMsg}>Profile updated successfully</div>
                    )}
                    <button type="submit" className={styles.btnSave}>Save changes</button>
                </form>
            </div>
        </div>
    );
}