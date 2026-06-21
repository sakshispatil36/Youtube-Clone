import React, { useEffect, useState, useRef, useCallback } from "react";
import Videocard from "./videocard";
import axiosInstance from "@/src/lib/axiosinstance";
import { useRouter } from "next/router";
 
// ✅ YouTube category ID mapping
const categoryMap: Record<string, string> = {
  "Music": "10",
  "Gaming": "20",
  "Movies": "30",
  "News": "25",
  "Sports": "17",
  "Technology": "28",
  "Comedy": "23",
  "Education": "27",
  "Science": "28",
  "Travel": "19",
  "Food": "26",
  "Fashion": "26",
};
 
// ✅ Accept activeCategory prop
const Videogrid = ({ activeCategory = "All" }: { activeCategory?: string }) => {
  const [videos, setvideo] = useState([]);
  const [loading, setloading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [youtubeVideos, setYoutubeVideos] = useState<any[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string>("");
  const [loadingMore, setLoadingMore] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
 
  const fetchYoutubeVideos = useCallback(async (pageToken: string = "") => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
      let url = "";
 
      if (activeCategory === "All") {
        url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&regionCode=IN&maxResults=50&key=${apiKey}${pageToken ? `&pageToken=${pageToken}` : ""}`;
      } else {
        url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(activeCategory)}&type=video&maxResults=50&regionCode=IN&key=${apiKey}${pageToken ? `&pageToken=${pageToken}` : ""}`;
      }
 
      const ytRes = await fetch(url);
      const ytData = await ytRes.json();
 
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const items = ytData.items?.map((item: any) => ({
        id: item.id?.videoId || item.id,
        snippet: item.snippet,
        statistics: item.statistics || { viewCount: "0" },
      })) || [];
 
      setYoutubeVideos((prev) => [...prev, ...items]);
      setNextPageToken(ytData.nextPageToken || "");
    } catch (error) {
      console.log(error);
    }
  }, [activeCategory]);
 
  // ✅ Fetch DB videos once
  useEffect(() => {
    const fetchvideo = async () => {
      try {
        const res = await axiosInstance.get("/video/getall");
        setvideo(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setloading(false);
      }
    };
    fetchvideo();
  }, []);
 
  // ✅ Refetch YouTube videos when category changes
  useEffect(() => {
    setYoutubeVideos([]);
    setNextPageToken("");
    setloading(true);
    fetchYoutubeVideos().finally(() => setloading(false));
  }, [activeCategory, fetchYoutubeVideos]);
 
  // ✅ Infinite scroll observer
  useEffect(() => {
    if (loadingMore) return;
    observerRef.current = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting && nextPageToken) {
          setLoadingMore(true);
          await fetchYoutubeVideos(nextPageToken);
          setLoadingMore(false);
        }
      },
      { threshold: 1.0 }
    );
    if (bottomRef.current) {
      observerRef.current.observe(bottomRef.current);
    }
    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [nextPageToken, loadingMore, fetchYoutubeVideos]);
 
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8 p-4">
        {loading ? (
          <div className="col-span-3 text-center py-10 text-lg text-gray-500">Loading...</div>
        ) : (
          <>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {videos?.map((video: any) => (
              <Videocard key={video._id} video={video} />
            ))}
 
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {youtubeVideos?.map((item: any, index: number) => (
              <div
                key={`${item.id}-${index}`}
                className="group cursor-pointer"
                onClick={() => router.push(`/watch/${item.id}`)}
              >
                <div className="space-y-3">
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.snippet.thumbnails.medium.url}
                      alt={item.snippet.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-base font-bold flex-shrink-0">
                      {item.snippet.channelTitle[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base line-clamp-2 group-hover:text-blue-600 leading-snug">
                        {item.snippet.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">{item.snippet.channelTitle}</p>
                      <p className="text-sm text-gray-500">
                        {parseInt(item.statistics.viewCount || "0").toLocaleString()} views
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
 
      <div ref={bottomRef} className="h-10 mt-4" />
      {loadingMore && (
        <div className="text-center py-6 text-gray-500 text-base">Loading more videos...</div>
      )}
    </div>
  );
};
 
export default Videogrid;
 