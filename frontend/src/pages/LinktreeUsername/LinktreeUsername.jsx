import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LinktreeUsername.module.css";
import logo from "../../assets/LinktreeUsername/logo.png";
import img from "../../assets/Signup/signup-bcg.png";

const LinktreeUsername = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [error, setError] = useState("");
  const [usernameError, setUsernameError] = useState("");

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

  const handleContinue = () => {
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
      // Simply navigate to the link page without making API calls
      navigate("/link");
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
          >
            Continue
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
