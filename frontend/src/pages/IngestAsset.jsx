// Form to register a new asset.
// On success, redirects to /assets with a confirmation message.

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api";

const FIELDS = [
  { name: "title", label: "Title", type: "text", placeholder: "e.g., Luck - Feature Film" },
  { name: "format", label: "Format", type: "select", options: ["MOV", "MXF", "MP4", "ProRes", "AVI", "MKV"] },
  { name: "codec", label: "Codec", type: "select", options: ["ProRes 422", "ProRes 4444", "H.264", "H.265"] },
  { name: "resolution", label: "Resolution", type: "select", options: ["4K", "1080p", "1080i", "720p", "HDR", "2K", "8K"] },
  { name: "file_size_gb", label: "File Size (GB)", type: "number", placeholder: "e.g., 48.2", min: 0.1 },
  { name: "territory", label: "Territory", type: "select", options: ["US", "UK", "GLOBAL", "EU", "LATAM", "APAC", "CA", "AU", "JP"] },
  { name: "language", label: "Language", type: "select", options: ["en", "es", "fr", "de", "ja", "mx"] },
];

export default function IngestAsset() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "", format: "", codec: "", resolution: "",
    file_size_gb: "", territory: "", language: "",
  });

  const [fieldErrors, setFieldErrors] = useState({}); 
  const [apiError, setApiError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    if (fieldErrors[e.target.name]) {
      setFieldErrors({ ...fieldErrors, [e.target.name]: null });
    }
  };

  const validate = () => {
    const errors = {};

    FIELDS.forEach(({ name }) => {
      if (!form[name] || String(form[name]).trim() === "") {
        errors[name] = "This field is required.";
      }
    });
    return errors;
  };

  const handleSubmit = async () => {
    const errors = validate();

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors); 
      return;
    }

    setApiError(null);
    setSubmitting(true);
    try {
      const created = await api.ingestAsset({
        ...form,
        file_size_gb: parseFloat(form.file_size_gb),
      });

      navigate("/assets", {
        state: { confirmation: `Asset "${created.title}" ingested successfully (ID: ${created.id})` },
      });
    } catch (err) {
      setApiError(err.error || "An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 560 }}>
      <h1 style={{ marginBottom: 24, color: "#1e293b" }}>Ingest New Asset</h1>
      {apiError && (
        <div style={{
          background: "#fee2e2", 
          border: "1px solid #fca5a5",
          borderRadius: 8, 
          padding: "12px 16px", 
          marginBottom: 20, 
          color: "#991b1b",
        }}>
          ❌ {apiError}
        </div>
      )}
      <div style={{ 
        background: "#fff", 
        borderRadius: 12, 
        padding: 28, 
        boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
  
        {FIELDS.map(({ name, label, type, placeholder, options, min }) => (
          <div key={name} style={{ marginBottom: 18 }}>
            <label style={{ 
                display: "block", 
                fontWeight: 600, 
                marginBottom: 6, 
                color: "#374151", 
                fontSize: "0.88rem" }}>
              {label} <span style={{ color: "red" }}>*</span>
            </label>
            
            {type === "select" ? (
              <select
                name={name}
                value={form[name]}
                onChange={handleChange}
                style={{
                  width: "100%", 
                  padding: "9px 14px", 
                  borderRadius: 8,
                  border: `1px solid ${fieldErrors[name] ? "#ef4444" : "#cbd5e1"}`,
                  fontSize: "0.9rem", 
                  boxSizing: "border-box", 
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                <option value="">Select {label}…</option>
                {options.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ) : (
              <input
                name={name}
                type={type}
                placeholder={placeholder}
                value={form[name]}
                min={min}
                onChange={handleChange}
                style={{
                  width: "100%", 
                  padding: "9px 14px", 
                  borderRadius: 8,
                  border: `1px solid ${fieldErrors[name] ? "#ef4444" : "#cbd5e1"}`,
                  fontSize: "0.9rem", 
                  boxSizing: "border-box", 
                  outline: "none",
                }}
              />
            )}

            {fieldErrors[name] && (
              <p style={{ 
                color: "#ef4444", 
                fontSize: "0.8rem", 
                marginTop: 4 }}>
                {fieldErrors[name]}
              </p>
            )}
          </div>
        ))}

        <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
          <button 
            onClick={handleSubmit} 
            disabled={submitting}
            style={{
              ...btnPrimary,
              opacity: submitting ? 0.6 : 1,
              cursor: submitting ? "not-allowed" : "pointer"}}>
              {submitting ? "Ingesting..." : "Ingest Asset"}
          </button>
          <Link to="/assets" style={btnSecondary}>
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
}

const btnPrimary = {
  background: "#0f172a", color: "#fff", padding: "10px 22px",
  border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: "0.9rem",
};
const btnSecondary = {
  background: "#f1f5f9", color: "#475569", padding: "10px 22px",
  borderRadius: 8, textDecoration: "none", fontWeight: 600, fontSize: "0.9rem", display: "inline-block",
};