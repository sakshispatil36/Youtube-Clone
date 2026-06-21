"use client";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback } from "./ui/avatar";
 
const videos = "/video/vdo.mp4";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function VideoCard({ video }: any) {
  const cleanPath = video?.filepath?.replace(/\\/g, "/").replace(/^uploads\//, "");
  const videoUrl = `http://localhost:5000/uploads/${cleanPath}`;
 
  return (
    <Link href={`/watch/${video?._id}`} className="group">
      <div className="space-y-3">
        {/* ✅ Bigger thumbnail - rounded-xl like real YouTube */}
        <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100">
          <video
            src={videoUrl}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            preload="metadata"
          />
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded font-medium">
            10:24
          </div>
        </div>
        <div className="flex gap-3">
          {/* ✅ Bigger avatar like real YouTube */}
          <Avatar className="w-10 h-10 flex-shrink-0">
            <AvatarFallback className="text-base font-semibold">{video?.videochanel[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            {/* ✅ Bigger title text like real YouTube */}
            <h3 className="font-semibold text-base line-clamp-2 group-hover:text-blue-600 leading-snug">
              {video?.videotitle}
            </h3>
            <p className="text-sm text-gray-600 mt-1">{video?.videochanel}</p>
            <p className="text-sm text-gray-500">
              {video?.views.toLocaleString()} views •{" "}
              {formatDistanceToNow(new Date(video?.createdAt))} ago
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}