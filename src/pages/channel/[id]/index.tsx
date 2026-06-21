import ChannelHeader from "@/src/components/ChannelHeader";
import Channeltabs from "@/src/components/Channeltabs";
import ChannelVideos from "@/src/components/ChannelVideos";
import VideoUploader from "@/src/components/VideoUploader";
import { useUser } from "@/src/lib/AuthContext";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axiosInstance from "@/src/lib/axiosinstance";

const Index = () => {
  const router = useRouter();
  const { id } = router.query;

  const { user } = useUser();

  const [videos, setVideos] = useState([]);

  const channel = user;

  useEffect(() => {
    const fetchChannelVideos = async () => {
      try {
        const res = await axiosInstance.get("/video/getall");

        const filtered = res.data.filter(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (vid: any) => vid.uploader === id
        );

        setVideos(filtered);
      } catch (error) {
        console.log(error);
      }
    };

    if (id) {
      fetchChannelVideos();
    }
  }, [id]);

  return (
    <div className="flex-1 min-h-screen bg-white">
      <div className="max-w-full mx-auto">
        <ChannelHeader channel={channel} user={user} />

        <Channeltabs />

        <div className="px-4 pb-8">
          <VideoUploader
            channelId={id}
            channelName={channel?.channelname}
          />
        </div>

        <div className="px-4 pb-8">
          <ChannelVideos videos={videos} />
        </div>
      </div>
    </div>
  );
};

export default Index;