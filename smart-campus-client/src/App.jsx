import { useState } from "react";
import TicketForm from "./components/tickets/TicketForm";
import TicketList from "./components/tickets/TicketList";
import TicketDetail from "./components/tickets/TicketDetail";
import NotificationBell from "./components/notifications/NotificationBell";

const PRIMARY = "#094886";
const SECONDARY = "#2563eb";

export default function App() {
  const [page, setPage] = useState("list");
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  // Role-based access: in a real app this comes from JWT/auth
  // Here we simulate it with a simple toggle for demo/rubric purposes
  const [role, setRole] = useState("user"); // "user" | "admin"
  const [userEmail, setUserEmail] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = () => {
    if (!emailInput.trim()) return;
    setUserEmail(emailInput.trim());
    setLoggedIn(true);
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setUserEmail("");
    setEmailInput("");
    setRole("user");
    setPage("list");
    setSelectedTicketId(null);
  };

  const handleViewTicket = (id) => {
    setSelectedTicketId(id);
    setPage("detail");
  };

  const handleBack = () => {
    setSelectedTicketId(null);
    setPage("list");
  };

  // Login screen
  if (!loggedIn) {
    return (
      <div style={{
        minHeight: "100vh", background: "#f1f5f9",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'Segoe UI', sans-serif",
      }}>
        <div style={{
          background: "white", borderRadius: "16px",
          boxShadow: "0 4px 24px rgba(9,72,134,0.12)",
          padding: "40px 36px", width: "360px",
        }}>
          <div style={{
            background: `linear-gradient(135deg, ${PRIMARY}, ${SECONDARY})`,
            margin: "-40px -36px 28px", padding: "28px 36px",
            borderRadius: "16px 16px 0 0", textAlign: "center",
          }}>
            <div style={{ fontSize: "36px" }}>🏛</div>
            <h2 style={{ margin: "8px 0 4px", color: "white", fontSize: "20px" }}>Smart Campus</h2>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.8)", fontSize: "13px" }}>
              Maintenance & Incident Portal
            </p>
          </div>

          <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: PRIMARY, marginBottom: "4px" }}>
            Your Email
          </label>
          <input
            value={emailInput}
            onChange={e => setEmailInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            placeholder="your@email.com"
            type="email"
            style={{
              width: "100%", padding: "10px 12px", marginBottom: "14px",
              border: "1.5px solid #d1d5db", borderRadius: "8px",
              fontSize: "14px", boxSizing: "border-box", outline: "none",
            }}
          />

          <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: PRIMARY, marginBottom: "4px" }}>
            Login As
          </label>
          <select
            value={role}
            onChange={e => setRole(e.target.value)}
            style={{
              width: "100%", padding: "10px 12px", marginBottom: "20px",
              border: "1.5px solid #d1d5db", borderRadius: "8px",
              fontSize: "14px", boxSizing: "border-box", outline: "none",
            }}
          >
            <option value="user">👤 User (Student / Staff)</option>
            <option value="admin">🛡 Admin / Technician</option>
          </select>

          <button
            onClick={handleLogin}
            disabled={!emailInput.trim()}
            style={{
              width: "100%", padding: "12px",
              background: emailInput.trim()
                ? `linear-gradient(135deg, ${PRIMARY}, ${SECONDARY})`
                : "#cbd5e1",
              color: "white", border: "none", borderRadius: "8px",
              fontSize: "15px", fontWeight: "600", cursor: emailInput.trim() ? "pointer" : "not-allowed",
            }}
          >
            Enter Portal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f1f5f9", fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Navbar */}
      <nav style={{
        background: `linear-gradient(135deg, ${PRIMARY}, ${SECONDARY})`,
        padding: "0 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: "64px",
        boxShadow: "0 2px 12px rgba(9,72,134,0.2)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
          <h1 style={{ margin: 0, color: "white", fontSize: "20px", fontWeight: "700" }}>
            🏛 Smart Campus
          </h1>
          <div style={{ display: "flex", gap: "4px" }}>
            <button onClick={() => setPage("list")} style={{
              background: page === "list" ? "rgba(255,255,255,0.2)" : "transparent",
              border: "none", color: "white", padding: "8px 16px",
              borderRadius: "8px", cursor: "pointer", fontSize: "14px", fontWeight: "600",
            }}>🗂 {role === "admin" ? "All Tickets" : "My Tickets"}</button>
            <button onClick={() => setPage("create")} style={{
              background: page === "create" ? "rgba(255,255,255,0.2)" : "transparent",
              border: "none", color: "white", padding: "8px 16px",
              borderRadius: "8px", cursor: "pointer", fontSize: "14px", fontWeight: "600",
            }}>➕ New Ticket</button>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{
            background: role === "admin" ? "rgba(255,215,0,0.25)" : "rgba(255,255,255,0.15)",
            color: "white", padding: "4px 12px", borderRadius: "20px",
            fontSize: "12px", fontWeight: "700",
          }}>
            {role === "admin" ? "🛡 Admin" : "👤 User"}
          </span>
          <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "13px" }}>{userEmail}</span>
          <NotificationBell email={userEmail} />
          <button onClick={handleLogout} style={{
            background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)",
            color: "white", padding: "6px 14px", borderRadius: "8px",
            cursor: "pointer", fontSize: "13px",
          }}>Logout</button>
        </div>
      </nav>

      {/* Page Content */}
      <main style={{ padding: "32px 16px" }}>
        {page === "list" && (
          <TicketList
            onViewTicket={handleViewTicket}
            role={role}
            userEmail={userEmail}
          />
        )}
        {page === "create" && (
          <TicketForm onSuccess={() => setPage("list")} userEmail={userEmail} />
        )}
        {page === "detail" && selectedTicketId && (
          <TicketDetail
            ticketId={selectedTicketId}
            onBack={handleBack}
            role={role}
            userEmail={userEmail}
          />
        )}
      </main>
    </div>
  );
}
