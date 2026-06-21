import { Bell, Menu, Mic, Search, User, VideoIcon } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Input } from "./ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Channeldialogue from "./channeldialogue";
import { useRouter } from "next/router";
import { useUser } from "@/src/lib/AuthContext";

const Header = () => {
  const { user, logout, handlegooglesignin } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [isdialogeopen, setisdialogeopen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!searchQuery.trim()) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }
      try {
        const res = await fetch(
        `/api/suggestions?q=${encodeURIComponent(searchQuery)}`
      );
        const data = await res.json();
        setSuggestions(data[1]?.slice(0, 8) || []);
        setShowSuggestions(true);
      } catch {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeypress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      handleSearch(e as any);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    router.push(`/search?q=${encodeURIComponent(suggestion)}`);
  };

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white border-b sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <Menu className="w-6 h-6" />
        </Button>
        <Link href="/" className="flex items-center gap-1">
          <div className="bg-red-600 p-1.5 rounded">
            <svg width="35" height="35" viewBox="0 0 24 24" fill="white">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </div>
          <span className="text-3xl font-bold">YourTube</span>
          <span className="text-xs text-gray-400 ml-1">IN</span>
        </Link>
      </div>

      <form
        onSubmit={handleSearch}
        className="flex items-center gap-3 flex-1 max-w-3xl mx-8"
      >
        <div className="flex flex-1 relative" ref={suggestionsRef}>
          <div className="flex flex-1">
            <Input
              type="search"
              placeholder="Search"
              value={searchQuery}
              onKeyPress={handleKeypress}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              className="rounded-l-full border-r-0 focus-visible:ring-0 h-11 text-base px-5"
            />
            <Button
              type="submit"
              className="rounded-r-full px-7 h-11 bg-gray-100 hover:bg-gray-200 text-gray-600 border border-l-0"
            >
              <Search className="w-5 h-5" />
            </Button>
          </div>

          {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-10 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 mt-1 overflow-hidden py-2">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="flex items-center gap-4 px-6 py-3 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <Search className="w-5 h-5 text-gray-500 flex-shrink-0" />
                <span className="text-base text-gray-800">{suggestion}</span>
              </div>
            ))}
          </div>
        )}
        </div>

        <Button variant="ghost" size="icon" className="rounded-full w-11 h-11">
          <Mic className="w-5 h-5" />
        </Button>
      </form>

      <div className="flex items-center gap-2">
        {user ? (
          <>
            <Button variant="ghost" size="icon" className="w-10 h-10">
              <VideoIcon className="w-6 h-6" />
            </Button>
            <Button variant="ghost" size="icon" className="w-10 h-10">
              <Bell className="w-6 h-6" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.image} />
                    <AvatarFallback className="text-base">{user.name?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              {/* ✅ Fix: bigger dropdown card — increased width, padding, text size, icon spacing */}
              <DropdownMenuContent className="w-72 p-2" align="end" forceMount>
                {user?.channelname ? (
                  <DropdownMenuItem asChild className="text-base py-3 px-3 rounded-lg">
                    <Link href={`/channel/${user?._id}`}>Your channel</Link>
                  </DropdownMenuItem>
                ) : (
                  <div className="px-3 py-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full h-10 text-base"
                      onClick={() => setisdialogeopen(true)}
                    >
                      Create Channel
                    </Button>
                  </div>
                )}
                <DropdownMenuItem asChild className="text-base py-3 px-3 rounded-lg">
                  <Link href="/history">History</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="text-base py-3 px-3 rounded-lg">
                  <Link href="/liked">Liked videos</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="text-base py-3 px-3 rounded-lg">
                  <Link href="/watch-later">Watch later</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-base py-3 px-3 rounded-lg">
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <Button className="flex items-center gap-2 h-10 px-5 text-base" onClick={handlegooglesignin}>
            <User className="w-4 h-4" />
            Sign in
          </Button>
        )}{" "}
      </div>
      <Channeldialogue
        isopen={isdialogeopen}
        onclose={() => setisdialogeopen(false)}
        mode="create"
      />
    </header>
  );
};

export default Header;