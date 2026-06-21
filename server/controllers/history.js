import video from "../Modals/video.js";
import History from "../Modals/history.js";
 
export const handlehistory = async (req, res) => {
  const { userId } = req.body;
  const { videoId } = req.params;
  try {
    const existing = await History.findOne({ viewer: userId, videoid: videoId });
    if (!existing) {
      await History.create({ viewer: userId, videoid: videoId });
    }
    await video.findByIdAndUpdate(videoId, { $inc: { views: 1 } });
    return res.status(200).json({ history: true });
  } catch (error) {
    console.error(" error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
 
// ✅ New: Save YouTube video to history
export const handleyoutubehistory = async (req, res) => {
  const { userId, youtubeid, title, thumbnail, channel } = req.body;
  try {
    const existing = await History.findOne({ viewer: userId, youtubeid: youtubeid });
    if (!existing) {
      await History.create({
        viewer: userId,
        youtubeid: youtubeid,
        isyoutube: true,
        title: title,
        thumbnail: thumbnail,
        channel: channel,
      });
    }
    return res.status(200).json({ history: true });
  } catch (error) {
    console.error(" error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
 
export const handleview = async (req, res) => {
  const { videoId } = req.params;
  try {
    await video.findByIdAndUpdate(videoId, { $inc: { views: 1 } });
  } catch (error) {
    console.error(" error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
 
export const getallhistoryVideo = async (req, res) => {
  const { userId } = req.params;
  try {
    const historyvideo = await History
      .find({ viewer: userId })
      .populate({
        path: "videoid",
        model: "videofiles",
      })
      .sort({ createdAt: -1 })
      .exec();
    return res.status(200).json(historyvideo);
  } catch (error) {
    console.error(" error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};