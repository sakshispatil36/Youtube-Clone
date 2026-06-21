import Comments from "@/src/components/Comments";
import RelatedVideos from "@/src/components/RelatedVideos";
import VideoInfo from "@/src/components/VideoInfo";
import Videopplayer from "@/src/components/Videopplayer";
import axiosInstance from "@/src/lib/axiosinstance";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useUser } from "@/src/lib/AuthContext";
import { ThumbsUp, ThumbsDown, Share2, Clock } from "lucide-react";

const Index = () => {
  const router = useRouter();
  const { user } = useUser();
  const { id } = router.query;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [videos, setvideo] = useState<any>(null);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [video, setvide] = useState<any>(null);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [youtubeData, setYoutubeData] = useState<any>(null);
  const [loading, setloading] = useState(true);

  const [ytLiked, setYtLiked] = useState(false);
  const [ytDisliked, setYtDisliked] = useState(false);
  const [ytSaved, setYtSaved] = useState(false);

  const isYoutube = typeof id === "string" && id.length === 11;

  useEffect(() => {
    const fetchvideo = async () => {
      if (!id || typeof id !== "string") return;

      if (isYoutube) {
        try {
          const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
          const ytRes = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${id}&key=${apiKey}`
          );
          const ytData = await ytRes.json();
          setYoutubeData(ytData.items?.[0] || null);
        } catch (error) {
          console.log(error);
        } finally {
          setloading(false);
        }
        return;
      }

      try {
        const res = await axiosInstance.get("/video/getall");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
        const video = res.data?.filter((vid: any) => vid._id === id);
        setvideo(video[0]);
        setvide(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setloading(false);
      }
    };

    fetchvideo();
  }, [id, isYoutube]);

  const historySaved = React.useRef(false);
  useEffect(() => {
    const saveHistory = async () => {
      if (!id || typeof id !== "string") return;
      if (!user?._id) return;
      if (isYoutube) return;
      if (historySaved.current) return;

      try {
        historySaved.current = true;
        await axiosInstance.post(`/history/${id}`, {
          userId: user._id,
        });
      } catch (error) {
        console.log("History save error:", error);
      }
    };
    saveHistory();
  }, [id, user, isYoutube]);

  const youtubeHistorySaved = React.useRef(false);
  useEffect(() => {
    const saveYoutubeHistory = async () => {
      if (!id || typeof id !== "string") return;
      if (!user?._id) return;
      if (!isYoutube) return;
      if (!youtubeData) return;
      if (youtubeHistorySaved.current) return;

      try {
        youtubeHistorySaved.current = true;
        await axiosInstance.post(`/history/youtube`, {
          userId: user._id,
          youtubeid: id,
          title: youtubeData?.snippet?.title,
          thumbnail: youtubeData?.snippet?.thumbnails?.medium?.url,
          channel: youtubeData?.snippet?.channelTitle,
        });
      } catch (error) {
        console.log("YouTube history save error:", error);
      }
    };
    saveYoutubeHistory();
  }, [id, user, isYoutube, youtubeData]);

  // ✅ Like now calls real API and saves to MongoDB
  const handleYtLike = async () => {
    if (!user) {
      alert("Please sign in to like videos");
      return;
    }
    if (!id || typeof id !== "string") return;
    try {
      const res = await axiosInstance.post(`/like/youtube`, {
        userId: user._id,
        youtubeid: id,
        title: youtubeData?.snippet?.title,
        thumbnail: youtubeData?.snippet?.thumbnails?.medium?.url,
        channel: youtubeData?.snippet?.channelTitle,
      });
      setYtLiked(res.data.liked);
      if (res.data.liked && ytDisliked) setYtDisliked(false);
    } catch (error) {
      console.log("Like error:", error);
    }
  };

  const handleYtDislike = () => {
    if (!user) {
      alert("Please sign in to dislike videos");
      return;
    }
    setYtDisliked((prev) => !prev);
    if (ytLiked) setYtLiked(false);
  };

  // ✅ Save now calls real API and saves to MongoDB
  const handleYtSave = async () => {
    if (!user) {
      alert("Please sign in to save videos");
      return;
    }
    if (!id || typeof id !== "string") return;
    try {
      const res = await axiosInstance.post(`/watch/youtube`, {
        userId: user._id,
        youtubeid: id,
        title: youtubeData?.snippet?.title,
        thumbnail: youtubeData?.snippet?.thumbnails?.medium?.url,
        channel: youtubeData?.snippet?.channelTitle,
      });
      setYtSaved(res.data.watchlater);
    } catch (error) {
      console.log("Watch later error:", error);
    }
  };

  const handleYtShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/watch/${id}`);
    alert("Link copied to clipboard!");
  };

  if (loading) {
    return <div>Loading..</div>;
  }

  if (isYoutube) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-[1800px] mx-auto px-6 py-4">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            <div className="xl:col-span-8 space-y-4">
              <div className="w-full bg-black rounded-2xl overflow-hidden shadow-lg">
                <div className="relative w-full aspect-video">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${id}?autoplay=1`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
                <div className="px-4 py-3 bg-white">
                  <h1 className="text-xl font-bold text-black line-clamp-2">
                    {youtubeData?.snippet?.title || "YouTube Video"}
                  </h1>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 space-y-3">
                <h2 className="text-lg font-semibold">{youtubeData?.snippet?.title}</h2>

                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center text-sm font-bold">
                      {youtubeData?.snippet?.channelTitle?.[0]}
                    </div>
                    <div>
                      <a
                        href={`https://www.youtube.com/channel/${youtubeData?.snippet?.channelId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium hover:text-blue-600 cursor-pointer"
                      >
                        {youtubeData?.snippet?.channelTitle}
                      </a>
                      <p className="text-sm text-gray-500">
                        {parseInt(youtubeData?.statistics?.viewCount || "0").toLocaleString()} views •{" "}
                        {youtubeData?.snippet?.publishedAt?.slice(0, 10)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center bg-gray-100 rounded-full overflow-hidden">
                      <button
                        onClick={handleYtLike}
                        className={`flex items-center gap-2 px-4 py-2 hover:bg-gray-200 ${ytLiked ? "text-blue-600" : ""}`}
                      >
                        <ThumbsUp className={`w-5 h-5 ${ytLiked ? "fill-blue-600" : ""}`} />
                        <span className="text-sm font-medium">
                          {parseInt(youtubeData?.statistics?.likeCount || "0").toLocaleString()}
                        </span>
                      </button>
                      <div className="w-px h-6 bg-gray-300" />
                      <button
                        onClick={handleYtDislike}
                        className={`px-4 py-2 hover:bg-gray-200 ${ytDisliked ? "text-blue-600" : ""}`}
                      >
                        <ThumbsDown className={`w-5 h-5 ${ytDisliked ? "fill-blue-600" : ""}`} />
                      </button>
                    </div>

                    <button
                      onClick={handleYtShare}
                      className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-2 text-sm font-medium"
                    >
                      <Share2 className="w-5 h-5" />
                      Share
                    </button>

                    <button
                      onClick={handleYtSave}
                      className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${
                        ytSaved ? "bg-gray-800 text-white" : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      <Clock className="w-5 h-5" />
                      {ytSaved ? "Saved" : "Save"}
                    </button>
                  </div>
                </div>

                <div className="bg-gray-100 rounded-lg p-3 mt-2">
                  <p className="text-sm text-gray-700 whitespace-pre-line line-clamp-4">
                    {youtubeData?.snippet?.description || "No description available"}
                  </p>
                </div>
              </div>

              <Comments videoId={id as string} />
            </div>

            <div className="xl:col-span-4 space-y-4">
              <RelatedVideos videos={video} currentTitle={youtubeData?.snippet?.title} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!videos) {
    return <div>Video not found</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1800px] mx-auto px-6 py-4">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-8 space-y-4">
            <Videopplayer video={videos} />
            <VideoInfo video={videos} />
            <Comments videoId={id as string} />
          </div>
          <div className="xl:col-span-4 space-y-4">
            <RelatedVideos videos={video} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;