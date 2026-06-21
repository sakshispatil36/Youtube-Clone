"use client";

interface VideoProps {
  video: {
    filepath: string;
    videotitle: string;
  };
}

export default function Videopplayer({ video }: VideoProps) {
  // ✅ Fix: safely clean filepath and build correct URL
  const cleanPath = video?.filepath?.replace(/\\/g, "/").replace(/^uploads\//, "");
  const videoUrl = `https://youtube-clone-rcez.onrender.com/uploads/${cleanPath}`;

  return (
    <div className="w-full bg-black rounded-2xl overflow-hidden shadow-lg">
      <div className="relative w-full aspect-video flex items-center justify-center bg-black">
        <video
          controls
          className="w-full"
          src={videoUrl}
        />
      </div>

      <div className="px-4 py-3 bg-white">
        <h1 className="text-xl font-bold text-black line-clamp-2">
          {video?.videotitle}
        </h1>
      </div>
    </div>
  );
}