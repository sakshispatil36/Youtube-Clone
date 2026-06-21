import {
  Home,
  Compass,
  PlaySquare,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
 
const Sidebar = () => {
  return (
    // ✅ Wider sidebar like real YouTube
    <aside className="w-72 bg-white border-r min-h-screen p-4">
      <nav className="space-y-1">
        {/* ✅ Bigger buttons with larger icons and text like real YouTube */}
        <Link href="/">
          <Button variant="ghost" className="w-full justify-start h-20 text-lg px-5 " style={{ fontSize: "30px" }}>
            <Home style={{ width: "28px", height: "28px" }} />
            Home
          </Button>
        </Link>
        <Link href="/explore">
          <Button variant="ghost" className="w-full justify-start h-20 text-lg px-5 " style={{ fontSize: "30px" }}>
            <Compass  style={{ width: "28px", height: "28px" }} />
            Explore
          </Button>
        </Link>
        <Link href="/subscriptions">
          <Button variant="ghost" className="w-full justify-start h-20 text-lg px-5 " style={{ fontSize: "30px" }}>
            <PlaySquare style={{ width: "28px", height: "28px" }}  />
            Subscriptions
          </Button>
        </Link>
      </nav>
    </aside>
  );
};
 
export default Sidebar;