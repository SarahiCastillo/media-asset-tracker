// Shows all assets with search and status filter.
// Clicking a row goes to /asset/:id

import { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { api } from "../api";
import StatusBadge from "../components/StatusBadge";

const VALID_STATUSES = [
    "ingested",
    "qc_pending",
    "qc_passed",
    "qc_failed",
    "encoding",
    "delivered",
    "failed",
];

export default function AssetList(){
    const navigate = useNavigate();
    const location = useLocation();

    const confirmation = location.state?.confirmation;
    const [assets, setAssets] = useState([]);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const params = {};
        if (search) params.search = search;
        if (statusFilter) params.status = statusFilter;

        api.getAssets(params)
            .then(({ assets, total }) => {setAssets(assets); setTotal(total); })
            .catch(() => setError("Failed to load assets."))
            .finally(() => setLoading(false));
    }, [search, statusFilter]);

    return (
        <div>
            {confirmation && (
                <div style={{
                    background: "#dcfce7",
                    border: "1px solid #86efac",
                    borderRadius: 8, 
                    padding: "12px 16px",
                    marginBottom: 20,
                    color: "#166534",
                }}>
                    ✅ {confirmation}
                </div>
            )}

            <div style={{ 
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20
            }}>
                <h1 style={{
                    fontSize: "1.5rem",
                    color: "#1e293b"
                }}>
                    Assets <span style={{ 
                        color: "#94a3b8",
                        fontWeight: 400,
                        fontSize: "1rem" }}>
                    ({total})
                    </span>
                </h1>
                <Link to="/ingest" style={{
                    background: "#0f172a",
                    color: "#fff",
                    padding: "10px 18px",
                    borderRadius: 8,
                    textDecoration: "none",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                }}>
                    + Ingest New Asset
                </Link>
            </div>

            <div style={{
                display: "flex",
                gap: 12,
                marginBottom: 20
            }}>
                <input
                    type="text"
                    placeholder="Search by title..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={inputStyle} />
                <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    style={{inputStyle}}>
                <option value="">All Statuses</option>
                {VALID_STATUSES.map(s => (
                    <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
                ))}
                </select>
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <div style={{ 
                background: "#fff", 
                borderRadius: 12, 
                overflow: "hidden", 
                boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr style={{ background: "#f1f5f9", textAlign: "left" }}>
                    {["ID", "Title", "Format", "Codec", "Resolution", "Status", "Territory"].map(h => (
                        <th key={h} style={thStyle}>{h}</th>
                    ))}
                    </tr>
                </thead>
                <tbody>
                    {assets.length === 0 ? (
                    <tr><td colSpan={7} style={{ 
                        padding: 24, 
                        textAlign: "center", 
                        color: "#94a3b8" }}>
                        No assets found.
                    </td></tr>
                    ) : assets.map((a, i) => (
                    <tr
                        key={a.id}
                        onClick={() => navigate(`/assets/${a.id}`)}
                        style={{
                        cursor: "pointer",
                        background: i % 2 === 0 ? "#fff" : "#f8fafc",
                        borderTop: "1px solid #f1f5f9",
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = "#e0f2fe"}
                        onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? "#fff" : "#f8fafc"}
                    >
                        <td style={tdStyle}><code style={{ fontSize: "0.8rem" }}>{a.id}</code></td>
                        <td style={tdStyle}>{a.title}</td>
                        <td style={tdStyle}>{a.format}</td>
                        <td style={tdStyle}>{a.codec}</td>
                        <td style={tdStyle}>{a.resolution}</td>
                        <td style={tdStyle}><StatusBadge status={a.status} /></td>
                        <td style={tdStyle}>{a.territory}</td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
        </div>
    );
}

const inputStyle = {
    padding: "9px 14px", borderRadius: 8, border: "1px slid #cbd5e1",
    fontSize: "0.9rem", outline: "none", minWidth: 200,
};

const thStyle = { 
    padding: "12px 16px", fontSize: "0.78rem", fontWeight: 700, 
    color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em" 
};

const tdStyle = { padding: "12px 16px", fontSize: "0.88rem", color: "#334155" };