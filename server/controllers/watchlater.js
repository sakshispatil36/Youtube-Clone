import watchlater from "../Modals/watchlater.js";
 
export const handlewatchlater = async (req, res) => {
  const { userId } = req.body;
  const { videoId } = req.params;
  try {
    const exisitingwatchlater = await watchlater.findOne({
      viewer: userId,
      videoid: videoId,
    });
    if (exisitingwatchlater) {
      await watchlater.findByIdAndDelete(exisitingwatchlater._id);
      return res.status(200).json({ watchlater: false });
    } else {
      await watchlater.create({ viewer: userId, videoid: videoId });
      return res.status(200).json({ watchlater: true });
    }
  } catch (error) {
    console.error(" error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
 
// ✅ New: Toggle watch later for YouTube videos
export const handleyoutubewatchlater = async (req, res) => {
  const { userId, youtubeid, title, thumbnail, channel } = req.body;
  try {
    const existing = await watchlater.findOne({ viewer: userId, youtubeid: youtubeid });
    if (existing) {
      await watchlater.findByIdAndDelete(existing._id);
      return res.status(200).json({ watchlater: false });
    } else {
      await watchlater.create({
        viewer: userId,
        youtubeid: youtubeid,
        isyoutube: true,
        title: title,
        thumbnail: thumbnail,
        channel: channel,
      });
      return res.status(200).json({ watchlater: true });
    }
  } catch (error) {
    console.error(" error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
 
export const getallwatchlater = async (req, res) => {
  const { userId } = req.params;
  try {
    const watchlatervideo = await watchlater
      .find({ viewer: userId })
      .populate({
        path: "videoid",
        model: "videofiles",
      })
      .sort({ createdAt: -1 })
      .exec();
    return res.status(200).json(watchlatervideo);
  } catch (error) {
    console.error(" error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
 