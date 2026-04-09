import { useState } from "react";
import TicketForm from "./components/tickets/TicketForm";
import TicketList from "./components/tickets/TicketList";
import TicketDetail from "./components/tickets/TicketDetail";
import NotificationBell from "./components/notifications/NotificationBell";

const PRIMARY = "#094886";
const SECONDARY = "#2563eb";

export default function App() {
  const [page, setPage] = useState("list"); // "list" | "create" | "detail"
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  const handleViewTicket = (id) => {
    setSelectedTicketId(id);
    setPage("detail");
  };

  const handleBack = () => {
    setSelectedTicketId(null);
    setPage("list");
  };

  const handleCreated = () => {
    setPage("list");
  };

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
            }}>🗂 Tickets</button>
            <button onClick={() => setPage("create")} style={{
              background: page === "create" ? "rgba(255,255,255,0.2)" : "transparent",
              border: "none", color: "white", padding: "8px 16px",
              borderRadius: "8px", cursor: "pointer", fontSize: "14px", fontWeight: "600",
            }}>➕ New Ticket</button>
          </div>
        </div>
        <NotificationBell />
      </nav>

      {/* Page Content */}
      <main style={{ padding: "32px 16px" }}>
        {page === "list" && (
          <TicketList onViewTicket={handleViewTicket} />
        )}
        {page === "create" && (
          <TicketForm onSuccess={handleCreated} />
        )}
        {page === "detail" && selectedTicketId && (
          <TicketDetail ticketId={selectedTicketId} onBack={handleBack} />
        )}
      </main>
    </div>
  );
}