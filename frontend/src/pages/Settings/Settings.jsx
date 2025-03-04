import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./Settings.module.css";
import { updateUserProfile } from "../../store/slices/authSlice";

const Settings = () => {
  const dispatch = useDispatch();
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    newPassword: "",
    confirmPassword: "",
  });
  
  const [updateMessage, setUpdateMessage] = useState(""); // Add this line to fix the error

  // Update form data when user data changes
  useEffect(() => {
    if (user) {
      setFormData(prevState => ({
        ...prevState,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  // Handle success/error messages
  useEffect(() => {
    if (isSuccess) {
      setUpdateMessage("Profile updated successfully!");
      // Only clear password fields after successful update
      setFormData(prev => ({
        ...prev,
        newPassword: "",
        confirmPassword: "",
      }));
    }
    if (isError) {
      setUpdateMessage(message || "Update failed");
    }
  }, [isSuccess, isError, message]);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setUpdateMessage("");
  };
  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasNumber = /\d/.test(password);
    
    if (!minLength) {
      return "Password must be at least 8 characters long";
    }
    if (!hasSpecialChar) {
      return "Password must include at least one special character";
    }
    if (!hasNumber) {
      return "Password must include at least one number";
    }
    return "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.newPassword) {
      const passwordError = validatePassword(formData.newPassword);
      if (passwordError) {
        setUpdateMessage(passwordError);
        return;
      }
      
      if (formData.newPassword !== formData.confirmPassword) {
        setUpdateMessage("Passwords don't match");
        return;
      }
    }

    const userData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
    };

    if (formData.newPassword) {
      userData.newPassword = formData.newPassword;
    }

    dispatch(updateUserProfile(userData));
  };
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Hi, !</h1>
        <p>Manage your account settings</p>
      </div>

      {updateMessage && (
        <div className={`${styles.message} ${isError ? styles.error : styles.success}`}>
          {updateMessage}
        </div>
      )}

      <div className={styles.content}>
        <div className={styles.editProfile}>
          <h2>Edit Profile</h2>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label>First name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Last name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>New Password</label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            <button 
              type="submit" 
              className={styles.saveButton}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;