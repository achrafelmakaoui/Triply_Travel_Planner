import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axios";
import styles from "./TripDetail.module.css";

export default function TripDetail() {
    const { id } = useParams();
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrip = async () => {
            try {
            const { data } = await api.get(`/api/trips/${id}`);
            setTrip(data);
            } catch (err) {
            console.log("Trip not found.");
            } finally {
            setLoading(false);
            }
        };
        fetchTrip();
    }, [id]);

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
                <Link to="/trips" className={styles.backLink}>My trips</Link>
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <div className={styles.titleRow}>
                            <h1 className={styles.title}>{trip.title}</h1>
                            {trip.isPublic && (
                                <span className={styles.publicBadge}>Public</span>
                            )}
                        </div>
                        <p className={styles.request}>{trip.request}</p>
                        <span className={styles.date}>Planned on {formatDate(trip.createdAt)}</span>
                    </div>
                </div>
                <div className={styles.statusBar}>
                    {trip.result?.destinationInfo && (
                        <div className={styles.statusItem}>
                            <span className={styles.statusIcon}>🔍</span>
                            <span>Research done</span>
                        </div>
                    )}
                    {trip.result?.budgetBreakdown && (
                        <div className={styles.statusItem}>
                            <span className={styles.statusIcon}>💰</span>
                            <span>Budget planned</span>
                        </div>
                    )}
                    {trip.result?.itinerary && (
                        <div className={styles.statusItem}>
                            <span className={styles.statusIcon}>🗓️</span>
                            <span>Itinerary built</span>
                        </div>
                    )}
                    {trip.result?.bookingSummary && (
                        <div className={`${styles.statusItem} ${trip.result.bookingApproved ? styles.statusApproved : styles.statusRejected}`}>
                            <span className={styles.statusIcon}>{trip.result.bookingApproved ? "✅" : "❌"}</span>
                            <span>{trip.result.bookingApproved ? "Booking confirmed" : "Booking cancelled"}</span>
                        </div>
                    )}
                </div>
                <div className={styles.blocks}>
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
                                <span className={styles.blockTitleIcon}>
                                    {trip.result.bookingApproved ? "✅" : "❌"}
                                </span>
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
                </div>
                <div className={styles.footer}>
                    <Link to="/planner" className={styles.btnNewTrip}>Plan another trip</Link>
                </div>
            </div>
        </div>
    );
}