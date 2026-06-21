import React, { useEffect, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import axiosInstance from "@/src/lib/axiosinstance";
import { useRouter } from "next/router";
 
const SearchResult = ({ query }: { query: string }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [dbVideos, setDbVideos] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [youtubeVideos, setYoutubeVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
 
  useEffect(() => {
    if (!query || !query.trim()) return;
 
    const fetchResults = async () => {
      setLoading(true);
      try {
        // ✅ Fetch from your own DB and filter by query
        const res = await axiosInstance.get("/video/getall");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const filtered = res.data?.filter((vid: any) =>
          vid.videotitle?.toLowerCase().includes(query.toLowerCase()) ||
          vid.videochanel?.toLowerCase().includes(query.toLowerCase())
        );
        setDbVideos(filtered || []);
 
        // ✅ Fetch from YouTube API by search query
        const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
        const ytRes = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=20&key=${apiKey}`
        );
        const ytData = await ytRes.json();
        setYoutubeVideos(ytData.items || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
 
    fetchResults();
  }, [query]);
 
  if (!query || !query.trim()) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">
          Enter a search term to find videos and channels.
        </p>
      </div>
    );
  }
 
  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Searching...</p>
      </div>
    );
  }
 
  const hasResults = dbVideos.length > 0 || youtubeVideos.length > 0;
 
  if (!hasResults) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">No results found</h2>
        <p className="text-gray-600">
          Try different keywords or remove search filters
        </p>
      </div>
    );
  }
 
  return (
    <div className="space-y-6">
 
      {/* ✅ Your own DB videos */}
      {dbVideos.length > 0 && (
        <div className="space-y-4">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {dbVideos.map((vid: any) => {
            const cleanPath = vid.filepath?.replace(/\\/g, "/").replace(/^uploads\//, "");
            const videoUrl = `https://youtube-clone-rcez.onrender.com/uploads/${cleanPath}`;
            return (
              <div key={vid._id} className="flex gap-4 group">
                <Link href={`/watch/${vid._id}`} className="flex-shrink-0">
                  <div className="relative w-80 aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <video
                      src={videoUrl}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
                      preload="metadata"
                    />
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1 rounded">
                      10:24
                    </div>
                  </div>
                </Link>
                <div className="flex-1 min-w-0 py-1">
                  <Link href={`/watch/${vid._id}`}>
                    <h3 className="font-medium text-lg line-clamp-2 group-hover:text-blue-600 mb-2">
                      {vid.videotitle}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <span>{vid.views.toLocaleString()} views</span>
                    <span>•</span>
                    <span>{formatDistanceToNow(new Date(vid.createdAt))} ago</span>
                  </div>
                  <Link
                    href={`/channel/${vid.uploader}`}
                    className="flex items-center gap-2 mb-2 hover:text-blue-600"
                  >
                    <Avatar className="w-6 h-6">
                      <AvatarImage src="/placeholder.svg?height=24&width=24" />
                      <AvatarFallback className="text-xs">
                        {vid.videochanel[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-gray-600">{vid.videochanel}</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
 
      {/* ✅ YouTube API search results */}
      {youtubeVideos.length > 0 && (
        <div className="space-y-4">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {youtubeVideos.map((item: any) => (
            <div
              key={item.id.videoId}
              className="flex gap-4 group cursor-pointer"
              onClick={() => router.push(`/watch/${item.id.videoId}`)}
            >
              <div className="flex-shrink-0">
                <div className="relative w-80 aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.snippet.thumbnails.medium.url}
                    alt={item.snippet.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
              </div>
              <div className="flex-1 min-w-0 py-1">
                <h3 className="font-medium text-lg line-clamp-2 group-hover:text-blue-600 mb-2">
                  {item.snippet.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <span>{formatDistanceToNow(new Date(item.snippet.publishedAt))} ago</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold">
                    {item.snippet.channelTitle[0]}
                  </div>
                  <span className="text-sm text-gray-600">{item.snippet.channelTitle}</span>
                </div>
                <p className="text-sm text-gray-700 line-clamp-2">
                  {item.snippet.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
 
      {hasResults && (
        <div className="text-center py-8">
          <p className="text-gray-600">
            Showing results for &quot;{query}&quot;
          </p>
        </div>
      )}
    </div>
  );
};
 
export default SearchResult;
 