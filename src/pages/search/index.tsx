import SearchResult from "@/src/components/SearchResult";
import { useRouter } from "next/router";
import React from "react";
 
const Index = () => {
  const router = useRouter();
  // ✅ Get search query from URL like /search?q=something
  const { q } = router.query;
 
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-6 py-4">
        <SearchResult query={q as string || ""} />
      </div>
    </div>
  );
};
 
export default Index;