import video from "../Modals/video.js";
import like from "../Modals/like.js";
 
export const handlelike = async (req, res) => {
  const { userId } = req.body;
  const { videoId } = req.params;
  try {
    const exisitinglike = await like.findOne({
      viewer: userId,
      videoid: videoId,
    });
    if (exisitinglike) {
      await like.findByIdAndDelete(exisitinglike._id);
      await video.findByIdAndUpdate(videoId, { $inc: { Like: -1 } });
      return res.status(200).json({ liked: false });
    } else {
      await like.create({ viewer: userId, videoid: videoId });
      await video.findByIdAndUpdate(videoId, { $inc: { Like: 1 } });
      return res.status(200).json({ liked: true });
    }
  } catch (error) {
    console.error(" error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
 
// ✅ New: Toggle like for YouTube videos
export const handleyoutubelike = async (req, res) => {
  const { userId, youtubeid, title, thumbnail, channel } = req.body;
  try {
    const existing = await like.findOne({ viewer: userId, youtubeid: youtubeid });
    if (existing) {
      await like.findByIdAndDelete(existing._id);
      return res.status(200).json({ liked: false });
    } else {
      await like.create({
        viewer: userId,
        youtubeid: youtubeid,
        isyoutube: true,
        title: title,
        thumbnail: thumbnail,
        channel: channel,
      });
      return res.status(200).json({ liked: true });
    }
  } catch (error) {
    console.error(" error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
 
export const getallLikedVideo = async (req, res) => {
  const { userId } = req.params;
  try {
    const likevideo = await like
      .find({ viewer: userId })
      .populate({
        path: "videoid",
        model: "videofiles",
      })
      .sort({ createdAt: -1 })
      .exec();
    return res.status(200).json(likevideo);
  } catch (error) {
    console.error(" error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};