import { useState, useEffect } from "react";
<<<<<<< HEAD
import { getAllTickets, getMyTickets, deleteTicket } from "../../services/ticketService";
=======
import { getAllTickets, deleteTicket } from "../../services/ticketService";
>>>>>>> 9b434a5249957e185d72085a25e4bcdbaa60f373

const PRIMARY = "#094886";
const SECONDARY = "#2563eb";

const statusConfig = {
  OPEN:        { color: "#2563eb", bg: "#eff6ff", label: "Open" },
  IN_PROGRESS: { color: "#d97706", bg: "#fffbeb", label: "In Progress" },
  RESOLVED:    { color: "#16a34a", bg: "#f0fdf4", label: "Resolved" },
  CLOSED:      { color: "#6b7280", bg: "#f9fafb", label: "Closed" },
  REJECTED:    { color: "#dc2626", bg: "#fef2f2", label: "Rejected" },
};

const priorityConfig = {
  LOW:      { color: "#16a34a", bg: "#f0fdf4" },
  MEDIUM:   { color: "#d97706", bg: "#fffbeb" },
  HIGH:     { color: "#dc2626", bg: "#fef2f2" },
  CRITICAL: { color: "#7c3aed", bg: "#f5f3ff" },
};

<<<<<<< HEAD
// role: "user" | "admin"
export default function TicketList({ onViewTicket, role, userEmail }) {
=======
export default function TicketList({ onViewTicket }) {
>>>>>>> 9b434a5249957e185d72085a25e4bcdbaa60f373
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  const fetchTickets = async () => {
    try {
<<<<<<< HEAD
      // Users only see their own tickets; admins see all
      const res = role === "admin"
        ? await getAllTickets()
        : await getMyTickets(userEmail);
=======
      const res = await getAllTickets();
>>>>>>> 9b434a5249957e185d72085a25e4bcdbaa60f373
      setTickets(res.data);
    } catch (err) {
      console.error("Failed to fetch tickets:", err);
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  useEffect(() => { fetchTickets(); }, [role, userEmail]);
=======
  useEffect(() => { fetchTickets(); }, []);
>>>>>>> 9b434a5249957e185d72085a25e4bcdbaa60f373

  const handleDelete = async (id) => {
    if (window.confirm("Delete this ticket?")) {
      await deleteTicket(id);
      fetchTickets();
    }
  };

  const filtered = filter === "ALL" ? tickets : tickets.filter(t => t.status === filter);

  if (loading) return (
    <div style={{ textAlign: "center", padding: "60px", color: PRIMARY }}>
      <div style={{ fontSize: "32px" }}>⏳</div>
      <div>Loading tickets...</div>
    </div>
  );

  return (
    <div style={{ padding: "24px", maxWidth: "900px", margin: "0 auto" }}>
      <div style={{
        background: `linear-gradient(135deg, ${PRIMARY}, ${SECONDARY})`,
        borderRadius: "16px", padding: "24px 28px", marginBottom: "24px", color: "white",
      }}>
<<<<<<< HEAD
        <h2 style={{ margin: 0, fontSize: "22px" }}>
          {role === "admin" ? "🛡 All Tickets" : "🗂 My Tickets"}
        </h2>
        <p style={{ margin: "4px 0 0 0", opacity: 0.8, fontSize: "13px" }}>
          {tickets.length} ticket{tickets.length !== 1 ? "s" : ""} total
          {role === "user" && ` for ${userEmail}`}
=======
        <h2 style={{ margin: 0, fontSize: "22px" }}>🗂 All Tickets</h2>
        <p style={{ margin: "4px 0 0 0", opacity: 0.8, fontSize: "13px" }}>
          {tickets.length} ticket{tickets.length !== 1 ? "s" : ""} total
>>>>>>> 9b434a5249957e185d72085a25e4bcdbaa60f373
        </p>
      </div>

      <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
        {["ALL", "OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED", "REJECTED"].map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{
            padding: "6px 16px", borderRadius: "20px", border: "none",
            cursor: "pointer", fontSize: "13px", fontWeight: "600",
            background: filter === s ? PRIMARY : "#f1f5f9",
            color: filter === s ? "white" : "#64748b",
          }}>
            {s === "ALL" ? "All" : s.replace("_", " ")}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px", color: "#94a3b8", background: "white", borderRadius: "16px" }}>
          <div style={{ fontSize: "40px" }}>📭</div>
          <div>No tickets found.</div>
<<<<<<< HEAD
          {role === "user" && <div style={{ fontSize: "13px", marginTop: "8px" }}>Submit a new ticket using the ➕ button above.</div>}
=======
>>>>>>> 9b434a5249957e185d72085a25e4bcdbaa60f373
        </div>
      ) : (
        filtered.map((ticket) => {
          const sc = statusConfig[ticket.status] || statusConfig.OPEN;
          const pc = priorityConfig[ticket.priority] || priorityConfig.MEDIUM;
          return (
            <div key={ticket.id} style={{
              background: "white", border: "1px solid #e2e8f0",
              borderLeft: `4px solid ${sc.color}`,
              borderRadius: "12px", padding: "18px 20px",
              marginBottom: "12px",
              boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: "0 0 8px 0", color: PRIMARY, fontSize: "16px" }}>{ticket.title}</h3>
                  <div style={{ fontSize: "13px", color: "#64748b", marginBottom: "10px" }}>
                    📍 {ticket.location} · 🏷 {ticket.category}
<<<<<<< HEAD
                    {role === "admin" && ticket.reportedBy && <> · 👤 {ticket.reportedBy}</>}
                    {ticket.assignedTo && <> · 👷 {ticket.assignedTo}</>}
=======
                    {ticket.reportedBy && <> · 👤 {ticket.reportedBy}</>}
>>>>>>> 9b434a5249957e185d72085a25e4bcdbaa60f373
                  </div>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <span style={{ background: sc.bg, color: sc.color, padding: "3px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "700" }}>
                      {sc.label}
                    </span>
                    <span style={{ background: pc.bg, color: pc.color, padding: "3px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "700" }}>
                      {ticket.priority}
                    </span>
                    {ticket.comments?.length > 0 && (
                      <span style={{ color: "#94a3b8", fontSize: "12px", padding: "3px 0" }}>
                        💬 {ticket.comments.length}
                      </span>
                    )}
<<<<<<< HEAD
                    {ticket.imageUrls?.length > 0 && (
                      <span style={{ color: "#94a3b8", fontSize: "12px", padding: "3px 0" }}>
                        📷 {ticket.imageUrls.length}
                      </span>
                    )}
=======
>>>>>>> 9b434a5249957e185d72085a25e4bcdbaa60f373
                  </div>
                </div>
                <div style={{ display: "flex", gap: "8px", marginLeft: "16px" }}>
                  <button onClick={() => onViewTicket(ticket.id)} style={{
                    padding: "7px 16px",
                    background: `linear-gradient(135deg, ${PRIMARY}, ${SECONDARY})`,
                    color: "white", border: "none", borderRadius: "8px",
                    cursor: "pointer", fontSize: "13px", fontWeight: "600",
                  }}>View</button>
<<<<<<< HEAD
                  {/* Delete only shown to admin or owner */}
                  {(role === "admin" || ticket.reportedBy === userEmail) && (
                    <button onClick={() => handleDelete(ticket.id)} style={{
                      padding: "7px 16px", background: "#fef2f2", color: "#dc2626",
                      border: "1px solid #fecaca", borderRadius: "8px",
                      cursor: "pointer", fontSize: "13px", fontWeight: "600",
                    }}>Delete</button>
                  )}
=======
                  <button onClick={() => handleDelete(ticket.id)} style={{
                    padding: "7px 16px", background: "#fef2f2", color: "#dc2626",
                    border: "1px solid #fecaca", borderRadius: "8px",
                    cursor: "pointer", fontSize: "13px", fontWeight: "600",
                  }}>Delete</button>
>>>>>>> 9b434a5249957e185d72085a25e4bcdbaa60f373
                </div>
              </div>
              <div style={{ fontSize: "11px", color: "#cbd5e1", marginTop: "10px" }}>
                🕒 {ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : ""}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 9b434a5249957e185d72085a25e4bcdbaa60f373
