<<<<<<< HEAD
import { useState, useRef } from "react";
import { createTicket, uploadTicketImages } from "../../services/ticketService";
=======
import { useState } from "react";
import { createTicket } from "../../services/ticketService";
>>>>>>> 9b434a5249957e185d72085a25e4bcdbaa60f373

const PRIMARY = "#094886";
const SECONDARY = "#2563eb";

const inputStyle = {
<<<<<<< HEAD
  width: "100%", padding: "10px 12px", marginBottom: "4px",
=======
  width: "100%", padding: "10px 12px", marginBottom: "14px",
>>>>>>> 9b434a5249957e185d72085a25e4bcdbaa60f373
  border: "1.5px solid #d1d5db", borderRadius: "8px",
  fontSize: "14px", boxSizing: "border-box", outline: "none",
};

<<<<<<< HEAD
const inputErrorStyle = {
  ...inputStyle,
  border: "1.5px solid #dc2626",
};

=======
>>>>>>> 9b434a5249957e185d72085a25e4bcdbaa60f373
const labelStyle = {
  display: "block", fontSize: "13px",
  fontWeight: "600", color: PRIMARY, marginBottom: "4px",
};

<<<<<<< HEAD
const errorMsgStyle = {
  color: "#dc2626", fontSize: "12px", marginBottom: "10px", marginTop: "2px",
};

function validate(form) {
  const errors = {};
  if (!form.reportedBy.trim()) errors.reportedBy = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.reportedBy))
    errors.reportedBy = "Enter a valid email address";
  if (!form.title.trim()) errors.title = "Title is required";
  else if (form.title.trim().length < 3) errors.title = "Title must be at least 3 characters";
  if (!form.description.trim()) errors.description = "Description is required";
  else if (form.description.trim().length < 10) errors.description = "Description must be at least 10 characters";
  if (!form.location.trim()) errors.location = "Location is required";
  return errors;
}

