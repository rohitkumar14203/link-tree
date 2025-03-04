import asyncHandler from "../middleware/asyncHandler.js";
import Link from "../modal/linkModal.js";

// @desc    Create or Update user link profile
// @route   POST /api/links
// @access  Private
const updateLinkProfile = asyncHandler(async (req, res) => {
  const {
    profileTitle,
    bio,
    backgroundColor,
    links,
    shopLinks,
    socialLinks
  } = req.body;

  // Validate links to ensure app field is properly handled
  const processedLinks = links?.map(link => ({
    ...link,
    app: link.app || null // Ensure app field is included
  })) || [];

  const processedShopLinks = shopLinks?.map(item => ({
    ...item,
    app: item.app || null // Ensure app field is included
  })) || [];

  let linkProfile = await Link.findOne({ user: req.user._id });

  if (linkProfile) {
    // Update existing profile
    linkProfile.profileTitle = profileTitle || linkProfile.profileTitle;
    linkProfile.bio = bio || linkProfile.bio;
    linkProfile.backgroundColor = backgroundColor || linkProfile.backgroundColor;
    if (links) linkProfile.links = processedLinks;
    if (shopLinks) linkProfile.shopLinks = processedShopLinks;
    if (socialLinks) linkProfile.socialLinks = socialLinks;

    const updatedProfile = await linkProfile.save();
    res.json(updatedProfile);
  } else {
    // Create new profile
    linkProfile = await Link.create({
      user: req.user._id,
      profileTitle,
      bio,
      backgroundColor,
      links: processedLinks,
      shopLinks: processedShopLinks,
      socialLinks: socialLinks || {}
    });
    res.status(201).json(linkProfile);
  }
});
// Add these new controller functions to your existing linkController.js file

// Get public link profile by username
export const getPublicLinkProfile = async (req, res) => {
  try {
    const { username } = req.params;
    
    // Remove @ symbol if present in the username
    const cleanUsername = username.startsWith('@') ? username.substring(1) : username;
    
    // Find the profile by profileTitle (with or without @ symbol)
    const profile = await Link.findOne({
      $or: [
        { profileTitle: username },
        { profileTitle: `@${cleanUsername}` }
      ]
    });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Return the public profile data including app information
    res.json({
      profileTitle: profile.profileTitle,
      bio: profile.bio,
      backgroundColor: profile.backgroundColor,
      profileImage: profile.profileImage,
      links: profile.links,
      shopLinks: profile.shopLinks,
      socialLinks: profile.socialLinks
    });
  } catch (error) {
    console.error("Error fetching public profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// Track link clicks
export const trackLinkClick = async (req, res) => {
  try {
    const { linkId, isShopLink } = req.body;
    
    if (!linkId) {
      return res.status(400).json({ message: "Link ID is required" });
    }
    
    console.log(`Tracking ${isShopLink ? 'shop link' : 'link'} click for link ${linkId}`);
    
    // Find the profile containing the link
    const query = isShopLink 
      ? { "shopLinks._id": linkId }
      : { "links._id": linkId };
    
    const profile = await Link.findOne(query);
    
    if (!profile) {
      return res.status(404).json({ message: "Link not found" });
    }
    
    // Update the click count
    if (isShopLink) {
      // Find the shop link in the array
      const shopLinkIndex = profile.shopLinks.findIndex(
        link => link._id.toString() === linkId
      );
      
      if (shopLinkIndex === -1) {
        return res.status(404).json({ message: "Shop link not found in profile" });
      }
      
      // Increment the click count
      profile.shopLinks[shopLinkIndex].clickCount = 
        (profile.shopLinks[shopLinkIndex].clickCount || 0) + 1;
      
      await profile.save();
      console.log(`Shop link click count updated to: ${profile.shopLinks[shopLinkIndex].clickCount}`);
      return res.json({ 
        success: true, 
        clickCount: profile.shopLinks[shopLinkIndex].clickCount 
      });
    } else {
      // Find the link in the array
      const linkIndex = profile.links.findIndex(
        link => link._id.toString() === linkId
      );
      
      if (linkIndex === -1) {
        return res.status(404).json({ message: "Link not found in profile" });
      }
      
      // Increment the click count
      profile.links[linkIndex].clickCount = 
        (profile.links[linkIndex].clickCount || 0) + 1;
      
      await profile.save();
      console.log(`Link click count updated to: ${profile.links[linkIndex].clickCount}`);
      return res.json({ 
        success: true, 
        clickCount: profile.links[linkIndex].clickCount 
      });
    }
  } catch (error) {
    console.error("Error tracking link click:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// @desc    Get user link profile
// @route   GET /api/links
// @access  Private
const getLinkProfile = asyncHandler(async (req, res) => {
  const linkProfile = await Link.findOne({ user: req.user._id });
  if (linkProfile) {
    res.json(linkProfile);
  } else {
    res.status(404);
    throw new Error("Link profile not found");
  }
});

// @desc    Upload profile image
// @route   POST /api/links/upload-image
// @access  Private
const uploadProfileImage = asyncHandler(async (req, res) => {
  try {
    console.log('Upload request received');
    console.log('Request file:', req.file);
    
    if (!req.file) {
      console.log('No file in request');
      return res.status(400).json({ message: 'Please upload a file' });
    }

    console.log('File uploaded successfully:', req.file.filename);
    
    // Update user's profile image in the database
    const linkProfile = await Link.findOne({ user: req.user._id });
    if (linkProfile) {
      linkProfile.profileImage = req.file.filename;
      await linkProfile.save();
      console.log('Profile image updated in database');
    } else {
      // Create a new profile if one doesn't exist
      await Link.create({
        user: req.user._id,
        profileImage: req.file.filename
      });
      console.log('New profile created with image');
    }

    // Return the profile image filename
    res.json({
      message: 'File uploaded successfully',
      profileImage: req.file.filename
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      message: 'Error uploading file',
      error: error.message
    });
  }
});
export { updateLinkProfile, getLinkProfile, uploadProfileImage };