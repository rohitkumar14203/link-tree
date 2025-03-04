import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import styles from "./Sidebar.module.css";
import link from "../../assets/nav/link.png";
import appearance from "../../assets/nav/appearance.png";
import analytics from "../../assets/nav/analytics.png";
import setting from "../../assets/nav/setting.png";
import logo from "../../assets/Signup/singup_logo.png";
import defaultAvatar from "../../assets/SocialMedia/user.png";
import { API_URL, getProfileImageUrl } from "../../utils/config";
import { logout } from "../../store/slices/authSlice";
import spark from "../../assets/nav/Spark.png";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [profileData, setProfileData] = useState(null);
  const [showLogout, setShowLogout] = useState(false);
  const logoutRef = useRef(null);

  // Fetch profile data when component mounts
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) return;

      try {
        const response = await axios.get(`${API_URL}/links`, {
          withCredentials: true,
        });

        if (response.data) {
          setProfileData(response.data);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, [user]);

  // Close logout dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (logoutRef.current && !logoutRef.current.contains(event.target)) {
        setShowLogout(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Function to determine if a nav item is active
  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  // Get user's profile image or use default
  const getProfileImage = () => {
    if (profileData && profileData.profileImage) {
      return getProfileImageUrl(profileData.profileImage);
    }
    return defaultAvatar;
  };

  // Get user's display name
  const getDisplayName = () => {
    if (user && user.firstName) {
      return `${user.firstName} ${user.lastName || ""}`;
    }
    return "User";
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      navigate("/signin");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Toggle logout dropdown
  const toggleLogout = () => {
    setShowLogout(!showLogout);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.logo}>
          <img src={logo} alt="Spark" />
          <img src={spark} alt="" />
        </div>

        <nav className={styles.navigation}>
          <Link
            to="/link"
            className={`${styles.navItem} ${
              isActive("/link") ? styles.active : ""
            }`}
          >
            <span className={styles.icon}>
              <img src={link} alt="" />
            </span>
            <span className={styles.navText}>Link</span>
          </Link>
          <Link
            to="/appearance"
            className={`${styles.navItem} ${
              isActive("/appearance") ? styles.active : ""
            }`}
          >
            <span className={styles.icon}>
              <img src={appearance} alt="" />
            </span>
            <span className={styles.navText}>Appearance</span>
          </Link>
          <Link
            to="/analytics"
            className={`${styles.navItem} ${
              isActive("/analytics") ? styles.active : ""
            }`}
          >
            <span className={styles.icon}>
              <img src={analytics} alt="" />
            </span>
            <span className={styles.navText}>Analytics</span>
          </Link>
          <Link
            to="/settings"
            className={`${styles.navItem} ${
              isActive("/settings") ? styles.active : ""
            }`}
          >
            <span className={styles.icon}>
              <img src={setting} alt="" />
            </span>
            <span className={styles.navText}>Settings</span>
          </Link>
        </nav>

        <div className={styles.userProfileContainer} ref={logoutRef}>
          <div className={styles.userProfile} onClick={toggleLogout}>
            <img
              src={getProfileImage()}
              alt={getDisplayName()}
              className={styles.avatar}
            />
            <span>{getDisplayName()}</span>
          </div>
          {showLogout && (
            <div className={styles.logoutDropdown}>
              <button className={styles.logoutButton} onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className={styles.mobileNavigation}>
        <Link
          to="/link"
          className={`${styles.mobileNavItem} ${
            isActive("/link") ? styles.mobileActive : ""
          }`}
        >
          <span className={styles.mobileIcon}>
            <img src={link} alt="" />
          </span>
          <span className={styles.mobileNavText}>Links</span>
        </Link>
        <Link
          to="/appearance"
          className={`${styles.mobileNavItem} ${
            isActive("/appearance") ? styles.mobileActive : ""
          }`}
        >
          <span className={styles.mobileIcon}>
            <img src={appearance} alt="" />
          </span>
          <span className={styles.mobileNavText}>Appearance</span>
        </Link>
        <Link
          to="/analytics"
          className={`${styles.mobileNavItem} ${
            isActive("/analytics") ? styles.mobileActive : ""
          }`}
        >
          <span className={styles.mobileIcon}>
            <img src={analytics} alt="" />
          </span>
          <span className={styles.mobileNavText}>Analytics</span>
        </Link>
        <Link
          to="/settings"
          className={`${styles.mobileNavItem} ${
            isActive("/settings") ? styles.mobileActive : ""
          }`}
        >
          <span className={styles.mobileIcon}>
            <img src={setting} alt="" />
          </span>
          <span className={styles.mobileNavText}>Settings</span>
        </Link>
      </div>
    </>
  );
};

export default Sidebar;