export default function TicketForm({ onSuccess, userEmail }) {
  const [form, setForm] = useState({
    title: "", description: "", category: "IT",
    priority: "MEDIUM", location: "", preferredContact: "",
    reportedBy: userEmail || "",
  });
  const [images, setImages] = useState([]); // File[] max 3
  const [imagePreviews, setImagePreviews] = useState([]);
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const errors = validate(form);
  const isValid = Object.keys(errors).length === 0;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setTouched({ ...touched, [e.target.name]: true });
  };

  const handleBlur = (e) => setTouched({ ...touched, [e.target.name]: true });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 3);
    setImages(files);
    const previews = files.map(f => URL.createObjectURL(f));
    setImagePreviews(previews);
  };

  const removeImage = (idx) => {
    const newImages = images.filter((_, i) => i !== idx);
    const newPreviews = imagePreviews.filter((_, i) => i !== idx);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Mark all fields as touched to show errors
    const allTouched = Object.fromEntries(Object.keys(form).map(k => [k, true]));
    setTouched(allTouched);
    if (!isValid) return;

    setLoading(true);
    setError("");
    try {
      const res = await createTicket(form);
      const ticketId = res.data.id;

      // Upload images if any
      if (images.length > 0) {
        await uploadTicketImages(ticketId, images);
      }

      setForm({ title: "", description: "", category: "IT", priority: "MEDIUM", location: "", preferredContact: "", reportedBy: userEmail || "" });
      setImages([]);
      setImagePreviews([]);
      setTouched({});
      if (onSuccess) onSuccess();
    } catch (err) {
      if (err.response?.data?.fieldErrors) {
        const msgs = Object.values(err.response.data.fieldErrors).join(", ");
        setError("Validation error: " + msgs);
      } else {
        setError("Failed to create ticket. Make sure the backend is running.");
      }
=======
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
>>>>>>> 9b434a5249957e185d72085a25e4bcdbaa60f373
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  const field = (name) => ({
    style: touched[name] && errors[name] ? inputErrorStyle : inputStyle,
    onBlur: handleBlur,
  });

=======
>>>>>>> 9b434a5249957e185d72085a25e4bcdbaa60f373
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
<<<<<<< HEAD

      <form onSubmit={handleSubmit} noValidate>
        <label style={labelStyle}>Your Email *</label>
        <input name="reportedBy" value={form.reportedBy} onChange={handleChange}
          placeholder="your@email.com" type="email" {...field("reportedBy")} />
        {touched.reportedBy && errors.reportedBy && <div style={errorMsgStyle}>{errors.reportedBy}</div>}

        <label style={labelStyle}>Title *</label>
        <input name="title" value={form.title} onChange={handleChange}
          placeholder="Short description of the issue" {...field("title")} />
        {touched.title && errors.title && <div style={errorMsgStyle}>{errors.title}</div>}

        <label style={labelStyle}>Description *</label>
        <textarea name="description" value={form.description} onChange={handleChange}
          placeholder="Detailed description (min 10 characters)..." rows={4}
          {...field("description")} style={{ ...(touched.description && errors.description ? inputErrorStyle : inputStyle), resize: "vertical", marginBottom: "4px" }} />
        {touched.description && errors.description && <div style={errorMsgStyle}>{errors.description}</div>}
=======
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
>>>>>>> 9b434a5249957e185d72085a25e4bcdbaa60f373

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
<<<<<<< HEAD
        <input name="location" value={form.location} onChange={handleChange}
          placeholder="e.g. Lab 3, Block A" {...field("location")} />
        {touched.location && errors.location && <div style={errorMsgStyle}>{errors.location}</div>}
=======
        <input name="location" value={form.location} onChange={handleChange} required
          placeholder="e.g. Lab 3, Block A" style={inputStyle} />
>>>>>>> 9b434a5249957e185d72085a25e4bcdbaa60f373

        <label style={labelStyle}>Preferred Contact</label>
        <input name="preferredContact" value={form.preferredContact} onChange={handleChange}
          placeholder="Phone or email" style={inputStyle} />

<<<<<<< HEAD
        {/* Image Upload — up to 3 photos */}
        <label style={{ ...labelStyle, marginTop: "6px" }}>📷 Attach Photos (up to 3)</label>
        <div style={{
          border: "2px dashed #cbd5e1", borderRadius: "10px",
          padding: "16px", marginBottom: "14px", textAlign: "center",
        }}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
          <button type="button" onClick={() => fileInputRef.current.click()} style={{
            padding: "8px 20px", background: "#f1f5f9", border: "1.5px solid #cbd5e1",
            borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "600", color: "#475569",
          }}>
            📁 Choose Images
          </button>
          <p style={{ margin: "8px 0 0", fontSize: "12px", color: "#94a3b8" }}>
            Max 3 images, 5MB each. JPG, PNG, GIF, WEBP supported.
          </p>

          {imagePreviews.length > 0 && (
            <div style={{ display: "flex", gap: "10px", marginTop: "12px", flexWrap: "wrap", justifyContent: "center" }}>
              {imagePreviews.map((src, i) => (
                <div key={i} style={{ position: "relative" }}>
                  <img src={src} alt={`Preview ${i + 1}`} style={{
                    width: "80px", height: "80px", objectFit: "cover",
                    borderRadius: "8px", border: "2px solid #e2e8f0",
                  }} />
                  <button type="button" onClick={() => removeImage(i)} style={{
                    position: "absolute", top: "-6px", right: "-6px",
                    background: "#dc2626", color: "white", border: "none",
                    borderRadius: "50%", width: "20px", height: "20px",
                    fontSize: "11px", cursor: "pointer", fontWeight: "700",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>✕</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Show validation summary on submit attempt */}
        {!isValid && Object.keys(touched).length > 0 && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", padding: "10px 14px", marginBottom: "14px", fontSize: "13px", color: "#b91c1c" }}>
            ⚠️ Please fix the errors above before submitting.
          </div>
        )}

=======
>>>>>>> 9b434a5249957e185d72085a25e4bcdbaa60f373
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
<<<<<<< HEAD
}
=======
}
>>>>>>> 9b434a5249957e185d72085a25e4bcdbaa60f373
