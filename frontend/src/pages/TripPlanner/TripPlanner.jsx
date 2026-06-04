import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import styles from "./TripPlanner.module.css";
import ReactMarkdown from "react-markdown";

const AGENT_LABELS = {
  supervisor: { label: "Supervisor", icon: "🧠" },
  researcher: { label: "Researcher", icon: "🔍" },
  budget: { label: "Budget", icon: "💰" },
  itinerary: { label: "Itinerary", icon: "🗓️" },
  booking: { label: "Booking", icon: "✅" },
};
const EXAMPLE_PROMPTS = [
  "5 days in Marrakech for 2 people, budget 800 EUR, food and culture",
  "3 days in Lisbon with my partner, budget 600 EUR, history and local food",
  "Week in Barcelona, family of 4, budget 2500 EUR, kid-friendly",
  "4 days in Paris, romantic trip, budget 2000 EUR, fine dining",
];
const STAGE = {
  INPUT: "input",
  STREAMING: "streaming",
  APPROVAL: "approval",
  DONE: "done",
};
export default function TripPlanner() {
    const [request, setRequest] = useState("");
    const [stage, setStage] = useState(STAGE.INPUT);
    const [activeAgent, setActiveAgent] = useState(null);
    const [completedAgents, setCompletedAgents] = useState([]);
    const [approvalData, setApprovalData] = useState(null);
    const [result, setResult] = useState(null);
    const [threadId, setThreadId] = useState(null);
    const [saving, setSaving] = useState(false);
    const eventSourceRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
      const currentEventSource = eventSourceRef.current;

      return () => {
        currentEventSource?.close();
      };
    }, []);

    const startPlanning = async () => {
      if (!request.trim()) return;
      setStage(STAGE.STREAMING);
      setActiveAgent(null);
      setCompletedAgents([]);
      setResult(null);
      try {
        const response = await fetch("http://localhost:5000/api/plan/stream", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ user_request: request }),
        });
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        const read = async () => {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const text = decoder.decode(value);
            const lines = text.split("\n");
            for (const line of lines) {
              if (!line.startsWith("data: ")) continue;
              try {
                const data = JSON.parse(line.slice(6));
                handleSSEEvent(data);
              } catch (e) {
                // skip
              }
            }
          }
        };
        read();
      } catch (err) {
        console.log("Failed to connect to the AI service. Make sure both servers are running.");
        setStage(STAGE.INPUT);
      }
    };

    const handleSSEEvent = (data) => {
      switch (data.type) {
        case "thread_started":
          setThreadId(data.thread_id);
          break;
        case "agent_done":
          if (data.agent !== "supervisor") {
            setActiveAgent(data.agent);
            setCompletedAgents((prev) => {
              if (!prev.includes(data.agent)) return [...prev, data.agent];
              return prev;
            });
          }
          break;
        case "approval_required":
          setThreadId(data.thread_id);
          setApprovalData(data);
          setActiveAgent(null);
          setStage(STAGE.APPROVAL);
          break;
        case "completed":
          setResult(data.result);
          setThreadId(data.thread_id);
          setActiveAgent(null);
          setStage(STAGE.DONE);
          break;
        case "error":
          console.log(data.message);
          setStage(STAGE.INPUT);
          break;
        default:
          break;
      }
    };

    const handleApproval = async (decision) => {
      try {
        const response = await api.post("/api/plan/resume", {
          thread_id: threadId,
          decision,
        });
        setResult(response.data.result);
        setStage(STAGE.DONE);
      } catch (err) {
        console.log("Failed to process decision. Try again.");
      }
    };

    const handleSave = async () => {
      if (!result) return;
      setSaving(true);
      try {
        await api.post("/api/trips", {
          title: request.slice(0, 80),
          request,
          result: {
            destinationInfo: result.destination_info,
            budgetBreakdown: result.budget_breakdown,
            itinerary: result.itinerary,
            bookingSummary: result.booking_summary,
            bookingApproved: result.booking_approved,
          },
          threadId,
        });
        navigate("/dashboard");
      } catch (err) {
        console.log("Failed to save trip.");
      } finally {
        setSaving(false);
      }
    };

    const reset = () => {
      setStage(STAGE.INPUT);
      setRequest("");
      setActiveAgent(null);
      setCompletedAgents([]);
      setResult(null);
      setApprovalData(null);
      setThreadId(null);
    };

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Plan your next escape</h1>
                    <p className={styles.subtitle}>Describe your trip and watch our AI agents craft it in real time.</p>
                </div>
                {stage === STAGE.INPUT && (
                    <div className={styles.card}>
                        <textarea
                          className={styles.textarea} value={request} onChange={(e) => setRequest(e.target.value)}
                          placeholder="5 days in Marrakech for 2 people, budget 800 EUR, focused on food and culture"
                          rows={5}
                        />
                        <div className={styles.examples}>
                            <span className={styles.examplesLabel}>Try one of these</span>
                            <div className={styles.exampleList}>
                                {EXAMPLE_PROMPTS.map((p) => (
                                    <button key={p} className={styles.exampleChip} onClick={() => setRequest(p)}>{p}</button>
                                ))}
                            </div>
                        </div>
                        <button className={styles.btnPrimary}onClick={startPlanning} disabled={!request.trim()}>Start planning</button>
                    </div>
                )}
                {stage === STAGE.STREAMING && (
                    <div className={styles.card}>
                        <div className={styles.streamingHeader}>
                            <div className={styles.pulseDot}></div>
                            <p className={styles.streamingTitle}>Agents working on your trip…</p>
                        </div>
                        <div className={styles.agentList}>
                            {["researcher", "budget", "itinerary", "booking"].map((agent) => {
                                const isActive = activeAgent === agent;
                                const isDone = completedAgents.includes(agent);
                                const info = AGENT_LABELS[agent];
                                return (
                                  <div key={agent} className={`${styles.agentRow} ${isActive ? styles.agentActive : ""} ${isDone ? styles.agentDone : ""}`}>
                                      <span className={styles.agentIcon}>{info.icon}</span>
                                      <span className={styles.agentName}>{info.label}</span>
                                      <span className={styles.agentState}> {isDone ? "✓ Done" : isActive ? "Working…" : "Waiting"}</span>
                                  </div>
                                );
                            })}
                        </div>
                    </div>
                )}
                {stage === STAGE.APPROVAL && approvalData && (
                    <div className={styles.card}>
                        <div className={styles.approvalHeader}>
                            <span className={styles.approvalIcon}>⚠️</span>
                            <h2 className={styles.approvalTitle}>Review your booking</h2>
                            <p className={styles.approvalSubtitle}>Please review the booking summary before confirming.</p>
                        </div>
                        <div className={styles.approvalContent}>
                            <ReactMarkdown>{approvalData.booking_summary}</ReactMarkdown>
                        </div>
                        <div className={styles.approvalButtons}>
                            <button className={styles.btnApprove} onClick={() => handleApproval("yes")}>Confirm booking</button>
                            <button className={styles.btnReject} onClick={() => handleApproval("no")}>Cancel</button>
                        </div>
                    </div>
                )}
                {stage === STAGE.DONE && result && (
                    <div className={styles.resultWrap}>
                        <div className={styles.resultHeader}>
                            <div>
                                <h2 className={styles.resultTitle}>Your trip is ready</h2>
                            </div>
                            <div className={styles.resultActions}>
                                <button className={styles.btnPrimary} onClick={handleSave} disabled={saving}>{saving ? "Saving…" : "Save trip"}</button>
                                <button className={styles.btnOutline} onClick={reset}>Plan another</button>
                            </div>
                        </div>
                        <div className={styles.blocks}>
                            {result.destination_info && (
                                <details className={styles.block} open>
                                    <summary className={styles.blockTitle}>
                                        <span className={styles.blockTitleIcon}>🔍</span>
                                        <span>Destination research</span>
                                        <span className={styles.blockArrow}>▸</span>
                                    </summary>
                                    <div className={styles.blockContent}>
                                        <ReactMarkdown>{result.destination_info}</ReactMarkdown>
                                    </div>
                                </details>
                            )}
                            {result.budget_breakdown && (
                                <details className={styles.block} open>
                                    <summary className={styles.blockTitle}>
                                        <span className={styles.blockTitleIcon}>💰</span>
                                        <span>Budget breakdown</span>
                                        <span className={styles.blockArrow}>▸</span>
                                    </summary>
                                    <div className={styles.blockContent}>
                                        <ReactMarkdown>{result.budget_breakdown}</ReactMarkdown>
                                    </div>
                                </details>
                            )}
                            {result.itinerary && (
                                <details className={styles.block} open>
                                    <summary className={styles.blockTitle}>
                                        <span className={styles.blockTitleIcon}>🗓️</span>
                                        <span>Day-by-day itinerary</span>
                                        <span className={styles.blockArrow}>▸</span>
                                    </summary>
                                    <div className={styles.blockContent}>
                                        <ReactMarkdown>{result.itinerary}</ReactMarkdown>
                                    </div>
                                </details>
                            )}
                            {result.booking_summary && (
                                <details className={styles.block} open>
                                    <summary className={styles.blockTitle}>
                                        <span className={styles.blockTitleIcon}>✅</span>
                                        <span>Booking summary</span>
                                        <span className={styles.blockArrow}>▸</span>
                                    </summary>
                                    <div className={styles.blockContent}>
                                        <ReactMarkdown>{result.booking_summary}</ReactMarkdown>
                                        {result.booking_approved !== undefined && (
                                            <div className={`${styles.bookingStatus} ${result.booking_approved ? styles.bookingApproved : styles.bookingRejected}`}>
                                                {result.booking_approved ? "Confirmed" : "Cancelled"}
                                            </div>
                                        )}
                                    </div>
                                </details>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}