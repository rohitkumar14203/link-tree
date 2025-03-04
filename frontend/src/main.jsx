import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store/store";
import App from "./App";
import "./index.css";
import axios from "axios";
import { configureAxios } from "./utils/config";

// Configure axios with authentication
configureAxios(axios);

axios.interceptors.request.use(
  (config) => {
    console.log("Making request to:", config.url);
    console.log("Request headers:", JSON.stringify(config.headers));
    console.log("Request method:", config.method);
    console.log("WithCredentials:", config.withCredentials);
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor to debug responses
axios.interceptors.response.use(
  (response) => {
    console.log("Response received from:", response.config.url);
    console.log("Response status:", response.status);
    return response;
  },
  (error) => {
    console.error("Response error:", error.message);
    if (error.response) {
      console.error("Error status:", error.response.status);
      console.error("Error data:", error.response.data);
    } else if (error.request) {
      console.error("No response received. Request details:", {
        url: error.config?.url,
        method: error.config?.method,
        withCredentials: error.config?.withCredentials,
      });
    }
    return Promise.reject(error);
  }
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
