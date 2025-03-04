
import { useSelector } from 'react-redux';
import styles from './MobileHeader.module.css';
import logo from '../../assets/Signup/singup_logo.png';
import defaultAvatar from '../../assets/SocialMedia/user.png';
import { getProfileImageUrl } from '../../utils/config';

const MobileHeader = () => {
  const { user } = useSelector((state) => state.auth);
  
  // Get user's profile image or use default
  const getProfileImage = () => {
    if (user && user.profileImage) {
      return getProfileImageUrl(user.profileImage);
    }
    return defaultAvatar;
  };

  return (
    <div className={styles.mobileHeader}>
      <div className={styles.logoContainer}>
        <img src={logo} alt="Spark" className={styles.logo} />
        <span className={styles.logoText}>SPARK</span>
      </div>
      <div className={styles.userAvatar}>
        <img src={getProfileImage()} alt="User" />
      </div>
    </div>
  );
};

export default MobileHeader;