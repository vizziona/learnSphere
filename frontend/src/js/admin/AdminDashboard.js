import React, { useEffect, useState } from "react";
import {
  BarChart3,
  BookOpen,
  FlaskConical,
  Settings,
  Users,
  MessageSquare,
  LogOut,
  TrendingUp,
  RefreshCw,
  Activity,
  Calendar,
  Eye,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import Sidebar from "./Sidebar";

function AdminDashboard() {
  const history = useHistory();
  const [stats, setStats] = useState({
    topics: 0,
    experiments: 0,
    modes: 0,
    teamMembers: 0,
    contactMessages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to access the dashboard");
      history.push("/admin/login");
      return;
    }
    fetchDashboardStats();
  }, [history]);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        history.push("/admin/login");
        return;
      }
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch all data in parallel
      const [
        topicsRes,
        experimentsRes,
        modesRes,
        teamMembersRes,
        contactMessagesRes,
      ] = await Promise.all([
        axios.get("http://localhost:5000/api/topics", { headers }),
        axios.get("http://localhost:5000/api/experiments", { headers }),
        axios.get("http://localhost:5000/api/modes", { headers }),
        axios.get("http://localhost:5000/api/team-members", { headers }),
        axios.get("http://localhost:5000/api/contact-messages", { headers }),
      ]);

      setStats({
        topics: topicsRes.data.length,
        experiments: experimentsRes.data.length,
        modes: modesRes.data.length,
        teamMembers: teamMembersRes.data.length,
        contactMessages: contactMessagesRes.data.length,
      });

      // Set recent activity (latest contact messages)
      const recent = contactMessagesRes.data.slice(0, 5).map((msg) => ({
        id: msg.id,
        type: "message",
        title: `New message from ${msg.name}`,
        time: new Date(msg.createdAt).toLocaleDateString(),
      }));
      setRecentActivity(recent);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("token");
        history.push("/login");
      } else {
        toast.error("Failed to load dashboard data");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    history.push("/admin/login");
  };

  const handleRefresh = () => {
    fetchDashboardStats();
    toast.info("Dashboard refreshed");
  };

  const cardData = [
    {
      title: "Topics",
      count: stats.topics,
      icon: BookOpen,
      color: "#3b82f6",
      bgColor: "#eff6ff",
      growth: "+12%",
      description: "Educational topics available",
    },
    {
      title: "Experiments",
      count: stats.experiments,
      icon: FlaskConical,
      color: "#10b981",
      bgColor: "#ecfdf5",
      growth: "+8%",
      description: "Interactive experiments",
    },
    {
      title: "Modes",
      count: stats.modes,
      icon: Settings,
      color: "#f59e0b",
      bgColor: "#fffbeb",
      growth: "+3%",
      description: "Learning modes configured",
    },
    {
      title: "Team Members",
      count: stats.teamMembers,
      icon: Users,
      color: "#8b5cf6",
      bgColor: "#f5f3ff",
      growth: "+5%",
      description: "Active team members",
    },
    {
      title: "Messages",
      count: stats.contactMessages,
      icon: MessageSquare,
      color: "#ef4444",
      bgColor: "#fef2f2",
      growth: "+15%",
      description: "Unread contact messages",
    },
  ];

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
      backdropFilter: "blur(10px)",
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
    logoutButton: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "8px 16px",
      border: "1px solid #fecaca",
      color: "#ef4444",
      backgroundColor: "transparent",
      borderRadius: "12px",
      cursor: "pointer",
      fontWeight: "500",
      transition: "all 0.2s ease",
    },
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: "24px",
      marginBottom: "32px",
    },
    card: {
      backgroundColor: "#ffffff",
      borderRadius: "16px",
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
      border: "1px solid #e2e8f0",
      padding: "24px",
      transition: "all 0.3s ease",
      cursor: "pointer",
    },
    cardHover: {
      transform: "translateY(-4px)",
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.15)",
    },
    cardTop: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "16px",
    },
    iconContainer: {
      padding: "12px",
      borderRadius: "12px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    growthBadge: {
      display: "flex",
      alignItems: "center",
      gap: "4px",
      padding: "4px 8px",
      backgroundColor: "#ecfdf5",
      color: "#10b981",
      borderRadius: "8px",
      fontSize: "0.875rem",
      fontWeight: "500",
    },
    cardCount: {
      fontSize: "3rem",
      fontWeight: "700",
      color: "#1e293b",
      marginBottom: "4px",
      margin: 0,
    },
    cardTitle: {
      color: "#1e293b",
      fontWeight: "600",
      marginBottom: "4px",
      fontSize: "1.125rem",
      margin: 0,
    },
    cardDescription: {
      color: "#64748b",
      fontSize: "0.875rem",
      margin: 0,
    },
    contentGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 2fr",
      gap: "32px",
      marginBottom: "32px",
    },
    activityCard: {
      backgroundColor: "#ffffff",
      borderRadius: "16px",
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
      border: "1px solid #e2e8f0",
      padding: "24px",
    },
    sectionHeader: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      marginBottom: "24px",
    },
    sectionIcon: {
      padding: "8px",
      borderRadius: "12px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    sectionTitle: {
      fontSize: "1.25rem",
      fontWeight: "600",
      color: "#1e293b",
      margin: 0,
    },
    activityList: {
      display: "flex",
      flexDirection: "column",
      gap: "16px",
    },
    activityItem: {
      borderBottom: "1px solid #f1f5f9",
      paddingBottom: "16px",
    },
    activityTitle: {
      fontWeight: "500",
      color: "#1e293b",
      marginBottom: "4px",
      margin: 0,
    },
    activityTime: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      color: "#64748b",
      fontSize: "0.875rem",
    },
    overviewGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
      gap: "24px",
    },
    overviewItem: {
      textAlign: "center",
    },
    overviewCount: {
      fontSize: "3rem",
      fontWeight: "700",
      marginBottom: "8px",
      margin: 0,
    },
    overviewLabel: {
      color: "#64748b",
      fontWeight: "500",
      margin: 0,
    },
    quickActions: {
      backgroundColor: "#ffffff",
      borderRadius: "16px",
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
      border: "1px solid #e2e8f0",
      padding: "24px",
      marginTop: "32px",
    },
    actionsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: "16px",
    },
    actionButton: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      padding: "16px",
      border: "1px solid #e2e8f0",
      borderRadius: "12px",
      backgroundColor: "#ffffff",
      cursor: "pointer",
      transition: "all 0.2s ease",
      textAlign: "left",
    },
    actionContent: {
      display: "flex",
      flexDirection: "column",
      gap: "2px",
    },
    actionTitle: {
      fontWeight: "500",
      color: "#1e293b",
      margin: 0,
    },
    actionDescription: {
      color: "#64748b",
      fontSize: "0.875rem",
      margin: 0,
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
              <p style={styles.loadingText}>Loading dashboard...</p>
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
          {/* Header Section */}
          <div style={styles.header}>
            <div>
              <h1 style={styles.headerTitle}>Admin Dashboard</h1>
              <p style={styles.headerSubtitle}>
                Welcome back! Monitor and manage your platform with ease.
              </p>
            </div>
            <div style={styles.headerActions}>
              <button
                style={styles.refreshButton}
                onClick={handleRefresh}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#dbeafe")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "#eff6ff")
                }
              >
                <RefreshCw size={20} />
              </button>
              <button
                style={styles.logoutButton}
                onClick={handleLogout}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#fef2f2")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "transparent")
                }
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div style={styles.statsGrid}>
            {cardData.map((card, index) => {
              const IconComponent = card.icon;
              return (
                <div
                  key={index}
                  style={styles.card}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow =
                      "0 10px 25px -5px rgba(0, 0, 0, 0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 1px 3px 0 rgba(0, 0, 0, 0.1)";
                  }}
                >
                  <div style={styles.cardTop}>
                    <div
                      style={{
                        ...styles.iconContainer,
                        backgroundColor: card.bgColor,
                      }}
                    >
                      <IconComponent size={24} color={card.color} />
                    </div>
                    <div style={styles.growthBadge}>
                      <TrendingUp size={12} />
                      {card.growth}
                    </div>
                  </div>
                  <h3 style={styles.cardCount}>{card.count}</h3>
                  <h4 style={styles.cardTitle}>{card.title}</h4>
                  <p style={styles.cardDescription}>{card.description}</p>
                </div>
              );
            })}
          </div>

          <div style={styles.contentGrid}>
            {/* Recent Activity */}
            <div style={styles.activityCard}>
              <div style={styles.sectionHeader}>
                <div
                  style={{ ...styles.sectionIcon, backgroundColor: "#fef2f2" }}
                >
                  <MessageSquare size={20} color="#ef4444" />
                </div>
                <h2 style={styles.sectionTitle}>Recent Messages</h2>
              </div>

              {recentActivity.length > 0 ? (
                <div style={styles.activityList}>
                  {recentActivity.map((activity, index) => (
                    <div
                      key={activity.id}
                      style={
                        index === recentActivity.length - 1
                          ? {
                              ...styles.activityItem,
                              borderBottom: "none",
                              paddingBottom: 0,
                            }
                          : styles.activityItem
                      }
                    >
                      <h4 style={styles.activityTitle}>{activity.title}</h4>
                      <div style={styles.activityTime}>
                        <Calendar size={12} />
                        {activity.time}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={styles.emptyState}>No recent messages</div>
              )}
            </div>

            {/* System Overview */}
            <div style={styles.activityCard}>
              <div style={styles.sectionHeader}>
                <div
                  style={{ ...styles.sectionIcon, backgroundColor: "#eff6ff" }}
                >
                  <BarChart3 size={20} color="#3b82f6" />
                </div>
                <h2 style={styles.sectionTitle}>Platform Overview</h2>
              </div>

              <div style={styles.overviewGrid}>
                <div style={styles.overviewItem}>
                  <h3 style={{ ...styles.overviewCount, color: "#3b82f6" }}>
                    {stats.topics + stats.experiments}
                  </h3>
                  <p style={styles.overviewLabel}>Total Content Items</p>
                </div>
                <div style={styles.overviewItem}>
                  <h3 style={{ ...styles.overviewCount, color: "#10b981" }}>
                    {stats.modes}
                  </h3>
                  <p style={styles.overviewLabel}>Learning Modes</p>
                </div>
                <div style={styles.overviewItem}>
                  <h3 style={{ ...styles.overviewCount, color: "#8b5cf6" }}>
                    {stats.teamMembers}
                  </h3>
                  <p style={styles.overviewLabel}>Team Size</p>
                </div>
                <div style={styles.overviewItem}>
                  <h3 style={{ ...styles.overviewCount, color: "#ef4444" }}>
                    {stats.contactMessages}
                  </h3>
                  <p style={styles.overviewLabel}>Pending Messages</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={styles.quickActions}>
            <div style={styles.sectionHeader}>
              <div
                style={{ ...styles.sectionIcon, backgroundColor: "#fffbeb" }}
              >
                <Activity size={20} color="#f59e0b" />
              </div>
              <h2 style={styles.sectionTitle}>Quick Actions</h2>
            </div>

            <div style={styles.actionsGrid}>
              <button
                style={styles.actionButton}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#f8fafc")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "#ffffff")
                }
              >
                <div
                  style={{ ...styles.sectionIcon, backgroundColor: "#eff6ff" }}
                >
                  <BookOpen size={16} color="#3b82f6" />
                </div>
                <div style={styles.actionContent}>
                  <h4 style={styles.actionTitle}>Manage Topics</h4>
                  <p style={styles.actionDescription}>
                    Add or edit educational content
                  </p>
                </div>
              </button>

              <button
                style={styles.actionButton}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#f8fafc")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "#ffffff")
                }
              >
                <div
                  style={{ ...styles.sectionIcon, backgroundColor: "#ecfdf5" }}
                >
                  <FlaskConical size={16} color="#10b981" />
                </div>
                <div style={styles.actionContent}>
                  <h4 style={styles.actionTitle}>View Experiments</h4>
                  <p style={styles.actionDescription}>
                    Monitor interactive content
                  </p>
                </div>
              </button>

              <button
                style={styles.actionButton}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#f8fafc")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "#ffffff")
                }
              >
                <div
                  style={{ ...styles.sectionIcon, backgroundColor: "#fef2f2" }}
                >
                  <Eye size={16} color="#ef4444" />
                </div>
                <div style={styles.actionContent}>
                  <h4 style={styles.actionTitle}>Review Messages</h4>
                  <p style={styles.actionDescription}>Check user feedback</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
