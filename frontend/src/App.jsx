import { Routes, Route, Link, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AssetList from "./pages/AssetList";
import AssetDetail from "./pages/AssetDetail";
import IngestAsset from "./pages/IngestAsset";

function NavLink({ to, children }) {
  const { pathname } = useLocation();
  const active = pathname === to;

  return (
    <Link to={to} style={{
      color: active ? "#fff" : "#94a3b8",
      fontWeight: active ? 700 : 400,
      textDecoration: "none",
      padding: "6px 14px",
      borderRadius: 6,
      background: active ? "#334155" : "transparent",
    }}>
    {children}
    </Link>
  );
}

export default function App() {
  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "system-ui, sans-serif"}}>
      <nav style={{
        background: "#1e293b",
        padding: "12px 32px",
        display: "flex",
        gap: 8,
        alignItems: "center",
      }}>
        <span style={{ color: "#f1f5f9", fontWeight: 700, marginRight: 24, fontSize: "1rem"}}>
          Media Asset Tracker
        </span>
        <NavLink to="/">Dashboard</NavLink>
        <NavLink to="/assets">Asset List</NavLink>
        <NavLink to="/ingest">Ingest New Asset</NavLink>
      </nav>

      <main style={{ padding: "32px" }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/assets" element={<AssetList />} />
          <Route path="/assets/:id" element={<AssetDetail />} />
          <Route path="/ingest" element={<IngestAsset />} />
        </Routes>
      </main>
    </div>
  );
}

