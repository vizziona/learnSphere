import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, RefreshCw, Settings } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import Sidebar from "./Sidebar";

function ModeManager() {
  const [modes, setModes] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    label: "",
    icon: "",
    x: 0,
    y: 0,
    category: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchModes = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/modes", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch modes");
      }
      const data = await response.json();
      setModes(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching modes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModes();
  }, []);

  const handleOpen = () => {
    setFormData({
      id: "",
      label: "",
      icon: "",
      x: 0,
      y: 0,
      category: "",
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      id: "",
      label: "",
      icon: "",
      x: 0,
      y: 0,
      category: "",
    });
  };

  const handleEdit = (mode) => {
    setFormData({
      id: mode.id,
      label: mode.label,
      icon: mode.icon,
      x: mode.x,
      y: mode.y,
      category: mode.category,
    });
    setOpen(true);
  };

  const handleDelete = async (modeId) => {
    if (!window.confirm("Are you sure you want to delete this mode?")) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/modes/${modeId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete mode");
      }

      // Update the local state after successful deletion
      setModes(modes.filter((mode) => mode.id !== modeId));
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error deleting mode:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = formData.id
        ? `http://localhost:5000/api/modes/${formData.id}`
        : "http://localhost:5000/api/modes";
      const method = formData.id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${formData.id ? "update" : "create"} mode`);
      }

      // Refresh the modes list after successful update/create
      await fetchModes();
      handleClose();
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error saving mode:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "x" || name === "y" ? Number(value) : value,
    }));
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
    modeList: {
      backgroundColor: "#ffffff",
      borderRadius: "16px",
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
      border: "1px solid #e2e8f0",
      padding: "24px",
    },
    modeItem: {
      borderBottom: "1px solid #e2e8f0",
      padding: "16px 0",
    },
    modeHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "8px",
    },
    modeInfo: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    modeIcon: {
      width: "48px",
      height: "48px",
      borderRadius: "12px",
      backgroundColor: "#e2e8f0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#64748b",
    },
    modeDetails: {
      display: "flex",
      flexDirection: "column",
    },
    modeName: {
      fontWeight: "600",
      color: "#1e293b",
      margin: 0,
      fontSize: "1.125rem",
    },
    modeDescription: {
      color: "#64748b",
      fontSize: "0.875rem",
      margin: 0,
    },
    modeActions: {
      display: "flex",
      gap: "8px",
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
    editButton: {
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
              <p style={styles.loadingText}>Loading modes...</p>
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
              <h1 style={styles.headerTitle}>Mode Manager</h1>
              <p style={styles.headerSubtitle}>
                Manage different modes and their settings
              </p>
            </div>
            <div style={styles.headerActions}>
              <button
                style={styles.refreshButton}
                onClick={fetchModes}
                title="Refresh modes"
              >
                <RefreshCw size={20} />
              </button>
            </div>
          </div>

          <div style={styles.modeList}>
            {modes.length === 0 ? (
              <div style={styles.emptyState}>
                <p>No modes found</p>
              </div>
            ) : (
              modes.map((mode) => (
                <div key={mode._id} style={styles.modeItem}>
                  <div style={styles.modeHeader}>
                    <div style={styles.modeInfo}>
                      <div style={styles.modeIcon}>
                        <Settings size={24} />
                      </div>
                      <div style={styles.modeDetails}>
                        <h3 style={styles.modeName}>{mode.name}</h3>
                        <p style={styles.modeDescription}>{mode.description}</p>
                      </div>
                    </div>
                    <div style={styles.modeActions}>
                      <button
                        style={{ ...styles.actionButton, ...styles.editButton }}
                        onClick={() => handleEdit(mode)}
                      >
                        Edit
                      </button>
                      <button
                        style={{
                          ...styles.actionButton,
                          ...styles.deleteButton,
                        }}
                        onClick={() => handleDelete(mode._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModeManager;
