import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
 
interface RelatedVideosProps {
  videos: Array<{
    _id: string;
    videotitle: string;
    videochanel: string;
    views: number;
    createdAt: string;
    filepath?: string;
  }>;
  // ✅ Pass current video title/channel to find similar videos
  currentTitle?: string;
}
 
export default function RelatedVideos({ videos, currentTitle }: RelatedVideosProps) {
  const router = useRouter();
  const { id } = router.query;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [youtubeRelated, setYoutubeRelated] = useState<any[]>([]);
 
  const isYoutube = typeof id === "string" && id.length === 11;
 
  // ✅ Fetch related YouTube videos using search with title keywords
  // (relatedToVideoId is deprecated by YouTube API, so we search by title instead)
  useEffect(() => {
    if (!isYoutube || !id) return;
    const fetchRelated = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
        // ✅ Use first few words of title as search query, or fallback to "trending"
        const query = currentTitle
          ? currentTitle.split(" ").slice(0, 4).join(" ")
          : "trending";
 
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=15&key=${apiKey}`
        );
        const data = await res.json();
        // ✅ Filter out the currently playing video from results
        const filtered = (data.items || []).filter(
          (item: { id?: { videoId?: string } }) => item.id?.videoId !== id
        );
        setYoutubeRelated(filtered);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRelated();
  }, [id, isYoutube, currentTitle]);
 
  if (isYoutube) {
    if (youtubeRelated.length === 0) {
      return (
        <div className="text-center text-gray-400 text-sm py-8">
          Loading related videos...
        </div>
      );
    }
    return (
      <div className="space-y-3">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {youtubeRelated.map((item: any) => (
          <div
            key={item.id?.videoId}
            className="flex gap-2 group cursor-pointer"
            onClick={() => router.push(`/watch/${item.id?.videoId}`)}
          >
            <div className="relative w-40 aspect-video bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.snippet?.thumbnails?.medium?.url}
                alt={item.snippet?.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm line-clamp-2 group-hover:text-blue-600">
                {item.snippet?.title}
              </h3>
              <p className="text-xs text-gray-600 mt-1">{item.snippet?.channelTitle}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }
 
  if (!videos || videos.length === 0) return null;
 
  return (
    <div className="space-y-3">
      {videos.map((video) => {
        const cleanPath = video.filepath?.replace(/\\/g, "/").replace(/^uploads\//, "");
        const videoUrl = `https://youtube-clone-rcez.onrender.com/uploads/${cleanPath}`;
        return (
          <Link
            key={video._id}
            href={`/watch/${video._id}`}
            className="flex gap-2 group"
          >
            <div className="relative w-40 aspect-video bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
              <video
                src={videoUrl}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                preload="metadata"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm line-clamp-2 group-hover:text-blue-600">
                {video.videotitle}
              </h3>
              <p className="text-xs text-gray-600 mt-1">{video.videochanel}</p>
              <p className="text-xs text-gray-600">
                {video.views.toLocaleString()} views •{" "}
                {formatDistanceToNow(new Date(video.createdAt))} ago
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}