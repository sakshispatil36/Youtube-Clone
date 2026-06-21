"use client";
 
import { useState, useEffect } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { MoreVertical, X, Clock } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import axiosInstance from "@/src/lib/axiosinstance";
import { useUser } from "@/src/lib/AuthContext";
import { useRouter } from "next/router";
 
export default function HistoryContent() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const router = useRouter();
 
  useEffect(() => {
    if (user) {
      loadHistory();
    } else {
      setLoading(true);
    }
  }, [user]);
 
  const loadHistory = async () => {
    if (!user) return;
    try {
      const historyData = await axiosInstance.get(`/history/${user?._id}`);
      setHistory(historyData.data);
    } catch (error) {
      console.error("Error loading history:", error);
    } finally {
      setLoading(false);
    }
  };
 
  if (loading) {
    return <div>Loading history...</div>;
  }
 
  const handleRemoveFromHistory = async (historyId: string) => {
    try {
      setHistory(history.filter((item) => item._id !== historyId));
    } catch (error) {
      console.error("Error removing from history:", error);
    }
  };
 
  if (!user) {
    return (
      <div className="text-center py-12">
        <Clock className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold mb-2">
          Keep track of what you watch
        </h2>
        <p className="text-gray-600">
          Watch history isnt viewable when signed out.
        </p>
      </div>
    );
  }
 
  if (history.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold mb-2">No watch history yet</h2>
        <p className="text-gray-600">Videos you watch will appear here.</p>
      </div>
    );
  }
 
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">{history.length} videos</p>
      </div>
 
      <div className="space-y-4">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {history.map((item: any) => {
 
          // ✅ YouTube video history item
          if (item.isyoutube) {
            return (
              <div
                key={item._id}
                className="flex gap-4 group cursor-pointer"
                onClick={() => router.push(`/watch/${item.youtubeid}`)}
              >
                <div className="relative w-40 aspect-video bg-gray-100 rounded overflow-hidden flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm line-clamp-2 group-hover:text-blue-600 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600">{item.channel}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Added {formatDistanceToNow(new Date(item.createdAt))} ago
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleRemoveFromHistory(item._id)}>
                      <X className="w-4 h-4 mr-2" />
                      Remove from watch history
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            );
          }
 
          // ✅ Your own DB video history item
          if (!item.videoid?._id) return null;
          const cleanPath = item.videoid?.filepath?.replace(/\\/g, "/").replace(/^uploads\//, "");
          const videoUrl = `http://localhost:5000/uploads/${cleanPath}`;
 
          return (
            <div key={item._id} className="flex gap-4 group">
              <Link href={`/watch/${item.videoid?._id}`} className="flex-shrink-0">
                <div className="relative w-40 aspect-video bg-gray-100 rounded overflow-hidden">
                  <video
                    src={videoUrl}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    preload="metadata"
                  />
                </div>
              </Link>
              <div className="flex-1 min-w-0">
                <Link href={`/watch/${item.videoid?._id}`}>
                  <h3 className="font-medium text-sm line-clamp-2 group-hover:text-blue-600 mb-1">
                    {item.videoid?.videotitle}
                  </h3>
                </Link>
                <p className="text-sm text-gray-600">{item.videoid?.videochanel}</p>
                <p className="text-sm text-gray-600">
                  {item.videoid?.views?.toLocaleString()} views •{" "}
                  {formatDistanceToNow(new Date(item.videoid?.createdAt))} ago
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Added {formatDistanceToNow(new Date(item.createdAt))} ago
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleRemoveFromHistory(item._id)}>
                    <X className="w-4 h-4 mr-2" />
                    Remove from watch history
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        })}
      </div>
    </div>
  );
}