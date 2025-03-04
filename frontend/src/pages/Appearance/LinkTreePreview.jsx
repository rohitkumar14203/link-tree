import { useState, useRef, useEffect } from "react";
import styles from "./LinkTreePreview.module.css";

// Import assets
import defaultUser from "../../assets/SocialMedia/user.png";
import instagramIcon from "../../assets/SocialMedia/instagram.png";
import facebookIcon from "../../assets/SocialMedia/facebook.png";
import youtubeIcon from "../../assets/SocialMedia/youtube.png";
import twitterIcon from "../../assets/SocialMedia/x.png";

const LinkTreePreview = ({ previewData, isPreview }) => {
  const [activeTab, setActiveTab] = useState("link");
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef(null);

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

  // Add a check to ensure previewData exists
  if (!previewData) {
    return <div className={styles.previewContainer}>Loading preview...</div>;
  }

  const {
    profileTitle = "",
    bio = "",
    profileImage = "",
    links = [],
    shopLinks = [],
    socialLinks = {},
    backgroundColor = "#ffffff",
    appearance = {},
  } = previewData;

  // Handle carousel navigation
  const handlePrevSlide = () => {
    const items = activeTab === "link" ? links : shopLinks;
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : items.length - 1));
  };

  const handleNextSlide = () => {
    const items = activeTab === "link" ? links : shopLinks;
    setCurrentSlide((prev) => (prev < items.length - 1 ? prev + 1 : 0));
  };

  // Reset current slide when tab changes
  useEffect(() => {
    setCurrentSlide(0);
  }, [activeTab]);

  // Get current items based on active tab
  const currentItems = activeTab === "link" ? links : shopLinks;

  return (
    <>
      <div className={styles.previewContainer}>
        <div
          className={styles.linkTreeContent}
          style={{ backgroundColor: backgroundColor }}
        >
          <div className={styles.profileHeader}>
            <img
              src={profileImage || defaultUser}
              alt={profileTitle}
              className={styles.profileImage}
            />
            <h1
              className={styles.profileTitle}
              style={{ color: appearance?.textColor || "#ffffff" }}
            >
              {profileTitle}
            </h1>
            {bio && (
              <p
                className={styles.bio}
                style={{ color: appearance?.textColor || "#ffffff" }}
              >
                {bio}
              </p>
            )}
          </div>
        </div>

        {/* Social Media Icons */}
        {socialLinks &&
          Object.keys(socialLinks).length > 0 &&
          Object.values(socialLinks).some((link) => link) && (
            <div className={styles.socialIconsContainer}>
              {socialLinks.instagram && (
                <a
                  href={isPreview ? "#" : socialLinks.instagram}
                  className={styles.socialIcon}
                >
                  <img src={instagramIcon} alt="Instagram" />
                </a>
              )}
              {socialLinks.youtube && (
                <a
                  href={isPreview ? "#" : socialLinks.youtube}
                  className={styles.socialIcon}
                >
                  <img src={youtubeIcon} alt="YouTube" />
                </a>
              )}
              {socialLinks.facebook && (
                <a
                  href={isPreview ? "#" : socialLinks.facebook}
                  className={styles.socialIcon}
                >
                  <img src={facebookIcon} alt="Facebook" />
                </a>
              )}
              {socialLinks.twitter && (
                <a
                  href={isPreview ? "#" : socialLinks.twitter}
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
              Link
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

        {/* Links/Shop Items Container */}
        {appearance?.layout === "carousel" ? (
          <div className={styles.carouselContainer} ref={carouselRef}>
            {currentItems && currentItems.length > 0 ? (
              <>
                <div className={styles.carouselControls}>
                  <button
                    className={styles.carouselButton}
                    onClick={handlePrevSlide}
                  >
                    &#10094;
                  </button>
                  <div className={styles.carouselIndicators}>
                    {currentItems.map((_, index) => (
                      <span
                        key={index}
                        className={`${styles.indicator} ${
                          index === currentSlide ? styles.activeIndicator : ""
                        }`}
                        onClick={() => setCurrentSlide(index)}
                      ></span>
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
                  {activeTab === "link" ? (
                    <a
                      href={isPreview ? "#" : currentItems[currentSlide]?.url}
                      className={styles.linkButton}
                      style={{
                        backgroundColor: appearance?.buttonColor || "#111111",
                        color: appearance?.buttonFontColor || "#888888",
                        borderRadius: "30px",
                        display: "flex",
                        alignItems: "center",
                        padding: "10px 15px",
                        border:
                          appearance?.buttonStyle === "outline"
                            ? `2px solid ${
                                appearance?.buttonColor || "#111111"
                              }`
                            : "none",
                        boxShadow:
                          appearance?.buttonStyle === "hardShadow"
                            ? "4px 4px 0 rgba(0,0,0,0.2)"
                            : appearance?.buttonStyle === "softShadow"
                            ? "0 4px 8px rgba(0,0,0,0.1)"
                            : "none",
                        fontFamily: appearance?.font || "DM Sans",
                      }}
                    >{currentItems[currentSlide]?.app && (
                        <div className={styles.appIconContainer}>
                          <img
                            src={getAppIcon(currentItems[currentSlide].app)}
                            alt={currentItems[currentSlide].app}
                            className={styles.appIcon}
                          />
                        </div>
                      )}
                      <div className={styles.linkTitle}>
                        {currentItems[currentSlide]?.title}
                      </div>
                    </a>
                  ) : (
                    <a
                      href={isPreview ? "#" : currentItems[currentSlide]?.url}
                      className={styles.shopButton}
                      style={{
                        backgroundColor: appearance?.buttonColor || "#111111",
                        color: appearance?.buttonFontColor || "#888888",
                        borderRadius: "30px",
                        display: "flex",
                        alignItems: "center",
                        padding: "10px 15px",
                        border:
                          appearance?.buttonStyle === "outline"
                            ? `2px solid ${
                                appearance?.buttonColor || "#111111"
                              }`
                            : "none",
                        boxShadow:
                          appearance?.buttonStyle === "hardShadow"
                            ? "4px 4px 0 rgba(0,0,0,0.2)"
                            : appearance?.buttonStyle === "softShadow"
                            ? "0 4px 8px rgba(0,0,0,0.1)"
                            : "none",
                        fontFamily: appearance?.font || "DM Sans",
                      }}
                    >
                      <span className={styles.shopItemTitle}>
                        {currentItems[currentSlide]?.title || ""}
                      </span>
                    </a>
                  )}
                </div>
              </>
            ) : (
              <p className={styles.emptyMessage}>
                {activeTab === "link"
                  ? "No links available"
                  : "No shop items available"}
              </p>
            )}
          </div>
        ) : (
          <div
            className={styles.linksScrollContainer}
          >
            <div
              className={styles.linksContainer}
              style={{
                display: appearance?.layout === "grid" ? "grid" : "flex",
                flexDirection: appearance?.layout === "grid" ? "unset" : "column",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "10px",
              }}
            >
              {activeTab === "link" ? (
                links && links.length > 0 ? (
                  links.map((link, index) => (
                    <a
                      key={index}
                      href={isPreview ? "#" : link.url}
                      className={styles.linkButton}
                      style={{
                        backgroundColor: appearance?.buttonColor || "#111111",
                        color: appearance?.buttonFontColor || "#888888",
                        borderRadius: "30px",
                        display: "flex",
                        alignItems: "center",
                        padding: "10px 15px",
                        border:
                          appearance?.buttonStyle === "outline"
                            ? `2px solid ${appearance?.buttonColor || "#111111"}`
                            : "none",
                        boxShadow:
                          appearance?.buttonStyle === "hardShadow"
                            ? "4px 4px 0 rgba(0,0,0,0.2)"
                            : appearance?.buttonStyle === "softShadow"
                            ? "0 4px 8px rgba(0,0,0,0.1)"
                            : "none",
                        fontFamily: appearance?.font || "DM Sans",
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
                    href={isPreview ? "#" : item.url}
                    className={styles.shopButton}
                    style={{
                      backgroundColor: appearance?.buttonColor || "#111111",
                      color: appearance?.buttonFontColor || "#888888",
                      borderRadius: "30px",
                      display: "flex",
                      alignItems: "center",
                      padding: "10px 15px",
                      border:
                        appearance?.buttonStyle === "outline"
                          ? `2px solid ${appearance?.buttonColor || "#111111"}`
                          : "none",
                      boxShadow:
                        appearance?.buttonStyle === "hardShadow"
                          ? "4px 4px 0 rgba(0,0,0,0.2)"
                          : appearance?.buttonStyle === "softShadow"
                          ? "0 4px 8px rgba(0,0,0,0.1)"
                          : "none",
                      fontFamily: appearance?.font || "DM Sans",
                    }}
                  >
                    <span className={styles.shopItemTitle}>
                      {item.title || ""}
                    </span>
                  </a>
                ))
              ) : (
                <p className={styles.emptyMessage}>No shop items available</p>
              )}
            </div>
          </div>
        )}
      </div>
      <div className={styles.sparkLogo}>
        <div>
          <button className={styles.connectButton}>Get Connected</button>
        </div>

        <span>SPARK™</span>
      </div>
    </>
  );
};

export default LinkTreePreview;
