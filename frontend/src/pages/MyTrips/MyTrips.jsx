import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import styles from "./MyTrips.module.css";

export default function MyTrips() {
    const [trips, setTrips] = useState([]);
    const [sharing, setSharing] = useState(null);
    const [shareLink, setShareLink] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
      fetchTrips();
    }, []);

    const fetchTrips = async () => {
      try {
        const { data } = await api.get("/api/trips");
        setTrips(data);
      } catch (err) {
        console.log("Failed to load trips.");
      }
    };

    const handleDelete = async (tripId) => {
      if (!window.confirm("Delete this trip?")) return;
      try {
        await api.delete(`/api/trips/${tripId}`);
        setTrips((prev) => prev.filter((t) => t._id !== tripId));
      } catch (err) {
        console.log("Failed to delete trip.");
      }
    };

    const handleShare = async (tripId) => {
      setSharing(tripId);
      setShareLink(null);
      try {
        const { data } = await api.patch(`/api/trips/${tripId}/share`);
        if (data.isPublic) {
          const link = `${window.location.origin}/trip/share/${data.shareId}`;
          setShareLink(link);
          setTrips((prev) =>
            prev.map((t) =>
              t._id === tripId ? { ...t, isPublic: true, shareId: data.shareId } : t
            )
          );
        } else {
          setTrips((prev) =>
            prev.map((t) =>
              t._id === tripId ? { ...t, isPublic: false } : t
            )
          );
          setShareLink(null);
        }
      } catch (err) {
        console.log("Failed to update sharing.");
      }
    };

    const copyLink = (link) => {
      navigator.clipboard.writeText(link);
      alert("Link copied to clipboard!");
    };

    const formatDate = (dateStr) => {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    };

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div>
                        <h1 className={styles.title}>My Trips</h1>
                        <p className={styles.subtitle}>{trips.length} saved {trips.length === 1 ? "itinerary" : "itineraries"}</p>
                    </div>
                    <Link to="/planner" className={styles.btnPrimary}>New trip</Link>
                </div>
                {shareLink && (
                    <div className={styles.shareBanner}>
                        <span className={styles.shareLabel}>🔗 Public link created:</span>
                        <code className={styles.shareUrl}>{shareLink}</code>
                        <button className={styles.btnCopy} onClick={() => copyLink(shareLink)}>Copy</button>
                        <button className={styles.bannerClose} onClick={() => setShareLink(null)}>✕</button>
                    </div>
                )}
                {trips.length === 0 ? (
                    <div className={styles.empty}>
                        <span className={styles.emptyIcon}>✈️</span>
                        <h3 className={styles.emptyTitle}>No trips yet</h3>
                        <p className={styles.emptyDesc}>Plan your first trip and save it to see it here.</p>
                        <Link to="/planner" className={styles.btnPrimary}>Plan a trip</Link>
                    </div>
                ) : (
                    <div className={styles.tripList}>
                        {trips.map((trip) => (
                            <div key={trip._id} className={styles.tripCard}>
                                <div className={styles.tripMain} onClick={() => navigate(`/trips/${trip._id}`)} style={{ cursor: "pointer" }}>
                                    <div className={styles.tripInfo}>
                                        <div className={styles.tripTitleRow}>
                                          <h3 className={styles.tripTitle}>{trip.title}</h3>
                                          {trip.isPublic && (
                                              <span className={styles.publicBadge}>Public</span>
                                          )}
                                        </div>
                                        <p className={styles.tripRequest}>{trip.request}</p>
                                        <span className={styles.tripDate}>{formatDate(trip.createdAt)}</span>
                                    </div>
                                    <div className={styles.tripSections}>
                                        {trip.result?.budgetBreakdown && (
                                            <span className={styles.sectionTag}>💰 Budget</span>
                                        )}
                                        {trip.result?.itinerary && (
                                            <span className={styles.sectionTag}>🗓️ Itinerary</span>
                                        )}
                                        {trip.result?.bookingSummary && (
                                            <span className={styles.sectionTag}>{trip.result?.bookingApproved ? "✅ Confirmed" : "❌ Cancelled"}</span>
                                        )}
                                    </div>
                                </div>
                                <div className={styles.tripActions}>
                                    <button className={styles.btnShare} onClick={() => handleShare(trip._id)} disabled={sharing === trip._id}>
                                        {sharing === trip._id ? "..." : trip.isPublic ? "🔓 Make private" : "🔗 Share"}
                                    </button>
                                    {trip.isPublic && trip.shareId && (
                                        <button className={styles.btnCopySmall} onClick={() => copyLink(`${window.location.origin}/trip/share/${trip.shareId}`)}>Copy link</button>
                                    )}
                                    <button className={styles.btnDelete} onClick={() => handleDelete(trip._id)}>Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
