import User from "../modal/userModal.js";
import mongoose from "mongoose";
import asyncHandler from "../middleware/asyncHandler.js";

// Create Appearance model directly in this file since we don't have it as an ES module
const appearanceSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  layout: {
    type: String,
    default: 'stack'
  },
  buttonStyle: {
    type: String,
    default: 'fill'
  },
  buttonColor: {
    type: String,
    default: '#111111'
  },
  buttonFontColor: {
    type: String,
    default: '#ffffff'
  },
  font: {
    type: String,
    default: 'DM Sans'
  },
  textColor: {
    type: String,
    default: '#ffffff'
  },
  theme: {
    type: String,
    default: 'air-snow'
  }
}, {
  timestamps: true
});

const Appearance = mongoose.model('Appearance', appearanceSchema);

// @desc    Get user appearance settings
// @route   GET /api/appearance
// @access  Private
export const getAppearance = asyncHandler(async (req, res) => {
  try {
    // Find appearance settings for the logged-in user
    const appearance = await Appearance.findOne({ user: req.user._id });

    if (!appearance) {
      // If no settings exist yet, return default values
      return res.status(200).json({
        layout: "stack",
        buttonStyle: "fill",
        buttonColor: "#111111",
        buttonFontColor: "#ffffff",
        font: "DM Sans",
        textColor: "#ffffff",
        theme: "air-snow",
      });
    }

    res.status(200).json(appearance);
  } catch (error) {
    console.error("Error fetching appearance settings:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @desc    Save user appearance settings
// @route   POST /api/appearance
// @access  Private
export const saveAppearance = asyncHandler(async (req, res) => {
  try {
    const {
      layout,
      buttonStyle,
      buttonColor,
      buttonFontColor,
      font,
      textColor,
      theme,
    } = req.body;

    // Find and update appearance settings, or create if doesn't exist
    const appearance = await Appearance.findOneAndUpdate(
      { user: req.user._id },
      {
        layout,
        buttonStyle,
        buttonColor,
        buttonFontColor,
        font,
        textColor,
        theme,
        user: req.user._id,
      },
      { new: true, upsert: true }
    );

    res.status(200).json(appearance);
  } catch (error) {
    console.error("Error saving appearance settings:", error);
    res.status(500).json({ message: "Server error" });
  }
});
