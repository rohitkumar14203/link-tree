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
          setError(null);
        } else {
          setError('Profile not found');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile');
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
    try {
      console.log(`Tracking click for ${isShopLink ? 'shop' : 'regular'} link: ${linkId}`);
      
      // Make API call to track the click
      await axios.post(`${API_URL}/analytics/track-link`, {
        linkId,
        isShopLink
      });
      
      // Update local state to show the link as clicked
      setClickedLinks(prev => ({
        ...prev,
        [linkId]: true
      }));
      
    } catch (error) {
      console.error('Error tracking link click:', error);
    }
  };
  
  // Handle link click
  const handleLinkClick = (linkId, isShopLink = false) => {
    trackLinkClick(linkId, isShopLink);
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

  const { profileTitle, bio, backgroundColor, profileImage, links, shopLinks } = profileData;
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
                profileImage
                  ? getProfileImageUrl(profileImage)
                  : defaultUser
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
              onClick={() => setActiveTab("link")}
            >
              link
            </button>
            <button
              className={`${styles.pillButton} ${
                activeTab === "shop" ? styles.activePill : ""
              }`}
              onClick={() => setActiveTab("shop")}
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
        
        {/* Updated links container with scrollbar */}
        <div className={styles.linksScrollContainer}>
          <div className={styles.linksContainer}>
            {activeTab === "link" ? (
              links && links.length > 0 ? (
                links.map((link, index) => (
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
                      handleLinkClick(link._id);
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
                ))
              ) : (
                <p className={styles.emptyMessage}>No links available</p>
              )
            ) : shopLinks && shopLinks.length > 0 ? (
              shopLinks.map((item, index) => (
                <a
                  key={index}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.shopButton} ${
                    clickedLinks[item._id] ? styles.clickedLink : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(item._id, true);
                    setTimeout(() => {
                      window.open(item.url, "_blank", "noopener,noreferrer");
                    }, 300);
                  }}
                >
                  {item.app && (
                    <div className={styles.appIconContainer}>
                      <img
                        src={getAppIcon(item.app)}
                        alt={item.app}
                        className={styles.appIcon}
                      />
                    </div>
                  )}
                  <span className={styles.shopTitle}>{item.title}</span>
                </a>
              ))
            ) : (
              <p className={styles.emptyMessage}>No shop items available</p>
            )}
          </div>
        </div>

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
