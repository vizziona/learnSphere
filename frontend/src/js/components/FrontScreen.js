import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./css/FrontScreen.css";

import BonheurImage from "./css/bonheur.png";
import AngeImage from "./css/ange.jpg";
import SandrineImage from "./css/sando.jpg";

function FrontScreen() {
  console.log("FrontScreen component rendering");
  const history = useHistory();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch team members from backend
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/team-members");
        console.log("Team members fetched:", res.data);
        const membersWithImages = res.data.map((member, index) => ({
          ...member,
          image: [BonheurImage, AngeImage, SandrineImage][index % 3],
        }));
        setTeamMembers(membersWithImages);
      } catch (err) {
        console.error("Error fetching team members:", {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
        });
        toast.error(
          `Failed to load team members: ${
            err.response?.data?.message || err.message
          }`
        );
      }
    };
    fetchTeamMembers();
  }, []);

  // Set body styles
  useEffect(() => {
    console.log("FrontScreen mounted");
    document.body.style.backgroundColor = "#f5f5f5";
    document.body.style.overflow = "auto";

    return () => {
      document.body.style.backgroundColor = "";
      document.body.style.overflow = "";
    };
  }, []);

  const handleNavClick = (section) => {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsNavOpen(false);
  };

  const handleGetStarted = () => {
    console.log("Get Started clicked, navigating to /topics");
    history.push("/topics");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post("http://localhost:5000/api/contact-messages", formData);
      toast.success("Message sent successfully!");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      console.error("Error submitting contact form:", err);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="home-screen"
      style={{ backgroundColor: "#f5f5f5", color: "#333", minHeight: "100vh" }}
    >
      <ToastContainer position="top-right" autoClose={3000} />
      <header className="home-header">
        <div className="logo-container">
          <span className="logo-text">
            Learn<span className="logo-accent">Sphere</span>
          </span>
        </div>
        <nav className="main-nav">
          <button
            className="hamburger"
            onClick={() => setIsNavOpen(!isNavOpen)}
          >
            <i className={isNavOpen ? "fas fa-times" : "fas fa-bars"}></i>
          </button>
          <ul className={`nav-links ${isNavOpen ? "active" : ""}`}>
            <li>
              <a
                href=""
                onClick={() => handleNavClick("home")}
                className="nav-link"
                style={{ color: "#fff" }}
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#features"
                onClick={() => handleNavClick("features")}
                className="nav-link"
                style={{ color: "#fff" }}
              >
                Features
              </a>
            </li>
            <li>
              <a
                href="#team"
                onClick={() => handleNavClick("team")}
                className="nav-link"
                style={{ color: "#fff" }}
              >
                Team
              </a>
            </li>
            <li>
              <a
                href="#contact"
                onClick={() => handleNavClick("contact")}
                className="nav-link"
                style={{ color: "#fff" }}
              >
                Contact
              </a>
            </li>
          </ul>
        </nav>
        <button className="nav-cta" onClick={handleGetStarted}>
          Get Started for Free
        </button>
      </header>

      <section id="home" className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Experience Learning in a New Dimension</h1>
          <p className="hero-description">
            Explore physics and ICT concepts through interactive web augmented
            reality experiences.
          </p>
          <button className="hero-cta" onClick={handleGetStarted}>
            Get Started for free <i className="fas fa-chevron-right"></i>
          </button>
        </div>
        <div className="hero-image-container">
          <div className="hero-image">
            <div className="orbit-animation">
              <div className="planet"></div>
              <div className="circle c1"></div>
              <div className="circle c2"></div>
              <div className="circle c3"></div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="features-section">
        <h2 className="section-title">
          The Power of Augmented Reality with LearnSphere
        </h2>
        <div className="features-grid">
          <div className="feature-card card-1">
            <div className="feature-icon">
              <i className="fas fa-vr-cardboard"></i>
            </div>
            <h3 className="feature-title">Immersive Experience</h3>
            <p className="feature-description">
              Interact with 3D models in your real-world environment.
            </p>
          </div>
          <div className="feature-card card-2">
            <div className="feature-icon">
              <i className="fas fa-atom"></i>
            </div>
            <h3 className="feature-title">Physics Concepts</h3>
            <p className="feature-description">
              Visualize complex physics principles with interactive simulations.
            </p>
          </div>
          <div className="feature-card card-3">
            <div className="feature-icon">
              <i className="fas fa-microchip"></i>
            </div>
            <h3 className="feature-title">ICT Learning</h3>
            <p className="feature-description">
              Explore computer hardware and networking interactively.
            </p>
          </div>
          <div className="feature-card card-4">
            <div className="feature-icon">
              <i className="fas fa-graduation-cap"></i>
            </div>
            <h3 className="feature-title">Educational</h3>
            <p className="feature-description">
              Designed for students and educators to enhance learning outcomes.
            </p>
          </div>
        </div>
      </section>

      <section id="team" className="team-section">
        <h2 className="section-title">Meet Our Team</h2>
        <p className="team-subtitle">
          Passionate developers and designers creating the future of education
        </p>
        <div className="team-grid">
          {teamMembers.length > 0 ? (
            teamMembers.map((member, index) => (
              <div key={member.id || index} className="team-card">
                <div className="team-card-inner">
                  <div className="team-card-front">
                    <div className="team-image-container">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="team-image"
                        onError={() =>
                          console.error(
                            `Failed to load image for ${member.name}`
                          )
                        }
                      />
                      <div className="team-overlay">
                        <i className="fas fa-user-graduate team-icon"></i>
                      </div>
                    </div>
                    <div className="team-content">
                      <h3 className="team-name">{member.name}</h3>
                      <p className="team-role">{member.role}</p>
                      <div className="team-info">
                        <div className="team-detail">
                          <i className="fas fa-phone"></i>
                          <span>{member.phone}</span>
                        </div>
                        <div className="team-detail">
                          <i className="fas fa-university"></i>
                          <span>{member.university}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="team-card-back">
                    <div className="team-back-content">
                      <h4>Connect with {member.name.split(" ")[0]}</h4>
                      <div className="team-social">
                        <a
                          href={member.linkedin || "#"}
                          className="team-social-link"
                        >
                          <i className="fab fa-linkedin"></i>
                        </a>
                        <a
                          href={member.github || "#"}
                          className="team-social-link"
                        >
                          <i className="fab fa-github"></i>
                        </a>
                        <a
                          href={`mailto:${member.email}`}
                          className="team-social-link"
                        >
                          <i className="fas fa-envelope"></i>
                        </a>
                      </div>
                      <p className="team-bio">
                        {member.bio ||
                          "Dedicated to revolutionizing education through innovative AR/VR technologies and creating immersive learning experiences."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No team members available at the moment.</p>
          )}
        </div>
      </section>

      <section id="contact" className="contact-section">
        <div className="contact-container">
          <div className="contact-info">
            <h2 className="contact-title">Contact Us</h2>
            <p className="contact-description">
              Ready to transform education with us? Let's discuss how
              LearnSphere can enhance your learning experience.
            </p>

            <div className="contact-details">
              <div className="contact-item">
                <div className="contact-icon">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <div className="contact-text">
                  <h4>Location</h4>
                  <p>
                    KN 75 ST
                    <br />
                    Kigali, Rwanda
                  </p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <i className="fas fa-envelope"></i>
                </div>
                <div className="contact-text">
                  <h4>Email</h4>
                  <p>
                    {teamMembers.length > 0 ? (
                      teamMembers.map((member, index) => (
                        <React.Fragment key={member.id || index}>
                          {member.email}
                          <br />
                        </React.Fragment>
                      ))
                    ) : (
                      <span>No contact emails available.</span>
                    )}
                  </p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <i className="fas fa-phone"></i>
                </div>
                <div className="contact-text">
                  <h4>Phone</h4>
                  <p>
                    {teamMembers.length > 0 ? (
                      teamMembers.map((member, index) => (
                        <React.Fragment key={member.id || index}>
                          {member.phone}
                          <br />
                        </React.Fragment>
                      ))
                    ) : (
                      <span>No contact phones available.</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form-container">
            <form className="contact-form" onSubmit={handleFormSubmit}>
              <h3>Send us a Message</h3>
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  className="form-input"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
                <i className="fas fa-user form-icon"></i>
              </div>
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  className="form-input"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                <i className="fas fa-envelope form-icon"></i>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  className="form-input"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                />
                <i className="fas fa-tag form-icon"></i>
              </div>
              <div className="form-group">
                <textarea
                  name="message"
                  placeholder="Your Message"
                  className="form-textarea"
                  rows="5"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                ></textarea>
                <i className="fas fa-message form-icon"></i>
              </div>
              <button
                type="submit"
                className="form-submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Message"}{" "}
                <i className="fas fa-paper-plane"></i>
              </button>
            </form>
          </div>
        </div>
      </section>

      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <span className="logo-text">
              Learn<span className="logo-accent">Sphere</span>
            </span>
            <p className="footer-tagline">
              Learning reimagined through augmented reality
            </p>
          </div>
          <div className="footer-links">
            <div className="footer-column">
              <h4>Navigation</h4>
              <ul>
                <li>
                  <button
                    onClick={() => handleNavClick("home")}
                    className="footer-link-button"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavClick("features")}
                    className="footer-link-button"
                  >
                    Features
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavClick("team")}
                    className="footer-link-button"
                  >
                    Team
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavClick("contact")}
                    className="footer-link-button"
                  >
                    Contact
                  </button>
                </li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Resources</h4>
              <ul>
                <li>
                  <a href="#">Documentation</a>
                </li>
                <li>
                  <a href="#">Tutorials</a>
                </li>
                <li>
                  <a href="#">Help Center</a>
                </li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Connect</h4>
              <div className="social-links">
                <a href="#" aria-label="Twitter">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" aria-label="Facebook">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" aria-label="Instagram">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" aria-label="LinkedIn">
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} LearnSphere. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default FrontScreen;
