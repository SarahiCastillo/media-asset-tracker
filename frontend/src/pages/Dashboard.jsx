// Fetches /v1/api/stats on every mount so counts
// always reflects current state.

import { useState, useEffect } from "react";
import { api } from "../api";

const STATUS_ORDER = [
    "ingested",
    "qc_pending",
    "qc_passed",
    "qc_failed",
    "encoding",
    "delivered",
    "failed",
];

const CARD_COLORS = {
    ingested:   "#0ea5e9",
    qc_pending: "#f59e0b",
    qc_passed:  "#22c55e",
    qc_failed:  "#ef4444",
    encoding:   "#8b5cf6",
    delivered:  "#10b981",
    failed:     "#f43f5e", 
};

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.getStats()
            .then(setStats)
            .catch(() => setError("Could not load stats. Verify if backend is running."))
            .finally(() => setLoading(false));
    }, []);

    if (error) return <p style={{ color: "red"}}>{error}</p>;
    if(!stats) return <p>Loading stats...</p>;
    
    if (loading) return (
        <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 10, 
            color: "#64748b", 
            marginTop: 40 
        }}>
            <div style={{
                width: 20, 
                height: 20, 
                border: "3px solid #e2e8f0",
                borderTop: "3px solid #0ea5e9", 
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
            }} />
            Loading…
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );

    return (
        <div>
            <h1 style={{ marginBottom: 24, fontSize: "1.5rem", color: "#1e293b"}}>
                Pipeline Overview
            </h1>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                {STATUS_ORDER.map((status) => (
                    <div key={status} style={{
                        background: "#fff",
                        border: `3px solid ${CARD_COLORS[status]}`,
                        borderRadius: 12,
                        padding: "20px 28px",
                        minWidth: 140,
                        textAlign: "center",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                    }}>
                        <div style={{ 
                            fontSize: "2rem",
                            fontWeight: 700,
                            color: CARD_COLORS[status],
                        }}>
                            {stats.assets_by_status[status] ?? 0}
                        </div>
                        <div style={{ 
                            fontSize: "0.78rem",
                            fontWeight: 600,
                            color: "#64748b",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            marginTop: 6,
                        }}>
                            {status.replace(/_/g, " ")}
                        </div>
                    </div>
                ))}
            </div>
            <p style={{ marginTop: 16, color: "#94a3b8", fontSize: "0.85rem" }}>
                Total Assets: <strong>{stats.total}</strong>
            </p>
        </div>
    )
}