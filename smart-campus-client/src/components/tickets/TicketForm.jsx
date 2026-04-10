import { useState } from "react";
import { createTicket } from "../../services/ticketService";

const PRIMARY = "#094886";
const SECONDARY = "#2563eb";

const inputStyle = {
  width: "100%", padding: "10px 12px", marginBottom: "14px",
  border: "1.5px solid #d1d5db", borderRadius: "8px",
  fontSize: "14px", boxSizing: "border-box", outline: "none",
};

const labelStyle = {
  display: "block", fontSize: "13px",
  fontWeight: "600", color: PRIMARY, marginBottom: "4px",
};

export default function TicketForm({ onSuccess }) {
  const [form, setForm] = useState({
    title: "", description: "", category: "IT",
    priority: "MEDIUM", location: "", preferredContact: "",
    reportedBy: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      await createTicket(form);
      setSuccess(true);
      setForm({ title: "", description: "", category: "IT", priority: "MEDIUM", location: "", preferredContact: "", reportedBy: "" });
      if (onSuccess) onSuccess();
    } catch (err) {
      setError("Failed to create ticket. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: "620px", margin: "0 auto", padding: "32px",
      background: "white", borderRadius: "16px",
      boxShadow: "0 4px 20px rgba(9,72,134,0.10)",
      border: "1px solid #e8f0fe",
    }}>
      <div style={{
        background: `linear-gradient(135deg, ${PRIMARY}, ${SECONDARY})`,
        margin: "-32px -32px 28px -32px",
        padding: "24px 32px", borderRadius: "16px 16px 0 0",
      }}>
        <h2 style={{ margin: 0, color: "white", fontSize: "20px" }}>🔧 Report an Incident</h2>
        <p style={{ margin: "4px 0 0 0", color: "rgba(255,255,255,0.8)", fontSize: "13px" }}>
          Submit a maintenance or incident ticket
        </p>
      </div>

      {error && (
        <div style={{ background: "#ffebee", color: "#c62828", padding: "10px 14px", borderRadius: "8px", marginBottom: "16px", fontSize: "13px" }}>
          ⚠️ {error}
        </div>
      )}
      {success && (
        <div style={{ background: "#f0fdf4", color: "#16a34a", padding: "10px 14px", borderRadius: "8px", marginBottom: "16px", fontSize: "13px" }}>
          ✅ Ticket submitted successfully!
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <label style={labelStyle}>Your Email *</label>
        <input name="reportedBy" value={form.reportedBy} onChange={handleChange} required
          placeholder="your@email.com" style={inputStyle} type="email" />

        <label style={labelStyle}>Title *</label>
        <input name="title" value={form.title} onChange={handleChange} required
          placeholder="Short description of the issue" style={inputStyle} />

        <label style={labelStyle}>Description *</label>
        <textarea name="description" value={form.description} onChange={handleChange} required
          placeholder="Detailed description..." rows={4}
          style={{ ...inputStyle, resize: "vertical" }} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div>
            <label style={labelStyle}>Category *</label>
            <select name="category" value={form.category} onChange={handleChange} style={inputStyle}>
              <option value="IT">💻 IT</option>
              <option value="ELECTRICAL">⚡ Electrical</option>
              <option value="PLUMBING">🔧 Plumbing</option>
              <option value="FURNITURE">🪑 Furniture</option>
              <option value="OTHER">📦 Other</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Priority *</label>
            <select name="priority" value={form.priority} onChange={handleChange} style={inputStyle}>
              <option value="LOW">🟢 Low</option>
              <option value="MEDIUM">🟡 Medium</option>
              <option value="HIGH">🔴 High</option>
              <option value="CRITICAL">🚨 Critical</option>
            </select>
          </div>
        </div>

        <label style={labelStyle}>Location *</label>
        <input name="location" value={form.location} onChange={handleChange} required
          placeholder="e.g. Lab 3, Block A" style={inputStyle} />

        <label style={labelStyle}>Preferred Contact</label>
        <input name="preferredContact" value={form.preferredContact} onChange={handleChange}
          placeholder="Phone or email" style={inputStyle} />

        <button type="submit" disabled={loading} style={{
          width: "100%", padding: "13px",
          background: loading ? "#93c5fd" : `linear-gradient(135deg, ${PRIMARY}, ${SECONDARY})`,
          color: "white", border: "none", borderRadius: "8px",
          fontSize: "15px", fontWeight: "600",
          cursor: loading ? "not-allowed" : "pointer",
          boxShadow: loading ? "none" : "0 4px 12px rgba(37,99,235,0.3)",
        }}>
          {loading ? "⏳ Submitting..." : "🚀 Submit Ticket"}
        </button>
      </form>
    </div>
  );
}