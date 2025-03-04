import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import styles from "./Link.module.css";
import { API_URL, getProfileImageUrl } from "../../utils/config";

// Import assets
import user from "../../assets/SocialMedia/user.png";
import penIcon from "../../assets/SocialMedia/pen.png";
import deleteicon from "../../assets/SocialMedia/Frame.png";
import copy from "../../assets/SocialMedia/copy.png";
import whiteShopIcon from "../../assets/SocialMedia/house.png"; // Fixed path
import greyShopIcon from "../../assets/SocialMedia/house.png";
import instagramIcons from "../../assets/SocialMedia/instagram.png";
import facebookIcon from "../../assets/SocialMedia/facebook.png";
import youtube from "../../assets/SocialMedia/youtube.png";
import twitterIcon from "../../assets/SocialMedia/x.png";
import fireLogo from "../../assets/SocialMedia/fire.png";
import LinkTreePreview from "../Appearance/LinkTreePreview"; // Import the LinkTreePreview component

const Link = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const [profileTitle, setProfileTitle] = useState("@opopo_08");
  const [bio, setBio] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("#3C3431");
  const [profileImage, setProfileImage] = useState(user);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [links, setLinks] = useState([]);
  const [shopLinks, setShopLinks] = useState([]);
  const [newLinkTitle, setNewLinkTitle] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [newShopTitle, setNewShopTitle] = useState("");
  const [newShopUrl, setNewShopUrl] = useState("");

  // Add appearance settings state
  const [appearanceSettings, setAppearanceSettings] = useState({
    layout: "stack",
    buttonStyle: "fill",
    buttonColor: "#111111",
    buttonFontColor: "#888888",
    font: "DM Sans",
    textColor: "#ffffff",
    theme: "air-snow",
  });

  // UI state variables
  const [activeTab, setActiveTab] = useState("link");
  const [showForm, setShowForm] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [activeButton, setActiveButton] = useState("link");
  const [showUrlForm, setShowUrlForm] = useState(false);
  const [previewTab, setPreviewTab] = useState("link");

  const [isToggleEnabled, setIsToggleEnabled] = useState(false);
  // Add a new state to track selected application
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    const fetchLinkProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/links`, {
          withCredentials: true,
        });

        if (response.data) {
          // Update state with fetched data
          setProfileTitle(response.data.profileTitle || "@opopo_08");
          setBio(response.data.bio || "");
          setBackgroundColor(response.data.backgroundColor || "#3C3431");
          setLinks(response.data.links || []);
          setShopLinks(response.data.shopLinks || []);

          // Set profile image if it exists
          if (
            response.data.profileImage &&
            response.data.profileImage !== "default-avatar.png"
          ) {
            setProfileImage(getProfileImageUrl(response.data.profileImage));
          }
        }

        // Fetch appearance settings
        const appearanceResponse = await axios.get(`${API_URL}/appearance`, {
          withCredentials: true,
        });

        if (appearanceResponse.data) {
          setAppearanceSettings(appearanceResponse.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setMessage(
          error.response?.data?.message || "Error fetching profile data"
        );
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if user is logged in
    if (currentUser?._id) {
      fetchLinkProfile();
    }
  }, [currentUser]);

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setLoading(true);
      const response = await axios.post(
        `${API_URL}/links/upload-image`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.profileImage) {
        setProfileImage(getProfileImageUrl(response.data.profileImage));
        setMessage("Image uploaded successfully!");
        // Refresh the link profile data
        fetchLinkProfile();
      }
    } catch (error) {
      console.error("Upload error:", error);
      setMessage(error.response?.data?.message || "Error uploading image");
    } finally {
      setLoading(false);
    }
  };

  // ... rest of the component code ...
  // Handle remove image
  const handleRemoveImage = () => {
    setProfileImage(user);
    setMessage("Profile image removed");
  };
  // Copy URL to clipboard
  const handleCopyUrl = () => {
    const urlToCopy = activeTab === "link" ? newLinkUrl : newShopUrl;
    if (urlToCopy) {
      navigator.clipboard.writeText(urlToCopy);
      setMessage("URL copied to clipboard!");
    }
  };
  // Clear URL input
  const handleClearUrl = () => {
    if (activeTab === "link") {
      setNewLinkUrl("");
    } else {
      setNewShopUrl("");
    }
  };
  // Add button click handler
  const handleAddClick = () => {
    setShowForm(true);
    setShowUrlForm(true);
    setShowPopup(false);
    setIsToggleEnabled(false); // Reset toggle to false when showing form
  };
  // Tab switching
  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setActiveButton(tab);
    if (showForm) {
      setIsToggleEnabled(false); // Reset toggle when switching tabs while form is open
    }
  };
  // Add link handler - modified to include selected app
  const handleAddLink = async () => {
    if (newLinkTitle && newLinkUrl) {
      const newLinks = [
        ...links,
        {
          title: newLinkTitle,
          url: newLinkUrl,
          app: selectedApp, // Store the selected app with the link
        },
      ];
      setLinks(newLinks);
      setNewLinkTitle("");
      setNewLinkUrl("");
      setSelectedApp(null); // Reset selected app
      setShowForm(false);
      setShowUrlForm(false);
      await handleSave(newLinks, shopLinks);
      setMessage("Link added successfully!");
    } else {
      setMessage("Please fill in all required fields");
    }
  };
  // Add shop link handler
  const handleAddShopLink = async () => {
    if (newShopTitle && newShopUrl) {
      const newShopLinks = [
        ...shopLinks,
        {
          title: newShopTitle,
          url: newShopUrl,
          app: selectedApp, // Add app selection for shop links too
        },
      ];
      setShopLinks(newShopLinks);
      setNewShopTitle("");
      setNewShopUrl("");

      setShowForm(false);
      setShowUrlForm(false);
      await handleSave(links, newShopLinks);
      setMessage("Shop item added successfully!");
    } else {
      setMessage("Please fill in all fields");
    }
  };
  // Delete link handler
  const handleDeleteLink = async (index) => {
    const newLinks = links.filter((_, i) => i !== index);
    setLinks(newLinks);
    await handleSave(newLinks, shopLinks);
    setMessage("Link deleted successfully");
  };
  // Delete shop link handler
  const handleDeleteShopLink = async (index) => {
    const newShopLinks = shopLinks.filter((_, i) => i !== index);
    setShopLinks(newShopLinks);
    await handleSave(links, newShopLinks);
    setMessage("Shop item deleted successfully");
  };
  // Save all changes
  const handleSave = async (
    currentLinks = links,
    currentShopLinks = shopLinks
  ) => {
    try {
      setLoading(true);
      await axios.post(
        `${API_URL}/links`,
        {
          profileTitle,
          bio,
          backgroundColor,
          links: currentLinks,
          shopLinks: currentShopLinks,
        },
        { withCredentials: true }
      );
      setMessage("Profile saved successfully!");
    } catch (error) {
      setMessage(error.response?.data?.message || "Error saving profile");
    } finally {
      setLoading(false);
    }
  };
  // Set background color
  const handleSetBackgroundColor = (color) => {
    setBackgroundColor(color);
  };
  // Handle bio input
  const handleBioChange = (e) => {
    setBio(e.target.value);
  };

  const handleAppSelect = (app) => {
    setSelectedApp(app);
  };

  // Handle toggle change
  const handleToggleChange = (e) => {
    const isChecked = e.target.checked;

    // Validate required fields before allowing toggle to be true
    if (isChecked) {
      if (activeTab === "link") {
        if (!newLinkTitle || !newLinkUrl) {
          setMessage("Please fill in all required fields");
          setIsToggleEnabled(false);
          return;
        }
      } else {
        if (!newShopTitle || !newShopUrl) {
          setMessage("Please fill in all required fields");
          setIsToggleEnabled(false);
          return;
        }
      }
    }

    setIsToggleEnabled(isChecked);

    if (isChecked) {
      // Add a delay so users can see the toggle state change
      setTimeout(() => {
        // If toggle is turned on, close form and add link/shop
        setShowForm(false);
        if (activeTab === "link") {
          handleAddLink();
        } else {
          handleAddShopLink();
        }
      }, 800); // 800ms delay to see the toggle change
    }
  };
  // Add this new function to handle sharing the link tree
  const handleShareLinkTree = () => {
    // Remove @ symbol if present and ensure proper URL formatting
    const formattedUsername = profileTitle.replace("@", "");
    const linkTreeUrl = `${window.location.origin}/${formattedUsername}`;

    console.log("Sharing URL:", linkTreeUrl); // Debug log to verify URL

    if (navigator.share) {
      navigator
        .share({
          title: `${profileTitle}'s Spark Profile`,
          text: `Check out ${profileTitle}'s links!`,
          url: linkTreeUrl,
        })
        .then(() => {
          setMessage("Link shared successfully!");
        })
        .catch((err) => {
          console.error("Error sharing:", err);
          // Fallback if sharing fails
          navigator.clipboard.writeText(linkTreeUrl).then(() => {
            setMessage("Link tree URL copied to clipboard!");
            alert("Link tree URL copied to clipboard!");
          });
        });
    } else {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard
        .writeText(linkTreeUrl)
        .then(() => {
          setMessage("Link tree URL copied to clipboard!");
          alert("Link tree URL copied to clipboard!");
        })
        .catch((err) => console.error("Error copying to clipboard:", err));
    }
  };
  // ... existing code ...

  // Update the previewData to use the appearance settings
  const previewData = {
    profileTitle,
    bio,
    profileImage,
    links,
    shopLinks,
    socialLinks: {}, // You can add social links here if needed
    backgroundColor,
    appearance: {
      layout: appearanceSettings.layout || "stack",
      buttonStyle: appearanceSettings.buttonStyle || "fill",
      buttonColor: appearanceSettings.buttonColor || "#111111",
      buttonFontColor: appearanceSettings.buttonFontColor || "#ffffff",
      font: appearanceSettings.font || "DM Sans",
      textColor: appearanceSettings.textColor || "#ffffff",
      theme: appearanceSettings.theme || "air-snow",
    },
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>
          Hi, {currentUser?.firstName} {currentUser?.lastName} !
        </h1>
        <p>Congratulations. You got a great response today.</p>
        <button className={styles.shareButton} onClick={handleShareLinkTree}>
          Share
        </button>
      </header>
      <div className={styles.content}>
        {/* Left side - Phone preview */}
        <div className={styles.previewSection}>
          <div className={styles.phonePreview}>
            {/* Replace the existing preview with LinkTreePreview */}
            <LinkTreePreview previewData={previewData} isPreview={true} />
          </div>
        </div>

        {/* Right side - Edit section */}
        <div className={styles.editSection}>
          <section className={styles.profileSection}>
            <h3>Profile</h3>
            <div className={styles.profileImageUpload}>
              <img
                src={profileImage}
                alt="Profile"
                className={styles.currentImage}
              />
              <div>
                <input
                  type="file"
                  id="imageUpload"
                  hidden
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <label htmlFor="imageUpload" className={styles.uploadButton}>
                  Pick an image
                </label>
                <button
                  className={styles.removeButton}
                  onClick={handleRemoveImage}
                >
                  Remove
                </button>
              </div>
            </div>

            <div className={styles.profileFields}>
              <div className={styles.inputGroup}>
                <label>Profile Title</label>
                <input
                  type="text"
                  value={profileTitle}
                  onChange={(e) => setProfileTitle(e.target.value)}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Bio</label>
                <textarea
                  value={bio}
                  onChange={handleBioChange}
                  maxLength={80}
                />
                <span className={styles.charCount}>{bio.length} / 80</span>
              </div>
            </div>

            {/* Display existing links */}
            {links.length > 0 && (
              <div className={styles.existingLinks}>
                <h3>Your Links</h3>
                <div className={styles.linksList}>
                  {links.map((link, index) => (
                    <div key={index} className={styles.linkItem}>
                      <div className={styles.linkInfo}>
                        <h4>{link.title}</h4>
                        <p className={styles.linkUrl}>{link.url}</p>
                      </div>
                      <button
                        className={styles.deleteLinkButton}
                        onClick={() => handleDeleteLink(index)}
                      >
                        <img src={deleteicon} alt="Delete" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Display existing shop items */}
            {shopLinks.length > 0 && (
              <div className={styles.existingShopItems}>
                <h3>Your Shop Items</h3>
                <div className={styles.shopLinksList}>
                  {shopLinks.map((item, index) => (
                    <div key={index} className={styles.shopLinkItem}>
                      <div className={styles.shopItemInfo}>
                        <h4>{item.title}</h4>
                        <p className={styles.shopItemUrl}>{item.url}</p>
                      </div>
                      <button
                        className={styles.deleteShopButton}
                        onClick={() => handleDeleteShopLink(index)}
                      >
                        <img src={deleteicon} alt="Delete" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add Link/Shop UI */}
            <div className={styles.addLinkSection}>
              <div className={styles.addLinkHeader}>
                <div className={styles.tabButtons}>
                  <button
                    className={`${styles.tabButton} ${
                      activeTab === "link" ? styles.activeTab : ""
                    }`}
                    onClick={() => handleTabSwitch("link")}
                  >
                    <img
                      src={activeTab === "link" ? whiteShopIcon : greyShopIcon}
                      alt="Link Icon"
                      className={styles.btnIcon}
                    />
                    Add Link
                  </button>
                  <button
                    className={`${styles.tabButton} ${
                      activeTab === "shop" ? styles.activeTab : ""
                    }`}
                    onClick={() => handleTabSwitch("shop")}
                  >
                    <img
                      src={activeTab === "shop" ? whiteShopIcon : greyShopIcon}
                      alt="Shop Icon"
                      className={styles.btnIcon}
                    />
                    Add Shop
                  </button>
                </div>
                <button className={styles.addButton} onClick={handleAddClick}>
                  + Add
                </button>
              </div>

              {/* Form for adding links or shop items */}
              {showForm && (
                <div className={styles.formContainer}>
                  <h3>Enter URL</h3>
                  <div className={styles.url}>
                    <div className={styles.inputGroup}>
                      <p>
                        {activeTab === "link" ? "Link Title" : "Shop Title"}{" "}
                        <img src={penIcon} alt="" />
                      </p>
                      <div className={styles.formField}>
                        <input
                          type="text"
                          placeholder={
                            activeTab === "link"
                              ? "Enter link title"
                              : "Enter shop title"
                          }
                          value={
                            activeTab === "link" ? newLinkTitle : newShopTitle
                          }
                          onChange={(e) =>
                            activeTab === "link"
                              ? setNewLinkTitle(e.target.value)
                              : setNewShopTitle(e.target.value)
                          }
                          className={styles.formInput}
                        />
                        <div className={styles.toggleSwitch}>
                          <input
                            type="checkbox"
                            id="toggle"
                            checked={isToggleEnabled}
                            onChange={handleToggleChange}
                          />
                          <label htmlFor="toggle"></label>
                        </div>
                      </div>
                    </div>
                    <div className={styles.inputGroup}>
                      <p>
                        URL <img src={penIcon} alt="" />
                      </p>
                      <div className={styles.urlInputContainer}>
                        <input
                          type="url"
                          placeholder="Enter URL"
                          value={activeTab === "link" ? newLinkUrl : newShopUrl}
                          onChange={(e) =>
                            activeTab === "link"
                              ? setNewLinkUrl(e.target.value)
                              : setNewShopUrl(e.target.value)
                          }
                          className={styles.formInput}
                        />
                        <div className={styles.urlButtons}>
                          <button
                            className={styles.iconButton}
                            onClick={handleCopyUrl}
                          >
                            <img src={copy} alt="Copy" />
                          </button>
                          <button
                            className={styles.iconButton}
                            onClick={handleClearUrl}
                          >
                            <img src={deleteicon} alt="Delete" />
                          </button>
                        </div>
                      </div>
                    </div>
                    {/* Social media icons for links */}
                    {activeTab === "link" && (
                      <div className={styles.socialIcons}>
                        <h4>Applications</h4>
                        <div className={styles.iconsContainer}>
                          <div
                            className={`${styles.icon} ${
                              selectedApp === "instagram"
                                ? styles.selectedIcon
                                : ""
                            }`}
                            onClick={() => handleAppSelect("instagram")}
                          >
                            <img src={instagramIcons} alt="Instagram" />
                            <span>Instagram</span>
                          </div>
                          <div
                            className={`${styles.icon} ${
                              selectedApp === "facebook"
                                ? styles.selectedIcon
                                : ""
                            }`}
                            onClick={() => handleAppSelect("facebook")}
                          >
                            <img src={facebookIcon} alt="Facebook" />
                            <span>Facebook</span>
                          </div>
                          <div
                            className={`${styles.icon} ${
                              selectedApp === "youtube"
                                ? styles.selectedIcon
                                : ""
                            }`}
                            onClick={() => handleAppSelect("youtube")}
                          >
                            <img src={youtube} alt="YouTube" />
                            <span>YouTube</span>
                          </div>
                          <div
                            className={`${styles.icon} ${
                              selectedApp === "twitter"
                                ? styles.selectedIcon
                                : ""
                            }`}
                            onClick={() => handleAppSelect("twitter")}
                          >
                            <img src={twitterIcon} alt="Twitter" />
                            <span>Twitter</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Banner Section */}
            <div className={styles.bannerSection}>
              <h2>Banner</h2>
              <div className={styles.bannerContent}>
                <div className={styles.profileCard} style={{ backgroundColor }}>
                  <div className={styles.shareIcon}>↗</div>
                  <img
                    src={profileImage}
                    alt="Profile"
                    className={styles.profileImage}
                  />
                  <h2>{profileTitle}</h2>

                  <p className={styles.bannerText}>
                    <img src={fireLogo} alt="" />/{profileTitle}
                  </p>
                </div>
                <h3>Custom Background Color</h3>
                <div className={styles.colorOptions}>
                  <button
                    className={`${styles.colorOption} ${styles.brown}`}
                    onClick={() => handleSetBackgroundColor("#3C3431")}
                  ></button>
                  <button
                    className={`${styles.colorOption} ${styles.white}`}
                    onClick={() => handleSetBackgroundColor("#FFFFFF")}
                  ></button>
                  <button
                    className={`${styles.colorOption} ${styles.black}`}
                    onClick={() => handleSetBackgroundColor("#000000")}
                  ></button>
                </div>
                <div className={styles.colorInputContainer}>
                  <button
                    className={styles.box}
                    style={{ backgroundColor }}
                  ></button>
                  <input
                    type="color"
                    className={styles.colorPicker}
                    value={backgroundColor}
                    onChange={(e) => handleSetBackgroundColor(e.target.value)}
                  />
                  <input
                    type="text"
                    className={styles.colorInput}
                    value={backgroundColor}
                    onChange={(e) => handleSetBackgroundColor(e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.saveContainer}>
                <button className={styles.saveBtn} onClick={() => handleSave()}>
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Link;
