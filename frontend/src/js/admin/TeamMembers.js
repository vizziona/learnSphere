import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Edit, Trash2, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";
import Sidebar from "./Sidebar";

const TeamMembers = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    phone: "",
    university: "",
    role: "",
    email: "",
    linkedin: "",
    github: "",
    bio: "",
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/team-members", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setTeamMembers(res.data);
      setLoading(false);
    } catch (err) {
      toast.error("Failed to fetch team members");
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await axios.put(
          `http://localhost:5000/api/team-members/${formData.id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        toast.success("Team member updated");
      } else {
        await axios.post("http://localhost:5000/api/team-members", formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        toast.success("Team member added");
      }
      fetchTeamMembers();
      resetForm();
      setOpenDialog(false);
    } catch (err) {
      toast.error("Error saving team member");
    }
  };

  const handleEdit = (member) => {
    setFormData(member);
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this team member?")) {
      try {
        await axios.delete(`http://localhost:5000/api/team-members/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        toast.success("Team member deleted");
        fetchTeamMembers();
      } catch (err) {
        toast.error("Error deleting team member");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      phone: "",
      university: "",
      role: "",
      email: "",
      linkedin: "",
      github: "",
      bio: "",
    });
  };

  const handleOpenDialog = () => {
    resetForm();
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    resetForm();
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
    addButton: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "12px 20px",
      backgroundColor: "#3b82f6",
      color: "#ffffff",
      border: "none",
      borderRadius: "12px",
      cursor: "pointer",
      fontWeight: "500",
      transition: "all 0.2s ease",
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
    memberList: {
      backgroundColor: "#ffffff",
      borderRadius: "16px",
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
      border: "1px solid #e2e8f0",
      padding: "24px",
    },
    memberItem: {
      borderBottom: "1px solid #e2e8f0",
      padding: "16px 0",
    },
    memberHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "8px",
    },
    memberInfo: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    avatar: {
      width: "48px",
      height: "48px",
      borderRadius: "50%",
      backgroundColor: "#e2e8f0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#64748b",
      fontWeight: "600",
      fontSize: "1.25rem",
    },
    memberDetails: {
      display: "flex",
      flexDirection: "column",
    },
    memberName: {
      fontWeight: "600",
      color: "#1e293b",
      margin: 0,
      fontSize: "1.125rem",
    },
    memberRole: {
      color: "#64748b",
      fontSize: "0.875rem",
      margin: 0,
    },
    memberActions: {
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
    dialog: {
      backgroundColor: "#ffffff",
      borderRadius: "16px",
      boxShadow:
        "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      padding: "24px",
      maxWidth: "400px",
      width: "90%",
      margin: "auto",
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      border: "1px solid rgba(226, 232, 240, 0.8)",
      backdropFilter: "blur(8px)",
      maxHeight: "90vh",
      overflowY: "auto",
      zIndex: 1000,
    },
    dialogTitle: {
      fontSize: "1.5rem",
      fontWeight: "700",
      color: "#1e293b",
      marginBottom: "20px",
      textAlign: "center",
      background: "linear-gradient(135deg, #1e293b 0%, #3b82f6 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      letterSpacing: "-0.5px",
    },
    dialogContent: {
      display: "flex",
      flexDirection: "column",
      gap: "16px",
    },
    textField: {
      padding: "10px 14px",
      border: "1px solid #e2e8f0",
      borderRadius: "8px",
      fontSize: "0.875rem",
      color: "#1e293b",
      width: "100%",
      boxSizing: "border-box",
      transition: "all 0.2s ease",
      backgroundColor: "#f8fafc",
    },
    textareaField: {
      padding: "10px 14px",
      border: "1px solid #e2e8f0",
      borderRadius: "8px",
      fontSize: "0.875rem",
      color: "#1e293b",
      width: "100%",
      boxSizing: "border-box",
      transition: "all 0.2s ease",
      backgroundColor: "#f8fafc",
      minHeight: "100px",
      resize: "vertical",
      fontFamily: "inherit",
      lineHeight: "1.5",
    },
    textFieldFocus: {
      borderColor: "#3b82f6",
      boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.1)",
      outline: "none",
    },
    selectField: {
      padding: "10px 14px",
      border: "1px solid #e2e8f0",
      borderRadius: "8px",
      fontSize: "0.875rem",
      color: "#1e293b",
      width: "100%",
      boxSizing: "border-box",
      backgroundColor: "#f8fafc",
      transition: "all 0.2s ease",
      cursor: "pointer",
    },
    selectFieldFocus: {
      borderColor: "#3b82f6",
      boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.1)",
      outline: "none",
    },
    dialogActions: {
      display: "flex",
      justifyContent: "flex-end",
      gap: "12px",
      marginTop: "24px",
      paddingTop: "16px",
      borderTop: "1px solid #e2e8f0",
    },
    cancelButton: {
      padding: "8px 16px",
      backgroundColor: "#f1f5f9",
      color: "#64748b",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "500",
      fontSize: "0.875rem",
      transition: "all 0.2s ease",
      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
    },
    cancelButtonHover: {
      backgroundColor: "#e2e8f0",
      transform: "translateY(-1px)",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    saveButton: {
      padding: "8px 16px",
      backgroundColor: "#3b82f6",
      color: "#ffffff",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "500",
      fontSize: "0.875rem",
      transition: "all 0.2s ease",
      boxShadow: "0 2px 4px rgba(59, 130, 246, 0.2)",
    },
    saveButtonHover: {
      backgroundColor: "#2563eb",
      transform: "translateY(-1px)",
      boxShadow: "0 4px 6px rgba(59, 130, 246, 0.3)",
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
              <p style={styles.loadingText}>Loading team members...</p>
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
              <h1 style={styles.headerTitle}>Team Members</h1>
              <p style={styles.headerSubtitle}>
                Manage your team members and their roles
              </p>
            </div>
            <div style={styles.headerActions}>
              <button
                style={styles.refreshButton}
                onClick={fetchTeamMembers}
                title="Refresh team members"
              >
                <RefreshCw size={20} />
              </button>
              <button style={styles.addButton} onClick={handleOpenDialog}>
                <Plus size={20} />
                Add Member
              </button>
            </div>
          </div>

          <div style={styles.memberList}>
            {teamMembers.length === 0 ? (
              <div style={styles.emptyState}>
                <p>No team members found</p>
              </div>
            ) : (
              teamMembers.map((member) => (
                <div key={member.id} style={styles.memberItem}>
                  <div style={styles.memberHeader}>
                    <div style={styles.memberInfo}>
                      <div style={styles.avatar}>
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <div style={styles.memberDetails}>
                        <h3 style={styles.memberName}>{member.name}</h3>
                        <p style={styles.memberRole}>{member.role}</p>
                      </div>
                    </div>
                    <div style={styles.memberActions}>
                      <button
                        style={{ ...styles.actionButton, ...styles.editButton }}
                        onClick={() => handleEdit(member)}
                      >
                        Edit
                      </button>
                      <button
                        style={{
                          ...styles.actionButton,
                          ...styles.deleteButton,
                        }}
                        onClick={() => handleDelete(member.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {openDialog && (
            <div style={styles.dialog}>
              <h2 style={styles.dialogTitle}>
                {formData.id ? "Edit Team Member" : "Add Team Member"}
              </h2>
              <form onSubmit={handleSubmit} style={styles.dialogContent}>
                <input
                  style={styles.textField}
                  placeholder="Username"
                  name="id"
                  value={formData.id}
                  onChange={handleInputChange}
                  required
                  disabled={!!formData.id}
                />
                <input
                  style={styles.textField}
                  placeholder="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
                <input
                  style={styles.textField}
                  placeholder="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
                <input
                  style={styles.textField}
                  placeholder="University"
                  name="university"
                  value={formData.university}
                  onChange={handleInputChange}
                  required
                />
                <input
                  style={styles.textField}
                  placeholder="Role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                />
                <input
                  style={styles.textField}
                  placeholder="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                <input
                  style={styles.textField}
                  placeholder="LinkedIn URL"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleInputChange}
                />
                <input
                  style={styles.textField}
                  placeholder="GitHub URL"
                  name="github"
                  value={formData.github}
                  onChange={handleInputChange}
                />
                <textarea
                  style={styles.textareaField}
                  placeholder="Bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                />
              </form>
              <div style={styles.dialogActions}>
                <button
                  style={styles.cancelButton}
                  onClick={handleCloseDialog}
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
                  {formData.id ? "Update" : "Add"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamMembers;
