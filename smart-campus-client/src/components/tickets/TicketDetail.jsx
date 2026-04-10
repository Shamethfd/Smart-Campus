<<<<<<< HEAD
import { useState, useEffect, useRef } from "react";
import {
  getTicketById, updateTicketStatus, addComment,
  editComment, deleteComment, assignTechnician, uploadTicketImages
=======
import { useState, useEffect } from "react";
import {
  getTicketById, updateTicketStatus, addComment,
  editComment, deleteComment, assignTechnician
>>>>>>> 9b434a5249957e185d72085a25e4bcdbaa60f373
} from "../../services/ticketService";

const PRIMARY = "#094886";
const SECONDARY = "#2563eb";

const statusConfig = {
  OPEN:        { color: "#2563eb", bg: "#eff6ff" },
  IN_PROGRESS: { color: "#d97706", bg: "#fffbeb" },
  RESOLVED:    { color: "#16a34a", bg: "#f0fdf4" },
  CLOSED:      { color: "#6b7280", bg: "#f9fafb" },
  REJECTED:    { color: "#dc2626", bg: "#fef2f2" },
};

<<<<<<< HEAD
// role: "user" | "admin"
export default function TicketDetail({ ticketId, onBack, role, userEmail }) {
  const [ticket, setTicket] = useState(null);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [techEmail, setTechEmail] = useState("");
  const [techEmailError, setTechEmailError] = useState("");
  const [loading, setLoading] = useState(true);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploadMsg, setUploadMsg] = useState("");
  const fileInputRef = useRef(null);
=======
export default function TicketDetail({ ticketId, onBack }) {
  const [ticket, setTicket] = useState(null);
  const [comment, setComment] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [techEmail, setTechEmail] = useState("");
  const [loading, setLoading] = useState(true);
>>>>>>> 9b434a5249957e185d72085a25e4bcdbaa60f373

  const fetchTicket = async () => {
    try {
      const res = await getTicketById(ticketId);
      setTicket(res.data);
    } catch (err) {
      console.error("Failed to load ticket:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTicket(); }, [ticketId]);

<<<<<<< HEAD
  // Admin-only actions
=======
>>>>>>> 9b434a5249957e185d72085a25e4bcdbaa60f373
  const handleStatusUpdate = async (status) => {
    const reason = status === "REJECTED" ? prompt("Rejection reason:") : null;
    const notes = status === "RESOLVED" ? prompt("Resolution notes:") : null;
    await updateTicketStatus(ticketId, { status, reason, resolutionNotes: notes });
    fetchTicket();
  };

<<<<<<< HEAD
  const handleAssign = async () => {
    if (!techEmail.trim()) {
      setTechEmailError("Please enter a technician email.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(techEmail)) {
      setTechEmailError("Enter a valid email address.");
      return;
    }
    setTechEmailError("");
    await assignTechnician(ticketId, techEmail);
    setTechEmail("");
    fetchTicket();
  };

  // Image upload
  const handleImageChange = (e) => {
    const remaining = 3 - (ticket?.imageUrls?.length || 0);
    const files = Array.from(e.target.files).slice(0, remaining);
    setImageFiles(files);
    setImagePreviews(files.map(f => URL.createObjectURL(f)));
    setUploadMsg("");
  };

  const handleUploadImages = async () => {
    if (imageFiles.length === 0) return;
    try {
      await uploadTicketImages(ticketId, imageFiles);
      setImageFiles([]);
      setImagePreviews([]);
      setUploadMsg("✅ Images uploaded successfully!");
      fetchTicket();
    } catch {
      setUploadMsg("❌ Failed to upload images.");
    }
  };

  // Comment actions
  const handleAddComment = async () => {
    if (!comment.trim()) {
      setCommentError("Comment cannot be empty.");
      return;
    }
    setCommentError("");
    await addComment(ticketId, comment, userEmail);
=======
  const handleAddComment = async () => {
    if (!comment.trim() || !authorEmail.trim()) {
      alert("Please enter your email and comment.");
      return;
    }
    await addComment(ticketId, comment, authorEmail);
>>>>>>> 9b434a5249957e185d72085a25e4bcdbaa60f373
    setComment("");
    fetchTicket();
  };

  const handleEditComment = async (commentId) => {
<<<<<<< HEAD
    if (!editContent.trim()) return;
    await editComment(ticketId, commentId, editContent, userEmail);
=======
    await editComment(ticketId, commentId, editContent, authorEmail);
>>>>>>> 9b434a5249957e185d72085a25e4bcdbaa60f373
    setEditingId(null);
    fetchTicket();
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm("Delete this comment?")) {
<<<<<<< HEAD
      await deleteComment(ticketId, commentId, userEmail);
=======
      await deleteComment(ticketId, commentId, authorEmail);
>>>>>>> 9b434a5249957e185d72085a25e4bcdbaa60f373
      fetchTicket();
    }
  };

<<<<<<< HEAD
=======
  const handleAssign = async () => {
    if (!techEmail.trim()) return;
    await assignTechnician(ticketId, techEmail);
    setTechEmail("");
    fetchTicket();
  };

>>>>>>> 9b434a5249957e185d72085a25e4bcdbaa60f373
  if (loading) return <div style={{ padding: "60px", textAlign: "center", color: PRIMARY }}>⏳ Loading...</div>;
  if (!ticket) return <div style={{ padding: "60px", textAlign: "center", color: "#dc2626" }}>❌ Ticket not found.</div>;

  const sc = statusConfig[ticket.status] || statusConfig.OPEN;
<<<<<<< HEAD
  const isOwner = ticket.reportedBy === userEmail;
  const isAdmin = role === "admin";
  const remainingImages = 3 - (ticket.imageUrls?.length || 0);
=======
>>>>>>> 9b434a5249957e185d72085a25e4bcdbaa60f373

  return (
    <div style={{ maxWidth: "720px", margin: "0 auto", padding: "24px" }}>
      <button onClick={onBack} style={{
        marginBottom: "20px", background: "none",
        border: `1.5px solid ${PRIMARY}`, color: PRIMARY,
        padding: "7px 18px", borderRadius: "8px",
        cursor: "pointer", fontWeight: "600", fontSize: "13px",
      }}>← Back to Tickets</button>

      {/* Ticket Card */}
      <div style={{
        background: "white", borderRadius: "16px",
        overflow: "hidden", boxShadow: "0 4px 20px rgba(9,72,134,0.10)",
        marginBottom: "20px", border: "1px solid #e2e8f0",
      }}>
        <div style={{
          background: `linear-gradient(135deg, ${PRIMARY}, ${SECONDARY})`,
          padding: "20px 24px", color: "white",
          display: "flex", justifyContent: "space-between", alignItems: "flex-start",
        }}>
          <h2 style={{ margin: 0, fontSize: "20px" }}>{ticket.title}</h2>
          <span style={{
            background: sc.bg, color: sc.color,
            padding: "4px 14px", borderRadius: "20px",
            fontSize: "12px", fontWeight: "700", marginLeft: "12px", whiteSpace: "nowrap",
          }}>{ticket.status}</span>
        </div>

        <div style={{ padding: "20px 24px" }}>
          <p style={{ color: "#475569", lineHeight: "1.6", marginTop: 0 }}>{ticket.description}</p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
            {[
              { label: "📍 Location", value: ticket.location },
              { label: "🏷 Category", value: ticket.category },
              { label: "⚡ Priority", value: ticket.priority },
              { label: "👤 Reported By", value: ticket.reportedBy },
              ticket.assignedTo && { label: "👷 Assigned To", value: ticket.assignedTo },
              ticket.preferredContact && { label: "📞 Contact", value: ticket.preferredContact },
            ].filter(Boolean).map((item, i) => (
              <div key={i} style={{ background: "#f8fafc", borderRadius: "8px", padding: "10px 14px" }}>
                <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "600" }}>{item.label}</div>
                <div style={{ fontSize: "14px", color: "#1e293b", marginTop: "2px" }}>{item.value}</div>
              </div>
            ))}
          </div>

          {ticket.resolutionNotes && (
            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px", padding: "12px 16px", marginBottom: "12px" }}>
              <strong style={{ color: "#16a34a", fontSize: "13px" }}>✅ Resolution Notes</strong>
              <p style={{ margin: "4px 0 0 0", color: "#166534", fontSize: "14px" }}>{ticket.resolutionNotes}</p>
            </div>
          )}
          {ticket.rejectionReason && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", padding: "12px 16px", marginBottom: "12px" }}>
              <strong style={{ color: "#dc2626", fontSize: "13px" }}>❌ Rejection Reason</strong>
              <p style={{ margin: "4px 0 0 0", color: "#991b1b", fontSize: "14px" }}>{ticket.rejectionReason}</p>
            </div>
          )}
<<<<<<< HEAD

          {/* Image Gallery */}
          {ticket.imageUrls?.length > 0 && (
            <div style={{ marginTop: "12px" }}>
              <div style={{ fontSize: "13px", fontWeight: "600", color: PRIMARY, marginBottom: "8px" }}>📷 Attachments</div>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {ticket.imageUrls.map((url, i) => (
                  <a key={i} href={`http://localhost:8081${url}`} target="_blank" rel="noopener noreferrer">
                    <img
                      src={`http://localhost:8081${url}`}
                      alt={`Attachment ${i + 1}`}
                      style={{ width: "90px", height: "90px", objectFit: "cover", borderRadius: "8px", border: "2px solid #e2e8f0", cursor: "pointer" }}
                    />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Image Upload (owner or admin, if slots remaining) */}
      {(isOwner || isAdmin) && remainingImages > 0 && (
        <div style={{
          background: "white", borderRadius: "16px", padding: "20px 24px",
          marginBottom: "20px", boxShadow: "0 2px 10px rgba(9,72,134,0.08)", border: "1px solid #e2e8f0",
        }}>
          <h3 style={{ margin: "0 0 12px 0", color: PRIMARY, fontSize: "16px" }}>📷 Add Photos ({remainingImages} slot{remainingImages !== 1 ? "s" : ""} remaining)</h3>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
          <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
            <button type="button" onClick={() => fileInputRef.current.click()} style={{
              padding: "8px 16px", background: "#f1f5f9", border: "1.5px solid #cbd5e1",
              borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "600", color: "#475569",
            }}>
              📁 Choose Images
            </button>
            {imageFiles.length > 0 && (
              <button type="button" onClick={handleUploadImages} style={{
                padding: "8px 16px",
                background: `linear-gradient(135deg, ${PRIMARY}, ${SECONDARY})`,
                color: "white", border: "none", borderRadius: "8px",
                cursor: "pointer", fontSize: "13px", fontWeight: "600",
              }}>
                Upload {imageFiles.length} Image{imageFiles.length !== 1 ? "s" : ""}
              </button>
            )}
          </div>
          {imagePreviews.length > 0 && (
            <div style={{ display: "flex", gap: "10px", marginTop: "10px", flexWrap: "wrap" }}>
              {imagePreviews.map((src, i) => (
                <img key={i} src={src} alt="" style={{ width: "70px", height: "70px", objectFit: "cover", borderRadius: "8px", border: "2px solid #e2e8f0" }} />
              ))}
            </div>
          )}
          {uploadMsg && <p style={{ margin: "8px 0 0", fontSize: "13px", color: uploadMsg.startsWith("✅") ? "#16a34a" : "#dc2626" }}>{uploadMsg}</p>}
        </div>
      )}

      {/* Admin Controls — only visible to admins */}
      {isAdmin && (
        <div style={{
          background: "white", borderRadius: "16px", padding: "20px 24px",
          marginBottom: "20px", boxShadow: "0 2px 10px rgba(9,72,134,0.08)", border: "1px solid #e2e8f0",
        }}>
          <h3 style={{ margin: "0 0 14px 0", color: PRIMARY, fontSize: "16px" }}>🛠 Admin Controls</h3>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
            {[
              { s: "IN_PROGRESS", label: "Set In Progress", color: "#d97706", bg: "#fffbeb" },
              { s: "RESOLVED", label: "Set Resolved", color: "#16a34a", bg: "#f0fdf4" },
              { s: "CLOSED", label: "Set Closed", color: "#6b7280", bg: "#f9fafb" },
              { s: "REJECTED", label: "Set Rejected", color: "#dc2626", bg: "#fef2f2" },
            ].map(({ s, label, color, bg }) => (
              <button key={s} onClick={() => handleStatusUpdate(s)} style={{
                padding: "7px 16px", background: bg, color,
                border: `1px solid ${color}44`, borderRadius: "8px",
                cursor: "pointer", fontSize: "13px", fontWeight: "600",
              }}>{label}</button>
            ))}
          </div>
          <div>
            <input
              value={techEmail}
              onChange={e => { setTechEmail(e.target.value); setTechEmailError(""); }}
              placeholder="Technician email to assign"
              style={{
                width: "100%", padding: "9px 12px", marginBottom: "4px",
                border: techEmailError ? "1.5px solid #dc2626" : "1.5px solid #d1d5db",
                borderRadius: "8px", fontSize: "14px", outline: "none", boxSizing: "border-box",
              }}
            />
            {techEmailError && <div style={{ color: "#dc2626", fontSize: "12px", marginBottom: "8px" }}>{techEmailError}</div>}
            <button onClick={handleAssign} style={{
              padding: "9px 20px",
              background: `linear-gradient(135deg, ${PRIMARY}, ${SECONDARY})`,
              color: "white", border: "none", borderRadius: "8px",
              cursor: "pointer", fontWeight: "600",
            }}>Assign Technician</button>
          </div>
        </div>
      )}
=======
        </div>
      </div>

      {/* Admin Controls */}
      <div style={{
        background: "white", borderRadius: "16px", padding: "20px 24px",
        marginBottom: "20px", boxShadow: "0 2px 10px rgba(9,72,134,0.08)", border: "1px solid #e2e8f0",
      }}>
        <h3 style={{ margin: "0 0 14px 0", color: PRIMARY, fontSize: "16px" }}>🛠 Admin Controls</h3>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
          {[
            { s: "IN_PROGRESS", label: "Set In Progress", color: "#d97706", bg: "#fffbeb" },
            { s: "RESOLVED", label: "Set Resolved", color: "#16a34a", bg: "#f0fdf4" },
            { s: "CLOSED", label: "Set Closed", color: "#6b7280", bg: "#f9fafb" },
            { s: "REJECTED", label: "Set Rejected", color: "#dc2626", bg: "#fef2f2" },
          ].map(({ s, label, color, bg }) => (
            <button key={s} onClick={() => handleStatusUpdate(s)} style={{
              padding: "7px 16px", background: bg, color,
              border: `1px solid ${color}44`, borderRadius: "8px",
              cursor: "pointer", fontSize: "13px", fontWeight: "600",
            }}>{label}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <input value={techEmail} onChange={e => setTechEmail(e.target.value)}
            placeholder="Technician email to assign"
            style={{ flex: 1, padding: "9px 12px", border: "1.5px solid #d1d5db", borderRadius: "8px", fontSize: "14px", outline: "none" }} />
          <button onClick={handleAssign} style={{
            padding: "9px 20px",
            background: `linear-gradient(135deg, ${PRIMARY}, ${SECONDARY})`,
            color: "white", border: "none", borderRadius: "8px",
            cursor: "pointer", fontWeight: "600",
          }}>Assign</button>
        </div>
      </div>
>>>>>>> 9b434a5249957e185d72085a25e4bcdbaa60f373

      {/* Comments */}
      <div style={{
        background: "white", borderRadius: "16px", padding: "20px 24px",
        boxShadow: "0 2px 10px rgba(9,72,134,0.08)", border: "1px solid #e2e8f0",
      }}>
        <h3 style={{ margin: "0 0 16px 0", color: PRIMARY, fontSize: "16px" }}>
          💬 Comments ({ticket.comments?.length || 0})
        </h3>

        {ticket.comments?.length === 0 && (
          <div style={{ textAlign: "center", color: "#94a3b8", padding: "20px 0", fontSize: "14px" }}>
            No comments yet.
          </div>
        )}

        {ticket.comments?.map(c => (
          <div key={c.id} style={{ borderBottom: "1px solid #f1f5f9", paddingBottom: "14px", marginBottom: "14px" }}>
            {editingId === c.id ? (
              <div>
                <textarea value={editContent} onChange={e => setEditContent(e.target.value)} rows={2}
                  style={{ width: "100%", padding: "9px 12px", border: `1.5px solid ${SECONDARY}`, borderRadius: "8px", fontSize: "14px", boxSizing: "border-box", outline: "none" }} />
                <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                  <button onClick={() => handleEditComment(c.id)} style={{
                    padding: "5px 14px",
                    background: `linear-gradient(135deg, ${PRIMARY}, ${SECONDARY})`,
                    color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600",
                  }}>Save</button>
                  <button onClick={() => setEditingId(null)} style={{
                    padding: "5px 14px", background: "#f1f5f9",
                    border: "none", borderRadius: "6px", cursor: "pointer",
                  }}>Cancel</button>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ background: "#f8fafc", borderRadius: "10px", padding: "10px 14px", marginBottom: "6px" }}>
                  <p style={{ margin: 0, fontSize: "14px", color: "#334155" }}>{c.content}</p>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                    👤 {c.authorEmail} · {c.createdAt ? new Date(c.createdAt).toLocaleString() : ""}
                  </span>
<<<<<<< HEAD
                  {/* Edit/Delete only for comment author or admin */}
                  {(c.authorEmail === userEmail || isAdmin) && (
                    <div style={{ display: "flex", gap: "6px" }}>
                      {c.authorEmail === userEmail && (
                        <button onClick={() => { setEditingId(c.id); setEditContent(c.content); }} style={{
                          fontSize: "12px", background: "#eff6ff", color: SECONDARY,
                          border: "none", padding: "3px 10px", borderRadius: "4px", cursor: "pointer",
                        }}>Edit</button>
                      )}
                      <button onClick={() => handleDeleteComment(c.id)} style={{
                        fontSize: "12px", background: "#fef2f2", color: "#dc2626",
                        border: "none", padding: "3px 10px", borderRadius: "4px", cursor: "pointer",
                      }}>Delete</button>
                    </div>
                  )}
=======
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button onClick={() => { setEditingId(c.id); setEditContent(c.content); }} style={{
                      fontSize: "12px", background: "#eff6ff", color: SECONDARY,
                      border: "none", padding: "3px 10px", borderRadius: "4px", cursor: "pointer",
                    }}>Edit</button>
                    <button onClick={() => handleDeleteComment(c.id)} style={{
                      fontSize: "12px", background: "#fef2f2", color: "#dc2626",
                      border: "none", padding: "3px 10px", borderRadius: "4px", cursor: "pointer",
                    }}>Delete</button>
                  </div>
>>>>>>> 9b434a5249957e185d72085a25e4bcdbaa60f373
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Add Comment */}
        <div style={{ marginTop: "12px" }}>
<<<<<<< HEAD
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              value={comment}
              onChange={e => { setComment(e.target.value); setCommentError(""); }}
              placeholder="Write a comment..."
              onKeyDown={e => e.key === "Enter" && handleAddComment()}
              style={{
                flex: 1, padding: "10px 14px",
                border: commentError ? "1.5px solid #dc2626" : "1.5px solid #d1d5db",
                borderRadius: "8px", fontSize: "14px", outline: "none",
              }}
            />
=======
          <input value={authorEmail} onChange={e => setAuthorEmail(e.target.value)}
            placeholder="Your email"
            style={{ width: "100%", padding: "9px 12px", marginBottom: "8px", border: "1.5px solid #d1d5db", borderRadius: "8px", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />
          <div style={{ display: "flex", gap: "10px" }}>
            <input value={comment} onChange={e => setComment(e.target.value)}
              placeholder="Write a comment..."
              onKeyDown={e => e.key === "Enter" && handleAddComment()}
              style={{ flex: 1, padding: "10px 14px", border: "1.5px solid #d1d5db", borderRadius: "8px", fontSize: "14px", outline: "none" }} />
>>>>>>> 9b434a5249957e185d72085a25e4bcdbaa60f373
            <button onClick={handleAddComment} style={{
              padding: "10px 20px",
              background: `linear-gradient(135deg, ${PRIMARY}, ${SECONDARY})`,
              color: "white", border: "none", borderRadius: "8px",
              cursor: "pointer", fontWeight: "600",
            }}>Post</button>
          </div>
<<<<<<< HEAD
          {commentError && <div style={{ color: "#dc2626", fontSize: "12px", marginTop: "4px" }}>{commentError}</div>}
=======
>>>>>>> 9b434a5249957e185d72085a25e4bcdbaa60f373
        </div>
      </div>
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 9b434a5249957e185d72085a25e4bcdbaa60f373
