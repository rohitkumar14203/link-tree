import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Landing_Page/Home";
import Signup from "./pages/Signup/Signup";
import Signin from "./pages/Signin/Signin";
import LinktreeUser from "./pages/LinktreeUsername/LinktreeUsername";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./Layout/Layout";
import Link from "./pages/Link/Link";
import Settings from "./pages/Settings/Settings";
import Appearance from "./pages/Appearance/Appearance";
import LinkTree from "./pages/LinkTree/LinkTree";
import Analytics from "./pages/Analytics/Analytics";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/:username" element={<LinkTree />} />{" "}
        {/* Add the LinkTree route */}
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/linktree-username" element={<LinktreeUser />} />
          <Route element={<Layout />}>
            <Route path="/link" element={<Link />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/appearance" element={<Appearance />} />
            <Route path="/analytics" element={<Analytics />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
