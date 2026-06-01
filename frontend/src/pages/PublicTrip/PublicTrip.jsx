import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import styles from "./PublicTrip.module.css";

export default function PublicTrip() {
    const { shareId } = useParams();
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchTrip = async () => {
        try {
          const response = await fetch(
            `http://localhost:5000/api/trips/share/${shareId}`
          );
          if (!response.ok) throw new Error("Trip not found");
          const data = await response.json();
          setTrip(data);
        } catch (err) {
          console.log("This trip doesn't exist or is no longer public.");
        } finally {
        setLoading(false);
      }
      };
      fetchTrip();
    }, [shareId]);

    const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    if (loading) {
      return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.center}>
                    <div className={styles.spinner}></div>
                    <p className={styles.loadingText}>Loading trip details…</p>
                </div>
            </div>
        </div>
      );
    }

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.tripMeta}>
                        <h1 className={styles.title}>{trip.title}</h1>
                        <p className={styles.request}>{trip.request}</p>
                        <span className={styles.date}>Planned on {formatDate(trip.createdAt)}</span>
                    </div>
                </div>

                {trip.result?.destinationInfo && (
                    <details className={styles.block} open>
                        <summary className={styles.blockTitle}>
                            <span className={styles.blockTitleIcon}>🔍</span>
                            <span>Destination research</span>
                            <span className={styles.blockArrow}>▸</span>
                        </summary>
                        <div className={styles.blockContent}>
                            <p className={styles.blockText}>{trip.result.destinationInfo}</p>
                        </div>
                    </details>
                )}

                {trip.result?.budgetBreakdown && (
                    <details className={styles.block} open>
                        <summary className={styles.blockTitle}>
                            <span className={styles.blockTitleIcon}>💰</span>
                            <span>Budget breakdown</span>
                            <span className={styles.blockArrow}>▸</span>
                        </summary>
                        <div className={styles.blockContent}>
                            <p className={styles.blockText}>{trip.result.budgetBreakdown}</p>
                        </div>
                    </details>
                )}

                {trip.result?.itinerary && (
                    <details className={styles.block} open>
                        <summary className={styles.blockTitle}>
                            <span className={styles.blockTitleIcon}>🗓️</span>
                            <span>Day-by-day itinerary</span>
                            <span className={styles.blockArrow}>▸</span>
                        </summary>
                        <div className={styles.blockContent}>
                            <p className={styles.blockText}>{trip.result.itinerary}</p>
                        </div>
                    </details>
                )}

                {trip.result?.bookingSummary && (
                    <details className={styles.block} open>
                        <summary className={styles.blockTitle}>
                            <span className={styles.blockTitleIcon}>{trip.result.bookingApproved ? "✅" : "❌"}</span>
                            <span>Booking summary</span>
                            <span className={styles.blockArrow}>▸</span>
                        </summary>
                        <div className={styles.blockContent}>
                            <p className={styles.blockText}>{trip.result.bookingSummary}</p>
                            <div className={`${styles.bookingStatus} ${trip.result.bookingApproved ? styles.bookingApproved : styles.bookingRejected}`}>
                                {trip.result.bookingApproved ? "You confirmed this booking" : "You cancelled this booking"}
                            </div>
                        </div>
                    </details>
                )}
                <section className={styles.cta}>
                    <div className={styles.ctaInner}>
                        <h2 className={styles.titleCta}>Want to plan your own trip?</h2>
                        <Link to="/signup" className={styles.btnCta}>Start for free →</Link>
                    </div>
                </section>
            </div>
        </div>
    );
}