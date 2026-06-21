"use client";
import { Button } from "@/src/components/ui/button";

const categories = [
  "All", "Music", "Gaming", "Movies", "News", "Sports",
  "Technology", "Comedy", "Education", "Science", "Travel", "Food", "Fashion",
];

// ✅ Accept props from parent
interface CategoryTabsProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

export default function CategoryTabs({ activeCategory, setActiveCategory }: CategoryTabsProps) {
  return (
    <div className="flex gap-3 mb-6 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((category) => (
        <Button
          key={category}
          variant={activeCategory === category ? "default" : "secondary"}
          className="whitespace-nowrap px-5 py-2 text-xl rounded-full h-10 font-medium"
          onClick={() => setActiveCategory(category)}
        >
          {category}
        </Button>
      ))}
    </div>
  );
}