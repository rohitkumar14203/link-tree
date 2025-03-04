import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import styles from "./LinktreeUsername.module.css";
import logo from "../../assets/LinktreeUsername/logo.png";
import img from "../../assets/Signup/signup-bcg.png";
import { API_URL } from "../../utils/config";

const LinktreeUsername = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [username, setUsername] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [error, setError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setError(""); // Clear any existing error
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    if (e.target.value.trim()) {
      setUsernameError("");
    }
  };

  const handleContinue = async () => {
    let hasError = false;

    if (!selectedCategory) {
      setError("Please select a category");
      hasError = true;
    }

    if (!username.trim()) {
      setUsernameError("Username is required");
      hasError = true;
    }

    if (!hasError) {
      try {
        setIsSubmitting(true);
        
        // Create initial link profile with the username
        await axios.post(
          `${API_URL}/links`,
          {
            profileTitle: username,
            bio: "",
            backgroundColor: "#ffffff",
            links: [],
            shopLinks: [],
            socialLinks: {},
            category: selectedCategory
          },
          { withCredentials: true }
        );
        
        // Navigate to link page after successful save
        navigate("/link");
      } catch (error) {
        console.error("Error saving username:", error);
        setError("Failed to save username. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formSection}>
        <div className={styles.logoContainer}>
          <img src={logo} alt="Spark Logo" className={styles.logo} />
        </div>

        <div className={styles.formContent}>
          <h1 className={styles.heading}>Tell us about yourself</h1>
          <p className={styles.subheading}>
            For a personalized Spark experience
          </p>

          <div className={styles.inputContainer}>
            <input
              type="text"
              placeholder="Tell us your username"
              className={`${styles.usernameInput} ${
                usernameError ? styles.inputError : ""
              }`}
              value={username}
              onChange={handleUsernameChange}
            />
            {usernameError && (
              <p className={styles.errorMessage}>{usernameError}</p>
            )}
          </div>

          <div className={styles.categorySection}>
            <h3 className={styles.categoryHeading}>
              What best describes what you do?
            </h3>
            <div className={styles.categoryGrid}>
              {[
                "Creator",
                "Business",
                "Musician",
                "Designer",
                "Community",
                "Writer",
                "Gamer",
                "Developer",
              ].map((category) => (
                <div
                  key={category}
                  className={`${styles.categoryItem} ${
                    selectedCategory === category ? styles.selected : ""
                  }`}
                  onClick={() => handleCategorySelect(category)}
                >
                  {category}
                </div>
              ))}
            </div>
            {error && <p className={styles.errorMessage}>{error}</p>}
          </div>

          <button 
            className={styles.continueButton} 
            onClick={handleContinue}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Continue"}
          </button>
        </div>
      </div>
      <div className={styles.imageSection}>
        <img src={img} alt="Signup" className={styles.sideImage} />
      </div>
    </div>
  );
};

export default LinktreeUsername;
