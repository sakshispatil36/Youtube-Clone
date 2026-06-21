import mongoose from "mongoose";
const likeschema = mongoose.Schema(
  {
    viewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    // ✅ Made optional for YouTube videos
    videoid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "videofiles",
    },
    // ✅ New fields for YouTube videos
    youtubeid: {
      type: String,
    },
    isyoutube: {
      type: Boolean,
      default: false,
    },
    title: String,
    thumbnail: String,
    channel: String,
    likedon: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);
 
export default mongoose.model("like", likeschema);
 