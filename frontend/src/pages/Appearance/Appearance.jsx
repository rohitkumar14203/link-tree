import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import styles from "./Appearance.module.css";
import { API_URL, getProfileImageUrl } from "../../utils/config";

// Import assets
import defaultProfileImage from "../../assets/SocialMedia/user.png";
import youtubeIcon from "../../assets/SocialMedia/youtube.png";
import instagramIcon from "../../assets/SocialMedia/instagram.png";

// Import LinkTree component for preview
import LinkTreePreview from "./LinkTreePreview";

const Appearance = () => {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Profile data
  const [profileTitle, setProfileTitle] = useState("@opopo_08");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState(defaultProfileImage);
  const [links, setLinks] = useState([]);
  const [shopLinks, setShopLinks] = useState([]);
  const [socialLinks, setSocialLinks] = useState({});

  // Appearance settings
  const [layout, setLayout] = useState("stack");
  const [buttonStyle, setButtonStyle] = useState("fill");
  const [buttonColor, setButtonColor] = useState("#111111");
  const [buttonFontColor, setButtonFontColor] = useState("#888888");
  const [font, setFont] = useState("DM Sans");
  const [textColor, setTextColor] = useState("#ffffff");
  const [theme, setTheme] = useState("air-snow");

  // Fetch user's profile data and appearance settings
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        setLoading(true);

        // Fetch profile data (name, bio, image, links)
        const profileResponse = await axios.get(`${API_URL}/links`, {
          withCredentials: true,
        });

        if (profileResponse.data) {
          setProfileTitle(profileResponse.data.profileTitle || "@opopo_08");
          setBio(profileResponse.data.bio || "");

          // Set profile image if it exists
          if (
            profileResponse.data.profileImage &&
            profileResponse.data.profileImage !== "default-avatar.png"
          ) {
            setProfileImage(
              getProfileImageUrl(profileResponse.data.profileImage)
            );
          }

          // Set links data
          if (profileResponse.data.links) {
            setLinks(profileResponse.data.links);
          }

          // Set shop links data
          if (profileResponse.data.shopLinks) {
            setShopLinks(profileResponse.data.shopLinks);
          }

          // Set social links data
          if (profileResponse.data.socialLinks) {
            setSocialLinks(profileResponse.data.socialLinks);
          }
        }

        // Fetch appearance settings
        const appearanceResponse = await axios.get(`${API_URL}/appearance`, {
          withCredentials: true,
        });

        if (appearanceResponse.data) {
          const settings = appearanceResponse.data;
          setLayout(settings.layout || "stack");
          setButtonStyle(settings.buttonStyle || "fill");
          setButtonColor(settings.buttonColor || "#111111");
          setButtonFontColor(settings.buttonFontColor || "#888888");
          setFont(settings.font || "DM Sans");
          setTextColor(settings.textColor || "#ffffff");
          setTheme(settings.theme || "air-snow");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setMessage("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Save appearance settings
  const handleSave = async () => {
    if (!user) {
      setMessage("Please log in to save settings");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${API_URL}/appearance`,
        {
          layout,
          buttonStyle,
          buttonColor,
          buttonFontColor,
          font,
          textColor,
          theme,
        },
        { withCredentials: true }
      );

      if (response.data) {
        setMessage("Appearance settings saved successfully!");
      }
    } catch (error) {
      console.error("Error saving appearance settings:", error);
      setMessage("Failed to save appearance settings");
    } finally {
      setLoading(false);
    }
  };

  // Handle button style selection
  const handleButtonStyleSelect = (style) => {
    setButtonStyle(style);
  };

  // Handle color change
  const handleColorChange = (type, color) => {
    switch (type) {
      case "button":
        setButtonColor(color);
        break;
      case "buttonFont":
        setButtonFontColor(color);
        break;
      case "text":
        setTextColor(color);
        break;
      default:
        break;
    }
  };

  // Create a preview data object that mimics what LinkTree expects
  const previewData = {
    profileTitle,
    bio,
    profileImage,
    links,
    shopLinks,
    socialLinks,
    backgroundColor: theme.startsWith("air")
      ? "#3C3431"
      : theme === "mineral-blue"
      ? "#E6F4F1"
      : theme === "mineral-green"
      ? "#E6F4EC"
      : "#F9EFE8",
    appearance: {
      layout,
      buttonStyle,
      buttonColor,
      buttonFontColor,
      font,
      textColor,
      theme,
    },
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>
          Hi, {user?.firstName || "User"} {user?.lastName || ""}!
        </h1>
        <p>Congratulations. You got a great response today.</p>
      </header>

      <div className={styles.content}>
        {/* Left side - Phone preview using LinkTreePreview */}
        <div className={styles.previewSection}>
          <div className={styles.phonePreview}>
            <div className={styles.shareIcon}>
              <button className={styles.shareButton}>
                <span>↗</span>
              </button>
            </div>
            <LinkTreePreview previewData={previewData} isPreview={true} />
          </div>
        </div>

        {/* Right side - Edit section */}
        <div className={styles.editSection}>
          {/* Layout Section */}
          <section className={styles.layoutSection}>
            <h2>Layout</h2>
            <div className={styles.layoutOptions}>
              <div
                className={`${styles.layoutOption} ${
                  layout === "stack" ? styles.selectedLayout : ""
                }`}
                onClick={() => setLayout("stack")}
              >
                <div className={styles.layoutIcon}>
                  <div className={styles.stackIcon}></div>
                </div>
                <span>Stack</span>
              </div>
              <div
                className={`${styles.layoutOption} ${
                  layout === "grid" ? styles.selectedLayout : ""
                }`}
                onClick={() => setLayout("grid")}
              >
                <div className={styles.layoutIcon}>
                  <div className={styles.gridIcon}></div>
                </div>
                <span>Grid</span>
              </div>
              <div
                className={`${styles.layoutOption} ${
                  layout === "carousel" ? styles.selectedLayout : ""
                }`}
                onClick={() => setLayout("carousel")}
              >
                <div className={styles.layoutIcon}>
                  <div className={styles.carouselIcon}></div>
                </div>
                <span>Carousel</span>
              </div>
            </div>
          </section>

          {/* Buttons Section */}
          <section className={styles.buttonsSection}>
            <h2>Buttons</h2>
            <div className={styles.buttonStylesContainer}>
              <h3>Fill</h3>
              <div className={styles.buttonStyles}>
                <button
                  className={`${styles.fillButtonRect} ${
                    buttonStyle === "fillRect" ? styles.selectedButton : ""
                  }`}
                  onClick={() => handleButtonStyleSelect("fillRect")}
                ></button>
                <button
                  className={`${styles.fillButtonRounded} ${
                    buttonStyle === "fillRounded" ? styles.selectedButton : ""
                  }`}
                  onClick={() => handleButtonStyleSelect("fillRounded")}
                ></button>
                <button
                  className={`${styles.fillButtonPill} ${
                    buttonStyle === "fillPill" ? styles.selectedButton : ""
                  }`}
                  onClick={() => handleButtonStyleSelect("fillPill")}
                ></button>
              </div>

              <h3>Outline</h3>
              <div className={styles.buttonStyles}>
                <button
                  className={`${styles.outlineButtonRect} ${
                    buttonStyle === "outlineRect" ? styles.selectedButton : ""
                  }`}
                  onClick={() => handleButtonStyleSelect("outlineRect")}
                ></button>
                <button
                  className={`${styles.outlineButtonRounded} ${
                    buttonStyle === "outlineRounded"
                      ? styles.selectedButton
                      : ""
                  }`}
                  onClick={() => handleButtonStyleSelect("outlineRounded")}
                ></button>
                <button
                  className={`${styles.outlineButtonPill} ${
                    buttonStyle === "outlinePill" ? styles.selectedButton : ""
                  }`}
                  onClick={() => handleButtonStyleSelect("outlinePill")}
                ></button>
              </div>

              <h3>Hard shadow</h3>
              <div className={styles.buttonStyles}>
                <button
                  className={`${styles.hardShadowButtonRect} ${
                    buttonStyle === "hardShadowRect"
                      ? styles.selectedButton
                      : ""
                  }`}
                  onClick={() => handleButtonStyleSelect("hardShadowRect")}
                ></button>
                <button
                  className={`${styles.hardShadowButtonRounded} ${
                    buttonStyle === "hardShadowRounded"
                      ? styles.selectedButton
                      : ""
                  }`}
                  onClick={() => handleButtonStyleSelect("hardShadowRounded")}
                ></button>
                <button
                  className={`${styles.hardShadowButtonPill} ${
                    buttonStyle === "hardShadowPill"
                      ? styles.selectedButton
                      : ""
                  }`}
                  onClick={() => handleButtonStyleSelect("hardShadowPill")}
                ></button>
              </div>

              <h3>Soft shadow</h3>
              <div className={styles.buttonStyles}>
                <button
                  className={`${styles.softShadowButtonRect} ${
                    buttonStyle === "softShadowRect"
                      ? styles.selectedButton
                      : ""
                  }`}
                  onClick={() => handleButtonStyleSelect("softShadowRect")}
                ></button>
                <button
                  className={`${styles.softShadowButtonRounded} ${
                    buttonStyle === "softShadowRounded"
                      ? styles.selectedButton
                      : ""
                  }`}
                  onClick={() => handleButtonStyleSelect("softShadowRounded")}
                ></button>
                <button
                  className={`${styles.softShadowButtonPill} ${
                    buttonStyle === "softShadowPill"
                      ? styles.selectedButton
                      : ""
                  }`}
                  onClick={() => handleButtonStyleSelect("softShadowPill")}
                ></button>
              </div>

              <h3>Special</h3>
              <div className={styles.buttonStyles}>
                <button
                  className={`${styles.specialButtonScalloped} ${
                    buttonStyle === "specialScalloped"
                      ? styles.selectedButton
                      : ""
                  }`}
                  onClick={() => handleButtonStyleSelect("specialScalloped")}
                ></button>
                <button
                  className={`${styles.specialButtonWavy} ${
                    buttonStyle === "specialWavy" ? styles.selectedButton : ""
                  }`}
                  onClick={() => handleButtonStyleSelect("specialWavy")}
                ></button>
                <button
                  className={`${styles.specialButtonFramed} ${
                    buttonStyle === "specialFramed" ? styles.selectedButton : ""
                  }`}
                  onClick={() => handleButtonStyleSelect("specialFramed")}
                ></button>
              </div>
              <div className={styles.buttonStyles}>
                <button
                  className={`${styles.specialButtonRounded} ${
                    buttonStyle === "specialRounded"
                      ? styles.selectedButton
                      : ""
                  }`}
                  onClick={() => handleButtonStyleSelect("specialRounded")}
                ></button>
                <button
                  className={`${styles.specialButtonFrameless} ${
                    buttonStyle === "specialFrameless"
                      ? styles.selectedButton
                      : ""
                  }`}
                  onClick={() => handleButtonStyleSelect("specialFrameless")}
                ></button>
                <button
                  className={`${styles.specialButtonShadowed} ${
                    buttonStyle === "specialShadowed"
                      ? styles.selectedButton
                      : ""
                  }`}
                  onClick={() => handleButtonStyleSelect("specialShadowed")}
                ></button>
              </div>

              <div className={styles.colorSection}>
                <h3>Button color</h3>
                <div className={styles.colorPicker}>
                  <div
                    className={styles.colorPreview}
                    style={{ backgroundColor: buttonColor }}
                    onClick={() =>
                      document.getElementById("buttonColorPicker").click()
                    }
                  ></div>
                  <input
                    type="color"
                    id="buttonColorPicker"
                    value={buttonColor}
                    onChange={(e) =>
                      handleColorChange("button", e.target.value)
                    }
                    style={{ display: "none" }}
                  />
                  <div className={styles.colorValue}>
                    <span>Button color</span>
                    <span>{buttonColor}</span>
                  </div>
                </div>

                <h3>Button font color</h3>
                <div className={styles.colorPicker}>
                  <div
                    className={styles.colorPreview}
                    style={{ backgroundColor: buttonFontColor }}
                    onClick={() =>
                      document.getElementById("buttonFontColorPicker").click()
                    }
                  ></div>
                  <input
                    type="color"
                    id="buttonFontColorPicker"
                    value={buttonFontColor}
                    onChange={(e) =>
                      handleColorChange("buttonFont", e.target.value)
                    }
                    style={{ display: "none" }}
                  />
                  <div className={styles.colorValue}>
                    <span>Button font color</span>
                    <span>{buttonFontColor}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* Fonts Section */}
          <section className={styles.fontsSection}>
            <h2>Fonts</h2>
            <div className={styles.fontSelector}>
              <h3>Font</h3>
              <div className={styles.fontDropdown}>
                <span className={styles.fontIcon}>Aa</span>
                <select
                  value={font}
                  onChange={(e) => setFont(e.target.value)}
                  className={styles.fontSelect}
                >
                  <option value="DM Sans">DM Sans</option>
                  <option value="Poppins">Poppins</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Open Sans">Open Sans</option>
                  <option value="Montserrat">Montserrat</option>
                </select>
              </div>

              <h3>Color</h3>
              <div className={styles.colorPicker}>
                <div
                  className={styles.colorPreview}
                  style={{ backgroundColor: textColor }}
                  onClick={() =>
                    document.getElementById("textColorPicker").click()
                  }
                ></div>
                <input
                  type="color"
                  id="textColorPicker"
                  value={textColor}
                  onChange={(e) => handleColorChange("text", e.target.value)}
                  style={{ display: "none" }}
                />
                <div className={styles.colorValue}>
                  <span>Color</span>
                  <span>{textColor}</span>
                </div>
              </div>
            </div>
          </section>
          {/* Themes Section */}
          <section className={styles.themesSection}>
            <h2>Themes</h2>
            <div className={styles.themeOptions}>
              <div
                className={`${styles.themeOption} ${
                  theme === "air-snow" ? styles.selectedTheme : ""
                }`}
                onClick={() => setTheme("air-snow")}
              >
                <div className={styles.themePreview}>
                  <div className={styles.airSnowTheme}></div>
                </div>
                <span>Air Snow</span>
              </div>
              <div
                className={`${styles.themeOption} ${
                  theme === "air-grey" ? styles.selectedTheme : ""
                }`}
                onClick={() => setTheme("air-grey")}
              >
                <div className={styles.themePreview}>
                  <div className={styles.airGreyTheme}></div>
                </div>
                <span>Air Grey</span>
              </div>
              <div
                className={`${styles.themeOption} ${
                  theme === "air-smoke" ? styles.selectedTheme : ""
                }`}
                onClick={() => setTheme("air-smoke")}
              >
                <div className={styles.themePreview}>
                  <div className={styles.airSmokeTheme}></div>
                </div>
                <span>Air Smoke</span>
              </div>
              <div
                className={`${styles.themeOption} ${
                  theme === "air-black" ? styles.selectedTheme : ""
                }`}
                onClick={() => setTheme("air-black")}
              >
                <div className={styles.themePreview}>
                  <div className={styles.airBlackTheme}></div>
                </div>
                <span>Air Black</span>
              </div>
              <div
                className={`${styles.themeOption} ${
                  theme === "mineral-blue" ? styles.selectedTheme : ""
                }`}
                onClick={() => setTheme("mineral-blue")}
              >
                <div className={styles.themePreview}>
                  <div className={styles.mineralBlueTheme}></div>
                </div>
                <span>Mineral Blue</span>
              </div>
              <div
                className={`${styles.themeOption} ${
                  theme === "mineral-green" ? styles.selectedTheme : ""
                }`}
                onClick={() => setTheme("mineral-green")}
              >
                <div className={styles.themePreview}>
                  <div className={styles.mineralGreenTheme}></div>
                </div>
                <span>Mineral Green</span>
              </div>
              <div
                className={`${styles.themeOption} ${
                  theme === "mineral-orange" ? styles.selectedTheme : ""
                }`}
                onClick={() => setTheme("mineral-orange")}
              >
                <div className={styles.themePreview}>
                  <div className={styles.mineralOrangeTheme}></div>
                </div>
                <span>Mineral Orange</span>
              </div>
            </div>
          </section>
        </div>
      </div>
      <div className={styles.saveButtonContainer}>
        <button
          className={styles.saveButton}
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>

      {message && (
        <div className={styles.messageContainer}>
          <p className={styles.message}>{message}</p>
        </div>
      )}
    </div>
  );
};

export default Appearance;
