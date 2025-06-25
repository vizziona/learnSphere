import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
} from "@mui/material";
import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 260,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 260,
          boxSizing: "border-box",
          background: "linear-gradient(180deg, #1f2937 0%, #111827 100%)",
          color: "white",
          borderRight: "none",
          boxShadow: "2px 0 12px rgba(0,0,0,0.2)",
        },
      }}
    >
      <Toolbar sx={{ px: 3, py: 2 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            background: "linear-gradient(45deg, #60a5fa, #93c5fd)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          Admin Dashboard
        </Typography>
      </Toolbar>
      <Divider sx={{ bgcolor: "rgba(255,255,255,0.1)", mb: 1 }} />
      <List sx={{ px: 2 }}>
        {[
          { text: "Dashboard", path: "/admin" },
          { text: "Topics", path: "/admin/topics" },
          { text: "Experiments", path: "/admin/experiments" },
          { text: "Modes", path: "/admin/modes" },
          { text: "Team Members", path: "/admin/team-members" },
          { text: "Contact Messages", path: "/admin/contact-messages" },
        ].map((item) => (
          <ListItem
            button
            component={NavLink}
            to={item.path}
            key={item.text}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              py: 1.5,
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.1)",
                transform: "translateX(4px)",
              },
              "&.active": {
                backgroundColor: "rgba(59, 130, 246, 0.2)",
                "& .MuiListItemText-primary": {
                  fontWeight: 600,
                  color: "#93c5fd",
                },
              },
            }}
          >
            <ListItemText
              primary={item.text}
              sx={{
                "& .MuiListItemText-primary": {
                  fontSize: "1rem",
                  color: "rgba(255,255,255,0.9)",
                },
              }}
            />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}

export default Sidebar;
