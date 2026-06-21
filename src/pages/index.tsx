"use client";
import CategoryTabs from "@/src/components/category-tabs";
import Videogrid from "@/src/components/Videogrid";
import { useState } from "react";
 
export default function Home() {
  // ✅ activeCategory state here
  const [activeCategory, setActiveCategory] = useState("All");
 
  return (
    <main className="flex-1 p-4">
      <CategoryTabs activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
      {/* ✅ Removed Suspense — not needed since Videogrid is client component */}
      <Videogrid activeCategory={activeCategory} />
    </main>
  );
}
 