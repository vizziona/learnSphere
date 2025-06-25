import React, { useState, useEffect } from "react";
import axios from "axios";
import { Eye, Trash2, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";
import Sidebar from "./Sidebar";

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/contact-messages",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setMessages(res.data);
    } catch (err) {
      toast.error("Failed to load contact messages");
    } finally {
      setLoading(false);
    }
  };

  const handleView = (message) => {
    setSelectedMessage(message);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedMessage(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        await axios.delete(`http://localhost:5000/api/contact-messages/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        toast.success("Message deleted");
        fetchMessages();
      } catch (err) {
        toast.error("Error deleting message");
      }
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    await fetchMessages();
  };

  const styles = {
    container: {
      minHeight: "100vh",
      backgroundImage:
        "url('https://res.cloudinary.com/bonheur/image/upload/v1750074391/imigongo2_fkdbin.png')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      display: "flex",
      position: "relative",
    },
    overlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backdropFilter: "blur(1px)",
    },
    sidebar: {
      width: "256px",
      backgroundColor: "#ffffff",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
      position: "relative",
      zIndex: 1,
    },
    main: {
      flex: 1,
      padding: "32px",
      position: "relative",
      zIndex: 1,
    },
    maxWidth: {
      maxWidth: "1280px",
      margin: "0 auto",
    },
    header: {
      backgroundColor: "#ffffff",
      borderRadius: "16px",
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
      border: "1px solid #e2e8f0",
      padding: "32px",
      marginBottom: "32px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    headerTitle: {
      fontSize: "2.25rem",
      fontWeight: "700",
      color: "#1e293b",
      marginBottom: "8px",
      margin: 0,
    },
    headerSubtitle: {
      fontSize: "1.125rem",
      color: "#64748b",
      margin: 0,
    },
    headerActions: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    refreshButton: {
      padding: "12px",
      backgroundColor: "#eff6ff",
      color: "#3b82f6",
      border: "none",
      borderRadius: "12px",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    messageList: {
      backgroundColor: "#ffffff",
      borderRadius: "16px",
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
      border: "1px solid #e2e8f0",
      padding: "24px",
    },
    messageItem: {
      borderBottom: "1px solid #e2e8f0",
      padding: "16px 0",
    },
    messageHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "8px",
    },
    messageInfo: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    avatar: {
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      backgroundColor: "#e2e8f0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#64748b",
      fontWeight: "600",
    },
    senderInfo: {
      display: "flex",
      flexDirection: "column",
    },
    senderName: {
      fontWeight: "600",
      color: "#1e293b",
      margin: 0,
    },
    senderEmail: {
      color: "#64748b",
      fontSize: "0.875rem",
      margin: 0,
    },
    messageTime: {
      color: "#64748b",
      fontSize: "0.875rem",
    },
    messageContent: {
      color: "#1e293b",
      margin: "8px 0",
      lineHeight: "1.5",
    },
    messageActions: {
      display: "flex",
      gap: "8px",
      marginTop: "8px",
    },
    actionButton: {
      padding: "6px 12px",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "0.875rem",
      fontWeight: "500",
      transition: "all 0.2s ease",
    },
    replyButton: {
      backgroundColor: "#eff6ff",
      color: "#3b82f6",
    },
    deleteButton: {
      backgroundColor: "#fef2f2",
      color: "#ef4444",
    },
    loading: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "400px",
      flexDirection: "column",
      gap: "16px",
    },
    spinner: {
      width: "48px",
      height: "48px",
      border: "2px solid #e2e8f0",
      borderTop: "2px solid #3b82f6",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    },
    loadingText: {
      color: "#64748b",
      fontWeight: "500",
      margin: 0,
    },
    emptyState: {
      textAlign: "center",
      padding: "32px 0",
      color: "#64748b",
    },
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.overlay}></div>
        <Sidebar style={styles.sidebar} />
        <div style={styles.main}>
          <div style={styles.maxWidth}>
            <div style={styles.loading}>
              <style>
                {`
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}
              </style>
              <div style={styles.spinner}></div>
              <p style={styles.loadingText}>Loading messages...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.overlay}></div>
      <Sidebar style={styles.sidebar} />
      <div style={styles.main}>
        <div style={styles.maxWidth}>
          <div style={styles.header}>
            <div>
              <h1 style={styles.headerTitle}>Contact Messages</h1>
              <p style={styles.headerSubtitle}>
                Manage and respond to user inquiries
              </p>
            </div>
            <div style={styles.headerActions}>
              <button
                style={styles.refreshButton}
                onClick={handleRefresh}
                title="Refresh messages"
              >
                <RefreshCw size={20} />
              </button>
            </div>
          </div>

          <div style={styles.messageList}>
            {messages.length === 0 ? (
              <div style={styles.emptyState}>
                <p>No messages found</p>
              </div>
            ) : (
              messages.map((message) => (
                <div key={message._id} style={styles.messageItem}>
                  <div style={styles.messageHeader}>
                    <div style={styles.messageInfo}>
                      <div style={styles.avatar}>
                        {message.name.charAt(0).toUpperCase()}
                      </div>
                      <div style={styles.senderInfo}>
                        <h3 style={styles.senderName}>{message.name}</h3>
                        <p style={styles.senderEmail}>{message.email}</p>
                      </div>
                    </div>
                    <span style={styles.messageTime}>
                      {new Date(message.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p style={styles.messageContent}>{message.message}</p>
                  <div style={styles.messageActions}>
                    <button
                      style={{ ...styles.actionButton, ...styles.replyButton }}
                      onClick={() => handleReply(message)}
                    >
                      Reply
                    </button>
                    <button
                      style={{ ...styles.actionButton, ...styles.deleteButton }}
                      onClick={() => handleDelete(message._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactMessages;
