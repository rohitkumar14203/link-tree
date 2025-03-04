import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, reset } from "../../store/slices/authSlice";
import logo from "../../assets/Signup/singup_logo.png";
import "./Signin.css";
import { Link } from "react-router-dom";

const Signin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    email: "", // Changed from username to email
    password: "",
  });

  const { email, password } = formData; // Destructure email instead of username

  useEffect(() => {
    if (isSuccess || user) {
      navigate("/linktree-user");
    }
    return () => {
      dispatch(reset()); // Cleanup on unmount
    };
  }, [isSuccess, user, navigate, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData)); // No need to transform the data
  };

  // Update the input field
  return (
    <>
      <div className="signup-main-container">
        <div className="signup-left">
          <div>
            <img src={logo} alt="logo" />
          </div>
          <div>
            <h2>SPARK</h2>
          </div>
        </div>
        <div className="signup-middle">
          <div className="signup-text">
            <h2 className="signup-heading">Sign in to your Spark</h2>
          </div>
          <div className="form-content">
            <form className="signup-form" onSubmit={handleSubmit}>
              <div className="forms-fields">
                <div className="form-group">
                  <input
                    type="email" // Changed to email type
                    name="email" // Changed name to email
                    placeholder="Email"
                    className="form-input"
                    value={email} // Use email instead of username
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="form-input"
                    value={password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              {isError && <p className="error-message">{message}</p>}
              <div>
                <button
                  className="login-btn"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Log in"}
                </button>
              </div>
            </form>
            <div className="forgot">
              <div className="forgot-password">
                <p>Forgot password?</p>
              </div>
              <div className="dont-have">
                <p>Don't have an account?</p>

                <Link to="/signup">
                  <span className="signup-redirect">Sign up free</span>
                </Link>
              </div>
            </div>
            <div className="captcha">
              <p>
                This site is protected by reCAPTCHA and the{" "}
                <span>Google Privacy Policy</span> and{" "}
                <span>Terms of Service</span> apply
              </p>
            </div>
          </div>
        </div>
        <div className="signup-right"></div>
      </div>
    </>
  );
};

export default Signin;
