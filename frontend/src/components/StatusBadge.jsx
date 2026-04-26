// Reusable component for AssetList and AssetDetail

const STATUS_COLORS = {
    ingested: { bg: "#e0f2fe", color: "#0369a1" },
    qc_pending: { bg: "#fef9c3", color: "#854d0e" },
    qc_passed: { bg: "#dcfce7", color: "#166534" },
    qc_failed: { bg: "#fee2e2", color: "#991b1b" },
    encoding: { bg: "#ede9fe", color: "#5b21b6" },
    delivered: { bg: "#d1fae5", color: "#065f46" },
    failed: { bg: "#fce7f3", color: "#9d174d" },
};

export default function StatusBadge({ status }) {
    const style = STATUS_COLORS[status] || { bg: "#f3f4f6", color: "#374151" };

    return (
        <span style={{
            backgroundColor: style.bg,
            color: style.color,
            padding: "2px 10px",
            borderRadius: "9999px",
            fontSize: "0.78rem",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
        }}>
            {status.replace(/_/g, "")}
        </span>
    );
}