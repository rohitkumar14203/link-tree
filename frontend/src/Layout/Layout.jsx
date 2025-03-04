import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import MobileHeader from "../components/MobileHeader/MobileHeader";
import styles from "./Layout.module.css";

const Layout = () => {
  return (
    <div className={styles.layout}>
      <nav className={styles.sidebar}>
        <Sidebar />
      </nav>
      <MobileHeader />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
