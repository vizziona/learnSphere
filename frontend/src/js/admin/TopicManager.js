import { useState, useEffect } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import Sidebar from "./Sidebar";

function TopicManager() {
  const [topics, setTopics] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    label: "",
    icon: "",
    x: 0,
    y: 0,
    route: "",
  });

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/topics", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setTopics(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error fetching topics");
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({ id: "", label: "", icon: "", x: 0, y: 0, route: "" });
  };

  const handleSubmit = async () => {
    try {
      if (formData.id) {
        await axios.put(
          `http://localhost:5000/api/topics/${formData.id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        toast.success("Topic updated");
      } else {
        await axios.post("http://localhost:5000/api/topics", formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        toast.success("Topic created");
      }
      fetchTopics();
      handleClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving topic");
    }
  };

  const handleEdit = (topic) => {
    setFormData(topic);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/topics/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("Topic deleted");
      fetchTopics();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error deleting topic");
    }
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
    title: {
      fontSize: "2.5rem",
      fontWeight: "700",
      color: "#1e293b",
      marginBottom: "32px",
      textAlign: "center",
      textShadow: "2px 2px 4px rgba(0, 0, 0, 0.1)",
      background: "linear-gradient(135deg, #1e293b 0%, #3b82f6 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      letterSpacing: "-0.5px",
    },
    addButton: {
      padding: "12px 24px",
      backgroundColor: "#3b82f6",
      color: "#ffffff",
      border: "none",
      borderRadius: "12px",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: "1rem",
      transition: "all 0.3s ease",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      marginBottom: "24px",
      boxShadow: "0 4px 6px -1px rgba(59, 130, 246, 0.2)",
      position: "relative",
      overflow: "hidden",
    },
    addButtonHover: {
      backgroundColor: "#2563eb",
      transform: "translateY(-2px)",
      boxShadow: "0 6px 8px -1px rgba(59, 130, 246, 0.3)",
    },
    addButtonActive: {
      transform: "translateY(0)",
      boxShadow: "0 2px 4px -1px rgba(59, 130, 246, 0.2)",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      backgroundColor: "#ffffff",
      borderRadius: "16px",
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
      border: "1px solid #e2e8f0",
    },
    tableHead: {
      backgroundColor: "#f8fafc",
    },
    tableCell: {
      padding: "12px 16px",
      borderBottom: "1px solid #e2e8f0",
      color: "#1e293b",
      fontSize: "0.875rem",
      fontWeight: "500",
    },
    tableHeaderCell: {
      padding: "12px 16px",
      borderBottom: "1px solid #e2e8f0",
      color: "#64748b",
      fontSize: "0.875rem",
      fontWeight: "600",
      textAlign: "left",
    },
    actionButton: {
      padding: "6px 12px",
      margin: "0 4px",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
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
    dialog: {
      backgroundColor: "#ffffff",
      borderRadius: "16px",
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.15)",
      padding: "24px",
      maxWidth: "500px",
      width: "100%",
      margin: "auto",
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    },
    dialogTitle: {
      fontSize: "1.25rem",
      fontWeight: "600",
      color: "#1e293b",
      marginBottom: "16px",
    },
    dialogContent: {
      display: "flex",
      flexDirection: "column",
      gap: "16px",
    },
    textField: {
      padding: "10px 12px",
      border: "1px solid #e2e8f0",
      borderRadius: "8px",
      fontSize: "0.875rem",
      color: "#1e293b",
      width: "100%",
      boxSizing: "border-box",
    },
    selectField: {
      padding: "10px 12px",
      border: "1px solid #e2e8f0",
      borderRadius: "8px",
      fontSize: "0.875rem",
      color: "#1e293b",
      width: "100%",
      boxSizing: "border-box",
      backgroundColor: "#ffffff",
    },
    dialogActions: {
      display: "flex",
      justifyContent: "flex-end",
      gap: "12px",
      marginTop: "16px",
    },
    cancelButton: {
      padding: "8px 16px",
      backgroundColor: "#f1f5f9",
      color: "#64748b",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "500",
    },
    saveButton: {
      padding: "8px 16px",
      backgroundColor: "#3b82f6",
      color: "#ffffff",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "500",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.overlay}></div>
      <Sidebar style={styles.sidebar} />
      <div style={styles.main}>
        <div style={styles.maxWidth}>
          <h2 style={styles.title}>Manage Topics</h2>
          <table style={styles.table}>
            <thead style={styles.tableHead}>
              <tr>
                <th style={styles.tableHeaderCell}>ID</th>
                <th style={styles.tableHeaderCell}>Label</th>
                <th style={styles.tableHeaderCell}>Icon</th>
                <th style={styles.tableHeaderCell}>X</th>
                <th style={styles.tableHeaderCell}>Y</th>
                <th style={styles.tableHeaderCell}>Category</th>
                <th style={styles.tableHeaderCell}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {topics.map((topic) => (
                <tr key={topic.id}>
                  <td style={styles.tableCell}>{topic.id}</td>
                  <td style={styles.tableCell}>{topic.label}</td>
                  <td style={styles.tableCell}>{topic.icon}</td>
                  <td style={styles.tableCell}>{topic.x}</td>
                  <td style={styles.tableCell}>{topic.y}</td>
                  <td style={styles.tableCell}>{topic.category}</td>
                  <td style={styles.tableCell}>
                    <button
                      style={{ ...styles.actionButton, ...styles.editButton }}
                      onClick={() => handleEdit(topic)}
                      onMouseEnter={(e) =>
                        (e.target.style.backgroundColor = "#dbeafe")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.backgroundColor = "#eff6ff")
                      }
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      style={{ ...styles.actionButton, ...styles.deleteButton }}
                      onClick={() => handleDelete(topic.id)}
                      onMouseEnter={(e) =>
                        (e.target.style.backgroundColor = "#fecaca")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.backgroundColor = "#fef2f2")
                      }
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {open && (
            <div style={styles.dialog}>
              <h2 style={styles.dialogTitle}>
                {formData.id ? "Edit Topic" : "Add Topic"}
              </h2>
              <div style={styles.dialogContent}>
                <input
                  style={styles.textField}
                  placeholder="ID"
                  value={formData.id}
                  onChange={(e) =>
                    setFormData({ ...formData, id: e.target.value })
                  }
                  disabled={!!formData.id}
                />
                <input
                  style={styles.textField}
                  placeholder="Label"
                  value={formData.label}
                  onChange={(e) =>
                    setFormData({ ...formData, label: e.target.value })
                  }
                />
                <input
                  style={styles.textField}
                  placeholder="Icon (Emoji)"
                  value={formData.icon}
                  onChange={(e) =>
                    setFormData({ ...formData, icon: e.target.value })
                  }
                />
                <input
                  style={styles.textField}
                  type="number"
                  placeholder="X Position"
                  value={formData.x}
                  onChange={(e) =>
                    setFormData({ ...formData, x: Number(e.target.value) })
                  }
                />
                <input
                  style={styles.textField}
                  type="number"
                  placeholder="Y Position"
                  value={formData.y}
                  onChange={(e) =>
                    setFormData({ ...formData, y: Number(e.target.value) })
                  }
                />
                <select
                  style={styles.selectField}
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                >
                  <option value="">Select Category</option>
                  <option value="physics">Physics</option>
                  <option value="ict">ICT</option>
                  <option value="fun">Fun</option>
                </select>
              </div>
              <div style={styles.dialogActions}>
                <button
                  style={styles.cancelButton}
                  onClick={handleClose}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#e2e8f0")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "#f1f5f9")
                  }
                >
                  Cancel
                </button>
                <button
                  style={styles.saveButton}
                  onClick={handleSubmit}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#2563eb")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "#3b82f6")
                  }
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TopicManager;
