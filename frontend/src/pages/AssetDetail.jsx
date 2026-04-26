// Shows all fields for one asset, lets operator update status.

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
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

export default function AssetDetail() {
  const { id } = useParams();
  const [asset, setAsset] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [error, setError] = useState(null);
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    api.getAsset(id)
      .then((data) => { setAsset(data); setSelectedStatus(data.status); })
      .catch(() => setError("Asset not found."));
  }, [id]);

  const handleStatusUpdate = () => {
    setUpdateError(null);
    setUpdateSuccess(false);

    api.updateStatus(id, selectedStatus)
      .then((updated) => { setAsset(updated); setUpdateSuccess(true); })
      .catch((err) => setUpdateError(err.error || "Update failed."));
  };

  if (error) return (
    <div>
      <Link to="/assets" style={backLinkStyle}>← Back to Assets</Link>
      <p style={{ color: "red", marginTop: 16 }}>{error}</p>
    </div>
  );

  if (!asset) return <p>Loading…</p>;

  return (
    <div style={{ maxWidth: 720 }}>
        <Link to="/assets" style={backLinkStyle}>← Back to Assets</Link>
        <h1 style={{ 
            marginTop: 20, 
            marginBottom: 24, 
            color: "#1e293b" }}>
        {asset.title}
        </h1>
        <p style={{ color: "#94a3b8", marginBottom: 24, fontSize: "0.88rem" }}>
            <code>{asset.id}</code>
        </p>

        <div style={{ 
            background: "#fff", 
            borderRadius: 12, 
            padding: 28, 
            boxShadow: "0 1px 4px rgba(0,0,0,0.07)", 
            marginBottom: 24 }}>
            {[
                ["Status", <StatusBadge status={asset.status} />],
                ["Format", asset.format],
                ["Codec", asset.codec],
                ["Resolution", asset.resolution],
                ["File Size", `${asset.file_size_gb} GB`],
                ["Territory", asset.territory],
                ["Language", asset.language],
                ["Created", new Date(asset.created_at).toLocaleString()],
                ["Updated", new Date(asset.updated_at).toLocaleString()],
                ].map(([label, value]) => (
                <div key={label} style={{ 
                    display: "flex", 
                    padding: "10px 0", 
                    borderBottom: "1px solid #f1f5f9" }}>
                    <span style={{ 
                        width: 140, 
                        color: "#64748b", 
                        fontWeight: 600, 
                        fontSize: "0.85rem" }}>{label}</span>
                    <span style={{ color: "#1e293b", fontSize: "0.9rem" }}>{value}</span>
                </div>
            ))}
        </div>


      <div style={{ 
        background: "#fff", 
        borderRadius: 12, 
        padding: 24, 
        boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
        <h2 style={{ 
            fontSize: "1rem", 
            marginBottom: 16, 
            color: "#1e293b" }}>Update Status</h2>
        <div style={{ 
            display: "flex", 
            gap: 12, 
            alignItems: "center" }}>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{ 
                padding: "9px 14px", 
                borderRadius: 8, 
                border: "1px solid #cbd5e1", 
                fontSize: "0.9rem" }}>
            {VALID_STATUSES.map(s => (
              <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
            ))}
          </select>
          <button onClick={handleStatusUpdate} style={btnStyle}>
            Save Status
          </button>
        </div>
        {updateSuccess && <p style={{ color: "#166534", marginTop: 10 }}>✅ Status updated successfully.</p>}
        {updateError && <p style={{ color: "red", marginTop: 10 }}>❌ {updateError}</p>}
      </div>
    </div>
  );
}

const backLinkStyle = { color: "#0ea5e9", textDecoration: "none", 
    fontWeight: 500, fontSize: "0.9rem" };
    
const btnStyle = {
  background: "#0f172a", color: "#fff", padding: "9px 18px",
  border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: "0.9rem",
};