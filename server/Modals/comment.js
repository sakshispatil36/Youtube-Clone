import mongoose from "mongoose";
const commentschema = mongoose.Schema(
  {
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    videoid: {
      type: String,
      required: true,
    },
    isyoutube: {
      type: Boolean,
      default: false,
    },
    commentbody: { type: String },
    usercommented: { type: String },
    commentedon: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("comment", commentschema);