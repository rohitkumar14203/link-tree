import "./Home.css";
import logo from "../../assets/Home_Images/logo.png";
import analytics from "../../assets/Home_Images/Analytics.png";
import all from "../../assets/Home_Images/all.png";
import flower from "../../assets/Home_Images/flower.png";
import card1 from "../../assets/Home_Images/card1.png";
import card2 from "../../assets/Home_Images/card2.png";
import card3 from "../../assets/Home_Images/card3.png";
import card4 from "../../assets/Home_Images/card4.png";
import int1 from "../../assets/Home_Images/int1.png";
import int2 from "../../assets/Home_Images/int2.png";
import int3 from "../../assets/Home_Images/int3.png";
import int4 from "../../assets/Home_Images/int4.png";
import int5 from "../../assets/Home_Images/int5.png";
import int6 from "../../assets/Home_Images/int6.png";
import int7 from "../../assets/Home_Images/int7.png";
import int8 from "../../assets/Home_Images/int8.png";
import int9 from "../../assets/Home_Images/int9.png";
import twitter from "../../assets/Home_Images/twitter.png";
import insta from "../../assets/Home_Images/insta.png";
import youtube from "../../assets/Home_Images/youtube.png";
import tiktok from "../../assets/Home_Images/tiktok.png";
import fire from "../../assets/Home_Images/fire.png";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const LandingPage = () => {
  // Add state to track screen size
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Update state when window is resized
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="linktree-page">
      <header className="header">
        <div className="logo-container">
          <img src={logo} alt="Linktree Logo" className="logo" />
          <span className="logo-text">SPARK</span>
          <p className="tm">
            <sup>TM</sup>
          </p>
          <span className="line"> | </span>
          <span className="market">Marketplace</span>
        </div>
        <Link to="/signup" className="sign-in-button">
          Sign up free
        </Link>
      </header>

      <main className="main-content">
        <section className="hero-section">
          <div className="hero-text">
            <h1>The easiest place to update and share your Connection</h1>
            <p className="hero-description">
              Help your followers discover everything you're sharing all over
              the internet, in one simple place. They'll thank you for it!
            </p>
            <Link to="/signup">
              <button className="get-started-button">Get Started</button>
            </Link>
          </div>
          <div className="hero-image">
            <img
              src={analytics}
              alt="Dashboard Preview"
              className="dashboard-preview"
            />
          </div>
        </section>

        <section className="share">
          <div className="share-content">
            <h2>Share limitless content in limitless ways</h2>
            <p>
              Connect your content in all its forms and help followers find more
              of what they're looking for. Your TikToks, Tweets, YouTube videos,
              music, articles, recipes, podcasts and more… It all comes together
              in one powerful place
            </p>
          </div>
          <div className="image-container">
            <img src={all} alt="Content sharing examples" />
          </div>
        </section>

        <section className="customer">
          <div className="customer-container">
            <div className="customer-left">
              <div>
                <h2>
                  Here's what our <span className="span-cus">customer </span>
                  has to says
                </h2>
                <button className="read-btn">Read customer stories</button>
              </div>
            </div>
            <div className="customer-right">
              <div>
                <img src={flower} alt="flower" />
              </div>
              <div className="right-content">
                <p>
                  "SPARK has transformed how I connect with my audience. Now all my content is in one place, making it easier for my followers to find everything!"
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="card-section">
          <div className="card-one">
            <div>
              <img src={card1} alt="card1" />
            </div>
            <div>
              <img src={card2} alt="card1" />
            </div>
          </div>
          <div className="card-two">
            <div>
              <img src={card3} alt="card1" />
            </div>
            <div>
              <img src={card4} alt="card1" />
            </div>
          </div>
        </section>

        <section className="integration-section">
          <h2 className="int-text">All Link Apps and Integrations</h2>

          <div className="int-one">
            <div className="one">
              <div>
                <img src={int1} alt="" />
              </div>
              <div>
                <h4>Audiomack</h4>
                <p>Add an Audiomack player to your Linktree</p>
              </div>
            </div>
            <div className="two">
              <div>
                <img src={int2} alt="" />
              </div>
              <div>
                <h4>Bandsintown</h4>
                <p>Drive ticket sales by listing your events</p>
              </div>
            </div>
            <div className="three">
              <div>
                <img src={int3} alt="" />
              </div>
              <div>
                <h4>Bonfire</h4>
                <p>Display and sell your custom merch</p>
              </div>
            </div>
          </div>

          <div className="int-two">
            <div className="four">
              <div>
                <img src={int4} alt="" />
              </div>
              <div>
                <h4>Books</h4>
                <p>Promote books on your Linktree</p>
              </div>
            </div>
            <div className="five">
              <div>
                <img src={int5} alt="" />
              </div>
              <div>
                <h4>Buy Me A Gift</h4>
                <p>Let visitors support you with a small gift</p>
              </div>
            </div>
            <div className="six">
              <div>
                <img src={int6} alt="" />
              </div>
              <div>
                <h4>Cameo</h4>
                <p>Make impossible fan connections possible</p>
              </div>
            </div>
          </div>
          <div className="int-three">
            <div className="seven">
              <div>
                <img src={int7} alt="" />
              </div>
              <div>
                <h4>Clubhouse</h4>
                <p>Let your community in on the conversation</p>
              </div>
            </div>
            <div className="eight">
              <div>
                <img src={int8} alt="" />
              </div>
              <div>
                <h4>Community</h4>
                <p>Build an SMS subscriber list</p>
              </div>
            </div>
            <div className="nine">
              <div>
                <img src={int9} alt="" />
              </div>
              <div>
                <h4>Contact Details</h4>
                <p>Easily share downloadable contact details</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-left-buttons">
            <div>
              <Link to="/signin" className="login-btn">
                Log in
              </Link>
            </div>
            <div>
              <Link to="/signup" className="sign-in-button">
                Sign up free
              </Link>
            </div>
          </div>
          <div className="footer-right">
            <div className="footer-column">
              <a href="#" className="link-header">
                About Spark
              </a>
              <a href="#">Blog</a>
              <a href="#">Press</a>
              <a href="#">Social Good</a>
              <a href="#">Contact</a>
            </div>

            <div className="footer-column">
              <a href="#" className="link-header">
                Careers
              </a>
              <a href="#">Getting Started</a>
              <a href="#">Features and How-Tos</a>
              <a href="#">FAQs</a>
              <a href="#">Report a Violation</a>
            </div>

            <div className="footer-column">
              <a href="#" className="link-header">
                Terms and Conditions
              </a>
              <a href="#">Privacy Policy</a>
              <a href="#">Cookie Notice</a>
              <a href="#">Trust Center</a>
            </div>
          </div>
        </div>

        <div className="acknowledge">
          <div className="ack-text">
            <p>
              We acknowledge the Traditional Custodians of the land on which our
              office stands, The Wurundjeri people of the Kulin Nation, and pay
              our respects to Elders past, present and emerging.
            </p>
          </div>

          <div className="icons">
            <div>
              <img src={twitter} alt="Twitter" />
            </div>
            <div>
              <img src={insta} alt="Instagram" />
            </div>
            <div>
              <img src={youtube} alt="YouTube" />
            </div>
            <div>
              <img src={tiktok} alt="TikTok" />
            </div>
            <div>
              <img src={fire} alt="Fire" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
