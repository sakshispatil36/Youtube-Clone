import mongoose from "mongoose";
const historyschema = mongoose.Schema(
  {
    viewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    // ✅ For your own DB videos
    videoid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "videofiles",
    },
    // ✅ For YouTube videos
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
 
export default mongoose.model("history", historyschema);
 