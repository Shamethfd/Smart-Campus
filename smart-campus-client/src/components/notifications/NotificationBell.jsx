import { useState, useEffect, useRef } from "react";
import { getMyNotifications, getUnreadCount, markAsRead, markAllAsRead } from "../../services/ticketService";

const PRIMARY = "#094886";
const SECONDARY = "#2563eb";

// Now accepts email as a prop (passed from App.jsx after login) — no more prompt()
export default function NotificationBell({ email }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const fetchData = async () => {
    if (!email) return;
    try {
      const [notifRes, countRes] = await Promise.all([
        getMyNotifications(email),
        getUnreadCount(email),
      ]);
      setNotifications(notifRes.data);
      setUnreadCount(countRes.data.count ?? countRes.data);
    } catch (err) {
      console.error("Notification fetch error:", err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [email]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkRead = async (id) => {
    await markAsRead(id);
    fetchData();
  };

  const handleMarkAllRead = async () => {
    if (email) await markAllAsRead(email);
    fetchData();
  };

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: "rgba(255,255,255,0.15)",
          border: "1.5px solid rgba(255,255,255,0.3)",
          borderRadius: "10px",
          cursor: "pointer",
          fontSize: "20px",
          padding: "6px 12px",
          position: "relative",
          color: "white",
        }}
      >
        🔔
        {unreadCount > 0 && (
          <span style={{
            position: "absolute", top: "-6px", right: "-6px",
            background: "#ef4444", color: "white",
            borderRadius: "50%", minWidth: "20px", height: "20px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "11px", fontWeight: "700", border: "2px solid white",
          }}>
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div style={{
          position: "absolute", right: 0, top: "48px",
          width: "360px", background: "white",
          borderRadius: "16px",
          boxShadow: "0 8px 32px rgba(9,72,134,0.18)",
          zIndex: 1000, overflow: "hidden",
          border: "1px solid #e2e8f0",
        }}>
          <div style={{
            background: `linear-gradient(135deg, ${PRIMARY}, ${SECONDARY})`,
            padding: "14px 18px",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <strong style={{ color: "white", fontSize: "15px" }}>
              🔔 Notifications
              {unreadCount > 0 && (
                <span style={{
                  marginLeft: "8px", background: "#ef4444", color: "white",
                  borderRadius: "10px", padding: "1px 8px",
                  fontSize: "11px", fontWeight: "700",
                }}>{unreadCount} new</span>
              )}
            </strong>
            {unreadCount > 0 && (
              <button onClick={handleMarkAllRead} style={{
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.3)",
                color: "white", cursor: "pointer",
                fontSize: "12px", fontWeight: "600",
                padding: "4px 10px", borderRadius: "6px",
              }}>Mark all read</button>
            )}
          </div>

          <div style={{ maxHeight: "380px", overflowY: "auto" }}>
            {notifications.length === 0 ? (
              <div style={{ padding: "40px 20px", textAlign: "center", color: "#94a3b8" }}>
                <div style={{ fontSize: "32px", marginBottom: "8px" }}>📭</div>
                <div>No notifications yet</div>
              </div>
            ) : (
              notifications.map((n) => (
                <div key={n.id} onClick={() => handleMarkRead(n.id)} style={{
                  padding: "14px 18px", borderBottom: "1px solid #f1f5f9",
                  background: n.read ? "white" : "#eff6ff",
                  cursor: "pointer", display: "flex", gap: "12px",
                }}>
                  <div style={{
                    width: "8px", height: "8px", borderRadius: "50%",
                    background: n.read ? "#cbd5e1" : SECONDARY,
                    marginTop: "5px", flexShrink: 0,
                  }} />
                  <div>
                    <div style={{
                      fontSize: "13px",
                      color: n.read ? "#64748b" : "#1e293b",
                      fontWeight: n.read ? "400" : "600",
                      lineHeight: "1.4",
                    }}>{n.message}</div>
                    <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "4px" }}>
                      🕒 {new Date(n.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
