import React from "react";
import { render } from "react-dom";
import { AppContainer } from "react-hot-loader";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./styles/index.scss";

import FrontScreen from "./js/components/FrontScreen.js";
import TopicSelection from "./js/TopicSelection.js";
import PhysicsNavigation from "./js/PhysicsNavigation.js";
import ICTNavigation from "./js/ICTNavigation.js";
import ModeSelection from "./js/ModeSelection.js";
import FunNavigation from "./js/FunNavigation.js";
import AdminDashboard from "./js/admin/AdminDashboard.js";
import TopicManager from "./js/admin/TopicManager.js";
import ContactMessage from "./js/admin/ContactMessage.js";
import ExperimentManager from "./js/admin/ExperimentManager.js";
import ModeManager from "./js/admin/ModeManager.js";
import Login from "./js/admin/Login.js";
import TeamMembers from "./js/admin/TeamMembers.js";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#1976d2" },
    secondary: { main: "#4caf50" },
  },
});

const App = () => {
  console.log("App is rendering");
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={FrontScreen} />
        <Route path="/topics" component={TopicSelection} />
        <Route path="/physics" component={PhysicsNavigation} />
        <Route path="/ict" component={ICTNavigation} />
        <Route path="/fun" component={FunNavigation} />
        <Route path="/mode-selection" component={ModeSelection} />
        <Route
          path="/ar/:category/:experimentId"
          render={(props) => {
            const { category, experimentId } = props.match.params;
            window.location.href = `http://localhost:5000/frontend/experiments/${category}/${experimentId}/ar/index.html`;
            return null;
          }}
        />
        <Route
          path="/simulation/:category/:experimentId"
          render={(props) => {
            const { category, experimentId } = props.match.params;
            window.location.href = `http://localhost:5000/frontend/experiments/${category}/${experimentId}/simulation/index.html`;
            return null;
          }}
        />
        <Route path="/admin/login" component={Login} />
        <Route path="/admin/topics" component={TopicManager} />
        <Route path="/admin/experiments" component={ExperimentManager} />
        <Route path="/admin/team-members" component={TeamMembers} />
        <Route path="/admin/modes" component={ModeManager} />
        <Route path="/admin/contact-messages" component={ContactMessage} />
        <Route exact path="/admin" component={AdminDashboard} />
      </Switch>
    </Router>
  );
};

render(
  <ThemeProvider theme={theme}>
    <App />
    <ToastContainer position="top-right" autoClose={3000} />
  </ThemeProvider>,
  document.querySelector("#root")
);

console.log("App should be rendered");
