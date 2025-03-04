import mongoose from "mongoose";

const linkSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    profileTitle: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      maxLength: 80,
    },
    backgroundColor: {
      type: String,
      default: "#000000",
    },
    profileImage: {
      type: String,
      default: "default-avatar.png",
    },
    links: [{
      title: String,
      url: String,
      app: String, // Added app field to store the selected application
      clickCount: {
        type: Number,
        default: 0
      }
    }],
    shopLinks: [{
      title: String,
      url: String,
     // Added app field to store the selected application
      clickCount: {
        type: Number,
        default: 0
      }
    }],
    socialLinks: {
      youtube: String,
      instagram: String,
      facebook: String, // Added facebook
      twitter: String   // Added twitter
    }
  },
  {
    timestamps: true,
  }
);

const Link = mongoose.model("Link", linkSchema);
export default Link;