import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "./LinkTree.module.css";
import { API_URL, getProfileImageUrl } from "../../utils/config";

// Import assets
import defaultUser from "../../assets/SocialMedia/user.png";
import instagramIcon from "../../assets/SocialMedia/instagram.png";
import facebookIcon from "../../assets/SocialMedia/facebook.png";
import youtubeIcon from "../../assets/SocialMedia/youtube.png";
import twitterIcon from "../../assets/SocialMedia/x.png";
import fireLogo from "../../assets/Tlogo.png";

const LinkTree = () => {
  const { username } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("link");
  const [clickedLinks, setClickedLinks] = useState({});
  const [socialLinks, setSocialLinks] = useState({});
  const [analytics, setAnalytics] = useState({});
  const [appearance, setAppearance] = useState({
    layout: "stack",
    buttonStyle: "fill",
    buttonColor: "#111111",
    buttonFontColor: "#888888",
    font: "DM Sans",
    textColor: "#ffffff",
    theme: "air-snow",
  });
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fix: Remove references to undefined 'profile' variable
  // const userId = profile?.user?._id;
  // const links = profile?.links || [];
  // const shopLinks = profile?.shopLinks || [];
  // const appearance = profile?.appearance || {};
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/links/public/${username}`);

        if (response.data) {
          setProfileData(response.data);
          if (response.data.socialLinks) {
            setSocialLinks(response.data.socialLinks);
          }
          // Set appearance settings if available
          if (response.data.appearance) {
            setAppearance(response.data.appearance);
          }
          setError(null);
        } else {
          setError("Profile not found");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchProfile();
    }
  }, [username]);

  // Update polling interval to use API_URL
  useEffect(() => {
    const pollInterval = setInterval(() => {
      if (username) {
        axios
          .get(`${API_URL}/links/public/${username}`)
          .then((response) => {
            if (response.data) {
              setProfileData(response.data);
              if (response.data.socialLinks) {
                setSocialLinks(response.data.socialLinks);
              }
            }
          })
          .catch((err) => console.error("Error polling for updates:", err));
      }
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(pollInterval);
  }, [username]);
  // Track link clicks
  const trackLinkClick = async (linkId, isShopLink = false) => {
    if (!profileData) return;

    try {
      console.log("Tracking click for link:", linkId, "isShop:", isShopLink);

      // Use the correct endpoint from linkRoutes.js
      await axios.post(`${API_URL}/links/click`, {
        linkId,
        isShopLink,
      });

      console.log("Click tracked successfully");
    } catch (error) {
      console.error("Error tracking link click:", error);
    }
  };

  // Handle link click
  const handleLinkClick = (linkId, isShopLink = false) => {
    // Update clicked state for animation
    setClickedLinks((prev) => ({
      ...prev,
      [linkId]: true,
    }));

    // Track the click
    trackLinkClick(linkId, isShopLink);

    // Reset clicked state after animation
    setTimeout(() => {
      setClickedLinks((prev) => ({
        ...prev,
        [linkId]: false,
      }));
    }, 500);
  };

  // Get the appropriate icon for the app
  const getAppIcon = (app) => {
    switch (app) {
      case "instagram":
        return instagramIcon;
      case "facebook":
        return facebookIcon;
      case "youtube":
        return youtubeIcon;
      case "twitter":
        return twitterIcon;
      default:
        return null;
    }
  };

  // Handle carousel navigation
  const handlePrevSlide = () => {
    const activeLinks =
      activeTab === "link" ? profileData.links : profileData.shopLinks;
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : activeLinks.length - 1));
  };

  const handleNextSlide = () => {
    const activeLinks =
      activeTab === "link" ? profileData.links : profileData.shopLinks;
    setCurrentSlide((prev) => (prev < activeLinks.length - 1 ? prev + 1 : 0));
  };

  if (loading) {
    return <div className={styles.loadingContainer}>Loading...</div>;
  }

  if (error || !profileData) {
    return (
      <div className={styles.errorContainer}>
        <h2>Oops!</h2>
        <p>{error || "Profile not found"}</p>
        <p>Check the URL and try again.</p>
      </div>
    );
  }

  const { profileTitle, bio, backgroundColor, profileImage, links, shopLinks } =
    profileData;
  const activeLinks = activeTab === "link" ? links : shopLinks;

  // Render links based on layout type
  const renderLinks = () => {
    if (!activeLinks || activeLinks.length === 0) {
      return (
        <p className={styles.emptyMessage}>
          No {activeTab === "link" ? "links" : "shop items"} available
        </p>
      );
    }

    switch (appearance.layout) {
      case "grid":
        return (
          <div className={`${styles.linksContainer} ${styles.gridLayout}`}>
            {activeLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.linkButton} ${
                  clickedLinks[link._id] ? styles.clickedLink : ""
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link._id, activeTab === "shop");
                  setTimeout(() => {
                    window.open(link.url, "_blank", "noopener,noreferrer");
                  }, 300);
                }}
              >
                {link.app && (
                  <div className={styles.appIconContainer}>
                    <img
                      src={getAppIcon(link.app)}
                      alt={link.app}
                      className={styles.appIcon}
                    />
                  </div>
                )}
                <span className={styles.linkTitle}>{link.title}</span>
              </a>
            ))}
          </div>
        );

      case "carousel":
        return (
          <div className={styles.carouselContainer}>
            <div className={styles.carouselControls}>
              <button
                className={styles.carouselButton}
                onClick={handlePrevSlide}
              >
                &#10094;
              </button>
              <div className={styles.carouselIndicators}>
                {activeLinks.map((_, index) => (
                  <div
                    key={index}
                    className={`${styles.indicator} ${
                      index === currentSlide ? styles.activeIndicator : ""
                    }`}
                    onClick={() => setCurrentSlide(index)}
                  ></div>
                ))}
              </div>
              <button
                className={styles.carouselButton}
                onClick={handleNextSlide}
              >
                &#10095;
              </button>
            </div>

            <div className={styles.carouselSlide}>
              {activeLinks.length > 0 && (
                <a
                  href={activeLinks[currentSlide].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.linkButton} ${
                    clickedLinks[activeLinks[currentSlide]._id]
                      ? styles.clickedLink
                      : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(
                      activeLinks[currentSlide]._id,
                      activeTab === "shop"
                    );
                    setTimeout(() => {
                      window.open(
                        activeLinks[currentSlide].url,
                        "_blank",
                        "noopener,noreferrer"
                      );
                    }, 300);
                  }}
                >
                  {activeLinks[currentSlide].app && (
                    <div className={styles.appIconContainer}>
                      <img
                        src={getAppIcon(activeLinks[currentSlide].app)}
                        alt={activeLinks[currentSlide].app}
                        className={styles.appIcon}
                      />
                    </div>
                  )}
                  <span className={styles.linkTitle}>
                    {activeLinks[currentSlide].title}
                  </span>
                </a>
              )}
            </div>
          </div>
        );

      case "stack":
      default:
        return (
          <div className={styles.linksContainer}>
            {activeLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.linkButton} ${
                  clickedLinks[link._id] ? styles.clickedLink : ""
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link._id, activeTab === "shop");
                  setTimeout(() => {
                    window.open(link.url, "_blank", "noopener,noreferrer");
                  }, 300);
                }}
              >
                {link.app && (
                  <div className={styles.appIconContainer}>
                    <img
                      src={getAppIcon(link.app)}
                      alt={link.app}
                      className={styles.appIcon}
                    />
                  </div>
                )}
                <span className={styles.linkTitle}>{link.title}</span>
              </a>
            ))}
          </div>
        );
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.linkTreeContent}>
        <div
          className={styles.linkTreeContent1}
          style={{ backgroundColor: backgroundColor || "#3C3431" }}
        >
          <div className={styles.profileHeader}>
            <img
              src={
                profileImage ? getProfileImageUrl(profileImage) : defaultUser
              }
              alt={profileTitle}
              className={styles.profileImage}
            />
            <h1 className={styles.profileTitle}>{profileTitle}</h1>
            {bio && <p className={styles.bio}>{bio}</p>}
          </div>
        </div>

        {/* Social Media Icons */}
        {socialLinks && Object.values(socialLinks).some((link) => link) && (
          <div className={styles.socialIconsContainer}>
            {socialLinks.instagram && (
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialIcon}
              >
                <img src={instagramIcon} alt="Instagram" />
              </a>
            )}
            {socialLinks.youtube && (
              <a
                href={socialLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialIcon}
              >
                <img src={youtubeIcon} alt="YouTube" />
              </a>
            )}
            {socialLinks.facebook && (
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialIcon}
              >
                <img src={facebookIcon} alt="Facebook" />
              </a>
            )}
            {socialLinks.twitter && (
              <a
                href={socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialIcon}
              >
                <img src={twitterIcon} alt="Twitter" />
              </a>
            )}
          </div>
        )}

        {/* Pill Toggle for Link/Shop */}
        <div className={styles.pillToggleContainer}>
          <div className={styles.pillToggle}>
            <button
              className={`${styles.pillButton} ${
                activeTab === "link" ? styles.activePill : ""
              }`}
              onClick={() => {
                setActiveTab("link");
                setCurrentSlide(0);
              }}
            >
              link
            </button>
            <button
              className={`${styles.pillButton} ${
                activeTab === "shop" ? styles.activePill : ""
              }`}
              onClick={() => {
                setActiveTab("shop");
                setCurrentSlide(0);
              }}
            >
              Shop
            </button>
            <div
              className={styles.pillSlider}
              style={{
                transform:
                  activeTab === "link" ? "translateX(0)" : "translateX(100%)",
              }}
            ></div>
          </div>
        </div>

        {/* Links container with dynamic layout */}
        <div className={styles.linksScrollContainer}>{renderLinks()}</div>

        <footer className={styles.footer}>
          <button className={styles.connectButton}>Get Connected</button>
          <div className={styles.footerLogo}>
            <img src={fireLogo} alt="Spark" className={styles.sparkLogo} />
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LinkTree;
